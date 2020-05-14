// src/Server/Modules/HMR/HMR.ts
import { EventEmitter } from 'events';

export const HMREvents = new EventEmitter();

export function emitFileChanged(filePath: string): void {
  console.log(`File ${filePath} has changed`);

  HMREvents.emit('fileChanged', { filePath });
}
