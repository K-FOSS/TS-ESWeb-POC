// src/Server/Modules/TypeScript/WorkerController.ts
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { BaseEventEmitter } from '../../Utils/Events';
import { spawnWorker } from '../../Utils/Worker';
import { HMR } from '../HMR';
import { moduleMap } from '../WebModule';
import { TranspileQueItem } from './TranspileQue';
import {
  TranspileWorkerMessage,
  TranspileWorkerMessageType,
} from './WorkerMessages';

interface WorkerControllerEventMap {
  fileTranspiled: any;
  done: boolean;
}

interface WorkerThread {
  workerThread: Worker;

  ready: boolean;

  online: boolean;
}

interface SpawnWorkersOptions {
  cache: boolean;
}

export class WorkerController extends BaseEventEmitter<
  WorkerControllerEventMap
> {
  public workers: WorkerThread[] = [];
  public started = false;
  public cache = true;

  get threads() {
    return this.workers.length;
  }

  get lazyWorkers() {
    return this.workers.filter(
      ({ ready, online }) => ready === true && online === true,
    );
  }

  get lazyThreads() {
    return this.lazyWorkers.length;
  }

  private pathHistory = new Set<string>();
  private jobQue = new Set<TranspileQueItem>();

  static async spawnWorkers(
    threadCount: number,
    { cache } = { cache: true } as SpawnWorkersOptions,
  ): Promise<WorkerController> {
    const controller = new WorkerController();
    controller.cache = cache;

    const workerModulePath = await import.meta.resolve(
      './transpileWorker',
      import.meta.url,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const workerThread of Array(threadCount).fill(0)) {
      const worker = spawnWorker(fileURLToPath(workerModulePath), {});
      controller.workers.push({
        workerThread: worker,
        online: false,
        ready: false,
      });

      worker.on('online', () => {
        const workerThread = controller.workers.find(
          ({ workerThread }) => workerThread.threadId === worker.threadId,
        )!;
        workerThread.ready = true;
        workerThread.online = true;
      });

      worker.on('message', controller.handleWorkerMessage(worker));

      controller.on('done', () => {
        if (controller.cache) worker.terminate();
      });
    }

    return controller;
  }

  addJob(queItem: TranspileQueItem): void {
    if (this.pathHistory.has(queItem.filePath) === true) return;
    else if (this.jobQue.has(queItem)) return;
    else if (moduleMap.has(queItem.filePath) === true) return;

    this.pathHistory.add(queItem.filePath);
    this.jobQue.add(queItem);
  }

  handleWorkerMessage(worker: Worker): (msg: TranspileWorkerMessage) => void {
    return (msg) => {
      switch (msg.type) {
        case TranspileWorkerMessageType.PUSH_DEPENDENCY:
          if (this.started === false) this.started = true;
          this.addJob(msg);
          break;
        case TranspileWorkerMessageType.PUSH_HMR:
          HMR.watchedFiles.add(msg.filePath);
          break;
        case TranspileWorkerMessageType.PUSH_OUTPUT:
          moduleMap.set(msg.webModule.filePath, msg.webModule);
          break;
        case TranspileWorkerMessageType.READY:
          this.workers.find(
            ({ workerThread }) => workerThread.threadId === worker.threadId,
          )!.ready = true;
          break;
        default:
          console.log('Unknown message: ', msg);
      }
    };
  }

  removeJob(job: TranspileQueItem): void {
    this.jobQue.delete(job);
  }

  forceAddJob(filePath: string): Promise<boolean> {
    this.jobQue.add(
      new TranspileQueItem({
        filePath,
        specifier: filePath,
      }),
    );

    return new Promise((resolve) => {
      this.on('done', resolve);
    });
  }

  startPolling(): void {
    const poll = setInterval(() => {
      const jobQueArray = Array.from(this.jobQue);

      if (this.lazyThreads > 0 && jobQueArray.length > 0) {
        const lazyWorker = this.lazyWorkers.pop()!;
        const job = jobQueArray.pop()!;

        lazyWorker.workerThread.postMessage(job);
        this.removeJob(job);
        this.workers.find(
          ({ workerThread }) =>
            workerThread.threadId === lazyWorker.workerThread.threadId,
        )!.ready = false;
      }

      if (this.lazyThreads === this.threads && this.started === true) {
        this.emit('done', true);

        if (this.cache) clearInterval(poll);
      }
    }, 500);
  }

  /**
   * Starts transpiling a module graph starting with the entry
   * @param entrypoint Path to entryfile
   */
  async start(filePath: string): Promise<boolean> {
    this.addJob(
      new TranspileQueItem({
        filePath,
        specifier: filePath,
      }),
    );

    this.startPolling();

    return new Promise((resolve, reject) => {
      if (this.cache) this.on('done', resolve);
    });
  }
}
