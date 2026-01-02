"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MoreVertical,
  Trash2,
  FileText,
  FolderPlus,
  Plus,
  X,
  Type,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  Hash,
  Calendar,
  MapPin,
  Layers,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

export default function FieldConfigurationPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId as string;
  const pageId = params.pageId as string;
  const fieldSlug = params.fieldSlug as string; // Contoh: "text", "media", dll.

  // State untuk kontrol tampilan
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [apiId, setApiId] = useState("");

  // 1. Fungsi Helper untuk generate API ID otomatis
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFieldName(val);
    // Mengubah spasi menjadi underscore dan huruf kecil semua
    setApiId(val.toLowerCase().replace(/\s+/g, "_"));
  };

  // 2. Fungsi untuk memilih Ikon secara dinamis berdasarkan URL (fieldSlug)
  const getIcon = () => {
    switch (fieldSlug) {
      case "text": return <Type size={20} />;
      case "media": return <ImageIcon size={20} />;
      case "number": return <Hash size={20} />;
      case "date": return <Calendar size={20} />;
      case "location": return <MapPin size={20} />;
      case "multiple": return <Layers size={20} />;
      case "relation": return <LinkIcon size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-slate-950 flex flex-col overflow-hidden relative">
      
      {/* ================= HEADER HALAMAN ================= */}
      <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Pages / Content Builder /{" "}
          <span className="text-gray-900 dark:text-white font-medium">
            Home
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center border border-orange-200 shadow-sm text-2xl">
              🏠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Home :
                </h1>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                  <MoreVertical size={20} className="text-gray-500" />
                </button>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm">
              <Plus size={16} /> Add Field
            </button>
          </div>
        </div>
      </div>

      {/* ================= AREA UTAMA (SPLIT VIEW) ================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* --- KIRI: PREVIEW STRUKTUR KONTEN --- */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-slate-900/50">
          <div className="max-w-3xl">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Preview Structure</h4>
            
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 mb-4 shadow-sm">
              <div className="flex items-center gap-4">
                <Menu className="text-gray-400 cursor-grab" size={20} />

                {/* Box Ikon Dinamis */}
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-purple-200 dark:shadow-none">
                  {getIcon()}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    {fieldName || "New Field Name"}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                    {fieldSlug} Field
                  </p>
                </div>
              </div>

              <button className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* --- KANAN: PANEL CONFIGURATION --- */}
        <div className="w-[400px] bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 flex flex-col h-full shadow-2xl z-10">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-blue-600">
              <Settings size={20} />
              <h2 className="font-bold text-base text-gray-900 dark:text-white">
                Field Settings
              </h2>
            </div>
            <Link
              href={`/builder/${projectId}/single-page/${pageId}`}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </Link>
          </div>

          {/* Form Konfigurasi */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Section: Basic Configuration */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Basic Config
                </h3>
                <ChevronUp size={16} className="text-gray-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={fieldName}
                    onChange={handleNameChange}
                    placeholder="e.g. Hero Title"
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                    API ID
                  </label>
                  <input
                    type="text"
                    value={apiId}
                    readOnly
                    className="w-full p-2.5 bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed outline-none"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" />
                    <div>
                      <span className="block text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors">Required</span>
                      <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Field must be filled before saving.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" />
                    <div>
                      <span className="block text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors">Unique</span>
                      <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Value must be unique across records.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-slate-800" />

            {/* Section: Advanced (Accordion) */}
            <div>
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Advanced Config
                </h3>
                {isAdvancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isAdvancedOpen && (
                <div className="pt-4 space-y-2">
                  <p className="text-xs text-gray-500 italic">No advanced settings available for this field type.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Panel */}
          <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}