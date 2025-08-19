// input keyboard helper query current key state anytime.
export class Keyboard {
    private keys: Record<string, boolean> = {};
    constructor() {
        window.addEventListener('keydown', (e) => this.onKey(e, true));
        window.addEventListener('keyup', (e) => this.onKey(e, false));
    }
    private onKey(e: KeyboardEvent, isDown: boolean) {
        this.keys[e.key.toLowerCase()] = isDown;
    }

    isDown(key: string) {
        return !!this.keys[key.toLowerCase()];
    }
}