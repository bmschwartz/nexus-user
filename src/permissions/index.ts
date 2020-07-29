import { rule, shield, or } from "graphql-shield"
import { Context } from "../context";

const isAuthenticated = rule()((parent, args, { userId }) => {
  return !!userId
})

const canViewPersonalData = rule({ cache: 'contextual' })(
  async (parent, args, ctx: Context) => {
    console.log(parent)
    return true
  },
)

const isPlatformAdmin = rule({ cache: 'contextual' })(
  async (parent: any, args: any, ctx: Context) => {

    return false
  }
)

export const permissions = shield({
  Query: {
    me: isAuthenticated,
  },
  User: {
    admin: or(canViewPersonalData, isPlatformAdmin),
  }
})