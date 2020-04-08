// src/@types/react-router-dom.ts
declare module 'react-router-dom' {
  import { PropsWithChildren, ReactElement } from 'react';

  import {
    // components
    MemoryRouter,
    Navigate,
    Outlet,
    Redirect,
    Route,
    Router,
    Routes,
    // hooks
    useBlocker,
    useHref,
    useLocation,
    useMatch,
    useNavigate,
    useOutlet,
    useParams,
    useResolvedLocation,
    useRoutes,
    // utils
    createRoutesFromChildren,
    matchRoutes,
    resolveLocation,
    generatePath,
  } from 'react-router';

  export {
    // components
    MemoryRouter,
    Navigate,
    Outlet,
    Redirect,
    Route,
    Router,
    Routes,
    // hooks
    useBlocker,
    useHref,
    useLocation,
    useMatch,
    useNavigate,
    useOutlet,
    useParams,
    useResolvedLocation,
    useRoutes,
    // utils
    createRoutesFromChildren,
    matchRoutes,
    resolveLocation,
    generatePath,
  };

  interface BaseRouterProps {
    timeout?: number;

    window?: Window;
  }

  /**
   * A <Router> for use in web browsers. Provides the cleanest URLs.
   */
  export function BrowserRouter(
    props: PropsWithChildren<BaseRouterProps>,
  ): ReactElement;

  /**
   * A <Router> for use in web browsers. Stores the location in the hash
   * portion of the URL so it is not sent to the server.
   */
  export function HashRouter(
    props: PropsWithChildren<BaseRouterProps>,
  ): ReactElement;

  interface LinkProps {
    as?: React.ReactElement;
    to: string;
  }

  export function Link(props: PropsWithChildren<LinkProps>): ReactElement;

  /**
   * A convenient wrapper for accessing individual query parameters via the
   * URLSearchParams interface.
   */
  export function useSearchParams<
    Params extends { [K in keyof Params]?: string } = {}
  >(): {
    [p in keyof Params]: keyof Params[p] extends undefined
      ? string | undefined
      : string;
  };
}
