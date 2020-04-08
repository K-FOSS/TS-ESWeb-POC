// Web/src/Routes/HomeRoute.tsx
import * as React from 'react';
import { useRoot } from '../Providers/DataProvider.tsx';

export default function HomeRoute(): React.ReactElement {
  const { content } = useRoot();

  const handleClick = React.useCallback(() => {
    console.log('HelloWorld');
  }, []);

  return (
    <>
      <h1>Home Route</h1>
      <button onClick={handleClick}>Click me</button>
      {content}
    </>
  );
}
