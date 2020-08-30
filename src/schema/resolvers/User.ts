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
    return await prisma.user.findOne({ where: { id: userId } })
  },
}

export const UserMutations = {
  async signupUser(parent: any, args: any, ctx: Context) {
    const {
      input: { email, username, password },
    } = args

    validateEmail(email)
    validateUsername(username)
    validatePassword(password)

    const users = await ctx.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              equals: username,
            },
          },
          {
            email: {
              equals: email,
            },
          },
        ],
      },
    })
    if (users) {
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
      ),
    }
  },

  async loginUser(parent: any, args: any, ctx: Context) {
    const {
      input: { email, username, password },
    } = args

    const whereClause = email ? { email } : { username }
    const user = await ctx.prisma.user.findOne({
      where: whereClause,
      include: { permissions: true },
    })
    if (!user) {
      return {}
    }

    const permissionNames = await getPermissionNames(ctx, user?.permissions)

    if (!user) {
      return new Error("Invalid username or password")
    }
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return new Error("Invalid username or password")
    }

    return {
      token: jwt.sign(
        { userId: user.id, permissions: JSON.stringify(permissionNames) },
        String(process.env.APP_SECRET),
      ),
    }
  },
}

export const UserResolvers = {
  async __resolveReference(user: any, ctx: Context) {
    return await ctx.prisma.user.findOne({ where: { id: Number(user.id) } })
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
  const regex = /^[A-Za-z0-9_-]{3,15}$/
  if (!regex.test(username)) {
    return new Error("Invalid username")
  }
  return null
}

const validatePassword = (password: string) => {
  const regex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
  if (!regex.test(password)) {
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
