import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SinglePageBuilderClient from "../../single-page/[pageId]/SinglePageBuilderClient";

export default async function ComponentBuilderPage({
  params
}: {
  params: Promise<{ projectId: string, pageId: string }>
}) {
  const { projectId, pageId } = await params;

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



  const allContentTypes = await prisma.builderContentType.findMany({
    where: {
      projectId: projectId,
      NOT: { id: pageId }
    },
    select: { id: true, name: true, slug: true, type: true }
  });

  return (
    <SinglePageBuilderClient
      initialData={pageData}
      projectId={projectId}
      pageId={pageId}
      allContentTypes={allContentTypes}
    />
  );
}