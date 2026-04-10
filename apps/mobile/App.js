import "./global.css";
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { io } from 'socket.io-client';
import ChessBoard from './src/components/ChessBoard';

// REPLACE THIS with your computer's local network IP for Expo Go on a physical device
const SERVER_URL = 'http://10.28.102.116:3000'; 

export default function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('menu'); // menu, queue, playing, gameOver
  const [boardFen, setBoardFen] = useState('start');
  const [role, setRole] = useState(null);
  const [opponent, setOpponent] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // Note: In production, we'd handle server selection or auto-discovery
    const newSocket = io(SERVER_URL, {
      auth: {
        guestData: { name: 'Mobile Player' }
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setStatusMessage('Connected to server');
    });

    newSocket.on('authState', (data) => {
      console.log('Auth state:', data);
    });

    newSocket.on('queueStatus', (status) => {
      if (status.waiting) {
        setGameState('queue');
        setStatusMessage(status.message);
      }
    });

    newSocket.on('matchFound', (data) => {
      console.log('Match found:', data);
      setRole(data.role); // 'w' or 'b'
      setOpponent(data.opponent);
      setGameState('playing');
    });

    newSocket.on('boardState', (state) => {
      setBoardFen(state.fen);
    });

    newSocket.on('gameOver', (data) => {
      console.log('Game over:', data);
      setGameState('gameOver');
      const result = data.winner === 'draw' ? "It's a draw!" : `${data.winner} won!`;
      Alert.alert('Game Over', result);
    });

    newSocket.on('opponentLeft', (data) => {
      Alert.alert('Opponent Left', data.message);
      setGameState('menu');
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const handleMove = (move) => {
    if (socket) {
      socket.emit('move', move);
    }
  };

  const joinQueue = () => {
    if (socket) {
      socket.emit('queue:join', 'random');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 items-center justify-center p-4">
        {gameState === 'menu' && (
          <View className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 w-full">
            <Text className="text-4xl font-bold text-white text-center mb-2">
              Antigravity Chess
            </Text>
            <Text className="text-slate-400 text-center text-lg mb-8">
              Multiplayer Matchmaking
            </Text>
            
            <View onTouchEnd={joinQueue} className="bg-green-600 px-6 py-4 rounded-xl active:bg-green-700">
              <Text className="text-white font-bold text-center text-lg">
                Play Online
              </Text>
            </View>
          </View>
        )}

        {gameState === 'queue' && (
          <View className="items-center">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-white text-xl mt-4 font-semibold">{statusMessage}</Text>
            <Text className="text-slate-400 mt-2">Finding a worthy opponent...</Text>
          </View>
        )}

        {gameState === 'playing' || gameState === 'gameOver' && (
          <View className="items-center">
            <View className="mb-6 bg-slate-800 px-6 py-2 rounded-full border border-slate-700">
              <Text className="text-white font-bold">
                Versus: <Text className="text-green-400">{opponent || 'Opponent'}</Text>
              </Text>
            </View>

            <ChessBoard 
              fen={boardFen} 
              role={role} 
              onMove={handleMove} 
            />

            <View className="mt-8 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full">
              <Text className="text-slate-400 text-center">
                Playing as {role === 'w' ? 'White ⚪' : 'Black ⚫'}
              </Text>
              {gameState === 'gameOver' && (
                <View onTouchEnd={() => setGameState('menu')} className="mt-4 bg-green-600 py-2 rounded-lg">
                  <Text className="text-white text-center font-bold">Return to Menu</Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        <StatusBar style="light" />
      </View>
    </SafeAreaView>
  );
}
