// src/Server/Library/Apollo.ts
import { getGQLContext } from './Context';
import { GraphQLSchema } from 'graphql';

type ApolloServer = import('apollo-server-fastify').ApolloServer;

let gqlServer: ApolloServer;
export async function createApolloServer(
  schema: GraphQLSchema,
): Promise<ApolloServer> {
  if (!gqlServer) {
    const { ApolloServer } = await import('apollo-server-fastify');

    gqlServer = new ApolloServer({
      schema,
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
