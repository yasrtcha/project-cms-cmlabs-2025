'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Tipe data yang diterima dari Modal
type CreateTypeParams = {
  name: string;
  slug?: string; // API ID (Opsional, kalau kosong kita generate)
  type: "SINGLE" | "COLLECTION" | "COMPONENT";
  projectId: string;
  // Config Advanced (Sesuai database baru)
  config: {
    hasSeo: boolean;
    hasWorkflow: boolean;
    hasMultiLang: boolean;
  }
}

export async function createContentType({ name, slug, type, projectId, config }: CreateTypeParams) {
  try {
    // 1. Bersihkan Slug/API ID
    // Jika user tidak isi slug, pakai name. Ubah jadi huruf kecil & ganti spasi jadi strip/underscore
    const finalSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')    // Hapus karakter aneh
      .replace(/[\s_-]+/g, '-')    // Ganti spasi/_ jadi -
      .replace(/^-+|-+$/g, '');    // Hapus - di awal/akhir

    // 2. Simpan ke Database
    const newContent = await prisma.builderContentType.create({
      data: {
        name,
        slug: finalSlug,
        type,
        projectId,
        // Masukkan data Advanced Configuration
        hasSeo: config.hasSeo,
        hasWorkflow: config.hasWorkflow,
        hasMultiLang: config.hasMultiLang
      }
    });

    // 3. Refresh halaman agar sidebar langsung muncul nama baru
    revalidatePath(`/builder/${projectId}`);

    return { success: true, data: newContent };
  } catch (error) {
    console.error("Gagal membuat content type:", error);
    // Return error jika nama/slug sudah terpakai
    return { success: false, error: "Failed to create. Name or API ID might be taken." };
  }
}