import { GroupMembershipQuery } from "./GroupMembership"
import { GroupQuery } from "./Group"
import { UserQuery } from "./User"

export const Query = {
  ...UserQuery,
  ...GroupQuery,
  ...GroupMembershipQuery
}