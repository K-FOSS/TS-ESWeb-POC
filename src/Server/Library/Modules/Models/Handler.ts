// src/Library/Modules/Handler.ts
import { Modules } from './Module';
import { resolverHandler } from './Resolver';
import { routeHandler } from './Route';

export type ModuleImport<T> = () => Promise<T>;

export interface ModuleHandler<ImportModule, Module> {
  regex: RegExp;

  importHandler: (moduleImport: ModuleImport<ImportModule>) => Promise<Module>;
}

export type ModuleTypes = {
  [P in keyof InstanceType<typeof Modules>]: InstanceType<
    typeof Modules
  >[P] extends Function
    ? never
    : P;
}[keyof InstanceType<typeof Modules>];

export type ModuleHandlers = {
  [key in ModuleTypes]: ModuleHandler<any, any>;
};

export const moduleHandlers: ModuleHandlers = {
  routes: routeHandler,
  resolvers: resolverHandler,
};
