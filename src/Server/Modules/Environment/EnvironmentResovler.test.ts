// src/Server/Modules/Environment/EnvironmentResolver.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { createApolloServer } from '../../Library/Apollo';
import 'reflect-metadata';

export class EnvironmentResolverTest extends TestSuite {
  public testName = 'Environment Resolver Tests';

  public async test(): Promise<void> {
    const { createTestClient } = await import('apollo-server-testing');
    console.log('createTestClient: ', createTestClient);

    const gqlServer = await createApolloServer();
    console.log(`gqlServer: `, gqlServer);

    const { query } = await createTestClient(gqlServer);
    console.log(`query: `, query);

    const result = await query({
      query: `{
        serverEnvironment
      }`,
    });

    console.log(`result: `, result);
  }
}
