import { prisma } from "@/lib/prisma"

export type Action = "CREATE" | "READ" | "UPDATE" | "DELETE" | "ALL"
export type Resource = "PROPERTIES" | "TENANTS" | "LEASES" | "CRM" | "MAINTENANCE" | "FINANCIALS" | "USERS" | "PROJECTS"

export async function hasPermission(
  userId: string,
  userRole: string,
  action: Action,
  resource: Resource
): Promise<boolean> {
  // ADMIN has all permissions
  if (userRole === "ADMIN") return true

  // Check custom permissions in database
  const permission = await prisma.userPermission.findFirst({
    where: {
      userId,
      resource,
      OR: [
        { action },
        { action: "ALL" }
      ]
    }
  })

  if (permission) return true

  // Default role-based permissions
  const rolePermissions: Record<string, Partial<Record<Resource, Action[]>>> = {
    MANAGER: {
      PROPERTIES: ["CREATE", "READ", "UPDATE"],
      TENANTS: ["CREATE", "READ", "UPDATE"],
      LEASES: ["CREATE", "READ", "UPDATE"],
      CRM: ["CREATE", "READ", "UPDATE", "DELETE"],
      MAINTENANCE: ["CREATE", "READ", "UPDATE"],
      PROJECTS: ["CREATE", "READ", "UPDATE"],
    },
    OWNER: {
      PROPERTIES: ["READ"],
      FINANCIALS: ["READ"],
      PROJECTS: ["READ"],
    },
    TENANT: {
      LEASES: ["READ"],
      MAINTENANCE: ["CREATE", "READ"],
    }
  }

  const allowedActions = rolePermissions[userRole]?.[resource]
  return allowedActions?.includes(action) || allowedActions?.includes("ALL") || false
}
