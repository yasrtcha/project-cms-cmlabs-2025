import {
  Sidebar,
  Header,
  StatsCards,
  ChartsWrapper,
  TablesWrapper
} from "@/app/dashboard/components"
import { getDashboardStats } from "./actions"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-950">
          {/* Stats Cards */}
          <StatsCards
            personalCount={stats.personalProjectsCount}
            orgCount={stats.organizationalProjectsCount}
          />

          {/* Charts Row - Lazy loaded on client */}
          <ChartsWrapper />

          {/* Tables Row - Lazy loaded on client */}
          <TablesWrapper />
        </main>
      </div>
    </div>
  );
}
