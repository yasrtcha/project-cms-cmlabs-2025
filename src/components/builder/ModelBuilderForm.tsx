"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Plus, Trash2, GripVertical, Settings, AlertCircle,
    CheckCircle, Globe, Workflow, Languages, X, Save
} from "lucide-react";
import { ContentField, SEO_FIELDS, ContentModelData } from "@/types/content-model";
import { cn } from "@/lib/utils";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const fieldSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Label is required"),
    apiKey: z.string()
        .min(1, "API Key is required")
        .regex(/^[a-z][a-z0-9_]*$/, "API Key must start with lowercase letter and contain only lowercase, numbers, and underscores"),
    type: z.enum(['text', 'number', 'image', 'boolean', 'date', 'relation', 'media', 'location', 'multiple']),
    required: z.boolean(),
    validations: z.object({
        maxLength: z.number().optional(),
        minLength: z.number().optional(),
        isUnique: z.boolean().optional(),
        pattern: z.string().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
    }).optional(),
    options: z.record(z.string(), z.any()).optional(),
    isLocked: z.boolean().optional(),
});

const modelSchema = z.object({
    name: z.string().min(1, "Model name is required"),
    apiSlug: z.string()
        .min(1, "API Slug is required")
        .regex(/^[a-z][a-z0-9-]*$/, "Slug must start with lowercase and contain only lowercase, numbers, and hyphens"),
    description: z.string().optional(),
    hasSeo: z.boolean(),
    hasWorkflow: z.boolean().optional(),
    hasMultiLang: z.boolean().optional(),
    fields: z.array(fieldSchema)
}).refine((data) => {
    // Check for duplicate apiKeys
    const apiKeys = data.fields.map(f => f.apiKey);
    const uniqueKeys = new Set(apiKeys);
    return apiKeys.length === uniqueKeys.size;
}, {
    message: "Duplicate API Keys found. Each field must have a unique API Key.",
    path: ["fields"]
});

type ModelFormData = z.infer<typeof modelSchema>;

// ============================================================================
// FIELD TYPE OPTIONS
// ============================================================================

const FIELD_TYPES = [
    { value: 'text', label: 'Text', icon: '📝' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'boolean', label: 'Boolean', icon: '✓' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'image', label: 'Image', icon: '🖼️' },
    { value: 'media', label: 'Media', icon: '📎' },
    { value: 'relation', label: 'Relation', icon: '🔗' },
    { value: 'location', label: 'Location', icon: '📍' },
    { value: 'multiple', label: 'Multiple', icon: '📚' },
] as const;

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface ModelBuilderFormProps {
    initialData?: Partial<ContentModelData>;
    onSubmit: (data: ModelFormData) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ModelBuilderForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}: ModelBuilderFormProps) {

    const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty }
    } = useForm<ModelFormData>({
        resolver: zodResolver(modelSchema),
        defaultValues: {
            name: initialData?.name || "",
            apiSlug: initialData?.apiSlug || "",
            description: initialData?.description || "",
            hasSeo: initialData?.hasSeo || false,
            hasWorkflow: initialData?.hasWorkflow || false,
            hasMultiLang: initialData?.hasMultiLang || false,
            fields: initialData?.fields || [],
        }
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "fields"
    });

    const watchName = watch("name");
    const watchHasSeo = watch("hasSeo");

    // Auto-generate slug from name
    useEffect(() => {
        if (watchName && !initialData?.apiSlug) {
            const slug = watchName
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setValue("apiSlug", slug);
        }
    }, [watchName, setValue, initialData]);

    // Handle SEO toggle
    useEffect(() => {
        const currentFields = watch("fields");
        const hasSeoFields = currentFields.some(f => f.isLocked);

        if (watchHasSeo && !hasSeoFields) {
            // Add SEO fields
            SEO_FIELDS.forEach(field => append(field));
        } else if (!watchHasSeo && hasSeoFields) {
            // Remove SEO fields
            const nonSeoFields = currentFields.filter(f => !f.isLocked);
            setValue("fields", nonSeoFields);
        }
    }, [watchHasSeo]);

    const handleAddField = () => {
        const newField: ContentField = {
            id: `field_${Date.now()}`,
            label: "",
            apiKey: "",
            type: "text",
            required: false,
            isLocked: false,
        };
        append(newField);
        setExpandedFieldId(newField.id);
    };

    const handleRemoveField = (index: number) => {
        const field = fields[index];
        if (field.isLocked) {
            alert("SEO fields cannot be deleted. Disable SEO feature to remove them.");
            return;
        }
        remove(index);
    };

    const handleMoveField = (fromIndex: number, toIndex: number) => {
        move(fromIndex, toIndex);
    };

    const generateApiKey = (label: string, index: number) => {
        const apiKey = label
            .toLowerCase()
            .trim()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '_');
        setValue(`fields.${index}.apiKey`, apiKey);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-8 p-6">

            {/* ========== BASIC INFO SECTION ========== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Basic Information
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Model Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Model Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder="e.g., Blog Post, Product, Landing Page"
                            className={cn(
                                "w-full px-4 py-3 rounded-lg border-2 transition-colors",
                                errors.name
                                    ? "border-red-300 focus:border-red-500"
                                    : "border-gray-200 focus:border-blue-500"
                            )}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* API Slug */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            API Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("apiSlug")}
                            type="text"
                            placeholder="e.g., blog-post, product"
                            className={cn(
                                "w-full px-4 py-3 rounded-lg border-2 font-mono text-sm transition-colors",
                                errors.apiSlug
                                    ? "border-red-300 focus:border-red-500"
                                    : "border-gray-200 focus:border-blue-500"
                            )}
                        />
                        {errors.apiSlug && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.apiSlug.message}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            This will be used in API endpoints: <code className="bg-gray-100 px-1 py-0.5 rounded">/api/content/{watch("apiSlug") || "your-slug"}</code>
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            placeholder="Describe what this content model is for..."
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Feature Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        {/* SEO Toggle */}
                        <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-all">
                            <input
                                {...register("hasSeo")}
                                type="checkbox"
                                className="w-5 h-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-semibold text-gray-800">
                                    <Globe className="w-4 h-4 text-blue-600" />
                                    SEO Features
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">Add meta title, description & slug</p>
                            </div>
                        </label>

                        {/* Workflow Toggle */}
                        <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-green-300 cursor-pointer transition-all">
                            <input
                                {...register("hasWorkflow")}
                                type="checkbox"
                                className="w-5 h-5 rounded text-green-600 focus:ring-2 focus:ring-green-500"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-semibold text-gray-800">
                                    <Workflow className="w-4 h-4 text-green-600" />
                                    Workflow
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">Draft, Review, Published</p>
                            </div>
                        </label>

                        {/* Multi-language Toggle */}
                        <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-all">
                            <input
                                {...register("hasMultiLang")}
                                type="checkbox"
                                className="w-5 h-5 rounded text-purple-600 focus:ring-2 focus:ring-purple-500"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-semibold text-gray-800">
                                    <Languages className="w-4 h-4 text-purple-600" />
                                    Multi-Language
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">Support translations</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* ========== FIELD BUILDER SECTION ========== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-pink-600 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Field Builder ({fields.length} fields)
                    </h2>
                    <button
                        type="button"
                        onClick={handleAddField}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Add Field
                    </button>
                </div>

                <div className="p-6">
                    {fields.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Settings className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">No fields yet</p>
                            <p className="text-sm">Click "Add Field" to start building your content structure</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className={cn(
                                        "border-2 rounded-lg transition-all",
                                        field.isLocked
                                            ? "border-blue-200 bg-blue-50/50"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    )}
                                >
                                    {/* Field Header */}
                                    <div
                                        className="flex items-center gap-3 p-4 cursor-pointer"
                                        onClick={() => setExpandedFieldId(expandedFieldId === field.id ? null : field.id)}
                                    >
                                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    {watch(`fields.${index}.label`) || `Field ${index + 1}`}
                                                </span>
                                                {field.isLocked && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                                        SEO
                                                    </span>
                                                )}
                                                {watch(`fields.${index}.required`) && (
                                                    <span className="text-red-500 text-sm">*</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <code className="text-xs text-gray-500 font-mono">
                                                    {watch(`fields.${index}.apiKey`) || "api_key"}
                                                </code>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-gray-500 capitalize">
                                                    {watch(`fields.${index}.type`)}
                                                </span>
                                            </div>
                                        </div>

                                        {!field.isLocked && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveField(index);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Field Configuration (Expanded) */}
                                    {expandedFieldId === field.id && (
                                        <div className="px-4 pb-4 pt-2 border-t border-gray-200 space-y-4 bg-gray-50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Label */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Field Label *
                                                    </label>
                                                    <input
                                                        {...register(`fields.${index}.label`)}
                                                        type="text"
                                                        placeholder="e.g., Title, Price, Author"
                                                        disabled={field.isLocked}
                                                        onChange={(e) => {
                                                            register(`fields.${index}.label`).onChange(e);
                                                            if (!field.isLocked && !watch(`fields.${index}.apiKey`)) {
                                                                generateApiKey(e.target.value, index);
                                                            }
                                                        }}
                                                        className="w-full px-3 py-2 rounded border border-gray-300 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    />
                                                </div>

                                                {/* API Key */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        API Key *
                                                    </label>
                                                    <input
                                                        {...register(`fields.${index}.apiKey`)}
                                                        type="text"
                                                        placeholder="e.g., title, price, author_name"
                                                        disabled={field.isLocked}
                                                        className="w-full px-3 py-2 rounded border border-gray-300 text-sm font-mono disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    />
                                                </div>

                                                {/* Type */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Field Type *
                                                    </label>
                                                    <select
                                                        {...register(`fields.${index}.type`)}
                                                        disabled={field.isLocked}
                                                        className="w-full px-3 py-2 rounded border border-gray-300 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    >
                                                        {FIELD_TYPES.map(type => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.icon} {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Max Length */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Max Length (Optional)
                                                    </label>
                                                    <input
                                                        {...register(`fields.${index}.validations.maxLength`, { valueAsNumber: true })}
                                                        type="number"
                                                        placeholder="e.g., 255"
                                                        disabled={field.isLocked}
                                                        className="w-full px-3 py-2 rounded border border-gray-300 text-sm disabled:bg-gray-100"
                                                    />
                                                </div>
                                            </div>

                                            {/* Checkboxes */}
                                            <div className="flex gap-6 pt-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        {...register(`fields.${index}.required`)}
                                                        type="checkbox"
                                                        disabled={field.isLocked}
                                                        className="w-4 h-4 rounded text-blue-600 disabled:cursor-not-allowed"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">Required Field</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        {...register(`fields.${index}.validations.isUnique`)}
                                                        type="checkbox"
                                                        disabled={field.isLocked}
                                                        className="w-4 h-4 rounded text-blue-600 disabled:cursor-not-allowed"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">Unique Value</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {errors.fields && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {typeof errors.fields === 'object' && 'message' in errors.fields
                                    ? errors.fields.message
                                    : "Please check your fields for errors"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ========== ACTIONS ========== */}
            <div className="flex justify-end gap-3 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className={cn(
                        "px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all",
                        isLoading || !isDirty
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                    )}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Model
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
