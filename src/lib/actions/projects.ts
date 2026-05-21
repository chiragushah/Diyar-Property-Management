"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import { createInvoice } from "./invoices"

export async function getProjects() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  return await prisma.project.findMany({
    include: {
      property: true,
      milestones: {
        include: { invoice: true },
        orderBy: { order: "asc" }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function createProject(data: {
  name: string
  description?: string
  propertyId: string
  milestones: { title: string, amount: number, order: number }[]
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const allowed = await hasPermission(
    (session.user as any).id,
    (session.user as any).role,
    "CREATE",
    "PROJECTS"
  )
  if (!allowed) throw new Error("Forbidden")

  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      propertyId: data.propertyId,
      milestones: {
        create: data.milestones
      }
    }
  })

  revalidatePath("/dashboard/projects")
  return project
}

export async function completeMilestone(milestoneId: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const milestone = await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      status: "COMPLETED",
      completedAt: new Date()
    },
    include: { project: { include: { property: true } } }
  })

  // Find the primary tenant or owner associated with this property to invoice
  const lease = await prisma.lease.findFirst({
    where: {
      unit: { propertyId: milestone.project.propertyId },
      status: "ACTIVE"
    },
    include: { tenant: true }
  })

  const invoiceTargetId = lease?.tenantId || (session.user as any).id

  // Generate invoice automatically upon milestone completion
  await createInvoice({
    amount: milestone.amount,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    userId: invoiceTargetId,
    milestoneId: milestone.id,
    description: `Project Milestone: ${milestone.title} - ${milestone.project.name}`
  })

  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard/invoices")
}
