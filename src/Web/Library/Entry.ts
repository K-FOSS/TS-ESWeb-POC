// src/Web/Library/Entry.ts
import * as runtime from 'react-refresh/runtime';

declare global {
  interface Window {
    $RefreshReg$(): void;

    $RefreshSig$(): (type: any) => any;
  }
}

if (typeof window !== 'undefined') {
  runtime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {
    console.log('Register refresh');
  };
  window.$RefreshSig$ = () => (type) => type;
}
