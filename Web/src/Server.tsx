// Web/src/Server.tsx
import React from '@pika/react';
import { renderToString } from 'react-dom/server';

export async function renderWeb(importMap: {
  [key: string]: string;
}): Promise<string> {
  const { App } = await import('./App');

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
    <script src="/Static/Web/src/Client.tsx" type="module">
    </script>
  </body>
  </html>`;

  return html;
}
