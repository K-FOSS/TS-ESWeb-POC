// src/Web/Components/Nav.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Nav(): React.ReactElement {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/About'>About</Link>
        </li>
      </ul>
    </nav>
  );
}
