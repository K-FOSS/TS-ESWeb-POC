// Web/src/Server.tsx
import 'cross-fetch/dist/node-polyfill';
import React from 'react';
import { entrypoint } from '../Server/Modules/WebModule/Entrypoint';
import { renderToString } from 'react-dom/server';
import { DataProvider } from './Providers/DataProvider';
import { processStringChunk, createResponse } from './Library/SSR';
import { StaticRouter } from './StaticRouter';
// import { renderToRootWithID } from '../Server/Library/react-noop-renderer/cjs/react-noop-renderer-persistent.development';
// import FlightClient from 'react-client/cjs/react-client-flight.development';
// import FlightServer from 'react-noop-renderer/flight-server';

const importUrl = new URL(import.meta.url);
const count = importUrl.searchParams.get('count');
if (count === null) throw new Error('Invalid Server Count');

export async function renderWeb(
  url: string,
  importMap: {
    [key: string]: string;
  },
): Promise<string> {
  const fetchResults = await fetch('http://localhost:1231/SSRStream');
  const response = createResponse();

  const fetchResult = await fetchResults.text();

  processStringChunk(response, fetchResult, fetch.length);

  // eslint-disable-next-line prefer-const
  let context = {};

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const importURLString = await import.meta.resolve('./App');

  const importURL = new URL(importURLString);
  importURL.searchParams.set('count', `${count}`);

  const { App } = (await import(importURL.href)) as typeof import('./App');

  const html = `<html>
  <head>
    <title>TS-ESWeb</title>
  </head>
  <body>
    <div id="app">${renderToString(
      <StaticRouter location={url} context={context}>
        <DataProvider response={response}>
          <App />
        </DataProvider>
      </StaticRouter>,
    )}</div>
    <script type="importmap">
    {
      "imports": ${JSON.stringify(importMap)}
    }
    </script>
    <script src="${
      importMap[`/Static/${entrypoint.split('.')[0]}`]
    }" type="module">
    </script>
  </body>
  </html>`;

  return html;
}
