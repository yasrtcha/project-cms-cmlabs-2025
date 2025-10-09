"use client"

import dynamic from 'next/dynamic'

// Lazy load chart components on client-side only
const DeadlinesChart = dynamic(
  () => import("./deadlines-chart").then(mod => ({ default: mod.DeadlinesChart })),
  {
    loading: () => <div className="h-[400px] bg-white rounded-lg animate-pulse" />,
    ssr: false
  }
)

const ActivityChart = dynamic(
  () => import("./activity-chart").then(mod => ({ default: mod.ActivityChart })),
  {
    loading: () => <div className="h-[400px] bg-white rounded-lg animate-pulse" />,
    ssr: false
  }
)

export function ChartsWrapper() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <DeadlinesChart />
      <ActivityChart />
    </div>
  )
}
