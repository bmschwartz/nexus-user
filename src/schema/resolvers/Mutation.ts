import { UserMutations } from "./User"
import { GroupMutations } from "./Group"
import { GroupMembershipMutations } from "./GroupMembership"

export const Mutation = {
  ...UserMutations,
  ...GroupMutations,
  ...GroupMembershipMutations,
}