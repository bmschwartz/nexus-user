import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface Context {
  userId?: string
  prisma: PrismaClient
}

export function createContext({ req }: any): Context {
  let { userid: userId } = req.headers

  userId = (userId !== "undefined" && userId !== undefined) ? userId : undefined

  return {
    prisma,
    userId,
  }
}
