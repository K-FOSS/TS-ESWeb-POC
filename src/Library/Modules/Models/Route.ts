// src/Library/Modules/Models/Route.ts
import { RequestHandler, RouteOptions } from 'fastify';
import { ModuleHandler } from './Handler';

export const handler: ModuleHandler<{ default: Route }, Route> = {
  regex: /.*Route\.(ts|js)/g,
  importHandler: async function (importFn) {
    const { default: RouteClass } = await importFn();

    return new RouteClass();
  },
};

export abstract class Route {
  options: Omit<RouteOptions, 'handler' | 'preHandler'>;

  handler: RequestHandler;
}
