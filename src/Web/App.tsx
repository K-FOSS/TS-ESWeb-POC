// Web/src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Nav } from './Components/Nav';

const HomeRoute = React.lazy(() => import('./Routes/HomeRoute'));
const AboutRoute = React.lazy(() => import('./Routes/AboutRoute'));

export function App() {
  return (
    <>
      <Nav />
      <React.Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path='/' element={<HomeRoute />} />
          <Route path='/About' element={<AboutRoute />} />
        </Routes>
      </React.Suspense>
    </>
  );
}
