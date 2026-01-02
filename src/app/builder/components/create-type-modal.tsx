"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Globe, Search, GitPullRequest } from "lucide-react";
import { createContentType } from "@/app/builder/_actions/content-type-actions";
import { cn } from "@/lib/utils"; // Jika error, hapus cn() dan pakai string biasa

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "SINGLE" | "COLLECTION" | "COMPONENT";
  projectId: string;
  projectName: string;
};

export function CreateTypeModal({ isOpen, onClose, type, projectId }: ModalProps) {
  // State Input
  const [name, setName] = useState("");
  const [apiId, setApiId] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [isLoading, setIsLoading] = useState(false);
  
  // State Config Advanced
  const [config, setConfig] = useState({
    hasMultiLang: false,
    hasSeo: false,
    hasWorkflow: false
  });

  // Reset form setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setName("");
      setApiId("");
      setConfig({ hasMultiLang: false, hasSeo: false, hasWorkflow: false });
      setActiveTab("basic");
    }
  }, [isOpen]);

  // Generate API ID otomatis saat mengetik nama
  const handleNameChange = (val: string) => {
    setName(val);
    const slug = val.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    setApiId(slug);
  };

  const handleCreate = async () => {
    if (!name) return alert("Please enter a name");
    
    setIsLoading(true);
    const result = await createContentType({
      name,
      slug: apiId, // Mengirim API ID manual
      type,
      projectId,
      config // Mengirim settingan Advanced
    });

    if (result.success) {
      onClose(); // Tutup modal jika sukses
    } else {
      alert(result.error || "Failed to create.");
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  // Label Judul (Misal: "Create Single Page")
  const typeLabel = type === "SINGLE" ? "Single Page" : type === "COLLECTION" ? "Multiple Page" : "Component";

  return (
    // Overlay Gelap
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Kotak Modal Abu-abu (Sesuai Desain) */}
      <div className="bg-[#E5E5E5] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 font-sans border border-gray-400">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-5">
          <h3 className="text-lg font-bold text-gray-900">Create {typeLabel}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigasi (Basic | Advanced) */}
        <div className="flex items-center gap-8 px-6 border-b border-gray-300">
          <button 
            onClick={() => setActiveTab("basic")}
            className={cn(
              "pb-3 text-sm font-bold transition-all border-b-2",
              activeTab === "basic" ? "text-black border-black" : "text-gray-500 border-transparent hover:text-gray-700"
            )}
          >
            Basic Configuration
          </button>
          <button 
            onClick={() => setActiveTab("advanced")}
            className={cn(
              "pb-3 text-sm font-bold transition-all border-b-2",
              activeTab === "advanced" ? "text-black border-black" : "text-gray-500 border-transparent hover:text-gray-700"
            )}
          >
            Advanced Configuration
          </button>
        </div>

        {/* Area Konten */}
        <div className="p-8 min-h-[300px]">
          
          {/* ISI TAB 1: BASIC */}
          {activeTab === "basic" && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Page Name</label>
                {/* Input Abu-abu Gelap (#D4D4D4) sesuai gambar */}
                <input 
                  autoFocus
                  type="text" 
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full p-3 bg-[#D4D4D4] border-none rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">API</label>
                <input 
                  type="text" 
                  value={apiId}
                  onChange={(e) => setApiId(e.target.value)}
                  className="w-full p-3 bg-[#D4D4D4] border-none rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-2">
                  It's generated automatically and used to generate API routes.
                </p>
              </div>
            </div>
          )}

          {/* ISI TAB 2: ADVANCED */}
          {activeTab === "advanced" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              {/* Toggle: Multi Language */}
              <div className="flex items-start gap-4">
                <div className="mt-1"><Globe size={20} className="text-gray-600"/></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-bold text-gray-900">Multi Language</label>
                    <button 
                      onClick={() => setConfig(prev => ({...prev, hasMultiLang: !prev.hasMultiLang}))}
                      className={cn("w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out", config.hasMultiLang ? "bg-blue-600" : "bg-gray-400")}
                    >
                      <div className={cn("w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-200", config.hasMultiLang ? "left-6" : "left-1")} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">Enable multiple languages support.</p>
                </div>
              </div>

              {/* Toggle: SEO */}
              <div className="flex items-start gap-4">
                <div className="mt-1"><Search size={20} className="text-gray-600"/></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-bold text-gray-900">SEO</label>
                    <button 
                      onClick={() => setConfig(prev => ({...prev, hasSeo: !prev.hasSeo}))}
                      className={cn("w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out", config.hasSeo ? "bg-blue-600" : "bg-gray-400")}
                    >
                      <div className={cn("w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-200", config.hasSeo ? "left-6" : "left-1")} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">Activate SEO settings (Meta title, slug, etc).</p>
                </div>
              </div>

              {/* Toggle: Workflow */}
              <div className="flex items-start gap-4">
                <div className="mt-1"><GitPullRequest size={20} className="text-gray-600"/></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-bold text-gray-900">Workflow</label>
                    <button 
                      onClick={() => setConfig(prev => ({...prev, hasWorkflow: !prev.hasWorkflow}))}
                      className={cn("w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out", config.hasWorkflow ? "bg-blue-600" : "bg-gray-400")}
                    >
                      <div className={cn("w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-200", config.hasWorkflow ? "left-6" : "left-1")} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">Enable approval workflows (Draft &rarr; Publish).</p>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Tombol Create */}
        <div className="p-6 pt-0">
          <button 
            onClick={handleCreate}
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
            Create {typeLabel.replace("Page", "")} Page
          </button>
        </div>

      </div>
    </div>
  );
}