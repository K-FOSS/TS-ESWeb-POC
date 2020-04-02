// src/Modules/TypeScript/compileScript.ts
import { spawnWorker } from '../../Utils/Worker';
import { createModuleKey } from '../../Library/Modules';
import { fileURLToPath } from 'url';

/**
 * Compiles the path
 */
export async function compilePath(
  entryPath: string,
  specifier = entryPath,
  compilerCache = new Map<string, ScriptModule>(),
): Promise<CompiledModule> {
  specifier = createModuleKey(entryPath, specifier);

  if (compilerCache.has(specifier)) {
    const scriptModule = compilerCache.get(specifier);
    if (scriptModule) {
      if ('code' in scriptModule) return scriptModule;

      return scriptModule.compilePromise;
    }
  }

  console.log(`Spawning Transpile Worker for ${entryPath}`);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const workerModulePath = await import.meta.resolve(
    './transpileWorker',
    import.meta.url,
  );

  const transpileWorker = spawnWorker(fileURLToPath(workerModulePath), {
    entryPath,
    specifier,
    compilerCacheEntries: JSON.stringify(Array.from(compilerCache)),
  });

  const compilePromise = new Promise<CompiledModule>((resolve, reject) => {
    transpileWorker.on('message', (msg: WorkerMessage) => {
      if (msg.type === MessageType.addModule) {
        compilerCache.set(msg.data.key, msg.data.module);
      } else if (msg.type === MessageType.done) {
        compilerCache.set(specifier, msg.data);

        resolve(msg.data);
      }
    });

    transpileWorker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }

      console.log(code);
    });
  });

  const scriptModule: ScriptModule = {
    specifier,
    path: entryPath,
    state: ModuleState.COMPILING,
    dependencies: [],
    compilePromise,
  };
  compilerCache.set(specifier, scriptModule);

  return compilePromise;
}
