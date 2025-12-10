// Scene rendering with LIMBO-style atmosphere
class Scene {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();

        // Layers for depth
        this.backgroundLayer = new PIXI.Container();
        this.midgroundLayer = new PIXI.Container();
        this.foregroundLayer = new PIXI.Container();

        this.init();
    }

    init() {
        // Build layers
        this.container.addChild(this.backgroundLayer);
        this.container.addChild(this.midgroundLayer);
        this.container.addChild(this.foregroundLayer);

        // Create scene elements
        this.createBackground();
        this.createChair();
        this.createFloor();
        this.createAtmosphericElements();

        this.app.stage.addChildAt(this.container, 0);
    }

    createBackground() {
        // Deep black background
        const bg = new PIXI.Graphics();
        bg.beginFill(CONFIG.COLORS.BACKGROUND);
        bg.drawRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        bg.endFill();

        this.backgroundLayer.addChild(bg);

        // Distant silhouettes for depth
        this.createDistantStructures();
    }

    createDistantStructures() {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x0a0a0a, 0.5);

        // Distant pillars/columns
        const pillarPositions = [200, 500, 1100, 1700];
        pillarPositions.forEach(x => {
            graphics.drawRect(x, 200, 40, 600);
        });

        graphics.endFill();
        this.backgroundLayer.addChild(graphics);
    }

    createChair() {
        // The chair where character wakes up
        const chair = new PIXI.Graphics();
        chair.beginFill(0x0a0a0a);

        // Chair back
        chair.drawRect(350, 650, 100, 15);
        chair.drawRect(350, 650, 15, 80);

        // Chair seat
        chair.drawRect(350, 730, 100, 15);

        // Chair legs
        chair.drawRect(350, 745, 10, 50);
        chair.drawRect(440, 745, 10, 50);

        chair.endFill();

        this.midgroundLayer.addChild(chair);
    }

    createFloor() {
        // Ground with subtle texture
        const floor = new PIXI.Graphics();

        // Main floor
        floor.beginFill(0x0a0a0a);
        floor.drawRect(0, 800, CONFIG.CANVAS_WIDTH, 280);
        floor.endFill();

        // Floor lines for perspective
        floor.lineStyle(1, 0x1a1a1a, 0.3);
        for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += 100) {
            floor.moveTo(x, 800);
            floor.lineTo(x + 50, CONFIG.CANVAS_HEIGHT);
        }

        this.midgroundLayer.addChild(floor);
    }

    createAtmosphericElements() {
        // Vignette effect
        this.createVignette();

        // Subtle wall textures
        this.createWallDetails();
    }

    createVignette() {
        const canvas = document.createElement('canvas');
        canvas.width = CONFIG.CANVAS_WIDTH;
        canvas.height = CONFIG.CANVAS_HEIGHT;
        const ctx = canvas.getContext('2d');

        // Radial gradient from center to edges
        const gradient = ctx.createRadialGradient(
            CONFIG.CANVAS_WIDTH / 2,
            CONFIG.CANVAS_HEIGHT / 2,
            200,
            CONFIG.CANVAS_WIDTH / 2,
            CONFIG.CANVAS_HEIGHT / 2,
            Math.max(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT)
        );

        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        const texture = PIXI.Texture.from(canvas);
        const vignette = new PIXI.Sprite(texture);
        vignette.blendMode = PIXI.BLEND_MODES.MULTIPLY;

        this.foregroundLayer.addChild(vignette);
    }

    createWallDetails() {
        const graphics = new PIXI.Graphics();

        // Horizontal lines suggesting tiled walls
        graphics.lineStyle(1, 0x0d0d0d, 0.3);
        for (let y = 200; y < 800; y += 50) {
            graphics.moveTo(0, y);
            graphics.lineTo(CONFIG.CANVAS_WIDTH, y);
        }

        // Vertical accent lines
        graphics.lineStyle(1, 0x0d0d0d, 0.2);
        for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += 150) {
            graphics.moveTo(x, 200);
            graphics.lineTo(x, 800);
        }

        this.backgroundLayer.addChild(graphics);
    }

    update(deltaTime, lightIntensity) {
        // Subtle atmospheric animations could go here
        // For now, the scene is mostly static
    }
}
