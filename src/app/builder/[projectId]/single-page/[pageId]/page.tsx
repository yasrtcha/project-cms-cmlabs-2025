"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MoreHorizontal, 
  Trash2, 
  FileText, 
  ArrowRight,
  FolderPlus,
  Plus
} from "lucide-react";

export default function SinglePageBuilder() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Ref untuk mendeteksi klik di luar dropdown (agar bisa menutup otomatis)
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full w-full bg-white dark:bg-slate-950 flex flex-col overflow-hidden">
      
      {/* --- HEADER BAGIAN ATAS --- */}
      <div className="px-8 py-6 border-b border-transparent">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Pages / Content Builder / <span className="text-gray-900 dark:text-white font-medium">Home</span>
        </div>

        <div className="flex items-start justify-between">
          
          {/* Kiri: Ikon & Judul Halaman */}
          <div className="flex items-start space-x-4">
            {/* Ikon Rumah (Placeholder menggunakan Emoji/Div) */}
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center border border-orange-200 shadow-sm">
               <span className="text-2xl">🏠</span> 
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Home :
                </h1>
                
                {/* Dropdown Menu Manual (Tanpa Library Tambahan) */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <MoreHorizontal size={20} className="text-gray-500" />
                  </button>

                  {/* Isi Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                      
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                        <ArrowRight size={16} className="text-gray-500" />
                        To Content Management
                      </button>
                      
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                        <FileText size={16} className="text-gray-500" />
                        Edit Page
                      </button>
                      
                      <div className="my-1 border-t border-gray-100 dark:border-slate-700"></div>
                      
                      <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors">
                        <Trash2 size={16} />
                        Delete Page
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Build your Content Structure
              </p>
            </div>
          </div>

          {/* Kanan: Tombol Aksi Utama */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm">
              <FolderPlus size={16} />
              Create Field Group
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm">
              <Plus size={16} />
              Add Field
            </button>
          </div>
        </div>
      </div>

      {/* --- AREA KONTEN UTAMA (Empty State) --- */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-10 max-w-4xl border border-gray-100 dark:border-slate-800">
          
          <h2 className="text-3xl font-bold text-[#3A7AC3] mb-6">
            Content Builder
          </h2>

          <div className="space-y-8">
            {/* Bagian Deskripsi */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-gray-200 dark:border-slate-700">
                <FileText className="text-gray-900 dark:text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No Content Structure Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  Start building your content structure to make this page meaningful and functional. Add field groups and custom fields as your own, based on your specific needs and preferences.
                </p>
              </div>
            </div>

            {/* Bagian Tips */}
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

            {/* Bagian Alert Kuning */}
            <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-md border border-yellow-100 dark:border-yellow-900/20 ml-[52px]">
              <span className="text-yellow-500 text-lg">💡</span>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug pt-0.5">
                Tip: Use <span className="font-bold">"Create Field Group"</span> to group related fields for better structure.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}