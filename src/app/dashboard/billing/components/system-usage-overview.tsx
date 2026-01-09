"use client";

// Mock data - will be replaced with API data
const mockUsage = {
  status: "Good",
  bandwidth: { used: 50, total: 100, unit: "GB" },
  apiCalls: { used: 200, total: 500, unit: "k" },
  mediaAssets: { used: 1350, total: 5000, unit: "file" },
};

export function SystemUsageOverview() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#F1F5F9] dark:bg-slate-700/50 px-6 py-2 border-b border-blue-200 dark:border-slate-700">
        <h2 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          System Usage Overview
        </h2>
      </div>

      {/* Content */}
      <div className="p-8 flex items-center gap-10 h-full">
        {/* Progress Circle Visual */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-[10px] border-[#F1F5F9] dark:border-slate-700 relative flex items-center justify-center">
            <div className="absolute inset-[-10px] rounded-full border-[10px] border-[#4ADE80] border-r-transparent border-b-transparent -rotate-45" />
            <div className="w-20 h-20 rounded-full bg-[#4ADE80] shadow-[0_0_20px_rgba(74,222,128,0.3)]" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-5">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-300 w-24">Status</span>
            <span className="bg-[#4ADE80] text-white text-[10px] px-4 py-1 rounded-full font-bold uppercase tracking-wider">
              {mockUsage.status}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-300 w-24">Bandwidth</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {mockUsage.bandwidth.used} / {mockUsage.bandwidth.total} {mockUsage.bandwidth.unit}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-300 w-24">API calls</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {mockUsage.apiCalls.used}{mockUsage.apiCalls.unit} / {mockUsage.apiCalls.total}{mockUsage.apiCalls.unit}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-300 w-24">Media Assets</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {mockUsage.mediaAssets.used} / {mockUsage.mediaAssets.total} {mockUsage.mediaAssets.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
