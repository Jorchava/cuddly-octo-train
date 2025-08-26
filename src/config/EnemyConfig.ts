export const EnemyConfig = {
    dimensions: {
        width: 40,
        height: 64
    },
    movement: {
        speed: 100,
        detectionRange: 50
    },
    combat: {
        maxHp: 60,
        attackRate: 0.6,
        attackDamage: 8,
        attackRange: 50,
        hitFlashDuration: 90
    },
    animation: {
        defaultSpeed: 0.1,
        spriteAnchor: { x: 0.5, y: 1 }
    },
    visual: {
        hitFlashColor: 0xfff08a,
        normalTint: 0xffffff,
        knockbackAmount: 16
    }
} as const;