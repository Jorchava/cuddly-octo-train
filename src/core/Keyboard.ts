/**
 * Keyboard input management system.
 * 
 * Features:
 * - Event-based input handling
 * - Support for simultaneous key presses
 * - Timing-based input detection for combos
 * - Memory efficient key state tracking
 */
export class Keyboard {
    /** 
     * Tracks currently pressed keys
     * Uses Record for O(1) lookup performance
     */
    private keys: Record<string, boolean> = {};
    /**
     * Tracks when each key was pressed
     * Enables timing-based input detection
     */
    private keyPressTime: Record<string, number> = {};

    constructor() {
        // Event listeners use arrow functions to preserve this context
        window.addEventListener('keydown', (e) => this.onKey(e, true));
        window.addEventListener('keyup', (e) => this.onKey(e, false));
    }
    /**
     * Handles keyboard events
     * @param e Keyboard event from browser
     * @param isDown Whether key is being pressed or released
     */
    private onKey(e: KeyboardEvent, isDown: boolean) {
        const key = e.key.toLowerCase();
        this.keys[key] = isDown;

        if (isDown) {
            this.keyPressTime[key] = Date.now();
        } else {
            delete this.keyPressTime[key];
        }
    }

    /**
     * Checks if a key is currently pressed
     * @param key Key to check (case-insensitive)
     * @returns boolean indicating if key is pressed
     */
    isDown(key: string) {
        return !!this.keys[key.toLowerCase()];
    }

    /**
     * Checks if a key was just pressed this frame
     * Used for precise timing in combat moves
     * @param key Key to check
     * @returns boolean indicating if key was just pressed
     */
    isJustPressed(key: string): boolean {
        const pressTime = this.keyPressTime[key.toLowerCase()];
        return pressTime ? Date.now() - pressTime < 16 : false; // 1 frame @60fps
    }

    /**
     * Checks if a key has been held for specified duration
     * Enables charge attacks and special moves
     * @param key Key to check
     * @param minDuration Minimum hold time in milliseconds
     * @returns boolean indicating if key has been held long enough
     */
    isHeld(key: string, minDuration = 300): boolean {
        const pressTime = this.keyPressTime[key.toLowerCase()];
        return pressTime ? Date.now() - pressTime >= minDuration : false;
    }
}