// src/Web/Components/Nav.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Nav(): React.ReactElement {
  return (
    <nav>
      <Link to='/'>Home</Link>
      <Link to='/About'>About</Link>
    </nav>
  );
}
