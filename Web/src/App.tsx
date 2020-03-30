// Web/src/App.tsx
import React from 'react';
import HomeRoute from './Routes/HomeRoute';

function Loading(): React.ReactElement {
  return <div>Loading...</div>;
}

export function App(): React.ReactElement {
  return (
    <React.Suspense fallback={Loading}>
      <h1 onClick={() => console.log('HelloWorld')}>App V3</h1>
      <HomeRoute />
    </React.Suspense>
  );
}
