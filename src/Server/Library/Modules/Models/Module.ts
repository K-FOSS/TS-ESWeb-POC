// src/Library/Modules/Models/Module.ts
import { promises as fs } from 'fs';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import { Route } from './Route';
import { FastifyInstance } from 'fastify';
import { moduleHandlers, ModuleTypes } from './Handler';
import { buildSchema, NonEmptyArray } from 'type-graphql';

const modulesPath = resolvePath(
  fileURLToPath(import.meta.url),
  '../../../../Modules',
);

/**
 * This is a controller used to provide dynamiclly loaded class based "stuff"
 */
export class Modules {
  public routes: Route[] = [];

  public resolvers: Function[] = [];

  /**
   * Load all the module types from [`./Models`](./Models)
   */
  static async loadModules(): Promise<Modules> {
    const modules = new Modules();

    const moduleEntries = await fs.readdir(modulesPath, {
      withFileTypes: true,
    });

    for (const moduleEntry of moduleEntries) {
      if (!moduleEntry.isDirectory()) continue;

      const folderPath = resolvePath(modulesPath, moduleEntry.name);
      const folderContents = await fs.readdir(folderPath);

      for (const fileName of folderContents) {
        const filePath = resolvePath(folderPath, fileName);

        // await Promise.all(
        //   Object.entries(moduleHandlers).map(([moduleHandlerKey, handler]) => {
        //     if (fileName.match(handler.regex)) {

        //     }
        //     console.log(
        //       fileName,
        //       ,
        //       moduleHandlerKey,
        //       handler.regex.test(fileName),
        //       handler.regex,
        //     );
        //   }),
        // );

        for (const [moduleHandlerKey, handler] of Object.entries(
          moduleHandlers,
        )) {
          if (fileName.match(handler.regex)) {
            const handlerResult = await handler.importHandler(() =>
              import(filePath),
            );

            modules[moduleHandlerKey as ModuleTypes].push(handlerResult);

            break;
          }
        }
      }
    }

    return modules;
  }

  async createRoutes(webServer: FastifyInstance): Promise<void> {
    this.routes.map(({ options, handler }) =>
      webServer.route({
        ...options,
        handler,
      }),
    );
  }

  async buildResovlerSchema(): Promise<any> {
    return buildSchema({
      resolvers: (this.resolvers.flat(5) as any) as NonEmptyArray<Function>,
    });
  }
}
