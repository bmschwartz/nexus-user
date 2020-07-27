import { ApolloServer } from "apollo-server"
import { buildFederatedSchema } from "@apollo/federation"

import { typeDefs } from './schema/types'
import { resolvers } from "./schema/resolvers";
import { createContext } from "./context";

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  engine: {
    graphVariant: "current",
    reportSchema: true
  },
  context: createContext
});

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})