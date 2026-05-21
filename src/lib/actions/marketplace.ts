"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function syndicateListing(unitId: string, data: {
  title: string
  price: number
  description: string
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  console.log(`[Syndication] Pushing listing for unit ${unitId} to Zillow, Apartments.com...`);

  const unit = await prisma.unit.update({
    where: { id: unitId },
    data: {
      isListed: true,
      listingTitle: data.title,
      listingPrice: data.price,
      listingDescription: data.description
    }
  })

  revalidatePath("/dashboard/marketplace")
  return unit
}

export async function removeListing(unitId: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const unit = await prisma.unit.update({
    where: { id: unitId },
    data: { isListed: false }
  })

  revalidatePath("/dashboard/marketplace")
  return unit
}

export async function getVacantUnits() {
  return await prisma.unit.findMany({
    where: { status: "VACANT" },
    include: { property: true }
  })
}
