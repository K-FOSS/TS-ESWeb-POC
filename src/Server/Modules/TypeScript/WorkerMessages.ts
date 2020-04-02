// src/Server/Modules/TypeScript/WorkerMessages.ts

import { WebModule, WebModuleDepedency } from '../WebModule';

export enum TranspileWorkerMessageType {
  READY,
  PUSH_OUTPUT,
}

interface TranspileWorkerPushOutputMessage {
  type: TranspileWorkerMessageType.PUSH_OUTPUT;

  webModule: WebModule;

  dependencies: WebModuleDepedency[];
}

interface TranspileWorkerReadyMessage {
  type: TranspileWorkerMessageType.READY;
}

export type TranspileWorkerMessage =
  | TranspileWorkerPushOutputMessage
  | TranspileWorkerReadyMessage;
