import { getSize, getDistance, calculateCenterOfMass, getRandomPosition } from '../utils';
import { PlayerCell, Position } from '../types';

describe('getSize', () => {
  test('calculates size correctly', () => {
    expect(getSize(0)).toBe(20);
    expect(getSize(100)).toBe(30);
    expect(getSize(400)).toBe(40);
  });
});

describe('getDistance', () => {
  test('calculates distance between two points', () => {
    const pos1: Position = { x: 0, y: 0 };
    const pos2: Position = { x: 3, y: 4 };
    expect(getDistance(pos1, pos2)).toBe(5);
  });
});

describe('calculateCenterOfMass', () => {
  test('returns origin for empty array', () => {
    expect(calculateCenterOfMass([])).toEqual({ x: 0, y: 0 });
  });

  test('calculates center of mass for multiple cells', () => {
    const cells: PlayerCell[] = [
      { x: 0, y: 0, score: 100, velocityX: 0, velocityY: 0 },
      { x: 10, y: 10, score: 100, velocityX: 0, velocityY: 0 }
    ];
    expect(calculateCenterOfMass(cells)).toEqual({ x: 5, y: 5 });
  });
});

describe('getRandomPosition', () => {
  test('returns a position within world bounds', () => {
    const pos = getRandomPosition();
    expect(pos.x).toBeGreaterThanOrEqual(0);
    expect(pos.y).toBeGreaterThanOrEqual(0);
    expect(pos.x).toBeLessThanOrEqual(2000);
    expect(pos.y).toBeLessThanOrEqual(2000);
  });
});
