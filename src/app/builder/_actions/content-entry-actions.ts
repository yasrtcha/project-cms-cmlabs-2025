'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. Ambil SATU Entry (Untuk Edit Form)
export async function getContentEntry(entryId: string) {
  try {
    // Coba cari langsung berdasarkan ID
    let entry = await prisma.contentEntry.findUnique({
      where: { id: entryId }
    });

    // Jika tidak ketemu, coba cari berdasarkan contentTypeId (Biasanya untuk Single Page)
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

// 2. Ambil BANYAK Entry (Untuk Tabel List) - Mendukung Pagination
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

// 3. Simpan Data Konten (Create / Update)
export async function saveContentEntry({
  contentTypeId,
  entryId, // Tambahan: ID entry (opsional jika create baru)
  data,
  seoData,
  status = "PUBLISHED"
}: {
  contentTypeId: string,
  entryId?: string,
  data: any,
  seoData?: any,
  status?: string
}) {
  try {
    // Cek tipe konten dulu (Single atau Collection)
    const contentType = await prisma.builderContentType.findUnique({
      where: { id: contentTypeId }
    });

    if (!contentType) throw new Error("Content Type not found");

    if (contentType.type === "SINGLE") {
      // LOGIKA SINGLE PAGE (Upsert: Update if exists, Create if not)
      const existing = await prisma.contentEntry.findFirst({
        where: { contentTypeId }
      });

      if (existing) {
        await prisma.contentEntry.update({
          where: { id: existing.id },
          data: { data, seoData, status }
        });
      } else {
        await prisma.contentEntry.create({
          data: { contentTypeId, data, seoData, status }
        });
      }
    } else {
      // LOGIKA MULTIPLE PAGE (Collection)
      if (entryId && entryId !== "new") {
        // Update Existing Item
        await prisma.contentEntry.update({
          where: { id: entryId },
          data: { data, seoData, status }
        });
      } else {
        // Create New Item
        await prisma.contentEntry.create({
          data: { contentTypeId, data, seoData, status }
        });
      }
    }

    revalidatePath(`/builder`);
    return { success: true };
  } catch (error) {
    console.error("Save Error:", error);
    return { success: false, error: "Failed to save content" };
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

// 5. Ambil Opsi Relasi
export async function getRelationOptions(targetContentTypeId: string) {
  try {
    const entries = await prisma.contentEntry.findMany({
      where: { contentTypeId: targetContentTypeId },
      select: { id: true, data: true }
    });

    const options = entries.map(entry => {
      const entryData = entry.data as any;
      // Coba tebak field mana yang jadi label (Name, Title, atau field pertama)
      const label = entryData.name || entryData.title || entryData.label || Object.values(entryData)[0] || "Untitled";
      return { value: entry.id, label: String(label) };
    });

    return { success: true, data: options };
  } catch (error) {
    return { success: false, data: [] };
  }
}
// 6. Ambil SEMUA Entry dari Content Type bertipe COMPONENT (Untuk Layout/Global)
export async function getGlobalComponentEntries(projectId: string) {
  try {
    const entries = await prisma.contentEntry.findMany({
      where: {
        contentType: {
          projectId,
          type: "COMPONENT"
        }
      },
      include: {
        contentType: true
      }
    });
    return { success: true, data: entries };
  } catch (error) {
    console.error("Fetch Global Components Error:", error);
    return { success: false, data: [] };
  }
}

