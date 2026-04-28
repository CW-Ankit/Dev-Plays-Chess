"use client";

import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { motion } from "framer-motion";
import { Terminal, History, RotateCcw, Play, Cpu } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PlayPage() {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  function makeAMove(move: any) {
    try {
      const result = game.move(move);
      if (result) {
        setGame(new Chess(game.fen()));
        setMoveHistory([...moveHistory, result.san]);
        return true;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to queen for simplicity
    });
    return move !== null;
  }

  function resetGame() {
    setGame(new Chess());
    setMoveHistory([]);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Game Board Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[600px] aspect-square shadow-2xl shadow-accent/10 border-8 border-secondary rounded-lg overflow-hidden"
        >
          <Chessboard 
            position={game.fen()} 
            onPieceDrop={onDrop} 
            customDarkSquareStyle={{ backgroundColor: "#4b5563" }}
            customLightSquareStyle={{ backgroundColor: "#9ca3af" }}
          />
        </motion.div>
        
        <div className="mt-8 flex gap-4">
          <Button onClick={resetGame} variant="outline" className="border-border text-text-secondary hover:text-text-primary">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset Runtime
          </Button>
          <Button className="bg-accent text-background font-bold">
            <Play className="w-4 h-4 mr-2 fill-current" /> New Match
          </Button>
        </div>
      </div>

      {/* Game Console / Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="p-6 rounded-3xl bg-secondary border border-border flex flex-col h-full max-h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-accent" /> 
              Execution Log
            </h3>
            <Cpu className="w-5 h-5 text-text-secondary" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {moveHistory.length === 0 ? (
              <div className="text-text-secondary text-center py-10 italic text-sm">
                Waiting for first commit...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {moveHistory.reduce((acc: any[], move, i) => {
                  if (i % 2 === 0) {
                    acc.push([move]);
                  } else {
                    acc[acc.length - 1].push(move);
                  }
                  return acc;
                }, []).map((pair, i) => (
                  <React.Fragment key={i}>
                    <div className="text-xs font-mono p-2 bg-background border border-border rounded-lg flex justify-between">
                      <span className="text-text-secondary">{i + 1}.</span>
                      <span className="font-bold">{pair[0]}</span>
                    </div>
                    {pair[1] && (
                      <div className="text-xs font-mono p-2 bg-background border border-border rounded-lg flex justify-between">
                        <span className="text-text-secondary">{i + 1}.</span>
                        <span className="font-bold">{pair[1]}</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Status:</span>
              <span className="text-accent font-mono">RUNNING</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-text-secondary">Turn:</span>
              <span className="font-bold">{game.turn() === 'w' ? 'White' : 'Black'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
