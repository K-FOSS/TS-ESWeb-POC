// tests/nav.test.ts
import { TestSuite } from '@k-foss/ts-estests/dist/index';
import { strictEqual } from 'assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import HomeRoute from './index';

export class HomeRouteTest extends TestSuite {
  public testName = 'HomeRoute';

  public async test(): Promise<void> {
    console.log();

    strictEqual(
      renderToString(<HomeRoute />),
      '<h1>Home Route</h1><p>Current state: <!-- -->False</p><button>Click me</button>',
      'render Home Route',
    );
  }
}
