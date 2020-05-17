// src/Web/Components/Counter.tsx
import React from 'react';

interface CounterProps {
  initialValue?: number;
}

/**
 * @hmr true
 */
function Counter(): React.ReactElement {
  const [count, setCount] = React.useState(0);

  const handleCount = React.useCallback(
    () => setCount((currentCount) => currentCount + 1),
    [setCount],
  );

  return React.useMemo(
    () => (
      <h3 onClick={handleCount}>
        Current Count <span>{count}</span>
      </h3>
    ),
    [count],
  );
}

export default Counter;
