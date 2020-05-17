// Web/src/Routes/HomeRoute.tsx
import React from 'react';

/**
 * HelloWorld
 * @hmr test
 */
function HomeRoute(): React.ReactElement {
  const handleClick = React.useCallback(() => {
    console.log(window, document);
  }, []);

  return (
    <>
      <h1>Home Route HelloWorld2</h1>
      <button onClick={handleClick}>Click me</button>
    </>
  );
}

export default HomeRoute;
