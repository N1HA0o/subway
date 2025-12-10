// Character class with animation state machine
class Character {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        this.sprite = null;
        this.shadow = null;

        // Physics
        this.x = CONFIG.CHARACTER.INITIAL_X;
        this.y = CONFIG.CHARACTER.INITIAL_Y;
        this.velocityX = 0;
        this.targetVelocityX = 0;

        // Animation state
        this.state = 'idle'; // idle, walk_left, walk_right
        this.animationTime = 0;

        // Visual feedback
        this.gestureIndicator = null;

        this.init();
    }

    init() {
        // Create character silhouette
        this.createSilhouette();

        // Create shadow
        this.createShadow();

        // Create gesture indicator
        this.createGestureIndicator();

        // Position container
        this.container.x = this.x;
        this.container.y = this.y;

        this.app.stage.addChild(this.container);
    }

    createSilhouette() {
        // Create a simple human silhouette
        const graphics = new PIXI.Graphics();

        // Head
        graphics.beginFill(0x000000);
        graphics.drawCircle(0, -90, 20);

        // Body
        graphics.drawRect(-15, -70, 30, 50);

        // Legs
        graphics.drawRect(-15, -20, 12, 40);
        graphics.drawRect(3, -20, 12, 40);

        // Arms (will animate)
        this.leftArm = new PIXI.Graphics();
        this.leftArm.beginFill(0x000000);
        this.leftArm.drawRect(-10, 0, 8, 35);
        this.leftArm.x = -15;
        this.leftArm.y = -60;

        this.rightArm = new PIXI.Graphics();
        this.rightArm.beginFill(0x000000);
        this.rightArm.drawRect(2, 0, 8, 35);
        this.rightArm.x = 15;
        this.rightArm.y = -60;

        graphics.endFill();

        // Create sprite from graphics
        const texture = this.app.renderer.generateTexture(graphics);
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5, 1);

        // Add arms to container
        this.container.addChild(this.leftArm);
        this.container.addChild(this.rightArm);
        this.container.addChild(this.sprite);

        // Store original alpha for lighting effects
        this.sprite.alpha = 1.0;
    }

    createShadow() {
        // Shadow beneath character
        this.shadow = new PIXI.Graphics();
        this.shadow.beginFill(0x000000, 0.3);
        this.shadow.drawEllipse(0, 10, 25, 8);
        this.shadow.endFill();

        this.container.addChild(this.shadow);
    }

    createGestureIndicator() {
        // Subtle indicator when gesture is detected
        this.gestureIndicator = new PIXI.Graphics();
        this.gestureIndicator.lineStyle(2, 0xffffff, 0.3);
        this.gestureIndicator.drawCircle(0, 0, 40);
        this.gestureIndicator.alpha = 0;

        this.container.addChild(this.gestureIndicator);
    }

    update(deltaTime, gesture) {
        // Update target velocity based on gesture
        if (gesture === 'left') {
            this.targetVelocityX = -CONFIG.CHARACTER.MAX_VELOCITY;
            this.changeState('walk_left');
            this.showGestureIndicator();
        } else if (gesture === 'right') {
            this.targetVelocityX = CONFIG.CHARACTER.MAX_VELOCITY;
            this.changeState('walk_right');
            this.showGestureIndicator();
        } else {
            this.targetVelocityX = 0;
            this.changeState('idle');
            this.hideGestureIndicator();
        }

        // Apply acceleration/deceleration
        if (Math.abs(this.velocityX - this.targetVelocityX) > 0.1) {
            const diff = this.targetVelocityX - this.velocityX;
            this.velocityX += diff * CONFIG.CHARACTER.ACCELERATION;
        } else {
            this.velocityX = this.targetVelocityX;
        }

        // Apply deceleration when no input
        if (this.targetVelocityX === 0) {
            this.velocityX *= CONFIG.CHARACTER.DECELERATION;
        }

        // Update position
        this.x += this.velocityX;

        // Clamp to screen bounds
        this.x = Math.max(100, Math.min(CONFIG.CANVAS_WIDTH - 100, this.x));

        // Update container position
        this.container.x = this.x;

        // Update animation
        this.updateAnimation(deltaTime);
    }

    changeState(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.animationTime = 0;
        }
    }

    updateAnimation(deltaTime) {
        this.animationTime += deltaTime;

        // Simple walk cycle animation
        if (this.state === 'walk_left' || this.state === 'walk_right') {
            const walkCycle = Math.sin(this.animationTime * 0.01) * 5;

            // Animate legs slightly
            this.sprite.rotation = walkCycle * 0.02;

            // Animate arms
            this.leftArm.rotation = walkCycle * 0.1;
            this.rightArm.rotation = -walkCycle * 0.1;

            // Slight vertical bob
            this.container.y = this.y + Math.abs(Math.sin(this.animationTime * 0.01)) * 3;
        } else {
            // Return to idle position
            this.sprite.rotation = 0;
            this.leftArm.rotation = 0;
            this.rightArm.rotation = 0;
            this.container.y = this.y;
        }
    }

    showGestureIndicator() {
        this.gestureIndicator.alpha = 0.3;
    }

    hideGestureIndicator() {
        this.gestureIndicator.alpha = 0;
    }

    // Apply lighting effect to character
    applyLight(intensity, lightX) {
        // Calculate how much light hits the character
        const distance = Math.abs(this.x - lightX);
        const maxDistance = 800;
        const distanceFactor = Math.max(0, 1 - distance / maxDistance);

        const lightAmount = intensity * distanceFactor;

        // Instead of pure white, use a gray tone for realism
        if (lightAmount > 0.1) {
            const grayValue = Math.floor(128 * lightAmount);
            const color = (grayValue << 16) | (grayValue << 8) | grayValue;

            this.sprite.tint = color;
            this.leftArm.tint = color;
            this.rightArm.tint = color;
        } else {
            // Pure black silhouette
            this.sprite.tint = 0x000000;
            this.leftArm.tint = 0x000000;
            this.rightArm.tint = 0x000000;
        }

        // Update shadow intensity
        this.shadow.alpha = 0.3 + lightAmount * 0.4;
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }
}
