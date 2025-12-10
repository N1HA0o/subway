// Main game class coordinating all systems
class Game {
    constructor() {
        this.app = null;
        this.scene = null;
        this.character = null;
        this.lighting = null;
        this.particles = null;
        this.gestureDetector = null;
        this.audioSystem = null;

        // State
        this.isRunning = false;
        this.lastTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;

        // Subway sound tracking
        this.lastSubwayIntensity = 0;
        this.subwaySoundPlayed = false;
    }

    async initialize() {
        try {
            // Initialize PixiJS
            this.app = new PIXI.Application({
                width: CONFIG.CANVAS_WIDTH,
                height: CONFIG.CANVAS_HEIGHT,
                backgroundColor: CONFIG.COLORS.BACKGROUND,
                antialias: true,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true
            });

            // Add canvas to DOM
            const canvas = document.getElementById('game-canvas');
            canvas.parentElement.replaceChild(this.app.view, canvas);
            this.app.view.id = 'game-canvas';

            // Initialize systems
            this.scene = new Scene(this.app);
            this.lighting = new SubwayLighting(this.app);
            this.particles = new ParticleSystem(this.app);
            this.character = new Character(this.app);

            // Initialize gesture detector
            this.gestureDetector = new GestureDetector();
            const gestureInitialized = await this.gestureDetector.initialize();

            if (!gestureInitialized) {
                console.warn('Gesture detection failed to initialize');
            }

            // Setup gesture callback
            this.gestureDetector.onGestureChange = (gesture) => {
                if (CONFIG.DEBUG) {
                    this.updateDebugGesture(gesture);
                }
            };

            // Initialize audio
            this.audioSystem = new AudioSystem();
            await this.audioSystem.initialize();

            // Start game loop
            this.app.ticker.add(this.update.bind(this));

            console.log('Game initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize game:', error);
            return false;
        }
    }

    update(delta) {
        if (!this.isRunning) return;

        const now = performance.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        // Update FPS counter
        this.updateFPS();

        // Get current gesture
        const currentGesture = this.gestureDetector.getCurrentGesture();

        // Update all systems
        this.lighting.update(deltaTime);
        this.character.update(deltaTime, currentGesture);
        this.particles.update(deltaTime, this.lighting.getIntensity());
        this.scene.update(deltaTime, this.lighting.getIntensity());

        // Apply lighting to character
        const lightPos = this.lighting.getLightPosition();
        this.character.applyLight(this.lighting.getIntensity(), lightPos.x);

        // Play subway sound when light reaches certain intensity
        const currentIntensity = this.lighting.getIntensity();
        if (currentIntensity > 0.3 && this.lastSubwayIntensity <= 0.3 && !this.subwaySoundPlayed) {
            this.audioSystem.playSubwaySound(currentIntensity);
            this.subwaySoundPlayed = true;
        } else if (currentIntensity < 0.1) {
            this.subwaySoundPlayed = false;
        }
        this.lastSubwayIntensity = currentIntensity;
    }

    updateFPS() {
        this.frameCount++;
        const now = performance.now();

        if (now - this.lastFpsUpdate > 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (now - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = now;

            if (CONFIG.DEBUG) {
                this.updateDebugFPS();
            }
        }
    }

    updateDebugFPS() {
        const fpsElement = document.getElementById('fps-counter');
        if (fpsElement) {
            fpsElement.textContent = `FPS: ${this.fps}`;
        }
    }

    updateDebugGesture(gesture) {
        const gestureElement = document.getElementById('gesture-status');
        if (gestureElement) {
            let gestureText = '无';
            if (gesture === 'left') gestureText = '← 左';
            else if (gesture === 'right') gestureText = '右 →';

            gestureElement.textContent = `手势: ${gestureText}`;
        }
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.lastFpsUpdate = performance.now();
        console.log('Game started');
    }

    stop() {
        this.isRunning = false;
        console.log('Game stopped');
    }

    cleanup() {
        this.stop();

        if (this.gestureDetector) {
            this.gestureDetector.cleanup();
        }

        if (this.audioSystem) {
            this.audioSystem.cleanup();
        }

        if (this.app) {
            this.app.destroy(true);
        }
    }
}
