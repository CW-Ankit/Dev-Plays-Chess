import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { io, Socket } from 'socket.io-client';
import { Play, Loader2, Trophy, Clock, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVER_URL = 'http://localhost:3000'; // Make sure this matches your express server

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [game, setGame] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState<'w' | 'b' | null>(null);
  const [matchStatus, setMatchStatus] = useState<'idle' | 'searching' | 'playing' | 'game_over'>('idle');
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('match_found', (data: { color: 'w' | 'b' }) => {
      setPlayerColor(data.color);
      setMatchStatus('playing');
      setGame(new Chess()); // Reset internal board
    });

    newSocket.on('move', (move: { from: string; to: string; promotion?: string }) => {
      setGame((prevGame) => {
        const gameCopy = new Chess(prevGame.fen());
        gameCopy.move(move);
        return gameCopy;
      });
    });

    newSocket.on('game_over', (data: { winner: 'w' | 'b' | 'draw' | null; reason: string }) => {
      setMatchStatus('game_over');
      setGameOverReason(data.reason);
    });

    newSocket.on('opponent_left', () => {
      setMatchStatus('game_over');
      setGameOverReason('Opponent abandoned the match');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  function makeMove(sourceSquare: string, targetSquare: string) {
    if (matchStatus !== 'playing') return false;
    
    // Only allow moves for the player's color
    if (game.turn() !== playerColor) {
      return false;
    }

    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // Always promote to queen for simplicity
    });

    if (move === null) return false;

    setGame(gameCopy);

    // Send move to server
    if (socket) {
      socket.emit('move', move);
    }
    return true;
  }

  const findMatch = () => {
    if (socket) {
      socket.emit('find_match');
      setMatchStatus('searching');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl md:text-2xl">♟️</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              ChessClone
            </h1>
          </div>
          <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-300">Guest Player</span>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                </span>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid md:grid-cols-12 gap-8 relative">
        {/* Left Column - Board Area */}
        <div className="md:col-span-8 flex flex-col justify-center relative">
          
          {/* Match overlay when searching */}
          <AnimatePresence>
            {matchStatus === 'searching' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50"
              >
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Finding Opponent</h2>
                <p className="text-slate-400">Waiting for another player...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Opponent Info (Top) */}
          {matchStatus === 'playing' ? (
             <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between mb-4 px-2">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                        👤
                     </div>
                     <div>
                         <p className="font-semibold text-slate-200">Opponent</p>
                         <p className="text-xs text-slate-400 font-medium">Rating: 1200</p>
                     </div>
                 </div>
                 <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2 font-mono text-lg font-bold">
                    <Clock className="w-4 h-4 text-slate-400" />
                    10:00
                 </div>
             </motion.div>
          ) : (
            <div className="h-[72px] mb-4"></div> // Spacer for layout consistency
          )}

          {/* Board Container */}
          <div className="aspect-square w-full max-w-[600px] mx-auto bg-slate-800 rounded-xl shadow-2xl shadow-indigo-900/10 overflow-hidden ring-4 ring-slate-800/80">
            <Chessboard 
                position={game.fen()} 
                onPieceDrop={makeMove} 
                boardOrientation={playerColor === 'b' ? 'black' : 'white'}
                customDarkSquareStyle={{ backgroundColor: '#779556' }}
                customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
                animationDuration={300}
            />
          </div>

           {/* Player Info (Bottom) */}
           {matchStatus === 'playing' ? (
             <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between mt-4 px-2">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                        👤
                     </div>
                     <div>
                         <p className="font-semibold text-slate-200">Guest Player <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">You</span></p>
                         <p className="text-xs text-slate-400 font-medium">{playerColor === 'w' ? 'White' : 'Black'} pieces</p>
                     </div>
                 </div>
                 <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2 font-mono text-lg font-bold">
                    <Clock className="w-4 h-4 text-slate-400" />
                    10:00
                 </div>
             </motion.div>
          ) : (
            <div className="h-[72px] mt-4"></div> // Spacer
          )}
        </div>

        {/* Right Column - Controls & Info */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          {/* Game Controls Panel */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="text-yellow-500 w-5 h-5" />
              Play Online
            </h2>

            {matchStatus === 'idle' && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={findMatch}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/25 transition-all flex items-center justify-center gap-2 ring-1 ring-white/20"
              >
                <Play className="fill-current w-5 h-5" />
                Find Match (10 min)
              </motion.button>
            )}

            {matchStatus === 'searching' && (
              <button 
                disabled
                className="w-full py-4 bg-slate-700 text-slate-300 rounded-xl font-bold flex items-center justify-center gap-2 opacity-80"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </button>
            )}

            {matchStatus === 'playing' && (
              <div className="flex gap-4">
                <button 
                  className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Resign
                </button>
                <button 
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Draw
                </button>
              </div>
            )}

            {matchStatus === 'game_over' && (
                <div className="flex flex-col gap-4">
                     <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-center">
                        <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Match Over</p>
                        <p className="text-xl font-bold text-white">{gameOverReason}</p>
                     </div>
                     <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={findMatch}
                        className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold shadow-lg transition-colors"
                     >
                         Play Again
                     </motion.button>
                </div>
            )}

            {/* Simulated Live Stats / Chat Placeholder */}
            <div className="mt-8 flex-1 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Game Logs</h3>
              <div className="flex-1 min-h-[200px] bg-slate-900/60 rounded-xl border border-slate-700/50 p-4 font-mono text-sm text-slate-500 overflow-y-auto">
                {game.history().length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                        Game events will appear here once the match starts.
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {game.history().map((move, i) => (
                           <div key={i} className="flex gap-2 p-1 hover:bg-slate-800/80 rounded">
                               <span className="text-slate-600 w-6 text-right">{Math.floor(i/2) + 1}.</span>
                               <span className="text-slate-300 ml-2">{move}</span>
                           </div> 
                        ))}
                    </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
