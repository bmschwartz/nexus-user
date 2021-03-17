import bodyParser from "body-parser";
import express, {Request, Response} from "express"
import { ApolloServer } from "apollo-server-express"
import { buildFederatedSchema } from "@apollo/federation"
import { applyMiddleware } from "graphql-middleware"
import Amplify, { Auth as AmplifyAuth } from "aws-amplify"

import { typeDefs } from "./schema/types"
import { resolvers } from "./schema/resolvers"
import { createContext } from "./context"
import { permissions } from "./permissions"
import { logger } from "./logger";
import { awsExports } from "./aws-exports"
import crypto from "crypto";

Amplify.configure(awsExports)
AmplifyAuth.configure(awsExports)

const app = express()
app.use(bodyParser.json())

const graphVariant = process.env.APOLLO_GRAPH_VARIANT || "current"

const server = new ApolloServer({
  schema: applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers }]),
    permissions,
  ),
  engine: {
    graphVariant,
  },
  context: createContext,
  introspection: true,
})

server.applyMiddleware({ app })

app.listen({ port: 4003 }, () => {
  logger.info({ message: `🚀 Server ready` })
})

app.get("/user", async (req: Request, res: Response) => {
  const userId = req.query.userId
  const incomingSig = req.header("sig")

  if (typeof userId !== "string") {
    return res.sendStatus(400)
  }

  const sig = crypto.createHmac("sha256", process.env.APP_SECRET)
    .update(userId)
    .digest("hex");

  if (sig !== incomingSig) {
    return res.sendStatus(403)
  }

  const ctx = createContext({ req })

  try {
    const user = await ctx.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return res.sendStatus(404)
    }
    return res.status(200).send({ email: user.email })
  } catch (e) {
    return res.status(400)
  }
})
