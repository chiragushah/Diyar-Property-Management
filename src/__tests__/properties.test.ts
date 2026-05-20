import { prisma } from "../lib/prisma"

// Mock Prisma
jest.mock("../lib/prisma", () => ({
  prisma: {
    property: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe("Property Actions", () => {
  it("should be defined", () => {
    expect(prisma.property.findMany).toBeDefined()
  })
})
