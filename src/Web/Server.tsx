// Web/src/Server.tsx
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HMRLoader } from '../Utils/hmrLoader';
import { StaticRouter } from './StaticRouter';

export async function renderWeb(url: string): Promise<string> {
  const { App } = await HMRLoader<typeof import('./App')>(
    './App',
    import.meta.url,
  );

  const appHTML = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );

  const html = `<html>
  <head>
    <title>TS-ESWeb</title>
    <link rel="manifest" href="/WebManifest.json">
  </head>
  <body>
    <div id="app">${appHTML}</div>
    <script type="module">
    import { Workbox } from 'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-window.prod.mjs';

    const wb = new Workbox('/Static//workspace/src/Web/ServiceWorker.ts', {
      scope: '/'
    });

    wb.addEventListener('activated', async (event) => {
      // 'event.isUpdate' will be true if another version of the service
      // worker was controlling the page when this version was registered.
      if (!event.isUpdate) {
        // If your service worker is configured to precache assets, those
        // assets should all be available now.
        // So send a message telling the service worker to claim the clients
        // This is the first install, so the functionality of the app
        // should meet the functionality of the service worker!
        wb.messageSW({ type: 'CLIENTS_CLAIM' });
      }
    });

    const channel = new BroadcastChannel('sw-messages');
    channel.addEventListener('message', event => {
      if (event.data.type === 'READY') {
        import('/Static//workspace/src/Web/Entry.ts')
      }
    });

    wb.register();

    window.wb = wb;


    wb.active.then(() => import('/Static//workspace/src/Web/Entry.ts'));
    </script>
  </body>
  </html>`;

  return html;
}
