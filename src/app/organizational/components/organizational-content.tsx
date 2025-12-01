"use client"; // Komponen ini interaktif, jadi "use client" diperlukan

import Link from "next/link";
import { Search, Trash2, LogIn } from "lucide-react";
import { Sidebar } from "../../../components/layout/sidebar";
import { Header } from "../../../components/layout/header";

// Tipe data untuk avatar kolaborator
type Collaborator = {
  initials: string;
  color: string;
};

// Data tiruan untuk mendemonstrasikan tabel
const projectsData = [
  {
    id: "cms",
    name: "CMS",
    status: "Owner",
    collaborators: [
      { initials: "ME", color: "bg-green-500" },
      { initials: "DS", color: "bg-teal-500" },
      { initials: "JK", color: "bg-pink-500" },
    ],
    canDelete: true,
  },
  {
    id: "sequence",
    name: "SEQUENCE",
    status: "Owner",
    collaborators: [
      { initials: "ME", color: "bg-green-500" },
      { initials: "DS", color: "bg-teal-500" },
    ],
    canDelete: true,
  },
  {
    id: "digi-raya",
    name: "DIGI RAYA",
    status: "Owner",
    collaborators: [
      { initials: "ME", color: "bg-green-500" },
      { initials: "DS", color: "bg-teal-500" },
      { initials: "JK", color: "bg-pink-500" },
    ],
    canDelete: true,
  },
  {
    id: "cmlabs",
    name: "CMLABS",
    status: "Owner",
    collaborators: [
      { initials: "ME", color: "bg-green-500" },
      { initials: "DS", color: "bg-teal-500" },
      { initials: "JK", color: "bg-pink-500" },
    ],
    canDelete: true,
  },
  {
    id: "pbl-polinema",
    name: "PBL Polinema",
    status: "Collaborator",
    collaborators: [{ initials: "DS", color: "bg-teal-500" }],
    canDelete: false,
  },
];

// Komponen kecil untuk menampilkan badge status
const StatusBadge = ({ status }: { status: string }) => {
  const isOwner = status === "Owner";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isOwner ? "bg-teal-100 text-teal-800" : "bg-yellow-100 text-yellow-800"
      }`}>
      {status}
    </span>
  );
};

// Komponen kecil untuk menampilkan grup avatar
const CollaboratorAvatars = ({
  collaborators,
}: {
  collaborators: Collaborator[];
}) => {
  const visibleCollaborators = collaborators.slice(0, 3); // Tampilkan maksimal 3 avatar
  const hiddenCount = collaborators.length - visibleCollaborators.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {visibleCollaborators.map((collab, index) => (
          <div
            key={index}
            className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white ${collab.color}`}>
            {collab.initials}
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <span className="ml-3 text-sm font-medium text-gray-600">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
};

// ▼▼▼ PERUBAHAN UTAMA ADA DI SINI ▼▼▼

// Nama fungsi diubah agar lebih deskriptif sebagai "konten"
export default function OrganizationalContent() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar (Kembalikan) */}
      <Sidebar />

      {/* Main Content (Kembalikan) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Kembalikan) */}
        <Header />

        <div className="p-8 bg-white dark:bg-slate-900">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 dark:text-slate-100">
            Organizational Projects
          </h1>

          {/* Header Aksi: Search dan Tombol Create */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 bg-transparent dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-yellow-400 text-gray-900 font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
              Create Organizational
            </button>
          </div>

          {/* Tabel Proyek */}
          <div className="w-full overflow-hidden border border-gray-200 dark:border-slate-700 rounded-lg">
            <table className="w-full">
              <thead className="bg-[#3A7AC3] dark:bg-slate-800">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-white tracking-wider">
                    Organizational Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-white tracking-wider">
                    Collaborator
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-white tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                {projectsData.map((project, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <Link
                          href={`/organizational/${project.id}`}
                          className="font-medium text-gray-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">
                          {project.name}
                        </Link>
                        <StatusBadge status={project.status} />
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <CollaboratorAvatars
                        collaborators={project.collaborators}
                      />
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center space-x-5">
                        {project.canDelete && (
                          <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500">
                            <Trash2 size={20} />
                          </button>
                        )}
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <LogIn size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
