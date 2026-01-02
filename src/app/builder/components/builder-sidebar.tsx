"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation"; 
import { 
  FileText, Layers, Box, Plus, Settings, ChevronDown, ChevronRight, Code 
} from "lucide-react"; // Saya tambahkan icon 'Code'
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreateTypeModal } from "./create-type-modal"; 

// Tipe data untuk props
type ContentTypeProps = {
  id: string;
  name: string;
  slug: string;
  type: string; // "SINGLE" | "COLLECTION" | "COMPONENT"
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
  
  // State untuk expand/collapse menu
  const [openSections, setOpenSections] = useState({
    single: true,
    collection: true,
    component: true
  });

  // State untuk Modal Create
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"SINGLE" | "COLLECTION" | "COMPONENT">("SINGLE");

  // Filter data berdasarkan Tipe-nya
  const singlePages = contentTypes.filter((c) => c.type === "SINGLE");
  const collectionPages = contentTypes.filter((c) => c.type === "COLLECTION");
  const components = contentTypes.filter((c) => c.type === "COMPONENT");

  const toggleSection = (section: "single" | "collection" | "component") => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper membuka modal
  const openModal = (type: "SINGLE" | "COLLECTION" | "COMPONENT") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-64 h-full bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col">
        {/* Header Project */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              CMS
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900 dark:text-white uppercase truncate max-w-[140px]">
                {projectName}
              </h2>
              <p className="text-[10px] text-gray-500">Content Builder</p>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* SECTION 1: SINGLE PAGE */}
          <div>
            <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleSection("single")}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-600">Single Page</h3>
              {openSections.single ? <ChevronDown size={14} className="text-gray-400"/> : <ChevronRight size={14} className="text-gray-400"/>}
            </div>
            
            {openSections.single && (
              <div className="space-y-1 ml-1">
                {singlePages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/builder/${projectId}/single-page/${page.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      pathname.includes(page.id) 
                        ? "bg-blue-50 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <FileText size={16} />
                    {page.name}
                  </Link>
                ))}
                <button 
                  onClick={() => openModal("SINGLE")}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:underline mt-1"
                >
                  <Plus size={14} /> Create Single Page
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: MULTIPLE PAGE (COLLECTION) */}
          <div>
            <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleSection("collection")}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-600">Multiple Page</h3>
              {openSections.collection ? <ChevronDown size={14} className="text-gray-400"/> : <ChevronRight size={14} className="text-gray-400"/>}
            </div>

            {openSections.collection && (
              <div className="space-y-1 ml-1">
                {collectionPages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/builder/${projectId}/collection/${page.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      pathname.includes(page.id) 
                        ? "bg-blue-50 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Layers size={16} />
                    {page.name}
                  </Link>
                ))}
                <button 
                  onClick={() => openModal("COLLECTION")}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:underline mt-1"
                >
                  <Plus size={14} /> Create Multiple Page
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: COMPONENT */}
          <div>
            <div className="flex items-center justify-between mb-2 cursor-pointer group" onClick={() => toggleSection("component")}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-600">Component</h3>
              {openSections.component ? <ChevronDown size={14} className="text-gray-400"/> : <ChevronRight size={14} className="text-gray-400"/>}
            </div>

            {openSections.component && (
              <div className="space-y-1 ml-1">
                {components.map((comp) => (
                  <Link
                    key={comp.id}
                    href={`/builder/${projectId}/component/${comp.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      pathname.includes(comp.id) 
                        ? "bg-blue-50 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Box size={16} />
                    {comp.name}
                  </Link>
                ))}
                <button 
                  onClick={() => openModal("COMPONENT")}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:underline mt-1"
                >
                  <Plus size={14} /> Create Component
                </button>
              </div>
            )}
          </div>

          {/* SECTION 4: API & SETTINGS (BARU DITAMBAHKAN) */}
          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Integration & Settings
            </h3>
            
            <Link
              href={`/builder/${projectId}/api-integration`}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                pathname.includes("api-integration")
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Code size={16} />
              API Integration
            </Link>
          </div>

        </div>

        {/* Footer Settings */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
            <Settings size={18} />
            Project Settings
          </button>
        </div>
      </div>

      {/* RENDER MODAL */}
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