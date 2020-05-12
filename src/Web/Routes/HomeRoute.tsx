// Web/src/Routes/HomeRoute.tsx
import React from 'react';

export default function HomeRoute(): React.ReactElement {
  const handleClick = React.useCallback(() => {
    console.log('HelloWorld');
  }, []);

  return (
    <>
      <h1>Home Route</h1>
      <button onClick={handleClick}>Click me</button>
    </>
  );
}
