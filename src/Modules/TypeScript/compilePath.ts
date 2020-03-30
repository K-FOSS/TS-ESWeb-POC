// src/Modules/TypeScript/compileScript.ts
import { resolvePath } from '../../Utils/resolvePath';
import { spawnWorker } from '../../Utils/Worker';
import { createModuleKey } from '../../Library/Modules';

export enum ModuleState {
  COMPILING,
  COMPILED,
}

interface BaseModule {
  specifier: string;
  path: string;

  dependencies: string[];
}

interface CompilingModule extends BaseModule {
  state: ModuleState.COMPILING;

  compilePromise: Promise<CompiledModule>;
}

export interface CompiledModule extends BaseModule {
  id: string;

  state: ModuleState.COMPILED;

  code: string;
}

export type ScriptModule = CompiledModule | CompilingModule;

export enum MessageType {
  'addModule',
  'done',
}

export interface WorkerModuleAddModuleMessage {
  type: MessageType.addModule;

  data: {
    key: string;

    module: ScriptModule;
  };
}

export interface WorkerModuleDoneMessage {
  type: MessageType.done;

  data: CompiledModule;
}

type WorkerMessage = WorkerModuleAddModuleMessage | WorkerModuleDoneMessage;

/**
 * Compiles the path
 */
export async function compilePath(
  entryPath: string,
  specifier = entryPath,
  compilerCache = new Map<string, ScriptModule>(),
): Promise<CompiledModule> {
  specifier = createModuleKey(entryPath, specifier);

  if (compilerCache.has(entryPath)) {
    const scriptModule = compilerCache.get(specifier);
    if (scriptModule) {
      if ('code' in scriptModule) return scriptModule;

      return scriptModule.compilePromise;
    }
  }

  console.log(`Spawning Transpile Worker for ${entryPath}`);

  const transpileWorker = spawnWorker(
    resolvePath('./transpileWorker.ts', import.meta.url),
    {
      entryPath,
      specifier,
      compilerCacheEntries: JSON.stringify(Array.from(compilerCache)),
    },
  );

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
