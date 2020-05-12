// Web/src/Server.tsx
import 'cross-fetch/dist/node-polyfill';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HMRLoader } from '../Utils/hmrLoader';
import { StaticRouter } from './StaticRouter';

export async function renderWeb(
  url: string,
  importMap: {
    [key: string]: string;
  },
): Promise<string> {
  // eslint-disable-next-line prefer-const
  let context = {};

  const { App } = await HMRLoader<typeof import('./App')>(
    './App',
    import.meta.url,
  );

  const appHTML = renderToString(
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>,
  );

  const html = `<html>
  <head>
    <title>TS-ESWeb</title>
  </head>
  <body>
    <div id="app">${appHTML}</div>
    <script type="importmap">
    {
      "imports": ${JSON.stringify(importMap)}
    }
    </script>
    <script src="/Static/workspace/src/Web/Client.tsx" type="module"></script>
  </body>
  </html>`;

  return html;
}
