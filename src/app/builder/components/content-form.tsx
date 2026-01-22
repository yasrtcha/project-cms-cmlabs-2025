"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon, ChevronDown, Loader2, ExternalLink, Trash2, Search, ArrowLeft, Plus, Box, Menu, Settings } from "lucide-react";
import { saveContentEntry, getRelationOptions } from "@/app/builder/_actions/content-entry-actions";
import { uploadFile } from "@/app/builder/_actions/upload-actions";
import { saveSectionsOrder } from "@/app/builder/_actions/content-type-actions";
import { cn } from "@/lib/utils";
import { AsyncRelationSelect } from "./async-relation-select";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

// =========================================================
// 1. SUB-KOMPONEN: RENDER FIELD
// =========================================================
const RenderField = ({ field, value, onChange, componentSchemas = [] }: any) => {
  const [relationOptions, setRelationOptions] = useState<{ value: string, label: string }[]>([]);
  const [loadingRel, setLoadingRel] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadFile(formData);

    if (res.success && res.url) {
      onChange(res.url);
    } else {
      alert("Upload failed: " + res.error);
    }
    setUploading(false);
  };

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
              <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{value.split('/').pop()}</p>
                <a href={value} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                    <ExternalLink size={10} /> View Full Image
                </a>
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
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 group-hover:border-blue-400 w-full relative">
              {uploading ? (
                 <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Uploading...</span>
                 </div>
              ) : (
                <>
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
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                </>
              )}
            </label>
          )}
        </div>
      );

    case "relation":
      if (!field.options?.relatedTypeId) {
          return <div className="text-xs text-red-500 p-2 bg-red-50 rounded">Config Error: Related Content Type ID is missing.</div>;
      }
      return (
        <AsyncRelationSelect
          contentTypeId={field.options.relatedTypeId}
          value={value || ""}
          onChange={(val) => onChange(val)}
          placeholder={`Select ${field.name}...`}
        />
      );

    // --- MODIFIED: COMPONENT HANDLING ---
    case "component":
      const compId = field.options?.relatedTypeId;
      const compSchema = componentSchemas.find((s: any) => s.id === compId);
      
      if (!compSchema) return <div className="text-xs text-red-500">Component schema not found ({compId})</div>;

      const handleCompFieldChange = (subApiId: string, subVal: any) => {
        onChange({ ...(value || {}), [subApiId]: subVal });
      };

      // Gunakan Wrapper baru di bawah
      return (
        <ComponentFieldWrapper 
            schema={compSchema} 
            value={value || {}} 
            onChange={handleCompFieldChange} 
            componentSchemas={componentSchemas}
        />
      );

    case "multiple":
      const items = Array.isArray(value) ? value : [];
      const subFields = field.options?.subFields || [];

      const handleAddItem = () => {
        onChange([...items, {}]);
      };

      const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
      };

      const handleUpdateItem = (index: number, subApiId: string, val: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [subApiId]: val };
        onChange(newItems);
      };

      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {subFields.map((sub: any) => (
                    <div key={sub.apiId} className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{sub.name}</label>
                      <RenderField
                        field={sub}
                        value={item[sub.apiId]}
                        onChange={(val: any) => handleUpdateItem(idx, sub.apiId, val)}
                        componentSchemas={componentSchemas}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all border border-blue-100"
          >
            <Plus size={14} /> Add {field.name.replace(/s$/, '')} link
          </button>
        </div>
      );

    default:
      return <input type="text" className={inputClass} disabled placeholder={`Unsupported field type: ${field.type}`} />;
  }
};

// =========================================================
// 2. KOMPONEN UTAMA FORM
// =========================================================
export default function ContentForm({ schema, initialData, projectId, entryId, componentSchemas = [] }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"CONTENT" | "SEO">("CONTENT");

  const [formData, setFormData] = useState<any>(initialData?.data || {});
  const [seoData, setSeoData] = useState<any>(initialData?.seoData || {});

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    const groups = (schema.fieldGroups || []).map((g: any) => ({ ...g, sectionType: 'GROUP' }));
    const components = (schema.usedComponents || []).map((c: any) => ({ ...c, sectionType: 'COMPONENT' }));

    let combined = [];
    if (schema.sectionsOrder && Array.isArray(schema.sectionsOrder)) {
      combined = (schema.sectionsOrder as any[]).map((orderItem: any) => {
        if (orderItem.type === 'GROUP') {
          return groups.find((g: any) => g.id === orderItem.id);
        } else {
          return components.find((c: any) => c.id === orderItem.id);
        }
      }).filter(Boolean);

      const existingIds = new Set((schema.sectionsOrder as any[]).map((o: any) => o.id));
      const newGroups = groups.filter((g: any) => !existingIds.has(g.id));
      const newComps = components.filter((c: any) => !existingIds.has(c.id));
      combined = [...combined, ...newGroups, ...newComps];
    } else {
      combined = [...groups, ...components];
    }
    setSections(combined);
  }, [schema.fieldGroups, schema.usedComponents, schema.sectionsOrder]);

  const isSinglePage = schema.type === 'SINGLE' || schema.type === 'COMPONENT'; // Treat Component as Single
  const isEditing = entryId && entryId !== 'new';

  const handleFieldChange = (apiId: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [apiId]: val }));
  };

  const handleSeoChange = (key: string, val: any) => {
    setSeoData((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleAttachedComponentChange = (compSlug: string, fieldApiId: string, val: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [compSlug]: {
        ...(prev[compSlug] || {}),
        [fieldApiId]: val
      }
    }));
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);

    const orderToSave = items.map((s: any) => ({
      type: s.sectionType,
      id: s.id
    }));

    await saveSectionsOrder(schema.id, orderToSave);
    router.refresh();
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
      alert("Failed to save content: " + res.error);
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
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="content-sections" type="SECTION">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-8"
                    >
                      {sections.map((section: any, index: number) => {
                        const isGroup = section.sectionType === 'GROUP';

                        return (
                          <Draggable key={`${section.sectionType}-${section.id}`} draggableId={`${section.sectionType}-${section.id}`} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={cn(
                                  "transition-all",
                                  snapshot.isDragging && "z-50 scale-[1.02]"
                                )}
                              >
                                {isGroup ? (
                                  <div className={cn(
                                    "bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden",
                                    snapshot.isDragging && "shadow-xl ring-2 ring-blue-500 border-transparent"
                                  )}>
                                    {/* Group Header */}
                                    <div className="px-6 py-4 bg-gray-50/80 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between group">
                                      <div className="flex items-center gap-3">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded cursor-grab active:cursor-grabbing text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <Menu size={16} />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">{section.name}</h3>
                                      </div>
                                    </div>
                                    <div className="p-6 space-y-8">
                                      {section.fields?.map((field: any) => (
                                        <div key={field.id} className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1">
                                              {field.name}
                                              {field.isRequired && <span className="text-red-500">*</span>}
                                            </label>
                                            <span className="text-[10px] text-gray-400 font-mono bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{field.apiId}</span>
                                          </div>
                                          <RenderField
                                            field={field}
                                            value={formData[field.apiId]}
                                            onChange={(val: any) => handleFieldChange(field.apiId, val)}
                                            componentSchemas={componentSchemas}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  // --- IMPROVED COMPONENT UI (Collapsible) ---
                                  <ComponentFieldWrapper 
                                    schema={section} 
                                    value={formData[section.slug] || {}} 
                                    onChange={(val: any) => {
                                        // Update parent formData for this component
                                        // val is the new object for this component
                                        setFormData((prev: any) => ({ ...prev, [section.slug]: val }));
                                    }}
                                    componentSchemas={componentSchemas}
                                    isTopLevel={true} // Indikator ini component top-level di page
                                  />
                                )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          {/* TAB 2: SEO */}
          {activeTab === "SEO" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-8 animate-in slide-in-from-right-4 duration-300">
              {/* ... SEO Content same as before ... */}
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

// =========================================================
// 3. SUB-KOMPONEN: WRAPPER COMPONENT (ACCORDION)
// =========================================================
function ComponentFieldWrapper({ schema, value, onChange, componentSchemas, isTopLevel = false }: any) {
  // Jika Top Level (dari Page Builder), default terbuka. Jika nested, tertutup.
  const [isOpen, setIsOpen] = useState(isTopLevel);

  const handleFieldChange = (subApiId: string, subVal: any) => {
     onChange({ ...value, [subApiId]: subVal });
  };

  return (
    <div className={cn(
        "border rounded-xl overflow-hidden shadow-sm transition-all",
        isTopLevel 
            ? "bg-orange-50/30 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30" 
            : "bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30"
    )}>
      {/* Header Klik untuk Buka/Tutup */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
            "flex items-center justify-between px-6 py-4 cursor-pointer transition-colors border-b",
            isTopLevel
                ? "bg-orange-100/50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30 hover:bg-orange-200/50"
                : "bg-blue-100/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 hover:bg-blue-200/50"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-1 rounded-md", isTopLevel ? "text-orange-500" : "text-blue-500")}>
            {isTopLevel ? <Menu size={16} /> : <Box size={16} />}
          </div>
          <span className={cn("text-sm font-bold uppercase tracking-wider", isTopLevel ? "text-orange-800 dark:text-orange-200" : "text-blue-800 dark:text-blue-200")}>
            {schema.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
            {isTopLevel && <span className="text-[10px] bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md border border-orange-100 dark:border-orange-900/50 font-mono">{schema.slug}</span>}
            <ChevronDown size={16} className={cn("text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </div>
      </div>

      {/* Body Form */}
      {isOpen && (
        <div className="p-6 space-y-6 bg-white/50 dark:bg-slate-900/50 animate-in slide-in-from-top-2 duration-200">
          {(schema.fieldGroups || []).flatMap((g: any) => g.fields).map((subField: any) => (
            <div key={subField.id} className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                {subField.name}
              </label>
              <RenderField
                field={subField}
                value={value[subField.apiId]}
                onChange={(val: any) => handleFieldChange(subField.apiId, val)}
                componentSchemas={componentSchemas}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}