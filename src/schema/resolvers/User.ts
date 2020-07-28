import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"
import { Context } from "../../context"

dotenv.config()

export const UserQuery = {
  async me(parent: any, args: any, { prisma, userId }: Context) {
    if (!userId) {
      throw new Error("Not logged in")
    }
    return await prisma.user.findOne({ where: { id: userId } })
  },
}

export const UserMutations = {
  async signupUser(parent: any, args: any, ctx: Context) {
    const { input: { email, username, password } } = args

    let user = await ctx.prisma.user.findOne({ where: { username } })
    if (user) {
      throw new Error("That username is taken")
    }

    user = await ctx.prisma.user.create({
      data: {
        email,
        username,
        password: bcrypt.hashSync(password, 10)
      }
    })

    return {
      token: jwt.sign({ userId: user.id }, String(process.env.APP_SECRET))
    }
  },

  async loginUser(parent: any, args: any, ctx: Context) {
    const { input: { username, password } } = args
    const user = await ctx.prisma.user.findOne({ where: { username } })
    if (!user) {
      throw new Error("Invalid username or password")
    }
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      throw new Error("Invalid username or password")
    }

    return {
      token: jwt.sign({ userId: user.id }, String(process.env.APP_SECRET))
    }
  },
}

export const UserResolvers = {
  async __resolveReference(user: any, ctx: Context) {
    return await ctx.prisma.user.findOne({ where: { id: Number(user.id) } })
  },
}