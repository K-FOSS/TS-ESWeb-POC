// src/Server/Library/Apollo.ts
import { getGQLContext } from './Context';

type ApolloServer = import('apollo-server-fastify').ApolloServer;

let gqlServer: ApolloServer;
export async function createApolloServer(): Promise<ApolloServer> {
  if (!gqlServer) {
    const [
      { ApolloServer },
      { getResolvers, buildGQLSchema },
    ] = await Promise.all([
      import('apollo-server-fastify'),
      import('./Resolvers'),
    ]);

    const resolvers = await getResolvers();

    gqlServer = new ApolloServer({
      schema: await buildGQLSchema(resolvers),
      context: getGQLContext,
      introspection: true,
      playground: {
        settings: {
          'editor.theme': 'light',
          'general.betaUpdates': true,
        },
        workspaceName: 'TS-ESWeb',
      },
    });
  }

  return gqlServer;
}
