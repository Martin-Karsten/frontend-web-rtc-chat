import { useEffect, useRef } from 'react';

export function useWebSocket(url: string, onMessage: (message: any) => void, onClose?: () => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:', event);
    });

    ws.addEventListener('message', (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    });

    ws.addEventListener('error', (event: Event) => {
      console.error('WebSocket error:', event);
    });

    ws.addEventListener('close', (event: CloseEvent) => {
      console.log('WebSocket close code:', event.code, 'reason:', event.reason);
      if (onClose) {
        onClose();
      }
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, onMessage, onClose]);

  const sendMessage = (message: any) => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage, wsRef };
}
