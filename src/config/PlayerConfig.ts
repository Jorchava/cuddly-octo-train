/**
 * Player configuration constants
 * Centralized game balance settings for easier tuning
 * Uses TypeScript's const assertions for type safety
 */
export type AttackType = 'jab' | 'punch' | 'kick' | 'jump_kick' | 'dive_kick';

interface HitboxConfig {
    width: number;
    height: number;
    offsetX: number;
    damage: number;
}

interface AttackConfig {
    duration: number;
    hitbox: HitboxConfig;
}

export const PlayerConfig = {
    dimensions: {
        width: 40,
        height: 64
    },
    movement: {
        speed: 220,
        jumpStrength: 460,
        gravity: 1200
    },
    combat: {
        maxHp: 100,
        hitboxFadeSpeed: 3,
        hitFlashDuration: 90,
        comboWindowDuration: 0.5,
        attacks: {
            // Attack configurations with hitbox data
            // Balanced for fighting game feel
            jab: { 
                duration: 0.3,
                hitbox: { width: 25, height: 15, offsetX: 20, damage: 5 }
            },
            punch: { 
                duration: 0.4,
                hitbox: { width: 30, height: 20, offsetX: 24, damage: 8 }
            },
            kick: { 
                duration: 0.5,
                hitbox: { width: 35, height: 20, offsetX: 28, damage: 10 }
            },
            jump_kick: { 
                duration: 0.6,
                hitbox: { width: 40, height: 25, offsetX: 30, damage: 15 }
            },
            dive_kick: { 
                duration: 0.7,
                hitbox: { width: 35, height: 30, offsetX: 25, damage: 12 }
            }
        } as Record<AttackType, AttackConfig>
    },
    animation: {
        defaultSpeed: 0.1,
        spriteAnchor: { x: 0.5, y: 1 }
    },
    position: {
        initial: { x: 160, y: 360 }
    },
    visual: {
        hitboxColor: 0xffd166,
        hitboxAlpha: 0.8,
        damageFlashColor: 0xff6262,
        normalTint: 0xffffff,
        knockbackAmount: 16
    }
} as const;