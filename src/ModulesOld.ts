// src/Modules.ts
import { ResolvedModuleFull, Token, SyntaxKind } from 'typescript';

export interface Dependency {
  modulePath: string;
}

export interface Module {
  specifier: string;
  esCode: string;
  moduleImport?: Token<SyntaxKind.ImportClause>;
  resolvedModule?: ResolvedModuleFull;
  dependencies: string[];
}

interface FullModule extends Omit<Module, 'dependencies'> {
  dependencies: Module[];
}

type ModuleMap = Map<string, Module>;

const moduleMap: ModuleMap = new Map();

function createModuleMapKey(modulePath: string): string {
  console.debug(`Creating module map key for ${modulePath}`);

  return modulePath;
}

export function addModule(modulePath: string, moduleItem: Module): ModuleMap {
  const moduleKey = createModuleMapKey(modulePath);

  const moduleMapItem = moduleMap.get(moduleKey);
  if (moduleMapItem) {
    console.log('Module map item already exits');
  }

  moduleMap.set(moduleKey, moduleItem);

  return moduleMap;
}

export function getModule(modulePath: string): Module | undefined {
  const moduleKey = createModuleMapKey(modulePath);

  return moduleMap.get(moduleKey);
}

export async function getFullModule(modulePath: string): Promise<FullModule> {
  const moduleItem = getModule(modulePath);
  if (!moduleItem) throw new Error('INVALID Module');

  const dependencies = moduleItem.dependencies.map(getModule) as Module[];

  return {
    ...moduleItem,
    dependencies,
  };
}

export async function getImportMap(): Promise<{ [key: string]: string }> {
  let importMap: { [key: string]: string } = {
    '/Static/Web/src/App': '/Static//workspace/Web/src/App.tsx',
  };

  for (const [key, webModule] of moduleMap) {
    importMap[webModule.specifier] = `/Static/${key}`;
  }

  return importMap;
}
