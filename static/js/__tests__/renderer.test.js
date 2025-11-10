import { initRenderer, resizeCanvas, drawGame, drawMinimap, updateLeaderboard } from '../renderer.js';
import { gameState } from '../gameState.js';
import { getSize } from '../utils.js';
import { WORLD_SIZE, COLORS, FOOD_SIZE } from '../config.js';

// Mock gameState
jest.mock('../gameState.js', () => ({
  gameState: {
    playerCells: [],
    aiPlayers: [],
    food: [],
    camera: { x: 0, y: 0 },
    playerName: 'TestPlayer'
  }
}));

jest.mock('../utils.js', () => ({
  getSize: jest.fn((score) => Math.sqrt(score) + 20),
  calculateCenterOfMass: jest.fn(() => ({ x: 0, y: 0 }))
}));

describe('Renderer Module', () => {
  let mockCanvas, mockMinimapCanvas, mockScoreElement, mockLeaderboardContent;
  let mockCtx, mockMinimapCtx;

  beforeEach(() => {
    mockCtx = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      fillText: jest.fn(),
      strokeText: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      textBaseline: ''
    };

    mockMinimapCtx = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      fillStyle: '',
      strokeStyle: ''
    };

    mockCanvas = {
      getContext: jest.fn(() => mockCtx),
      width: 800,
      height: 600
    };

    mockMinimapCanvas = {
      getContext: jest.fn(() => mockMinimapCtx),
      width: 150,
      height: 150
    };

    mockScoreElement = {
      textContent: ''
    };

    mockLeaderboardContent = {
      innerHTML: ''
    };

    global.innerWidth = 800;
    global.innerHeight = 600;

    gameState.playerCells = [];
    gameState.aiPlayers = [];
    gameState.food = [];
    gameState.camera = { x: 0, y: 0 };
    gameState.playerName = 'TestPlayer';
  });

  describe('initRenderer', () => {
    test('initializes renderer with canvas elements', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      expect(() => initRenderer(elements)).not.toThrow();
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(mockMinimapCanvas.getContext).toHaveBeenCalledWith('2d');
    });
  });

  describe('resizeCanvas', () => {
    test('resizes canvas to window dimensions', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      
      global.innerWidth = 1024;
      global.innerHeight = 768;
      
      resizeCanvas();
      
      expect(mockCanvas.width).toBe(1024);
      expect(mockCanvas.height).toBe(768);
    });
  });

  describe('drawGame', () => {
    test('clears canvas before drawing', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      drawGame();

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, mockCanvas.width, mockCanvas.height);
    });

    test('draws food items', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      
      gameState.food = [
        { x: 100, y: 100, color: '#ff0000' },
        { x: 200, y: 200, color: '#00ff00' }
      ];

      drawGame();

      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.arc).toHaveBeenCalled();
    });

    test('draws player cells', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      
      gameState.playerCells = [
        { x: 400, y: 300, score: 100 }
      ];

      drawGame();

      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.arc).toHaveBeenCalled();
    });

    test('updates score display', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      
      gameState.playerCells = [
        { x: 400, y: 300, score: 100 },
        { x: 500, y: 400, score: 50 }
      ];

      drawGame();

      expect(mockScoreElement.textContent).toContain('150');
    });
  });

  describe('drawMinimap', () => {
    test('draws minimap background', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      drawMinimap();

      expect(mockMinimapCtx.fillRect).toHaveBeenCalledWith(0, 0, 150, 150);
    });

    test('draws player cells on minimap', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      
      gameState.playerCells = [
        { x: 1000, y: 1000, score: 100 }
      ];

      drawMinimap();

      expect(mockMinimapCtx.beginPath).toHaveBeenCalled();
      expect(mockMinimapCtx.arc).toHaveBeenCalled();
    });

    test('draws AI players on minimap', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      
      gameState.aiPlayers = [
        { x: 500, y: 500, score: 50, name: 'AI1' }
      ];

      drawMinimap();

      expect(mockMinimapCtx.beginPath).toHaveBeenCalled();
      expect(mockMinimapCtx.arc).toHaveBeenCalled();
    });
  });

  describe('updateLeaderboard', () => {
    test('updates leaderboard with player and AI scores', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      
      gameState.playerCells = [
        { x: 400, y: 300, score: 200 }
      ];
      
      gameState.aiPlayers = [
        { x: 500, y: 400, score: 150, name: 'AI1' },
        { x: 600, y: 500, score: 100, name: 'AI2' }
      ];

      updateLeaderboard();

      expect(mockLeaderboardContent.innerHTML).toContain('TestPlayer');
      expect(mockLeaderboardContent.innerHTML).toContain('AI1');
      expect(mockLeaderboardContent.innerHTML).toContain('AI2');
    });

    test('sorts leaderboard by score descending', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      
      gameState.playerCells = [
        { x: 400, y: 300, score: 100 }
      ];
      
      gameState.aiPlayers = [
        { x: 500, y: 400, score: 200, name: 'AI1' },
        { x: 600, y: 500, score: 50, name: 'AI2' }
      ];

      updateLeaderboard();

      const html = mockLeaderboardContent.innerHTML;
      const ai1Index = html.indexOf('AI1');
      const playerIndex = html.indexOf('TestPlayer');
      const ai2Index = html.indexOf('AI2');

      expect(ai1Index).toBeLessThan(playerIndex);
      expect(playerIndex).toBeLessThan(ai2Index);
    });

    test('limits leaderboard to top 5 players', () => {
      const elements = {
        gameCanvas: mockCanvas,
        minimapCanvas: mockMinimapCanvas,
        scoreElement: mockScoreElement,
        leaderboardContent: mockLeaderboardContent
      };

      initRenderer(elements);
      
      gameState.playerCells = [
        { x: 400, y: 300, score: 100 }
      ];
      
      gameState.aiPlayers = [
        { x: 100, y: 100, score: 500, name: 'AI1' },
        { x: 200, y: 200, score: 400, name: 'AI2' },
        { x: 300, y: 300, score: 300, name: 'AI3' },
        { x: 400, y: 400, score: 200, name: 'AI4' },
        { x: 500, y: 500, score: 150, name: 'AI5' },
        { x: 600, y: 600, score: 50, name: 'AI6' }
      ];

      updateLeaderboard();

      const html = mockLeaderboardContent.innerHTML;
      const matches = html.match(/leaderboard-item/g);
      expect(matches).toHaveLength(5);
    });
  });
});
