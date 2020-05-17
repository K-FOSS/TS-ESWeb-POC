// bin/build.ts
import { promises as fs } from 'fs';
import { resolve as resolvePath, dirname } from 'path';
import { moduleMap, WebModule } from '../src/Server/Modules/WebModule';
import { startWebTranspiler } from '../src/Server/Modules/TypeScript/TSTranspiler';
import { buildPath } from './Utils/TypeScript/buildPath';

const distDir = resolvePath('dist');
const mapPath = resolvePath(distDir, 'moduleMap.json');

console.info('Removing dist dir');
await fs.rmdir(distDir, { recursive: true });

console.info('Creating dist dir');
await fs.mkdir(distDir);

await buildPath('./');

console.log('Building Project');
await startWebTranspiler('/workspace/src/Web/Client.tsx');
console.log('Build project');

type Module = Pick<WebModule, 'dependencies' | 'filePath' | 'specifier'>;

const localMap = new Map<string, Module>();

for (const [moduleSpecifier, clientModule] of moduleMap) {
  const outputDir = `${distDir}${dirname(moduleSpecifier)}`;

  const outputPath = `${distDir}${moduleSpecifier}`;

  localMap.set(moduleSpecifier, {
    dependencies: Array.from(clientModule.dependencies),
    filePath: clientModule.filePath,
    specifier: clientModule.specifier,
  });

  console.log(`Creating directory ${outputDir}`);
  await fs.mkdir(outputDir, { recursive: true });

  await Promise.all([fs.writeFile(outputPath, clientModule.code)]);
}

await fs.writeFile(mapPath, JSON.stringify(Array.from(localMap)));
