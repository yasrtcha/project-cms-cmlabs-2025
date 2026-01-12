"use client";

import { Trash2 } from "lucide-react";
import { deleteWorkflow } from "@/app/builder/_actions/settings-actions";
import { useTransition } from "react";

export function DeleteWorkflowButton({ projectId, workflowId }: { projectId: string, workflowId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this workflow? This cannot be undone.")) {
      startTransition(async () => {
        await deleteWorkflow(projectId, workflowId);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
      title="Delete Workflow"
    >
      <Trash2 size={16} />
    </button>
  );
}