import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SinglePageBuilderClient from "./SinglePageBuilderClient";

export default async function Page({ params }: { params: Promise<{ projectId: string, pageId: string }> }) {
  // 1. Ambil params
  const { projectId, pageId } = await params;

  // 2. Ambil data dari tabel BARU (BuilderContentType)
  const pageData = await prisma.builderContentType.findUnique({
    where: { id: pageId },
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

  if (!pageData) return notFound();

  // 3. Ambil semua Content Type lain untuk keperluan Relasi
  const allContentTypes = await prisma.builderContentType.findMany({
    where: {
      projectId: projectId,
      NOT: { id: pageId } // Opsional: exclude self jika self-relation belum didukung kompleks
    },
    select: { id: true, name: true, slug: true, type: true }
  });

  // 4. Kirim data ke Client Component
  return (
    <SinglePageBuilderClient
      initialData={pageData}
      projectId={projectId}
      pageId={pageId}
      allContentTypes={allContentTypes}
    />
  );
}