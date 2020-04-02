// src/Server/Modules/WebModule/WebModule.ts
export class WebModuleDepedency {
  specifier: string;

  filePath: string;
}

export class WebModule {
  specifier: string;

  filePath: string;

  code: string;

  dependencies = new Set<string>();

  constructor(opts: Partial<WebModule> = {}) {
    Object.assign(this, opts);
  }
}

export const moduleMap = new Map<string, WebModule>();
