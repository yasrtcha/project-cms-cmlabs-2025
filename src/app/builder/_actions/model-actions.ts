'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ContentModelData } from "@/types/content-model"

export async function saveContentModel(projectId: string, data: ContentModelData, modelId?: string) {
    try {

        const existing = await prisma.builderContentType.findFirst({
            where: {
                projectId,
                slug: data.apiSlug,
                ...(modelId ? { NOT: { id: modelId } } : {})
            }
        });

        if (existing) {
            return { success: false, error: "A model with this slug already exists in this project" };
        }
        const fieldGroupData = {
            name: "Main Content",
            order: 0,
            fields: {
                create: data.fields.map((field, index) => ({
                    name: field.label,
                    apiId: field.apiKey,
                    type: field.type,
                    isRequired: field.required,
                    isUnique: field.validations?.isUnique || false,
                    options: (field.validations as any) || undefined,
                    order: index,
                }))
            }
        };

        if (modelId) {
            // UPDATE existing model
            // First, delete all existing field groups and fields (cascade will handle fields)
            await prisma.builderFieldGroup.deleteMany({
                where: { contentTypeId: modelId }
            });

            // Update the model and create new field groups
            await prisma.builderContentType.update({
                where: { id: modelId },
                data: {
                    name: data.name,
                    slug: data.apiSlug,
                    description: data.description,
                    hasSeo: data.hasSeo,
                    hasWorkflow: data.hasWorkflow || false,
                    hasMultiLang: data.hasMultiLang || false,
                    fieldGroups: {
                        create: [fieldGroupData]
                    }
                }
            });

            revalidatePath(`/builder/${projectId}`);
            return { success: true, id: modelId };

        } else {
            // CREATE new model
            const newModel = await prisma.builderContentType.create({
                data: {
                    projectId,
                    name: data.name,
                    slug: data.apiSlug,
                    description: data.description,
                    type: "multiple",
                    hasSeo: data.hasSeo,
                    hasWorkflow: data.hasWorkflow || false,
                    hasMultiLang: data.hasMultiLang || false,
                    fieldGroups: {
                        create: [fieldGroupData]
                    }
                }
            });

            revalidatePath(`/builder/${projectId}`);
            return { success: true, id: newModel.id };
        }

    } catch (error) {
        console.error("Error saving content model:", error);
        return { success: false, error: "Failed to save content model" };
    }
}

export async function getContentModel(modelId: string) {
    try {
        const model = await prisma.builderContentType.findUnique({
            where: { id: modelId },
            include: {
                fieldGroups: {
                    include: {
                        fields: {
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!model) {
            return { success: false, error: "Model not found" };
        }

        // Transform to ContentModelData format
        const allFields = model.fieldGroups.flatMap(group =>
            group.fields.map(field => ({
                id: field.id,
                label: field.name,
                apiKey: field.apiId,
                type: field.type as any,
                required: field.isRequired,
                validations: field.options ? {
                    ...field.options as any,
                    isUnique: field.isUnique
                } : { isUnique: field.isUnique },
                isLocked: field.apiId.startsWith('meta_') || field.apiId === 'slug'
            }))
        );

        const modelData: ContentModelData = {
            name: model.name,
            apiSlug: model.slug,
            description: model.description || undefined,
            hasSeo: model.hasSeo,
            hasWorkflow: model.hasWorkflow,
            hasMultiLang: model.hasMultiLang,
            fields: allFields
        };

        return { success: true, data: modelData };

    } catch (error) {
        console.error("Error fetching content model:", error);
        return { success: false, error: "Failed to fetch content model" };
    }
}
