"use client";

// Mock data - will be replaced with API data
const mockUsage = {
  status: "Good",
  bandwidth: { used: 50, total: 100, unit: "GB" },
  apiCalls: { used: 200, total: 500, unit: "k" },
  mediaAssets: { used: 1350, total: 5000, unit: "file" },
};

export function SystemUsageOverview() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "good":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-slate-700/50 px-6 py-3 border-b border-blue-200 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          System Usage Overview
        </h2>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* Status Circle */}
          <div className="relative">
            <div className={`w-24 h-24 rounded-full ${getStatusColor(mockUsage.status)} flex items-center justify-center`}>
              <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full ${getStatusColor(mockUsage.status)}`} />
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="flex-1 space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Status</span>
              <span className={`${getStatusColor(mockUsage.status)} text-white text-xs px-3 py-0.5 rounded-full font-medium`}>
                {mockUsage.status}
              </span>
            </div>

            {/* Bandwidth */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Bandwidth</span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(mockUsage.bandwidth.used, mockUsage.bandwidth.total)} rounded-full`}
                    style={{ width: `${(mockUsage.bandwidth.used / mockUsage.bandwidth.total) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-900 dark:text-white font-medium whitespace-nowrap">
                  {mockUsage.bandwidth.used} / {mockUsage.bandwidth.total} {mockUsage.bandwidth.unit}
                </span>
              </div>
            </div>

            {/* API Calls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-24">API calls</span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(mockUsage.apiCalls.used, mockUsage.apiCalls.total)} rounded-full`}
                    style={{ width: `${(mockUsage.apiCalls.used / mockUsage.apiCalls.total) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-900 dark:text-white font-medium whitespace-nowrap">
                  {mockUsage.apiCalls.used}{mockUsage.apiCalls.unit} / {mockUsage.apiCalls.total}{mockUsage.apiCalls.unit}
                </span>
              </div>
            </div>

            {/* Media Assets */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Media Assets</span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(mockUsage.mediaAssets.used, mockUsage.mediaAssets.total)} rounded-full`}
                    style={{ width: `${(mockUsage.mediaAssets.used / mockUsage.mediaAssets.total) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-900 dark:text-white font-medium whitespace-nowrap">
                  {mockUsage.mediaAssets.used} / {mockUsage.mediaAssets.total} {mockUsage.mediaAssets.unit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
