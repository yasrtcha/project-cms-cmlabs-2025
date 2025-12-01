"use client";

import { Trash2 } from "lucide-react";

export default function SettingPage() {
  return (
    <div className="p-8">
      {/* Judul Halaman */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Setting
      </h1>

      {/* 1. INFORMATION CARD */}
      <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden mb-8">
        {/* Header Biru */}
        <div className="bg-[#3A7AC3] px-6 py-3">
          <h2 className="text-white font-medium">Information</h2>
        </div>

        {/* Body */}
        <div className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
          {/* Organization ID */}
          <div className="grid grid-cols-12 px-6 py-4 items-center">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Organization ID
            </div>
            <div className="col-span-9 text-sm text-gray-900 dark:text-white">
              123456
            </div>
          </div>

          {/* Organization Name */}
          <div className="grid grid-cols-12 px-6 py-4 items-center">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Organization Name
            </div>
            <div className="col-span-9 flex justify-between items-center">
              <span className="text-sm text-gray-900 dark:text-white">
                Cmlabs
              </span>
              <button className="text-[#3A7AC3] text-sm hover:underline font-medium">
                Change Name
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DANGER ZONE CARD */}
      <div className="border border-red-500 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
        {/* Header Merah */}
        <div className="bg-red-600 px-6 py-3">
          <h2 className="text-white font-medium">Danger Zone</h2>
        </div>

        {/* Body */}
        <div className="p-6 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">
              Delete Projects
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              If you delete the organization, it will be permanently deleted and
              you cannot recover it.
            </p>
          </div>
          <button className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
