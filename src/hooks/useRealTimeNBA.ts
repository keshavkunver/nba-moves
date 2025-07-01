import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { PlayerMove } from '@/types/nba';

interface UseRealTimeNBAReturn {
  moves: PlayerMove[];
  isConnected: boolean;
  lastUpdate: Date | null;
  newMovesCount: number;
  requestRefresh: () => void;
  clearNewMovesCount: () => void;
}

export function useRealTimeNBA(serverUrl: string = 'http://localhost:8080'): UseRealTimeNBAReturn {
  const [moves, setMoves] = useState<PlayerMove[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [newMovesCount, setNewMovesCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    console.log('🏀 Connecting to NBA moves server...');
    
    // Initialize socket connection
    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      retries: 3
    });

    const socket = socketRef.current;

    // Connection handlers
    socket.on('connect', () => {
      console.log('✅ Connected to NBA moves server');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from NBA moves server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      setIsConnected(false);
      
      // Implement exponential backoff for reconnection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000;
        console.log(`🔄 Retrying connection in ${delay/1000}s...`);
        
        setTimeout(() => {
          reconnectAttempts.current++;
          socket.connect();
        }, delay);
      }
    });

    // Data handlers
    socket.on('current-moves', (currentMoves: PlayerMove[]) => {
      console.log(`📊 Received ${currentMoves.length} current moves`);
      setMoves(currentMoves);
      setLastUpdate(new Date());
    });

    socket.on('new-moves', (newMoves: PlayerMove[]) => {
      console.log(`🚨 NEW MOVES: ${newMoves.length} fresh NBA moves!`);
      
      // Show notification/toast
      if (newMoves.length > 0) {
        showNotification(newMoves);
      }
      
      setNewMovesCount(prev => prev + newMoves.length);
      setLastUpdate(new Date());
      
      // Update moves list
      setMoves(currentMoves => {
        const allMoves = [...newMoves, ...currentMoves];
        return deduplicateAndSort(allMoves);
      });
    });

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up NBA moves connection');
      socket.disconnect();
    };
  }, [serverUrl]);

  // Function to request manual refresh
  const requestRefresh = () => {
    if (socketRef.current?.connected) {
      console.log('🔄 Requesting manual refresh...');
      socketRef.current.emit('request-refresh');
    }
  };

  // Clear new moves counter
  const clearNewMovesCount = () => {
    setNewMovesCount(0);
  };

  return {
    moves,
    isConnected,
    lastUpdate,
    newMovesCount,
    requestRefresh,
    clearNewMovesCount
  };
}

// Helper function to deduplicate and sort moves
function deduplicateAndSort(moves: PlayerMove[]): PlayerMove[] {
  const seen = new Map<string, PlayerMove>();
  
  moves.forEach(move => {
    const key = `${move.player.name}-${move.move_type}-${move.timestamp}`;
    if (!seen.has(key) || new Date(move.timestamp) > new Date(seen.get(key)!.timestamp)) {
      seen.set(key, move);
    }
  });
  
  return Array.from(seen.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50); // Keep only latest 50 moves
}

// Show browser notification for new moves
function showNotification(newMoves: PlayerMove[]) {
  // Check if notifications are supported and permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    const move = newMoves[0];
    const title = '🏀 NBA Move Alert!';
    const body = `${move.player.name} ${move.move_type} ${move.to_team ? `to ${move.to_team.name}` : ''}`;
    
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'nba-move',
      requireInteraction: false
    });
  }
  
  // Always log to console for development
  newMoves.forEach(move => {
    console.log(`🚨 BREAKING: ${move.player.name} ${move.move_type} - ${move.source}`);
  });
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
      } else {
        console.log('❌ Notification permission denied');
      }
    });
  }
}