// src/Server/Utils/resolveWebPath.ts
import { resolve } from 'path';
import { resolvePath } from './resolvePath';

export const webPath = resolvePath('../../Web', import.meta.url);

export function resolveWebPath(webPath: string): string {
  return resolve(resolvePath('../../Web', import.meta.url), webPath);
}
