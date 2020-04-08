// src/index.ts
import fastify, { FastifyInstance } from 'fastify';
import { Modules } from './Library/Modules';
import { startWebTranspiler } from './Modules/TypeScript';
import { moduleMap } from './Modules/WebModule';
import { entrypoint } from './Modules/WebModule/Entrypoint';
import * as inspector from 'inspector';

const modules = await Modules.loadModules();

inspector.open(5822, '0.0.0.0');

await startWebTranspiler(entrypoint);

const webServer = fastify() as FastifyInstance;

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
  reply.send(
    fullModule.code
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

let count = 0;

webServer.get('/SSRStream', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const importURLString = await import.meta.resolve('./Test');

  const importURL = new URL(importURLString);
  importURL.searchParams.set('count', `${count++}`);

  const { handleRequest } = (await import(
    importURL.href
  )) as typeof import('./Test');

  handleRequest(reply);
});

await webServer.listen(1231, '0.0.0.0');
console.log('Web Server listening at https://0.0.0.0:1231');

export {};
