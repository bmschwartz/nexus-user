import { ApolloServer } from 'apollo-server'
import { buildFederatedSchema } from '@apollo/federation'
import { applyMiddleware } from 'graphql-middleware'

import { typeDefs } from './schema/types'
import { resolvers } from './schema/resolvers'
import { createContext } from './context'
import { permissions } from './permissions'

const server = new ApolloServer({
  schema: applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers }]),
    permissions,
  ),
  engine: {
    graphVariant: 'current',
    reportSchema: true,
  },
  context: createContext,
})

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
