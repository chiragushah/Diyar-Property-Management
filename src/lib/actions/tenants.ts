"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getTenants() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  return await prisma.tenant.findMany({
    include: {
      leases: {
        include: { unit: { include: { property: true } } }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function createTenant(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const tenant = await prisma.tenant.create({
    data
  })

  revalidatePath("/dashboard/tenants")
  return tenant
}

// Lease Actions
export async function createLease(data: {
  tenantId: string
  unitId: string
  startDate: Date
  endDate: Date
  rentAmount: number
  depositAmount: number
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const lease = await prisma.lease.create({
    data
  })

  // Update unit status to OCCUPIED
  await prisma.unit.update({
    where: { id: data.unitId },
    data: { status: "OCCUPIED" }
  })

  revalidatePath("/dashboard/tenants")
  revalidatePath("/dashboard/properties")
  return lease
}

export async function terminateLease(id: string, unitId: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  await prisma.lease.update({
    where: { id },
    data: { status: "TERMINATED" }
  })

  // Update unit status back to VACANT
  await prisma.unit.update({
    where: { id: unitId },
    data: { status: "VACANT" }
  })

  revalidatePath("/dashboard/tenants")
  revalidatePath("/dashboard/properties")
}
