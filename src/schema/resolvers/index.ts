import { Context } from "../../context";
import { User } from "@prisma/client";

export const resolvers: any = {
  Query: {
    async me(parent: any, args: any, ctx: Context) {
      console.log(parent, args)
      // return await ctx.prisma.user()
    }
  },
  User: {
    async __resolveReference(user: any, ctx: Context) {
      console.log(user)
      return await ctx.prisma.user.findOne({ where: { id: Number(user.id) } })
    },
  },
}