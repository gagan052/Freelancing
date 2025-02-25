import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

const ConnectionContext = createContext({});

export const useConnection = () => useContext(ConnectionContext);

export const ConnectionProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const channel = supabase.channel('system');

    channel
      .on('presence', { event: 'sync' }, () => {
        setIsConnected(true);
        setIsReconnecting(false);
      })
      .on('presence', { event: 'join' }, () => {
        setIsConnected(true);
        setIsReconnecting(false);
      })
      .on('presence', { event: 'leave' }, () => {
        setIsConnected(false);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setIsReconnecting(false);
        }
        if (status === 'CLOSED') {
          setIsConnected(false);
        }
        if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          setIsReconnecting(true);
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <ConnectionContext.Provider value={{ isConnected, isReconnecting }}>
      {children}
    </ConnectionContext.Provider>
  );
}; 