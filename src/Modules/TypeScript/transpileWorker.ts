// src/Modules/TypeScript/transpileWorker.ts
import { dirname } from 'path';
import { createCompilerHost, createProgram } from 'typescript';
import { parentPort } from 'worker_threads';
import { defaultTSOptions } from './TSConfig';
import { TSSourceFile } from './SourceFile';
import { getWorkerData } from '../../Utils/Worker';
import { pathToFileURL, fileURLToPath } from 'url';
import {
  compilePath,
  CompiledModule,
  ModuleState,
  WorkerModuleAddModuleMessage,
  MessageType,
  WorkerModuleDoneMessage,
  ScriptModule,
} from './compilePath';
import { nanoid } from 'nanoid/non-secure';
import { createModuleKey } from '../../Library/Modules';

if (!parentPort) throw new Error(`Worker does not have parentPort open`);

const workerData = getWorkerData(import.meta.url);

const { entryPath: modulePath, compilerCacheEntries, specifier } = workerData;

const moduleMap = new Map<string, ScriptModule>(
  JSON.parse(compilerCacheEntries),
);

const rootDir = dirname(modulePath);

const compilierHost = createCompilerHost({
  ...defaultTSOptions,
  rootDir,
});

interface Script {
  sourceFile: TSSourceFile;

  code: string;
}

const scripts: Script[] = [];

let entryScript: Script;

// TODO: Move the SourceFile to a forced delacre/d.ts file
// Need to ignore due to forcing our SourceFile Type
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
compilierHost.writeFile = (
  filePath,
  contents,
  writeByteOrderMark,
  onError,
  sourceFiles: TSSourceFile[],
) => {
  if (sourceFiles) {
    entryScript = {
      sourceFile: sourceFiles[0],
      code: contents,
    };
    // Using full function() for a (TODO: INVESTIGATE) perf benefit.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    sourceFiles.map((sourceFile) => {
      scripts.push({
        sourceFile,
        code: contents,
      });
    });
  }
};

const compilerProgram = createProgram({
  rootNames: [modulePath],
  options: defaultTSOptions,
  host: compilierHost,
});
compilerProgram.emit();

const dependencies: string[] = [];

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
if (!entryScript) console.log('No entry script??');

const coreModule: CompiledModule = {
  id: nanoid(),
  state: ModuleState.COMPILED,
  specifier,
  path: modulePath,
  code: entryScript!.code,
  dependencies,
};

await Promise.all(
  scripts.map(async (script) => {
    if (script.sourceFile.resolvedModules) {
      for (const [moduleName] of script.sourceFile.resolvedModules) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const modulePath = await import.meta.resolve(
          moduleName,
          pathToFileURL(script.sourceFile.fileName).href,
        );

        const filePath = fileURLToPath(modulePath);

        await compilePath(filePath, moduleName, moduleMap);
        dependencies.push(createModuleKey(filePath, moduleName));
      }
    }
  }),
);

moduleMap.forEach((value, key) => {
  moduleMap.set(key, value);

  parentPort!.postMessage({
    type: MessageType.addModule,
    data: {
      key,
      module: value,
    },
  } as WorkerModuleAddModuleMessage);
});

parentPort!.postMessage({
  type: MessageType.done,
  data: coreModule,
} as WorkerModuleDoneMessage);