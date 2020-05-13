// Web/src/Client.tsx
/// <reference types="react-dom/experimental" />
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import 'react-is/cjs/react-is.development';

async function renderClient(): Promise<void> {
  const container = document.getElementById('app')!;

  const root = ReactDOM.unstable_createRoot(container, {
    hydrate: true,
  });

  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}

console.log('Starting render client');
renderClient();
