import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getContentEntries, deleteContentEntry } from "@/app/builder/_actions/content-entry-actions";
import { Plus, Edit, FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { revalidatePath } from "next/cache";
import { cn } from "@/lib/utils";
import SafeDeleteButton from "@/components/safe-delete-button"; // Import Tombol Aman

export default async function CollectionListPage({
  params,
  searchParams
}: {
  params: Promise<{ projectId: string, pageId: string }>,
  searchParams: Promise<{ page?: string }>
}) {
  const { projectId, pageId } = await params;
  const { page: pageStr } = await searchParams;
  const currentPage = parseInt(pageStr || "1");
  const limit = 10;

  // 1. Ambil Info Schema
  const schema = await prisma.builderContentType.findUnique({
    where: { id: pageId }
  });

  if (!schema) return notFound();

  // 2. Ambil Daftar Entry dengan Pagination
  const result = await getContentEntries(pageId, currentPage, limit);
  const entries = result.data || [];
  const pagination = result.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 };

  // Helper untuk menampilkan data di tabel
  const getDisplayTitle = (data: any) => {
    if (!data) return "Untitled";
    return data.title || data.name || data.label || data.headline || Object.values(data)[0] || "Untitled Entry";
  };

  // --- ACTION WRAPPER UNTUK DELETE ---
  // Fungsi ini akan dipanggil oleh SafeDeleteButton
  async function handleDelete(id: string) {
    "use server";
    await deleteContentEntry(id);
    revalidatePath(`/builder/${projectId}/content-management/collection/${pageId}`);
  }

  return (
    <div className="p-8 h-full bg-gray-50 dark:bg-slate-900/50 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto pb-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-8 bg-blue-600 rounded-full" />
              {schema.name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest font-bold opacity-70">
              Collection Management • {pagination.total} Total Entries
            </p>
          </div>
          <Link
            href={`/builder/${projectId}/content-management/collection/${pageId}/new`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 border-b-4 border-blue-800"
          >
            <Plus size={20} /> Create New Entry
          </Link>
        </div>

        {/* Tabel Data */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden transition-all">
          {entries.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 dark:bg-slate-950/30">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                <FileText size={40} className="opacity-20" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-slate-100">Belum Ada Konten</p>
              <p className="text-sm mt-1 mb-8 opacity-60">Mulai buat entri pertama Anda untuk mengisi koleksi ini.</p>
              <Link
                href={`/builder/${projectId}/content-management/collection/${pageId}/new`}
                className="px-6 py-2.5 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
              >
                Tambah Konten Baru
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] border-b border-gray-100 dark:border-slate-800">
                    <tr>
                      <th className="px-8 py-5">Title / Headline</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Last Updated</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="font-black text-gray-900 dark:text-slate-100 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {String(getDisplayTitle(entry.data))}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5 opacity-60">ID: {entry.id}</div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            entry.status === 'PUBLISHED'
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                          )}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-gray-500 dark:text-slate-400">
                          <div className="flex items-center gap-2 font-bold text-xs uppercase opacity-80">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(entry.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/builder/${projectId}/content-management/collection/${pageId}/${entry.id}`}
                              className="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl hover:scale-110 transition-all border border-blue-100 dark:border-blue-800/50"
                              title="Edit Entry"
                            >
                              <Edit size={18} />
                            </Link>

                            {/* --- INTEGRASI SAFE DELETE BUTTON DI SINI --- */}
                            <SafeDeleteButton 
                              id={entry.id}
                              onDelete={handleDelete}
                              title={`Delete "${String(getDisplayTitle(entry.data))}"?`}
                              warningMessage="Are you sure? This action cannot be undone and will permanently remove this content entry."
                            />
                            
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="px-8 py-6 bg-gray-50/50 dark:bg-slate-950/50 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">
                    Showing <span className="text-gray-900 dark:text-slate-200">{entries.length}</span> of <span className="text-gray-900 dark:text-slate-200">{pagination.total}</span> Entries
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
                      className={cn(
                        "p-2 rounded-lg border border-gray-200 dark:border-slate-800 transition-all flex items-center gap-1 text-xs font-bold",
                        currentPage > 1 ? "bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800" : "opacity-30 cursor-not-allowed pointer-events-none"
                      )}
                    >
                      <ChevronLeft size={16} /> Prev
                    </Link>

                    <div className="flex items-center gap-1 px-4">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">{currentPage}</span>
                      <span className="text-xs text-gray-400">/</span>
                      <span className="text-xs font-bold text-gray-400">{pagination.totalPages}</span>
                    </div>

                    <Link
                      href={currentPage < pagination.totalPages ? `?page=${currentPage + 1}` : "#"}
                      className={cn(
                        "p-2 rounded-lg border border-gray-200 dark:border-slate-800 transition-all flex items-center gap-1 text-xs font-bold",
                        currentPage < pagination.totalPages ? "bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800" : "opacity-30 cursor-not-allowed pointer-events-none"
                      )}
                    >
                      Next <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}