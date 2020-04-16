// src/Server/Modules/WebModule/WebModule.ts
import { resolve as resolvePath } from 'path';

const distDir = resolvePath('dist');
const mapPath = resolvePath(distDir, 'moduleMap.json');

export class WebModuleDepedency {
  specifier: string;

  filePath: string;
}

export class WebModule {
  specifier: string;

  filePath: string;

  code: string;

  dependencies = new Set();

  constructor(opts: Partial<WebModule> = {}) {
    Object.assign(this, opts);
  }
}

let mapData: any;

if (process.env.NODE_ENV === 'production') {
  try {
    const { promises: fs } = await import('fs');

    const mapFile = await fs.readFile(mapPath);

    mapData = JSON.parse(mapFile.toString());
  } catch {}
}

export const moduleMap = new Map<string, WebModule>(mapData);
