// src/Web/Hooks/useWebSockets.ts

interface UseWebSocketsOptions {
  onMesssage: (this: WebSocket, event: MessageEvent) => void;
}

export function useWebSockets(
  wsUri: string,
  options: UseWebSocketsOptions,
): WebSocket {
  const websocket = new WebSocket(wsUri);

  websocket.onopen = () => {
    websocket.send('ping');
  };
  websocket.onmessage = options.onMesssage;

  return websocket;
}
