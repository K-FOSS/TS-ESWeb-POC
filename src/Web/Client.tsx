// Web/src/Client.tsx
/// <reference types="react-dom/experimental" />
import './Library/Entry';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import 'react-is/cjs/react-is.development';
import { useWebSockets } from './Hooks/useWebsockets';

async function renderClient(): Promise<void> {
  const container = document.getElementById('app')!;

  const root = ReactDOM.unstable_createRoot(container, {
    hydrate: true,
  });

  const ws = useWebSockets('ws://localhost:1231/HMR', {
    onMesssage: async function (event) {
      const msgText = await event.data.text();
      console.log('Recieved Messsage', msgText);
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
