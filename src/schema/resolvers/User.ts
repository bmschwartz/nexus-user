import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import {Auth as AmplifyAuth} from "aws-amplify";

import { Context } from "../../context"
import { User } from "@prisma/client"
import {logger} from "../../logger";

dotenv.config()

export const UserQuery = {
  async me(parent: any, args: any, { prisma, userId }: Context) {
    if (!userId) {
      logger.info({ message: "Not logged in", userId })
      return new Error("Not logged in")
    }
    return await prisma.user.findUnique({ where: { id: userId } })
  },

  async userIdByEmail(parent: any, args: any, ctx: Context) {
    const {
      input: { email },
    } = args

    try {
      const user = await ctx.prisma.user.findUnique({
        where: { email },
        select: { id: true },
      })

      return user?.id

    } catch (e) {
      logger.info({ message: "Could not find user by email", email })
    }

    return null
  },
}

export const UserMutations = {
  async signupUser(parent: any, args: any, ctx: Context) {
    const {
      input: { email, username, password },
    } = args

    const emailError = validateEmail(email)
    const usernameError = validateUsername(username)

    if (emailError) {
      logger.info({ message: "Sign Up Error", emailError })
      return { success: false, error: "Invalid email" }
    } else if (usernameError) {
      logger.info({message: "Sign Up Error", usernameError})
      return {success: false, error: "Invalid username"}
    }

    const userExists = await checkIfUserExists(ctx, email, username)
    if (userExists) {
      logger.info({ message: "User or email already exists", email, username })
      return { success: false, error: "Email or username already exists"}
    }

    let userSub
    try {
      const result = await AmplifyAuth.signUp({
        username: email, password, attributes: {email},
      })
      userSub = result.userSub
    } catch (e) {
      logger.info({ message: "Amplify sign up failed", username, email })
      return { success: false, error: "Registration Error"}
    }

    let user: User

    try {
      user = await ctx.prisma.user.create({
        data: {
          id: userSub,
          email,
          username,
        },
      })

      return { success: true }
    } catch (e) {
      logger.info({ message: "Sign Up Error", error: e })
    }

    return { success: false, error: "Signup Error" }
  },

  async verifySignUpCode(parent: any, args: any, ctx: Context) {
    const {
      input: { email, code },
    } = args

    const user = await ctx.prisma.user.findUnique({
      where: { email },
    })
    if (!user) {
      logger.info({ message: "Verify Code Error - User does not exist", email })
      return { success: false, error: "No user matches that email"}
    }

    try {
      await AmplifyAuth.confirmSignUp(email, code)
    } catch (e) {
      logger.info({ message: "Amplify Error - Invalid registration code", email })
      return { success: false, error: "Error confirming token"}
    }
    return { success: true }
  },

  async loginUser(parent: any, args: any, ctx: Context) {
    const {
      input: { email, password },
    } = args

    const user = await ctx.prisma.user.findUnique({
      where: { email },
    })
    if (!user) {
      logger.info({ message: "Login Error - User does not exist", email })
      return { success: false, error: "Invalid email and password combination"}
    }

    try {
      await AmplifyAuth.signIn(email, password)
      return {
        token: jwt.sign(
          { userId: user.id },
          String(process.env.APP_SECRET),
          { expiresIn: "24h" },
        ),
      }
    } catch (e) {
      logger.error({ message: "Login Error", error: e })
    }
    return { token: null }
  },
}

export const UserResolvers = {
  async __resolveReference(user: any, ctx: Context) {
    return await ctx.prisma.user.findUnique({ where: { id: user.id } })
  },
}

const validateEmail = (email: string) => {
  const regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  if (!regexp.test(email)) {
    logger.info({ message: "Invalid email error", email })
    return new Error("Invalid email")
  }
  return null
}

const validateUsername = (username: string) => {
  const regex = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  if (!regex.test(username)) {
    logger.info({ message: "Invalid username error", username })
    return new Error("Invalid username")
  }
  return null
}

const checkIfUserExists = async (ctx: Context, email: string, username: string) => {
  let users: User[]
  try {
    users = await ctx.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              equals: username,
              mode: "insensitive",
            },
          },
          {
            email: {
              equals: email,
              mode: "insensitive",
            },
          },
        ],
      },
    })
    if (users.length > 0) {
      return true
    }
  } catch (e) {
    return true
  }
  return false
}
