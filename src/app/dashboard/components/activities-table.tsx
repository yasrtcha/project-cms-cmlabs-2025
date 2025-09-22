"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { getStatusColor, getStatusText } from "@/lib/dashboard-utils"
import { FaPlus } from "react-icons/fa6";


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

export function ActivitiesTable() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-3xl font-semibold">Your Activities</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Stay organized and boost your productivity</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FaPlus className=" w-4 h-4" />
          New Activities
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{activity.name}</td>
                  <td className="py-3 px-4 text-gray-600">{activity.date}</td>
                  <td className="py-3 px-4">
                    {getStatusBadge(activity.status)}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
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
