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
            include: {
                fieldValues: {
                    include: {
                        field: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Transform entries to a cleaner format (flat object) for the UI
        const flatEntries = entries.map(entry => {
            const values: Record<string, any> = {};
            entry.fieldValues.forEach((val: any) => {
                if (val.field && val.value) {
                    // Try to parse JSON values
                    try {
                        values[val.field.slug] = JSON.parse(val.value);
                    } catch {
                        values[val.field.slug] = val.value;
                    }
                }
            });

            return {
                id: entry.id,
                status: entry.status,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
                ...values
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
                fieldValues: {
                    include: {
                        field: true
                    }
                },
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

        const flatValues: Record<string, any> = {};
        entry.fieldValues.forEach((val: any) => {
            if (!val.field || !val.value) return;

            let parsedValue = val.value;
            // Attempt to parse JSON if it feels like JSON (for complex fields like media/relation)
            try {
                if (val.value && (val.value.startsWith('{') || val.value.startsWith('['))) {
                    parsedValue = JSON.parse(val.value);
                }
            } catch (e) { }
            flatValues[val.field.slug] = parsedValue;
        });

        return {
            success: true,
            data: { ...entry, values: flatValues },
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

        // 3. Prepare Transaction
        let targetEntryId = entryId;

        await prisma.$transaction(async (tx) => {
            // A. Create/Update Entry Record
            if (targetEntryId && targetEntryId !== 'new') {
                await tx.contentEntry.update({
                    where: { id: targetEntryId },
                    data: { updatedAt: new Date() }
                });
            } else {
                const newEntry = await tx.contentEntry.create({
                    data: {
                        contentTypeId: contentType.id,
                        createdById: defaultUserId,
                        status: 'draft',
                        locale: 'en',
                        // SEO fields if provided
                        seoTitle: data['meta_title'] as string || null,
                        seoDescription: data['meta_description'] as string || null,
                        seoSlug: data['slug'] as string || null,
                    }
                });
                targetEntryId = newEntry.id;
            }

            // B. Update/Create Values
            for (const [key, value] of Object.entries(data)) {
                // Skip SEO fields as they're stored directly on ContentEntry
                if (['meta_title', 'meta_description', 'slug'].includes(key)) continue;

                const field = allFields.find(f => f.apiId === key);
                if (!field) continue; // Skip unknown fields

                // Serialize value
                let storedValue = value;
                if (typeof value === 'object') {
                    storedValue = JSON.stringify(value);
                } else {
                    storedValue = String(value);
                }

                // Check if value exists
                const existingVal = await tx.fieldValue.findFirst({
                    where: {
                        entryId: targetEntryId,
                        fieldId: field.id,
                        locale: 'en'
                    }
                });

                if (existingVal) {
                    await tx.fieldValue.update({
                        where: { id: existingVal.id },
                        data: { value: storedValue }
                    });
                } else {
                    await tx.fieldValue.create({
                        data: {
                            entryId: targetEntryId!,
                            fieldId: field.id,
                            value: storedValue,
                            locale: 'en'
                        }
                    });
                }
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
