// src/Server/Modules/Health/HealthCheckRoute.ts
import { TestSuite } from '@k-foss/ts-estests';
import { strictEqual } from 'assert';
import 'reflect-metadata';
import { createFastifyTestServer } from '../../Library/Fastify';

export class HealthCheckRouteTest extends TestSuite {
  public testName = 'HealthCheck Route Tests';

  public async test(): Promise<void> {
    const fastify = await createFastifyTestServer();

    const response = await fastify.inject({
      method: 'GET',
      url: '/healthcheck',
    });

    strictEqual(response.body, 'OK');
  }
}
