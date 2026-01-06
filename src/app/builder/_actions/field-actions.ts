'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// ----------------------------------------------------------------------
// TYPES & SCHEMAS
// ----------------------------------------------------------------------

const CreateFieldSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  pageId: z.string().min(1),
  projectId: z.string().min(1),
  fieldGroupId: z.string().optional(),
});

const UpdateFieldSchema = z.object({
  fieldId: z.string().min(1),
  projectId: z.string().min(1),
  // Optional updates
  name: z.string().optional(),
  apiId: z.string().optional(), // Advanced users might want to change this
  isRequired: z.boolean().optional(),
  isUnique: z.boolean().optional(),
  options: z.any().optional(), // For relation config, limits, etc.
});

// ----------------------------------------------------------------------
// ACTION 1: CREATE FIELD
// ----------------------------------------------------------------------
export async function createNewField(params: z.infer<typeof CreateFieldSchema>) {
  try {
    const { name, type, pageId, projectId, fieldGroupId } = CreateFieldSchema.parse(params);

    // 1. Generate API ID (clean slug)
    const apiId = name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '_')
      .replace(/^-+|-+$/g, '');

    // 2. Tentukan Group
    let groupId = fieldGroupId;

    if (!groupId) {
      // Cari Group "Main Content" (Default group)
      let group = await prisma.builderFieldGroup.findFirst({
        where: { contentTypeId: pageId, name: "Main Content" }
      });

      if (!group) {
        // Fallback: cari group apapun atau buat baru
        const existingGroup = await prisma.builderFieldGroup.findFirst({
          where: { contentTypeId: pageId }
        });

        if (existingGroup) {
          group = existingGroup;
        } else {
          group = await prisma.builderFieldGroup.create({
            data: {
              name: "Main Content",
              contentTypeId: pageId,
              order: 0
            }
          });
        }
      }
      groupId = group.id;
    }

    // 3. Simpan ke Database
    // Hitung order terakhir
    const lastField = await prisma.builderField.findFirst({
      where: { fieldGroupId: groupId },
      orderBy: { order: 'desc' }
    });
    const newOrder = lastField ? lastField.order + 1 : 0;

    const newField = await prisma.builderField.create({
      data: {
        name,
        apiId,
        type,
        fieldGroupId: groupId as string,
        order: newOrder,
        isRequired: false,
        isUnique: false
      }
    });

    revalidatePath(`/builder/${projectId}`);
    return { success: true, data: newField };

  } catch (error) {
    console.error("Error creating field:", error);
    return { success: false, error: "Failed to create field" };
  }
}

// ----------------------------------------------------------------------
// ACTION 2: UPDATE FIELD (Validation, Name, Options)
// ----------------------------------------------------------------------
export async function updateField(params: z.infer<typeof UpdateFieldSchema>) {
  try {
    const { fieldId, projectId, ...updates } = UpdateFieldSchema.parse(params);

    await prisma.builderField.update({
      where: { id: fieldId },
      data: {
        ...updates
      }
    });

    revalidatePath(`/builder/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating field:", error);
    return { success: false, error: "Failed to update field" };
  }
}

// ----------------------------------------------------------------------
// ACTION 3: DELETE FIELD
// ----------------------------------------------------------------------
export async function deleteField(fieldId: string, projectId: string) {
  try {
    if (!fieldId || !projectId) throw new Error("Missing ID");

    await prisma.builderField.delete({
      where: { id: fieldId }
    });

    revalidatePath(`/builder/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting field:", error);
    return { success: false, error: "Failed to delete field" };
  }
}

// ----------------------------------------------------------------------
// ACTION 4: REORDER FIELDS
// ----------------------------------------------------------------------
export async function reorderFields(items: { id: string; order: number }[], projectId: string) {
  try {
    const transaction = items.map((item) =>
      prisma.builderField.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );

    await prisma.$transaction(transaction);

    revalidatePath(`/builder/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder fields:", error);
    return { success: false, error: "Failed to reorder" };
  }
}
