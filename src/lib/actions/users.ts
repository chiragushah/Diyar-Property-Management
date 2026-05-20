"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized")

  return await prisma.user.findMany({
    include: { permissions: true },
    orderBy: { createdAt: "desc" }
  })
}

export async function updateUserRole(userId: string, role: string) {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })
  revalidatePath("/dashboard/users")
}

export async function toggleUserPermission(userId: string, action: string, resource: string) {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized")

  const existing = await prisma.userPermission.findUnique({
    where: {
      userId_action_resource: { userId, action, resource }
    }
  })

  if (existing) {
    await prisma.userPermission.delete({
      where: { id: existing.id }
    })
  } else {
    await prisma.userPermission.create({
      data: { userId, action, resource }
    })
  }
  revalidatePath("/dashboard/users")
}
