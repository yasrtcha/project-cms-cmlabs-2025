"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";

// --- 1. DATA DUMMY (Database Pura-pura) ---
// Key-nya harus cocok dengan slug yang di-generate dari halaman list (lowercase + dash)
const projectDetails: Record<string, any> = {
  "cms-cmlabs": {
    id: "123456",
    name: "CMS CMLABS",
    updated: "03 Minutes Ago",
    status: "Progress",
    domain: "cms-cmlabs.cmscmlabs.com",
  },
  "cms-pegadaian": {
    id: "789012",
    name: "CMS Pegadaian",
    updated: "20 Hours Ago",
    status: "Progress",
    domain: "cms-pegadaian.cmscmlabs.com",
  },
  "cms-polinema": {
    id: "345678",
    name: "CMS Polinema",
    updated: "21 Mar 2025, 10:00",
    status: "Progress",
    domain: "cms-polinema.cmscmlabs.com",
  },
  // Default fallback jika data tidak ditemukan
  default: {
    id: "000000",
    name: "Unknown Project",
    updated: "Unknown",
    status: "Unknown",
    domain: "unknown.domain.com",
  },
};

export default function ProjectSettingsPage() {
  const params = useParams();

  // Ambil parameter dari URL
  const projectId = params.projectId as string; // misal: "cms-cmlabs"
  // const slug = params.slug as string; // misal: "cms" (jika butuh)

  // Ambil data detail berdasarkan projectId
  const data = projectDetails[projectId] || projectDetails["default"];

  return (
    <div className="p-8">
      {/* Breadcrumb Sederhana */}
      <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Pages / Organizational Projects /{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {data.name}
        </span>
      </div>

      {/* Header Title & Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {data.name}
        </h1>
        <Link
          // Link mengarah ke /builder/ID-PROJECT
          href={`/builder/${projectId}`}
          className="bg-[#3A7AC3] hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-md transition-colors">
          Enter Project
        </Link>
      </div>

      {/* 1. INFORMATION CARD (Header Biru) */}
      <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-[#3A7AC3] px-6 py-3">
          <h2 className="text-white font-medium">Information</h2>
        </div>
        {/* Body */}
        <div className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
          {/* Row: Project ID */}
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-2 md:gap-0">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Project ID
            </div>
            <div className="col-span-9 text-sm text-gray-900 dark:text-white">
              {data.id}
            </div>
          </div>

          {/* Row: Project Name */}
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-2 md:gap-0">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Project Name
            </div>
            <div className="col-span-9 flex justify-between items-center">
              <span className="text-sm text-gray-900 dark:text-white">
                {data.name}
              </span>
              <button className="text-[#3A7AC3] text-sm hover:underline font-medium">
                Change Name
              </button>
            </div>
          </div>

          {/* Row: Last Updated */}
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-2 md:gap-0">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Last Updated
            </div>
            <div className="col-span-9 text-sm text-gray-900 dark:text-white">
              {data.updated}
            </div>
          </div>

          {/* Row: Last Project (Status) */}
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-2 md:gap-0">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Last Project
            </div>
            <div className="col-span-9 flex justify-between items-center">
              <span className="bg-yellow-400 text-white text-xs px-3 py-1 rounded-md font-medium shadow-sm">
                {data.status}
              </span>
              <button className="text-[#3A7AC3] text-sm hover:underline font-medium">
                Change Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CUSTOM DOMAIN CARD (Header Kuning) */}
      <div className="border border-yellow-400/50 rounded-lg overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-yellow-400 px-6 py-3">
          <h2 className="text-white font-medium">Custom Domain</h2>
        </div>
        {/* Body */}
        <div className="bg-white dark:bg-slate-800 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            By default, your site on {data.name} can be accessed through a
            subdomain generated from your project name. To make it more
            personalized, add your own custom domain.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
              {data.domain}
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-6 py-2 rounded-md transition-colors w-full md:w-auto">
              Custom Domain
            </button>
          </div>
        </div>
      </div>

      {/* 3. DANGER ZONE CARD (Header Merah) */}
      <div className="border border-red-500/50 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 px-6 py-3">
          <h2 className="text-white font-medium">Danger Zone</h2>
        </div>
        {/* Body */}
        <div className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700/50">
          {/* Item 1 */}
          <div className="p-6 flex justify-between items-center hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Duplicate Projects
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You are about to duplicate this project. A new copy will be
                created with the same content and settings.
              </p>
            </div>
            <button className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>

          {/* Item 2 */}
          <div className="p-6 flex justify-between items-center hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Duplicate to Personal
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You are about to transfer this project to another section. The
                original project will remain unchanged.
              </p>
            </div>
            <button className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>

          {/* Item 3 */}
          <div className="p-6 flex justify-between items-center hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Delete Projects
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                If you delete the organization, it will be permanently deleted
                and you cannot recover it.
              </p>
            </div>
            <button className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
