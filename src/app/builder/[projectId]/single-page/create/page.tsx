"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
// 1. IMPORT ACTION UNTUK SIMPAN KE DATABASE
import { createNewPage } from "@/app/builder/_actions/page-actions";

// --- KOMPONEN HELPER (ToggleSection) ---
const ToggleSection = ({
  title,
  description,
  isEnabled,
  onToggle,
}: {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}) => (
  <div className="mb-6">
    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <div className="flex items-start space-x-4">
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? "bg-[#3A7AC3]" : "bg-gray-300 dark:bg-slate-600"
          }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? "translate-x-7" : "translate-x-0"
            }`}
        />
      </button>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
        {description}
      </p>
    </div>
  </div>
);

// --- KOMPONEN UTAMA ---
export default function CreateSinglePage() {
  const router = useRouter();
  const params = useParams();

  const [pageName, setPageName] = useState("");
  const [hasSeo, setHasSeo] = useState(false);
  const [isPending, setIsPending] = useState(false); // 2. STATE UNTUK LOADING



  // 3. MODIFIKASI FUNGSI CREATE (SEKARANG MENGGUNAKAN ASYNC)
  const handleCreate = async () => {
    if (!pageName) return alert("Please enter a page name!");

    setIsPending(true); // Mulai loading

    const slug = pageName.toLowerCase().replace(/\s+/g, "_");

    // MEMANGGIL SERVER ACTION UNTUK SIMPAN KE POSTGRESQL
    const result = await createNewPage({
      name: pageName,
      slug: slug,
      projectId: params.projectId as string,
      hasSeo: hasSeo,
    });

    if (result.success) {
      // Jika berhasil simpan, pindah ke halaman builder yang baru dibuat
      // Kita pakai ID yang dikembalikan dari database (result.page.id)
      router.push(`/builder/${params.projectId}/single-page/${result.page?.id}`);
    } else {
      alert("Failed to save to database. Please try again.");
    }

    setIsPending(false); // Selesai loading
  };



  return (
    <div className="h-full w-full p-12 bg-white dark:bg-slate-950 overflow-y-auto">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-[#3A7AC3] mb-8">
          Create Single Page
        </h1>

        {/* Page Configuration Header */}
        <div className="flex space-x-8 border-b border-gray-200 dark:border-slate-700 mb-8">
          <div
            className="pb-2 text-sm font-semibold transition-colors relative text-black dark:text-white border-b-2 border-black dark:border-white"
          >
            Page Configuration
          </div>
        </div>

        {/* Content Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page Name
            </label>
            <input
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="e.g. Home, About Us"
              className="w-full p-3 bg-gray-200 dark:bg-slate-800 border-none rounded-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#3A7AC3] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API
            </label>
            <input
              type="text"
              disabled
              value={pageName.toLowerCase().replace(/\s+/g, "_")}
              placeholder="Auto-generated"
              className="w-full p-3 bg-gray-200 dark:bg-slate-800 border-none rounded-sm text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
            <ToggleSection
              title="SEO Settings"
              description="Enable this feature to activate SEO settings (Meta title, description, etc) for this page."
              isEnabled={hasSeo}
              onToggle={() => setHasSeo(!hasSeo)}
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleCreate}
              disabled={isPending}
              className={`w-full font-medium py-3 rounded-md transition-all shadow-sm active:scale-[0.98] ${isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3A7AC3] hover:bg-blue-600 text-white"
                }`}
            >
              {isPending ? "Saving to Database..." : "Create Page"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}