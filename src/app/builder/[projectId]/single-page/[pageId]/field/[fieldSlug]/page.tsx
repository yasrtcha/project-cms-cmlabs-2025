"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MoreVertical,
  Trash2,
  ArrowRight,
  FileText,
  FolderPlus,
  Plus,
  X,
  Type,
  Settings,
  ChevronDown,
  ChevronUp,
  Save,
  Menu,
} from "lucide-react";

export default function FieldConfigurationPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId as string;
  const pageId = params.pageId as string;
  const fieldSlug = params.fieldSlug as string; // misal: "text"

  // State untuk accordion Advanced Configuration
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // State form dummy
  const [fieldName, setFieldName] = useState("");
  const [apiId, setApiId] = useState("");

  // Helper untuk generate API ID otomatis dari Name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFieldName(val);
    setApiId(val.toLowerCase().replace(/\s+/g, "_"));
  };

  return (
    <div className="h-full w-full bg-white dark:bg-slate-950 flex flex-col overflow-hidden relative">
      {/* ================= HEADER HALAMAN (Sama seperti sebelumnya) ================= */}
      <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
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
          {/* Item Field yang sedang diedit */}
          <div className="max-w-3xl">
            <div className="flex items-center justify-between bg-gray-200 dark:bg-slate-800 p-4 rounded-md border border-gray-300 dark:border-slate-700 mb-4">
              <div className="flex items-center gap-4">
                {/* Drag Handle Icon */}
                <Menu className="text-gray-500 cursor-grab" size={20} />

                {/* Icon Box Ungu */}
                <div className="w-10 h-10 bg-purple-500 rounded flex items-center justify-center text-white font-medium text-xs">
                  {/* Tampilkan ikon sesuai tipe field, di sini hardcode icon Text dulu sesuai gambar */}
                  icon
                </div>

                {/* Info Field */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {fieldSlug === "text" ? "Text Field" : "Field"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Short Text
                  </p>
                </div>
              </div>

              {/* Tombol Hapus */}
              <button className="text-red-500 hover:text-red-700 transition-colors p-2">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* --- KANAN: PANEL CONFIGURATION --- */}
        <div className="w-[400px] bg-gray-300/50 dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 flex flex-col h-full shadow-xl z-10">
          {/* Header Panel */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-300 dark:border-slate-700 bg-gray-200 dark:bg-slate-800/80">
            <div className="flex items-center gap-2">
              <Settings
                size={20}
                className="text-gray-700 dark:text-gray-200"
              />
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                Setting Configuration
              </h2>
            </div>
            <Link
              href={`/builder/${projectId}/single-page/${pageId}`} // Tombol X kembali ke halaman list
              className="p-1 hover:bg-gray-300 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X size={24} className="text-gray-700 dark:text-white" />
            </Link>
          </div>

          {/* Isi Form Konfigurasi */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Configuration Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">
                  Basic Configuration
                </h3>
                <ChevronUp size={18} className="text-gray-500" />
              </div>

              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={fieldName}
                    onChange={handleNameChange}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>

                {/* API ID Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                    API id
                  </label>
                  <input
                    type="text"
                    value={apiId}
                    readOnly
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md outline-none text-gray-900 dark:text-white"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    it's generated automatically and used to generate API routes
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                        Required
                      </span>
                      <span className="block text-xs text-gray-500 leading-tight">
                        Field must be filled before saving. Empty entries will
                        be rejected.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                        Unique
                      </span>
                      <span className="block text-xs text-gray-500 leading-tight">
                        Duplicate entries are not allowed. Value must be unique
                        across all records
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 dark:border-slate-700"></div>

            {/* Advanced Configuration Section (Accordion) */}
            <div>
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center justify-between w-full text-left">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  Advanced Configuration
                </h3>
                {isAdvancedOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {isAdvancedOpen && (
                <div className="pt-4 text-sm text-gray-500">
                  {/* Isi Advanced Config bisa ditambahkan di sini nanti */}
                  <p>Additional settings here...</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Panel */}
          <div className="p-6 border-t border-gray-300 dark:border-slate-700 bg-gray-200 dark:bg-slate-800/50">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors shadow-sm">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
