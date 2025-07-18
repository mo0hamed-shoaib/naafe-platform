import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export function useSocket(token?: string) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;
    
    // Create socket instance
    const socket = io(BACKEND_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Clean up on unmount or token change
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  // Helper to register event listeners
  const on = useCallback((event: string, handler: (...args: unknown[]) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(event, handler);
    return () => {
      socketRef.current?.off(event, handler);
    };
  }, []);

  // Helper to emit events
  const emit = useCallback((event: string, ...args: unknown[]) => {
    socketRef.current?.emit(event, ...args);
  }, []);

  return {
    socket: socketRef.current,
    connected,
    on,
    emit,
  };
} 