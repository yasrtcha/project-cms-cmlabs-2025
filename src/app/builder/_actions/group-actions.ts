'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateGroupSchema = z.object({
    name: z.string().min(1),
    pageId: z.string().min(1),
    projectId: z.string().min(1),
});

export async function createFieldGroup(params: z.infer<typeof CreateGroupSchema>) {
    try {
        const { name, pageId, projectId } = CreateGroupSchema.parse(params);
        const lastGroup = await prisma.builderFieldGroup.findFirst({
            where: { contentTypeId: pageId },
            orderBy: { order: 'desc' }
        });
        const newOrder = lastGroup ? lastGroup.order + 1 : 0;

        const newGroup = await prisma.builderFieldGroup.create({
            data: {
                name,
                contentTypeId: pageId,
                order: newOrder
            }
        });

        revalidatePath(`/builder/${projectId}`);
        return { success: true, data: newGroup };

    } catch (error) {
        console.error("Error creating field group:", error);
        return { success: false, error: "Failed to create group" };
    }
}

export async function deleteFieldGroup(groupId: string, projectId: string) {
    try {
        await prisma.builderFieldGroup.delete({
            where: { id: groupId }
        });
        revalidatePath(`/builder/${projectId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting group:", error);
        return { success: false, error: "Failed to delete group" };
    }
}
