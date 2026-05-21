"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import { scoreLead } from "@/lib/ai"

async function checkPermission(action: any, resource: any) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const allowed = await hasPermission(
    (session.user as any).id,
    (session.user as any).role,
    action,
    resource
  )
  if (!allowed) throw new Error("Forbidden")

  return session
}

export async function getLeads() {
  await checkPermission("READ", "CRM")

  return await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: {
        select: { name: true, email: true }
      }
    }
  })
}

export async function createLead(data: {
  name: string
  email: string
  phone?: string
  source?: string
  status?: string
  notes?: string
}) {
  const session = await checkPermission("CREATE", "CRM")

  // AI Scoring
  const aiResult = await scoreLead(data)

  const lead = await prisma.lead.create({
    data: {
      ...data,
      assignedToId: (session.user as any).id,
      aiScore: aiResult.score,
      aiSummary: aiResult.summary
    }
  })

  revalidatePath("/dashboard/crm")
  return lead
}

export async function updateLeadStatus(id: string, status: string) {
  await checkPermission("UPDATE", "CRM")

  const lead = await prisma.lead.update({
    where: { id },
    data: { status }
  })

  revalidatePath("/dashboard/crm")
  return lead
}

export async function updateLead(id: string, data: any) {
  await checkPermission("UPDATE", "CRM")

  const lead = await prisma.lead.update({
    where: { id },
    data
  })

  revalidatePath("/dashboard/crm")
  return lead
}

export async function deleteLead(id: string) {
  await checkPermission("DELETE", "CRM")

  await prisma.lead.delete({
    where: { id }
  })

  revalidatePath("/dashboard/crm")
}
