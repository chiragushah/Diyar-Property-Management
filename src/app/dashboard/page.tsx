import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getFinancialSummary } from "@/lib/actions/financials"
import { getProperties } from "@/lib/actions/properties"
import { getTenants } from "@/lib/actions/tenants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import AnalyticsWrapper from "@/components/dashboard/analytics-wrapper"
import AIChat from "@/components/dashboard/ai-chat"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const summary = await getFinancialSummary()
  const properties = await getProperties()
  const tenants = await getTenants()

  const stats = [
    {
      title: "Total Revenue",
      value: `$${summary.totalIncome.toLocaleString()}`,
      description: "Total rent collected",
      icon: DollarSign,
      color: "text-green-600",
      trend: "+12.5%",
      trendUp: true
    },
    {
      title: "Properties",
      value: properties.length.toString(),
      description: "Managed properties",
      icon: Building2,
      color: "text-blue-600",
      trend: "Stable",
      trendUp: true
    },
    {
      title: "Active Tenants",
      value: tenants.length.toString(),
      description: "Current occupancy",
      icon: Users,
      color: "text-purple-600",
      trend: "+3 this month",
      trendUp: true
    },
    {
      title: "Net Profit",
      value: `$${summary.netProfit.toLocaleString()}`,
      description: "Revenue minus expenses",
      icon: TrendingUp,
      color: "text-orange-600",
      trend: "+8.2%",
      trendUp: true
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {session?.user?.name}</h1>
        <p className="text-slate-500">Here&apos;s what&apos;s happening with your properties today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trendUp ? (
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-slate-400 ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnalyticsWrapper />
        </div>
        <div>
          <AIChat />
        </div>
      </div>
    </div>
  )
}
