"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyTokenButton({ token }: { token: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setIsCopied(true);
    
    // Reset icon setelah 2 detik
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-700"
      title="Copy Token"
    >
      {isCopied ? (
        <Check size={14} className="text-green-600" strokeWidth={3} />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}