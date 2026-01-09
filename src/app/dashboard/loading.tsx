export default function DashboardLoading() {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
            {/* Sidebar Placeholder */}
            <div className="w-64 border-r dark:border-slate-800 hidden md:block" />

            <div className="flex-1 flex flex-col">
                {/* Header Placeholder */}
                <div className="h-16 border-b dark:border-slate-800" />

                <main className="flex-1 p-6 space-y-8">
                    {/* Stats Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-44 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl animate-pulse p-6">
                                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />
                                <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                                <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                        ))}
                    </div>

                    {/* Charts Placeholder */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-[400px] bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
