import {
  Sidebar,
  Header,
  StatsCards,
  DeadlinesChart,
  ActivityChart,
  ActivitiesTable,
  OrganizationList
} from "@/app/dashboard/components"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <StatsCards />
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DeadlinesChart />
            <ActivityChart />
          </div>
          
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
