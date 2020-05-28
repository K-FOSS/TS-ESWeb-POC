// src/Library/Modules/Models/Route.ts
import { RequestHandler, RouteOptions } from 'fastify';
import { ModuleHandler } from './Handler';

export const routeHandler: ModuleHandler<
  { default: typeof import('../../../Modules/SSR/SSRRoute').default },
  Route
> = {
  regex: /.*Route\.(ts|js)/g,
  importHandler: async function (importFn) {
    const test = await importFn();
    const NewClass = test.default;

    return new NewClass();
  },
};

export abstract class Route {
  options: Omit<RouteOptions, 'handler' | 'preHandler'>;

  handler: RequestHandler;
}
