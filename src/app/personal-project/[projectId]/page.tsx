"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "../../../components/layout/sidebar";
import { Header } from "../../../components/layout/header";
import { Trash2, Loader2, Copy, X, Check } from "lucide-react";

interface ProjectDetail {
  id: string;
  shortId?: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  customDomain: string | null;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string | null;
    email: string | null;
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
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function PersonalProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showNameModal, setShowNameModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch project
  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/personal-projects/${projectId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProject(data.data);
        setNewName(data.data.name);
        setNewStatus(data.data.status);
        setNewDomain(data.data.customDomain || "");
      } else {
        setError(data.error || "Project not found");
      }
    } catch (err) {
      setError("Failed to fetch project");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  // Update name
  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/personal-projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setProject(prev => prev ? { ...prev, name: newName.trim() } : null);
        setShowNameModal(false);
        setActionSuccess("Name updated successfully");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.error || "Failed to update name");
      }
    } catch (err) {
      setActionError("Failed to update name");
    } finally {
      setActionLoading(false);
    }
  };

  // Update status
  const handleUpdateStatus = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/personal-projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProject(prev => prev ? { ...prev, status: newStatus } : null);
        setShowStatusModal(false);
        setActionSuccess("Status updated successfully");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.error || "Failed to update status");
      }
    } catch (err) {
      setActionError("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // Update domain
  const handleUpdateDomain = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/personal-projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customDomain: newDomain.trim() || null })
      });
      const data = await res.json();
      if (data.success) {
        setProject(prev => prev ? { ...prev, customDomain: newDomain.trim() || null } : null);
        setShowDomainModal(false);
        setActionSuccess("Domain updated successfully");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.error || "Failed to update domain");
      }
    } catch (err) {
      setActionError("Failed to update domain");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete project
  const handleDelete = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/personal-projects/${projectId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/personal-project");
      } else {
        setActionError(data.error || "Failed to delete project");
      }
    } catch (err) {
      setActionError("Failed to delete project");
    } finally {
      setActionLoading(false);
    }
  };

  // Duplicate project
  const handleDuplicate = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch("/api/personal-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${project?.name} (Copy)`, description: project?.description })
      });
      const data = await res.json();
      if (data.success) {
        setShowDuplicateModal(false);
        setActionSuccess("Project duplicated successfully");
        setTimeout(() => router.push(`/personal-project/${data.data.id}`), 1000);
      } else {
        setActionError(data.error || "Failed to duplicate project");
      }
    } catch (err) {
      setActionError("Failed to duplicate project");
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || "Project not found"}</p>
              <Link href="/personal-project" className="text-blue-500 hover:underline">Back to Projects</Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const displayId = project.shortId || project.id.substring(0, 6).toUpperCase();
  const defaultDomain = `${project.slug}.cmscmlabs.com`;
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "progress": return "bg-yellow-400";
      case "active": return "bg-green-500";
      case "completed": return "bg-blue-500";
      case "archived": return "bg-gray-500";
      default: return "bg-yellow-400";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {/* Success Toast */}
          {actionSuccess && (
            <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <Check size={18} />{actionSuccess}
            </div>
          )}

          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/personal-project" className="text-[#3A7AC3] hover:underline">Personal Projects</Link> /{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{project.name}</span>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            <Link href={`/builder/${project.id}`} className="bg-[#3A7AC3] hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-md transition-colors">
              Enter Project
            </Link>
          </div>

          {/* 1. INFORMATION CARD */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden mb-8">
            <div className="bg-[#3A7AC3] px-6 py-3">
              <h2 className="text-white font-semibold">Information</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">Project ID</div>
                <div className="col-span-9 flex items-center gap-2">
                  <span className="text-sm text-gray-900 dark:text-white font-mono">{displayId}</span>
                  <button onClick={() => navigator.clipboard.writeText(project.id)} className="text-gray-400 hover:text-gray-600 p-1" title="Copy full ID">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">Project Name</div>
                <div className="col-span-9 flex justify-between items-center">
                  <span className="text-sm text-gray-900 dark:text-white">{project.name}</span>
                  <button onClick={() => setShowNameModal(true)} className="text-[#3A7AC3] text-sm hover:underline font-medium">Change Name</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated</div>
                <div className="col-span-9 text-sm text-gray-900 dark:text-white">{formatRelativeTime(project.updatedAt)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</div>
                <div className="col-span-9 flex justify-between items-center">
                  <span className={`${getStatusColor(project.status)} text-white text-xs px-4 py-1 rounded-md font-medium capitalize`}>{project.status}</span>
                  <button onClick={() => setShowStatusModal(true)} className="text-[#3A7AC3] text-sm hover:underline font-medium">Change Status</button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CUSTOM DOMAIN CARD */}
          <div className="border border-yellow-400 rounded-lg overflow-hidden mb-8">
            <div className="bg-yellow-400 px-6 py-3">
              <h2 className="text-gray-900 font-semibold">Custom Domain</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                By default, your site can be accessed through a subdomain. Add your own custom domain for personalization.
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                  {project.customDomain || defaultDomain}
                </div>
                <button onClick={() => setShowDomainModal(true)} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-md transition-colors w-full md:w-auto">
                  Custom Domain
                </button>
              </div>
            </div>
          </div>

          {/* 3. DANGER ZONE CARD */}
          <div className="border border-red-600 rounded-lg overflow-hidden">
            <div className="bg-red-600 px-6 py-3">
              <h2 className="text-white font-semibold">Danger Zone</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <div className="p-6 flex justify-between items-center hover:bg-red-50/50 dark:hover:bg-red-900/10">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Duplicate Project</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Create a copy of this project with the same settings.</p>
                </div>
                <button onClick={() => setShowDuplicateModal(true)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30">
                  <Copy size={20} />
                </button>
              </div>
              <div className="p-6 flex justify-between items-center hover:bg-red-50/50 dark:hover:bg-red-900/10">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Delete Project</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Permanently delete this project. This action cannot be undone.</p>
                </div>
                <button onClick={() => setShowDeleteModal(true)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODALS */}
      <Modal isOpen={showNameModal} onClose={() => setShowNameModal(false)} title="Change Project Name">
        {actionError && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{actionError}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowNameModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
            <button onClick={handleUpdateName} disabled={actionLoading || !newName.trim()} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Change Status">
        {actionError && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{actionError}</div>}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["progress", "active", "completed", "archived"].map((status) => (
              <button key={status} onClick={() => setNewStatus(status)} className={`px-4 py-2 rounded-lg border capitalize ${newStatus === status ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"}`}>
                {status}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
            <button onClick={handleUpdateStatus} disabled={actionLoading} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDomainModal} onClose={() => setShowDomainModal(false)} title="Set Custom Domain">
        {actionError && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{actionError}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Domain</label>
            <input type="text" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="example.com" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white" />
            <p className="text-xs text-gray-500 mt-1">Leave empty to use default: {defaultDomain}</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDomainModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
            <button onClick={handleUpdateDomain} disabled={actionLoading} className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 disabled:opacity-50 flex items-center gap-2">
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDuplicateModal} onClose={() => setShowDuplicateModal(false)} title="Duplicate Project">
        {actionError && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{actionError}</div>}
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Create a copy of "{project.name}"?</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDuplicateModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
            <button onClick={handleDuplicate} disabled={actionLoading} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}Duplicate
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Project">
        {actionError && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{actionError}</div>}
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Are you sure you want to delete "{project.name}"? This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
            <button onClick={handleDelete} disabled={actionLoading} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2">
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
