"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { analyzeMaintenanceUrgency } from "@/lib/ai"

export async function getMaintenanceRequests() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  return await prisma.maintenanceRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      lease: {
        include: { unit: { include: { property: true } } }
      }
    }
  })
}

export async function createMaintenanceRequest(data: {
  title: string
  description: string
  leaseId?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  // AI Triage
  const aiPriority = await analyzeMaintenanceUrgency(data.description)
  const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"]
  const priority = validPriorities.includes(aiPriority.trim().toUpperCase())
    ? aiPriority.trim().toUpperCase()
    : "MEDIUM"

  const request = await prisma.maintenanceRequest.create({
    data: {
      ...data,
      priority,
      userId: (session.user as any).id
    }
  })

  revalidatePath("/dashboard/maintenance")
  return request
}

export async function updateMaintenanceStatus(id: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const request = await prisma.maintenanceRequest.update({
    where: { id },
    data: { status }
  })

  revalidatePath("/dashboard/maintenance")
  return request
}
