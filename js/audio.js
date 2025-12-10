// Audio system for ambient sounds
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.ambientOscillator = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.audioContext.destination);

            // Create ambient sound
            this.createAmbientSound();

            this.isInitialized = true;
            console.log('Audio system initialized');
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }

    createAmbientSound() {
        // Very low frequency hum for atmosphere
        this.ambientOscillator = this.audioContext.createOscillator();
        const ambientGain = this.audioContext.createGain();

        this.ambientOscillator.type = 'sine';
        this.ambientOscillator.frequency.value = 60;

        ambientGain.gain.value = 0.05;

        this.ambientOscillator.connect(ambientGain);
        ambientGain.connect(this.masterGain);

        this.ambientOscillator.start();
    }

    playSubwaySound(intensity) {
        if (!this.isInitialized) return;

        try {
            // Create a low rumble sound for subway passing
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 40 + Math.random() * 20;

            filter.type = 'lowpass';
            filter.frequency.value = 200;

            gainNode.gain.value = 0;

            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);

            // Fade in and out
            const now = this.audioContext.currentTime;
            const duration = 5;

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.2 * intensity, now + 1);
            gainNode.gain.linearRampToValueAtTime(0.2 * intensity, now + duration - 1);
            gainNode.gain.linearRampToValueAtTime(0, now + duration);

            oscillator.start(now);
            oscillator.stop(now + duration);
        } catch (error) {
            console.error('Failed to play subway sound:', error);
        }
    }

    cleanup() {
        if (this.ambientOscillator) {
            this.ambientOscillator.stop();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}
