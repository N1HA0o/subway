// Dust particles system for light beam effects
class ParticleSystem {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        this.particles = [];

        this.init();
    }

    init() {
        // Create dust particles
        for (let i = 0; i < CONFIG.LIGHT.DUST_PARTICLE_COUNT; i++) {
            this.createParticle();
        }

        this.app.stage.addChild(this.container);
    }

    createParticle() {
        const particle = new PIXI.Graphics();
        particle.beginFill(0xffffff, 0.6);
        particle.drawCircle(0, 0, Math.random() * 2 + 1);
        particle.endFill();

        // Random position in light beam area
        particle.x = CONFIG.SUBWAY.WINDOW_X + Math.random() * CONFIG.SUBWAY.WINDOW_WIDTH;
        particle.y = CONFIG.SUBWAY.WINDOW_Y + Math.random() * (CONFIG.CANVAS_HEIGHT - CONFIG.SUBWAY.WINDOW_Y);

        // Movement properties
        particle.velocityY = Math.random() * 0.5 + 0.2;
        particle.velocityX = (Math.random() - 0.5) * 0.3;
        particle.drift = Math.random() * Math.PI * 2;
        particle.alpha = 0;
        particle.baseAlpha = Math.random() * 0.3 + 0.2;

        this.container.addChild(particle);
        this.particles.push(particle);
    }

    update(deltaTime, lightIntensity) {
        // Only show particles when light is active
        const targetAlpha = lightIntensity > 0.1 ? 1 : 0;

        this.particles.forEach((particle, index) => {
            // Fade in/out based on light
            particle.alpha += (targetAlpha * particle.baseAlpha - particle.alpha) * 0.05;

            if (lightIntensity > 0.1) {
                // Update position
                particle.x += particle.velocityX + Math.sin(particle.drift) * 0.2;
                particle.y += particle.velocityY;

                // Drift animation
                particle.drift += 0.02;

                // Reset if out of bounds
                if (particle.y > CONFIG.CANVAS_HEIGHT) {
                    particle.y = CONFIG.SUBWAY.WINDOW_Y;
                    particle.x = CONFIG.SUBWAY.WINDOW_X + Math.random() * CONFIG.SUBWAY.WINDOW_WIDTH;
                }

                // Keep within light beam horizontally
                if (particle.x < CONFIG.SUBWAY.WINDOW_X - 100) {
                    particle.velocityX += 0.1;
                } else if (particle.x > CONFIG.SUBWAY.WINDOW_X + CONFIG.SUBWAY.WINDOW_WIDTH + 100) {
                    particle.velocityX -= 0.1;
                }

                // Clamp velocity
                particle.velocityX = Math.max(-0.5, Math.min(0.5, particle.velocityX));
            }
        });
    }

    reset() {
        this.particles.forEach(particle => {
            particle.alpha = 0;
        });
    }
}
