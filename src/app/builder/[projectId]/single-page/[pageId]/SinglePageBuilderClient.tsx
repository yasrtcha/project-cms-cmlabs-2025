"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deletePage, updatePageName } from "@/app/builder/_actions/page-actions";
import { createNewField, reorderFields, updateField, deleteField } from "@/app/builder/_actions/field-actions";
import { createFieldGroup, deleteFieldGroup } from "@/app/builder/_actions/group-actions";
import { savePageComponents } from "@/app/builder/_actions/content-type-actions"; // Added import
import {
  MoreVertical, Trash2, FolderPlus, Plus, X, Type, Box, Edit3,
  Image as ImageIcon, Hash, Calendar, MapPin, Layers, Link as LinkIcon, Loader2, Menu, Settings, ChevronUp, Layout
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const fieldTypes = [
  { slug: "text", icon: Type, title: "Text Field", color: "bg-purple-600", desc: "Short or long texts, titles, etc." },
  { slug: "media", icon: ImageIcon, title: "Media Field", color: "bg-orange-500", desc: "Images, videos, or documents." },
  { slug: "number", icon: Hash, title: "Number Field", color: "bg-green-500", desc: "Numeric values, integers/decimals." },
  { slug: "date", icon: Calendar, title: "Date and Time", color: "bg-blue-500", desc: "Dates, time, calendar inputs." },
  { slug: "location", icon: MapPin, title: "Location", color: "bg-red-500", desc: "Geographic data, maps." },
  { slug: "multiple", icon: Layers, title: "Multiple Content", color: "bg-indigo-500", desc: "Flexible component combinations." },
  { slug: "relation", icon: LinkIcon, title: "Relation", color: "bg-pink-500", desc: "Link entries across content types." },
  { slug: "component", icon: Box, title: "Component", color: "bg-blue-600", desc: "Embed reusable components like Navbar/Footer." },
];

export default function SinglePageBuilderClient({ initialData, projectId, pageId, allContentTypes = [] }: any) {
  const router = useRouter();

  // --- STATE ---
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // New State for Attached Components
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [attachedComponents, setAttachedComponents] = useState<string[]>([]);

  const [selectedType, setSelectedType] = useState<any>(null);
  const [fieldName, setFieldName] = useState("");
  const [apiId, setApiId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);

  // Edit Mode State
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditPageModalOpen, setIsEditPageModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState(initialData.name);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Validation & Options State
  const [isRequired, setIsRequired] = useState(false);
  const [isUnique, setIsUnique] = useState(false);
  const [relationTarget, setRelationTarget] = useState("");

  // State lokal untuk list field groups
  const [fieldGroups, setFieldGroups] = useState<any[]>([]);

  // Sinkronisasi state lokal
  useEffect(() => {
    if (initialData.fieldGroups) {
      setFieldGroups(initialData.fieldGroups);
    }
    if (initialData.usedComponents) {
      setAttachedComponents(initialData.usedComponents.map((c: any) => c.id));
    }
  }, [initialData]);


  // Auto-generate API ID
  useEffect(() => {
    if (fieldName) {
      const generated = fieldName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_');
      setApiId(generated);
    }
  }, [fieldName, editingFieldId]);

  // --- HANDLERS ---
  const handleOpenAdd = (groupId: string) => {
    setTargetGroupId(groupId);
    setIsTypeModalOpen(true);
  };

  const handleSelectType = (type: any) => {
    setSelectedType(type);
    setEditingFieldId(null);
    setFieldName("");
    setApiId("");
    setIsRequired(false);
    setIsUnique(false);
    setRelationTarget("");

    setIsTypeModalOpen(false);
    setIsConfigOpen(true);
  };

  const handleEditClick = (field: any) => {
    const typeDef = fieldTypes.find(t => t.slug === field.type);
    setSelectedType(typeDef);
    setEditingFieldId(field.id);

    setFieldName(field.name);
    setApiId(field.apiId);
    setIsRequired(field.isRequired || false);
    setIsUnique(field.isUnique || false);

    let options = {};
    if (typeof field.options === 'string') {
      try { options = JSON.parse(field.options); } catch (e) { }
    } else {
      options = field.options || {};
    }
    setRelationTarget((options as any)?.relatedTypeId || "");

    setIsConfigOpen(true);
  };

  const handleDeleteFieldClick = async (fieldId: string) => {
    if (confirm("Delete this field?")) {
      const res = await deleteField(fieldId, projectId);
      if (!res.success) {
        alert("Failed to delete field");
      }
      router.refresh();
    }
  };

  const handleSaveGroup = async () => {
    if (!groupName) return alert("Please enter group name");
    setIsLoading(true);
    const res = await createFieldGroup({ name: groupName, pageId, projectId });
    if (res.success) {
      setGroupName("");
      setIsGroupModalOpen(false);
      router.refresh();
    } else {
      alert("Failed to create group");
    }
    setIsLoading(false);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (confirm("Delete this group and all its fields?")) {
      const res = await deleteFieldGroup(groupId, projectId);
      if (res.success) router.refresh();
      else alert("Failed to delete group");
    }
  };

  const handleSave = async () => {
    if (!fieldName) return alert("Please enter field name");
    setIsLoading(true);

    try {
      if (editingFieldId) {
        // UPDATE EXISTING
        const result = await updateField({
          fieldId: editingFieldId,
          projectId,
          name: fieldName,
          apiId: apiId,
          isRequired,
          isUnique,
          options: selectedType.slug === 'relation' || selectedType.slug === 'component' ? { relatedTypeId: relationTarget } : undefined
        });

        if (result.success) {
          setIsConfigOpen(false);
          router.refresh();
        } else {
          alert("Failed to update");
        }
      } else {
        // CREATE NEW
        const result = await createNewField({
          name: fieldName,
          type: selectedType.slug,
          pageId,
          projectId,
          fieldGroupId: targetGroupId || undefined
        });

        if (result.success) {
          if ((selectedType.slug === 'relation' || selectedType.slug === 'component') && relationTarget) {
            await updateField({
              fieldId: result.data!.id,
              projectId,
              options: { relatedTypeId: relationTarget }
            });
          }

          setFieldName("");
          setIsConfigOpen(false);
          router.refresh();
        } else {
          alert("Failed to create");
        }
      }
    } catch (e) {
      console.error(e);
      alert("Error saving field");
    }

    setIsLoading(false);
  };

  const handleDeletePage = async () => {
    if (confirm("Are you sure?")) {
      setIsDeleting(true);
      const result = await deletePage(pageId, projectId);
      if (result.success) router.push(`/builder/${projectId}`);
      else setIsDeleting(false);
    }
  };

  const handleUpdatePageName = async () => {
    if (!newPageName) return alert("Please enter page name");
    setIsLoading(true);
    const result = await updatePageName(pageId, newPageName, projectId);
    if (result.success) {
      setIsEditPageModalOpen(false);
      router.refresh();
    } else {
      alert("Failed to update page name");
    }
    setIsLoading(false);
  };

  const handleSaveComponents = async () => {
    setIsLoading(true);
    const res = await savePageComponents(pageId, attachedComponents);
    if (res.success) {
      setIsComponentModalOpen(false);
      router.refresh();
    } else {
      alert("Failed to save components");
    }
    setIsLoading(false);
  };


  // --- LOGIKA DRAG AND DROP ---
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.droppableId === result.destination.droppableId && result.source.index === result.destination.index) return;

    // Clone state groups
    const newFieldGroups = [...fieldGroups];

    // Cari group asal dan tujuan
    const sourceGroupIndex = newFieldGroups.findIndex(g => g.id === result.source.droppableId);

    if (sourceGroupIndex === -1) return;

    const group = { ...newFieldGroups[sourceGroupIndex] };
    const newFields = [...group.fields]; // Clone fields

    // Pindahkan item di array lokal
    const [movedField] = newFields.splice(result.source.index, 1);
    newFields.splice(result.destination.index, 0, movedField);

    // Update urutan 'order' secara lokal
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order: index
    }));

    group.fields = updatedFields;
    newFieldGroups[sourceGroupIndex] = group;

    setFieldGroups(newFieldGroups); // Optimistic Update

    // Simpan ke database
    const itemsToReorder = updatedFields.map((f) => ({
      id: f.id,
      order: f.order
    }));

    await reorderFields(itemsToReorder, projectId);
  };

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-slate-950 flex overflow-hidden font-sans transition-colors duration-300">

      {/* 1. CONTAINER KIRI (HEADER + KONTEN) */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">

        {/* HEADER */}
        <div className="px-8 py-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-950 shrink-0 shadow-sm z-10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg flex items-center justify-center text-xl shadow-sm">🏠</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                {initialData.name}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"><MoreVertical size={16} className="text-gray-400 dark:text-slate-500" /></button>
                  {isDropdownOpen && (
                    <div className="absolute top-8 left-0 bg-white dark:bg-slate-900 shadow-xl border border-gray-200 dark:border-slate-800 rounded-lg p-1 w-48 z-50 animate-in fade-in zoom-in-95">
                      <button
                        onClick={() => { setIsEditPageModalOpen(true); setIsDropdownOpen(false); }}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm p-2 w-full hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-colors font-bold"
                      >
                        <Edit3 size={14} /> Edit Name
                      </button>
                      <button onClick={handleDeletePage} className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm p-2 w-full hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors font-bold">
                        {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete Page
                      </button>
                    </div>
                  )}
                </div>
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">Content Builder • Struktur Laman</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsComponentModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <Box size={16} /> Components
            </button>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <FolderPlus size={16} /> Create Field Group
            </button>
            <button
              onClick={() => handleOpenAdd("")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 border-b-2 border-blue-800 dark:border-blue-700"
            >
              <Plus size={16} /> Add Field
            </button>
          </div>
        </div>

        {/* CONTENT AREA (DROP CONTEXT) */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8">
            <DragDropContext onDragEnd={onDragEnd}>
              {fieldGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/50 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
                  <Layout className="text-gray-300 dark:text-slate-700 mb-4" size={48} />
                  <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200">Mulai Membangun Struktur</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Buat Field Group pertama Anda untuk mengelompokkan field.</p>
                  <button
                    onClick={() => setIsGroupModalOpen(true)}
                    className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                  >
                    Buat Section Baru
                  </button>
                </div>
              ) : (
                fieldGroups.map((group: any) => (
                  <div key={group.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden group/section transition-all hover:shadow-md">
                    {/* Group Header */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 font-bold border border-blue-200/50 dark:border-blue-800/30">
                          <Layers size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-slate-100">{group.name}</h3>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest">{group.fields?.length || 0} Fields</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenAdd(group.id)}
                          className="p-2 px-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md transition-colors flex items-center gap-1.5 text-xs font-bold"
                        >
                          <Plus size={14} /> Add Field
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 rounded-md transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* AREA DROPPABLE */}
                    <Droppable droppableId={group.id} type="FIELD">
                      {(provided) => (
                        <div
                          className="p-4 bg-white dark:bg-slate-900 space-y-2 min-h-[50px]"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {group.fields && group.fields.length > 0 ? (
                            group.fields.map((field: any, index: number) => {
                              const typeDef = fieldTypes.find(t => t.slug === field.type) || fieldTypes[0];
                              return (
                                <Draggable key={field.id} draggableId={field.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      onClick={() => handleEditClick(field)}
                                      style={{ ...provided.draggableProps.style }}
                                      className={cn(
                                        "flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all cursor-pointer group bg-white dark:bg-slate-900",
                                        snapshot.isDragging && "shadow-xl ring-2 ring-blue-500 border-transparent z-50 opacity-90 scale-105"
                                      )}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-400 dark:text-slate-600"
                                        >
                                          <Menu size={16} />
                                        </div>

                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm border-b-2 border-black/10", typeDef.color)}>
                                          <typeDef.icon size={18} />
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">
                                            {field.name} {field.isRequired && <span className="text-red-500">*</span>}
                                          </h4>
                                          <p className="text-[10px] text-gray-500 dark:text-slate-500 font-bold uppercase tracking-tight">
                                            {field.apiId} • {field.type}
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteFieldClick(field.id); }}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  )}
                                </Draggable>
                              )
                            })
                          ) : (
                            <div className="py-8 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-xl">
                              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">Belum ada field di section ini.</p>
                              <button
                                onClick={() => handleOpenAdd(group.id)}
                                className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                + Tambah Field Pertama
                              </button>
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))
              )}
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* 2. SIDEBAR KONFIGURASI (KANAN) - Tetap sama, tidak berubah */}
      <div
        className={cn(
          "bg-white dark:bg-slate-900 flex flex-col shadow-2xl z-30 transition-all duration-300 ease-in-out h-full overflow-hidden shrink-0 border-l border-gray-200 dark:border-slate-800",
          isConfigOpen ? "w-[420px] opacity-100" : "w-0 border-none opacity-0 invisible"
        )}
      >
        <div className="w-[420px] flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0 shadow-sm transition-colors">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-slate-100">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30"><Settings size={18} /></div>
              {editingFieldId ? "Edit Konfigurasi" : "Konfigurasi Baru"}
            </div>
            <button onClick={() => setIsConfigOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={20} className="text-gray-500 dark:text-slate-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20 custom-scrollbar">
            {selectedType && (
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm transition-colors">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg border-b-2 border-black/10", selectedType.color)}>
                  <selectedType.icon size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 dark:text-slate-100 leading-none">{selectedType.title}</h5>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1.5 font-medium">{selectedType.desc}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-1">Pengaturan Dasar</h4>
              <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-2 px-1">Display Name</label>
                  <input
                    type="text"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-sm font-semibold transition-all text-gray-900 dark:text-slate-100 dark:placeholder:text-slate-700"
                    placeholder="Contoh: Judul Utama"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-2 px-1">API ID (Unique Key)</label>
                  <input
                    type="text"
                    value={apiId}
                    onChange={(e) => setApiId(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-sm font-mono text-gray-900 dark:text-blue-400 transition-all font-bold"
                  />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 font-medium px-1 italic leading-tight">Digunakan sebagai key pada JSON API response.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-1">Validasi Data</h4>
              <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">Wajib Diisi (Required)</span>
                    <span className="text-[10px] text-gray-500 dark:text-slate-500 font-medium">Field tidak boleh dikosongkan.</span>
                  </div>
                  <input type="checkbox" checked={isRequired} onChange={e => setIsRequired(e.target.checked)} className="w-5 h-5 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-950" />
                </label>
                <div className="h-[1px] bg-gray-50 dark:bg-slate-800 w-full" />
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">Nilai Unik (Unique)</span>
                    <span className="text-[10px] text-gray-500 dark:text-slate-500 font-medium">Menghindari duplikasi nilai field.</span>
                  </div>
                  <input type="checkbox" checked={isUnique} onChange={e => setIsUnique(e.target.checked)} className="w-5 h-5 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-950" />
                </label>
              </div>
            </div>

            {(selectedType?.slug === 'relation' || selectedType?.slug === 'component') && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-1">
                  {selectedType?.slug === 'relation' ? 'Konfigurasi Relasi' : 'Pilih Component'}
                </h4>
                <div className={cn(
                  "p-5 bg-white dark:bg-slate-900 rounded-xl border shadow-sm space-y-4 transition-colors",
                  selectedType?.slug === 'relation' ? "border-pink-100 dark:border-pink-900/30" : "border-blue-100 dark:border-blue-900/30"
                )}>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-2 px-1">
                      {selectedType?.slug === 'relation' ? 'Hubungkan Ke Content Model' : 'Embed Component'}
                    </label>
                    <select
                      value={relationTarget}
                      onChange={(e) => setRelationTarget(e.target.value)}
                      className={cn(
                        "w-full p-3 rounded-lg bg-gray-50 dark:bg-slate-950 border outline-none focus:ring-2 text-sm font-bold transition-all text-gray-900 dark:text-slate-100",
                        selectedType?.slug === 'relation' ? "border-gray-200 dark:border-slate-800 focus:ring-pink-500 dark:focus:ring-pink-600" : "border-gray-200 dark:border-slate-800 focus:ring-blue-500 dark:focus:ring-blue-600"
                      )}
                    >
                      <option value="">-- Pilih {selectedType?.slug === 'relation' ? 'Model' : 'Component'} --</option>
                      {allContentTypes
                        .filter((ct: any) => selectedType?.slug === 'relation' ? true : ct.type === 'COMPONENT')
                        .map((ct: any) => (
                          <option key={ct.id} value={ct.id}>{ct.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 shrink-0 transition-colors">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-black rounded-xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 border-b-2 border-blue-800 dark:border-blue-700"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : null}
              {editingFieldId ? "Simpan Perubahan" : "Simpan Field Baru"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MODALS */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30"><FolderPlus size={24} /></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Create Field Group</h2>
              </div>
              <button onClick={() => setIsGroupModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={24} className="text-gray-400 dark:text-slate-500" /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-500 dark:text-slate-500 block mb-2 uppercase tracking-[0.2em] px-1">Group Name</label>
                <input
                  type="text"
                  autoFocus
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Contoh: Section Hero, SEO Meta, dsb."
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-bold text-gray-900 dark:text-slate-100 transition-all shadow-inner placeholder:text-gray-300 dark:placeholder:text-slate-700"
                />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-4 leading-relaxed italic px-1 font-medium italic">Field Group digunakan untuk mengelompokkan beberapa field agar struktur konten lebih rapi dan mudah dikelola oleh editor.</p>
              </div>
              <button
                onClick={handleSaveGroup}
                disabled={isLoading || !groupName}
                className="w-full py-4 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-black rounded-xl shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 border-b-2 border-blue-800 dark:border-blue-700"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {isTypeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Pilih Tipe Field</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 font-medium italic leading-none">Gunakan tipe field yang paling sesuai untuk data Anda.</p>
              </div>
              <button onClick={() => setIsTypeModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={28} className="text-gray-400 dark:text-slate-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
              {fieldTypes.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => handleSelectType(t)}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-slate-950 rounded-xl border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all text-left group shadow-sm bg-slate-50/50 dark:bg-slate-900/50 active:scale-95"
                >
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg border-b-2 border-black/10", t.color)}>
                    <t.icon size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight truncate">{t.title}</div>
                    <div className="text-[10px] text-gray-500 dark:text-slate-500 leading-tight mt-1.5 font-bold uppercase tracking-tight">{t.desc}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-300 dark:text-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-all shrink-0">
                    <ChevronUp size={16} className="rotate-90" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {isEditPageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30"><Edit3 size={24} /></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Edit Page Name</h2>
              </div>
              <button onClick={() => setIsEditPageModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={24} className="text-gray-400 dark:text-slate-500" /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-500 dark:text-slate-500 block mb-2 uppercase tracking-[0.2em] px-1">Page Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  placeholder="Enter new page name"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-bold text-gray-900 dark:text-slate-100 transition-all shadow-inner placeholder:text-gray-300 dark:placeholder:text-slate-700"
                />
              </div>
              <button
                onClick={handleUpdatePageName}
                disabled={isLoading || !newPageName}
                className="w-full py-4 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-black rounded-xl shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 border-b-2 border-blue-800 dark:border-blue-700"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                Update Name
              </button>
            </div>
          </div>
        </div>
      )}

      {isComponentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/30"><Box size={24} /></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Attach Components</h2>
              </div>
              <button onClick={() => setIsComponentModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={24} className="text-gray-400 dark:text-slate-500" /></button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Select components to be available for this page in Content Management.</p>

              {allContentTypes
                .filter((ct: any) => ct.type === 'COMPONENT')
                .map((comp: any) => (
                  <label key={comp.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-100 dark:border-slate-800 cursor-pointer hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                        <Box size={16} className="text-gray-600 dark:text-slate-400" />
                      </div>
                      <span className="font-bold text-gray-800 dark:text-slate-200">{comp.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={attachedComponents.includes(comp.id)}
                      onChange={(e) => {
                        if (e.target.checked) setAttachedComponents([...attachedComponents, comp.id]);
                        else setAttachedComponents(attachedComponents.filter(id => id !== comp.id));
                      }}
                      className="w-5 h-5 rounded border-gray-300 dark:border-slate-700 text-orange-600 focus:ring-orange-500"
                    />
                  </label>
                ))
              }

              {allContentTypes.filter((ct: any) => ct.type === 'COMPONENT').length === 0 && (
                <div className="p-8 text-center text-gray-400 italic">No components available. Create one first!</div>
              )}
            </div>

            <button
              onClick={handleSaveComponents}
              disabled={isLoading}
              className="w-full mt-6 py-4 bg-orange-600 dark:bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-500 text-white font-black rounded-xl shadow-2xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 border-b-2 border-orange-800 dark:border-orange-700"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : null}
              Save Components
            </button>
          </div>
        </div>
      )}
    </div>


  );
}