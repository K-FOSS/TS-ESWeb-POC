// src/Web/Routes/HomeRoute/index.tsx
import React from 'react';

/**
 * HelloWorld
 * @hmr test
 */
function HomeRoute(): React.ReactElement {
  const [value, setValue] = React.useState(false);

  const handleClick = React.useCallback(
    () => setValue((currentState) => !currentState),
    [setValue],
  );

  return (
    <>
      <h1>Home Route</h1>
      <p>Current state: {value ? 'True' : 'False'}</p>
      <button onClick={handleClick}>Click me</button>
    </>
  );
}

export default HomeRoute;
