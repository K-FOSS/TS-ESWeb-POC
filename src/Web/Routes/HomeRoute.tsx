// Web/src/Routes/HomeRoute.tsx
import React from 'react';
import Counter from '../Components/Counter';

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
      <h1>Home Router</h1>
      <p>Current state: {value ? 'True' : 'False'}</p>
      <button onClick={handleClick}>Click me</button>
      <Counter />
    </>
  );
}

export default HomeRoute;
