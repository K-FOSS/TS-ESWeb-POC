// src/Web/Content.tsx
import React from 'react';
import { useRoot } from './Providers/DataProvider';

export function Content(): React.ReactElement {
  const { content } = useRoot();

  return <div>{content}</div>;
}
