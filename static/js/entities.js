import { gameState, mouse } from './gameState.js';
import { getSize, getRandomPosition, calculateCenterOfMass, getDistance } from './utils.js';
import { 
    WORLD_SIZE, 
    FOOD_COUNT, 
    AI_COUNT, 
    MIN_SPLIT_SCORE, 
    SPLIT_VELOCITY, 
    MAX_PLAYER_CELLS,
    AI_STARTING_SCORE,
    MERGE_COOLDOWN,
    MERGE_DISTANCE,
    MERGE_FORCE,
    MERGE_START_FORCE
} from './config.js';

const AI_NAMES = [
    'Cursor',
    'Zed',
    'VSCode',
    'Visual Studio',
    'Eclipse',
    'JetBrains',
    'XCode',
    'Sublime',
    'Neovim',
    'Emacs'
];

// Function to get an unused AI name
function getUnusedAIName() {
    const usedNames = new Set(gameState.aiPlayers.map(ai => ai.name));
    return AI_NAMES.find(name => !usedNames.has(name)) || AI_NAMES[0];
}

function checkCellMerging(cell1, cell2, now) {
    const distance = getDistance(cell1, cell2);
    const cell1Size = getSize(cell1.score);
    const cell2Size = getSize(cell2.score);
    const minMergeDistance = (cell1Size + cell2Size) * MERGE_DISTANCE;
    const minDistance = cell1Size + cell2Size;

    const timeSinceSplit1 = now - (cell1.splitTime || 0);
    const timeSinceSplit2 = now - (cell2.splitTime || 0);
    const canMerge = timeSinceSplit1 > MERGE_COOLDOWN && timeSinceSplit2 > MERGE_COOLDOWN;

    return {
        distance,
        minMergeDistance,
        minDistance,
        canMerge,
        shouldMerge: distance < minMergeDistance && canMerge && distance < minDistance * 0.5
    };
}

function calculateCellForces(cell1, cell2, mergeInfo) {
    const dx = cell2.x - cell1.x;
    const dy = cell2.y - cell1.y;
    const { distance, minMergeDistance, minDistance, canMerge } = mergeInfo;

    if (distance < minMergeDistance && canMerge && distance >= minDistance * 0.5) {
        const force = MERGE_FORCE;
        const factor = force / Math.max(1, distance);
        return { dx: dx * factor, dy: dy * factor };
    }

    if (distance < minDistance) {
        const repulsionStrength = 0.3;
        const repulsionFactor = (minDistance - distance) / minDistance * repulsionStrength;
        return { dx: -dx * repulsionFactor, dy: -dy * repulsionFactor };
    }

    if (distance > minDistance) {
        const force = canMerge ? MERGE_FORCE : MERGE_START_FORCE;
        const factor = force / Math.max(1, distance);
        return { dx: dx * factor, dy: dy * factor };
    }

    return { dx: 0, dy: 0 };
}

function mergeCellGroups(cellsToMerge) {
    if (cellsToMerge.length === 0) return;

    cellsToMerge.sort((a, b) => b - a);
    const uniqueIndices = [...new Set(cellsToMerge)];
    
    const groups = [];
    let currentGroup = [uniqueIndices[0]];
    
    for (let i = 1; i < uniqueIndices.length; i++) {
        const current = uniqueIndices[i];
        const prev = currentGroup[currentGroup.length - 1];
        
        if (prev - current === 1) {
            currentGroup.push(current);
        } else {
            groups.push(currentGroup);
            currentGroup = [current];
        }
    }
    groups.push(currentGroup);

    groups.forEach(group => {
        const cells = group.map(index => gameState.playerCells[index]);
        const totalScore = cells.reduce((sum, cell) => sum + cell.score, 0);
        const weightedX = cells.reduce((sum, cell) => sum + cell.x * cell.score, 0) / totalScore;
        const weightedY = cells.reduce((sum, cell) => sum + cell.y * cell.score, 0) / totalScore;
        const avgVelocityX = cells.reduce((sum, cell) => sum + cell.velocityX * cell.score, 0) / totalScore;
        const avgVelocityY = cells.reduce((sum, cell) => sum + cell.velocityY * cell.score, 0) / totalScore;

        group.sort((a, b) => b - a).forEach(index => {
            gameState.playerCells.splice(index, 1);
        });

        gameState.playerCells.push({
            x: weightedX,
            y: weightedY,
            score: totalScore,
            velocityX: avgVelocityX,
            velocityY: avgVelocityY,
            splitTime: 0
        });
    });
}

function updateCellMerging() {
    const now = Date.now();
    const cellsToMerge = [];

    for (let i = 0; i < gameState.playerCells.length; i++) {
        if (cellsToMerge.includes(i)) continue;
        const cell1 = gameState.playerCells[i];

        for (let j = i + 1; j < gameState.playerCells.length; j++) {
            if (cellsToMerge.includes(j)) continue;
            const cell2 = gameState.playerCells[j];

            const mergeInfo = checkCellMerging(cell1, cell2, now);
            
            if (mergeInfo.shouldMerge) {
                cellsToMerge.push(i, j);
            } else {
                const forces = calculateCellForces(cell1, cell2, mergeInfo);
                cell1.velocityX += forces.dx;
                cell1.velocityY += forces.dy;
                cell2.velocityX -= forces.dx;
                cell2.velocityY -= forces.dy;
            }
        }
    }

    mergeCellGroups(cellsToMerge);
}

export function updatePlayer() {
    const dx = mouse.x - window.innerWidth / 2;
    const dy = mouse.y - window.innerHeight / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
        const direction = {
            x: dx / distance,
            y: dy / distance
        };

        // Update each cell
        gameState.playerCells.forEach(cell => {
            // Base speed is inversely proportional to cell size
            const speed = 5 / (getSize(cell.score) / 20);

            // Update velocity (with inertia)
            cell.velocityX = cell.velocityX * 0.9 + direction.x * speed * 0.1;
            cell.velocityY = cell.velocityY * 0.9 + direction.y * speed * 0.1;

            // Update position
            cell.x = Math.max(0, Math.min(WORLD_SIZE, cell.x + cell.velocityX));
            cell.y = Math.max(0, Math.min(WORLD_SIZE, cell.y + cell.velocityY));
        });
    }

    // Handle cell merging
    updateCellMerging();
}

export function splitPlayerCell(cell) {
    if (cell.score < MIN_SPLIT_SCORE || 
        gameState.playerCells.length >= MAX_PLAYER_CELLS) {
        return;
    }

    // Calculate split direction (towards mouse)
    const dx = mouse.x - window.innerWidth / 2;
    const dy = mouse.y - window.innerHeight / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return;

    const direction = {
        x: dx / distance,
        y: dy / distance
    };

    const now = Date.now();

    // Create new cell
    const newCell = {
        x: cell.x,
        y: cell.y,
        score: cell.score / 2,
        velocityX: direction.x * SPLIT_VELOCITY,
        velocityY: direction.y * SPLIT_VELOCITY,
        splitTime: now
    };

    // Update original cell
    cell.score /= 2;
    cell.velocityX = -direction.x * SPLIT_VELOCITY * 0.5;
    cell.velocityY = -direction.y * SPLIT_VELOCITY * 0.5;
    cell.splitTime = now;

    // Add new cell
    gameState.playerCells.push(newCell);
}

export function handlePlayerSplit() {
    // Split each cell that's large enough
    const cellsToSplit = gameState.playerCells.filter(cell => 
        cell.score >= MIN_SPLIT_SCORE && 
        gameState.playerCells.length < MAX_PLAYER_CELLS
    );

    cellsToSplit.forEach(cell => splitPlayerCell(cell));
}

export function updateAI() {
    gameState.aiPlayers.forEach(ai => {
        if (Math.random() < 0.02) {
            ai.direction = Math.random() * Math.PI * 2;
        }

        const speed = 5 / (getSize(ai.score) / 20);
        ai.x += Math.cos(ai.direction) * speed;
        ai.y += Math.sin(ai.direction) * speed;

        ai.x = Math.max(0, Math.min(WORLD_SIZE, ai.x));
        ai.y = Math.max(0, Math.min(WORLD_SIZE, ai.y));
    });
}

export function initEntities() {
    // Clear existing entities
    gameState.food = [];
    gameState.aiPlayers = [];
    
    console.log('Initializing entities...');

    // Initialize food
    for (let i = 0; i < FOOD_COUNT; i++) {
        const pos = getRandomPosition();
        gameState.food.push({
            x: pos.x,
            y: pos.y,
            color: `hsl(${Math.random() * 360}, 50%, 50%)`
        });
    }

    // Initialize AI players
    for (let i = 0; i < AI_COUNT; i++) {
        const pos = getRandomPosition();
        const ai = {
            x: pos.x,
            y: pos.y,
            score: AI_STARTING_SCORE,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            direction: Math.random() * Math.PI * 2,
            name: getUnusedAIName()
        };
        gameState.aiPlayers.push(ai);
    }

    console.log('Entities initialized:', {
        foodCount: gameState.food.length,
        aiCount: gameState.aiPlayers.length,
        playerCells: gameState.playerCells.length
    });
}

// Export for use in other modules
export function respawnAI() {
    const pos = getRandomPosition();
    const name = getUnusedAIName();
    
    return {
        x: pos.x,
        y: pos.y,
        score: AI_STARTING_SCORE,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        direction: Math.random() * Math.PI * 2,
        name: name
    };
}
