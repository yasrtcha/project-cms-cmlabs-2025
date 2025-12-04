"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MoreVertical,
  Trash2,
  FileText,
  FilePenLine,
  FolderPlus,
  Plus,
  X,
  Type,
  Image as ImageIcon,
  Hash,
  Calendar,
  MapPin,
  Layers,
  Link as LinkIcon,
} from "lucide-react";

// Data Field Types
const fieldTypes = [
  {
    slug: "text",
    icon: Type,
    title: "Text Field",
    description:
      "used for short or long texts, such as titles, names, rich texts, etc.",
  },
  {
    slug: "media",
    icon: ImageIcon,
    title: "Media Field",
    description:
      "Used for uploading and managing files like images, videos, audios or documents",
  },
  {
    slug: "number",
    icon: Hash,
    title: "Number Field",
    description:
      "Used for numeric values with options for integers and decimals.",
  },
  {
    slug: "date",
    icon: Calendar,
    title: "Date and Time",
    description:
      "Used for temporal data with calendar inputs, time, and configurable formatting",
  },
  {
    slug: "location",
    icon: MapPin,
    title: "Location",
    description:
      "Used for geographic data via address inputs or map coordinates.",
  },
  {
    slug: "multiple",
    icon: Layers,
    title: "Multiple Content",
    description:
      "Used for managing multiple content, allowing flexible combinations components.",
  },
  {
    slug: "relation",
    icon: LinkIcon,
    title: "Relation",
    description:
      "Used for linking entries across content types with configurable cardinality",
  },
];

export default function SinglePageBuilder() {
  const params = useParams();
  const projectId = params.projectId as string;
  const pageId = params.pageId as string;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State untuk mengontrol tampilan konten utama
  // false = Tampilkan "Empty State / Tips"
  // true  = Tampilkan "Add Field Type Grid"
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full w-full bg-white dark:bg-slate-950 flex flex-col overflow-hidden relative">
      {/* --- HEADER BAGIAN ATAS --- */}
      <div className="px-8 py-6 border-b border-transparent">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Pages / Content Builder /{" "}
          <span className="text-gray-900 dark:text-white font-medium">
            Home
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center border border-orange-200 shadow-sm">
              <span className="text-2xl">🏠</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Home :
                </h1>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <MoreVertical size={20} className="text-gray-500" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                        <FileText size={16} className="text-gray-500" /> To
                        Content Management
                      </button>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                        <FilePenLine size={16} className="text-gray-500" /> Edit
                        Page
                      </button>
                      <div className="my-1 border-t border-gray-100 dark:border-slate-700"></div>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors">
                        <Trash2 size={16} /> Delete Page
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Build your content structure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm">
              <FolderPlus size={16} /> Create Field Group
            </button>
            <button
              onClick={() => setIsAddFieldOpen(true)} // Ganti Tampilan Utama
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm">
              <Plus size={16} /> Add Field
            </button>
          </div>
        </div>
      </div>

      {/* --- AREA KONTEN UTAMA (View Switching) --- */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {!isAddFieldOpen ? (
          // TAMPILAN 1: EMPTY STATE / TIPS
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-10 max-w-4xl border border-gray-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-3xl font-bold text-[#3A7AC3] mb-6">
              Content Builder
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-gray-200 dark:border-slate-700">
                  <FileText
                    className="text-gray-900 dark:text-white"
                    size={24}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    No Content Structure Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    Start building your content structure to make this page
                    meaningful and functional. Add field groups and custom
                    fields as your own, based on your specific needs and
                    preferences.
                  </p>
                </div>
              </div>
              <div className="pl-[52px]">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                  Tips
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                      <Plus size={12} />
                    </div>
                    Create a Field Group to organize your content.
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                      <Plus size={12} />
                    </div>
                    Add Fields like text, image, numbering, or others.
                  </li>
                </ul>
              </div>
              <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-md border border-yellow-100 dark:border-yellow-900/20 ml-[52px]">
                <span className="text-yellow-500 text-lg">💡</span>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug pt-0.5">
                  Tip: Use{" "}
                  <span className="font-bold">"Create Field Group"</span> to
                  group related fields for better structure.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // TAMPILAN 2: ADD FIELD TYPE GRID (Pengganti Tampilan 1)
          <div className="bg-[#D9D9D9] dark:bg-slate-800 rounded-lg shadow-sm w-full max-w-4xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-slate-700">
              <h2 className="text-lg font-bold text-black dark:text-white">
                Add Field type
              </h2>
              <button
                onClick={() => setIsAddFieldOpen(false)} // Kembali ke Tampilan 1
                className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} className="text-black dark:text-white" />
              </button>
            </div>

            {/* Content Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {fieldTypes.map((field, idx) => (
                <Link
                  key={idx}
                  href={`/builder/${projectId}/single-page/${pageId}/field/${field.slug}`}
                  className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-md hover:shadow-md transition-shadow text-left group border border-transparent hover:border-gray-200 dark:hover:border-slate-600">
                  <div className="w-10 h-10 bg-orange-400 rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                    <field.icon className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">
                      {field.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-2">
                      {field.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
