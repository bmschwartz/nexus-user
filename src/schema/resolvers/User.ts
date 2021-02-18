import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"
import { Context } from "../../context"
import { UserPermission } from "@prisma/client"
import { SITE_PERMISSIONS } from "../../permissions"

dotenv.config()

export const UserQuery = {
  async me(parent: any, args: any, { prisma, userId }: Context) {
    if (!userId) {
      return new Error("Not logged in")
    }
    return await prisma.user.findUnique({ where: { id: userId } })
  },

  async userIdByEmail(parent: any, args: any, ctx: Context) {
    const {
      input: { email },
    } = args

    const user = await ctx.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    return user?.id
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
      return emailError
    } else if (usernameError) {
      return usernameError
    } else if (passwordError) {
      return passwordError
    }

    const users = await ctx.prisma.user.findMany({
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
      return new Error("An account with that email or username already exists")
    }

    const grantedPermission = SITE_PERMISSIONS.member

    const user = await ctx.prisma.user.create({
      data: {
        email,
        username,
        password: bcrypt.hashSync(password, 10),
      },
    })
    await ctx.prisma.userPermission.create({
      data: {
        user: { connect: { username } },
        permission: { connect: { name: grantedPermission } },
      },
    })

    return {
      token: jwt.sign(
        { userId: user.id, permissions: JSON.stringify([grantedPermission]) },
        String(process.env.APP_SECRET),
        { expiresIn: "24h" },
      ),
    }
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
      return new Error("Invalid email or password")
    }

    const permissionNames = await getPermissionNames(ctx, user?.permissions)

    if (!user) {
      return new Error("Invalid email or password")
    }
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return new Error("Invalid email or password")
    }

    return {
      token: jwt.sign(
        { userId: user.id, permissions: JSON.stringify(permissionNames) },
        String(process.env.APP_SECRET),
        { expiresIn: "24h" },
      ),
    }
  },
}

export const UserResolvers = {
  async __resolveReference(user: any, ctx: Context) {
    return await ctx.prisma.user.findUnique({ where: { id: user.id } })
  },

  async admin(parent: any, args: any, ctx: Context) {
    return ctx.permissions.includes(SITE_PERMISSIONS.admin)
  },
}

const validateEmail = (email: string) => {
  const regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  if (!regexp.test(email)) {
    return new Error("Invalid email")
  }
  return null
}

const validateUsername = (username: string) => {
  const regex = /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  if (!regex.test(username)) {
    console.log("invalid username!")
    return new Error("Invalid username")
  }
  return null
}

const validatePassword = (password: string) => {
  const regex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
  if (!regex.test(password)) {
    console.log("invalid password!")
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
