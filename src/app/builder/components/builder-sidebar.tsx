"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { useParams } from "next/navigation"; // Import useParams
import {
  Search,
  Settings,
  FileText,
  Files,
  Box,
  Plus,
  ChevronRight,
  ChevronDown,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Komponen item accordion untuk menu tree
const SidebarSection = ({
  title,
  icon: Icon,
  items,
  isOpen,
  onToggle,
  isCollapsed,
  projectId, // Terima projectId untuk bikin link
}: any) => {
  if (isCollapsed) {
    return (
      <div className="mb-4 flex flex-col items-center group relative">
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 rounded-md transition-colors"
          title={title}>
          <Icon size={20} />
        </button>
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
          {title}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors group">
        <span className="text-gray-400 mr-2 group-hover:text-gray-600 dark:group-hover:text-gray-300">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <span className="flex-1 text-left font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </span>
        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-2">
          {items.length}
        </span>
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-200 dark:border-slate-700 pl-3">
          {items.map((item: any, idx: number) => {
            // Cek apakah item punya href (link) atau cuma teks biasa
            const isLink = typeof item === "object" && item.href;
            const label = isLink ? item.label : item;

            const Content = () => (
              <div className="flex items-center w-full px-2 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded transition-colors cursor-pointer">
                <Plus size={12} className="mr-1.5" />
                {label}
              </div>
            );

            return isLink ? (
              <Link key={idx} href={`/builder/${projectId}${item.href}`}>
                <Content />
              </Link>
            ) : (
              <button key={idx} className="w-full text-left">
                <Content />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export function BuilderSidebar({ projectName }: { projectName: string }) {
  const params = useParams();
  const projectId = params.projectId as string; // Ambil ID project dari URL

  const [openSections, setOpenSections] = useState({
    single: true,
    multiple: true,
    component: true,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Definisi Menu Items dengan Link
  const menuItems = {
    single: [
      // Item ini untuk contoh halaman "Home" yang sudah dibuat
      { label: "Home", href: "/single-page/home", icon: "home" },
      // Item ini tombol create
      {
        label: "Create Single Page",
        href: "/single-page/create",
        isAction: true,
      },
    ],
    multiple: [
      { label: "Create Multiple Page", href: "/multiple-page/create" }, // Contoh untuk nanti
    ],
    component: ["Create Folder", "Create Component"],
  };

  return (
    <div
      className={cn(
        "h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-all duration-300 ease-in-out z-20 shadow-sm",
        isCollapsed ? "w-16" : "w-72"
      )}>
      {/* Header Sidebar */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-slate-800">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 mr-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md text-gray-600 dark:text-gray-300 transition-colors">
          <Menu size={20} />
        </button>

        {!isCollapsed && (
          <div className="flex items-center space-x-3 overflow-hidden">
            <Image
              src="/assets/logo cms black.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded flex-shrink-0"
            />
            <span className="font-bold text-gray-900 dark:text-white truncate text-sm uppercase tracking-wide">
              {projectName || "CMS PROJECT"}
            </span>
          </div>
        )}
      </div>

      {/* Konten Sidebar */}
      {!isCollapsed ? (
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="mb-4 px-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-black dark:border-white w-fit pb-1">
              Content Builder
            </h2>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-slate-800 border-none rounded-md text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <SidebarSection
              title="Single Page"
              icon={FileText}
              isOpen={openSections.single}
              onToggle={() => toggleSection("single")}
              items={menuItems.single}
              isCollapsed={false}
              projectId={projectId} // Pass projectId
            />
            <SidebarSection
              title="Multiple Page"
              icon={Files}
              isOpen={openSections.multiple}
              onToggle={() => toggleSection("multiple")}
              items={menuItems.multiple}
              isCollapsed={false}
              projectId={projectId}
            />
            <SidebarSection
              title="Component"
              icon={Box}
              isOpen={openSections.component}
              onToggle={() => toggleSection("component")}
              items={menuItems.component}
              isCollapsed={false}
              projectId={projectId}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center py-6 space-y-4 overflow-y-auto">
          <Image
            src="/assets/logo cms black.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded mb-4 flex-shrink-0"
          />
          <div className="w-full border-t border-gray-200 dark:border-slate-800 my-2"></div>
          <SidebarSection
            icon={FileText}
            title="Single Page"
            isCollapsed={true}
          />
          <SidebarSection
            icon={Files}
            title="Multiple Page"
            isCollapsed={true}
          />
          <SidebarSection icon={Box} title="Component" isCollapsed={true} />
        </div>
      )}

      {/* Footer Settings */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
        <button
          className={cn(
            "flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-slate-800 rounded-md transition-colors",
            isCollapsed ? "w-8 h-8 p-0" : "w-full p-2"
          )}
          title="Settings">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
