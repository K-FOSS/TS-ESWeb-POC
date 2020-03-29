// src/Library/ModuleLoader.ts
import { promises as fs, Dirent } from 'fs';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import { Route } from '../Routes';
import { RequestHandler } from 'fastify';

type MaybePromise<T> = Promise<T> | T;

type ModuleProessFn = (moduleImport: <T>() => Promise<T>) => MaybePromise<void>;

interface ModuleMatch {
  regex: RegExp;

  processFunction: ModuleProessFn;
}

type ModuleMatcher = { [key in keyof Modules]: ModuleMatch };

const moduleMatchers: ModuleMatcher = {
  routes: {
    regex: /.*Route\.(ts|js)/g,
    processFunction: async (
      importPromise: () => Promise<{ default: RequestHandler; path: string }>,
    ) => {
      const { default: routeFn, path } = await importPromise();
    },
  },
};

const modulesPath = resolvePath(
  fileURLToPath(import.meta.url),
  '../../Modules',
);

export async function loadModules(): Promise<Modules> {
  const moduleItems = await fs.readdir(modulesPath, { withFileTypes: true });

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line prefer-const
  let modules: Modules = { resolvers: [] };

  await Promise.all(
    moduleItems.map(async (moduleItem) => {
      if (!moduleItem.isDirectory()) return;

      const modulePath = resolvePath(modulesPath, moduleItem.name);

      const moduleContents = await fs.readdir(modulePath, {
        withFileTypes: true,
      });

      await Promise.all(
        moduleContents.map(async (moduleContent) => {
          const moduleContentPath = resolvePath(modulePath, moduleContent.name);

          for (const matcherKey in moduleMatchers) {
            if (
              moduleMatchers[matcherKey as keyof Modules].test(
                moduleContent.name,
              )
            ) {
            }
          }

          if (resolverRegex.test(moduleContent.name)) {
            const resolverModule = await import(moduleContentPath);
            for (const [, resolverClass] of Object.entries(resolverModule)) {
              modules.resolvers.push(resolverClass as any);
            }
          }
        }),
      );
    }),
  );

  const gqlResolvers = await Promise.all(modules.resolvers);

  const gqlSchema = await buildGQLSchema(gqlResolvers);

  return { ...modules, gqlSchema };
}
