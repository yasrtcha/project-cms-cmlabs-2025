"use client";

import { Trash2 } from "lucide-react";
import { deleteApiToken } from "@/app/builder/_actions/settings-actions";
import { useTransition } from "react";

export function DeleteTokenButton({ projectId, tokenId }: { projectId: string, tokenId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this token?")) {
      startTransition(async () => {
        await deleteApiToken(projectId, tokenId);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
      title="Delete Token"
    >
      <Trash2 size={16} />
    </button>
  );
}