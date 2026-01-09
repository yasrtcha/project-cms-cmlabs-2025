import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getContentEntries, deleteContentEntry } from "@/app/builder/_actions/content-entry-actions";
import { Plus, Edit, Trash2, FileText, Calendar } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function CollectionListPage({ 
  params 
}: { 
  params: Promise<{ projectId: string, pageId: string }> 
}) {
  const { projectId, pageId } = await params;

  // 1. Ambil Info Schema
  const schema = await prisma.builderContentType.findUnique({
    where: { id: pageId }
  });

  if (!schema) return notFound();

  // 2. Ambil Daftar Entry
  const result = await getContentEntries(pageId);
  const entries = result.data || [];

  // Helper untuk menampilkan data di tabel
  // Mencoba mencari field yang cocok jadi "Judul" (title, name, atau field pertama)
  const getDisplayTitle = (data: any) => {
    if (!data) return "Untitled";
    return data.title || data.name || data.label || data.headline || Object.values(data)[0] || "Untitled Entry";
  };

  // Server Action kecil untuk handle delete di dalam komponen server
  async function deleteAction(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteContentEntry(id);
    revalidatePath(`/builder/${projectId}/content-management/collection/${pageId}`);
  }

  return (
    <div className="p-8 h-full bg-gray-50 dark:bg-slate-900/50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{schema.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your collection entries</p>
          </div>
          <Link 
            href={`/builder/${projectId}/content-management/collection/${pageId}/new`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
          >
            <Plus size={18} /> Create New
          </Link>
        </div>

        {/* Tabel Data */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
          {entries.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
               <FileText size={48} className="mb-4 opacity-20" />
               <p className="text-sm font-medium">No entries found.</p>
               <p className="text-xs mt-1">Click "Create New" to add content.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-slate-950 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Title / Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {String(getDisplayTitle(entry.data))}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Link 
                        href={`/builder/${projectId}/content-management/collection/${pageId}/${entry.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit size={16} />
                      </Link>
                      
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={entry.id} />
                        <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}