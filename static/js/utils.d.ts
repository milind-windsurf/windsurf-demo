import { Position, GameState, Cell } from './types.js';
export declare function getSize(score: number): number;
export declare function getRandomPosition(): Position;
export declare function getDistance(obj1: Position, obj2: Position): number;
export declare function calculateCenterOfMass(cells: Cell[]): Position;
export declare function findSafeSpawnLocation(gameState: GameState, minDistance?: number): Position;
