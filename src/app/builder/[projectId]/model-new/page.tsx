import ModelBuilderClient from "../model-edit/[pageId]/ModelBuilderClient";

export default async function NewModelPage({
    params
}: {
    params: Promise<{ projectId: string }>
}) {
    const { projectId } = await params;

    return (
        <ModelBuilderClient
            projectId={projectId}
        />
    );
}
