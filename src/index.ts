// src/index.ts
import fastify from 'fastify';
import { Modules, moduleMap } from './Library/Modules';
import { compilePath } from './Modules/TypeScript';

const modules = await Modules.loadModules();
await compilePath(
  '/workspace/Web/src/Client.tsx',
  '/workspace/Web/src/Client.tsx',
  moduleMap,
);

const webServer = fastify();

await modules.createRoutes(webServer);

webServer.get('/Static/*', async function (request, reply) {
  const filePath = request.params['*'];
  if (!filePath) {
    const err = (new Error() as unknown) as {
      statusCode: number;
      message: string;
    };
    err.statusCode = 400;
    err.message = 'Invalid file path';
    throw err;
  }

  const fullModule = moduleMap.get(filePath);
  if (!fullModule) {
    const err = (new Error() as unknown) as {
      statusCode: number;
      message: string;
    };
    err.statusCode = 404;
    err.message = 'Invalid file';
    throw err;
  }

  reply.type('text/javascript');
  reply.send(fullModule.code);
});

await webServer.listen(1231, '0.0.0.0');
console.log('Web Server listening at https://0.0.0.0:1231');

export {};