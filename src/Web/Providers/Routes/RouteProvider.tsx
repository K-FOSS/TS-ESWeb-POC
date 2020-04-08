// src/Web/Providers/RouteProvider.tsx
import React, { PropsWithChildren } from 'react';
import { RouteContext } from './RouteContext';

export function RouteProvider({
  children,
}: PropsWithChildren<Pick<RouteContext, 'routes'>>): React.ReactElement {
  return (
    <RouteContext.Provider value={{ routes: [] }}>
      {children}
    </RouteContext.Provider>
  );
}
