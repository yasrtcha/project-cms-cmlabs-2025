"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Save, Image as ImageIcon, Link as LinkIcon, ChevronDown, Loader2, ExternalLink, Trash2, Search, ArrowLeft } from "lucide-react";
import { saveContentEntry, getRelationOptions } from "@/app/builder/_actions/content-entry-actions";
import { cn } from "@/lib/utils";

// =========================================================
// 1. SUB-KOMPONEN: RENDER FIELD (INPUT DINAMIS)
// =========================================================
const RenderField = ({ field, value, onChange }: any) => {
  const [relationOptions, setRelationOptions] = useState<{value: string, label: string}[]>([]);
  const [loadingRel, setLoadingRel] = useState(false);

  useEffect(() => {
    if (field.type === 'relation' && field.options?.relatedTypeId) {
      setLoadingRel(true);
      getRelationOptions(field.options.relatedTypeId)
        .then(res => {
          if (res.success) setRelationOptions(res.data || []);
          setLoadingRel(false);
        });
    }
  }, [field.type, field.options]);

  const inputClass = "w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400";

  switch (field.type) {
    case "text":
      return (
        <input 
          type="text" 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          placeholder={`Enter ${field.name}...`}
        />
      );
    
    case "number":
      return (
        <input 
          type="number" 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          placeholder="0"
        />
      );

    case "media":
      return (
        <div className="relative group w-full">
          {value ? (
             <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-4 flex items-center gap-4 w-full">
                <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                    <ImageIcon className="text-blue-500" size={32} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><ExternalLink size={10}/> Media Asset Uploaded</p>
                </div>
                <button 
                  onClick={() => onChange("")} 
                  className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Remove Image"
                >
                    <Trash2 size={20} />
                </button>
             </div>
          ) : (
             <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 group-hover:border-blue-400 w-full">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                   <ImageIcon className="text-gray-400 group-hover:text-blue-500" size={24} />
                </div>
                <div>
                   <p className="text-base font-bold text-gray-700 group-hover:text-blue-600">Click to upload image</p>
                   <p className="text-sm text-gray-400 mt-1">SVG, PNG, JPG or GIF</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={() => {
                      setTimeout(() => onChange("https://via.placeholder.com/600x400"), 500); 
                  }} 
                />
             </label>
          )}
        </div>
      );

    case "relation":
      return (
        <div className="relative w-full">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClass, "appearance-none cursor-pointer pr-10")}
            disabled={loadingRel}
          >
            <option value="">-- Select Related Content --</option>
            {relationOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
             {loadingRel ? <Loader2 size={16} className="animate-spin"/> : <ChevronDown size={16} />}
          </div>
          {relationOptions.length === 0 && !loadingRel && (
            <div className="mt-2 text-[10px] text-orange-600 bg-orange-50 p-2 rounded border border-orange-100 flex items-start gap-2">
               <span className="font-bold">Note:</span> No content found in related model.
            </div>
          )}
        </div>
      );
      
    default:
      return <input type="text" className={inputClass} disabled placeholder={`Unsupported field type: ${field.type}`} />;
  }
};

// =========================================================
// 2. KOMPONEN UTAMA FORM
// =========================================================
export default function ContentForm({ schema, initialData, projectId, entryId }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"CONTENT" | "SEO">("CONTENT");
  
  // Data State
  const [formData, setFormData] = useState<any>(initialData?.data || {});
  const [seoData, setSeoData] = useState<any>(initialData?.seoData || {});
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isSinglePage = schema.type === 'SINGLE';
  const isEditing = entryId && entryId !== 'new';

  const handleFieldChange = (apiId: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [apiId]: val }));
  };

  const handleSeoChange = (key: string, val: any) => {
    setSeoData((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await saveContentEntry({
      contentTypeId: schema.id,
      entryId: entryId, 
      data: formData,
      seoData: seoData,
      status: "PUBLISHED"
    });

    setIsSaving(false);
    if (res.success) {
       setLastSaved(new Date());
       if (!isSinglePage && !isEditing) {
          router.push(`/builder/${projectId}/content-management/collection/${schema.id}`);
       }
    } else {
       alert("Failed to save content.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 font-sans">
      
      {/* --- HEADER STICKY --- */}
      <div className="px-8 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-40 shadow-sm">
        
        {/* KIRI */}
        <div className="flex items-center gap-6">
           {!isSinglePage && (
             <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors">
               <ArrowLeft size={20} />
             </button>
           )}

           <div className="flex flex-col">
              {!isSinglePage && (
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-0.5 font-medium">
                   <span className="uppercase tracking-wider">{schema.name}</span>
                   <span>/</span>
                   <span className={cn(isEditing ? "text-blue-600" : "text-green-600", "font-bold")}>
                      {isEditing ? 'Editing' : 'New Entry'}
                   </span>
                </div>
              )}
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                 {isSinglePage ? schema.name : (isEditing ? 'Edit Content' : 'Create Content')}
              </h1>
           </div>

           <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-lg ml-6 h-9">
              <button 
                onClick={() => setActiveTab("CONTENT")}
                className={cn(
                  "px-4 text-xs font-bold rounded-md transition-all flex items-center gap-2",
                  activeTab === "CONTENT" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Content
              </button>
              {schema.hasSeo && (
                <button 
                  onClick={() => setActiveTab("SEO")}
                  className={cn(
                    "px-4 text-xs font-bold rounded-md transition-all flex items-center gap-2",
                    activeTab === "SEO" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  SEO
                </button>
              )}
           </div>
        </div>

        {/* KANAN */}
        <div className="flex items-center gap-4">
           {lastSaved && (
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider animate-in fade-in">
               Saved {lastSaved.toLocaleTimeString()}
             </span>
           )}
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
           >
             {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
             {isSaving ? "Saving..." : "Save Changes"}
           </button>
        </div>
      </div>

      {/* --- FORM SCROLL AREA --- */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8 pb-32">

          {/* TAB 1: KONTEN UTAMA */}
          {activeTab === "CONTENT" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300 fade-in">
              {schema.fieldGroups.map((group: any) => (
                <div key={group.id} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  
                  {/* Group Header */}
                  <div className="px-6 py-4 bg-gray-50/80 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                     <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">{group.name}</h3>
                  </div>

                  {/* Fields Container (VERTICAL STACK - KEMBALI KE ASAL) */}
                  <div className="p-6 space-y-8">
                    {group.fields.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50/30 rounded-lg border border-dashed border-gray-200">
                        <p className="text-xs text-gray-400 font-medium">No fields defined in this section.</p>
                      </div>
                    ) : (
                      group.fields.map((field: any) => (
                        <div key={field.id} className="space-y-2">
                           {/* LABEL DI ATAS (HEADER STYLE) */}
                           <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1">
                                {field.name}
                                {field.isRequired && <span className="text-red-500" title="Required">*</span>}
                              </label>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-mono bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                  {field.apiId}
                                </span>
                                {field.type === 'relation' && (
                                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                     <LinkIcon size={8} /> Relation
                                  </span>
                                )}
                              </div>
                           </div>
                           
                           {/* INPUT FULL WIDTH DI BAWAH */}
                           <RenderField 
                              field={field} 
                              value={formData[field.apiId]} 
                              onChange={(val: any) => handleFieldChange(field.apiId, val)}
                              projectId={projectId}
                           />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SEO */}
          {activeTab === "SEO" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-8 animate-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-slate-800">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <Search size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Search Engine Optimization</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Control how this content appears in search engine results.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Meta Title</label>
                      <input 
                        type="text" 
                        className="w-full p-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        value={seoData.metaTitle || ""}
                        onChange={e => handleSeoChange("metaTitle", e.target.value)}
                        placeholder="e.g. Page Title"
                        maxLength={60}
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Meta Description</label>
                      <textarea 
                        className="w-full p-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg h-28 resize-none text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        value={seoData.metaDescription || ""}
                        onChange={e => handleSeoChange("metaDescription", e.target.value)}
                        placeholder="Write a brief description..."
                        maxLength={160}
                      />
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}