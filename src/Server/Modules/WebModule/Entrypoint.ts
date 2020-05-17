// src/Server/Modules/WebModule/Entrypoint.ts

type NodeENV = 'production' | 'development';

const nodeEnv: NodeENV =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

let entrypoint: string;
switch (nodeEnv) {
  case 'production':
    entrypoint = '/app/dist/Web/Client.js';
    break;
  case 'development':
    entrypoint = '/home/node/workspace/src/Web/Client.tsx';
    break;
}

export { entrypoint };
