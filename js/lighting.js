// Subway lighting system with dynamic effects
class SubwayLighting {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();

        // Light state
        this.intensity = 0;
        this.isActive = false;
        this.phase = 'idle'; // idle, approaching, peak, fading

        // Timing
        this.nextSubwayTime = 0;
        this.phaseStartTime = 0;
        this.currentPhaseTime = 0;

        // Visual elements
        this.lightBeam = null;
        this.window = null;
        this.glowSprite = null;

        this.init();
        this.scheduleNextSubway();
    }

    init() {
        // Create subway window (always visible)
        this.createWindow();

        // Create light beam
        this.createLightBeam();

        this.app.stage.addChild(this.container);
    }

    createWindow() {
        const graphics = new PIXI.Graphics();

        // Window frame
        graphics.lineStyle(4, 0x1a1a1a, 1);
        graphics.beginFill(0x0a0a0a);
        graphics.drawRect(
            CONFIG.SUBWAY.WINDOW_X,
            CONFIG.SUBWAY.WINDOW_Y,
            CONFIG.SUBWAY.WINDOW_WIDTH,
            CONFIG.SUBWAY.WINDOW_HEIGHT
        );
        graphics.endFill();

        // Grid pattern on window
        graphics.lineStyle(1, 0x0a0a0a, 0.5);
        for (let i = 1; i < 3; i++) {
            const x = CONFIG.SUBWAY.WINDOW_X + (CONFIG.SUBWAY.WINDOW_WIDTH / 3) * i;
            graphics.moveTo(x, CONFIG.SUBWAY.WINDOW_Y);
            graphics.lineTo(x, CONFIG.SUBWAY.WINDOW_Y + CONFIG.SUBWAY.WINDOW_HEIGHT);
        }
        for (let i = 1; i < 4; i++) {
            const y = CONFIG.SUBWAY.WINDOW_Y + (CONFIG.SUBWAY.WINDOW_HEIGHT / 4) * i;
            graphics.moveTo(CONFIG.SUBWAY.WINDOW_X, y);
            graphics.lineTo(CONFIG.SUBWAY.WINDOW_X + CONFIG.SUBWAY.WINDOW_WIDTH, y);
        }

        this.window = graphics;
        this.container.addChild(this.window);
    }

    createLightBeam() {
        // Create gradient light beam
        const beamWidth = CONFIG.SUBWAY.WINDOW_WIDTH + 200;
        const beamHeight = CONFIG.CANVAS_HEIGHT;

        const canvas = document.createElement('canvas');
        canvas.width = beamWidth;
        canvas.height = beamHeight;
        const ctx = canvas.getContext('2d');

        // Create gradient from window to floor
        const gradient = ctx.createRadialGradient(
            beamWidth / 2, 0,
            50,
            beamWidth / 2, beamHeight,
            beamWidth
        );

        gradient.addColorStop(0, 'rgba(255, 255, 221, 0.9)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 221, 0.6)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 221, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 221, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, beamWidth, beamHeight);

        // Create sprite from canvas
        const texture = PIXI.Texture.from(canvas);
        this.lightBeam = new PIXI.Sprite(texture);
        this.lightBeam.x = CONFIG.SUBWAY.WINDOW_X + CONFIG.SUBWAY.WINDOW_WIDTH / 2 - beamWidth / 2;
        this.lightBeam.y = CONFIG.SUBWAY.WINDOW_Y;
        this.lightBeam.alpha = 0;
        this.lightBeam.blendMode = PIXI.BLEND_MODES.ADD;

        this.container.addChild(this.lightBeam);
    }

    scheduleNextSubway() {
        const interval = CONFIG.SUBWAY.MIN_INTERVAL +
            Math.random() * (CONFIG.SUBWAY.MAX_INTERVAL - CONFIG.SUBWAY.MIN_INTERVAL);
        this.nextSubwayTime = Date.now() + interval;

        if (CONFIG.DEBUG) {
            console.log(`Next subway in ${(interval / 1000).toFixed(1)}s`);
        }
    }

    update(deltaTime) {
        const now = Date.now();

        // Check if it's time for next subway
        if (!this.isActive && now >= this.nextSubwayTime) {
            this.startSubwaySequence();
        }

        // Update active sequence
        if (this.isActive) {
            this.updateSequence(now);
        }
    }

    startSubwaySequence() {
        this.isActive = true;
        this.phase = 'approaching';
        this.phaseStartTime = Date.now();

        if (CONFIG.DEBUG) {
            console.log('Subway sequence started');
        }
    }

    updateSequence(now) {
        const elapsed = now - this.phaseStartTime;

        switch (this.phase) {
            case 'approaching':
                // Gradually increase light from 0 to max
                this.intensity = Math.min(1, elapsed / CONFIG.SUBWAY.APPROACH_TIME);
                this.updateLightVisuals();

                if (elapsed >= CONFIG.SUBWAY.APPROACH_TIME) {
                    this.phase = 'peak';
                    this.phaseStartTime = now;
                }
                break;

            case 'peak':
                // Maintain maximum intensity
                this.intensity = 1.0;
                this.updateLightVisuals();

                if (elapsed >= CONFIG.SUBWAY.PEAK_TIME) {
                    this.phase = 'fading';
                    this.phaseStartTime = now;
                }
                break;

            case 'fading':
                // Gradually decrease light
                this.intensity = Math.max(0, 1 - (elapsed / CONFIG.SUBWAY.FADE_TIME));
                this.updateLightVisuals();

                if (elapsed >= CONFIG.SUBWAY.FADE_TIME) {
                    this.endSequence();
                }
                break;
        }
    }

    updateLightVisuals() {
        // Apply eased intensity for smoother transitions
        const easedIntensity = this.easeInOutCubic(this.intensity);

        // Update light beam alpha
        this.lightBeam.alpha = easedIntensity * CONFIG.LIGHT.SUBWAY_MAX_INTENSITY;

        // Update window glow
        const glowIntensity = easedIntensity * 0.5;
        this.window.tint = this.interpolateColor(
            CONFIG.COLORS.BACKGROUND,
            CONFIG.LIGHT.SUBWAY_COLOR,
            glowIntensity
        );
    }

    endSequence() {
        this.isActive = false;
        this.intensity = 0;
        this.phase = 'idle';
        this.lightBeam.alpha = 0;
        this.window.tint = 0xffffff;

        // Schedule next subway
        this.scheduleNextSubway();

        if (CONFIG.DEBUG) {
            console.log('Subway sequence ended');
        }
    }

    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    interpolateColor(color1, color2, factor) {
        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;

        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;

        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);

        return (r << 16) | (g << 8) | b;
    }

    getIntensity() {
        return this.intensity;
    }

    getLightPosition() {
        return {
            x: CONFIG.SUBWAY.WINDOW_X + CONFIG.SUBWAY.WINDOW_WIDTH / 2,
            y: CONFIG.SUBWAY.WINDOW_Y + CONFIG.SUBWAY.WINDOW_HEIGHT / 2
        };
    }
}
