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
        speed: 290,
        jumpStrength: 990,
        gravity: 1900
    },
    combat: {
        maxHp: 100,
        hitboxFadeSpeed: 3,
        hitFlashDuration: 90,
        comboWindowDuration: 0.5,
        attackCooldown: 1,
        attacks: {
            // Attack configurations with hitbox data
            // Balanced for fighting game feel
            jab: { 
                duration: 0.3,
                hitbox: { width: 15, height: 15, offsetX: 20, damage: 3 }
            },
            punch: { 
                duration: 0.4,
                hitbox: { width: 18, height: 18, offsetX: 24, damage: 4 }
            },
            kick: { 
                duration: 0.5,
                hitbox: { width: 20, height: 20, offsetX: 8, damage: 5 }
            },
            jump_kick: { 
                duration: 0.6,
                hitbox: { width: 25, height: 25, offsetX: 25, damage: 6 }
            },
            dive_kick: { 
                duration: 0.7,
                hitbox: { width: 25, height: 25, offsetX: 25, damage: 7 }
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