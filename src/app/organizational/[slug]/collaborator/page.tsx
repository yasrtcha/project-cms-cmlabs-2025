"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Search, Trash2, Loader2, Mail } from "lucide-react";
import { useOrganizationMembers, useOrganization } from "@/hooks/use-organizations";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";

export default function CollaboratorPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { organization } = useOrganization(slug);
  const { members, loading, inviteMember, removeMember, refetch } = useOrganizationMembers(slug);

  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ userId: string; name: string } | null>(null);

  // Filter members based on search
  const filteredMembers = members.filter(member =>
    member.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if current user is owner (Super Admin)
  const isOwner = (organization as any)?.userRole === "super-admin" || (organization as any)?.userRole === "owner";

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
            placeholder="Search collaborators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {isOwner && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add Collaborator
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading collaborators...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery ? "No collaborators found matching your search." : "No collaborators yet."}
          </p>
        </div>
      )}

      {/* Tabel Collaborator */}
      {!loading && filteredMembers.length > 0 && (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
          <table className="w-full bg-white dark:bg-slate-800">
            <thead className="bg-[#3A7AC3]">
              <tr>
                <th className="p-4 text-left text-white font-medium">Collaborator Name</th>
                <th className="p-4 text-center text-white font-medium">Status</th>
                <th className="p-4 text-center text-white font-medium">Role</th>
                <th className="p-4 text-center text-white font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {member.user.image ? (
                          <img
                            src={member.user.image}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium">
                            {member.user.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium block">
                            {member.user.name || "Unknown"}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {member.user.email}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-4 py-1 rounded-full text-xs font-semibold text-white capitalize ${(member.role === "super-admin" || member.role === "owner") ? "bg-[#3A7AC3]" :
                            member.role === "admin" ? "bg-red-500" :
                              member.role === "editor" ? "bg-blue-500" :
                                "bg-green-500"
                          }`}
                      >
                        {member.role === "super-admin" ? "Super Admin" : member.role}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${member.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {member.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${(member.role === "super-admin" || member.role === "owner") ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20" :
                        member.role === "admin" ? "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20" :
                          member.role === "editor" ? "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20" :
                            "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20"
                      }`}>
                      {member.role === "super-admin" ? "Super Admin" : member.role}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {member.status === "pending" && isOwner && (
                        <button
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Resend invitation"
                        >
                          <Mail size={18} />
                        </button>
                      )}
                      {member.role !== "owner" && member.role !== "super-admin" && isOwner && (
                        <button
                          onClick={() => setDeleteTarget({ userId: member.userId, name: member.user.name || "this member" })}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSubmit={inviteMember}
        title="Invite Collaborator"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            return await removeMember(deleteTarget.userId);
          }
          return { success: false, error: "No target selected" };
        }}
        title="Remove Collaborator"
        description={`Are you sure you want to remove "${deleteTarget?.name}" from this organization?`}
        confirmText="Remove"
      />
    </div>
  );
}
