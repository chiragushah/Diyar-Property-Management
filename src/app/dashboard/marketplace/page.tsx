import { getVacantUnits } from "@/lib/actions/marketplace"
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
import { ExternalLink, Globe, Megaphone } from "lucide-react"

export default async function MarketplacePage() {
  const vacantUnits = await getVacantUnits()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Marketplace Syndication</h1>
          <p className="text-slate-500">Publish vacant units to major property portals with one click</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
          <Globe className="text-blue-600 mb-2" />
          <h3 className="font-bold text-blue-900">Total Portals</h3>
          <p className="text-2xl font-black text-blue-600">12</p>
          <p className="text-xs text-blue-500">Active integrations including Zillow & Trulia</p>
        </div>
        <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
          <Megaphone className="text-green-600 mb-2" />
          <h3 className="font-bold text-green-900">Active Listings</h3>
          <p className="text-2xl font-black text-green-600">{vacantUnits.filter(u => u.isListed).length}</p>
          <p className="text-xs text-green-500">Units currently being marketed</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Property / Unit</TableHead>
              <TableHead>Target Rent</TableHead>
              <TableHead>Listing Status</TableHead>
              <TableHead className="text-right">Market-Facing Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacantUnits.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>
                  <div className="font-medium">{unit.property.name}</div>
                  <div className="text-xs text-slate-500">Unit {unit.unitNumber} • {unit.property.address}</div>
                </TableCell>
                <TableCell className="font-bold">
                  ${unit.rentAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  {unit.isListed ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      LIVE ON PORTALS
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-200">
                      UNPUBLISHED
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {unit.isListed ? (
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Leads (5)
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Take Down
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <ExternalLink className="w-3 h-3 mr-1.5" />
                      Syndicate Listing
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
