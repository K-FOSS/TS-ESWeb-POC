// src/Web/Components/Nav.test.tsx
import { TestSuite } from '@k-foss/ts-estests';
import { strictEqual } from 'assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Nav as NavMenu } from './Nav';
import { StaticRouter } from '../StaticRouter';

export class NavComponentSuite extends TestSuite {
  public testName = 'Nav Component Suite';

  public async test(): Promise<void> {
    const location = '/';
    const Nav = (
      <StaticRouter location={location}>
        <NavMenu />
      </StaticRouter>
    );

    const navHTML = renderToString(Nav);

    console.log(navHTML);

    strictEqual(
      navHTML,
      '<nav><ul><li><a href="/">Home</a></li><li><a href="/About">About</a></li></ul></nav>',
      'renderToString(<Nav />) renders properly',
    );
  }
}
