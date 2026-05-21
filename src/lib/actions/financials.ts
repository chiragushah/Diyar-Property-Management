"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { askAI } from "@/lib/ai"

export async function getTransactions() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  return await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    include: {
      lease: {
        include: {
          tenant: true,
          unit: { include: { property: true } }
        }
      }
    }
  })
}

export async function createTransaction(data: {
  amount: number
  type: string
  category: string
  description?: string
  date?: Date
  leaseId?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const transaction = await prisma.transaction.create({
    data
  })

  revalidatePath("/dashboard/financials")
  revalidatePath("/dashboard")
  return transaction
}

export async function getFinancialSummary() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const transactions = await prisma.transaction.findMany()

  const income = transactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome: income,
    totalExpenses: expenses,
    netProfit: income - expenses
  }
}

export async function getAIFinancialForecast() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const transactions = await prisma.transaction.findMany({
    take: 50,
    orderBy: { date: "desc" }
  })

  const prompt = `Based on these recent property transactions, provide a financial forecast for the next 3 months.
  Transactions: ${JSON.stringify(transactions)}
  Provide a concise summary and estimate the expected net profit.`

  return await askAI(prompt)
}
