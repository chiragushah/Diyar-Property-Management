import { prisma } from "@/lib/prisma"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Phone, Star, CheckCircle2 } from "lucide-react"

export default async function VendorPortalPage() {
  const requests = await prisma.maintenanceRequest.findMany({
    where: { status: "OPEN" },
    include: {
      lease: { include: { unit: { include: { property: true } } } }
    }
  })

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">Vendor Service Portal</h1>
            <p className="text-slate-400">Manage work orders and service quality</p>
          </div>
        </div>
        <div className="flex gap-6 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">4.9 Vendor Satisfaction</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">98% Service Level (SLA)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Pending Work Orders
            <Badge variant="secondary">{requests.length}</Badge>
          </h2>

          <div className="bg-white rounded-xl border shadow-sm divide-y">
            {requests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{request.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{request.description}</p>
                  </div>
                  <Badge className={
                    request.priority === "URGENT" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  }>
                    {request.priority}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-dashed">
                  <div className="flex gap-4">
                    <div className="text-xs">
                      <span className="text-slate-400 block mb-0.5 uppercase tracking-wider font-semibold">Location</span>
                      <span className="font-medium">{request.lease?.unit?.property?.name}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 block mb-0.5 uppercase tracking-wider font-semibold">Unit</span>
                      <span className="font-medium">#{request.lease?.unit?.unitNumber}</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Accept Job
                  </Button>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="p-12 text-center text-slate-500 italic">
                All maintenance caught up. No pending work orders.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Top Contractors</h2>
          <div className="bg-white rounded-xl border shadow-sm p-4 space-y-4">
            {[
              { name: "Pro-Flush Plumbing", rating: 5.0, jobs: 124 },
              { name: "Sparky's Electrical", rating: 4.8, jobs: 89 },
              { name: "CleanSweep Services", rating: 4.7, jobs: 215 },
            ].map((vendor) => (
              <div key={vendor.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                <div>
                  <p className="font-bold text-sm">{vendor.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-slate-500 font-medium">{vendor.rating} • {vendor.jobs} jobs</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
