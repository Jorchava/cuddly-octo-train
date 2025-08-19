// hr bar with color heads up for hp 

// rmember modular imports v8
// import * as PIXI from 'pixi.js';
import { Container, Graphics, Text } from 'pixi.js';

export class HealthBar extends Container {
    private bg: Graphics;
    private fg: Graphics;
    private w: number;
    private h: number;

    constructor(width = 220, height = 12, label?: string) {
        super();
        this.w = width;
        this.h = height;

        //v8 fill rect
        this.bg = new Graphics().fill(0x333333).roundRect(0,0,width,height,4).fill();
        this.fg = new Graphics().fill(0x00d26a).roundRect(0,0,width,height,4).fill();

        // check if prettier, linter would complaint for ,
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

        // pixel stretching, scale.x fix
        // this.fg.width = this.width * r;
        this.fg.scale.x = r;
        this.fg.tint = r < 0.3 ? 0xff4d4f : 0x00d26a;
    }
}