// src/Library/Modules/moduleMap.ts
import { CompiledModule } from '../../Modules/TypeScript';

export const moduleMap = new Map<string, CompiledModule>();

const relativePathRegex = /^\.{0,2}[/]/;

export function createModuleKey(path: string, specifier = path): string {
  if (relativePathRegex.test(specifier)) return path;

  return specifier;
}
