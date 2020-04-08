// src/Server/Utils/Workers/transpileWorker.ts
import { parentPort } from 'worker_threads';
import { dirname } from 'path';
import {
  TranspileWorkerMessageType,
  TranspileWorkerMessage,
} from './WorkerMessages';
import { TranspileQueItem } from './TranspileQue';
import { createCompilerHost, createProgram } from 'typescript';
import { getTSConfig } from './TSConfig';
import { TSSourceFile } from './SourceFile';
import { WebModule, WebModuleDepedency } from '../WebModule';
import { pathToFileURL, fileURLToPath } from 'url';
import { cjsToEsm } from '@wessberg/cjs-to-esm-transformer';

if (!parentPort) throw new Error(`Worker does not have parentPort open`);

function sendReady(): void {
  parentPort!.postMessage({
    type: TranspileWorkerMessageType.READY,
  } as TranspileWorkerMessage);
}

function sendPushOutput(
  webModule: WebModule,
  dependencies: WebModuleDepedency[],
): void {
  parentPort!.postMessage({
    type: TranspileWorkerMessageType.PUSH_OUTPUT,
    webModule,
    dependencies,
  } as TranspileWorkerMessage);

  sendReady();
}

function transpilePath({ filePath, specifier }: TranspileQueItem): WebModule {
  const rootDir = dirname(filePath);

  const tsConfig = getTSConfig(filePath);

  const compilierHost = createCompilerHost({
    ...tsConfig,
    rootDir,
  });

  const initialModule = new WebModule({
    specifier,
    filePath,
  });

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
      const initialSource = sourceFiles[0];
      if (!initialSource)
        throw new Error('No inital source file. Issue with TS Compile');

      initialModule.code = contents;
      initialModule.filePath = initialSource.fileName;

      sourceFiles.map((sourceFile) => {
        if (!sourceFile.resolvedModules) {
          return;
        }
        for (const [moduleName] of sourceFile.resolvedModules) {
          initialModule.dependencies.add(moduleName);
        }
      });
    }
  };

  const compilerProgram = createProgram({
    rootNames: [filePath],
    options: tsConfig,
    host: compilierHost,
  });
  compilerProgram.emit(undefined, undefined, undefined, undefined, cjsToEsm());

  return initialModule;
}

parentPort.on('message', async (parentMessage: TranspileQueItem) => {
  const webModule = await transpilePath(parentMessage);
  const dependencies = await Promise.all(
    Array.from(webModule.dependencies).map(
      async (dependencySpecifier): Promise<WebModuleDepedency> => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const modulePath = await import.meta.resolve(
          dependencySpecifier,
          pathToFileURL(webModule.filePath).href,
        );
        return {
          filePath: fileURLToPath(modulePath),
          specifier: dependencySpecifier,
        };
      },
    ),
  );

  return sendPushOutput(webModule, dependencies);
});

sendReady();
