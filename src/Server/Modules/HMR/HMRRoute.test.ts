// src/Server/Modules/HMR/HMRRoute.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import 'reflect-metadata';
import WebSocket from 'ws';
import { createFastifyTestServer } from '../../Library/Fastify';
import { HMR } from './HMR';
import { strictEqual } from 'assert';

export class HMRRouteTest extends TestSuite {
  public testName = 'HMR Route Tests';

  public async test(): Promise<void> {
    const fastify = await createFastifyTestServer();

    try {
      await fastify.listen(1234, '0.0.0.0');

      const ws = new WebSocket(`ws://localhost:1234/HMR`);

      return new Promise((resolve) => {
        ws.on('message', (msg) => {
          strictEqual(msg, 'file:///workspace/src/Client/Client.tsx');

          ws.close();
          resolve(fastify.close());
        });

        ws.on('open', () => {
          ws.ping('trest');

          ws.send('helloWorld');

          HMR.emit('moduleUpdated', 'file:///workspace/src/Client/Client.tsx');
        });
      });
    } catch {
      console.log('Caught');
      await fastify.close();
    } finally {
    }
  }
}
