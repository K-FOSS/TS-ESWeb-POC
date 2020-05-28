// src/Library/Modules/Models/Resolver.ts
import {} from 'type-graphql';
import { ModuleHandler } from './Handler';

export const resolverHandler: ModuleHandler<
  {
    [
      key: string
    ]: typeof import('../../../Modules/Health/HealthCheckResolver').HealthCheckResolver;
  },
  any
> = {
  regex: /.*Resolver\.(ts|js)/g,
  importHandler: async function (importFn) {
    const importedClass = await importFn();

    return Object.values(importedClass);
  },
};
