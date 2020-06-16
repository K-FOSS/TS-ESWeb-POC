// src/Server/Modules/Template/TemplateRoute.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { strictEqual } from 'assert';
import 'reflect-metadata';
import { createFastifyTestServer } from '../../Library/Fastify';
import { isWebManifest } from './isWebManifest';
import { WebManifest } from './WebManifet';

export class WebManifestRouteTest extends TestSuite {
  public testName = 'Web Manifest Route Suite';

  public async test(): Promise<void> {
    const fastify = await createFastifyTestServer();

    const requestResponse = await fastify.inject({
      method: 'GET',
      url: '/WebManifest.json',
    });

    const bodyJSON = JSON.parse(requestResponse.body) as WebManifest;

    strictEqual(isWebManifest(bodyJSON), true);

    strictEqual(
      bodyJSON.name,
      'TS-ESWeb',
      'Web Manifest Route > name === TS-ESWeb',
    );

    strictEqual(
      bodyJSON.description,
      'Proof of concept next generation web SSR framework',
      'Web Manifest Route > Description === Proof of concept next generation web SSR framework',
    );

    strictEqual(
      bodyJSON.short_name,
      'TS-ESWeb',
      'Web Manifest Route > short_name === TS-ESWeb',
    );
  }
}
