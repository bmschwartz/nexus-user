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
    const { data: { name, email, username, password } } = args
    console.log(`signup: ${name} ${email} ${username} ${password}`)
    return {
      token: "token123",
      userId: 1
    }
  }
}