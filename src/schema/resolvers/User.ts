import jwt from "jsonwebtoken"
import { Context } from "../../context"

export const UserQuery = {
  async me(parent: any, args: any, ctx: Context) {
    console.log(`me: ${ctx.user}`)
    return await ctx.prisma.user.findMany()
  },
}

export const UserMutations = {
  async loginUser(parent: any, args: any, ctx: Context) {
    const { input: { username, password } } = args
    const user = await ctx.prisma.user.findOne({ where: { username } })
    if (!user) {
      throw new Error("User does not exist")
    }
    const { id: userId } = user
    const token = jwt.sign(
      { "https://monest.io/graphql": {} },
      "appsecret321",
      { algorithm: "HS256", subject: String(userId), expiresIn: "1d" },
    )

    return {
      token,
      userId,
    }
  },

  async signupUser(parent: any, args: any, ctx: Context) {
    const { input: { email, username, password } } = args

    let user = await ctx.prisma.user.findOne({ where: { username } })
    if (user) {
      throw new Error("A user with that email already exits")
    }

    user = await ctx.prisma.user.findOne({ where: { username } })
    if (user) {
      throw new Error("A user with that username already exits")
    }

    user = await ctx.prisma.user.create({ data: { email, username, password } })

    return {
      userId: user.id,
      token: "temp-token"
    }
  }
}

export const UserResolvers = {
  async __resolveReference(user: any, ctx: Context) {
    return await ctx.prisma.user.findOne({ where: { id: Number(user.id) } })
  },
}