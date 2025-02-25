import { useConnection } from '../contexts/ConnectionContext';

export const ConnectionStatus = () => {
  const { isConnected, isReconnecting } = useConnection();

  if (isConnected) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      {isReconnecting ? 'Reconnecting to server...' : 'Connection lost'}
    </div>
  );
}; 