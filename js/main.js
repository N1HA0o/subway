// Application entry point
let game = null;

// Loading progress
let loadingProgress = 0;

// UI elements
const loadingScreen = document.getElementById('loading-screen');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const loadingBar = document.querySelector('.loading-progress');

// Initialize on page load
window.addEventListener('load', async () => {
    console.log('阈光之旅 - Threshold Light Journey');
    console.log('Loading...');

    // Simulate loading progress
    await simulateLoading();

    // Show start screen
    fadeOut(loadingScreen, () => {
        loadingScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });

    // Setup start button
    startButton.addEventListener('click', startGame);
});

async function simulateLoading() {
    // Simulate resource loading
    const steps = [
        { name: 'PixiJS', duration: 300 },
        { name: 'MediaPipe', duration: 500 },
        { name: '场景资源', duration: 400 },
        { name: '音频系统', duration: 300 }
    ];

    let progress = 0;
    const progressPerStep = 100 / steps.length;

    for (const step of steps) {
        await delay(step.duration);
        progress += progressPerStep;
        updateLoadingBar(progress);
        console.log(`Loaded: ${step.name}`);
    }
}

function updateLoadingBar(progress) {
    loadingBar.style.width = `${progress}%`;
}

async function startGame() {
    console.log('Starting game...');

    // Disable start button
    startButton.disabled = true;
    startButton.textContent = '初始化中...';

    try {
        // Create game instance
        game = new Game();

        // Initialize game systems
        const initialized = await game.initialize();

        if (!initialized) {
            throw new Error('Game initialization failed');
        }

        // Hide start screen, show game
        fadeOut(startScreen, () => {
            startScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');

            // Start game loop
            game.start();

            console.log('Game running!');
        });

    } catch (error) {
        console.error('Failed to start game:', error);

        // Show error message
        startButton.textContent = '启动失败';
        startButton.style.background = '#ff4444';

        // Re-enable button for retry
        setTimeout(() => {
            startButton.disabled = false;
            startButton.textContent = '重试';
            startButton.style.background = '#fff';
        }, 2000);
    }
}

// Utility functions
function fadeOut(element, callback) {
    element.classList.add('fade-out');
    setTimeout(() => {
        if (callback) callback();
    }, 500);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (game) {
        game.cleanup();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (game && game.app) {
        // Maintain aspect ratio
        const canvas = game.app.view;
        const windowRatio = window.innerWidth / window.innerHeight;
        const gameRatio = CONFIG.CANVAS_WIDTH / CONFIG.CANVAS_HEIGHT;

        if (windowRatio > gameRatio) {
            canvas.style.height = '100vh';
            canvas.style.width = 'auto';
        } else {
            canvas.style.width = '100vw';
            canvas.style.height = 'auto';
        }
    }
});

// Keyboard shortcuts for debug
if (CONFIG.DEBUG) {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'd') {
            const debugOverlay = document.getElementById('debug-overlay');
            debugOverlay.style.display = debugOverlay.style.display === 'none' ? 'block' : 'none';
        }
    });
}
