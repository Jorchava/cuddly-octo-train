// animation manager for load and manage sprite animations
// texture management in pixi v8, async asset loading, with game animation states

import { Assets, Rectangle, Texture, ImageSource, path } from 'pixi.js';

const SPRITE_CONFIG = {
    WIDTH: 96,
    HEIGHT: 63
} as const;

export interface AnimationSequence {
    name: string;
    frames: Texture[];
    loop?: boolean;
    speed?: number;
}

export class AnimationManager {
    private static async createFrames(
        path: string,
        frameWidth: number,
        frameHeight: number,
        frameCount: number
    ): Promise<Texture[]> {
        try {
            // load the spritesheet img
            //const baseTexture = await BaseTexture.from(path);
            // v8 Assets.load
            const baseTexture = await Assets.load(path);
            const frames: Texture[] = [];

            // create individual frame textures
            for (let i = 0; i < frameCount; i++) {
                //v8 rectangle x, y, width, height
                const frame = new Rectangle(
                    i * frameWidth, // x ppos in the spritesheet
                    0, // y pos
                    frameWidth,
                    frameHeight
                );
                // v8 create a new texture from the source
                const frameTexture = new Texture({
                    source: baseTexture.source,
                    frame: frame
                });

                frames.push(frameTexture);
            }

            return frames;
        } catch (error) {
            console.log(`Failed to load animation: ${path}`, error);
            throw error;
        }
    }

    // helper method to load player animations
    static async loadPlayerAnimations(): Promise<Record<string, AnimationSequence>> {
        const animations: Record<string, AnimationSequence> = {};
        
        // define frame counts for each animation
        const sequences = {
            idle: { path: 'assets/player/idle.png', frames: 4 },
            walk: { path: 'assets/player/walk.png', frames: 10 },
            punch: { path: 'assets/player/punch.png', frames: 3 },
            kick: { path: 'assets/player/kick.png', frames: 5 },
            jump: { path: 'assets/player/jump.png', frames: 4 },
            hurt: { path: 'assets/player/hurt.png', frames: 2 },
            dive_kick: { path: 'assets/player/dive_kick.png', frames: 5},
            jab: { path: 'assets/player/jab.png', frames: 3},
            jump_kick: { path: 'assets/player/jump_kick.png', frames: 3}
        };

        // loading each animation sequence
        for (const [name, config] of Object.entries(sequences)) {
            const frames = await this.createFrames(
                config.path,
                SPRITE_CONFIG.WIDTH,
                SPRITE_CONFIG.HEIGHT,
                config.frames
            );

            animations[name] = {
                name,
                frames,
                loop: name === 'idle' || name === 'walk',
                speed: name === 'walk' ? 0.15 : 0.1
            };
        }

        return animations;
    }

    // helper method to load enemy animations
    static async loadEnemyAnimations(): Promise<Record<string, AnimationSequence>> {
        const animations: Record<string, AnimationSequence> = {};
        
        const sequences = {
            idle: { path: 'assets/enemy/idle.png', frames: 4 },
            walk: { path: 'assets/enemy/walk.png', frames: 4 },
            punch: { path: 'assets/enemy/punch.png', frames: 3, loop: false },
            hurt: { path: 'assets/enemy/hurt.png', frames: 2, loop: false },
            // check if better slice or start off 3-4
            die: { path: 'assets/enemy/hurt.png', frames: 4 }
        };

        for (const [name, config] of Object.entries(sequences)) {
            const frames = await this.createFrames(
                config.path,
                SPRITE_CONFIG.WIDTH,
                SPRITE_CONFIG.HEIGHT,
                config.frames
            );

            animations[name] = {
                name,
                frames,
                loop: name === 'idle' || name === 'walk',
                speed: name === 'walk' ? 0.15 : 0.1
            };
        }

        return animations;
    }
}