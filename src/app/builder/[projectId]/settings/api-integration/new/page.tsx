"use client";

import { createApiToken } from "@/app/builder/_actions/settings-actions"; 
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { 
  ArrowLeft, 
  Save, 
  ChevronDown, 
  CheckSquare, 
  Square 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CreateApiTokenPage() {
  const router = useRouter();
  const params = useParams(); 
  const [isLoading, setIsLoading] = useState(false);

  // URL Halaman List
  const backUrl = `/builder/${params.projectId}/settings/api-integration`;

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    validity: "7 Days",
    scope: "Custom", // Default Custom agar checkbox bisa diklik
  });

  // --- PERMISSION STATE ---
  const [permissions, setPermissions] = useState({
    create: true,
    delete: true,
    update: true,
    find: true,
    findOne: true,
  });

  // State untuk mengunci checkbox (jika Full Access / Read Only)
  const [isPermissionLocked, setIsPermissionLocked] = useState(false);

  // --- EFFECT: Handle Scope Change ---
  useEffect(() => {
    if (formData.scope === "Full Access") {
      setPermissions({
        create: true, delete: true, update: true, find: true, findOne: true
      });
      setIsPermissionLocked(true);
    } else if (formData.scope === "Read Only") {
      setPermissions({
        create: false, delete: false, update: false, find: true, findOne: true
      });
      setIsPermissionLocked(true);
    } else {
      // Custom: Buka kunci, biarkan user memilih
      setIsPermissionLocked(false);
    }
  }, [formData.scope]);

  // --- HANDLERS ---
  const handleSelectAll = () => {
    if (isPermissionLocked) return;
    const allSelected = Object.values(permissions).every(Boolean);
    const newState = !allSelected;
    
    setPermissions({
      create: newState,
      delete: newState,
      update: newState,
      find: newState,
      findOne: newState,
    });
  };

  const togglePermission = (key: keyof typeof permissions) => {
    if (isPermissionLocked) return;
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    // 1. Validasi Input
    if (!formData.name) {
        alert("Token Name is required");
        return;
    }

    setIsLoading(true);

    // 2. Siapkan Payload Data
    const payload = {
        name: formData.name,
        description: formData.description,
        validity: formData.validity,
        scope: formData.scope,
        permissions: permissions // Kirim object permissions
    };

    // 3. Panggil Server Action
    // Pastikan params.projectId selalu string
    const projectIdString = Array.isArray(params.projectId) ? params.projectId[0] : params.projectId;
    
    const result = await createApiToken(params.projectId as string, payload);
    setIsLoading(false);

    if (result.success) {
        router.push(backUrl);
    } else {
        alert("Error creating token: " + (result.error || "Unknown error"));
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8 min-h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* === HEADER === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <button 
            onClick={() => router.push(backUrl)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6] transition-colors mb-2 group font-medium"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create a New API Token</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Generate tokens to authenticate your applications securely.
          </p>
        </div>

        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg px-6 py-2.5 shadow-md transition-all flex items-center gap-2"
        >
          {isLoading ? "Saving..." : (
            <>
              <Save size={18} /> Save Token
            </>
          )}
        </Button>
      </div>

      {/* === FORM CONTAINER === */}
      <div className="space-y-8">
        
        {/* Input Grid (2 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Token Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              API Token Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Website Production Key"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <input 
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Used for fetching blog posts..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>

          {/* Validity Period */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Validity Period<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select 
                value={formData.validity}
                onChange={(e) => setFormData({...formData, validity: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] appearance-none cursor-pointer text-gray-900 dark:text-white"
              >
                <option>7 Days</option>
                <option>30 Days</option>
                <option>90 Days</option>
                <option>Forever</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-tight pt-1">
              Token will automatically expire after this period.
            </p>
          </div>

          {/* Access Scope */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Access Scope<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select 
                value={formData.scope}
                onChange={(e) => setFormData({...formData, scope: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] appearance-none cursor-pointer text-gray-900 dark:text-white"
              >
                <option>Custom</option>
                <option>Full Access</option>
                <option>Read Only</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

        </div>

        {/* === ACCESS PERMISSION SECTION === */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Access Permission</h3>
          
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
            
            {/* Card Header */}
            <div className="bg-[#3B82F6] px-6 py-3 flex justify-between items-center text-white">
              <h4 className="font-semibold text-sm">Customizable Content Models and Schema</h4>
              
              {/* Select All hanya muncul jika Custom */}
              {!isPermissionLocked && (
                <button 
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors"
                >
                  {Object.values(permissions).every(Boolean) ? <CheckSquare size={16} /> : <Square size={16} />}
                  Select All
                </button>
              )}
            </div>

            {/* Card Body */}
            <div className={cn("p-6 bg-white dark:bg-[#1e293b]", isPermissionLocked && "opacity-70 pointer-events-none")}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                
                <PermissionCheckbox 
                  label="Create Content Model" 
                  checked={permissions.create} 
                  onChange={() => togglePermission('create')} 
                />
                <PermissionCheckbox 
                  label="Delete Content Model" 
                  checked={permissions.delete} 
                  onChange={() => togglePermission('delete')} 
                />
                <PermissionCheckbox 
                  label="Find One Content Model" 
                  checked={permissions.findOne} 
                  onChange={() => togglePermission('findOne')} 
                />
                <PermissionCheckbox 
                  label="Update Content Model" 
                  checked={permissions.update} 
                  onChange={() => togglePermission('update')} 
                />
                <PermissionCheckbox 
                  label="Find Content Model" 
                  checked={permissions.find} 
                  onChange={() => togglePermission('find')} 
                />

              </div>
            </div>
          </div>
          {isPermissionLocked && (
            <p className="text-xs text-orange-500 italic">
              *Permissions are locked because "{formData.scope}" scope is selected. Switch to "Custom" to edit.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Custom Checkbox ---
function PermissionCheckbox({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string, 
  checked: boolean, 
  onChange: () => void 
}) {
  return (
    <div 
      onClick={onChange}
      className="flex items-center gap-3 cursor-pointer group select-none"
    >
      <div className={cn(
        "w-5 h-5 rounded border flex items-center justify-center transition-all",
        checked 
          ? "bg-[#3B82F6] border-[#3B82F6]" 
          : "bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600 group-hover:border-[#3B82F6]"
      )}>
        {checked && <CheckSquare size={14} className="text-white" />}
      </div>
      <span className="text-sm text-slate-600 dark:text-slate-300 font-medium group-hover:text-[#3B82F6] transition-colors">
        {label}
      </span>
    </div>
  );
}