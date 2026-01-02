import { prisma } from "@/lib/prisma";
import { BuilderSidebar } from "../components/builder-sidebar";

export default async function BuilderLayout({
  children,
  params, 
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>; 
}) {
  // 1. AWAIT PARAMS
  const { projectId } = await params;

  // 2. AMBIL DATA DARI TABEL BARU (BuilderContentType)
  // Bukan lagi prisma.page, tapi prisma.builderContentType
  const contentTypes = await prisma.builderContentType.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const formattedName = projectId.replace(/-/g, " ").toUpperCase();

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* 3. KIRIM DATA KE SIDEBAR */}
      {/* Props-nya sekarang bernama 'contentTypes', bukan 'initialPages' */}
      <BuilderSidebar 
        projectName={formattedName} 
        contentTypes={contentTypes} 
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950 relative">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}