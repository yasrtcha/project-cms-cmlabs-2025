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

  // Check if current user is owner
  const isOwner = (organization as any)?.userRole === "owner";

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
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-md transition-colors"
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
                        className={`px-4 py-1 rounded-full text-xs font-semibold text-white capitalize ${
                          member.role === "owner" ? "bg-[#3A7AC3]" : "bg-yellow-400"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      member.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {member.status}
                    </span>
                  </td>

                  <td className="p-4 text-center text-gray-600 dark:text-gray-300 text-sm capitalize">
                    {member.role}
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
                      {member.role !== "owner" && isOwner && (
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
