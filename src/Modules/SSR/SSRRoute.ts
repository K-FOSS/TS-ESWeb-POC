// src/Modules/SSR/SSRRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { Route } from '../../Library/Modules/Models/Route';
import { moduleMap } from '../../Library/Modules';

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
    const { renderWeb } = await import('../../../Web/src/Server');

    reply.type('text/html');

    function getDeps(key: string): void {
      const scriptModule = moduleMap.get(key);
      if (!scriptModule) {
        return;
      }

      if (relativePathRegex.test(scriptModule.specifier)) {
        clientImportMap.set(
          `/Static/${scriptModule.path
            .replace(/\.tsx?$/, '')
            .replace('.js', '')}`,
          `/Static/${scriptModule.path}`,
        );
      } else {
        clientImportMap.set(
          scriptModule.specifier,
          `/Static/${scriptModule.specifier}`,
        );
      }

      scriptModule.dependencies.map((depKey) => getDeps(depKey));
    }

    getDeps('/workspace/Web/src/Client.tsx');

    const clientMap = Object.fromEntries(clientImportMap);

    const importMap = {
      ...clientMap,
      react: clientMap['@pika/react'],
      'react-dom': clientMap['@pika/react-dom'],
    };

    return renderWeb(importMap);
  }
}
