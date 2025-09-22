import { LucideIcon } from "lucide-react"

export interface Activity {
  name: string
  date: string
  status: "completed" | "in-progress" | "pending"
}

export interface Organization {
  name: string
  assets: number
  role: "Admin" | "Member"
  status: "completed" | "in-progress" | "pending"
}

export interface StatsCard {
  title: string
  value: string
}

export interface ChartData {
  name: string
  value: number
  fill?: string
}

export interface ActivityChartData {
  name: string
  onProgress: number
  completed: number
  pending: number
}

export interface MenuItem {
  title: string
  icon: LucideIcon
  href: string
  badge?: string | null
}
