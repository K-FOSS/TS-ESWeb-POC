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

export function getWorkerData<T extends SubWorkerData>(
  importUrlString: string,
): T {
  const importUrl = new URL(importUrlString);

  // eslint-disable-next-line prefer-const
  let workerData: T = {} as T;
  for (const [searchKey, searchData] of importUrl.searchParams.entries()) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    workerData[searchKey] = searchData;
  }

  return workerData as T;
}
