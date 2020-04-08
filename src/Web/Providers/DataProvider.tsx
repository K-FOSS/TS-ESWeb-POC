// src/Web/Providers/DataProvider.tsx
import * as React from 'react';
import type { PropsWithChildren } from 'react';

interface Response<T> {
  readRoot(): Partial<T>;
}

interface Root {
  content: React.ReactElement[];
}

interface Context {
  response: Response<Root>;
}

const Context = React.createContext<Context>({
  response: {
    readRoot: () => ({}),
  },
});

export function DataProvider({
  children,
  response,
}: PropsWithChildren<Context>): React.ReactElement {
  return <Context.Provider value={{ response }}>{children}</Context.Provider>;
}

export function useRoot(): Partial<Root> {
  const { response } = React.useContext(Context);

  return response.readRoot();
}
