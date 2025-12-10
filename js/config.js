// Game Configuration
const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 1920,
    CANVAS_HEIGHT: 1080,

    // Character settings
    CHARACTER: {
        WIDTH: 60,
        HEIGHT: 120,
        INITIAL_X: 400,
        INITIAL_Y: 700,
        MOVE_SPEED: 3,
        ACCELERATION: 0.3,
        DECELERATION: 0.85,
        MAX_VELOCITY: 5
    },

    // Subway light settings
    SUBWAY: {
        MIN_INTERVAL: 14000,  // 14 seconds
        MAX_INTERVAL: 20000,  // 20 seconds
        LIGHT_DURATION: 5000, // 5 seconds total
        APPROACH_TIME: 1000,  // 1 second approach
        PEAK_TIME: 3000,      // 3 seconds peak light
        FADE_TIME: 1000,      // 1 second fade
        WINDOW_X: 1400,
        WINDOW_Y: 300,
        WINDOW_WIDTH: 400,
        WINDOW_HEIGHT: 600
    },

    // Lighting settings
    LIGHT: {
        AMBIENT_COLOR: 0x0a0a0a,
        SUBWAY_COLOR: 0xffffdd,
        SUBWAY_MAX_INTENSITY: 0.9,
        SUBWAY_MIN_INTENSITY: 0.0,
        CHARACTER_ILLUMINATION: 0x808080,
        DUST_PARTICLE_COUNT: 50
    },

    // Gesture detection settings
    GESTURE: {
        DETECTION_THRESHOLD: 0.7,
        MIN_HOLD_TIME: 100,      // 100ms minimum hold
        HAND_POSITION_THRESHOLD: 0.3,  // 30% from center
        DEBOUNCE_TIME: 50
    },

    // Colors (LIMBO style)
    COLORS: {
        BACKGROUND: 0x000000,
        CHARACTER_SHADOW: 0x0a0a0a,
        FOREGROUND: 0x1a1a1a,
        HIGHLIGHT: 0xffffff
    },

    // Debug
    DEBUG: true
};
