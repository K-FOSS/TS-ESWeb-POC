// src/Web/Routes/HomeRoute/HomeRoute.test.tsx
import { TestSuite } from '@k-foss/ts-estests';
import { strictEqual } from 'assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import HomeRoute from './index';

export class HomeRouteSuite extends TestSuite {
  public testName = 'HomeRoute Suite';

  public async test(): Promise<void> {
    strictEqual(
      renderToString(<HomeRoute />),
      '<h1>Home Route</h1><p>Current state: <!-- -->False</p><button>Click me</button>',
      'render Home Route',
    );
  }
}
