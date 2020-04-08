// src/@types/react-router.ts
declare module 'react-router' {
  import { PropsWithChildren, ReactElement, ReactChildren } from 'react';
  import {
    History,
    Location,
    LocationState,
    LocationDescriptor,
  } from 'history';

  type HistoryHref = any;

  type Navigate = any;

  interface MemoryRouterProps {
    initialEntries?: LocationDescriptor[];

    initialIndex?: number;

    timeout?: number;
  }

  /**
   * A <Router> that stores all entries in memory.
   */
  export function MemoryRouter(
    props: PropsWithChildren<MemoryRouterProps>,
  ): ReactElement;

  interface NavigateProps {
    to: string;

    /**
     * @default false
     */
    replace?: boolean;

    state?: object;
  }

  /**
   * Navigate programmatically using a component.
   */
  export function Navigate(props: NavigateProps): ReactElement;

  type OutletProps = {};

  /**
   * Renders the child route's element, if there is one.
   */
  export function Outlet(props: OutletProps): any;

  interface RedirectProps {
    from: string;

    to: LocationDescriptor;
  }

  /**
   * Used in a route config to redirect from one location to another.
   */
  export function Redirect(props: RedirectProps): ReactElement;

  interface RouteProps {
    path?: string;

    element?: React.ReactElement;
  }

  /**
   * Used in a route config to render an element.
   */
  export function Route(props: PropsWithChildren<RouteProps>): ReactElement;

  interface RouterProps {
    history?: History;

    timeout?: number;
  }

  /**
   * The root context provider. There should be only one of these in a given app.
   */
  export function Router(props: PropsWithChildren<RouterProps>): ReactElement;

  interface RoutesProps {
    basename?: string;

    /**
     * @default false
     */
    caseSensitive?: boolean;
  }

  /**
   * A wrapper for useRoutes that treats its children as route and/or redirect
   * objects.
   */
  export function Routes(props: PropsWithChildren<RoutesProps>): ReactElement;

  /**
   * Could be () => ReactElement or ReactELement
   */
  /**
   * Utility function that creates a routes config object from a React
   * "children" object, which is usually either a React element or an
   * array of elements.
   */
  export function createRoutesFromChildren(
    children: React.ReactElement[],
  ): ReactElement[];

  /**
   * Blocks all navigation attempts. This is useful for preventing the page from
   * changing until some condition is met, like saving form data.
   */
  export function useBlocker(): any;

  /**
   * Returns the full href for the given "to" value. This is useful for building
   * custom links that are also accessible and preserve right-click behavior.
   */
  export function useHref(to: string): HistoryHref;

  /**
   * Returns the current location object, which represents the current URL in web
   * browsers.
   *
   * NOTE: If you're using this it may mean you're doing some of your own "routing"
   * in your app, and we'd like to know what your use case is. We may be able to
   * provide something higher-level to better suit your needs.
   */
  export function useLocation<S = LocationState>(): Location<S>;

  /**
   * Returns true if the URL for the given "to" value matches the current URL.
   * This is useful for components that need to know "active" state, e.g.
   * <NavLink>.
   */
  export function useMatch(to: string): boolean;

  /**
   * Returns an imperative method for changing the location. Used by <Link>s, but
   * may also be used by other elements to change the location.
   */
  export function useNavigate(): Navigate;

  /**
   * Returns the outlet element at this level of the route hierarchy. Used to
   * render child routes.
   */
  export function useOutlet(): any;

  /**
   * Returns a hash of the dynamic params that were matched in the route path.
   * This is useful for using ids embedded in the URL to fetch data, but we
   * eventually want to provide something at a higher level for this.
   */
  export function useParams<
    Params extends { [K in keyof Params]?: string } = {}
  >(): {
    [p in keyof Params]: keyof Params[p] extends undefined
      ? string | undefined
      : string;
  };

  /**
   * Returns a fully-resolved location object relative to the current location.
   */
  export function useResolvedLocation(to: string): any;

  interface RouteWithChildren {
    path: string;

    elemement: ReactElement;

    children?: ReactChildren;
  }

  interface RedirectRoute {
    path: string;

    redirectTo: string;
  }

  type Route = RouteWithChildren | RedirectRoute;

  /**
   * Returns the element of the route that matched the current location, prepared
   * with the correct context to render the remainder of the route tree. Route
   * elements in the tree must render an <Outlet> to render their child route's
   * element.
   *
   * Route objects may take one of 2 forms:
   *
   * - { path, element, children }
   * - { path, redirectTo }
   *
   * We should probably write this up in TypeScript instead of in a comment. In
   * fact, what am I even doing here. Nobody is ever going to read this.
   */
  export function useRoutes(
    routes: Route[],
    basename: string,
    caseSensitive: boolean,
  ): React.ReactElement;

  /**
   * Matches the given routes to a location and returns the match data.
   */
  export function matchRoutes(
    routes: any[],
    location: any,
    basename: any,
    caseSensitive: boolean,
  ): null;

  /**
   * Returns a fully resolve location object relative to the given pathname.
   */
  export function resolveLocation(to: string, fromPathname: string): any;

  /**
   * Creates a path with params interpolated.
   */
  export function generatePath(pathname: string, params: object): string;
}
