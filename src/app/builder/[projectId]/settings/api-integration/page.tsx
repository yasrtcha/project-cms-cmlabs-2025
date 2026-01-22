import Link from "next/link";
import { getApiTokens, deleteApiToken } from "@/app/builder/_actions/settings-actions"; // Import Actions
import { 
  Plus, 
  Pencil, 
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import SafeDeleteButton from "@/components/safe-delete-button"; // Import Tombol Aman

// Komponen Utama (Server Component)
export default async function ApiIntegrationPage({ params }: { params: { projectId: string } }) {
  // 1. Ambil data asli dari Database
  const { data: tokens } = await getApiTokens(params.projectId);

  // Wrapper untuk delete action
  async function handleDelete(id: string) {
    "use server";
    await deleteApiToken(params.projectId, id);
    revalidatePath(`/builder/${params.projectId}/settings/api-integration`);
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* === HEADER SECTION === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">API and Integration</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Optimize your API and Integration management
          </p>
        </div>

        <Link href={`/builder/${params.projectId}/settings/api-integration/new`}>
          <Button className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm transition-all">
            <Plus size={16} /> New API Token
          </Button>
        </Link>
      </div>

      {/* === TABLE SECTION === */}
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#3B82F6] text-white">
              <tr>
                <th className="px-6 py-4 font-semibold text-center w-[20%]">Name</th>
                <th className="px-6 py-4 font-semibold text-left w-[30%]">Description</th>
                <th className="px-6 py-4 font-semibold text-center w-[15%]">Created</th>
                <th className="px-6 py-4 font-semibold text-center w-[15%]">Expires</th>
                <th className="px-6 py-4 font-semibold text-center w-[10%]">Action</th>
              </tr>
            </thead>
            
            <tbody className="bg-white dark:bg-[#1e293b] divide-y divide-gray-100 dark:divide-slate-700">
              {/* Jika data kosong */}
              {(!tokens || tokens.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-slate-500">
                    <Key size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No API tokens found. Create one to get started.</p>
                  </td>
                </tr>
              ) : (
                /* Render Data Asli */
                tokens.map((token: any) => (
                  <tr key={token.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-center align-top">
                      {token.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300 align-top leading-relaxed">
                      {token.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 dark:text-slate-400 align-top">
                      {new Date(token.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 dark:text-slate-400 align-top">
                      {token.expiresAt ? new Date(token.expiresAt).toLocaleDateString() : "Forever"}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center justify-center gap-3">
                        
                        {/* Tombol Safe Delete */}
                        <SafeDeleteButton 
                            id={token.id}
                            onDelete={handleDelete}
                            title={`Revoke Token "${token.name}"?`}
                            warningMessage="Any application using this token will instantly lose access to your CMS."
                        />
                        
                        <button 
                          className="p-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                          title="Edit Token"
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