// Type definitions for Content Model Builder

export interface FieldValidation {
    maxLength?: number;
    minLength?: number;
    isUnique?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
}

export interface ContentField {
    id: string;
    label: string;
    apiKey: string;
    type: 'text' | 'number' | 'image' | 'boolean' | 'date' | 'relation' | 'media' | 'location' | 'multiple';
    required: boolean;
    validations?: FieldValidation;
    options?: Record<string, any>; // For relation config, etc.
    isLocked?: boolean; // For SEO fields that shouldn't be deleted
}

export interface ContentModelData {
    name: string;
    apiSlug: string;
    description?: string;
    hasSeo: boolean;
    hasWorkflow?: boolean;
    hasMultiLang?: boolean;
    fields: ContentField[];
}

// SEO default fields
export const SEO_FIELDS: ContentField[] = [
    {
        id: 'seo_meta_title',
        label: 'Meta Title',
        apiKey: 'meta_title',
        type: 'text',
        required: true,
        isLocked: true,
        validations: { maxLength: 60 }
    },
    {
        id: 'seo_meta_description',
        label: 'Meta Description',
        apiKey: 'meta_description',
        type: 'text',
        required: true,
        isLocked: true,
        validations: { maxLength: 160 }
    },
    {
        id: 'seo_slug',
        label: 'URL Slug',
        apiKey: 'slug',
        type: 'text',
        required: true,
        isLocked: true,
        validations: { isUnique: true }
    }
];
