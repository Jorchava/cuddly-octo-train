/**
 * Enemy configuration constants demonstrating game balance and AI behavior settings.
 * 
 * Key aspects:
 * - Centralizes enemy tuning parameters
 * - Provides type safety through const assertions
 * - Supports PixiJS v8's improved sprite and animation systems
 */
export const EnemyConfig = {
    // Physical dimensions for collision detection
    dimensions: {
        width: 40, // hitbox width
        height: 64 // hitbox height
    },
    // movement and AI behavior setting
    movement: {
        speed: 80, // units per s
        detectionRange: 50 // distance to detect player
    },
    // combat mechanics config
    combat: {
        maxHp: 60,
        attackRate: 1.25,
        attackDamage: 8,
        attackRange: 50,
        hitFlashDuration: 90,
        /** 
         * Precise attack animation timing
         * Syncs visual feedback with gameplay mechanics
         */
        attackAnimationTiming: {
            hitboxStart: 0.4, // when damage can occur 40% into animation
            hitboxDuration: 0.3 // How long damage window lasts
        }
    },
    /** 
     * Animation timing configuration
     * Leverages PixiJS v8's improved animation system
     */
    animation: {
        defaultSpeed: 0.1,
        slowerSpeed: 0.15,
        slowestSpeed: 0.2,
        spriteAnchor: { x: 0.5, y: 1 }
    },
    //visual effect settings
    visual: {
        hitFlashColor: 0xfff08a,
        normalTint: 0xffffff,
        knockbackAmount: 16
    }
} as const;