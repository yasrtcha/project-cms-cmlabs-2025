"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Loader2, Copy, X, Check } from "lucide-react";

interface ProjectDetail {
  id: string;
  shortId: string; // 6 karakter unik untuk display
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
  organization: {
    id: string;
    name: string;
    slug: string;
  } | null;
  userRole: {
    name: string;
    slug: string;
  } | null;
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

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const slug = params.slug as string;

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

  // Fetch project data
  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}`);
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

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Update project name
  const handleUpdateName = async () => {
    if (!newName.trim()) return;

    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
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

  // Update project status
  const handleUpdateStatus = async () => {
    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
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

  // Update custom domain
  const handleUpdateDomain = async () => {
    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
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
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (data.success) {
        router.push(`/organizational/${slug}`);
      } else {
        setActionError(data.error || "Failed to delete project");
      }
    } catch (err) {
      setActionError("Failed to delete project");
    } finally {
      setActionLoading(false);
    }
  };

  // Duplicate project (within organization)
  const handleDuplicate = async () => {
    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/organizations/${slug}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${project?.name} (Copy)`,
          description: project?.description
        })
      });
      const data = await res.json();

      if (data.success) {
        setShowDuplicateModal(false);
        setActionSuccess("Project duplicated successfully");
        setTimeout(() => {
          router.push(`/organizational/${slug}/${data.data.id}`);
        }, 1000);
      } else {
        setActionError(data.error || "Failed to duplicate project");
      }
    } catch (err) {
      setActionError("Failed to duplicate project");
    } finally {
      setActionLoading(false);
    }
  };

  // Duplicate to Personal Projects
  const handleDuplicateToPersonal = async () => {
    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch("/api/personal-projects/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceProjectId: project?.id })
      });
      const data = await res.json();

      if (data.success) {
        setActionSuccess("Project duplicated to Personal Projects!");
        setTimeout(() => {
          router.push(`/personal-project/${data.data.id}`);
        }, 1500);
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
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading project...</span>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error || "Project not found"}</p>
        <Link href={`/organizational/${slug}`} className="text-blue-500 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const defaultDomain = `${project.slug}.cmscmlabs.com`;

  // Status badge colors
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
    <div className="p-8">
      {/* Success Toast */}
      {actionSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={18} />
          {actionSuccess}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Pages / Organizational Projects /{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {project.name}
        </span>
      </div>

      {/* Header Title & Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>
          {project.userRole && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Your role: <span className="font-medium text-blue-500">{project.userRole.name}</span>
            </span>
          )}
        </div>
        <Link
          href={`/builder/${project.id}`}
          className="bg-[#3A7AC3] hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-md transition-colors">
          Enter Project
        </Link>
      </div>

      {/* 1. INFORMATION CARD */}
      <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden mb-8">
        <div className="bg-[#3A7AC3] px-6 py-3">
          <h2 className="text-white font-medium">Information</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
          {/* Project ID */}
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-2 md:gap-0">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Project ID
            </div>
            <div className="col-span-9 flex items-center gap-2">
              <span className="text-sm text-gray-900 dark:text-white font-mono">
                {project.shortId || project.id.substring(0, 6).toUpperCase()}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(project.id)}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Copy full ID"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          {/* Project Name */}
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-2 md:gap-0">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Project Name
            </div>
            <div className="col-span-9 flex justify-between items-center">
              <span className="text-sm text-gray-900 dark:text-white">
                {project.name}
              </span>
              <button
                onClick={() => setShowNameModal(true)}
                className="text-[#3A7AC3] text-sm hover:underline font-medium"
              >
                Change Name
              </button>
            </div>
          </div>

          {/* Last Updated */}
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-2 md:gap-0">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Last Updated
            </div>
            <div className="col-span-9 text-sm text-gray-900 dark:text-white">
              {formatRelativeTime(project.updatedAt)}
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-2 md:gap-0">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Status
            </div>
            <div className="col-span-9 flex justify-between items-center">
              <span className={`${getStatusColor(project.status)} text-white text-xs px-3 py-1 rounded-md font-medium shadow-sm capitalize`}>
                {project.status}
              </span>
              <button
                onClick={() => setShowStatusModal(true)}
                className="text-[#3A7AC3] text-sm hover:underline font-medium"
              >
                Change Status
              </button>
            </div>
          </div>

          {/* Owner */}
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-2 md:gap-0">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Created By
            </div>
            <div className="col-span-9 text-sm text-gray-900 dark:text-white">
              {project.owner.name || project.owner.email}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CUSTOM DOMAIN CARD */}
      <div className="border border-blue-200 dark:border-blue-900/30 rounded-lg overflow-hidden mb-8">
        <div className="bg-[#3A7AC3] px-6 py-3">
          <h2 className="text-white font-medium">Custom Domain</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            By default, your site on {project.name} can be accessed through a
            subdomain generated from your project name. To make it more
            personalized, add your own custom domain.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
              {project.customDomain || defaultDomain}
            </div>
            <button
              onClick={() => setShowDomainModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors w-full md:w-auto dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Custom Domain
            </button>
          </div>
        </div>
      </div>

      {/* 3. DANGER ZONE CARD */}
      <div className="border border-red-500/50 rounded-lg overflow-hidden">
        <div className="bg-red-600 px-6 py-3">
          <h2 className="text-white font-medium">Danger Zone</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700/50">
          {/* Duplicate Projects */}
          <div className="p-6 flex justify-between items-center hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Duplicate Projects
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You are about to duplicate this project. A new copy will be
                created with the same content and settings.
              </p>
            </div>
            <button
              onClick={() => setShowDuplicateModal(true)}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Copy size={20} />
            </button>
          </div>

          {/* Duplicate to Personal */}
          <div className="p-6 flex justify-between items-center hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Duplicate to Personal
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Copy this project to your Personal Projects. The original project will remain unchanged.
              </p>
            </div>
            <button
              onClick={handleDuplicateToPersonal}
              disabled={actionLoading}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
            >
              <Copy size={20} />
            </button>
          </div>

          {/* Delete Projects */}
          <div className="p-6 flex justify-between items-center hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Delete Projects
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                If you delete this project, it will be permanently deleted
                and you cannot recover it.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* Change Name Modal */}
      <Modal isOpen={showNameModal} onClose={() => setShowNameModal(false)} title="Change Project Name">
        {actionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {actionError}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowNameModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateName}
              disabled={actionLoading || !newName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Change Status Modal */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Change Project Status">
        {actionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {actionError}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["progress", "active", "completed", "archived"].map((status) => (
                <button
                  key={status}
                  onClick={() => setNewStatus(status)}
                  className={`px-4 py-2 rounded-lg border capitalize transition-colors ${newStatus === status
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                    : "border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Custom Domain Modal */}
      <Modal isOpen={showDomainModal} onClose={() => setShowDomainModal(false)} title="Set Custom Domain">
        {actionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {actionError}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Custom Domain
            </label>
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use default: {defaultDomain}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDomainModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateDomain}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Duplicate Modal */}
      <Modal isOpen={showDuplicateModal} onClose={() => setShowDuplicateModal(false)} title="Duplicate Project">
        {actionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {actionError}
          </div>
        )}
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to duplicate "{project.name}"? A new copy will be created with the name "{project.name} (Copy)".
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDuplicateModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDuplicate}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Duplicate
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
            Are you sure you want to delete "{project.name}"? This action cannot be undone.
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
