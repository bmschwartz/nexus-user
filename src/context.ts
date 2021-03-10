import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface Context {
  userId?: string
  userType?: string
  prisma: PrismaClient
}

export function createContext({ req }: any): Context {
  let { userid: userId, usertype: userType } = req.headers

  userId = (userId !== "undefined" && userId !== undefined) ? userId : undefined
  userType = (userType !== "undefined" && userType !== undefined) ? userType : undefined

  return {
    prisma,
    userId,
    userType,
  }
}
