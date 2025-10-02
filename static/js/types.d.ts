export interface Position {
    x: number;
    y: number;
}
export interface Cell extends Position {
    score: number;
    velocityX: number;
    velocityY: number;
    splitTime?: number;
}
export interface AIPlayer extends Position {
    name: string;
    color: string;
    score: number;
    direction: number;
}
export interface Food extends Position {
    color: string;
}
export interface GameState {
    playerCells: Cell[];
    playerName: string;
    camera: Position;
    food: Food[];
    aiPlayers: AIPlayer[];
}
export interface Mouse extends Position {
}
