interface CanvasElements {
    gameCanvas: HTMLCanvasElement;
    minimapCanvas: HTMLCanvasElement;
    scoreElement: HTMLElement;
    leaderboardContent: HTMLElement;
}
export declare function initRenderer(canvasElements: CanvasElements): void;
export declare function resizeCanvas(): void;
export declare function drawGame(): void;
export declare function drawMinimap(): void;
export declare function updateLeaderboard(): void;
export {};
