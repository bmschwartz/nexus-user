import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"
import { Context } from "../../context"
import { UserPermission, User } from "@prisma/client"
import { SITE_PERMISSIONS } from "../../permissions"
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
    const passwordError = validatePassword(password)

    if (emailError) {
      logger.info({ message: "Sign Up Error", emailError })
      return emailError
    } else if (usernameError) {
      logger.info({ message: "Sign Up Error", usernameError })
      return usernameError
    } else if (passwordError) {
      logger.info({ message: "Sign Up Error", passwordError })
      return passwordError
    }

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
        const error = new Error("An account with that email or username already exists")
        logger.info({ message: "Sign Up Error", error })
        return error
      }
    } catch (e) {
      logger.info({ message: "Sign Up Error", error: e })
    }

    const grantedPermission = SITE_PERMISSIONS.member

    let user: User

    try {
      user = await ctx.prisma.user.create({
        data: {
          email,
          username,
          password: bcrypt.hashSync(password, 10),
        },
      })
      await ctx.prisma.userPermission.create({
        data: {
          user: {connect: {username}},
          permission: {connect: {name: grantedPermission}},
        },
      })

      return {
        token: jwt.sign(
          { userId: user.id, permissions: JSON.stringify([grantedPermission]) },
          String(process.env.APP_SECRET),
          { expiresIn: "24h" },
        ),
      }
    } catch (e) {
      logger.info({ message: "Sign Up Error", error: e })
    }

    return null
  },

  async loginUser(parent: any, args: any, ctx: Context) {
    const {
      input: { email, password },
    } = args

    const user = await ctx.prisma.user.findUnique({
      where: { email },
      include: { permissions: true },
    })
    if (!user) {
      logger.info({ message: "Login Error - Invalid email or password", email })
      return new Error("Invalid email or password")
    }

    let permissionNames: string[] = []

    try {
      permissionNames = await getPermissionNames(ctx, user.permissions)
    } catch (e) {
      logger.error({ message: "Error getPermissionNames", error: e })
    }

    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      logger.error({ message: "Login Error", error: "Invalid password match" })
      return new Error("Invalid email or password")
    }

    try {
      const permissions: string = JSON.stringify(permissionNames)
      return {
        token: jwt.sign(
          { userId: user.id, permissions },
          String(process.env.APP_SECRET),
          { expiresIn: "24h" },
        ),
      }
    } catch (e) {
      logger.error({ message: "Login Error", error: e })
    }
    return null
  },
}

export const UserResolvers = {
  async __resolveReference(user: any, ctx: Context) {
    return await ctx.prisma.user.findUnique({ where: { id: user.id } })
  },

  async admin(parent: any, args: any, ctx: Context) {
    try {
      return ctx.permissions.includes(SITE_PERMISSIONS.admin)
    } catch (error) {
      logger.error({ message: "Resolver Error [User.admin]", error })
    }
    return false
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
  const regex = /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  if (!regex.test(username)) {
    logger.info({ message: "Invalid username error", username })
    return new Error("Invalid username")
  }
  return null
}

const validatePassword = (password: string) => {
  const regex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
  if (!regex.test(password)) {
    logger.info({ message: "Invalid password", password })
    return new Error("Invalid password")
  }
  return null
}

const getPermissionNames = async (
  ctx: Context,
  userPermissions: UserPermission[],
) => {
  const permissions = await ctx.prisma.permission.findMany({
    where: {
      id: {
        in: userPermissions.map((p) => p.permissionId),
      },
    },
    select: { name: true },
  })
  return permissions.map((p) => p.name)
}
