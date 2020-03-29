// src/index.ts
import fastify from 'fastify';
import { getFullModule } from './ModulesOld';
import { Modules } from './Library/Modules';

const modules = await Modules.loadModules();

// await compileWeb('Web/src/Client.tsx');

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

  const fullModule = await getFullModule(filePath);
  reply.type('text/javascript');
  return fullModule.esCode;
});

await webServer.listen(1231, '0.0.0.0');

export {};
