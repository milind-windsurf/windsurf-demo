import type { PlayerCell, AIPlayer, Food, Position } from '../../types/game.js';

interface GameState {
  playerCells: PlayerCell[];
  aiPlayers: AIPlayer[];
  food: Food[];
  camera: Position;
  playerName: string;
}

export const gameState: GameState = {
  playerCells: [],
  aiPlayers: [],
  food: [],
  camera: { x: 0, y: 0 },
  playerName: 'Player'
};
