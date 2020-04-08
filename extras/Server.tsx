// Web/src/Server.tsx
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import FlightClient from 'react-client/cjs/react-client-flight.development';
import FlightServer from 'react-noop-renderer/flight-server';
import { StaticRouter } from './StaticRouter';
import { entrypoint } from '../Server/Modules/WebModule/Entrypoint';
import { HTML } from './HTML';
import * as ServerConfig from './ReactServerConfig';

const importUrl = new URL(import.meta.url);
const count = importUrl.searchParams.get('count');
if (count === null) throw new Error('Invalid Server Count');

export async function renderWeb(
  url: string,
  importMap: {
    [key: string]: string;
  },
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const importURLString = await import.meta.resolve('./App');

  const importURL = new URL(importURLString);
  importURL.searchParams.set('count', `${count}`);

  const { App } = (await import(importURL.href)) as typeof import('./App');

  const context = {};

  function RootModel() {
    return {
      html: <HTML />,
    };
  }

  const stuff = FlightServer.render(<RootModel />);

  const { close, processStringChunk, createResponse } = FlightClient({
    parseModel: (response, json) => JSON.parse(json, response._fromJSON),
  });

  const response = createResponse();
  stuff.map((value) => processStringChunk(response, value));

  const ServerApp = (
    <StaticRouter location={url} context={context}>
      <App response={response} />
    </StaticRouter>
  );

  const appHTML = renderToString(ServerApp);

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
    <script src="${
      importMap[`/Static/${entrypoint.split('.')[0]}`]
    }" type="module">
    </script>
  </body>
  </html>`;

  return html;
}
