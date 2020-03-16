// bin/build.ts
import { promises as fs } from 'fs';
import { resolve as resolvePath } from 'path';

async function cpFile(srcPath: string, destPath: string): Promise<void> {
  console.debug(`Copying ${srcPath} to ${destPath}`);

  await fs.copyFile(resolvePath(srcPath), resolvePath(destPath));

  console.debug(`Finished moving ${srcPath}`);
}

console.log('Building Project');

await Promise.all([
  cpFile(
    'extras/ReactPKG.json',
    'Web/node_modules/@pika/react-dom/package.json',
  ),
  cpFile(
    'extras/ReactDOMPkg.json',
    'Web/node_modules/@pika/react-dom/package.json',
  ),
]);
