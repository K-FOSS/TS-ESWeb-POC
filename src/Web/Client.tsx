// Web/src/Client.tsx
/// <reference types="react-dom/experimental" />
import * as React from 'react';
import { createRoot } from 'react-dom';
import { App } from './App';
import { createFromFetch } from './Library/ReactClient';
import { DataProvider } from './Providers/DataProvider';
import { BrowserRouter } from 'react-router-dom';

async function renderClient(): Promise<void> {
  const response = createFromFetch(fetch('/SSRStream'));

  const container = document.getElementById('app')!;
  const root = createRoot(container, {
    hydrate: true,
  });

  root.render(
    <BrowserRouter>
      <DataProvider response={response}>
        <App />
      </DataProvider>
    </BrowserRouter>,
  );
}

console.log('Starting render client');
renderClient();
