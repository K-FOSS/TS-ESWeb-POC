// src/Library/Routes/Route.ts
import { RequestHandler } from 'fastify';

export interface Route {
  path: string;

  handler: RequestHandler;
}
