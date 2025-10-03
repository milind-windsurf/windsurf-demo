export interface Position {
  x: number;
  y: number;
}

export interface GameEntity extends Position {
  score: number;
  color: string;
}

export interface PlayerCell extends Position {
  score: number;
  velocityX: number;
  velocityY: number;
  splitTime?: number;
}

export interface AIPlayer extends GameEntity {
  direction: number;
  name: string;
}

export interface Food extends Position {
  color: string;
}

export interface GameState {
  playerCells: PlayerCell[];
  aiPlayers: AIPlayer[];
  food: Food[];
  camera: Position;
  playerName: string;
}

export interface Mouse {
  x: number;
  y: number;
}

export interface CanvasElements {
  gameCanvas: HTMLCanvasElement;
  minimapCanvas: HTMLCanvasElement;
  scoreElement: HTMLElement;
  leaderboardContent: HTMLElement;
}
