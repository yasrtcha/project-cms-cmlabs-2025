"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ModelBuilderForm from "@/components/builder/ModelBuilderForm";
import { saveContentModel } from "@/app/builder/_actions/model-actions";
import { ContentModelData } from "@/types/content-model";
import { ArrowLeft } from "lucide-react";

interface ModelBuilderClientProps {
    projectId: string;
    modelId?: string;
    initialData?: ContentModelData;
}

export default function ModelBuilderClient({
    projectId,
    modelId,
    initialData
}: ModelBuilderClientProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: ContentModelData) => {
        setIsLoading(true);

        try {
            const result = await saveContentModel(projectId, data, modelId);

            if (result.success) {
                alert(modelId ? "Model updated successfully!" : "Model created successfully!");
                router.push(`/builder/${projectId}`);
                router.refresh();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (confirm("Are you sure? Unsaved changes will be lost.")) {
            router.push(`/builder/${projectId}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <button
                        onClick={() => router.push(`/builder/${projectId}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Builder
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {modelId ? "Edit Content Model" : "Create New Content Model"}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Define the structure and fields for your content
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="py-8">
                <ModelBuilderForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
