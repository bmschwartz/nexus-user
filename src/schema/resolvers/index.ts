import { Context } from "../../context";
import { User } from "@prisma/client";

export const resolvers: any = {
  Query: {
    async me(parent: any, args: any, ctx: Context) {
      console.log(parent, args)
      return await ctx.prisma.user.findMany()
    }
  },
  Mutation: {
    async loginUser(parent: any, args: any, ctx: Context) {
      const { username, password } = args
      return {
        token: "token123",
        userId: 1
      }
    },
    async signupUser(parent: any, args: any, ctx: Context) {
      const { data: { name, email, username, password } } = args
      console.log(`signup: ${name} ${email} ${username} ${password}`)
      return {
        token: "token123",
        userId: 1
      }
    }
  },
  User: {
    async __resolveReference(user: any, ctx: Context) {
      console.log(user)
      return await ctx.prisma.user.findOne({ where: { id: Number(user.id) } })
    },
  },
}