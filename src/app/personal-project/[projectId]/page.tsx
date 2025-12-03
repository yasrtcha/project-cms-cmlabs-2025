"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Sidebar } from "../../../components/layout/sidebar";
import { Header } from "../../../components/layout/header";
import { Trash2 } from "lucide-react";

// --- DATA DUMMY ---
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
    updated: "03 Minutes Ago",
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
  default: {
    id: "000000",
    name: "Unknown Project",
    updated: "Unknown",
    status: "Unknown",
    domain: "unknown.domain.com",
  },
};

export default function PersonalProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const data = projectDetails[projectId] || projectDetails["default"];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar Manual */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Manual */}
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-[#3A7AC3] cursor-pointer">Pages</span> /
            Organizational Projects /{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.name}
            </span>
          </div>

          {/* Header Halaman */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase">
              {data.name}
            </h1>
            <Link
              // Link mengarah ke /builder/ID-PROJECT
              href={`/builder/${projectId}`}
              className="bg-[#3A7AC3] hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-md transition-colors">
              Enter Project
            </Link>
          </div>

          {/* 1. INFORMATION CARD (Biru) */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden mb-8 shadow-sm">
            <div className="bg-[#3A7AC3] px-6 py-3">
              <h2 className="text-white font-semibold">Information</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {/* ID */}
              <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Project ID
                </div>
                <div className="col-span-9 text-sm text-gray-900 dark:text-white">
                  {data.id}
                </div>
              </div>
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center">
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
              {/* Updated */}
              <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Updated
                </div>
                <div className="col-span-9 text-sm text-gray-900 dark:text-white">
                  {data.updated}
                </div>
              </div>
              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Project
                </div>
                <div className="col-span-9 flex justify-between items-center">
                  <span className="bg-yellow-400 text-white text-xs px-4 py-1 rounded-md font-medium">
                    {data.status}
                  </span>
                  <button className="text-[#3A7AC3] text-sm hover:underline font-medium">
                    Change Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CUSTOM DOMAIN CARD (Kuning) */}
          <div className="border border-yellow-400 rounded-lg overflow-hidden mb-8 shadow-sm">
            <div className="bg-yellow-400 px-6 py-3">
              <h2 className="text-white font-semibold">Custom Domain</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 border-x border-b border-yellow-400/30 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                By default, your site on {data.name} can be accessed through a
                subdomain generated from your project name. To make it more
                personalized, add your own custom domain.
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <div className="font-bold text-gray-900 dark:text-white text-lg">
                    {data.domain}
                  </div>
                </div>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-6 py-2.5 rounded-md transition-colors shadow-sm w-full md:w-auto">
                  Custom Domain
                </button>
              </div>
            </div>
          </div>

          {/* 3. DANGER ZONE CARD (Merah) */}
          <div className="border border-red-600 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-red-600 px-6 py-3">
              <h2 className="text-white font-semibold">Danger Zone</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700 border-x border-b border-red-600/20 dark:border-slate-700">
              {/* Duplicate Projects */}
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    Duplicate Projects
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You are about to duplicate this project. A new copy will be
                    created with the same content and settings.
                  </p>
                </div>
                <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-2">
                  <Trash2 size={22} />
                </button>
              </div>

              {/* Duplicate to Personal */}
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    Duplicate to Personal
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You are about to transfer this project to another section.
                    The original project will remain unchanged, while a
                    duplicate will be created in the selected section.
                  </p>
                </div>
                <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-2">
                  <Trash2 size={22} />
                </button>
              </div>

              {/* Delete Projects */}
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    Delete Projects
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    If you delete the organization, it will be permanently
                    deleted and you cannot recover it.
                  </p>
                </div>
                <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-2">
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
