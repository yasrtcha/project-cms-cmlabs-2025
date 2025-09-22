import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  className?: string
}

function StatsCard({ title, value, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-medium text-black">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-black">{value}</div>
      </CardContent>
    </Card>
  )
}

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
          className="bg-white"
        />
      ))}
    </div>
  )
}
