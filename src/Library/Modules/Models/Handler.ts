// src/Library/Modules/Handler.ts
import { handler } from './Route';
import { Modules } from './Module';

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
  routes: handler,
};
