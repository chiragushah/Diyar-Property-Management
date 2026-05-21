import { getInvoices } from "@/lib/actions/invoices"
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
import { FileDown, MoreHorizontal, Calendar, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { PaymentButton } from "@/components/dashboard/payment-button"

export default async function InvoicesPage() {
  const invoices = await getInvoices()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-slate-500">Manage billing and payments for milestones and rent</p>
        </div>
        <Button>
          <CreditCard className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client/User</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono font-medium">{invoice.number}</TableCell>
                <TableCell>
                  <Badge className={
                    invoice.status === "PAID" ? "bg-green-100 text-green-700" :
                    invoice.status === "OVERDUE" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  }>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{invoice.user.name}</div>
                  <div className="text-xs text-slate-500">{invoice.user.email}</div>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">
                  {format(new Date(invoice.issuedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-slate-600 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell className="font-bold">
                  ${invoice.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    {invoice.status !== "PAID" && (
                      <PaymentButton invoiceId={invoice.id} />
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500 italic">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
