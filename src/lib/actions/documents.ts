"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getDocuments() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  return await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      property: { select: { name: true } },
      tenant: { select: { firstName: true, lastName: true } }
    }
  })
}

export async function createDocument(data: {
  name: string
  url: string
  type: string
  size: number
  propertyId?: string
  tenantId?: string
  leaseId?: string
  maintenanceId?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const document = await prisma.document.create({
    data: {
      ...data,
      userId: (session.user as any).id
    }
  })

  revalidatePath("/dashboard/documents")
  return document
}

export async function deleteDocument(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  await prisma.document.delete({
    where: { id }
  })

  revalidatePath("/dashboard/documents")
}
