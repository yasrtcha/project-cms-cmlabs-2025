"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Loader2, X, Copy, Check } from "lucide-react";

interface Organization {
  id: string;
  shortId?: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
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

export default function SettingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showNameModal, setShowNameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch organization data
  const fetchOrganization = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/organizations/${slug}`);
      const data = await res.json();

      if (data.success && data.data) {
        setOrganization(data.data);
        setNewName(data.data.name);
      } else {
        setError(data.error || "Organization not found");
      }
    } catch (err) {
      setError("Failed to fetch organization");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  // Update organization name
  const handleUpdateName = async () => {
    if (!newName.trim()) return;

    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/organizations/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() })
      });
      const data = await res.json();

      if (data.success) {
        setOrganization(prev => prev ? { ...prev, name: newName.trim() } : null);
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

  // Delete organization
  const handleDelete = async () => {
    if (deleteConfirm !== organization?.name) {
      setActionError("Please type the organization name to confirm");
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/organizations/${slug}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (data.success) {
        router.push("/organizational");
      } else {
        setActionError(data.error || "Failed to delete organization");
      }
    } catch (err) {
      setActionError("Failed to delete organization");
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  // Error state
  if (error || !organization) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error || "Organization not found"}</p>
      </div>
    );
  }

  const displayId = organization.shortId || organization.id.substring(0, 6).toUpperCase();

  return (
    <div className="p-8">
      {/* Success Toast */}
      {actionSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={18} />
          {actionSuccess}
        </div>
      )}

      {/* Judul Halaman */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Setting
      </h1>

      {/* 1. INFORMATION CARD */}
      <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden mb-8">
        {/* Header Biru */}
        <div className="bg-[#3A7AC3] px-6 py-3">
          <h2 className="text-white font-medium">Information</h2>
        </div>

        {/* Body */}
        <div className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
          {/* Organization ID */}
          <div className="grid grid-cols-12 px-6 py-4 items-center">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Organization ID
            </div>
            <div className="col-span-9 flex items-center gap-2">
              <span className="text-sm text-gray-900 dark:text-white font-mono">
                {displayId}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(organization.id)}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Copy full ID"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          {/* Organization Name */}
          <div className="grid grid-cols-12 px-6 py-4 items-center">
            <div className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Organization Name
            </div>
            <div className="col-span-9 flex justify-between items-center">
              <span className="text-sm text-gray-900 dark:text-white">
                {organization.name}
              </span>
              <button
                onClick={() => setShowNameModal(true)}
                className="text-[#3A7AC3] text-sm hover:underline font-medium"
              >
                Change Name
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DANGER ZONE CARD */}
      <div className="border border-red-500 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
        {/* Header Merah */}
        <div className="bg-red-600 px-6 py-3">
          <h2 className="text-white font-medium">Danger Zone</h2>
        </div>

        {/* Body */}
        <div className="p-6 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">
              Delete Organization
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              If you delete the organization, it will be permanently deleted and
              you cannot recover it. All projects will also be deleted.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </div>

      {/* MODALS */}

      {/* Change Name Modal */}
      <Modal isOpen={showNameModal} onClose={() => setShowNameModal(false)} title="Change Organization Name">
        {actionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {actionError}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organization Name
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Organization">
        {actionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {actionError}
          </div>
        )}
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This action cannot be undone. This will permanently delete the organization
            <strong className="text-gray-900 dark:text-white"> {organization.name}</strong> and all its projects.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type <strong>{organization.name}</strong> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={organization.name}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirm("");
                setActionError(null);
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={actionLoading || deleteConfirm !== organization.name}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Organization
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
