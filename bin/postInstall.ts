// bin/postInstall.ts
import { processModule } from './Utils/proceseNodeModule';
import { cpFile } from './Utils/cpFile';

const cjsFiles: string[] = [
  'react/cjs/react.development.js',
  'react-dom/cjs/react-dom.development.js',
  'react-dom/cjs/react-dom.production.min.js',
  'react-client/cjs/react-client-flight.development.js',
];

console.log(`Processing module files: `, cjsFiles);

// await Promise.all(cjsFiles.map(processModule));

await Promise.all([
  cpFile('extras/history/package.json', 'node_modules/history/package.json'),
  cpFile(
    'extras/react-router/package.json',
    'node_modules/react-router/package.json',
  ),
  cpFile(
    'extras/react-router-dom/package.json',
    'node_modules/react-router-dom/package.json',
  ),
  cpFile('extras/prop-types/index.js', 'node_modules/prop-types/index.js'),
]);
