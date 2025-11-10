import {
  WORLD_SIZE,
  FOOD_SIZE,
  STARTING_SCORE,
  AI_STARTING_SCORE,
  FOOD_SCORE,
  FOOD_COUNT,
  AI_COUNT,
  COLLISION_THRESHOLD,
  MIN_SPLIT_SCORE,
  SPLIT_VELOCITY,
  MAX_PLAYER_CELLS,
  SPLIT_COOLDOWN,
  MERGE_DISTANCE,
  MERGE_COOLDOWN,
  MERGE_FORCE,
  MERGE_START_FORCE,
  COLORS
} from '../config.js';

describe('Config Module', () => {
  describe('World Configuration', () => {
    test('WORLD_SIZE is defined and positive', () => {
      expect(WORLD_SIZE).toBeDefined();
      expect(typeof WORLD_SIZE).toBe('number');
      expect(WORLD_SIZE).toBeGreaterThan(0);
    });

    test('WORLD_SIZE has expected value', () => {
      expect(WORLD_SIZE).toBe(2000);
    });
  });

  describe('Food Configuration', () => {
    test('FOOD_SIZE is defined and positive', () => {
      expect(FOOD_SIZE).toBeDefined();
      expect(typeof FOOD_SIZE).toBe('number');
      expect(FOOD_SIZE).toBeGreaterThan(0);
    });

    test('FOOD_SIZE has expected value', () => {
      expect(FOOD_SIZE).toBe(5);
    });

    test('FOOD_SCORE is defined and positive', () => {
      expect(FOOD_SCORE).toBeDefined();
      expect(typeof FOOD_SCORE).toBe('number');
      expect(FOOD_SCORE).toBeGreaterThan(0);
    });

    test('FOOD_SCORE has expected value', () => {
      expect(FOOD_SCORE).toBe(10);
    });

    test('FOOD_COUNT is defined and positive', () => {
      expect(FOOD_COUNT).toBeDefined();
      expect(typeof FOOD_COUNT).toBe('number');
      expect(FOOD_COUNT).toBeGreaterThan(0);
    });

    test('FOOD_COUNT has expected value', () => {
      expect(FOOD_COUNT).toBe(100);
    });
  });

  describe('Score Configuration', () => {
    test('STARTING_SCORE is defined and positive', () => {
      expect(STARTING_SCORE).toBeDefined();
      expect(typeof STARTING_SCORE).toBe('number');
      expect(STARTING_SCORE).toBeGreaterThan(0);
    });

    test('STARTING_SCORE has expected value', () => {
      expect(STARTING_SCORE).toBe(100);
    });

    test('AI_STARTING_SCORE is defined and positive', () => {
      expect(AI_STARTING_SCORE).toBeDefined();
      expect(typeof AI_STARTING_SCORE).toBe('number');
      expect(AI_STARTING_SCORE).toBeGreaterThan(0);
    });

    test('AI_STARTING_SCORE has expected value', () => {
      expect(AI_STARTING_SCORE).toBe(50);
    });

    test('AI_STARTING_SCORE is less than or equal to STARTING_SCORE', () => {
      expect(AI_STARTING_SCORE).toBeLessThanOrEqual(STARTING_SCORE);
    });
  });

  describe('AI Configuration', () => {
    test('AI_COUNT is defined and positive', () => {
      expect(AI_COUNT).toBeDefined();
      expect(typeof AI_COUNT).toBe('number');
      expect(AI_COUNT).toBeGreaterThan(0);
    });

    test('AI_COUNT has expected value', () => {
      expect(AI_COUNT).toBe(10);
    });
  });

  describe('Collision Configuration', () => {
    test('COLLISION_THRESHOLD is defined and greater than 1', () => {
      expect(COLLISION_THRESHOLD).toBeDefined();
      expect(typeof COLLISION_THRESHOLD).toBe('number');
      expect(COLLISION_THRESHOLD).toBeGreaterThan(1);
    });

    test('COLLISION_THRESHOLD has expected value', () => {
      expect(COLLISION_THRESHOLD).toBe(1.1);
    });
  });

  describe('Split Mechanics Configuration', () => {
    test('MIN_SPLIT_SCORE is defined and positive', () => {
      expect(MIN_SPLIT_SCORE).toBeDefined();
      expect(typeof MIN_SPLIT_SCORE).toBe('number');
      expect(MIN_SPLIT_SCORE).toBeGreaterThan(0);
    });

    test('MIN_SPLIT_SCORE has expected value', () => {
      expect(MIN_SPLIT_SCORE).toBe(40);
    });

    test('SPLIT_VELOCITY is defined and positive', () => {
      expect(SPLIT_VELOCITY).toBeDefined();
      expect(typeof SPLIT_VELOCITY).toBe('number');
      expect(SPLIT_VELOCITY).toBeGreaterThan(0);
    });

    test('SPLIT_VELOCITY has expected value', () => {
      expect(SPLIT_VELOCITY).toBe(12);
    });

    test('MAX_PLAYER_CELLS is defined and positive', () => {
      expect(MAX_PLAYER_CELLS).toBeDefined();
      expect(typeof MAX_PLAYER_CELLS).toBe('number');
      expect(MAX_PLAYER_CELLS).toBeGreaterThan(0);
    });

    test('MAX_PLAYER_CELLS has expected value', () => {
      expect(MAX_PLAYER_CELLS).toBe(16);
    });

    test('SPLIT_COOLDOWN is defined and positive', () => {
      expect(SPLIT_COOLDOWN).toBeDefined();
      expect(typeof SPLIT_COOLDOWN).toBe('number');
      expect(SPLIT_COOLDOWN).toBeGreaterThan(0);
    });

    test('SPLIT_COOLDOWN has expected value', () => {
      expect(SPLIT_COOLDOWN).toBe(5000);
    });
  });

  describe('Merge Mechanics Configuration', () => {
    test('MERGE_DISTANCE is defined and positive', () => {
      expect(MERGE_DISTANCE).toBeDefined();
      expect(typeof MERGE_DISTANCE).toBe('number');
      expect(MERGE_DISTANCE).toBeGreaterThan(0);
    });

    test('MERGE_DISTANCE has expected value', () => {
      expect(MERGE_DISTANCE).toBe(2);
    });

    test('MERGE_COOLDOWN is defined and positive', () => {
      expect(MERGE_COOLDOWN).toBeDefined();
      expect(typeof MERGE_COOLDOWN).toBe('number');
      expect(MERGE_COOLDOWN).toBeGreaterThan(0);
    });

    test('MERGE_COOLDOWN has expected value', () => {
      expect(MERGE_COOLDOWN).toBe(10000);
    });

    test('MERGE_FORCE is defined and positive', () => {
      expect(MERGE_FORCE).toBeDefined();
      expect(typeof MERGE_FORCE).toBe('number');
      expect(MERGE_FORCE).toBeGreaterThan(0);
    });

    test('MERGE_FORCE has expected value', () => {
      expect(MERGE_FORCE).toBe(0.3);
    });

    test('MERGE_START_FORCE is defined and positive', () => {
      expect(MERGE_START_FORCE).toBeDefined();
      expect(typeof MERGE_START_FORCE).toBe('number');
      expect(MERGE_START_FORCE).toBeGreaterThan(0);
    });

    test('MERGE_START_FORCE has expected value', () => {
      expect(MERGE_START_FORCE).toBe(0.1);
    });

    test('MERGE_START_FORCE is less than MERGE_FORCE', () => {
      expect(MERGE_START_FORCE).toBeLessThan(MERGE_FORCE);
    });
  });

  describe('Colors Configuration', () => {
    test('COLORS is defined', () => {
      expect(COLORS).toBeDefined();
      expect(typeof COLORS).toBe('object');
    });

    test('COLORS.PLAYER is defined and is a string', () => {
      expect(COLORS.PLAYER).toBeDefined();
      expect(typeof COLORS.PLAYER).toBe('string');
    });

    test('COLORS.PLAYER has expected value', () => {
      expect(COLORS.PLAYER).toBe('#008080');
    });

    test('COLORS.MINIMAP is defined', () => {
      expect(COLORS.MINIMAP).toBeDefined();
      expect(typeof COLORS.MINIMAP).toBe('object');
    });

    test('COLORS.MINIMAP.PLAYER is defined and is a string', () => {
      expect(COLORS.MINIMAP.PLAYER).toBeDefined();
      expect(typeof COLORS.MINIMAP.PLAYER).toBe('string');
    });

    test('COLORS.MINIMAP.PLAYER has expected value', () => {
      expect(COLORS.MINIMAP.PLAYER).toBe('#4CAF50');
    });

    test('COLORS.MINIMAP.TOP_PLAYER is defined and is a string', () => {
      expect(COLORS.MINIMAP.TOP_PLAYER).toBeDefined();
      expect(typeof COLORS.MINIMAP.TOP_PLAYER).toBe('string');
    });

    test('COLORS.MINIMAP.TOP_PLAYER has expected value', () => {
      expect(COLORS.MINIMAP.TOP_PLAYER).toBe('#FFC107');
    });

    test('COLORS.MINIMAP.OTHER is defined and is a string', () => {
      expect(COLORS.MINIMAP.OTHER).toBeDefined();
      expect(typeof COLORS.MINIMAP.OTHER).toBe('string');
    });

    test('COLORS.MINIMAP.OTHER has expected value', () => {
      expect(COLORS.MINIMAP.OTHER).toBe('rgba(255, 255, 255, 0.3)');
    });
  });

  describe('Configuration Consistency', () => {
    test('MIN_SPLIT_SCORE is less than STARTING_SCORE', () => {
      expect(MIN_SPLIT_SCORE).toBeLessThan(STARTING_SCORE);
    });

    test('MERGE_COOLDOWN is greater than SPLIT_COOLDOWN', () => {
      expect(MERGE_COOLDOWN).toBeGreaterThan(SPLIT_COOLDOWN);
    });

    test('FOOD_SIZE is smaller than typical cell size', () => {
      const typicalCellSize = Math.sqrt(STARTING_SCORE) + 20;
      expect(FOOD_SIZE).toBeLessThan(typicalCellSize);
    });
  });
});
