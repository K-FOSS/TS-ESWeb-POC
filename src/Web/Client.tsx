// Web/src/Client.tsx
/// <reference types="react-dom/experimental" />
import './Library/Entry';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as runtime from 'react-refresh/runtime';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import 'react-is/cjs/react-is.development';
import './Library/Helper';
import { useWebSockets } from './Hooks/useWebsockets';

async function renderClient(): Promise<void> {
  const container = document.getElementById('app')!;

  const root = ReactDOM.unstable_createRoot(container, {
    hydrate: true,
  });

  const ws = useWebSockets('ws://localhost:1231/HMR', {
    onMesssage: async function (event) {
      console.log('Recieved Messsage', event.data);
      console.log(runtime);
      runtime.performReactRefresh();
      window.location.reload();
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
