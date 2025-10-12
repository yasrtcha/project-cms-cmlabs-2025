import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  className?: string
}

const StatsCard = memo(function StatsCard({ title, value, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      </CardContent>
    </Card>
  )
})

export function StatsCards() {
  const stats = [
    {
      title: "Total Organization Project",
      value: "10"
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
        />
      ))}
    </div>
  )
}
