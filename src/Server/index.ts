// src/index.ts
import 'reflect-metadata';
import * as inspector from 'inspector';
import { HMR } from './Modules/HMR';
import { startWebTranspiler } from './Modules/TypeScript';
import { entrypoint } from './Modules/WebModule/Entrypoint';
import { webModuleController } from './Modules/WebModule/WebModuleController';
import { createApolloServer } from './Library/Apollo';
import { createFastifyServer } from './Library/Fastify';

if (process.env.NODE_ENV !== 'production') {
  inspector.open(5822, '0.0.0.0');

  await startWebTranspiler(entrypoint);

  console.info('Watching for changes to HMR files');
  await HMR.createWatcher();
}

/**
 * Fastify Web Server
 */
const webServer = await createFastifyServer();

/**
 * Apollo GraphQL Server
 */
const gqlServer = await createApolloServer();

/**
 * Register the Apollo Server Routes into the Fastify instance
 */
webServer.register(gqlServer.createHandler());

webServer.get('/Static/*', async function (request, reply) {
  const filePath = request.params['*'] as string;
  if (!filePath) {
    const err = (new Error() as unknown) as {
      statusCode: number;
      message: string;
    };
    err.statusCode = 400;
    err.message = 'Invalid file path';
    throw err;
  }

  const moduleFilePath = filePath.startsWith('/') ? filePath : `/${filePath}`;

  const webModule = webModuleController.getModule(moduleFilePath);

  if (!webModule) {
    const err = (new Error() as unknown) as {
      statusCode: number;
      message: string;
    };
    err.statusCode = 404;
    err.message = 'Invalid file';
    throw err;
  }

  reply.type('text/javascript');
  reply.header('Service-Worker-Allowed', '/');
  reply.send(webModule.code);
});

await webServer.listen(1231, '0.0.0.0');
console.log('Web Server listening at https://0.0.0.0:1231');

export {};
