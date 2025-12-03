import { 
  LayoutDashboard, 
  Building2, 
  FolderOpen, 
  Bell
} from "lucide-react"
import type { MenuItem, Activity, Organization, StatsCard } from "@/types/dashboard"

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    badge: null
  },
  {
    title: "Organizational",
    icon: Building2,
    href: "/organizational",
    badge: null
  },
  {
    title: "Personal Project",
    icon: FolderOpen,
    href: "/personal-project",
    badge: null
  },
  {
    title: "Notification",
    icon: Bell,
    href: "/notification",
    badge: null
  }
]

export const STATS_DATA: StatsCard[] = [
  {
    title: "Total Organization Project",
    value: "30"
  },
  {
    title: "Total Organization Project",
    value: "30"
  },
  {
    title: "Total Organization Project",
    value: "30"
  },
  {
    title: "Total Organization Project",
    value: "30"
  }
]

export const ACTIVITIES_DATA: Activity[] = [
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

export const ORGANIZATIONS_DATA: Organization[] = [
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
