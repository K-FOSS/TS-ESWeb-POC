// src/Library/Modules/Models/Module.ts
import { promises as fs } from 'fs';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import { Route } from './Route';
import { FastifyInstance } from 'fastify';
import { moduleHandlers, ModuleTypes } from './Handler';

const modulesPath = resolvePath(
  fileURLToPath(import.meta.url),
  '../../../../Modules',
);

export class Modules {
  routes: Route[] = [];

  static async loadModules(): Promise<Modules> {
    const modules = new Modules();

    const moduleEntries = await fs.readdir(modulesPath, {
      withFileTypes: true,
    });

    const folderContentPromises: Promise<void>[] = [];

    for (const moduleEntry of moduleEntries) {
      if (!moduleEntry.isDirectory()) continue;

      const folderPath = resolvePath(modulesPath, moduleEntry.name);
      const folderContents = await fs.readdir(folderPath);

      const fileProcessing = folderContents.map(async (fileName) => {
        const filePath = resolvePath(folderPath, fileName);

        for (const moduleHandlerKey in moduleHandlers) {
          // Needed because TypeScript is typing moduleHandlerKey as string instead of ModuleTypes
          const handlerKey = moduleHandlerKey as ModuleTypes;

          const handler = moduleHandlers[handlerKey];

          if (handler.regex.test(fileName)) {
            const handlerResult = await handler.importHandler(() =>
              import(filePath),
            );

            modules[handlerKey].push(handlerResult);

            break;
          }
        }
      });

      folderContentPromises.push(...fileProcessing);
    }

    console.log(modules);

    return modules;
  }

  async createRoutes(webServer: FastifyInstance): Promise<void> {
    const routes = this.routes;

    routes.map(({ options, handler }) =>
      webServer.route({
        ...options,
        handler,
      }),
    );
  }
}
