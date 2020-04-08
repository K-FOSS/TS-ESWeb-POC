// src/Web/Providers/Routes/Route.ts
import React, { ReactElement } from 'react';

type RouteModule = { default: () => ReactElement };

export class Route {
  path: string;

  importFn: () => Promise<RouteModule>;

  Component(): ReactElement {
    console.log(`I'm a route component`);

    return <div>Loading...</div>;
  }

  constructor(opts: Partial<Route>) {
    Object.assign(this, opts);
  }
}
