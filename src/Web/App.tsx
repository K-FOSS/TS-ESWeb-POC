// Web/src/App.tsx
import React from 'react';
import HomeRoute from './Routes/HomeRoute';

export function App(): React.ReactElement {
  return (
    <>
      <h1 onClick={() => console.log('HelloWorld')}>App V3</h1>
      <HomeRoute />
    </>
  );
}
