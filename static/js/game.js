import { gameState, mouse } from './gameState.js';
import { initRenderer, resizeCanvas, drawGame, drawMinimap, updateLeaderboard } from './renderer.js';
import { updatePlayer, updateAI, initEntities, handlePlayerSplit } from './entities.js';
import { handleFoodCollisions, handlePlayerAICollisions, handleAIAICollisions, respawnEntities } from './collisions.js';
import { initUI } from './ui.js';
import { INVINCIBILITY_DURATION, INVINCIBILITY_KEY, INVINCIBILITY_COOLDOWN } from './config.js';

function toggleInvincibility() {
    const now = Date.now();
    
    gameState.playerCells.forEach(cell => {
        if (cell.invincible) {
            console.log('Invincibility already active');
            return;
        }
        
        if (cell.lastInvincibilityUse !== 0 && now - cell.lastInvincibilityUse < INVINCIBILITY_COOLDOWN) {
            const remainingCooldown = Math.ceil((INVINCIBILITY_COOLDOWN - (now - cell.lastInvincibilityUse)) / 1000);
            console.log(`Invincibility on cooldown for ${remainingCooldown} more seconds`);
            return;
        }
        
        cell.invincible = true;
        cell.invincibilityEndTime = now + INVINCIBILITY_DURATION;
        cell.lastInvincibilityUse = now;
        console.log('Invincibility activated!');
    });
}

function setupInputHandlers() {
    const canvas = document.getElementById('gameCanvas');
    
    // Mouse movement
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Mouse click for splitting
    canvas.addEventListener('click', (e) => {
        handlePlayerSplit();
    });

    // Window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === INVINCIBILITY_KEY) {
            toggleInvincibility();
        }
    });
}

function checkCollisions() {
    handleFoodCollisions();
    handlePlayerAICollisions();
    handleAIAICollisions();
    respawnEntities();
}

function verifyGameState() {
    console.log('Verifying game state...');
    console.log('Player cells:', gameState.playerCells);
    console.log('AI players:', gameState.aiPlayers);
    console.log('Food count:', gameState.food.length);

    if (gameState.playerCells.length === 0) {
        console.error('No player cells found!');
    }
    if (gameState.aiPlayers.length === 0) {
        console.error('No AI players found!');
    }
    if (gameState.food.length === 0) {
        console.error('No food found!');
    }
}

function updateInvincibility() {
    const now = Date.now();
    gameState.playerCells.forEach(cell => {
        if (cell.invincible && now >= cell.invincibilityEndTime) {
            cell.invincible = false;
            console.log('Invincibility expired');
        }
    });
}

function gameLoop() {
    updatePlayer();
    updateInvincibility();
    updateAI();
    checkCollisions();
    updateLeaderboard();
    drawGame();
    drawMinimap();
    requestAnimationFrame(gameLoop);
}

async function initGame() {
    try {
        console.log('Initializing game...');
        
        // Get DOM elements
        const elements = {
            gameCanvas: document.getElementById('gameCanvas'),
            minimapCanvas: document.getElementById('minimap'),
            scoreElement: document.getElementById('score'),
            leaderboardContent: document.getElementById('leaderboard-content')
        };

        // Verify all elements are found
        Object.entries(elements).forEach(([key, element]) => {
            if (!element) {
                throw new Error(`Could not find element: ${key}`);
            }
        });

        console.log('DOM elements found');

        // Initialize game components in order
        initRenderer(elements);
        console.log('Renderer initialized');
        
        setupInputHandlers();
        console.log('Input handlers set up');
        
        initEntities();
        console.log('Entities initialized');

        initUI();
        console.log('UI initialized');

        // Verify game state
        verifyGameState();

        // Start game loop
        console.log('Starting game loop');
        gameLoop();
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

// Start the game when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
