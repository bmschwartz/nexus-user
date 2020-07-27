import { Query } from "./Query"
import { Mutation } from "./Mutation";
import { UserResolvers } from "./User";

export const resolvers: any = {
  Query,
  Mutation,
  User: UserResolvers,
}