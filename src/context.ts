import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
  userId?: number
  permissions: string[]
  prisma: PrismaClient
}

export function createContext({ req }: any): Context {
  const { userid, permissions } = req.headers
  return {
    prisma,
    userId: Number(userid),
    permissions: permissions,
  }
}