// bin/Utils/cpDir.ts
import { promises as fs } from 'fs';
import { resolve as resolvePath } from 'path';
import { cpFile } from './cpFile';

export async function cpDir(srcPath: string, destPath: string): Promise<any> {
  console.debug(`Copying ${srcPath} to ${destPath}`);

  const files = await fs.readdir(srcPath, { withFileTypes: true });

  return Promise.all(
    files.map(async (file) => {
      if (file.isDirectory()) {
        await fs.mkdir(resolvePath(destPath, file.name));

        return cpDir(
          resolvePath(srcPath, file.name),
          resolvePath(destPath, file.name),
        );
      }

      return cpFile(
        resolvePath(srcPath, file.name),
        resolvePath(destPath, file.name),
      );
    }),
  );
}
