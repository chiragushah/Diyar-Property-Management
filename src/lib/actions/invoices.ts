"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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
