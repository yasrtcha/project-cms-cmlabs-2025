import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SinglePageBuilderClient from "./SinglePageBuilderClient";

export default async function Page({
  params
}: {
  params: Promise<{ projectId: string, pageId: string }>
}) {
  // 1. Await params (Wajib untuk Next.js 15)
  const { projectId, pageId } = await params;

  // 2. Ambil data Single Page dari Database
  const rawPageData = await prisma.builderContentType.findUnique({
    where: { id: pageId },
    include: {
      fieldGroups: {
        include: {
          fields: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      },
      usedComponents: true
    } as any


  });

  if (!rawPageData) return notFound();

  // 3. PENTING: Bersihkan Data (Serialize)
  // Mengubah Object Date menjadi String agar tidak Error di Client Component
  const pageData = JSON.parse(JSON.stringify(rawPageData));

  // 4. Ambil data relasi (Content Type lain)
  const rawContentTypes = await prisma.builderContentType.findMany({
    where: {
      projectId: projectId,
      NOT: { id: pageId }
    },
    select: { id: true, name: true, slug: true, type: true }
  });

  // Bersihkan data relasi juga
  const allContentTypes = JSON.parse(JSON.stringify(rawContentTypes));

  // 5. Render Client Component
  return (
    <SinglePageBuilderClient
      initialData={pageData}
      projectId={projectId}
      pageId={pageId}
      allContentTypes={allContentTypes}
    />
  );
}