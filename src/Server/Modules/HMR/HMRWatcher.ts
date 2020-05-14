// src/Server/Modules/HMR/HMRWatcher.ts
import { watch } from 'fs';
import { emitFileChanged } from './HMR';

export async function startHMRWatcher(filePath: string): Promise<void> {
  const watcher = watch(filePath);

  async function fileChanged(
    eventType: string,
    fileName: string | Buffer,
  ): Promise<void> {
    console.log('File changed', eventType, fileName);

    emitFileChanged(fileName.toString());
  }

  watcher.on('change', fileChanged);
}
