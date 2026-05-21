import { getPortfolioSummary } from "@/lib/reports"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  Users,
  Building,
  BarChart,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieChartIcon,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function OwnerDashboardPage() {
  const summary = await getPortfolioSummary()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owner Portfolio Analytics</h1>
          <p className="text-slate-500">High-level performance metrics for your real estate assets</p>
        </div>
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
          <Download className="w-4 h-4 mr-2" />
          Export Shareholder Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Assets Under Mgmt</CardTitle>
            <Building className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalAUM.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12.5% from last year
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-slate-500 mt-1">
              Target: 95.0%
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Portfolio Yield</CardTitle>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.annualYield}%</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              Industry Avg: 6.1%
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Units</CardTitle>
            <BarChart className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalUnits}</div>
            <p className="text-xs text-slate-500 mt-1">
              Across 5 properties
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
              Income Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t">
             <div className="text-center text-slate-400">
               <p className="text-sm">Income Breakdown (Residential vs Commercial)</p>
               <p className="text-xs italic mt-2">Visualizing real-time transaction data...</p>
             </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
              Portfolio Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t">
             <div className="text-center text-slate-400">
               <p className="text-sm">AUM Valuation over last 12 months</p>
               <p className="text-xs italic mt-2">Aggregating historical NOI metrics...</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
