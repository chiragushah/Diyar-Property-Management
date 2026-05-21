import { getTransactions, getFinancialSummary, getAIFinancialForecast } from "@/lib/actions/financials"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Sparkles } from "lucide-react"
import { format } from "date-fns"

export default async function FinancialsPage() {
  const transactions = await getTransactions()
  const summary = await getFinancialSummary()
  const aiForecast = await getAIFinancialForecast()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Financial Ledger</h1>
        <p className="text-slate-500">Track all income and expenses across your portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${summary.totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">${summary.totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">${summary.netProfit.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
            <Sparkles className="w-5 h-5" />
            AI Financial Forecast
          </CardTitle>
          <CardDescription className="text-blue-600">Predictive insights based on your transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-700 leading-relaxed bg-white/50 p-4 rounded-lg border border-white">
            {aiForecast}
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Linked Lease</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-sm text-slate-500">
                  {format(new Date(t.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {t.type === "INCOME" ? (
                      <ArrowUpCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs font-medium">{t.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">{t.description || "-"}</TableCell>
                <TableCell className="text-xs text-slate-500">
                  {t.lease ? `${t.lease.tenant.firstName} - Unit ${t.lease.unit.unitNumber}` : "-"}
                </TableCell>
                <TableCell className={`text-right font-bold ${t.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                  {t.type === "INCOME" ? "+" : "-"}${t.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500 italic">
                  No transactions recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
