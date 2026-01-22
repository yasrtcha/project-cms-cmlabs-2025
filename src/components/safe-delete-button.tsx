"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface SafeDeleteButtonProps {
  id: string;
  onDelete: (id: string) => Promise<any>; // Fungsi Server Action
  title?: string;
  warningMessage?: string;
}

export default function SafeDeleteButton({ 
  id, 
  onDelete, 
  title = "Delete Item", 
  warningMessage = "This action cannot be undone. This will permanently delete this data and all related records." 
}: SafeDeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      await onDelete(id);
      setIsOpen(false);
    });
  };

  return (
    <>
      {/* 1. Tombol Trigger (Icon Tong Sampah) */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:scale-110 transition-all border border-red-100 dark:border-red-800/50 cursor-pointer"
        title="Delete safely"
        type="button"
      >
        <Trash2 size={18} />
      </button>

      {/* 2. Modal Overlay (Muncul saat tombol diklik) */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-red-100 dark:border-red-900/30 animate-in zoom-in-95 duration-200">
            
            {/* Header Merah */}
            <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 flex items-center gap-3 border-b border-red-100 dark:border-red-900/30">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Confirm Deletion</h3>
            </div>

            {/* Isi Pesan */}
            <div className="p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                {warningMessage}
              </p>
              
              <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-950 rounded-lg text-xs text-gray-500 border border-gray-100 dark:border-slate-800 font-mono">
                ID: {id}
              </div>
            </div>

            {/* Footer Tombol Action */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-950/50 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {isDeleting ? "Deleting..." : "Yes, Delete It"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}