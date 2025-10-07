/**
 * Health bar UI component using PixiJS v8 Graphics
 * Demonstrates:
 * - Efficient shape drawing
 * - Better memory usage
 * - Improved render batching
 */
import { Container, Graphics, Text } from 'pixi.js';
export class HealthBar extends Container {
    private bg: Graphics;
    private fg: Graphics;
    private w: number;
    private h: number;
    /**
     * Creates a new health bar
     * @param width Bar width in pixels
     * @param height Bar height in pixels
     * @param label Text to display above bar
     */
    constructor(width = 220, height = 12, label?: string) {
        super();
        this.w = width;
        this.h = height;

        this.bg = new Graphics().fill(0x333333).roundRect(0,0,width,height,4).fill();
        this.fg = new Graphics().fill(0x00d26a).roundRect(0,0,width,height,4).fill();

        if (label) {
            const text = new Text({
                text: label,
                style: { 
                    fill: 0xffffff, 
                    fontSize: 12 
                }
            });
            text.y = -18;
            this.addChild(text);
        }

        this.addChild(this.bg, this.fg);
    }

    setRatio(ratio: number) {
        const r = Math.max(0, Math.min(1, ratio));

        this.fg.scale.x = r;
        this.fg.tint = r < 0.3 ? 0xff4d4f : 0x00d26a;
    }
}