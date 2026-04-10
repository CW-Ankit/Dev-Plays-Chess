import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Chess } from 'chess.js';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 32; // Standard padding
const SQUARE_SIZE = BOARD_SIZE / 8;

const PIECES = {
  p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
  P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔',
};

export default function ChessBoard({ fen, onMove, role }) {
  const [chess] = useState(new Chess(fen));
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);

  useEffect(() => {
    if (fen && fen !== chess.fen()) {
      chess.load(fen);
    }
  }, [fen]);

  const handleSquarePress = (square) => {
    // If it's not the user's turn (based on role), don't allow moves
    // Note: In development, we might allow all moves for testing
    if (role && chess.turn() !== role) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    const piece = chess.get(square);
    
    // If a piece is already selected, try to move there
    if (selectedSquare) {
      try {
        const move = chess.move({
          from: selectedSquare,
          to: square,
          promotion: 'q', // Always promote to queen for simplicity
        });

        if (move) {
          onMove(move);
          setSelectedSquare(null);
          setValidMoves([]);
          return;
        }
      } catch (e) {
        // Not a valid move
      }
    }

    // Select piece if it's the right turn
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true }).map(m => m.to);
      setValidMoves(moves);
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const board = [];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = role === 'b' ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const displayFiles = role === 'b' ? [...files].reverse() : files;

  ranks.forEach((rank) => {
    displayFiles.forEach((file) => {
      const square = `${file}${rank}`;
      const isDark = (files.indexOf(file) + rank) % 2 === 0;
      const piece = chess.get(square);
      const isSelected = selectedSquare === square;
      const isValidMove = validMoves.includes(square);

      board.push(
        <TouchableOpacity
          key={square}
          style={{
            width: SQUARE_SIZE,
            height: SQUARE_SIZE,
            backgroundColor: isSelected ? '#F6E05E' : (isDark ? '#769656' : '#eeeed2'),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => handleSquarePress(square)}
        >
          {isValidMove && !piece && (
            <View style={{
              width: SQUARE_SIZE / 3,
              height: SQUARE_SIZE / 3,
              borderRadius: SQUARE_SIZE / 6,
              backgroundColor: 'rgba(0,0,0,0.1)',
            }} />
          )}
          {piece && (
            <Text style={{
              fontSize: SQUARE_SIZE * 0.8,
              color: piece.color === 'w' ? '#FFF' : '#000',
              // Use shadow/outline for white pieces on light squares if needed
              textShadowColor: piece.color === 'w' ? 'rgba(0,0,0,0.5)' : 'transparent',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
            }}>
              {PIECES[piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()]}
            </Text>
          )}
        </TouchableOpacity>
      );
    });
  });

  return (
    <View style={{ width: BOARD_SIZE, height: BOARD_SIZE, flexDirection: 'row', flexWrap: 'wrap' }}>
      {board}
    </View>
  );
}
