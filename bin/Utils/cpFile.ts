// bin/Utils/cpFile.ts
import { promises as fs } from 'fs';
import { resolve as resolvePath } from 'path';

export async function cpFile(srcPath: string, destPath: string): Promise<void> {
  console.debug(`Copying ${srcPath} to ${destPath}`);

  await fs.copyFile(resolvePath(srcPath), resolvePath(destPath));

  console.debug(`Finished moving ${srcPath}`);
}
