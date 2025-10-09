import {
  Sidebar,
  Header,
  StatsCards,
  ChartsWrapper,
  ActivitiesTable,
  OrganizationList
} from "@/app/dashboard/components"

export default function DashboardPage() {
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
          <StatsCards />
          
          {/* Charts Row - Lazy loaded on client */}
          <ChartsWrapper />
          
          {/* Tables Row */}
          <div className="space-y-6">
            <ActivitiesTable />
            <OrganizationList />
          </div>
        </main>
      </div>
    </div>
  );
}
