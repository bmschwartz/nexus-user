import { Context } from "../../context"

export const Mutation = {
  async loginUser(parent: any, args: any, ctx: Context) {
    const { username, password } = args
    return {
      token: "token123",
      userId: 1
    }
  },

  async signupUser(parent: any, args: any, ctx: Context) {
    const { input: { name, email, username, password } } = args

    let user = await ctx.prisma.user.findOne({ where: { email } })
    if (user) {
      throw new Error("A user with that email already exits")
    }

    user = await ctx.prisma.user.findOne({ where: { username } })
    if (user) {
      throw new Error("A user with that username already exits")
    }

    user = await ctx.prisma.user.create({ data: { name, email, username, password } })

    return {
      userId: user.id,
      token: "temp-token"
    }
  }
}