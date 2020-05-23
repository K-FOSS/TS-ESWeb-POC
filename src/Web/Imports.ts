// src/Web/Imports.ts
export async function importClient(): Promise<typeof import('./Client')> {
  return import('./Client');
}

export async function importApp(): Promise<typeof import('./App')> {
  return import('./App');
}

export async function importEntry(): Promise<typeof import('./Entry')> {
  return import('./Entry');
}

export async function importServiceWorker(): Promise<
  typeof import('./ServiceWorker')
> {
  return import('./ServiceWorker');
}
