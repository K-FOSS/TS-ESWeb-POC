// src/Server/Modules/TypeScript/WebCompiler.ts
import { TranspileQueItem } from './TranspileQue';
import { fileURLToPath } from 'url';
import { spawnWorker } from '../../Utils/Worker';
import {
  TranspileWorkerMessage,
  TranspileWorkerMessageType,
} from './WorkerMessages';
import { moduleMap } from '../WebModule';
import { cpus } from 'os';

const numCPUs = cpus().length - 1;

const queDB = new Map<string, TranspileQueItem>();

const moduleQue = new Set<string>();
const queHistory = new Map<string, boolean>();

function addModuleQue(queItem: TranspileQueItem): void {
  const filePath = queItem.filePath;

  if (
    queDB.has(filePath) ||
    queHistory.has(filePath) ||
    moduleMap.has(queItem.filePath)
  ) {
    return;
  }

  queDB.set(filePath, queItem);
  moduleQue.add(filePath);
}

function getLatestQueEntry(): TranspileQueItem | undefined {
  const queArray = Array.from(moduleQue);
  return queDB.get(queArray[0]);
}

let idleWorkers = 0;
function postQueEntry(
  queEntry: TranspileQueItem,
  worker: import('worker_threads').Worker,
): void {
  queHistory.set(queEntry.filePath, true);

  moduleQue.delete(queEntry.filePath);

  idleWorkers--;
  return worker.postMessage(queEntry);
}

let firstItem = true;

function sendLatestQueEntry(
  worker: import('worker_threads').Worker,
): void | Promise<number | void> {
  const queEntry = getLatestQueEntry();
  if (queEntry) {
    return postQueEntry(queEntry, worker);
  }

  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (idleWorkers === numCPUs) {
        clearInterval(checkInterval);

        console.log('Killing worker due to all workers being idle');

        return resolve(worker.terminate());
      }

      const workItem = getLatestQueEntry();
      if (workItem) {
        clearInterval(checkInterval);

        resolve(postQueEntry(workItem, worker));
      }
    }, 500);
  });
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

  addModuleQue(entryQueItem);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const workerModulePath = await import.meta.resolve(
    './transpileWorker',
    import.meta.url,
  );

  function spawnTranspileWorker(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transpileWorker = spawnWorker(fileURLToPath(workerModulePath), {});
      idleWorkers++;

      transpileWorker.on('message', (workerMessage: TranspileWorkerMessage) => {
        switch (workerMessage.type) {
          case TranspileWorkerMessageType.READY:
            idleWorkers++;
            sendLatestQueEntry(transpileWorker);
            break;
          case TranspileWorkerMessageType.PUSH_OUTPUT:
            if (firstItem === true) firstItem = false;

            moduleMap.set(
              workerMessage.webModule.filePath,
              workerMessage.webModule,
            );

            workerMessage.dependencies.map(addModuleQue);
            break;
        }
      });

      transpileWorker.on('exit', (code) => {
        resolve();
      });
    });
  }

  return Promise.all(Array(numCPUs).fill(0).map(spawnTranspileWorker));
}
