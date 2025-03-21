import { Request } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

import express from "express";
import http from "http";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import { getUserFromToken } from "./services/user.services.js";
import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import { authenticate } from "./middlewares/auth.middleware.js";
import { validateApiKey } from "./middlewares/apiKey.middleware.js";
import { redirect } from "./controllers/url.controller.js";
interface MyContext {
  token?: string;
  user?: any;
}

config();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault(),
  ],
  introspection: true,
});
// Ensure we wait for our server to start
await server.start();

// our loggerMiddleware.
app.use(loggerMiddleware);

// validate API Key middleware
// app.use(validateApiKey);

// our authenticate middleware.
// app.use(authenticate);

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/graphql",
  validateApiKey,
  authenticate,
  cors<cors.CorsRequest>(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }: { req: Request }) => {
      const user = (req as any).user;

      // add the user to the context
      return { user };
    },
  }),
);

// routes
app.get("/:code", redirect);

// connect database
connectDB();

// Modified server startup
await new Promise<void>((resolve) =>
  httpServer.listen({ port: PORT }, resolve),
);
console.log(`🚀 Server ready at http://localhost:${PORT}/`);
