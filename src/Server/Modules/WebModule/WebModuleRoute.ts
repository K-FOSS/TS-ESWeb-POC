// src/Server/Modules/WebModule/ModuleRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { Route } from '../../Library/Fastify';
import { renderModuleTable } from '../../Components/ModuleTable';

export default class TemplateRoute implements Route {
  public options: Route['options'] = {
    method: 'GET',
    url: '/ModuleAdmin/*',
  };

  async handler(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply<ServerResponse>,
  ) {
    reply.type('text/html');

    return renderModuleTable();
  }
}
