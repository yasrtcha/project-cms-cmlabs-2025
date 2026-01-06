import { prisma } from "@/lib/prisma";
import { BuilderSidebar } from "../components/builder-sidebar";

export default async function BuilderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true }
  });

  const contentTypes = await prisma.builderContentType.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const projectName = project?.name || "Untitled Project";

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      <BuilderSidebar
        projectName={projectName}
        contentTypes={contentTypes}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950 relative">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}