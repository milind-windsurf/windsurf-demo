import { gameState, mouse } from './gameState.js';
import { initRenderer, resizeCanvas, drawGame, drawMinimap, updateLeaderboard } from './renderer.js';
import { updatePlayer, updateAI, initEntities, handlePlayerSplit } from './entities.js';
import { handleFoodCollisions, handlePlayerAICollisions, handleAIAICollisions, respawnEntities } from './collisions.js';
import { initUI } from './ui.js';
import { WORLD_SIZE } from './config.js';

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
}

function setupMinimapHandlers() {
    const minimapCanvas = document.getElementById('minimap');
    const gameCanvas = document.getElementById('gameCanvas');
    
    minimapCanvas.addEventListener('mousedown', (e) => {
        const rect = minimapCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const MINIMAP_SIZE = 150;
        const scale = MINIMAP_SIZE / WORLD_SIZE;
        const worldX = x / scale;
        const worldY = y / scale;
        
        gameState.camera.x = worldX - gameCanvas.width / 2;
        gameState.camera.y = worldY - gameCanvas.height / 2;
        
        gameState.minimapDrag.isDragging = true;
        gameState.minimapDrag.manualControl = true;
        
        e.preventDefault();
    });
    
    minimapCanvas.addEventListener('mousemove', (e) => {
        if (!gameState.minimapDrag.isDragging) return;
        
        const rect = minimapCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const MINIMAP_SIZE = 150;
        const scale = MINIMAP_SIZE / WORLD_SIZE;
        const worldX = x / scale;
        const worldY = y / scale;
        
        gameState.camera.x = worldX - gameCanvas.width / 2;
        gameState.camera.y = worldY - gameCanvas.height / 2;
        
        e.preventDefault();
    });
    
    minimapCanvas.addEventListener('mouseup', () => {
        gameState.minimapDrag.isDragging = false;
    });
    
    minimapCanvas.addEventListener('mouseleave', () => {
        gameState.minimapDrag.isDragging = false;
    });
    
    minimapCanvas.addEventListener('dblclick', () => {
        gameState.minimapDrag.manualControl = false;
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

function gameLoop() {
    updatePlayer();
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
        
        setupMinimapHandlers();
        console.log('Minimap handlers set up');
        
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
