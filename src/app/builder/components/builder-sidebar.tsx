"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import {
  FileText, Layers, Box, Plus, ChevronDown, ChevronRight, ChevronLeft, LayoutDashboard
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreateTypeModal } from "./create-type-modal";

type ContentTypeProps = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

export function BuilderSidebar({
  projectName,
  contentTypes
}: {
  projectName: string;
  contentTypes: ContentTypeProps[]
}) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId as string;

  const [openSections, setOpenSections] = useState({
    single: true,
    collection: true,
    component: true
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"SINGLE" | "COLLECTION" | "COMPONENT">("SINGLE");

  const singlePages = contentTypes.filter((c) => c.type === "SINGLE");
  const collectionPages = contentTypes.filter((c) => c.type === "COLLECTION");
  const components = contentTypes.filter((c) => c.type === "COMPONENT");

  const toggleSection = (section: "single" | "collection" | "component") => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const openModal = (type: "SINGLE" | "COLLECTION" | "COMPONENT") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-64 h-full bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
        <div className="p-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/20">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden">
              <Image
                src="/assets/logo cms black.png"
                alt="CMS Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-gray-900 dark:text-slate-100 uppercase truncate">
                {projectName}
              </h2>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">Content Builder</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <div>
            <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleSection("single")}>
              <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.1em] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Single Page</h3>
              {openSections.single ? <ChevronDown size={14} className="text-gray-400 dark:text-slate-600" /> : <ChevronRight size={14} className="text-gray-400 dark:text-slate-600" />}
            </div>

            {openSections.single && (
              <div className="space-y-0.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {singlePages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/builder/${projectId}/single-page/${page.id}`}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      pathname.includes(page.id)
                        ? "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                        : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <FileText size={16} className={pathname.includes(page.id) ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"} />
                    <span className="truncate">{page.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => openModal("SINGLE")}
                  className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-600/5 rounded-lg w-full transition-all mt-1"
                >
                  <Plus size={14} /> Create Single Page
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleSection("collection")}>
              <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.1em] group-hover:text-blue-600 dark:group-hover:text-blue-400">Multiple Page</h3>
              {openSections.collection ? <ChevronDown size={14} className="text-gray-400 dark:text-slate-600" /> : <ChevronRight size={14} className="text-gray-400 dark:text-slate-600" />}
            </div>

            {openSections.collection && (
              <div className="space-y-0.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {collectionPages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/builder/${projectId}/collection/${page.id}`}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      pathname.includes(page.id)
                        ? "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                        : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <Layers size={16} className={pathname.includes(page.id) ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"} />
                    <span className="truncate">{page.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => openModal("COLLECTION")}
                  className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-600/5 rounded-lg w-full transition-all mt-1"
                >
                  <Plus size={14} /> Create Multiple Page
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleSection("component")}>
              <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.1em] group-hover:text-blue-600 dark:group-hover:text-blue-400">Component</h3>
              {openSections.component ? <ChevronDown size={14} className="text-gray-400 dark:text-slate-600" /> : <ChevronRight size={14} className="text-gray-400 dark:text-slate-600" />}
            </div>

            {openSections.component && (
              <div className="space-y-0.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {components.map((comp) => (
                  <Link
                    key={comp.id}
                    href={`/builder/${projectId}/components/${comp.id}`}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      pathname.includes(comp.id)
                        ? "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                        : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <Box size={16} className={pathname.includes(comp.id) ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"} />
                    <span className="truncate">{comp.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => openModal("COMPONENT")}
                  className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-600/5 rounded-lg w-full transition-all mt-1"
                >
                  <Plus size={14} /> Create Component
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <CreateTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        projectId={projectId}
        projectName={projectName}
      />
    </>
  );
}