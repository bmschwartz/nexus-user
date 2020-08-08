import { rule, shield, or, and } from "graphql-shield"
import { Context } from "../context"

export const SITE_PERMISSIONS = {
  admin: "site:admin",
  member: "site:member",
}

const isAuthenticated = rule()((parent, args, { userId }) => {
  return !!userId
})

const canViewPersonalData = rule({ cache: "strict" })(
  async (parent, args, ctx: Context) => {
    return parent.id === ctx.userId
  },
)

const isPlatformAdmin = rule({ cache: "contextual" })(
  async (parent: any, args: any, ctx: Context) => {
    return ctx.permissions.includes(SITE_PERMISSIONS.admin)
  },
)

export const permissions = shield({
  Query: {
    me: isAuthenticated,
  },
  User: {
    admin: and(isAuthenticated, or(canViewPersonalData, isPlatformAdmin)),
    email: and(isAuthenticated, or(canViewPersonalData, isPlatformAdmin)),
  },
})
