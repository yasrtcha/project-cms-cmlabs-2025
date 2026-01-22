import Link from "next/link";
import { getWorkflows, deleteWorkflow } from "@/app/builder/_actions/settings-actions"; // Import deleteWorkflow
import { 
  Plus, 
  Pencil, 
  GitPullRequest,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import SafeDeleteButton from "@/components/safe-delete-button"; // Import Tombol Aman

export default async function WorkflowPage({ params }: { params: { projectId: string } }) {
  // 1. Ambil data asli dari Database
  const { data: workflows } = await getWorkflows(params.projectId);

  // Wrapper untuk delete action
  async function handleDelete(id: string) {
    "use server";
    await deleteWorkflow(params.projectId, id);
    revalidatePath(`/builder/${params.projectId}/settings/workflow`);
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* === HEADER SECTION === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Workflow Approval</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Define approval processes for your content publishing.
          </p>
        </div>

        <Link href={`/builder/${params.projectId}/settings/workflow/new`}>
          <Button className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm transition-all">
            <Plus size={16} /> New Workflow
          </Button>
        </Link>
      </div>

      {/* === TABLE SECTION === */}
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#3B82F6] text-white">
              <tr>
                <th className="px-6 py-4 font-semibold text-left">Workflow Name</th>
                <th className="px-6 py-4 font-semibold text-left">Applied To</th>
                <th className="px-6 py-4 font-semibold text-center">Steps</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Last Updated</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            
            <tbody className="bg-white dark:bg-[#1e293b] divide-y divide-gray-100 dark:divide-slate-700">
              {(!workflows || workflows.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 dark:text-slate-500">
                    <GitPullRequest size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No workflows defined yet. Create one to get started.</p>
                  </td>
                </tr>
              ) : (
                workflows.map((workflow: any) => (
                  <tr key={workflow.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium align-middle">
                      <div className="flex items-center gap-3">
                          <GitPullRequest size={18} className="text-blue-600 dark:text-blue-400" />
                          {workflow.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300 align-middle">
                      {/* Menampilkan Tipe Konten yang terhubung */}
                      {workflow.appliedContentTypes && workflow.appliedContentTypes.length > 0 ? (
                         <div className="flex flex-wrap gap-1">
                            {workflow.appliedContentTypes.map((ct: any) => (
                                <span key={ct.name} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium">
                                    {ct.name}
                                </span>
                            ))}
                         </div>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-slate-300 align-middle">
                      {workflow.steps ? workflow.steps.length : 0} Stages
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          workflow.isActive 
                              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400"
                      )}>
                          {workflow.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {workflow.isActive ? "Active" : "Inactive"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 dark:text-slate-400 align-middle">
                      {new Date(workflow.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center justify-center gap-3">
                        
                        {/* Tombol Safe Delete */}
                        <SafeDeleteButton 
                            id={workflow.id}
                            onDelete={handleDelete}
                            title={`Delete Workflow "${workflow.name}"?`}
                            warningMessage="This will remove the approval process from any connected content types. They will revert to direct publishing."
                        />
                        
                        <button 
                          className="p-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}