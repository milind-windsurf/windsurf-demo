import { gameState, mouse } from '../gameState.js';
import { WORLD_SIZE, STARTING_SCORE } from '../config.js';

describe('gameState', () => {
  test('gameState is defined', () => {
    expect(gameState).toBeDefined();
  });

  test('gameState has playerCells array', () => {
    expect(Array.isArray(gameState.playerCells)).toBe(true);
  });

  test('gameState has initial player cell', () => {
    expect(gameState.playerCells.length).toBeGreaterThan(0);
  });

  test('initial player cell has correct position', () => {
    const initialCell = gameState.playerCells[0];
    expect(initialCell.x).toBe(WORLD_SIZE / 2);
    expect(initialCell.y).toBe(WORLD_SIZE / 2);
  });

  test('initial player cell has correct score', () => {
    const initialCell = gameState.playerCells[0];
    expect(initialCell.score).toBe(STARTING_SCORE);
  });

  test('initial player cell has velocity properties', () => {
    const initialCell = gameState.playerCells[0];
    expect(initialCell).toHaveProperty('velocityX');
    expect(initialCell).toHaveProperty('velocityY');
    expect(initialCell.velocityX).toBe(0);
    expect(initialCell.velocityY).toBe(0);
  });

  test('gameState has playerName property', () => {
    expect(gameState).toHaveProperty('playerName');
    expect(typeof gameState.playerName).toBe('string');
  });

  test('gameState has camera object', () => {
    expect(gameState.camera).toBeDefined();
    expect(gameState.camera).toHaveProperty('x');
    expect(gameState.camera).toHaveProperty('y');
  });

  test('camera starts at origin', () => {
    expect(gameState.camera.x).toBe(0);
    expect(gameState.camera.y).toBe(0);
  });

  test('gameState has food array', () => {
    expect(Array.isArray(gameState.food)).toBe(true);
  });

  test('gameState has aiPlayers array', () => {
    expect(Array.isArray(gameState.aiPlayers)).toBe(true);
  });

  test('gameState can be modified', () => {
    const originalLength = gameState.playerCells.length;
    gameState.playerCells.push({ x: 100, y: 100, score: 50, velocityX: 0, velocityY: 0 });
    expect(gameState.playerCells.length).toBe(originalLength + 1);
    gameState.playerCells.pop();
  });

  test('camera position can be updated', () => {
    const originalX = gameState.camera.x;
    const originalY = gameState.camera.y;
    gameState.camera.x = 500;
    gameState.camera.y = 300;
    expect(gameState.camera.x).toBe(500);
    expect(gameState.camera.y).toBe(300);
    gameState.camera.x = originalX;
    gameState.camera.y = originalY;
  });
});

describe('mouse', () => {
  test('mouse is defined', () => {
    expect(mouse).toBeDefined();
  });

  test('mouse has x and y properties', () => {
    expect(mouse).toHaveProperty('x');
    expect(mouse).toHaveProperty('y');
  });

  test('mouse starts at origin', () => {
    expect(mouse.x).toBe(0);
    expect(mouse.y).toBe(0);
  });

  test('mouse position can be updated', () => {
    const originalX = mouse.x;
    const originalY = mouse.y;
    mouse.x = 250;
    mouse.y = 150;
    expect(mouse.x).toBe(250);
    expect(mouse.y).toBe(150);
    mouse.x = originalX;
    mouse.y = originalY;
  });
});
