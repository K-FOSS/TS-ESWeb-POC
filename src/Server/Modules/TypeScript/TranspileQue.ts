// src/Server/Modules/TypeScript/TranspileQue.ts

export class TranspileQueItem {
  filePath: string;

  specifier: string;

  constructor(opts: Partial<TranspileQueItem> = {}) {
    Object.assign(this, opts);
  }
}
