import type { Activity, Organization } from "@/types/dashboard"

export function getStatusColor(status: Activity["status"] | Organization["status"]) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "in-progress":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export function getStatusText(status: Activity["status"] | Organization["status"]) {
  switch (status) {
    case "completed":
      return "Completed"
    case "in-progress":
      return "In Progress"
    case "pending":
      return "Pending"
    default:
      return "Unknown"
  }
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function calculatePercentage(value: number, total: number): string {
  return `${Math.round((value / total) * 100)}%`
}
