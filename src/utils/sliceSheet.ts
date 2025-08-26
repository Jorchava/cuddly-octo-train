import { Texture, Rectangle } from 'pixi.js';

export function sliceSheet(sheet: Texture, frameWidth: number, frameHeight: number) {
    const frames: Texture[] = [];
    const cols = Math.floor(sheet.width / frameWidth);

    for (let i = 0; i < cols; i++) {
        const frameRect = new Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
        const frame = new Texture({
            source: sheet.source,
            frame: frameRect
        });
        frames.push(frame);
    }
    return frames;
}