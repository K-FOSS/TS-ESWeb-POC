// src/Server/Modules/Health/HealthCheckResolver.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { strictEqual } from 'assert';
import 'reflect-metadata';
import { createApolloTestClient } from '../../Library/Apollo';

export class HealthCheckResolverTest extends TestSuite {
  public testName = 'HealthCheck Resolver Tests';

  public async test(): Promise<void> {
    const { query } = await createApolloTestClient();

    const result = await query({
      query: `
      {
        healthCheck
      }`,
    });

    strictEqual(result.data?.healthCheck, 'OK');
  }
}
