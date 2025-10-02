import { splitPlayerCell, handlePlayerSplit, updatePlayer, updateAI, initEntities, respawnAI } from '../entities.js';
import { gameState, mouse } from '../gameState.js';
import { MIN_SPLIT_SCORE, MAX_PLAYER_CELLS, AI_STARTING_SCORE, FOOD_COUNT, AI_COUNT } from '../config.js';

// Mock gameState and mouse
jest.mock('../gameState.js', () => ({
  gameState: {
    playerCells: []
  },
  mouse: { x: 0, y: 0 }
}));

describe('splitPlayerCell', () => {
  beforeEach(() => {
    gameState.playerCells = [];
  });

  test('does not split cell below minimum score', () => {
    const cell = { x: 100, y: 100, score: MIN_SPLIT_SCORE - 1 };
    gameState.playerCells = [cell];

    splitPlayerCell(cell);

    expect(gameState.playerCells.length).toBe(1);
    expect(gameState.playerCells[0].score).toBe(MIN_SPLIT_SCORE - 1);
  });

  test('splits cell with sufficient score', () => {
    const cell = { x: 100, y: 100, score: 100 };
    gameState.playerCells = [cell];

    splitPlayerCell(cell);

    expect(gameState.playerCells.length).toBe(2);
    expect(gameState.playerCells[0].score).toBe(50);
    expect(gameState.playerCells[1].score).toBe(50);
  });

  test('does not split when at max cells', () => {
    const cell = { x: 100, y: 100, score: 100 };
    gameState.playerCells = Array(MAX_PLAYER_CELLS).fill({ ...cell });

    splitPlayerCell(cell);

    expect(gameState.playerCells.length).toBe(MAX_PLAYER_CELLS);
  });
});

describe('handlePlayerSplit', () => {
  beforeEach(() => {
    gameState.playerCells = [];
  });

  test('splits all eligible cells', () => {
    gameState.playerCells = [
      { x: 100, y: 100, score: 100 },
      { x: 200, y: 200, score: MIN_SPLIT_SCORE - 1 },
      { x: 300, y: 300, score: 100 }
    ];

    handlePlayerSplit();

    expect(gameState.playerCells.length).toBe(5);  // 2 split + 1 unchanged
  });
});

describe('updatePlayer', () => {
  beforeEach(() => {
    gameState.playerCells = [];
    mouse.x = 0;
    mouse.y = 0;
  });

  test('moves player cells towards mouse', () => {
    const cell = { 
      x: 0, 
      y: 0, 
      score: 100, 
      velocityX: 0, 
      velocityY: 0 
    };
    gameState.playerCells = [cell];
    
    // Set mouse far to the right and run multiple updates to overcome inertia
    mouse.x = 1000;
    mouse.y = 0;
    
    // Run multiple updates to overcome initial inertia
    for (let i = 0; i < 5; i++) {
      updatePlayer();
    }

    expect(gameState.playerCells[0].velocityX).toBeGreaterThan(0);  // Should move right
  });

  test('applies speed based on cell size', () => {
    const smallCell = { x: 100, y: 100, score: 100, velocityX: 0, velocityY: 0 };
    const largeCell = { x: 100, y: 100, score: 400, velocityX: 0, velocityY: 0 };

    // Test small cell
    gameState.playerCells = [smallCell];
    mouse.x = 200;
    updatePlayer();
    const smallCellSpeed = Math.abs(gameState.playerCells[0].velocityX);

    // Test large cell
    gameState.playerCells = [largeCell];
    mouse.x = 200;
    updatePlayer();
    const largeCellSpeed = Math.abs(gameState.playerCells[0].velocityX);

    expect(smallCellSpeed).toBeGreaterThan(largeCellSpeed);  // Smaller cells move faster
  });
});

describe('updateAI', () => {
  beforeEach(() => {
    gameState.aiPlayers = [];
  });

  test('updates AI positions', () => {
    const ai = { 
      x: 100, 
      y: 100, 
      score: 100,
      direction: 0
    };
    gameState.aiPlayers = [ai];
    
    const initialX = ai.x;
    updateAI();
    
    expect(gameState.aiPlayers[0].x).not.toBe(initialX);
  });

  test('keeps AI within world bounds', () => {
    const ai = { 
      x: 1995, 
      y: 1995, 
      score: 100,
      direction: 0
    };
    gameState.aiPlayers = [ai];
    
    for (let i = 0; i < 10; i++) {
      updateAI();
    }
    
    expect(gameState.aiPlayers[0].x).toBeLessThanOrEqual(2000);
    expect(gameState.aiPlayers[0].y).toBeLessThanOrEqual(2000);
  });

  test('AI speed is affected by score', () => {
    const smallAI = { x: 100, y: 100, score: 100, direction: 0 };
    const largeAI = { x: 100, y: 100, score: 400, direction: 0 };
    
    gameState.aiPlayers = [smallAI];
    updateAI();
    const smallSpeed = Math.abs(gameState.aiPlayers[0].x - 100);
    
    gameState.aiPlayers = [largeAI];
    updateAI();
    const largeSpeed = Math.abs(gameState.aiPlayers[0].x - 100);
    
    expect(smallSpeed).toBeGreaterThan(largeSpeed);
  });
});

describe('initEntities', () => {
  beforeEach(() => {
    gameState.food = [];
    gameState.aiPlayers = [];
  });

  test('creates correct number of food items', () => {
    initEntities();
    expect(gameState.food.length).toBe(FOOD_COUNT);
  });

  test('creates correct number of AI players', () => {
    initEntities();
    expect(gameState.aiPlayers.length).toBe(AI_COUNT);
  });

  test('food items have required properties', () => {
    initEntities();
    const food = gameState.food[0];
    expect(food).toHaveProperty('x');
    expect(food).toHaveProperty('y');
    expect(food).toHaveProperty('color');
  });

  test('AI players have required properties', () => {
    initEntities();
    const ai = gameState.aiPlayers[0];
    expect(ai).toHaveProperty('x');
    expect(ai).toHaveProperty('y');
    expect(ai).toHaveProperty('score');
    expect(ai).toHaveProperty('color');
    expect(ai).toHaveProperty('direction');
    expect(ai).toHaveProperty('name');
  });

  test('clears existing entities before initializing', () => {
    gameState.food = [{ x: 1, y: 1 }];
    gameState.aiPlayers = [{ x: 1, y: 1, score: 100 }];
    
    initEntities();
    
    expect(gameState.food.length).toBe(FOOD_COUNT);
    expect(gameState.aiPlayers.length).toBe(AI_COUNT);
  });
});

describe('respawnAI', () => {
  test('creates AI with required properties', () => {
    const ai = respawnAI();
    expect(ai).toHaveProperty('x');
    expect(ai).toHaveProperty('y');
    expect(ai).toHaveProperty('score');
    expect(ai).toHaveProperty('color');
    expect(ai).toHaveProperty('direction');
    expect(ai).toHaveProperty('name');
  });

  test('AI spawns with correct starting score', () => {
    const ai = respawnAI();
    expect(ai.score).toBe(AI_STARTING_SCORE);
  });

  test('creates different AIs on multiple calls', () => {
    const ai1 = respawnAI();
    const ai2 = respawnAI();
    
    const isDifferent = ai1.x !== ai2.x || ai1.y !== ai2.y || ai1.color !== ai2.color;
    expect(isDifferent).toBe(true);
  });
});
