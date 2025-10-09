import {
  Sidebar,
  Header
} from "@/app/dashboard/components"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Clock } from "lucide-react"

export default function OrganizationalPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Coming Soon Content */}
        <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Organizational</h1>
              <p className="text-gray-600 mb-4">Organization management features</p>
              <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="font-medium">This feature will coming soon</span>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
