// src/Modules/SSR/SSRRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { Route } from '../../Library/Modules/Models/Route';
import { moduleMap } from '../WebModule';

const relativePathRegex = /^\.{0,2}[/]/;

export default class SSRRoute implements Route {
  public options: Route['options'] = {
    method: 'GET',
    url: '/',
  };

  async handler(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply<ServerResponse>,
  ) {
    const clientImportMap = new Map<string, string>();
    const { renderWeb } = await import('../../../Web/Server');
    const specifierMap = new Map(
      Array.from(moduleMap).map(([, webModule]) => [
        webModule.specifier,
        webModule,
      ]),
    );

    reply.type('text/html');

    function getDeps(key: string): void {
      const scriptModule = specifierMap.get(key);
      if (!scriptModule) {
        return;
      }

      if (relativePathRegex.test(scriptModule.specifier)) {
        clientImportMap.set(
          `/Static/${scriptModule.filePath
            .replace(/\.tsx?$/, '')
            .replace('.js', '')}`,
          `/Static/${scriptModule.filePath}`,
        );
      } else {
        clientImportMap.set(
          scriptModule.specifier,
          `/Static/${scriptModule.filePath}`,
        );
      }

      Array.from(scriptModule.dependencies).map((depKey) => getDeps(depKey));
    }

    getDeps('/workspace/src/Web/Client.tsx');

    const clientMap = Object.fromEntries(clientImportMap);

    const importMap = {
      ...clientMap,
      react: clientMap['@pika/react'],
      'react-dom': clientMap['@pika/react-dom'],
    };

    return renderWeb(importMap);
  }
}
