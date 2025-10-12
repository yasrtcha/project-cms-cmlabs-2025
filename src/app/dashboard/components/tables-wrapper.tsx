"use client"

import dynamic from 'next/dynamic'
const ActivitiesTable = dynamic(
  () => import("./activities-table").then(mod => ({ default: mod.ActivitiesTable })),
  {
    loading: () => (
      <div className="h-[400px] bg-white dark:bg-slate-800 rounded-lg animate-pulse border border-slate-200 dark:border-slate-700" />
    ),
    ssr: false
  }
)
const OrganizationList = dynamic(
  () => import("./organization-list").then(mod => ({ default: mod.OrganizationList })),
  {
    loading: () => (
      <div className="h-[400px] bg-white dark:bg-slate-800 rounded-lg animate-pulse border border-slate-200 dark:border-slate-700" />
    ),
    ssr: false
  }
)
export function TablesWrapper() {
  return (
    <div className="space-y-6">
      <ActivitiesTable />
      <OrganizationList />
    </div>
  )
}
