/**
 * Animation management system using PixiJS v8's new texture handling.
 * Key differences from v5:
 * - Uses Texture constructor instead of PIXI.Texture.from()
 * - Handles source directly instead of baseTexture
 * - Supports WebGL 2 batching improvements
 */

import { Assets, Rectangle, Texture } from 'pixi.js';
import { EnemyConfig } from '../config/EnemyConfig';

// Using as const for type safety and immutability.
const SPRITE_CONFIG = {
    WIDTH: 96,
    HEIGHT: 63
} as const;

/**
 * Interface defining animation sequence structure.
 * @property name - Unique identifier for the animation
 * @property frames - Array of textures representing animation frames
 * @property loop - Whether animation should repeat
 * @property speed - Frame duration in seconds
 */
export interface AnimationSequence {
    name: string;
    frames: Texture[];
    loop?: boolean;
    speed?: number;
}

export class AnimationManager {
    /**
     * Creates texture frames from a spritesheet.
     * Major changes from v5:
     * - Uses new Texture constructor syntax
     * - Directly handles source instead of baseTexture
     * - Better memory management through proper cleanup
     */
    private static async createFrames(
        path: string,
        frameWidth: number,
        frameHeight: number,
        frameCount: number
    ): Promise<Texture[]> {
        try {
            // Assets.load replaces PIXI.Loader from v5
            const baseTexture = await Assets.load(path);
            const frames: Texture[] = [];

            for (let i = 0; i < frameCount; i++) {
                const frame = new Rectangle(
                    i * frameWidth,
                    0,
                    frameWidth,
                    frameHeight
                );
                // PixiJS v8 syntax for texture creation
                const frameTexture = new Texture({
                    // v8 uses source instead of baseTexture
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

    /**
     * Loads player animation sequences.
     * Returns a map of animation names to their sequences.
     * WebGL optimization: Creates textures that can be batched efficiently
     */
    static async loadPlayerAnimations(): Promise<Record<string, AnimationSequence>> {
        const animations: Record<string, AnimationSequence> = {};

        const sequences = {
            idle: { path: './assets/player/idle.png', frames: 4 },
            walk: { path: './assets/player/walk.png', frames: 10 },
            punch: { path: './assets/player/punch.png', frames: 3 },
            kick: { path: './assets/player/kick.png', frames: 5 },
            jump: { path: './assets/player/jump.png', frames: 4 },
            hurt: { path: './assets/player/hurt.png', frames: 2 },
            dive_kick: { path: './assets/player/dive_kick.png', frames: 5},
            jab: { path: './assets/player/jab.png', frames: 3},
            jump_kick: { path: './assets/player/jump_kick.png', frames: 3}
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

    static async loadEnemyAnimations(): Promise<Record<string, AnimationSequence>> {
        const animations: Record<string, AnimationSequence> = {};
        
        const sequences = {
            idle: { 
                path: './assets/enemy/idle.png', 
                frames: 4,
                loop: true,
                speed: EnemyConfig.animation.slowerSpeed
            },
            walk: { 
                path: './assets/enemy/walk.png', 
                frames: 4,
                loop: true,
                speed: EnemyConfig.animation.slowerSpeed
             },
            punch: { 
                path: './assets/enemy/punch.png', 
                frames: 3, 
                loop: false,
                speed: EnemyConfig.animation.slowestSpeed
            },
            hurt: { 
                path: './assets/enemy/hurt.png', 
                frames: 2, 
                loop: false,
                speed: EnemyConfig.animation.slowerSpeed
            }
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
                loop: config.loop,
                speed: config.speed
            };
        }

        return animations;
    }
}