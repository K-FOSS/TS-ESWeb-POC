// Web/src/Client.tsx
/// <reference types="react-dom/experimental" />
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as runtime from 'react-refresh/runtime';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { useWebSockets } from './Hooks/useWebsockets';
import { registerExportsForReactRefresh } from './Library/Helper';

let count = 0;

async function renderClient(): Promise<void> {
  const container = document.getElementById('app')!;

  const root = ReactDOM.unstable_createRoot(container, {
    hydrate: true,
  });

  useWebSockets('ws://localhost:1231/HMR', {
    onMesssage: async function (msg) {
      const filePath = msg.data;
      const fileData = await import(`/Static/${filePath}?count=${count++}`);

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
