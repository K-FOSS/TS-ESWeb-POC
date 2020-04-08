// src/Server/Components/Toggle.tsx
import React from 'react';

interface ToggleProps {
  initialState?: boolean;
}

export function Toggle({ initialState }: ToggleProps): React.ReactElement {
  const text = initialState ? 'Off' : 'On';

  return <p>{text}</p>;
}
