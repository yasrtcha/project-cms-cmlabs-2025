import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ContentForm from "@/app/builder/components/content-form";
import { getContentEntry } from "@/app/builder/_actions/content-entry-actions";

export default async function EntryEditorPage({
  params
}: {
  params: Promise<{ projectId: string, pageId: string, entryId: string }>
}) {
  const { projectId, pageId, entryId } = await params;

  // 1. Ambil Skema
  const schema = await prisma.builderContentType.findUnique({
    where: { id: pageId },
    include: {
      fieldGroups: {
        include: {
          fields: { orderBy: { order: 'asc' } }
        },
        orderBy: { order: 'asc' }
      },
      usedComponents: {
        include: {
          fieldGroups: {
            include: {
              fields: { orderBy: { order: 'asc' } }
            },
            orderBy: { order: 'asc' }
          }
        }
      }
    } as any


  });

  if (!schema) return notFound();

  // 1.1 Ambil Semua Skema Component (untuk inline rendering)
  const componentSchemas = await prisma.builderContentType.findMany({
    where: { projectId: schema.projectId, type: "COMPONENT" },
    include: {
      fieldGroups: {
        include: {
          fields: { orderBy: { order: 'asc' } }
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  // 2. Cek Mode (Create Baru atau Edit Lama)
  let initialData = null;

  if (entryId !== "new") {
    // Mode Edit: Ambil data dari DB
    const result = await getContentEntry(entryId);
    if (result.success && result.data) {
      initialData = result.data;
    }
  }

  // 3. Render Form (Kita pakai ulang ContentForm yang sama!)
  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumb Sederhana */}
      <div className="px-8 py-2 bg-white dark:bg-slate-950 text-xs text-gray-400 border-b border-gray-50 dark:border-slate-900">
        Collection / {schema.name} / {entryId === 'new' ? 'New Entry' : 'Edit Entry'}
      </div>

      <div className="flex-1 overflow-hidden">
        <ContentForm
          schema={schema}
          initialData={initialData}
          projectId={projectId}
          entryId={entryId}
          componentSchemas={componentSchemas}
        />
      </div>
    </div>
  );
}   