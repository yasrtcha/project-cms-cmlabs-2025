import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
// Kita import Client Component yang sudah canggih tadi
import SinglePageBuilderClient from "../../single-page/[pageId]/SinglePageBuilderClient"; 

export default async function CollectionBuilderPage({ 
  params 
}: { 
  params: Promise<{ projectId: string, pageId: string }> 
}) {
  const { projectId, pageId } = await params;

  // 1. Ambil data Content Type
  const pageData = await prisma.builderContentType.findUnique({
    where: { id: pageId },
    include: {
      fieldGroups: {
        include: {
          fields: {
            orderBy: { order: 'asc' } // Pastikan urutan sesuai Drag & Drop
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!pageData) return notFound();

  // 2. Render Builder yang sama
  return (
    <SinglePageBuilderClient 
      initialData={pageData} 
      projectId={projectId} 
      pageId={pageId} 
    />
  );
}