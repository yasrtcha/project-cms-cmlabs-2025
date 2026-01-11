"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Trash2, LogIn, Loader2 } from "lucide-react";
import { Sidebar } from "../../../components/layout/sidebar";
import { Header } from "../../../components/layout/header";
import { useOrganizations } from "@/hooks/use-organizations";
import { CreateOrganizationModal } from "@/components/modals/create-organization-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";

// Komponen kecil untuk menampilkan badge status
const StatusBadge = ({ status }: { status: string }) => {
  const isSuperAdmin = status === "super-admin" || status === "owner";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${isSuperAdmin ? "bg-teal-100 text-teal-800" : "bg-yellow-100 text-yellow-800"
        }`}>
      {status === "super-admin" ? "Super Admin" : status}
    </span>
  );
};

// Komponen kecil untuk menampilkan grup avatar
const CollaboratorAvatars = ({
  members,
}: {
  members: Array<{ user: { name: string | null; image: string | null } }>;
}) => {
  const visibleMembers = members.slice(0, 3);
  const hiddenCount = members.length - visibleMembers.length;

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const colors = ["bg-green-500", "bg-teal-500", "bg-pink-500", "bg-blue-500", "bg-purple-500"];

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {visibleMembers.map((member, index) => (
          <div
            key={index}
            className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white ${colors[index % colors.length]}`}>
            {member.user.image ? (
              <img src={member.user.image} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              getInitials(member.user.name)
            )}
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

export default function OrganizationalContent() {
  const { organizations, loading, error, createOrganization, deleteOrganization, refetch } = useOrganizations();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Filter organizations based on search
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="p-8 bg-white dark:bg-slate-900 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 dark:text-slate-100">
            Organizational Projects
          </h1>

          {/* Header Aksi: Search dan Tombol Create */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 bg-transparent dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white dark:text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Organizational
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading organizations...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery ? "No organizations found matching your search." : "You don't have any organizations yet."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white dark:text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create your first organization
                </button>
              )}
            </div>
          )}

          {/* Tabel Proyek */}
          {!loading && !error && filteredOrganizations.length > 0 && (
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
                  {filteredOrganizations.map((org) => (
                    <tr
                      key={org.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <Link
                            href={`/organizational/${org.slug}`}
                            className="font-medium text-gray-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">
                            {org.name}
                          </Link>
                          <StatusBadge status={(org as any).userRole || "collaborator"} />
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <CollaboratorAvatars members={org.members || []} />
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center space-x-5">
                          {((org as any).userRole === "owner" || (org as any).userRole === "super-admin") && (
                            <button
                              onClick={() => setDeleteTarget({ id: org.id, name: org.name })}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                          <Link
                            href={`/organizational/${org.slug}`}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <LogIn size={20} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createOrganization}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            return await deleteOrganization(deleteTarget.id);
          }
          return { success: false, error: "No target selected" };
        }}
        title="Delete Organization"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone and will delete all projects within this organization.`}
      />
    </div>
  );
}
