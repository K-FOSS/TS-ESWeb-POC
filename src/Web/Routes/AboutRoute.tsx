// src/Web/Routes/AboutRoute.tsx
import React from 'react';

/**
 * @hmr true
 */
export default function AboutRoute(): React.ReactElement {
  const handleClick = React.useCallback(() => {
    console.log('About Page');
  }, []);

  return (
    <>
      <h1>About Route</h1>
      <button onClick={handleClick}>Click me</button>
    </>
  );
}
