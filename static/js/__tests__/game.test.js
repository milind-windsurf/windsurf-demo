import { gameState } from '../gameState.js';

jest.mock('../gameState.js', () => ({
  gameState: {
    playerCells: [],
    aiPlayers: [],
    food: [],
    camera: { x: 0, y: 0 }
  },
  mouse: { x: 0, y: 0 }
}));

jest.mock('../renderer.js', () => ({
  initRenderer: jest.fn(),
  resizeCanvas: jest.fn(),
  drawGame: jest.fn(),
  drawMinimap: jest.fn(),
  updateLeaderboard: jest.fn()
}));

jest.mock('../entities.js', () => ({
  updatePlayer: jest.fn(),
  updateAI: jest.fn(),
  initEntities: jest.fn(),
  handlePlayerSplit: jest.fn()
}));

jest.mock('../collisions.js', () => ({
  handleFoodCollisions: jest.fn(),
  handlePlayerAICollisions: jest.fn(),
  handleAIAICollisions: jest.fn(),
  respawnEntities: jest.fn()
}));

jest.mock('../ui.js', () => ({
  initUI: jest.fn()
}));

describe('Game Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    gameState.playerCells = [];
    gameState.aiPlayers = [];
    gameState.food = [];
    gameState.camera = { x: 0, y: 0 };
    
    document.body.innerHTML = `
      <canvas id="gameCanvas"></canvas>
      <canvas id="minimap"></canvas>
      <div id="score"></div>
      <div id="leaderboard-content"></div>
    `;
  });

  describe('DOM Setup', () => {
    test('game canvas element exists', () => {
      const canvas = document.getElementById('gameCanvas');
      expect(canvas).not.toBeNull();
      expect(canvas.tagName).toBe('CANVAS');
    });

    test('minimap canvas element exists', () => {
      const minimap = document.getElementById('minimap');
      expect(minimap).not.toBeNull();
      expect(minimap.tagName).toBe('CANVAS');
    });

    test('score element exists', () => {
      const score = document.getElementById('score');
      expect(score).not.toBeNull();
    });

    test('leaderboard content element exists', () => {
      const leaderboard = document.getElementById('leaderboard-content');
      expect(leaderboard).not.toBeNull();
    });
  });

  describe('Game State', () => {
    test('gameState has playerCells array', () => {
      expect(Array.isArray(gameState.playerCells)).toBe(true);
    });

    test('gameState has aiPlayers array', () => {
      expect(Array.isArray(gameState.aiPlayers)).toBe(true);
    });

    test('gameState has food array', () => {
      expect(Array.isArray(gameState.food)).toBe(true);
    });

    test('gameState has camera object', () => {
      expect(gameState.camera).toBeDefined();
      expect(gameState.camera).toHaveProperty('x');
      expect(gameState.camera).toHaveProperty('y');
    });
  });

  describe('Game Initialization', () => {
    test('gameState can be modified', () => {
      gameState.playerCells.push({ x: 100, y: 100, score: 100 });
      expect(gameState.playerCells.length).toBe(1);
      expect(gameState.playerCells[0].x).toBe(100);
    });

    test('camera position can be updated', () => {
      gameState.camera.x = 500;
      gameState.camera.y = 300;
      expect(gameState.camera.x).toBe(500);
      expect(gameState.camera.y).toBe(300);
    });
  });
});
