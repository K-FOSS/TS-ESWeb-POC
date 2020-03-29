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
  routes: Promise<Route>[] = [];

  static async loadModules(): Promise<Modules> {
    const modules = new Modules();

    const moduleItems = await fs.readdir(modulesPath, { withFileTypes: true });

    await Promise.all(
      moduleItems.map(async (moduleItem) => {
        if (!moduleItem.isDirectory()) return;

        const modulePath = resolvePath(modulesPath, moduleItem.name);

        const moduleContents = await fs.readdir(modulePath, {
          withFileTypes: true,
        });

        moduleContents.map((moduleContent) => {
          const moduleContentPath = resolvePath(modulePath, moduleContent.name);

          for (const moduleHandlerKey in moduleHandlers) {
            // Needed because TypeScript is typing moduleHandlerKey as string instead of ModuleTypes
            const handlerKey = moduleHandlerKey as ModuleTypes;

            const handler = moduleHandlers[handlerKey];

            if (handler.regex.test(moduleContent.name)) {
              const handlerResult = handler.importHandler(() =>
                import(moduleContentPath),
              );

              modules[handlerKey].push(handlerResult);

              break;
            }
          }
        });
      }),
    );

    return modules;
  }

  async createRoutes(webServer: FastifyInstance): Promise<void> {
    const routes = await Promise.all(this.routes);

    routes.map(({ options, handler }) =>
      webServer.route({
        ...options,
        handler,
      }),
    );
  }
}
