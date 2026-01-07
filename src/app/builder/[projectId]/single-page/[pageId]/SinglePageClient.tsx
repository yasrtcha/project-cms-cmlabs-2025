"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNewField } from "@/app/builder/_actions/field-actions";
import {
  MoreVertical, Trash2, Plus, X, Type,
  Image as ImageIcon, Hash, Calendar, MapPin, Layers, 
  Link as LinkIcon, Loader2, Menu, Settings, 
  FileText, ToggleLeft, ChevronRight
} from "lucide-react";

// --- 1. UPDATE DAFTAR TIPE FIELD (LENGKAP & BERWARNA) ---
const fieldTypes = [
  { 
    slug: "text", 
    icon: Type, 
    title: "Text", 
    description: "Small text for titles, headings, or single-line values.",
    color: "bg-purple-100 text-purple-600"
  },
  { 
    slug: "rich_text", 
    icon: FileText, 
    title: "Rich Text", 
    description: "Long form content with formatting (Bold, Italic, Lists).",
    color: "bg-gray-100 text-gray-600" 
  },
  { 
    slug: "media", 
    icon: ImageIcon, 
    title: "Media", 
    description: "Images, videos, PDFs, or other file attachments.",
    color: "bg-orange-100 text-orange-600"
  },
  { 
    slug: "number", 
    icon: Hash, 
    title: "Number", 
    description: "Integers, decimals, prices, or quantities.",
    color: "bg-green-100 text-green-600"
  },
  { 
    slug: "relation", 
    icon: LinkIcon, 
    title: "Relation", 
    description: "Link to other content types (e.g., Blog Author, Category).",
    color: "bg-blue-100 text-blue-600"
  },
  { 
    slug: "boolean", 
    icon: ToggleLeft, 
    title: "Boolean", 
    description: "True/False switches (e.g., Active, Featured, Visible).",
    color: "bg-pink-100 text-pink-600"
  },
  { 
    slug: "date", 
    icon: Calendar, 
    title: "Date", 
    description: "Date picker with optional time selection.",
    color: "bg-cyan-100 text-cyan-600"
  },
  { 
    slug: "location", 
    icon: MapPin, 
    title: "Location", 
    description: "Coordinates (Lat/Long) for mapping purposes.",
    color: "bg-red-100 text-red-600"
  },
];

export default function SinglePageBuilderClient({ initialData, projectId, pageId }: any) {
  const router = useRouter();
  
  // --- STATE ---
  const [step, setStep] = useState("LIST"); // LIST, SELECT, CONFIG
  const [selectedType, setSelectedType] = useState<any>(null);
  const [fieldName, setFieldName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi Simpan
  const handleSave = async () => {
    if (!fieldName) return alert("Please name your field");
    setIsLoading(true);

    const result = await createNewField({
      name: fieldName,
      type: selectedType.slug,
      pageId: pageId,
      projectId: projectId,
    });

    if (result.success) {
      setStep("LIST");
      setFieldName("");
      router.refresh();
    } else {
      alert("Failed to save");
    }
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full bg-white dark:bg-slate-950 flex flex-col overflow-hidden relative font-sans">
      
      {/* --- HEADER --- */}
      <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center border border-orange-200 text-2xl">🏠</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase">{initialData.name}</h1>
                <MoreVertical size={20} className="text-gray-500 cursor-pointer" />
              </div>
              <p className="text-sm text-gray-500 mt-1">Build your content structure</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep("SELECT")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95">
              <Plus size={16} /> Add Field
            </button>
          </div>
        </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* KIRI: DAFTAR FIELD (PREVIEW) */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            {step === "CONFIG" ? (
              /* LIVE PREVIEW SAAT CONFIG */
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Live Preview</h4>
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Menu className="text-gray-300" size={20} />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedType?.color || "bg-gray-100 text-gray-500"}`}>
                      {selectedType && <selectedType.icon size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{fieldName || "Untitled Field"}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">{selectedType?.slug} type</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : initialData.pageFields.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-gray-100 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                    <Layers size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Start Building</h3>
                <p className="text-gray-500 text-sm max-w-sm mb-6">Your page structure is empty. Add your first field to get started.</p>
                <button onClick={() => setStep("SELECT")} className="text-blue-600 font-bold text-sm hover:underline">
                    + Add Field Now
                </button>
              </div>
            ) : (
              /* DAFTAR FIELD YANG SUDAH ADA */
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Current Structure</h4>
                {initialData.pageFields.map((f: any) => {
                   const typeDef = fieldTypes.find(t => t.slug === f.type);
                   return (
                    <div key={f.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-all group">
                        <div className="flex items-center gap-4">
                        <Menu size={18} className="text-gray-300 cursor-grab" />
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${typeDef?.color || "bg-gray-100"}`}>
                            {typeDef && <typeDef.icon size={14} />}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-gray-900 dark:text-white">{f.name}</div>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{f.type}</span>
                        </div>
                        </div>
                        <Trash2 size={18} className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors" />
                    </div>
                   );
                })}
              </div>
            )}
          </div>
        </div>

        {/* KANAN: PANEL OVERLAY (DRAWER) */}
        {(step === "SELECT" || step === "CONFIG") && (
          <div className="w-[480px] bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 flex flex-col shadow-2xl z-20 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">{step === "SELECT" ? "Select Field Type" : "Field Settings"}</h2>
              <button onClick={() => setStep("LIST")} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-slate-900/50 custom-scrollbar">
              {step === "SELECT" ? (
                
                /* --- 2. UPDATE TAMPILAN: LIST BARIS (BUKAN GRID) --- */
                <div className="flex flex-col gap-3">
                  {fieldTypes.map((t) => (
                    <button 
                      key={t.slug}
                      onClick={() => { setSelectedType(t); setStep("CONFIG"); }}
                      className="group flex items-center gap-4 p-4 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                    >
                      {/* Icon Box */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${t.color}`}>
                        <t.icon size={24} />
                      </div>

                      {/* Text Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {t.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                          {t.description}
                        </p>
                      </div>

                      {/* Arrow Indicator */}
                      <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                        <ChevronRight size={18} />
                      </div>
                    </button>
                  ))}
                </div>

              ) : (
                /* FORM CONFIG */
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-200">
                   <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center gap-3 border border-blue-100 dark:border-blue-900/50">
                      <Settings size={20} className="text-blue-600 dark:text-blue-400" />
                      <div>
                        <h2 className="font-bold text-sm text-blue-900 dark:text-blue-100">Configuration</h2>
                        <p className="text-xs text-blue-700 dark:text-blue-300">Set up your new {selectedType?.title} field.</p>
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                      <input 
                        autoFocus
                        type="text" 
                        value={fieldName} 
                        onChange={(e) => setFieldName(e.target.value)} 
                        placeholder="e.g. Hero Title" 
                        className="w-full p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-shadow shadow-sm" 
                      />
                      <p className="text-[10px] text-gray-400 mt-2 px-1">This will be the label used in the content editor.</p>
                   </div>

                   <div className="pt-6 border-t border-gray-200 dark:border-slate-800">
                     <button 
                        onClick={handleSave} 
                        disabled={isLoading} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                     >
                       {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />} 
                       Confirm & Create Field
                     </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}