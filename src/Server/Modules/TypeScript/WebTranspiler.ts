// src/Server/Modules/TypeScript/WebCompiler.ts
import { TranspileQueItem } from './TranspileQue';
import { fileURLToPath } from 'url';
import { spawnWorker } from '../../Utils/Worker';
import {
  TranspileWorkerMessage,
  TranspileWorkerMessageType,
} from './WorkerMessages';
import { cpus } from 'os';
import { moduleMap } from '../WebModule';

const numCPUs = cpus().length;

const moduleQue = new Set<TranspileQueItem>();

function addModuleQue(queItem: TranspileQueItem): void {
  if (moduleMap.has(queItem.filePath) || moduleQue.has(queItem)) return;

  moduleQue.add(queItem);
}

function getLatestQue(): TranspileQueItem {
  const queArray = Array.from(moduleQue);
  const firstItem = queArray[0];

  moduleQue.delete(firstItem);
  return firstItem;
}

/**
 * Starts a Web Transpiler starting with the specified entrypoint
 * @param entryPath Client Entrypoint to App
 */
export async function startWebTranspiler(filePath: string): Promise<void[]> {
  console.debug(`Starting Web Compiler with ${filePath} as the entrypoint`);

  const entryQueItem = new TranspileQueItem({
    filePath,
    specifier: filePath,
  });

  moduleQue.add(entryQueItem);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const workerModulePath = await import.meta.resolve(
    './transpileWorker',
    import.meta.url,
  );

  function spawnTranspileWorker(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transpileWorker = spawnWorker(fileURLToPath(workerModulePath), {});

      transpileWorker.on('message', (workerMessage: TranspileWorkerMessage) => {
        switch (workerMessage.type) {
          case TranspileWorkerMessageType.READY:
            console.log('Worker ready sending next item in que');
            transpileWorker.postMessage(getLatestQue());
            break;
          case TranspileWorkerMessageType.PUSH_OUTPUT:
            moduleMap.set(
              workerMessage.webModule.filePath,
              workerMessage.webModule,
            );
            workerMessage.dependencies.map(addModuleQue);
            break;
        }
      });

      transpileWorker.on('exit', (code) => {
        if (code !== 0) reject(new Error('Worker exited non zero'));

        resolve();
      });
    });
  }

  const workerThreads: Promise<void>[] = [];

  for (let i = 0; i < numCPUs; i++) workerThreads.push(spawnTranspileWorker());

  return Promise.all(workerThreads);
}
