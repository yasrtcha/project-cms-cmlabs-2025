"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Search, Book, PenLine, MousePointer2, Share2, HelpCircle, MessageSquareQuote } from "lucide-react";
import { createContentType } from "@/app/builder/_actions/content-type-actions";
import { cn } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "SINGLE" | "COLLECTION" | "COMPONENT";
  projectId: string;
  projectName: string;
};

const COMPONENT_PRESETS = [
  { id: "BUTTON", title: "Action Button", icon: MousePointer2, desc: "Label, URL, and Style settings.", color: "text-blue-600 bg-blue-50" },
  { id: "SEO_CARD", title: "SEO Card", icon: Share2, desc: "Title, Description, and Image for socials.", color: "text-purple-600 bg-purple-50" },
  { id: "FAQ", title: "FAQ Item", icon: HelpCircle, desc: "Question and Answer pair.", color: "text-emerald-600 bg-emerald-50" },
  { id: "TESTIMONIAL", title: "Testimonial", icon: MessageSquareQuote, desc: "Quote, Name, Role, and Photo.", color: "text-orange-600 bg-orange-50" },
];

export function CreateTypeModal({ isOpen, onClose, type, projectId }: ModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"MANUAL" | "LIBRARY">("MANUAL");
  const [name, setName] = useState("");
  const [apiId, setApiId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    hasMultiLang: false,
    hasSeo: false,
    hasWorkflow: false
  });

  useEffect(() => {
    if (isOpen) {
      setName("");
      setApiId("");
      setActiveTab(type === "COMPONENT" ? "LIBRARY" : "MANUAL");
      setConfig({ hasMultiLang: false, hasSeo: false, hasWorkflow: false });
    }
  }, [isOpen, type]);

  const handleNameChange = (val: string) => {
    setName(val);
    const slug = val.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    setApiId(slug);
  };

  const handleCreate = async (presetId?: string) => {
    const finalName = presetId ? COMPONENT_PRESETS.find(p => p.id === presetId)?.title || name : name;
    if (!finalName && !presetId) return alert("Please enter a name");

    setIsLoading(true);
    const result = await createContentType({
      name: finalName,
      slug: presetId ? undefined : apiId,
      type,
      projectId,
      config,
      preset: presetId
    });

    if (result.success && result.data) {
      onClose();
      // Navigate to the new content type page
      const routeType = type === "SINGLE" ? "single-page" : type === "COLLECTION" ? "collection" : "components";
      router.push(`/builder/${projectId}/${routeType}/${result.data.id}`);
    } else {
      alert(result.error || "Failed to create.");
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const typeLabel = type === "SINGLE" ? "Single Page" : type === "COLLECTION" ? "Multiple Page" : "Component";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      <div className={cn(
        "bg-white dark:bg-slate-900 w-full rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 font-sans border border-gray-200 dark:border-slate-800 transition-all",
        activeTab === "LIBRARY" ? "max-w-3xl" : "max-w-lg"
      )}>

        {/* Header Modal */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 italic tracking-tight">Create {typeLabel}</h3>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Struktur Konten Baru</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-100 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigasi */}
        {type === "COMPONENT" && (
          <div className="flex items-center gap-8 px-8 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/20">
            <button
              onClick={() => setActiveTab("LIBRARY")}
              className={cn(
                "py-4 text-xs font-black transition-all border-b-2 flex items-center gap-2 uppercase tracking-widest",
                activeTab === "LIBRARY" ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400" : "text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-slate-400"
              )}
            >
              <Book size={14} /> Library Content
            </button>
            <button
              onClick={() => setActiveTab("MANUAL")}
              className={cn(
                "py-4 text-xs font-black transition-all border-b-2 flex items-center gap-2 uppercase tracking-widest",
                activeTab === "MANUAL" ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400" : "text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-slate-400"
              )}
            >
              <PenLine size={14} /> Manual Configuration
            </button>
          </div>
        )}

        {/* Area Konten */}
        <div className="p-8 min-h-[380px] custom-scrollbar">
          {activeTab === "LIBRARY" && type === "COMPONENT" ? (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {COMPONENT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleCreate(p.id)}
                  disabled={isLoading}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl hover:-translate-y-1 transition-all text-left group shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg border-b-2 border-black/10 transition-transform group-hover:scale-110 duration-300", p.color)}>
                    <p.icon size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">{p.title}</h4>
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-tight mt-1.5 font-medium">{p.desc}</p>
                    <div className="mt-4 text-[10px] font-black text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0 flex items-center gap-1 uppercase tracking-tighter">
                      Select Preset <span className="text-xs">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 mb-2 uppercase tracking-[0.2em] px-1">{typeLabel} Name</label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Hero Banner"
                    className="w-full p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-slate-100 font-bold placeholder:text-gray-300 dark:placeholder:text-slate-800 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 mb-2 uppercase tracking-[0.2em] px-1">API ID</label>
                  <input
                    type="text"
                    value={apiId}
                    onChange={(e) => setApiId(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-blue-400 font-mono font-black transition-all shadow-inner"
                  />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 px-1 italic">
                    Generated automatically, used for API response identifiers.
                  </p>
                </div>
              </div>

              {type !== "COMPONENT" && (
                <div className="flex items-start gap-4 p-5 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <div className="mt-1 p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400"><Search size={20} /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-bold text-gray-900 dark:text-slate-100">SEO Settings</label>
                      <button
                        onClick={() => setConfig(prev => ({ ...prev, hasSeo: !prev.hasSeo }))}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all duration-300 ease-in-out border-2",
                          config.hasSeo ? "bg-blue-600 border-blue-500" : "bg-gray-300 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm",
                          config.hasSeo ? "left-6" : "left-0.5"
                        )} />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight font-medium italic">Enable meta tags like Title, Description, and Social Share images.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex flex-col items-center">
          {activeTab === "MANUAL" && (
            <button
              onClick={() => handleCreate()}
              disabled={isLoading || !name}
              className="w-full py-4 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-black rounded-xl border-b-4 border-blue-800 dark:border-blue-700 flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] active:border-b-0 active:mt-1 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              Create {typeLabel.replace(" Page", "")}
            </button>
          )}

          {activeTab === "LIBRARY" && (
            <div className="w-full p-4 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-100 dark:border-slate-800">
              <p className="text-[10px] text-center text-gray-400 dark:text-slate-500 italic font-medium leading-relaxed">
                Library components come with pre-configured fields to speed up your development process. Perfect for common UI patterns.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
