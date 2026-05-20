"use client"

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DashboardCharts = dynamic(() => import('@/components/dashboard/charts'), { ssr: false })

export default function AnalyticsWrapper() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border-none shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Financial Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <DashboardCharts type="area" />
        </CardContent>
      </Card>
      <Card className="border-none shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Property Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <DashboardCharts type="pie" />
        </CardContent>
      </Card>
    </div>
  )
}
