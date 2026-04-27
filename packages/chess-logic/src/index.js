import { Chess } from "chess.js";

export class ChessGame {
  constructor(fen) {
    this.game = new Chess(fen);
  }

  move(move) {
    try {
      return this.game.move(move);
    } catch (e) {
      return null;
    }
  }

  getFen() {
    return this.game.fen();
  }

  history() {
    return this.game.history();
  }

  isGameOver() {
    return this.game.isGameOver();
  }

  getStatus() {
    return {
      isCheckmate: this.game.isCheckmate(),
      isDraw: this.game.isDraw(),
      isStalemate: this.game.isStalemate(),
      isThreefoldRepetition: this.game.isThreefoldRepetition(),
      turn: this.game.turn(),
      gameOver: this.game.isGameOver(),
    };
  }
}

export { Chess };
