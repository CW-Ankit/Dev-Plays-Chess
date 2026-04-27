import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { ChessGame } from '@chessdotcom/chess-logic';
import { SocketEvents } from '@chessdotcom/types';
import { io, Socket } from 'socket.io-client';
import { Loader2, Clock, XCircle, Activity, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SERVER_URL = 'http://localhost:3000';

const GamePage = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [game, setGame] = useState<ChessGame | null>(null);
  const [playerColor, setPlayerColor] = useState<'w' | 'b' | null>(null);
  const [matchStatus, setMatchStatus] = useState<'idle' | 'searching' | 'playing' | 'game_over'>('idle');
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  useEffect(() => {
    // Initialize game instance on mount
    setGame(new ChessGame());

    const newSocket = io(SERVER_URL, {
      auth: { guestData: { name: user?.name || 'Guest User' } }
    });
    setSocket(newSocket);
//...

    newSocket.on(SocketEvents.QUEUE_STATUS, (status: { waiting: boolean; message: string }) => {
        if (status.waiting) setMatchStatus('searching');
    });

    newSocket.on(SocketEvents.MATCH_FOUND, (data: { roomId: string, role: 'w' | 'b', opponent: string }) => {
      setPlayerColor(data.role);
      setMatchStatus('playing');
      setGame(new ChessGame());
    });

    newSocket.on(SocketEvents.MOVE, (move: any) => {
      setGame((prevGame) => {
        if (!prevGame) return new ChessGame();
        const gameCopy = new ChessGame(prevGame.getFen());
        gameCopy.move(move);
        return gameCopy;
      });
    });

    newSocket.on(SocketEvents.BOARD_STATE, (data: { fen: string }) => {
       setGame(new ChessGame(data.fen));
    });

    newSocket.on(SocketEvents.GAME_OVER, (data: { winner: string; checkmate: boolean; draw: boolean }) => {
      setMatchStatus('game_over');
      let reason = 'Game Ended';
      if (data.checkmate) reason = `Checkmate! Winner: ${data.winner}`;
      else if (data.draw) reason = 'Draw';
      setGameOverReason(reason);
    });

    newSocket.on(SocketEvents.OPPONENT_LEFT, (data: { message: string }) => {
      setMatchStatus('game_over');
      setGameOverReason(data.message || 'Opponent abandoned the session');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  function makeMove(sourceSquare: string, targetSquare: string) {
    if (matchStatus !== 'playing' || !game) return false;
    const status = game.getStatus();
    if (status.turn !== playerColor) return false;

    const gameCopy = new ChessGame(game.getFen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) return false;
    setGame(gameCopy);

    if (socket) socket.emit(SocketEvents.MOVE, move);
    return true;
  }

  const findMatch = () => {
    if (socket) {
      socket.emit(SocketEvents.JOIN_QUEUE);
      setMatchStatus('searching');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] p-6 flex flex-col items-center">
      <div className="max-w-6xl w-full grid lg:grid-cols-3 gap-8 relative">
        
        <AnimatePresence>
          {matchStatus === 'searching' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0e1116]/80 backdrop-blur-sm rounded-2xl border border-[#30363D]"
            >
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Provisioning Instance...</h3>
              <p className="text-[#8B949E]">Searching for an opponent with similar Elo rating</p>
            </motion.div>
          )}
          {matchStatus === 'game_over' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0e1116]/90 backdrop-blur-md rounded-2xl border border-[#30363D]"
            >
              <XCircle className="w-16 h-16 text-rose-500 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">Session Terminated</h3>
              <p className="text-[#8B949E] mb-8 text-center max-w-md">{gameOverReason}</p>
              <button 
                onClick={findMatch}
                className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-slate-200 transition-all shadow-xl"
              >
                Host New Match
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="lg:col-span-2 bg-[#161b22] border border-[#30363D] rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-[#0d1117] border-b border-[#30363D] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 text-sm font-mono text-[#C9D1D9]">
              <Server className="w-4 h-4 text-[#8B949E]" /> Opponent
            </div>
            {matchStatus === 'playing' && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">Live</span>}
          </div>
          
          <div className="p-8 flex justify-center bg-[#0e1116]">
            <div className="w-full max-w-[550px] aspect-square shadow-2xl ring-4 ring-[#161b22] rounded-sm overflow-hidden">
              {game ? (
                <Chessboard 
                  position={game.getFen()} 
                  onPieceDrop={makeMove} 
                  boardOrientation={playerColor === 'b' ? 'black' : 'white'}
                  customDarkSquareStyle={{ backgroundColor: '#4b5563' }}
                  customLightSquareStyle={{ backgroundColor: '#9ca3af' }}
                />
              ) : (
                <div className="w-full h-full bg-[#161b22] flex items-center justify-center text-white font-mono">
                  Initializing Engine...
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0d1117] border-t border-[#30363D] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 text-sm font-mono">
              <Activity className="w-4 h-4 text-emerald-500" /> 
              <span className="text-white font-bold">{user?.name || 'Guest'}</span>
              {playerColor && <span className="text-[10px] bg-[#30363D] text-[#8B949E] px-1.5 py-0.5 rounded uppercase">{playerColor === 'w' ? 'White' : 'Black'}</span>}
            </div>
            <div className="flex gap-2">
              {matchStatus === 'playing' && (
                <>
                  <button className="px-3 py-1 text-xs font-medium bg-rose-500/10 text-rose-500 rounded border border-rose-500/20 hover:bg-rose-500/20 transition-all">Resign</button>
                  <button className="px-3 py-1 text-xs font-medium bg-[#21262d] text-white rounded border border-[#30363D] hover:bg-[#30363D] transition-all">Draw</button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#161b22] border border-[#30363D] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#8B949E] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Session Log
            </h3>
            <div className="h-[300px] overflow-y-auto font-mono text-xs space-y-2 pr-2">
              {(!game || game.history().length === 0) && <div className="text-[#4B5563] italic">No move operations recorded...</div>}
              {game?.history().map((move, i) => (
                <div key={i} className="flex gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-[#4B5563]">{Math.floor(i/2)+1}.</span>
                  <span className={i % 2 === 0 ? 'text-white' : 'text-[#8B949E]'}>{move}</span>
                </div>
              ))}
            </div>
          </div>
          
          {matchStatus === 'idle' && (
            <button 
              onClick={findMatch}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" /> Host Match
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
