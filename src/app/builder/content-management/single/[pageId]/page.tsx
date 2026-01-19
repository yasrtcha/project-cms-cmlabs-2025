import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ContentForm from "@/app/builder/components/content-form"; // Pastikan path ini sesuai lokasi komponen Anda
import { getContentEntry } from "@/app/builder/_actions/content-entry-actions";

export default async function SingleContentEntryPage({
    params
}: {
    params: Promise<{ projectId: string, pageId: string }>
}) {
    const { projectId, pageId } = await params;

    // 1. Ambil Skema (Struktur Form yang didesain di Builder)
    const schema = await prisma.builderContentType.findUnique({
        where: { id: pageId },
        include: {
            fieldGroups: {
                include: {
                    fields: { orderBy: { order: 'asc' } }
                },
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!schema) return notFound();

    // 1.1 Ambil Semua Skema Component (untuk inline rendering)
    const componentSchemas = await prisma.builderContentType.findMany({
        where: { projectId, type: "COMPONENT" },
        include: {
            fieldGroups: {
                include: {
                    fields: { orderBy: { order: 'asc' } }
                },
                orderBy: { order: 'asc' }
            }
        }
    });

    // 2. Ambil Data Konten yang sudah pernah diisi (jika ada)
    const entryResult = await getContentEntry(pageId);
    const initialData = entryResult.success ? entryResult.data : null;

    // 3. Render Form
    return (
        <ContentForm
            schema={schema}
            initialData={initialData}
            projectId={projectId}
            componentSchemas={componentSchemas}
        />
    );
}
