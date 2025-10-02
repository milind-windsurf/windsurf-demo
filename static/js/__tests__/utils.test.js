import { getSize, getDistance, calculateCenterOfMass, getRandomPosition, findSafeSpawnLocation } from '../utils.js';
import { WORLD_SIZE } from '../config.js';

describe('getSize', () => {
  test('returns correct size for score 0', () => {
    expect(getSize(0)).toBe(20);  // sqrt(0) + 20
  });

  test('returns correct size for score 100', () => {
    expect(getSize(100)).toBe(30);  // sqrt(100) + 20
  });

  test('returns correct size for score 400', () => {
    expect(getSize(400)).toBe(40);  // sqrt(400) + 20
  });
});

describe('getDistance', () => {
  test('returns 0 for same point', () => {
    const point = { x: 10, y: 10 };
    expect(getDistance(point, point)).toBe(0);
  });

  test('returns correct horizontal distance', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 3, y: 0 };
    expect(getDistance(point1, point2)).toBe(3);
  });

  test('returns correct vertical distance', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 0, y: 4 };
    expect(getDistance(point1, point2)).toBe(4);
  });

  test('returns correct diagonal distance', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 3, y: 4 };
    expect(getDistance(point1, point2)).toBe(5);  // 3-4-5 triangle
  });
});

describe('calculateCenterOfMass', () => {
  test('returns center for single cell', () => {
    const cells = [{ x: 10, y: 20, score: 100 }];
    const center = calculateCenterOfMass(cells);
    expect(center).toEqual({ x: 10, y: 20 });
  });

  test('returns weighted center for multiple cells', () => {
    const cells = [
      { x: 0, y: 0, score: 100 },
      { x: 10, y: 10, score: 300 }
    ];
    const center = calculateCenterOfMass(cells);
    expect(center.x).toBeCloseTo(5);
    expect(center.y).toBeCloseTo(5);
  });

  test('returns {x: 0, y: 0} for empty cells array', () => {
    expect(calculateCenterOfMass([])).toEqual({ x: 0, y: 0 });
  });

  test('returns {x: 0, y: 0} for cells with zero total score', () => {
    const cells = [
      { x: 10, y: 20, score: 0 },
      { x: 30, y: 40, score: 0 }
    ];
    expect(calculateCenterOfMass(cells)).toEqual({ x: 0, y: 0 });
  });
});

describe('getRandomPosition', () => {
  test('returns position within world bounds', () => {
    const pos = getRandomPosition();
    expect(pos.x).toBeGreaterThanOrEqual(0);
    expect(pos.x).toBeLessThanOrEqual(WORLD_SIZE);
    expect(pos.y).toBeGreaterThanOrEqual(0);
    expect(pos.y).toBeLessThanOrEqual(WORLD_SIZE);
  });

  test('returns object with x and y properties', () => {
    const pos = getRandomPosition();
    expect(pos).toHaveProperty('x');
    expect(pos).toHaveProperty('y');
  });

  test('generates different positions on multiple calls', () => {
    const positions = [];
    for (let i = 0; i < 10; i++) {
      positions.push(getRandomPosition());
    }
    const allSame = positions.every(pos => 
      pos.x === positions[0].x && pos.y === positions[0].y
    );
    expect(allSame).toBe(false);
  });
});

describe('findSafeSpawnLocation', () => {
  test('returns position away from AI players', () => {
    const gameState = {
      aiPlayers: [{ x: 100, y: 100, score: 100 }],
      playerCells: []
    };
    
    const pos = findSafeSpawnLocation(gameState, 200);
    const distance = Math.sqrt(Math.pow(pos.x - 100, 2) + Math.pow(pos.y - 100, 2));
    
    expect(distance).toBeGreaterThan(0);
  });

  test('returns position away from player cells', () => {
    const gameState = {
      aiPlayers: [],
      playerCells: [{ x: 500, y: 500, score: 200 }]
    };
    
    const pos = findSafeSpawnLocation(gameState, 150);
    const distance = Math.sqrt(Math.pow(pos.x - 500, 2) + Math.pow(pos.y - 500, 2));
    
    expect(distance).toBeGreaterThan(0);
  });

  test('returns fallback position when no safe spot found', () => {
    const gameState = {
      aiPlayers: [],
      playerCells: []
    };
    
    for (let x = 0; x < WORLD_SIZE; x += 100) {
      for (let y = 0; y < WORLD_SIZE; y += 100) {
        gameState.aiPlayers.push({ x, y, score: 10000 });
      }
    }
    
    const pos = findSafeSpawnLocation(gameState, 500);
    expect(pos).toHaveProperty('x');
    expect(pos).toHaveProperty('y');
  });

  test('returns valid position for empty gameState', () => {
    const gameState = {
      aiPlayers: [],
      playerCells: []
    };
    
    const pos = findSafeSpawnLocation(gameState);
    expect(pos.x).toBeGreaterThanOrEqual(0);
    expect(pos.x).toBeLessThanOrEqual(WORLD_SIZE);
    expect(pos.y).toBeGreaterThanOrEqual(0);
    expect(pos.y).toBeLessThanOrEqual(WORLD_SIZE);
  });
});
