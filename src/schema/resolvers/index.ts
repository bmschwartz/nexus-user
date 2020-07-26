import { Query } from "./Query"
import { Mutation } from "./Mutation";
import { UserResolvers } from "./User";
import { GroupResolvers } from "./Group";
import { GroupMembershipResolvers } from "./GroupMembership";

export const resolvers: any = {
  Query,
  Mutation,
  User: UserResolvers,
  Group: GroupResolvers,
  GroupMembership: GroupMembershipResolvers,
}