"use client";


import { Search, Trash2 } from "lucide-react";

// Data Mockup Sesuai Screenshot
const collaboratorsData = [
  { name: "Afrizal Septian", role: "Owner", status: "Active" },
  { name: "Jono Ekuador", role: "Collabulator", status: "Non Active" },
  { name: "Shelomiti", role: "Pending", status: "Non Active" },
  { name: "Afrizal Septian", role: "Collabulator", status: "Non Active" },
];

export default function CollaboratorPage() {
  return (
    <div className="p-8">
      {/* Judul Halaman */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Collaborator
      </h1>

      {/* Baris Search dan Tombol Add */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-md transition-colors">
          Add Collabulator
        </button>
      </div>

      {/* Tabel Collaborator */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
        <table className="w-full bg-white dark:bg-slate-800">
          {/* Header Tabel Biru */}
          <thead className="bg-[#3A7AC3]">
            <tr>
              <th className="p-4 text-left text-white font-medium">
                Collabulator Name
              </th>
              <th className="p-4 text-center text-white font-medium">Status</th>
              <th className="p-4 text-center text-white font-medium">Role</th>
              <th className="p-4 text-center text-white font-medium">Action</th>
            </tr>
          </thead>

          {/* Body Tabel */}
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {collaboratorsData.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                {/* Nama & Badge Role (Kiri) */}
                <td className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {item.name}
                    </span>

                    {/* Logic Badge Warna */}
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold text-white ${
                        item.role === "Owner" ? "bg-[#3A7AC3]" : "bg-yellow-400"
                      }`}>
                      {item.role === "Pending" ? "Collabulator" : item.role}
                      {/* Note: Di screenshot 'Pending' pakai badge kuning Collabulator? Sesuaikan jika perlu */}
                    </span>
                  </div>
                </td>

                {/* Status (Tengah) */}
                <td className="p-4 text-center text-gray-600 dark:text-gray-300 text-sm">
                  {item.status}
                </td>

                {/* Role Text (Tengah) */}
                <td className="p-4 text-center text-gray-600 dark:text-gray-300 text-sm">
                  {item.role === "Pending" ? "Pending" : item.role}
                </td>

                {/* Action (Kanan) */}
                <td className="p-4 text-center">
                  <button className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
