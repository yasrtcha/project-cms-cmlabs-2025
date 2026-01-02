"use client";

import { useState } from "react";
import { Plus, Check, Copy, AlertTriangle } from "lucide-react";
import { CreateTokenModal } from "./create-token-modal";

export default function CreateTokenButton({ projectId }: { projectId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Jika token baru saja dibuat, tampilkan Popup Token Rahasia
  if (generatedToken) {
    return (
      <>
        {/* Overlay Blur */}
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 border border-green-500">
              <div className="p-6 text-center space-y-4">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={32} strokeWidth={3} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">Token Created Successfully!</h3>
                 <p className="text-sm text-gray-500">
                    Please copy this token now. For security reasons, <strong>it will not be shown again.</strong>
                 </p>
                 
                 {/* Area Copy Token */}
                 <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-2 mt-4">
                    <code className="font-mono text-sm text-gray-800 truncate select-all">
                       {generatedToken}
                    </code>
                    <button 
                       onClick={handleCopy}
                       className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                       {isCopied ? <Check size={16} className="text-green-600"/> : <Copy size={16} className="text-gray-500"/>}
                    </button>
                 </div>

                 <button 
                   onClick={() => setGeneratedToken(null)} // Tutup popup
                   className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg mt-4"
                 >
                   I have copied the token
                 </button>
              </div>
           </div>
        </div>
        
        {/* Tombol Utama (Disabled sementara) */}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed">
           <Plus size={16} strokeWidth={3} /> Create API Token
        </button>
      </>
    );
  }

  // Tampilan Normal (Tombol Create)
  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        <Plus size={16} strokeWidth={3} /> Create API Token
      </button>

      <CreateTokenModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        onSuccess={(token) => setGeneratedToken(token)} // Simpan token utk ditampilkan
      />
    </>
  );
}