export const EnemyConfig = {
    dimensions: {
        width: 40,
        height: 64
    },
    movement: {
        speed: 80,
        detectionRange: 50
    },
    combat: {
        maxHp: 60,
        attackRate: 1.25,
        attackDamage: 8,
        attackRange: 50,
        hitFlashDuration: 90,
        attackAnimationTiming: {
            hitboxStart: 0.4,
            hitboxDuration: 0.3
        }
    },
    animation: {
        defaultSpeed: 0.1,
        slowerSpeed: 0.15,
        slowestSpeed: 0.2,
        spriteAnchor: { x: 0.5, y: 1 }
    },
    visual: {
        hitFlashColor: 0xfff08a,
        normalTint: 0xffffff,
        knockbackAmount: 16
    }
} as const;