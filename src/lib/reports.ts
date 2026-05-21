import { prisma } from "@/lib/prisma"

export interface FinancialReport {
  grossIncome: number
  expenses: number
  netOperatingIncome: number
  occupancyRate: number
}

export async function generateOwnerReport(propertyId: string): Promise<FinancialReport> {
  const transactions = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
      // In a real app we'd link properties to transactions via units/leases
    }
  })

  const grossIncome = transactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  // Mock property stats
  const totalUnits = await prisma.unit.count({ where: { propertyId } })
  const occupiedUnits = await prisma.unit.count({ where: { propertyId, status: "OCCUPIED" } })

  return {
    grossIncome,
    expenses,
    netOperatingIncome: grossIncome - expenses,
    occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0
  }
}

export async function getPortfolioSummary() {
  const totalUnits = await prisma.unit.count()
  const occupiedUnits = await prisma.unit.count({ where: { status: "OCCUPIED" } })

  const transactions = await prisma.transaction.findMany({
    where: { status: "COMPLETED" }
  })

  const income = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0)

  return {
    totalUnits,
    occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
    annualYield: 7.2, // Mock yield
    totalAUM: income * 12 // Simplified valuation
  }
}
