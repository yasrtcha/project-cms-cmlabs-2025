"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createNewField } from "@/app/builder/_actions/field-actions";
import {
  MoreVertical, Trash2, FileText, FilePenLine, FolderPlus, Plus, X, Type,
  Image as ImageIcon, Hash, Calendar, MapPin, Layers, Link as LinkIcon, Loader2, Menu, Settings, ChevronUp, ChevronDown
} from "lucide-react";

const fieldTypes = [
  { slug: "text", icon: Type, title: "Text Field", description: "used for short or long texts, such as titles, names, rich texts, etc." },
  { slug: "media", icon: ImageIcon, title: "Media Field", description: "Used for uploading and managing files like images, videos, audios or documents" },
  { slug: "number", icon: Hash, title: "Number Field", description: "Used for numeric values with options for integers and decimals." },
  { slug: "date", icon: Calendar, title: "Date and Time", description: "Used for temporal data with calendar inputs, time, and configurable formatting" },
  // ... (sisanya tetap sama)
];

export default function SinglePageBuilderClient({ initialData, projectId, pageId }: any) {
  const router = useRouter();
  
  // --- STATE UNTUK FLOW (Tetap di satu halaman) ---
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
      setStep("LIST"); // Kembali ke daftar
      setFieldName("");
      router.refresh(); // Update data dari DB
    } else {
      alert("Failed to save");
    }
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full bg-white dark:bg-slate-950 flex flex-col overflow-hidden relative">
      
      {/* --- HEADER (Tampilan Tetap Sama) --- */}
      <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center border border-orange-200 text-2xl">🏠</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase">{initialData.name} :</h1>
                <MoreVertical size={20} className="text-gray-500 cursor-pointer" />
              </div>
              <p className="text-sm text-gray-500 mt-1">Build your content structure</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep("SELECT")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm">
              <Plus size={16} /> Add Field
            </button>
          </div>
        </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* KIRI: DAFTAR FIELD / PREVIEW */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-slate-900/50">
          <div className="max-w-4xl">
            {step === "CONFIG" ? (
              /* LIVE PREVIEW SAAT CONFIG */
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Live Preview</h4>
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <Menu className="text-gray-300" size={20} />
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                      {selectedType && <selectedType.icon size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{fieldName || "Untitled Field"}</h3>
                      <p className="text-[10px] text-purple-600 uppercase tracking-[0.2em] font-black">{selectedType?.slug} type</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : initialData.pageFields.length === 0 ? (
              /* EMPTY STATE (TAMPILAN LAMA ANDA) */
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-gray-100">
                <h2 className="text-3xl font-extrabold text-[#3A7AC3] mb-6">Content Builder</h2>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white border rounded-xl shadow-sm"><FileText className="text-blue-600" size={28} /></div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">No Content Structure Yet</h3>
                    <p className="text-gray-600 text-sm max-w-2xl">Start building your content structure to make this page functional.</p>
                  </div>
                </div>
              </div>
            ) : (
              /* DAFTAR FIELD YANG SUDAH ADA */
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Current Structure</h4>
                {initialData.pageFields.map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-all group">
                    <div className="flex items-center gap-4">
                      <Menu size={18} className="text-gray-300" />
                      <div className="font-bold text-sm">{f.name}</div>
                      <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-400 uppercase">{f.type}</span>
                    </div>
                    <Trash2 size={18} className="text-gray-300 hover:text-red-500 cursor-pointer" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KANAN: PANEL OVERLAY (DRAWER) UNTUK PILIH & CONFIG */}
        {(step === "SELECT" || step === "CONFIG") && (
          <div className="w-[450px] bg-white dark:bg-slate-900 border-l border-gray-200 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50/50">
              <h2 className="font-bold">{step === "SELECT" ? "Select Field Type" : "Field Settings"}</h2>
              <X size={20} className="cursor-pointer text-gray-400" onClick={() => setStep("LIST")} />
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {step === "SELECT" ? (
                /* GRID PILIH TIPE (TAMPILAN LAMA ANDA) */
                <div className="grid grid-cols-1 gap-4">
                  {fieldTypes.map((field) => (
                    <div 
                      key={field.slug}
                      onClick={() => { setSelectedType(field); setStep("CONFIG"); }}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-blue-200 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><field.icon className="text-white" size={24} /></div>
                      <div>
                        <h3 className="font-bold text-sm">{field.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{field.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* FORM CONFIG (TAMPILAN LAMA ANDA) */
                <div className="space-y-8">
                   <div className="flex items-center gap-3 text-blue-600"><Settings size={20} /><h2 className="font-bold text-base">Basic Config</h2></div>
                   <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Field Name</label>
                      <input 
                        type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} 
                        placeholder="e.g. Hero Title" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                   </div>
                   <div className="pt-6 border-t"><button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3">
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />} Confirm & Add Field
                   </button></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}