// Web/src/Routes/HomeRoute.tsx
import React from 'react';

/**
 * HelloWorld
 * @hmr test
 */
function HomeRoute(): React.ReactElement {
  const handleClick = React.useCallback(() => {
    console.log('HelloWorld1');
  }, []);

  return (
    <>
      <h1>Home Route</h1>
      <button onClick={handleClick}>Click me</button>
    </>
  );
}

export default HomeRoute;
