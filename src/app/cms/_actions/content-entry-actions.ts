'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type SaveEntryParams = {
    projectId: string;
    slug: string;
    entryId?: string; // If present, update. If null, create.
    data: Record<string, any>; // Key: apiId, Value: string/number/json
}

// ----------------------------------------------------------------------
// ACTIONS
// ----------------------------------------------------------------------

/**
 * Get all entries for a specific Content Type (by slug and projectId)
 */
export async function getContentEntries(projectId: string, slug: string) {
    try {
        const contentType = await prisma.builderContentType.findFirst({
            where: { projectId, slug },
            include: {
                fieldGroups: {
                    include: {
                        fields: true
                    }
                }
            }
        });

        if (!contentType) return { success: false, error: "Content Type not found" };

        // Note: ContentEntry uses contentTypeId, not builderContentTypeId
        // We need to find the corresponding ContentType first or use BuilderContentType ID directly
        // For now, assuming entries are linked to BuilderContentType
        const entries = await prisma.contentEntry.findMany({
            where: { contentTypeId: contentType.id },
            orderBy: { updatedAt: 'desc' }
        });

        // Transform entries to a cleaner format (flat object) for the UI
        const flatEntries = entries.map(entry => {
            const values = (entry.data as Record<string, any>) || {};
            const seoValues = (entry.seoData as Record<string, any>) || {};

            return {
                id: entry.id,
                status: entry.status,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
                ...values,
                ...seoValues
            };
        });

        return { success: true, data: flatEntries, model: contentType };

    } catch (error) {
        console.error("Error fetching entries:", error);
        return { success: false, error: "Failed to fetch entries" };
    }
}

/**
 * Get a single entry by ID
 */
export async function getSingleEntry(entryId: string) {
    try {
        const entry = await prisma.contentEntry.findUnique({
            where: { id: entryId },
            include: {
                contentType: {
                    include: {
                        fieldGroups: {
                            include: {
                                fields: { orderBy: { order: 'asc' } }
                            },
                            orderBy: { order: 'asc' }
                        }
                    }
                }
            }
        });

        if (!entry) return { success: false, error: "Entry not found" };

        const flatValues = (entry.data as Record<string, any>) || {};
        const seoValues = (entry.seoData as Record<string, any>) || {};

        return {
            success: true,
            data: { ...entry, values: { ...flatValues, ...seoValues } },
            model: entry.contentType
        };

    } catch (error) {
        console.error("Error fetching single entry:", error);
        return { success: false, error: "Failed to fetch entry" };
    }
}

/**
 * Save (Create or Update) an Entry
 */
export async function saveContentEntry({ projectId, slug, entryId, data }: SaveEntryParams) {
    try {
        // 1. Find Content Type
        const contentType = await prisma.builderContentType.findFirst({
            where: { projectId, slug },
            include: {
                fieldGroups: {
                    include: { fields: true }
                }
            }
        });

        if (!contentType) throw new Error("Content Type not found");

        // Flatten fields for easy lookup
        const allFields = contentType.fieldGroups.flatMap(g => g.fields);

        // 2. Get a default user ID (you should pass this from the session)
        // For now, we'll use a placeholder - you need to implement proper auth
        const defaultUserId = "default_user_id"; // TODO: Get from session

        // 3. Prepare Data
        const seoFields = ['meta_title', 'meta_description', 'slug'];
        const entryData: Record<string, any> = {};
        const seoData: Record<string, any> = {};

        for (const [key, value] of Object.entries(data)) {
            if (seoFields.includes(key)) {
                seoData[key] = value;
            } else {
                // Only save fields that exist in the content type definition
                const isDefined = allFields.some(f => f.apiId === key);
                if (isDefined) {
                    entryData[key] = value;
                }
            }
        }

        let targetEntryId = entryId;

        await prisma.$transaction(async (tx) => {
            if (targetEntryId && targetEntryId !== 'new') {
                await tx.contentEntry.update({
                    where: { id: targetEntryId },
                    data: {
                        data: entryData,
                        seoData: seoData,
                        updatedAt: new Date()
                    }
                });
            } else {
                const newEntry = await tx.contentEntry.create({
                    data: {
                        contentTypeId: contentType.id,
                        createdById: defaultUserId,
                        status: 'DRAFT',
                        data: entryData,
                        seoData: seoData,
                    }
                });
                targetEntryId = newEntry.id;
            }
        });

        revalidatePath(`/cms/${projectId}/content/${slug}`);
        return { success: true, id: targetEntryId };

    } catch (error) {
        console.error("Error saving entry:", error);
        return { success: false, error: "Failed to save entry" };
    }
}

/**
 * Delete Entry
 */
export async function deleteContentEntry(entryId: string, projectId: string, slug: string) {
    try {
        await prisma.contentEntry.delete({
            where: { id: entryId }
        });

        revalidatePath(`/cms/${projectId}/content/${slug}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting entry:", error);
        return { success: false, error: "Failed to delete" };
    }
}
