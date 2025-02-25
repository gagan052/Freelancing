export const createWebSocketConnection = (url, {
  onOpen,
  onMessage,
  onClose,
  onError,
  keepAliveInterval = 5000
}) => {
  const ws = new WebSocket(url);
  let keepAliveTimer;

  ws.onopen = () => {
    console.log('WebSocket connected');
    
    // Setup keep-alive
    keepAliveTimer = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, keepAliveInterval);
    
    onOpen?.();
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  ws.onclose = (event) => {
    console.log('WebSocket closed:', event);
    clearInterval(keepAliveTimer);
    onClose?.(event);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    onError?.(error);
  };

  return ws;
}; 