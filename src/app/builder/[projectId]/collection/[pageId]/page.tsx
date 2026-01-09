import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SinglePageBuilderClient from "../../single-page/[pageId]/SinglePageBuilderClient"; 

export default async function CollectionBuilderPage({ 
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

  return (
    <SinglePageBuilderClient 
      initialData={pageData} 
      projectId={projectId} 
      pageId={pageId} 
    />
  );
}