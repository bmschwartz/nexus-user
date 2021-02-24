import { ApolloServer } from "apollo-server"
import { buildFederatedSchema } from "@apollo/federation"
import { applyMiddleware } from "graphql-middleware"
import Amplify, { Auth as AmplifyAuth } from "aws-amplify"

import { typeDefs } from "./schema/types"
import { resolvers } from "./schema/resolvers"
import { createContext } from "./context"
import { permissions } from "./permissions"
import { logger } from "./logger";
import {awsExports} from "./aws-exports"

Amplify.configure(awsExports)
AmplifyAuth.configure(awsExports)

const server = new ApolloServer({
  schema: applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers }]),
    permissions,
  ),
  engine: {
    graphVariant: "current",
  },
  context: createContext,
  introspection: true,
})

server.listen({ port: 4003 }).then(({ url }) => {
  logger.info({ message: `Server ready at ${url}` })
})
