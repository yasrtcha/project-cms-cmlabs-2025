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
  };
  preset?: string; // "BUTTON" | "SEO_CARD" | "FAQ" | "TESTIMONIAL"
}

export async function createContentType({ name, slug, type, projectId, config, preset }: CreateTypeParams) {
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

    // Create Preset Fields if applicable
    if (preset && type === "COMPONENT") {
      const group = await prisma.builderFieldGroup.create({
        data: {
          name: "Main Content",
          contentTypeId: newContent.id,
          order: 0
        }
      });

      let fields: { name: string, apiId: string, type: string }[] = [];

      if (preset === "BUTTON") {
        fields = [
          { name: "Label", apiId: "label", type: "text" },
          { name: "URL", apiId: "url", type: "text" },
          { name: "Style", apiId: "style", type: "text" }
        ];
      } else if (preset === "SEO_CARD") {
        fields = [
          { name: "Title", apiId: "title", type: "text" },
          { name: "Description", apiId: "description", type: "text" },
          { name: "Image", apiId: "image", type: "media" }
        ];
      } else if (preset === "FAQ") {
        fields = [
          { name: "Question", apiId: "question", type: "text" },
          { name: "Answer", apiId: "answer", type: "text" }
        ];
      } else if (preset === "TESTIMONIAL") {
        fields = [
          { name: "Name", apiId: "name", type: "text" },
          { name: "Role", apiId: "role", type: "text" },
          { name: "Quote", apiId: "quote", type: "text" },
          { name: "Photo", apiId: "photo", type: "media" }
        ];
      }

      const fieldCreations = fields.map((f, index) =>
        prisma.builderField.create({
          data: {
            ...f,
            fieldGroupId: group.id,
            order: index,
            isRequired: false,
            isUnique: false
          }
        })
      );

      await prisma.$transaction(fieldCreations);
    }

    // 3. Refresh halaman agar sidebar langsung muncul nama baru
    revalidatePath(`/builder/${projectId}`);

    return { success: true, data: newContent };
  } catch (error) {
    console.error("Gagal membuat content type:", error);
    // Return error jika nama/slug sudah terpakai
    return { success: false, error: "Failed to create. Name or API ID might be taken." };
  }
}