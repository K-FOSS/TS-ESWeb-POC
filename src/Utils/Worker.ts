// src/Utils/Worker.ts
import { Worker } from 'worker_threads';
import { resolvePath } from './resolvePath';
import { pathToFileURL } from 'url';

type SubWorkerData = { [key: string]: any };

export function spawnWorker(path: string, workerData: SubWorkerData): Worker {
  const transpileURL = pathToFileURL(path);

  for (const dataKey of Object.keys(workerData)) {
    transpileURL.searchParams.set(dataKey, workerData[dataKey]);
  }

  const transpileWorker = new Worker(
    resolvePath('./workerEntry.js', import.meta.url),
    {
      workerData: {
        workerPath: transpileURL.href,
      },
    },
  );

  return transpileWorker;
}

export function getWorkerData(importUrlString: string): SubWorkerData {
  const importUrl = new URL(importUrlString);

  let workerData: SubWorkerData = {};
  for (const [searchKey, searchData] of importUrl.searchParams.entries()) {
    workerData[searchKey] = searchData;
  }

  return workerData;
}
