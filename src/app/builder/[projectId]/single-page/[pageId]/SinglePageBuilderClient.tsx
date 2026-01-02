"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deletePage } from "@/app/builder/_actions/page-actions";
import { createNewField, reorderFields, updateField, deleteField } from "@/app/builder/_actions/field-actions";
import {
  MoreVertical, Trash2, FileText, FolderPlus, Plus, X, Type,
  Image as ImageIcon, Hash, Calendar, MapPin, Layers, Link as LinkIcon, Loader2, Menu, Settings, ChevronUp, ChevronDown, CheckSquare, Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const fieldTypes = [
  { slug: "text", icon: Type, title: "Text Field", color: "bg-purple-600", desc: "Short or long texts, titles, etc." },
  { slug: "media", icon: ImageIcon, title: "Media Field", color: "bg-orange-500", desc: "Images, videos, or documents." },
  { slug: "number", icon: Hash, title: "Number Field", color: "bg-green-500", desc: "Numeric values, integers/decimals." },
  { slug: "date", icon: Calendar, title: "Date and Time", color: "bg-blue-500", desc: "Dates, time, calendar inputs." },
  { slug: "location", icon: MapPin, title: "Location", color: "bg-red-500", desc: "Geographic data, maps." },
  { slug: "multiple", icon: Layers, title: "Multiple Content", color: "bg-indigo-500", desc: "Flexible component combinations." },
  { slug: "relation", icon: LinkIcon, title: "Relation", color: "bg-pink-500", desc: "Link entries across content types." },
];

export default function SinglePageBuilderClient({ initialData, projectId, pageId, allContentTypes = [] }: any) {
  const router = useRouter();

  // --- STATE ---
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const [selectedType, setSelectedType] = useState<any>(null); // TypeDef object
  const [fieldName, setFieldName] = useState("");
  const [apiId, setApiId] = useState("");

  // Edit Mode State
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Validation & Options State
  const [isRequired, setIsRequired] = useState(false);
  const [isUnique, setIsUnique] = useState(false);
  const [relationTarget, setRelationTarget] = useState(""); // For Relation Field

  // State lokal untuk list field
  const [fields, setFields] = useState<any[]>([]);

  // Sinkronisasi state lokal
  useEffect(() => {
    if (initialData.fieldGroups) {
      const flattened = initialData.fieldGroups.flatMap((group: any) => group.fields);
      setFields(flattened);
    }
  }, [initialData]);

  // Auto-generate API ID when name changes (only for new fields)
  useEffect(() => {
    if (!editingFieldId && fieldName) {
      const generated = fieldName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_');
      setApiId(generated);
    }
  }, [fieldName, editingFieldId]);

  // --- HANDLERS ---
  const handleOpenAdd = () => setIsTypeModalOpen(true);

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

    // Parse options for relation
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
      // Optimistic update
      const newFields = fields.filter(f => f.id !== fieldId);
      setFields(newFields);

      const res = await deleteField(fieldId, projectId);
      if (!res.success) {
        alert("Failed to delete field");
        router.refresh(); // Revert
      }
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
          apiId: apiId, // Allow updating API ID if needed, or keep it readonly in UI
          isRequired,
          isUnique,
          options: selectedType.slug === 'relation' ? { relatedTypeId: relationTarget } : undefined
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
          projectId
        });

        if (result.success) {
          if (selectedType.slug === 'relation' && relationTarget) {
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

  // --- LOGIKA DRAG AND DROP ---
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // 1. Reorder Lokal (Optimistic UI)
    const newFields = Array.from(fields);
    const [reorderedItem] = newFields.splice(sourceIndex, 1);
    newFields.splice(destinationIndex, 0, reorderedItem);

    setFields(newFields); // Update tampilan langsung

    // 2. Simpan urutan ke Database
    const updates = newFields.map((field, index) => ({
      id: field.id,
      order: index,
    }));

    await reorderFields(updates, projectId);
  };

  return (
    <div className="h-full w-full bg-white flex overflow-hidden font-sans">

      {/* 1. CONTAINER KIRI (HEADER + KONTEN) */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center text-2xl">🏠</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {initialData.name} :
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}><MoreVertical size={18} className="text-gray-400" /></button>
                  {isDropdownOpen && (
                    <div className="absolute top-6 left-0 bg-white shadow-xl border rounded-md p-2 w-48 z-50">
                      <button onClick={handleDeletePage} className="flex items-center gap-2 text-red-600 text-sm p-2 w-full hover:bg-red-50 rounded">
                        {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete Page
                      </button>
                    </div>
                  )}
                </div>
              </h1>
              <p className="text-xs text-gray-500">Build your content structure</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">
              <FolderPlus size={16} /> Create Field Group
            </button>
            <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">
              <Plus size={16} /> Add Field
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 p-10 overflow-y-auto bg-white">
          <div className="max-w-4xl bg-[#D9D9D9] rounded-lg p-8 min-h-[400px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Content Builder</h2>

            {fields.length === 0 ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="text-blue-500 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">No Content Structure Yet</h3>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                      Start building your content structure...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* IMPLEMENTASI DRAG AND DROP CONTEXT */
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="fields-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {fields.map((field: any, index: number) => {
                        const typeDef = fieldTypes.find(t => t.slug === field.type) || fieldTypes[0];
                        return (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center justify-between bg-[#C4C4C4] p-3 rounded-md shadow-sm border border-gray-300 group hover:border-blue-400 transition-colors cursor-default"
                                onClick={() => handleEditClick(field)}
                              >
                                <div className="flex items-center gap-4">
                                  {/* Handle Drag */}
                                  <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 hover:bg-black/10 rounded">
                                    <Menu size={20} className="text-gray-600" />
                                  </div>

                                  <div className={`w-12 h-10 rounded-md flex items-center justify-center text-white font-bold text-xs ${typeDef.color} shadow-sm`}>
                                    <typeDef.icon size={20} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-base leading-tight">
                                      {field.name} {field.isRequired && <span className="text-red-500">*</span>}
                                    </h4>
                                    <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">
                                      {field.type} {field.isUnique ? '• Unique' : ''}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteFieldClick(field.id); }}
                                  className="text-gray-500 p-2 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
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
            )}
          </div>
        </div>
      </div>

      {/* 2. SIDEBAR KONFIGURASI (KANAN) - KODE SAMA SEPERTI SEBELUMNYA */}
      <div
        className={cn(
          "bg-[#D9D9D9] flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out h-full overflow-hidden shrink-0",
          isConfigOpen ? "w-[400px] border-l border-gray-300 opacity-100" : "w-0 border-none opacity-0"
        )}
      >
        <div className="w-[400px] flex flex-col h-full">
          <div className="p-5 border-b border-gray-400 flex justify-between items-center bg-[#D9D9D9] shrink-0">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <Settings size={18} />
              {editingFieldId ? "Edit Field" : "Create Field"}
            </div>
            <button onClick={() => setIsConfigOpen(false)}><X size={24} className="text-gray-600 hover:text-black" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Basic Config */}
            <div className="bg-[#B0B0B0] rounded-lg overflow-hidden border border-gray-400 shadow-sm">
              <div className="p-3 bg-[#909090] text-white flex justify-between items-center text-sm font-bold">
                Basic Configuration <ChevronUp size={16} />
              </div>
              <div className="p-5 space-y-4 bg-[#B0B0B0]">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="w-full p-2.5 rounded bg-white border-none outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    placeholder="e.g. Hero Title"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">API ID</label>
                  <input
                    type="text"
                    value={apiId}
                    onChange={(e) => setApiId(e.target.value)}
                    className="w-full p-2.5 rounded bg-white border-none outline-none text-gray-700 text-sm font-mono"
                  />
                  <p className="text-[10px] text-gray-600 mt-1">Used in API response keys.</p>
                </div>
              </div>
            </div>

            {/* Validation Config */}
            <div className="bg-[#B0B0B0] rounded-lg overflow-hidden border border-gray-400 shadow-sm">
              <div className="p-3 bg-[#909090] text-white flex gap-2 items-center text-sm font-bold">
                <CheckSquare size={16} /> Validation
              </div>
              <div className="p-5 space-y-3 bg-[#B0B0B0]">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={isRequired} onChange={e => setIsRequired(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-800">Required Field</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={isUnique} onChange={e => setIsUnique(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-800">Unique Value</span>
                </label>
              </div>
            </div>

            {/* Relation Config (Only if Relation) */}
            {selectedType?.slug === 'relation' && (
              <div className="bg-[#B0B0B0] rounded-lg overflow-hidden border border-gray-400 shadow-sm animate-in slide-in-from-right-2">
                <div className="p-3 bg-pink-600 text-white flex gap-2 items-center text-sm font-bold">
                  <LinkIcon size={16} /> Relation Settings
                </div>
                <div className="p-5 space-y-4 bg-[#B0B0B0]">
                  <div>
                    <label className="text-xs font-bold text-gray-800 block mb-1">Target Content Model</label>
                    <select
                      value={relationTarget}
                      onChange={(e) => setRelationTarget(e.target.value)}
                      className="w-full p-2.5 rounded bg-white border-none outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    >
                      <option value="">-- Select Content Model --</option>
                      {allContentTypes.map((ct: any) => (
                        <option key={ct.id} value={ct.id}>{ct.name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-600 mt-1">Which content should be linked here?</p>
                  </div>
                </div>
              </div>
            )}

          </div>
          <div className="p-6 bg-[#D9D9D9] border-t border-gray-400 shrink-0">
            <button onClick={handleSave} disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
              {editingFieldId ? "Update Field" : "Save Field"}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY (TETAP DI ATAS SEMUANYA) */}
      {isTypeModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-[#D9D9D9] p-6 rounded-lg shadow-2xl w-[650px] animate-in zoom-in-95 duration-200 border border-gray-400">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Field type</h2>
              <button onClick={() => setIsTypeModalOpen(false)} className="text-gray-600 hover:text-black"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fieldTypes.map((t) => (
                <button key={t.slug} onClick={() => handleSelectType(t)} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-transparent hover:border-black hover:shadow-lg transition-all text-left group">
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm ${t.color}`}><t.icon size={20} /></div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">{t.title}</div>
                    <div className="text-[10px] text-gray-500 leading-tight mt-1">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}