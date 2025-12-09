"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { Sidebar } from "../../../components/layout/sidebar";
import { Header } from "../../../components/layout/header";

import {
  Search,
  Trash2,
  ExternalLink,
  Loader2,
  Plus,
  X,
  FolderOpen,
} from "lucide-react";

interface Project {
  id: string;
  shortId?: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string | null;
    email: string | null;
  };
  _count: {
    members: number;
    contentTypes: number;
  };
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Modal Component
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function PersonalProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Form states
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/personal-projects?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Create project
  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      const res = await fetch("/api/personal-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newProjectName.trim(),
          description: newProjectDesc.trim() || null
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setShowCreateModal(false);
        setNewProjectName("");
        setNewProjectDesc("");
        fetchProjects();
      } else {
        setActionError(data.error || "Failed to create project");
      }
    } catch (err) {
      setActionError("Failed to create project");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete project
  const handleDelete = async () => {
    if (!selectedProject) return;
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      const res = await fetch(`/api/personal-projects/${selectedProject.id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      
      if (data.success) {
        setShowDeleteModal(false);
        setSelectedProject(null);
        fetchProjects();
      } else {
        setActionError(data.error || "Failed to delete project");
      }
    } catch (err) {
      setActionError("Failed to delete project");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-8">
              Personal Projects
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-slate-800 border-none rounded-lg text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-yellow-400 text-gray-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Create Project
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading projects...</span>
              </div>
            ) : projects.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <FolderOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No personal projects yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Create your first personal project or duplicate from organizational projects.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Create Project
                </button>
              </div>
            ) : (
              /* Projects Table */
              <div className="w-full overflow-hidden border border-gray-200 dark:border-slate-700 rounded-lg">
                <table className="w-full">
                  <thead className="bg-[#3A7AC3]">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-white tracking-wider">
                        Project Name
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-white tracking-wider">
                        Status
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-white tracking-wider">
                        Last Update
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-white tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                    {projects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-slate-100">
                            {project.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {project.shortId || project.id.substring(0, 6).toUpperCase()}
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            project.status === "progress" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                            project.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            project.status === "completed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-gray-600 dark:text-slate-400">
                          {formatRelativeTime(project.updatedAt)}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedProject(project);
                                setShowDeleteModal(true);
                              }}
                              title="Delete"
                              className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                            <Link
                              href={`/personal-project/${project.id}`}
                              title="Open"
                              className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900 transition-colors flex items-center justify-center"
                            >
                              <ExternalLink size={16} />
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
        </main>
      </div>

      {/* Create Project Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Personal Project">
        {actionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {actionError}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="My Awesome Project"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={actionLoading || !newProjectName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Project">
        {actionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {actionError}
          </div>
        )}
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{selectedProject?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}