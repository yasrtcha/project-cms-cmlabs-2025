"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, Trash2, LogIn } from "lucide-react";

// --- 1. DATA SIMULASI ---
const subProjectsData: Record<string, any[]> = {
  cms: [
    {
      name: "CMS CMLABS",
      status: "Owner",
      lastUpdate: "03 Minute ago",
      collaborators: ["ME", "DS", "JK"],
    },
    {
      name: "CMS Pegadaian",
      status: "Collaborator",
      lastUpdate: "20 Hours ago",
      collaborators: ["ME", "DS", "JK"],
    },
    {
      name: "CMS Polinema",
      status: "Collaborator",
      lastUpdate: "21 Mar 2025, 10:00",
      collaborators: ["ME", "DS", "JK"],
    },
  ],
  sequence: [
    {
      name: "Sequence Project A",
      status: "Owner",
      lastUpdate: "1 Day ago",
      collaborators: ["ME"],
    },
  ],
  // Data default jika slug tidak ditemukan
  default: [],
};

// --- 2. KOMPONEN KECIL ---

// Badge Status (Biru/Kuning)
const RoleBadge = ({ role }: { role: string }) => {
  const isOwner = role === "Owner";
  return (
    <span
      className={`px-4 py-1 rounded-full text-xs font-semibold text-white ${
        isOwner ? "bg-[#3A7AC3]" : "bg-yellow-400"
      }`}>
      {isOwner ? "Owner" : "Collabulator"}
    </span>
  );
};

// Avatar Group
const AvatarGroup = () => (
  <div className="flex items-center space-x-2">
    <div className="flex -space-x-2">
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs border-2 border-white">
        ME
      </div>
      <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs border-2 border-white">
        DS
      </div>
      <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs border-2 border-white">
        JK
      </div>
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
      +6
    </span>
  </div>
);

// --- 3. KOMPONEN HALAMAN UTAMA ---
export default function OrganizationalDetailPage() {
  // Ambil slug dari URL (misal: "cms")
  const params = useParams();
  const slug = params.slug as string;

  // Ambil data yang sesuai
  const tableData = subProjectsData[slug] || subProjectsData["default"];

  return (
    // HAPUS Wrapper Sidebar & Header di sini karena sudah ada di layout.tsx
    // Cukup gunakan div container biasa dengan padding
    <div className="p-8">
      {/* Judul Halaman */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase">
        {slug?.replace("-", " ")}
      </h1>

      {/* Baris Search dan Tombol Create */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-3xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-slate-800 dark:text-white border-none rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-md transition-colors flex items-center">
          Create Project
        </button>
      </div>

      {/* Tabel */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
        <table className="w-full bg-white dark:bg-slate-800">
          {/* Header Tabel */}
          <thead className="bg-[#3A7AC3]">
            <tr>
              <th className="p-4 text-left text-white font-medium">
                Project Name
              </th>
              <th className="p-4 text-center text-white font-medium">
                Last Update
              </th>
              <th className="p-4 text-center text-white font-medium">
                Collaborator
              </th>
              <th className="p-4 text-center text-white font-medium">Action</th>
            </tr>
          </thead>

          {/* Body Tabel */}
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {tableData.length > 0 ? (
              tableData.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  {/* Nama Project */}
                  <td className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 dark:text-white font-medium">
                        {item.name}
                      </span>
                      <RoleBadge role={item.status} />
                    </div>
                  </td>

                  {/* Last Update */}
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300 text-sm">
                    {item.lastUpdate}
                  </td>

                  {/* Collaborator */}
                  <td className="p-4 flex justify-center">
                    <AvatarGroup />
                  </td>

                  {/* Action */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-4">
                      {/* Tombol Delete */}
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <Link
                        href={`/organizational/${slug}/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                        <LogIn size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Tampilan jika data kosong
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No projects found for {slug}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
