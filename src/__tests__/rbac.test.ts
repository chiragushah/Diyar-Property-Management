import { hasPermission } from "../lib/permissions"
import { prisma } from "../lib/prisma"

jest.mock("../lib/prisma", () => ({
  prisma: {
    userPermission: {
      findFirst: jest.fn(),
    },
  },
}))

describe("RBAC Permissions", () => {
  it("should allow ADMIN to do everything", async () => {
    const allowed = await hasPermission("1", "ADMIN", "DELETE", "USERS")
    expect(allowed).toBe(true)
  })

  it("should deny TENANT from deleting properties", async () => {
    const allowed = await hasPermission("2", "TENANT", "DELETE", "PROPERTIES")
    expect(allowed).toBe(false)
  })

  it("should allow MANAGER to create projects", async () => {
    const allowed = await hasPermission("3", "MANAGER", "CREATE", "PROJECTS")
    expect(allowed).toBe(true)
  })
})
