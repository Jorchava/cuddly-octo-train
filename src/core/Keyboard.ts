// input keyboard helper query current key state anytime.
export class Keyboard {
    private keys: Record<string, boolean> = {};
    private keyPressTime: Record<string, number> = {};
    constructor() {
        window.addEventListener('keydown', (e) => this.onKey(e, true));
        window.addEventListener('keyup', (e) => this.onKey(e, false));
    }
    private onKey(e: KeyboardEvent, isDown: boolean) {
        const key = e.key.toLowerCase();
        this.keys[key] = isDown;

        if (isDown) {
            this.keyPressTime[key] = Date.now();
        } else {
            delete this.keyPressTime[key];
        }
    }

    isDown(key: string) {
        return !!this.keys[key.toLowerCase()];
    }

    isJustPressed(key: string): boolean {
        const pressTime = this.keyPressTime[key.toLowerCase()];
        return pressTime ? Date.now() - pressTime < 16 : false; // 1 frame @60fps
    }

    isHeld(key: string, minDuration = 300): boolean {
        const pressTime = this.keyPressTime[key.toLowerCase()];
        return pressTime ? Date.now() - pressTime >= minDuration : false;
    }
}