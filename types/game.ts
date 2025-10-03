interface Position {
  x: number;
  y: number;
}

interface GameEntity extends Position {
  score: number;
  color: string;
}

interface PlayerCell extends GameEntity {
  vx?: number;
  vy?: number;
  splitCooldown?: number;
  mergeCooldown?: number;
}

interface AIPlayer extends GameEntity {
  direction: number;
  name: string;
}

interface Food extends Position {
}

export type { Position, GameEntity, PlayerCell, AIPlayer, Food };
