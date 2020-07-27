import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
  user: any
  prisma: PrismaClient
}

export function createContext({ req }: any): Context {
  console.log(req.headers)
  const user = req.headers.user ? JSON.parse(req.headers.user) : null
  return { user, prisma }
}