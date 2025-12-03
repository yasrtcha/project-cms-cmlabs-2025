"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getStatusColor, getStatusText } from "@/lib/dashboard-utils"
import { Plus } from "lucide-react"

interface Activity {
  name: string
  date: string
  status: "completed" | "in-progress" | "pending"
}

const activities: Activity[] = [
  {
    name: "Wireframe Homepage",
    date: "Sep 20",
    status: "completed"
  },
  {
    name: "Create Login Page UI",
    date: "Sep 20", 
    status: "completed"
  },
  {
    name: "Dashboard Layout Design",
    date: "Sep 20",
    status: "completed"
  },
  {
    name: "Task Management Screen",
    date: "Sep 20",
    status: "completed"
  },
  {
    name: "Profile Page Mockup",
    date: "Sep 20",
    status: "in-progress"
  },
  {
    name: "Notification UI",
    date: "Sep 20",
    status: "pending"
  },
  {
    name: "Pop Up UI",
    date: "Sep 20",
    status: "pending"
  }
]

function getStatusBadge(status: Activity["status"]) {
  return (
    <Badge className={getStatusColor(status)}>
      {getStatusText(status)}
    </Badge>
  )
}

export const ActivitiesTable = memo(function ActivitiesTable() {
  return (
    <Card className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            Your Activities
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Stay organized and boost your productivity
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          New Activities
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-slate-300">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-slate-300">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-slate-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-slate-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 text-gray-900 dark:text-slate-100">
                    {activity.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-slate-400">
                    {activity.date}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(activity.status)}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
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
})