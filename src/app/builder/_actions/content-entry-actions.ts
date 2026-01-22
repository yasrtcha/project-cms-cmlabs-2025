'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. Ambil SATU Entry
export async function getContentEntry(entryId: string) {
  try {
    let entry = await prisma.contentEntry.findUnique({
      where: { id: entryId }
    });

    if (!entry) {
      entry = await prisma.contentEntry.findFirst({
        where: { contentTypeId: entryId },
        orderBy: { createdAt: 'desc' }
      });
    }

    return { success: true, data: entry };
  } catch (error) {
    return { success: false, error: "Failed to fetch content" };
  }
}

// 2. Ambil BANYAK Entry
export async function getContentEntries(contentTypeId: string, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      prisma.contentEntry.findMany({
        where: { contentTypeId },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.contentEntry.count({
        where: { contentTypeId }
      })
    ]);

    return {
      success: true,
      data: entries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    return { success: false, data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
}

// 3. Simpan Data Konten (DENGAN VALIDASI & WORKFLOW LOGIC)
export async function saveContentEntry({
  contentTypeId,
  entryId,
  data,
  seoData,
  status
}: {
  contentTypeId: string,
  entryId?: string,
  data: any,
  seoData?: any,
  status?: string
}) {
  try {
    // A. Fetch Schema untuk Validasi
    const contentType = await prisma.builderContentType.findUnique({
      where: { id: contentTypeId },
      include: { 
        fieldGroups: { include: { fields: true } },
        workflow: { include: { steps: { orderBy: { order: 'asc' } } } } 
      }
    });

    if (!contentType) throw new Error("Content Type not found");

    // B. VALIDASI DATA WAJIB (Required Fields)
    // Kita kumpulkan semua field dari semua group
    const requiredFields = contentType.fieldGroups.flatMap(g => g.fields).filter(f => f.isRequired);
    
    for (const field of requiredFields) {
        const val = data[field.apiId];
        // Cek jika null, undefined, atau string kosong
        if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
            return { success: false, error: `Field "${field.name}" is required.` };
        }
    }

    // C. LOGIKA WORKFLOW (Status Otomatis)
    let finalStatus = status;
    let currentStepId = undefined;

    // Jika user tidak mengirim status spesifik (misal dari tombol Save biasa), kita tentukan:
    if (!finalStatus || finalStatus === "PUBLISHED") {
        if (contentType.hasWorkflow && contentType.workflow && contentType.workflow.isActive) {
            // JIKA ADA WORKFLOW -> Paksa jadi DRAFT / IN_REVIEW
            finalStatus = "DRAFT"; 
            
            // Set ke step pertama workflow jika konten baru
            if ((!entryId || entryId === "new") && contentType.workflow.steps.length > 0) {
                currentStepId = contentType.workflow.steps[0].id;
            }
        } else {
            // JIKA TIDAK ADA WORKFLOW -> Boleh Langsung Publish
            finalStatus = "PUBLISHED";
        }
    }

    // D. Simpan ke Database
    // Kita dukung SINGLE page dan COMPONENT sebagai data tunggal (Singleton)
    if (contentType.type === "SINGLE" || contentType.type === "COMPONENT") {
       const existing = await prisma.contentEntry.findFirst({ where: { contentTypeId } });
       
       if (existing) {
          await prisma.contentEntry.update({
             where: { id: existing.id },
             data: { 
                data, 
                seoData, 
                status: finalStatus, 
                // Jika konten di-reset ke DRAFT (misal diedit ulang), kita mungkin mau reset step juga
                ...(currentStepId ? { currentStepId } : {}) 
             }
          });
       } else {
          await prisma.contentEntry.create({
             data: { contentTypeId, data, seoData, status: finalStatus, currentStepId }
          });
       }
    } else {
       // COLLECTION (Multiple Entries)
       if (entryId && entryId !== "new") {
          await prisma.contentEntry.update({
             where: { id: entryId },
             data: { 
                data, 
                seoData, 
                status: finalStatus 
                // Edit existing biasanya tidak mereset workflow step, kecuali diminta
             }
          });
       } else {
          await prisma.contentEntry.create({
             data: { contentTypeId, data, seoData, status: finalStatus, currentStepId }
          });
       }
    }

    revalidatePath(`/builder`);
    return { success: true };
  } catch (error: any) {
    console.error("Save Error:", error);
    return { success: false, error: error.message || "Failed to save content" };
  }
}

// 4. Hapus Entry
export async function deleteContentEntry(entryId: string) {
  try {
    await prisma.contentEntry.delete({
      where: { id: entryId }
    });
    revalidatePath(`/builder`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete" };
  }
}

// 5. Ambil Opsi Relasi (DENGAN PENCARIAN ASYNC)
export async function getRelationOptions(targetContentTypeId: string, query: string = "") {
  try {
    // Kita ambil data agak banyak (50) agar pencarian terasa responsif
    const entries = await prisma.contentEntry.findMany({
      where: { 
        contentTypeId: targetContentTypeId,
        // Di aplikasi produksi, pencarian JSON dilakukan di level DB. 
        // Di sini kita fetch lalu filter di memori untuk simplisitas Skripsi.
      },
      orderBy: { updatedAt: 'desc' },
      take: 50, // Batasi 50 data saja agar ringan
      select: { id: true, data: true }
    });

    // Mapping data menjadi { value, label }
    const options = entries.map(entry => {
      const entryData = entry.data as any;
      // Deteksi otomatis label (Name/Title/Headline)
      const label = entryData.name || entryData.title || entryData.label || entryData.headline || Object.values(entryData)[0] || "Untitled";
      return { value: entry.id, label: String(label) };
    });

    // Filter berdasarkan query pencarian
    if (query) {
      const lowerQuery = query.toLowerCase();
      return { 
        success: true, 
        data: options.filter(opt => opt.label.toLowerCase().includes(lowerQuery)) 
      };
    }

    return { success: true, data: options };
  } catch (error) {
    return { success: false, data: [] };
  }
}