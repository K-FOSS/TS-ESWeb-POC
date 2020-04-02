// src/Server/Utils/Workers/transpileWorker.ts
import { parentPort } from 'worker_threads';
import { dirname } from 'path';
import {
  TranspileWorkerMessageType,
  TranspileWorkerMessage,
} from './WorkerMessages';
import { TranspileQueItem } from './TranspileQue';
import { createCompilerHost, createProgram } from 'typescript';
import { defaultTSOptions } from './TSConfig';
import { TSSourceFile } from './SourceFile';
import { WebModule, WebModuleDepedency } from '../WebModule';
import { pathToFileURL, fileURLToPath } from 'url';

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

  const compilierHost = createCompilerHost({
    ...defaultTSOptions,
    rootDir,
  });

  const initialModule = new WebModule({
    specifier,
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
    options: defaultTSOptions,
    host: compilierHost,
  });
  compilerProgram.emit();

  return initialModule;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let emptyCount = 0;

parentPort.on(
  'message',
  async (parentMessage: TranspileQueItem | undefined) => {
    if (!parentMessage) {
      emptyCount = emptyCount + 1;
      console.log('Recieved empty message.', emptyCount);
      if (emptyCount === 20) {
        console.log('recieved 5 empty messages, assuming done');
        process.exit(0);
      }

      await sleep(2500);
      sendReady();
      return;
    } else emptyCount = 0;

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
  },
);

sendReady();
