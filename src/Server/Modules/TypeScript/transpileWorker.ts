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
import { WebModule } from '../WebModule';
import { pathToFileURL, fileURLToPath } from 'url';
import { cjsToEsmTransformerFactory } from '@wessberg/cjs-to-esm-transformer';
import { hmrTransformer } from './HMRTransformer/index';

if (!parentPort) throw new Error(`Worker does not have parentPort open`);

const specifierMap = new Map<string, string>();

function sendReady(): void {
  parentPort!.postMessage({
    type: TranspileWorkerMessageType.READY,
  } as TranspileWorkerMessage);
}

async function transpilePath({
  filePath,
  specifier,
}: TranspileQueItem): Promise<void[]> {
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

  const webModulePromises: Promise<void>[] = [];

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
      if (!initialSource) {
        throw new Error('No inital source file. Issue with TS Compile');
      }

      initialModule.code = contents;
      initialModule.filePath = initialSource.fileName;

      webModulePromises.push(
        ...sourceFiles.map(async (sourceFile) => {
          const webModule = new WebModule({
            code: contents,
            filePath: sourceFile.fileName,
            specifier:
              specifierMap.get(sourceFile.fileName) || sourceFile.fileName,
          });

          if (sourceFile.resolvedModules) {
            for (const [moduleName] of sourceFile.resolvedModules) {
              const moduleURLPath = await import.meta.resolve(
                moduleName,
                pathToFileURL(webModule.filePath).href,
              );

              const modulePath = fileURLToPath(moduleURLPath);
              specifierMap.set(modulePath, moduleName);

              parentPort!.postMessage({
                type: TranspileWorkerMessageType.PUSH_DEPENDENCY,
                filePath: modulePath,
                specifier: moduleName,
              } as TranspileWorkerMessage);

              webModule.dependencies.add(modulePath);
            }
          }

          parentPort!.postMessage({
            type: TranspileWorkerMessageType.PUSH_OUTPUT,
            webModule,
          } as TranspileWorkerMessage);
        }),
      );
    }
  };

  const compilerProgram = createProgram({
    rootNames: [filePath],
    options: tsConfig,
    host: compilierHost,
  });
  compilerProgram.emit(undefined, undefined, undefined, undefined, {
    before: [cjsToEsmTransformerFactory(), hmrTransformer(compilerProgram)],
    after: [],
  });

  console.log('Emitted program');

  return Promise.all(webModulePromises);
}

parentPort.on('message', async (parentMessage: TranspileQueItem) => {
  console.log(
    `transpiling path: ${parentMessage.filePath}`,
    parentMessage.specifier,
  );

  await transpilePath(parentMessage);

  // await Promise.all(
  //   webModules.map(async (webModule) => {
  //     const dependencies = await Promise.all(
  //       Array.from(webModule.dependencies).map(
  //         async (dependencySpecifier): Promise<WebModuleDepedency> => {
  //           return {
  //             filePath: dependencySpecifier,
  //             specifier: dependencySpecifier,
  //           };
  //         },
  //       ),
  //     );

  //     parentPort!.postMessage({
  //       type: TranspileWorkerMessageType.PUSH_OUTPUT,
  //       webModule,
  //       dependencies,
  //     } as TranspileWorkerMessage);
  //   }),
  // );

  sendReady();
});

sendReady();
