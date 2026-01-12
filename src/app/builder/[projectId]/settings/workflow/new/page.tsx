"use client";

import { createWorkflow } from "@/app/builder/_actions/settings-actions"; // Import Server Action
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Plus,
  GripVertical,
  Trash2,
  GitPullRequest
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Note: Idealnya ini diambil dari DB via prop, tapi hardcoded untuk simplifikasi UI saat ini
const contentTypes = ["Blog Post", "Page", "Author", "Category", "Product"]; 
const roles = ["Editor", "Chief Editor", "Legal Team", "Administrator", "Project Manager"];

export default function CreateWorkflowPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const backUrl = `/builder/${params.projectId}/settings/workflow`;

  // --- STATE ---
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    contentType: "",
    description: "",
  });

  const [steps, setSteps] = useState([
    { id: Date.now(), name: "Review Stage 1", assignee: "" }
  ]);

  // --- HANDLERS ---
  const addStep = () => {
    setSteps([
      ...steps,
      { id: Date.now(), name: `Review Stage ${steps.length + 1}`, assignee: "" }
    ]);
  };

  const removeStep = (id: number) => {
    if (steps.length === 1) {
        alert("Minimal must contain 1 approval step.");
        return;
    }
    setSteps(steps.filter(step => step.id !== id));
  };

  const updateStep = (id: number, field: 'name' | 'assignee', value: string) => {
    setSteps(steps.map(step => 
        step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleSave = async () => {
    // 1. Validasi
    if (!basicInfo.name || !basicInfo.contentType) {
        alert("Please fill in Workflow Name and Content Type.");
        return;
    }
    
    setIsLoading(true);

    // 2. Siapkan Data
    const payload = {
        name: basicInfo.name,
        description: basicInfo.description,
        contentType: basicInfo.contentType,
        steps: steps // Array: [{name, assignee}, ...]
    };

    // 3. Panggil Server Action
    const result = await createWorkflow(params.projectId as string, payload);

    setIsLoading(false);

    if (result.success) {
        router.push(backUrl);
    } else {
        alert("Error saving workflow: " + result.error);
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create New Workflow</h1>
        </div>

        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg px-6 py-2.5 shadow-md transition-all flex items-center gap-2"
        >
          {isLoading ? "Saving..." : (
            <>
              <Save size={18} /> Save Workflow
            </>
          )}
        </Button>
      </div>

      <div className="space-y-8">
        
        {/* === SECTION 1: BASIC INFORMATION === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Workflow Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input 
              type="text"
              value={basicInfo.name}
              onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
              placeholder="e.g. Blog Publish Process"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Applied To Content Type<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
                <select 
                value={basicInfo.contentType}
                onChange={(e) => setBasicInfo({...basicInfo, contentType: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] appearance-none cursor-pointer text-gray-900 dark:text-white"
                >
                <option value="">Select Content Type</option>
                {contentTypes.map((ct) => (
                    <option key={ct} value={ct}>{ct}</option>
                ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
          </div>

           <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea 
              value={basicInfo.description}
              onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
              placeholder="Briefly describe this approval process..."
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all text-gray-900 dark:text-white resize-none"
            />
          </div>
        </div>

        {/* === SECTION 2: APPROVAL STEPS === */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitPullRequest size={20} className="text-[#3B82F6]" />
            Approval Steps Sequence
          </h3>
          
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm bg-white dark:bg-[#1e293b]">
            
            <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-3 flex items-center text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                <div className="w-10"></div>
                <div className="flex-1 px-4">Step Name</div>
                <div className="flex-1 px-4">Assignee Role</div>
                <div className="w-16 text-center">Action</div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {steps.map((step, index) => (
                <div key={step.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <div className="w-10 flex justify-center text-gray-300 dark:text-slate-600 cursor-grab">
                    <GripVertical size={20} />
                  </div>

                  <div className="flex-1">
                    <input 
                      type="text"
                      value={step.name}
                      onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:text-white font-medium"
                      placeholder="e.g. Manager Review"
                    />
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1">
                        Sequence #{index + 1}
                    </span>
                  </div>

                  <div className="flex-1 relative">
                    <select 
                        value={step.assignee}
                        onChange={(e) => updateStep(step.id, 'assignee', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] appearance-none cursor-pointer text-gray-900 dark:text-white"
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>

                  <div className="w-16 flex justify-center">
                    <button 
                      onClick={() => removeStep(step.id)}
                      disabled={steps.length === 1}
                      className="p-2 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Remove step"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 border-t border-gray-100 dark:border-slate-700">
                <Button 
                    onClick={addStep}
                    variant="outline" 
                    className="w-full border-dashed border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add Another Approval Step
                </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 px-2">
            Content will move to the next stage only after being approved by the assignee of the current stage.
          </p>
        </div>
      </div>
    </div>
  );
}