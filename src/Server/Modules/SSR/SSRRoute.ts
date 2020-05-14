// src/Modules/SSR/SSRRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { HMRLoader } from '../../../Utils/hmrLoader';
import { Route } from '../../Library/Modules/Models/Route';
import { moduleMap } from '../WebModule';

const relativePathRegex = /^\.{0,2}[/]/;

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

    const { renderWeb } = await HMRLoader<typeof import('../../../Web/Server')>(
      '../../../Web/Server',
      import.meta.url,
    );

    reply.type('text/html');

    async function getDeps(key: string): Promise<any> {
      const scriptModule = moduleMap.get(key);
      if (!scriptModule) {
        return;
      }

      if (relativePathRegex.test(scriptModule.specifier)) {
        clientImportMap.set(
          `/Static${scriptModule.filePath
            .replace(/\.tsx?$/, '')
            .replace('.js', '')}`,
          `/Static${scriptModule.filePath}`,
        );
      } else {
        clientImportMap.set(
          scriptModule.specifier,
          `/Static${scriptModule.filePath}`,
        );
      }

      Array.from(scriptModule.dependencies).map((depKey) => getDeps(depKey));
    }

    getDeps('/home/node/workspace/src/Web/Client.tsx');

    const clientMap = Object.fromEntries(clientImportMap);

    const importMap = {
      ...clientMap,
      react:
        '/Static//home/node/workspace/node_modules/react/cjs/react.development.js',
      'react-dom':
        '/Static//home/node/workspace/node_modules/react-dom/cjs/react-dom.development.js',
      scheduler:
        '/Static//home/node/workspace/node_modules/react-dom/node_modules/scheduler/cjs/scheduler.development.js',
      'scheduler/tracing':
        '/Static//home/node/workspace/node_modules/react-dom/node_modules/scheduler/cjs/scheduler-tracing.development.js',
      history: '/Static//home/node/workspace/node_modules/history/history.js',
      'object-assign':
        '/Static//home/node/workspace/node_modules/object-assign/index.js',
      'react-router':
        '/Static//home/node/workspace/node_modules/react-router/react-router.development.js',
      'react-router-dom':
        '/Static//home/node/workspace/node_modules/react-router-dom/react-router-dom.development.js',
      'react-is/cjs/react-is.development':
        '/Static//home/node/workspace/node_modules/react-is/cjs/react-is.development.js',
      'react-is':
        '/Static//home/node/workspace/node_modules/react-is/cjs/react-is.development.js',
      '/Static//home/node/workspace/node_modules/prop-types/factoryWithTypeCheckers':
        '/Static//home/node/workspace/node_modules/prop-types/factoryWithTypeCheckers.js',
      '/Static//home/node/workspace/node_modules/prop-types/lib/ReactPropTypesSecret':
        '/Static//home/node/workspace/node_modules/prop-types/lib/ReactPropTypesSecret.js',
      '/Static//home/node/workspace/node_modules/prop-types/checkPropTypes':
        '/Static//home/node/workspace/node_modules/prop-types/checkPropTypes.js',
      'prop-types':
        '/Static//home/node/workspace/node_modules/prop-types/index.js',
      '@babel/runtime/helpers/esm/extends':
        '/Static//home/node/workspace/node_modules/@babel/runtime/helpers/esm/extends.js',
      'react-refresh/runtime':
        '/Static//home/node/workspace/node_modules/react-refresh/cjs/react-refresh-runtime.development.js',
    };

    return renderWeb(request.req.url!, importMap);
  }
}
