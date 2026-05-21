"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { askAI } from "@/lib/ai"

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

export async function analyzeDocument(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const doc = await prisma.document.findUnique({ where: { id } })
  if (!doc) throw new Error("Document not found")

  // Simulate AI extraction (since we don't have real OCR binary data here)
  const prompt = `Simulate an OCR extraction for a document named "${doc.name}" of type "${doc.type}".
  Provide a summary of what might be in this document and extract 3 potential key dates.`

  const analysis = await askAI(prompt)

  revalidatePath("/dashboard/documents")
  return analysis
}

export async function deleteDocument(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  await prisma.document.delete({
    where: { id }
  })

  revalidatePath("/dashboard/documents")
}
