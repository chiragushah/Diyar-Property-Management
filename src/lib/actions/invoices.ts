"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createPaymentIntent, confirmPayment } from "@/lib/payments"

export async function getInvoices() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  return await prisma.invoice.findMany({
    include: {
      user: { select: { name: true, email: true } },
      milestone: { include: { project: true } }
    },
    orderBy: { issuedAt: "desc" }
  })
}

export async function createInvoice(data: {
  amount: number
  dueDate: Date
  userId: string
  milestoneId?: string
  description?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const invoiceCount = await prisma.invoice.count()
  const invoiceNumber = `INV-${new Date().getFullYear()}-${(invoiceCount + 1).toString().padStart(4, "0")}`

  const invoice = await prisma.invoice.create({
    data: {
      number: invoiceNumber,
      amount: data.amount,
      dueDate: data.dueDate,
      userId: data.userId,
      milestoneId: data.milestoneId
    }
  })

  revalidatePath("/dashboard/invoices")
  return invoice
}

export async function updateInvoiceStatus(id: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  await prisma.invoice.update({
    where: { id },
    data: { status }
  })

  revalidatePath("/dashboard/invoices")
}

export async function processInvoicePayment(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!invoice) throw new Error("Invoice not found")

  // Mock Payment Flow
  const intent = await createPaymentIntent(invoice.amount, invoice.id)
  const result = await confirmPayment(intent.id)

  if (result.success) {
    // Start a transaction to ensure data integrity
    await prisma.$transaction([
      // 1. Update Invoice Status
      prisma.invoice.update({
        where: { id },
        data: {
          status: "PAID",
          stripeId: result.transactionId
        }
      }),
      // 2. Create Transaction record
      prisma.transaction.create({
        data: {
          amount: invoice.amount,
          type: "INCOME",
          category: invoice.milestoneId ? "MAINTENANCE" : "RENT",
          description: `Payment for Invoice ${invoice.number}`,
          paymentDate: new Date(),
          invoiceId: invoice.id,
          status: "COMPLETED"
        }
      })
    ])
  }

  revalidatePath("/dashboard/invoices")
  revalidatePath("/dashboard/financials")
  return { success: true }
}
