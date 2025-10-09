"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { getStatusColor, getStatusText } from "@/lib/dashboard-utils"
import { FaPlus } from "react-icons/fa6";


interface Organization {
  name: string
  assets: number
  role: "Admin" | "Member"
  status: "completed" | "in-progress" | "pending"
}

const organizations: Organization[] = [
  {
    name: "Wireframe Homepage",
    assets: 15,
    role: "Admin",
    status: "completed"
  },
  {
    name: "Create Login Page UI",
    assets: 10,
    role: "Member", 
    status: "completed"
  },
  {
    name: "Dashboard Layout Design",
    assets: 5,
    role: "Member",
    status: "pending"
  },
  {
    name: "Task Management Screen",
    assets: 17,
    role: "Member",
    status: "in-progress"
  },
  {
    name: "Profile Page Mockup",
    assets: 2,
    role: "Member",
    status: "in-progress"
  },
  {
    name: "Notification UI",
    assets: 4,
    role: "Admin",
    status: "in-progress"
  },
  {
    name: "Pop Up UI",
    assets: 8,
    role: "Member",
    status: "in-progress"
  }
]

function getStatusBadge(status: Organization["status"]) {
  return (
    <Badge className={getStatusColor(status)}>
      {getStatusText(status)}
    </Badge>
  )
}

export function OrganizationList() {
  return (
    <Card className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">List Organization</CardTitle>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Your organizations with role, projects, and members.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center px-4 py-2 rounded-md text-white">
          <FaPlus className="w-4 h-4" />
          New Project
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-slate-300">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-slate-300">Jumlah Project Asset</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-slate-300">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-slate-300">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 text-gray-900 dark:text-slate-100">{org.name}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-slate-400">{org.assets}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-slate-400">{org.role}</td>
                  <td className="py-3 px-4">
                    {getStatusBadge(org.status)}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm" className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
