import { Context } from "../../context"

export const UserResolvers = {
  async __resolveReference(user: any, ctx: Context) {
    console.log(user)
    return await ctx.prisma.user.findOne({ where: { id: Number(user.id) } })
  },
}