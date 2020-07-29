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

    validateEmail(email)
    validateUsername(username)
    validatePassword(password)

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

const validateEmail = (email: string) => {
  const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (!regexp.test(email)) {
    throw new Error("Invalid email")
  }
}

const validateUsername = (username: string) => {
  const regex = /^[A-Za-z0-9_-]{3,15}$/
  if (!regex.test(username)) {
    throw new Error("Invalid username")
  }
}

const validatePassword = (password: string) => {
  const regex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
  if (!regex.test(password)) {
    throw new Error("Invalid password")
  }
}