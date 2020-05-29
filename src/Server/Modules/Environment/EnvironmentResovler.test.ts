// src/Server/Modules/Environment/EnvironmentResolver.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { createApolloTestClient } from '../../Library/Apollo';
import { strictEqual } from 'assert';
import 'reflect-metadata';

export class EnvironmentResolverTest extends TestSuite {
  public testName = 'Environment Resolver Tests';

  public async test(): Promise<void> {
    const { query } = await createApolloTestClient();

    const result = await query({
      query: `
      {
        serverEnvironment
      }`,
    });

    strictEqual(result.data?.serverEnvironment, 'DEVELOPMENT');
  }
}
