// src/Modules/SSR/SSRRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { Route } from '../../Library/Modules/Models/Route';
import { getImportMap } from '../../ModulesOld';

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
    const { renderWeb } = await import('../../../Web/src/Server');

    reply.type('text/html');

    return renderWeb(await getImportMap());
  }
}
