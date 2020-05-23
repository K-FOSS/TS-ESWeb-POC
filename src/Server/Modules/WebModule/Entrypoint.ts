// src/Server/Modules/WebModule/Entrypoint.ts
import { resolveWebPath } from '../../Utils/resolveWebPath';

type NodeENV = 'production' | 'development';

const nodeEnv: NodeENV =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

let entrypoint: string;
switch (nodeEnv) {
  case 'production':
    entrypoint = '/app/dist/Web/Client.js';
    break;
  case 'development':
    entrypoint = resolveWebPath('Imports.ts');
    break;
}

export { entrypoint };
