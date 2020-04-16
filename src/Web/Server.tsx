// Web/src/Server.tsx
import 'cross-fetch/dist/node-polyfill';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HMRLoader } from '../Utils/hmrLoader';
import { createResponse, processStringChunk } from './Library/SSR';
import { DataProvider } from './Providers/DataProvider';
import { StaticRouter } from './StaticRouter';

export async function renderWeb(
  url: string,
  importMap: {
    [key: string]: string;
  },
): Promise<string> {
  const response = createResponse();

  const fetchResults = await fetch('http://localhost:1231/SSRStream');
  const fetchText = await fetchResults.text();

  processStringChunk(response, fetchText, fetch.length);

  // eslint-disable-next-line prefer-const
  let context = {};

  const { App } = await HMRLoader<typeof import('./App')>(
    './App',
    import.meta.url,
  );

  const appHTML = renderToString(
    <StaticRouter location={url} context={context}>
      <DataProvider response={response}>
        <App />
      </DataProvider>
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
    <script src="/Static/workspace/src/Web/Client.tsx" type="module">
    </script>
  </body>
  </html>`;

  return html;
}
