'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ----------------------------------------------------------------------
// FUNCTION 1: MEMBUAT FIELD BARU
// ----------------------------------------------------------------------
export async function createNewField({ name, type, pageId, projectId }: any) {
  try {
    // 1. Generate API ID
    const apiId = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

    // 2. Cari Group "Main Content" (Atau buat jika belum ada)
    // Field harus punya rumah (Group), jadi kita pastikan ada group default.
    let group = await prisma.builderFieldGroup.findFirst({
      where: { contentTypeId: pageId }
    });

    if (!group) {
      group = await prisma.builderFieldGroup.create({
        data: {
          name: "Main Content",
          contentTypeId: pageId,
          order: 0
        }
      });
    }

    // 3. Simpan ke tabel BARU (BuilderField)
    await prisma.builderField.create({
      data: {
        name,
        apiId,
        type,
        fieldGroupId: group.id, // Masukkan ke dalam group
        isRequired: false,
        isUnique: false
      }
    });

    // 4. Refresh halaman
    revalidatePath(`/builder/${projectId}`);
    return { success: true };
    
  } catch (error) {
    console.error("Error creating field:", error);
    return { success: false };
  }
}

// ----------------------------------------------------------------------
// FUNCTION 2: UPDATE URUTAN FIELD (DRAG & DROP)
// ----------------------------------------------------------------------
export async function reorderFields(items: { id: string; order: number }[], projectId: string) {
  try {
    // Jalankan update secara massal menggunakan transaction
    const transaction = items.map((item) =>
      prisma.builderField.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );

    await prisma.$transaction(transaction);
    
    // Refresh halaman agar urutan tetap tersimpan saat reload
    revalidatePath(`/builder/${projectId}`);
    return { success: true };
    
  } catch (error) {
    console.error("Failed to reorder fields:", error);
    return { success: false, error: "Failed to reorder" };
  }
}