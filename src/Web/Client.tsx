// Web/src/Client.tsx
/// <reference types="react-dom/experimental" />
import './Library/Entry';
import React from 'react';
import ReactDOM from 'react-dom';
import * as runtime from 'react-refresh/runtime';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { useWebSockets } from './Hooks/useWebsockets';
import { registerExportsForReactRefresh } from './Library/Helper';

/**
 * Count needed so we can request an import with a new param each HMR
 */
let count = 0;

/**
 * Render the Client Side
 */
async function renderClient(): Promise<void> {
  const container = document.getElementById('app')!;

  const root = ReactDOM.unstable_createRoot(container, {
    hydrate: true,
  });

  useWebSockets('ws://localhost:1231/HMR', {
    onMesssage: async function (msg) {
      const filePath = msg.data;
      const fileData = await import(
        // eslint-disable-next-line comma-dangle
        `/Static/import?specifier=${filePath}&count=${count++}`
      );

      registerExportsForReactRefresh(fileData, filePath);

      runtime.performReactRefresh();
    },
  });

  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}

console.log('Starting render client');
renderClient();
