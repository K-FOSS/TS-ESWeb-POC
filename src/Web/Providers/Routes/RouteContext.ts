// src/Web/Providers/Routes/RouteContext.ts
import { createContext } from 'react';
import { Route } from './Route';

export interface RouteContext {
  readonly routes: Route[];

  currentRoute?: Route;
}

export const RouteContext = createContext<RouteContext>({
  routes: [],
});
