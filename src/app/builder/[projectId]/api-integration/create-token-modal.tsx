"use client";

import { useState } from "react";
import { X, Loader2, Key, Calendar, Shield } from "lucide-react";
import { createApiToken } from "@/app/builder/_actions/api-token-actions";

export function CreateTokenModal({ 
  isOpen, 
  onClose, 
  projectId,
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  projectId: string;
  onSuccess: (token: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    role: "read_write", // Default
    expiresIn: "never"  // Default
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.name) return alert("Token Name is required");
    
    setIsLoading(true);
    const result = await createApiToken({
      ...formData,
      projectId
    });

    setIsLoading(false);

    if (result.success && result.token) {
      onSuccess(result.token); // Kirim token ke parent untuk ditampilkan
      onClose();
      setFormData({ name: "", description: "", role: "read_write", expiresIn: "never" }); // Reset
    } else {
      alert("Failed to create token");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-800">Create New API Token</h3>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-800" size={20}/></button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Token Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Token Name</label>
            <div className="relative">
               <Key className="absolute left-3 top-3 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="e.g. Website Production Frontend" 
                 className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 autoFocus
               />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Optional)</label>
            <input 
               type="text" 
               placeholder="Short description..." 
               className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Role */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Access Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 text-gray-400" size={16} />
                  <select 
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="read_only">Read Only</option>
                    <option value="read_write">Read & Write</option>
                    <option value="full_access">Full Access (Admin)</option>
                  </select>
                </div>
             </div>

             {/* Expiration */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiration</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                  <select 
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                    value={formData.expiresIn}
                    onChange={(e) => setFormData({...formData, expiresIn: e.target.value})}
                  >
                    <option value="7days">7 Days</option>
                    <option value="30days">30 Days</option>
                    <option value="never">Never Expires</option>
                  </select>
                </div>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
           <button 
             onClick={handleSubmit} 
             disabled={isLoading}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
           >
             {isLoading && <Loader2 size={16} className="animate-spin" />}
             Generate Token
           </button>
        </div>

      </div>
    </div>
  );
}