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
    console.log("Creating content type with params:", { name, slug, type, projectId, config, preset });

    // 1. Resolve Project ID (handle if projectId is a slug)
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: projectId }, { slug: projectId }]
      }
    });

    if (!project) {
      return { success: false, error: `Project not found: ${projectId}` };
    }

    const actualProjectId = project.id;
    console.log("Resolved project ID:", actualProjectId);

    // 2. Bersihkan Slug/API ID
    // Jika user tidak isi slug, pakai name. Ubah jadi huruf kecil & ganti spasi jadi strip/underscore
    const finalSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')    // Hapus karakter aneh
      .replace(/[\s_-]+/g, '-')    // Ganti spasi/_ jadi -
      .replace(/^-+|-+$/g, '');    // Hapus - di awal/akhir

    console.log("Final slug generated:", finalSlug);

    // 3. Cek apakah slug sudah terpakai di project ini
    const existing = await prisma.builderContentType.findFirst({
      where: {
        projectId: actualProjectId,
        slug: finalSlug
      }
    });

    if (existing) {
      return { success: false, error: "API ID is already taken in this project." };
    }

    // 4. Simpan ke Database
    const newContent = await prisma.builderContentType.create({
      data: {
        name,
        slug: finalSlug,
        type,
        projectId: actualProjectId,
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

      let fields: { name: string, apiId: string, type: string, options?: any }[] = [];

      if (preset === "NAVBAR") {
        fields = [
          { name: "Logo", apiId: "logo", type: "media" },
          {
            name: "Menu Links",
            apiId: "menu_links",
            type: "multiple",
            options: {
              subFields: [
                { name: "Label", apiId: "label", type: "text" },
                { name: "URL", apiId: "url", type: "text" }
              ]
            }
          }
        ];
      } else if (preset === "HEADER") {
        fields = [
          { name: "Title", apiId: "title", type: "text" },
          { name: "Subtitle", apiId: "subtitle", type: "text" },
          { name: "Background Image", apiId: "background", type: "media" },
          { name: "CTA Label", apiId: "cta_label", type: "text" },
          { name: "CTA URL", apiId: "cta_url", type: "text" }
        ];
      } else if (preset === "FOOTER") {
        fields = [
          { name: "Copyright Text", apiId: "copyright", type: "text" },
          {
            name: "Social Media",
            apiId: "socials",
            type: "multiple",
            options: {
              subFields: [
                { name: "Platform", apiId: "platform", type: "text" },
                { name: "URL", apiId: "url", type: "text" },
                { name: "Icon", apiId: "icon", type: "media" }
              ]
            }
          }
        ];
      } else if (preset === "BUTTON") {
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
            name: f.name,
            apiId: f.apiId,
            type: f.type,
            options: f.options || {},
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
  } catch (error: any) {
    console.error("Gagal membuat content type:", error);
    // Return error jika nama/slug sudah terpakai
    return { success: false, error: `Failed to create: ${error.message || "Name or API ID might be taken."}` };
  }
}

// Update attached components for a Page
export async function savePageComponents(pageId: string, componentIds: string[]) {
  try {
    await prisma.builderContentType.update({
      where: { id: pageId },
      data: {
        usedComponents: {
          set: componentIds.map(id => ({ id }))
        }
      } as any
    });


    revalidatePath(`/builder`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update page components:", error);
    return { success: false, error: "Failed to update components" };
  }
}

export async function saveSectionsOrder(pageId: string, sectionsOrder: any[]) {
  try {
    console.log("Saving sections order for page:", pageId, sectionsOrder);
    await prisma.builderContentType.update({
      where: { id: pageId },
      data: {
        sectionsOrder: sectionsOrder
      } as any
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error("Failed to save sections order:", error);
    return { success: false, error: "Failed to save order" };
  }
}
