import { Context } from "../../context"

export const Query = {
  async me(parent: any, args: any, ctx: Context) {
    console.log(parent, args)
    return await ctx.prisma.user.findMany()
  }
}