"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"

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

export async function getProperties() {
  await checkPermission("READ", "PROPERTIES")

  return await prisma.property.findMany({
    include: {
      units: true,
      manager: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function createProperty(data: {
  name: string
  address: string
  description?: string
  type: string
}) {
  const session = await checkPermission("CREATE", "PROPERTIES")

  const property = await prisma.property.create({
    data: {
      ...data,
      managerId: (session.user as any).id
    }
  })

  revalidatePath("/dashboard/properties")
  return property
}

export async function updateProperty(id: string, data: any) {
  await checkPermission("UPDATE", "PROPERTIES")

  const property = await prisma.property.update({
    where: { id },
    data
  })

  revalidatePath("/dashboard/properties")
  return property
}

export async function deleteProperty(id: string) {
  await checkPermission("DELETE", "PROPERTIES")

  await prisma.property.delete({
    where: { id }
  })

  revalidatePath("/dashboard/properties")
}

// Unit Actions
export async function createUnit(data: {
  propertyId: string
  unitNumber: string
  floor?: string
  rentAmount: number
  status?: string
}) {
  await checkPermission("UPDATE", "PROPERTIES")

  const unit = await prisma.unit.create({
    data
  })

  revalidatePath(`/dashboard/properties/${data.propertyId}`)
  return unit
}

export async function updateUnit(id: string, propertyId: string, data: any) {
  await checkPermission("UPDATE", "PROPERTIES")

  const unit = await prisma.unit.update({
    where: { id },
    data
  })

  revalidatePath(`/dashboard/properties/${propertyId}`)
  return unit
}
