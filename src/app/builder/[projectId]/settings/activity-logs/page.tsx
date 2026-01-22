import { getProjectActivityLogs } from "@/app/builder/_actions/settings-actions";
import { 
  Activity, 
  Search, 
  User as UserIcon, 
  Clock, 
  ShieldAlert, 
  PlusCircle, 
  Trash2, 
  FileEdit, 
  CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper: Menentukan Warna & Icon berdasarkan Action
function getActionStyle(action: string) {
  if (action.includes("CREATE")) {
    return { 
      color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400", 
      icon: <PlusCircle size={14} /> 
    };
  }
  if (action.includes("DELETE")) {
    return { 
      color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400", 
      icon: <Trash2 size={14} /> 
    };
  }
  if (action.includes("UPDATE") || action.includes("EDIT")) {
    return { 
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400", 
      icon: <FileEdit size={14} /> 
    };
  }
  if (action.includes("APPROVE") || action.includes("PUBLISH")) {
    return { 
      color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400", 
      icon: <CheckCircle2 size={14} /> 
    };
  }
  // Default
  return { 
    color: "text-gray-600 bg-gray-100 dark:bg-slate-800 dark:text-slate-400", 
    icon: <Activity size={14} /> 
  };
}

export default async function ActivityLogsPage({ params }: { params: { projectId: string } }) {
  // 1. Fetch Data dari Server Action
  const { data: logs } = await getProjectActivityLogs(params.projectId);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* === HEADER === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-medium text-gray-500 dark:text-slate-400">
              Last 50 Events
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Monitor who did what and when in your project.
          </p>
        </div>
      </div>

      {/* === TABLE CONTAINER === */}
      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] shadow-sm overflow-hidden">
        
        {/* Simple Filter Bar (Visual Only for now) */}
        <div className="border-b border-gray-100 dark:border-slate-800 px-6 py-4 flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input 
                type="text" 
                placeholder="Search logs..." 
                className="bg-transparent border-none text-sm focus:outline-none w-full text-gray-700 dark:text-slate-200 placeholder:text-gray-400"
            />
        </div>

        {/* LOGS LIST */}
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {(!logs || logs.length === 0) ? (
             <div className="px-6 py-16 text-center text-gray-400 dark:text-slate-500">
                <ShieldAlert size={40} className="mx-auto mb-3 opacity-20" />
                <p>No activity recorded yet.</p>
             </div>
          ) : (
            logs.map((log: any) => {
              const style = getActionStyle(log.action);
              
              return (
                <div key={log.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  
                  {/* 1. Actor (User) */}
                  <div className="flex items-center gap-3 w-full sm:w-1/4 min-w-[200px]">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">
                        {log.user?.image ? (
                            <img src={log.user.image} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            log.user?.name?.substring(0, 2) || "U"
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {log.user?.name || "Unknown User"}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400 truncate max-w-[120px]">
                            {log.user?.email}
                        </span>
                    </div>
                  </div>

                  {/* 2. Action Badge */}
                  <div className="w-full sm:w-auto min-w-[140px]">
                    <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase",
                        style.color
                    )}>
                        {style.icon}
                        {log.action.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* 3. Entity Detail */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                        <span className="text-gray-400 dark:text-slate-500 mr-1">on {log.entityType}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {log.entityName || log.entityId || "Unknown Item"}
                        </span>
                    </p>
                    {/* Tampilkan detail JSON jika ada (optional, misal Scope token) */}
                    {log.details && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate font-mono">
                            {JSON.stringify(log.details).replace(/["{}]/g, "").replace(/:/g, ": ")}
                        </p>
                    )}
                  </div>

                  {/* 4. Timestamp */}
                  <div className="w-full sm:w-auto text-right whitespace-nowrap">
                    <div className="flex items-center gap-1.5 justify-end text-xs text-gray-500 dark:text-slate-400">
                        <Clock size={12} />
                        {new Date(log.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-600">
                        {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-3 border-t border-gray-100 dark:border-slate-700 text-[11px] text-gray-500 text-center sm:text-left">
            Showing the most recent activities for audit purposes.
        </div>

      </div>
    </div>
  );
}