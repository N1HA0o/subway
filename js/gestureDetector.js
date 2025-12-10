// Gesture Detection using MediaPipe Hands
class GestureDetector {
    constructor() {
        this.hands = null;
        this.camera = null;
        this.videoElement = null;
        this.currentGesture = 'none';
        this.lastGestureTime = 0;
        this.gestureStartTime = 0;
        this.onGestureChange = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            this.videoElement = document.getElementById('camera-video');

            // Initialize MediaPipe Hands
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: CONFIG.GESTURE.DETECTION_THRESHOLD,
                minTrackingConfidence: CONFIG.GESTURE.DETECTION_THRESHOLD
            });

            this.hands.onResults(this.onResults.bind(this));

            // Setup camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 1280,
                    height: 720,
                    facingMode: 'user'
                }
            });

            this.videoElement.srcObject = stream;

            // Wait for video to be ready
            await new Promise((resolve) => {
                this.videoElement.onloadedmetadata = () => {
                    resolve();
                };
            });

            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    await this.hands.send({ image: this.videoElement });
                },
                width: 1280,
                height: 720
            });

            await this.camera.start();
            this.isInitialized = true;

            console.log('Gesture detector initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize gesture detector:', error);
            return false;
        }
    }

    onResults(results) {
        const now = Date.now();

        // Debounce gesture detection
        if (now - this.lastGestureTime < CONFIG.GESTURE.DEBOUNCE_TIME) {
            return;
        }

        let detectedGesture = 'none';

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // Analyze hand positions
            for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                const landmarks = results.multiHandLandmarks[i];
                const handedness = results.multiHandedness[i].label; // 'Left' or 'Right'

                // Get wrist and fingertip positions
                const wrist = landmarks[0];
                const indexTip = landmarks[8];
                const middleTip = landmarks[12];

                // Check if hand is extended (fingers pointing)
                const isExtended = this.isHandExtended(landmarks);

                if (isExtended) {
                    // Determine direction based on hand position
                    // MediaPipe uses normalized coordinates (0-1)
                    const handX = wrist.x;

                    // Left hand on left side -> move left
                    // Right hand on right side -> move right
                    if (handedness === 'Left' && handX < (0.5 - CONFIG.GESTURE.HAND_POSITION_THRESHOLD)) {
                        detectedGesture = 'left';
                        break;
                    } else if (handedness === 'Right' && handX > (0.5 + CONFIG.GESTURE.HAND_POSITION_THRESHOLD)) {
                        detectedGesture = 'right';
                        break;
                    }

                    // Also detect based on hand horizontal position regardless of handedness
                    if (handX < (0.5 - CONFIG.GESTURE.HAND_POSITION_THRESHOLD)) {
                        detectedGesture = 'left';
                        break;
                    } else if (handX > (0.5 + CONFIG.GESTURE.HAND_POSITION_THRESHOLD)) {
                        detectedGesture = 'right';
                        break;
                    }
                }
            }
        }

        // Update gesture state with hold time validation
        if (detectedGesture !== this.currentGesture) {
            if (now - this.gestureStartTime > CONFIG.GESTURE.MIN_HOLD_TIME) {
                this.currentGesture = detectedGesture;
                this.gestureStartTime = now;

                if (this.onGestureChange) {
                    this.onGestureChange(this.currentGesture);
                }
            }
        }

        this.lastGestureTime = now;
    }

    isHandExtended(landmarks) {
        // Check if hand is in an extended position (fingers pointing)
        // Compare fingertip positions with palm base

        const wrist = landmarks[0];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        const palmBase = landmarks[0];

        // Calculate average distance of fingertips from palm
        const avgFingerDistance = (
            this.getDistance(palmBase, indexTip) +
            this.getDistance(palmBase, middleTip) +
            this.getDistance(palmBase, ringTip) +
            this.getDistance(palmBase, pinkyTip)
        ) / 4;

        // If average distance is above threshold, hand is extended
        return avgFingerDistance > 0.2;
    }

    getDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        const dz = point1.z - point2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    getCurrentGesture() {
        return this.currentGesture;
    }

    cleanup() {
        if (this.camera) {
            this.camera.stop();
        }
        if (this.videoElement && this.videoElement.srcObject) {
            this.videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
    }
}
