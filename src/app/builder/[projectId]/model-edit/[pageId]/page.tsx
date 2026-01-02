import { getContentModel } from "@/app/builder/_actions/model-actions";
import { notFound } from "next/navigation";
import ModelBuilderClient from "./ModelBuilderClient";

export default async function EditModelPage({
    params
}: {
    params: Promise<{ projectId: string, pageId: string }>
}) {
    const { projectId, pageId } = await params;

    // Fetch existing model data
    const result = await getContentModel(pageId);

    if (!result.success || !result.data) {
        return notFound();
    }

    return (
        <ModelBuilderClient
            projectId={projectId}
            modelId={pageId}
            initialData={result.data}
        />
    );
}
