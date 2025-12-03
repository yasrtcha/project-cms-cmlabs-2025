"use client";

import { useParams } from "next/navigation";
import { BuilderSidebar } from "../components/builder-sidebar";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.projectId as string; // misal: "cms-cmlabs"

  // Format nama project dari slug (cms-cmlabs -> CMS CMLABS)
  const formattedName = projectId.replace(/-/g, " ").toUpperCase();

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* Sidebar Khusus Builder */}
      <BuilderSidebar projectName={formattedName} />

      {/* Area Konten Utama (Canvas) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950 relative">
        {/* Konten (Page.tsx) */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
