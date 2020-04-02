// Web/src/Server.tsx
import React from '@pika/react';
import { renderToString } from 'react-dom/server';

let count = 0;

export async function renderWeb(importMap: {
  [key: string]: string;
}): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const importURLString = await import.meta.resolve('./App.tsx');

  const importURL = new URL(importURLString);
  importURL.searchParams.set('count', `${count++}`);

  const { App } = await import(importURL.href);

  const html = `<html>
  <head>
    <title>TS-ESWeb</title>
  </head>
  <body>
    <div id="app">${renderToString(<App />)}</div>
    <script type="importmap">
    {
      "imports": ${JSON.stringify(importMap)}
    }
    </script>
    <script src="${
      importMap['/Static//workspace/src/Web/Client']
    }" type="module">
    </script>
  </body>
  </html>`;

  return html;
}
