"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteApiToken } from "@/app/builder/_actions/api-token-actions";

export default function DeleteTokenButton({ tokenId, projectId }: { tokenId: string, projectId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to revoke this token? Any application using it will stop working.")) return;
    
    setIsDeleting(true);
    await deleteApiToken(tokenId, projectId);
    setIsDeleting(false);
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-md"
      title="Revoke Token"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin text-red-600"/> : <Trash2 size={16} />}
    </button>
  );
}