// src/Modules/Template/TemplateRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { Route } from '../../Library/Modules/Models/Route';

export default class TemplateRoute implements Route {
  public options: Route['options'] = {
    method: 'GET',
    url: '/HelloWorld',
  };

  async handler(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply<ServerResponse>,
  ) {
    console.log('HelloWorld');

    return 'Hello, World!';
  }
}
