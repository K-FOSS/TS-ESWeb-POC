// src/Server/Modules/Template/TemplateRoute.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { strictEqual } from 'assert';
import 'reflect-metadata';
import { createFastifyTestServer } from '../../Library/Fastify';

export class TemplateRouteTest extends TestSuite {
  public testName = 'Template Route Tests';

  public async test(): Promise<void> {
    const fastify = await createFastifyTestServer();

    const response = await fastify.inject({
      method: 'GET',
      url: '/HelloWorld',
    });

    strictEqual(response.body, 'Hello, World!');
  }
}
