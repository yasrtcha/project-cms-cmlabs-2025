"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, Trash2, LogIn, Loader2 } from "lucide-react";
import { useOrganization, useOrganizationProjects } from "@/hooks/use-organizations";
import { CreateProjectModal } from "@/components/modals/create-project-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";

// Badge untuk role di project
const RoleBadge = ({ role }: { role: { name: string; color: string | null } | null }) => {
  if (!role) return null;
  
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    gray: "bg-gray-500",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${colorMap[role.color || "blue"] || "bg-blue-500"}`}>
      {role.name}
    </span>
  );
};

// Avatar Group untuk project members
const AvatarGroup = ({ members }: { members: Array<{ user?: { name: string | null; image: string | null } }> }) => {
  const visibleMembers = members.slice(0, 3);
  const hiddenCount = members.length - visibleMembers.length;

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const colors = ["bg-green-500", "bg-teal-500", "bg-pink-500", "bg-blue-500"];

  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-2">
        {visibleMembers.map((member, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs border-2 border-white ${colors[index % colors.length]}`}
          >
            {member.user?.image ? (
              <img src={member.user.image} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              getInitials(member.user?.name || null)
            )}
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
};

// Format relative time
const formatRelativeTime = (date: Date | string) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(date).toLocaleDateString();
};

export default function OrganizationalDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { organization, loading: orgLoading } = useOrganization(slug);
  const { projects, loading: projectsLoading, createProject, deleteProject, refetch } = useOrganizationProjects(slug);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const loading = orgLoading || projectsLoading;

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Judul Halaman */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase">
        {organization?.name || slug?.replace("-", " ")}
      </h1>

      {/* Baris Search dan Tombol Create */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-3xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-slate-800 dark:text-white border-none rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-md transition-colors flex items-center"
        >
          Create Project
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading projects...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery ? "No projects found matching your search." : "No projects yet in this organization."}
          </p>
          {!searchQuery && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-yellow-400 text-gray-900 font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Create your first project
            </button>
          )}
        </div>
      )}

      {/* Tabel */}
      {!loading && filteredProjects.length > 0 && (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
          <table className="w-full bg-white dark:bg-slate-800">
            <thead className="bg-[#3A7AC3]">
              <tr>
                <th className="p-4 text-left text-white font-medium">Project Name</th>
                <th className="p-4 text-center text-white font-medium">Last Update</th>
                <th className="p-4 text-center text-white font-medium">Collaborator</th>
                <th className="p-4 text-center text-white font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/organizational/${slug}/${project.id}`}
                        className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {project.name}
                      </Link>
                      <RoleBadge role={(project as any).userRole} />
                    </div>
                  </td>

                  <td className="p-4 text-center text-gray-600 dark:text-gray-300 text-sm">
                    {formatRelativeTime(project.updatedAt)}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center">
                      <AvatarGroup members={project.members || []} />
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-4">
                      <button 
                        onClick={() => setDeleteTarget({ id: project.id, name: project.name })}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <Link
                        href={`/organizational/${slug}/${project.id}`}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                      >
                        <LogIn size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createProject}
        organizationName={organization?.name}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            return await deleteProject(deleteTarget.id);
          }
          return { success: false, error: "No target selected" };
        }}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
