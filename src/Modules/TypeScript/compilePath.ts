// src/Modules/TypeScript/compileScript.ts
import { resolvePath } from '../../Utils/resolvePath';
import { spawnWorker } from '../../Utils/Worker';

type CompilerCache = Map<string, boolean>;

const compilerCache: CompilerCache = new Map();

/**
 * Compiles the path
 */
export async function compilePath(
  entryPath: string,
  specifier = entryPath,
): Promise<any> {
  if (compilerCache.has(entryPath)) {
    return;
  }

  const transpileWorker = spawnWorker(
    resolvePath('./transpileWorker.ts', import.meta.url),
    {
      entryPath,
      specifier,
    },
  );

  return new Promise((resolve, reject) => {
    transpileWorker.on('message', function(msg) {
      console.log('Worker sent message: ', msg);
    });

    transpileWorker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}
