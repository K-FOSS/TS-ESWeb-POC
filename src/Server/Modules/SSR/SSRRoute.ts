// src/Modules/SSR/SSRRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { Route } from '../../Library/Modules/Models/Route';
import { moduleMap } from '../WebModule';
import { entrypoint } from '../WebModule/Entrypoint';

const relativePathRegex = /^\.{0,2}[/]/;

let count = 0;

export default class SSRRoute implements Route {
  public options: Route['options'] = {
    method: 'GET',
    url: '/*',
  };

  async handler(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply<ServerResponse>,
  ) {
    const clientImportMap = new Map<string, string>();

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const importURLString = await import.meta.resolve('../../../Web/Server');

    const importURL = new URL(importURLString);
    importURL.searchParams.set('count', `${count++}`);

    const { renderWeb } = (await import(
      importURL.href
    )) as typeof import('../../../Web/Server');

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

    getDeps(entrypoint);

    const clientMap = Object.fromEntries(clientImportMap);

    const importMap = {
      ...clientMap,
      react: '/Static//workspace/node_modules/react/cjs/react.development.js',
      'react-dom':
        '/Static//workspace/node_modules/react-dom/cjs/react-dom.development.js',
      scheduler:
        '/Static//workspace/node_modules/react-dom/node_modules/scheduler/cjs/scheduler.development.js',
      'scheduler/tracing':
        '/Static//workspace/node_modules/react-dom/node_modules/scheduler/cjs/scheduler-tracing.development.js',
      history: '/Static//workspace/node_modules/history/history.js',
      'react-router':
        '/Static//workspace/node_modules/react-router/react-router.development.js',
      'react-router-dom':
        '/Static//workspace/node_modules/react-router-dom/react-router-dom.development.js',
      'react-is':
        '/Static//workspace/node_modules/prop-types/node_modules/react-is/cjs/react-is.production.min.js',
      '/Static//workspace/node_modules/prop-types/checkPropTypes':
        '/Static//workspace/node_modules/prop-types/checkPropTypes.js',
    };

    return renderWeb(request.req.url!, importMap);
  }
}
