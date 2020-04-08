// src/Web/HTML.tsx
import * as React from 'react';

function Text({ children }: React.PropsWithChildren<{}>) {
  return <span>{children}</span>;
}

export function HTML(): React.ReactElement {
  return (
    <div>
      <Text>hello</Text>
      <Text>world</Text>
    </div>
  );
}
