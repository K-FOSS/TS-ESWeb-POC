/* eslint-disable @typescript-eslint/camelcase */
// src/Server/Modules/WebManifest/isWebManifest.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { strictEqual } from 'assert';
import 'reflect-metadata';
import { createFastifyTestServer } from '../../Library/Fastify';
import { isWebManifest } from './isWebManifest';
import { WebManifest, DisplayMode } from './WebManifet';

export class IsWebManifestTest extends TestSuite {
  public testName = 'isWebManifest Suite';

  public async test(): Promise<void> {
    const fastify = await createFastifyTestServer();

    const routeResponse = await fastify.inject({
      method: 'GET',
      url: '/WebManifest.json',
    });

    strictEqual(isWebManifest(JSON.parse(routeResponse.body)), true);

    const exampleManifest: WebManifest = {
      background_color: '#fff',
      description: 'Random App',
      display: DisplayMode.MINIMAL,
      icons: [],
      name: 'Random Application',
      short_name: 'Random',
      start_url: '/',
    };

    strictEqual(isWebManifest(exampleManifest), true);

    strictEqual(isWebManifest({}), false);
  }
}
