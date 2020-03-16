// src/index.ts
import fastify from 'fastify';
import { compileWeb } from './TypeScript';
import { getFullModule, getImportMap } from './Modules';

await compileWeb('Web/src/Client.tsx');

const webServer = fastify();

webServer.get('/', async function(request, reply) {
  console.debug('Core request');
  const { renderWeb } = await import('../Web/src/Server');

  reply.type('text/html');

  return renderWeb(await getImportMap());
});

webServer.get('/Static/*', async function(request, reply) {
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

  console.log(`Getting ${filePath}`);

  const fullModule = await getFullModule(filePath);
  reply.type('text/javascript');
  return fullModule.esCode;
});

await webServer.listen(1231, '0.0.0.0');

export {};
