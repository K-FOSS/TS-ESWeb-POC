// Web/src/Client.tsx
import React from '@pika/react';
import { hydrate } from '@pika/react-dom';
import { App } from './App';

async function renderClient(): Promise<void> {
  console.log('Rendering client.tsx');

  hydrate(<App />, document.getElementById('app'));
}

console.log('Starting render client');
renderClient();
