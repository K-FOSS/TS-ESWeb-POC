// src/index.ts
import 'reflect-metadata';
import fastify, { FastifyInstance } from 'fastify';
import fastifyWS from 'fastify-websocket';
import * as inspector from 'inspector';
import { Modules } from './Library/Modules';
import { HMR } from './Modules/HMR';
import { startWebTranspiler } from './Modules/TypeScript';
import { entrypoint } from './Modules/WebModule/Entrypoint';
import { webModuleController } from './Modules/WebModule/WebModuleController';
import { createApolloServer } from './Library/Apollo';

const modules = await Modules.loadModules();

if (process.env.NODE_ENV !== 'production') {
  inspector.open(5822, '0.0.0.0');

  await startWebTranspiler(entrypoint);

  console.info('Watching for changes to HMR files');
  await HMR.createWatcher();
}

const webServer = fastify() as FastifyInstance;
const gqlServer = await createApolloServer(await modules.buildResovlerSchema());

webServer.register(fastifyWS);
webServer.register(gqlServer.createHandler());

await modules.createRoutes(webServer);

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
  reply.send(
    webModule.code
      .replace(/exports\./gm, '')
      .replace(
        /process\.env\.(?<env>\S+)/g,
        (match, env) => `'${process.env[env]}'`,
      )
      .replace(`import React from 'react';`, `import * as React from 'react';`)
      .replace(
        `import tracing from "scheduler/tracing";`,
        `import * as tracing from "scheduler/tracing";`,
      )
      .replace(
        'import Scheduler from "scheduler";',
        'import * as Scheduler from "scheduler";',
      )
      .replace(
        'import ReactIs from "react-is";',
        'import * as ReactIs from "react-is";',
      ),
  );
});

await webServer.listen(1231, '0.0.0.0');
console.log('Web Server listening at https://0.0.0.0:1231');

export {};
