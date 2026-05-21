import { getTenants } from "@/lib/actions/tenants"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { FileText, Calendar, User, Home } from "lucide-react"

export default async function LeasesPage() {
  const tenants = await getTenants()
  const allLeases = tenants.flatMap(t => t.leases.map(l => ({ ...l, tenant: t })))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lease Management</h1>
        <p className="text-slate-500">View and track all active and historical lease agreements</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Property/Unit</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Monthly Rent</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLeases.map((lease) => (
              <TableRow key={lease.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{lease.tenant.firstName} {lease.tenant.lastName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{lease.unit.property.name}</div>
                    <div className="text-slate-500">Unit {lease.unit.unitNumber}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(lease.startDate), "MMM d, yyyy")} - {format(new Date(lease.endDate), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell className="font-bold">
                  ${lease.rentAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={lease.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                    {lease.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {allLeases.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-500 italic">
                  No leases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
