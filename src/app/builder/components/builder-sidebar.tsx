"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  FileText, Layers, Box, Plus, ChevronDown, ChevronRight, ChevronLeft,
  Database, PenTool, Settings, Activity, GitPullRequest, Key
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

  // --- STATE TOGGLE ---
  const [builderOpen, setBuilderOpen] = useState({
    single: true,
    collection: true,
    component: true
  });

  const [managementOpen, setManagementOpen] = useState({
    single: true,
    collection: true
  });

  // State untuk section Settings
  const [settingsOpen, setSettingsOpen] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"SINGLE" | "COLLECTION" | "COMPONENT">("SINGLE");

  // --- FILTER DATA ---
  const singlePages = contentTypes.filter((c) => c.type === "SINGLE");
  const collectionPages = contentTypes.filter((c) => c.type === "COLLECTION");
  const components = contentTypes.filter((c) => c.type === "COMPONENT");

  // --- HANDLERS ---
  const toggleBuilder = (section: "single" | "collection" | "component") => {
    setBuilderOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleManagement = (section: "single" | "collection") => {
    setManagementOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const openModal = (type: "SINGLE" | "COLLECTION" | "COMPONENT") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-64 h-full bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
        
        {/* Header Back Button */}
        <div className="p-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/20">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Project Info Header */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden bg-blue-50 dark:bg-blue-900/20">
               <div className="text-blue-600 dark:text-blue-400 font-bold text-xs">CMS</div>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-gray-900 dark:text-slate-100 uppercase truncate">
                {projectName}
              </h2>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">Headless CMS</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-20">
          
          {/* ============================================================ */}
          {/* 1. CONTENT BUILDER (Schema)                                  */}
          {/* ============================================================ */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
                <Database size={14} className="text-blue-600" />
                <h2 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                    Content Builder
                </h2>
            </div>
            
            <div className="space-y-4 border-l border-gray-100 dark:border-slate-800 ml-1.5 pl-3">
                {/* 1.1 Single Page */}
                <div>
                    <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleBuilder("single")}>
                    <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-blue-600">Single Page</h3>
                    {builderOpen.single ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                    </div>

                    {builderOpen.single && (
                    <div className="space-y-0.5 ml-1">
                        {singlePages.map((page) => (
                        <Link
                            key={page.id}
                            href={`/builder/${projectId}/single-page/${page.id}`}
                            className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                            pathname.includes(`/single-page/${page.id}`) 
                                ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <FileText size={14} />
                            <span className="truncate">{page.name}</span>
                        </Link>
                        ))}
                        <button onClick={() => openModal("SINGLE")} className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium text-blue-600 hover:underline w-full mt-1 dark:text-blue-400">
                        <Plus size={12} /> Create Schema
                        </button>
                    </div>
                    )}
                </div>

                {/* 1.2 Multiple Page */}
                <div>
                    <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleBuilder("collection")}>
                    <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-blue-600">Multiple Page</h3>
                    {builderOpen.collection ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                    </div>

                    {builderOpen.collection && (
                    <div className="space-y-0.5 ml-1">
                        {collectionPages.map((page) => (
                        <Link
                            key={page.id}
                            href={`/builder/${projectId}/collection/${page.id}`}
                            className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                            pathname.includes(`/collection/${page.id}`)
                                ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <Layers size={14} />
                            <span className="truncate">{page.name}</span>
                        </Link>
                        ))}
                        <button onClick={() => openModal("COLLECTION")} className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium text-blue-600 hover:underline w-full mt-1 dark:text-blue-400">
                        <Plus size={12} /> Create Schema
                        </button>
                    </div>
                    )}
                </div>

                {/* 1.3 Component */}
                <div>
                    <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleBuilder("component")}>
                    <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-blue-600">Component</h3>
                    {builderOpen.component ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                    </div>

                    {builderOpen.component && (
                    <div className="space-y-0.5 ml-1">
                        {components.map((comp) => (
                        <Link
                            key={comp.id}
                            href={`/builder/${projectId}/components/${comp.id}`}
                            className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                            pathname.includes(`/components/${comp.id}`)
                                ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <Box size={14} />
                            <span className="truncate">{comp.name}</span>
                        </Link>
                        ))}
                        <button onClick={() => openModal("COMPONENT")} className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium text-blue-600 hover:underline w-full mt-1 dark:text-blue-400">
                        <Plus size={12} /> Create Component
                        </button>
                    </div>
                    )}
                </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. CONTENT MANAGEMENT (Data Entry)                           */}
          {/* ============================================================ */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 px-1 mt-4">
                <PenTool size={14} className="text-green-600" />
                <h2 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                    Content Management
                </h2>
            </div>

            <div className="space-y-4 border-l border-gray-100 dark:border-slate-800 ml-1.5 pl-3">
                {/* 2.1 Single Page */}
                <div>
                    <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleManagement("single")}>
                    <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-green-600">Single Page</h3>
                    {managementOpen.single ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                    </div>

                    {managementOpen.single && (
                    <div className="space-y-0.5 ml-1">
                        {singlePages.length === 0 && <p className="text-[10px] text-gray-400 italic px-2">No pages yet</p>}
                        
                        {singlePages.map((page) => (
                        <Link
                            key={page.id}
                            href={`/builder/${projectId}/content-management/single/${page.id}`}
                            className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                            pathname.includes(`/content-management/single/${page.id}`)
                                ? "bg-green-50 text-green-700 font-medium dark:bg-green-900/20 dark:text-green-400" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <FileText size={14} className="text-gray-400" />
                            <span className="truncate">{page.name}</span>
                        </Link>
                        ))}
                    </div>
                    )}
                </div>

                {/* 2.2 Multiple Page */}
                <div>
                    <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleManagement("collection")}>
                    <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-green-600">Multiple Page</h3>
                    {managementOpen.collection ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                    </div>

                    {managementOpen.collection && (
                    <div className="space-y-0.5 ml-1">
                        {collectionPages.length === 0 && <p className="text-[10px] text-gray-400 italic px-2">No collections yet</p>}

                        {collectionPages.map((page) => (
                        <Link
                            key={page.id}
                            href={`/builder/${projectId}/content-management/collection/${page.id}`}
                            className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                            pathname.includes(`/content-management/collection/${page.id}`)
                                ? "bg-green-50 text-green-700 font-medium dark:bg-green-900/20 dark:text-green-400" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <Layers size={14} className="text-gray-400" />
                            <span className="truncate">{page.name}</span>
                        </Link>
                        ))}
                    </div>
                    )}
                </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. MAIN SETTINGS (Sesuai Gambar)                             */}
          {/* ============================================================ */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <div 
                className="flex items-center justify-between gap-2 mb-3 px-1 mt-4 cursor-pointer group"
                onClick={() => setSettingsOpen(!settingsOpen)}
            >
                <div className="flex items-center gap-2">
                    <Settings size={14} className="text-orange-500" />
                    <h2 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                        Main Setting
                    </h2>
                </div>
                {settingsOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
            </div>

            {settingsOpen && (
                <div className="space-y-0.5 ml-1 border-l border-gray-100 dark:border-slate-800 pl-3">
                    {/* Activity Logs */}
                    <Link
                        href={`/builder/${projectId}/settings/activity-logs`}
                        className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                        pathname.includes("/settings/activity-logs")
                            ? "bg-orange-50 text-orange-600 font-medium dark:bg-orange-900/20 dark:text-orange-400" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        <Activity size={14} className="text-gray-400" />
                        <span className="truncate">Activity Logs</span>
                    </Link>

                    {/* Workflow Approval */}
                    <Link
                        href={`/builder/${projectId}/settings/workflow`}
                        className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                        pathname.includes("/settings/workflow")
                            ? "bg-orange-50 text-orange-600 font-medium dark:bg-orange-900/20 dark:text-orange-400" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        <GitPullRequest size={14} className="text-gray-400" />
                        <span className="truncate">Workflow Approval</span>
                    </Link>

                    {/* API and Integration (Highlight) */}
                    <Link
                        href={`/builder/${projectId}/settings/api-integration`}
                        className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                        pathname.includes("/settings/api-integration")
                            ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400" // Highlighted style
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                        )}
                    >
                        <Key size={14} className={pathname.includes("/settings/api-integration") ? "text-blue-600 dark:text-blue-400" : "text-gray-400"} />
                        <span className="truncate">API and Integration</span>
                    </Link>
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