import { Application, Graphics, Filter, Assets } from 'pixi.js';
import { Keyboard } from './core/Keyboard';
import { PlayerConfig } from './config/PlayerConfig';
import { EnemyConfig } from './config/EnemyConfig';
import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { intersects } from './systems/CollisionSystem';
import { HealthBar } from './ui/HealthBar';
import { CRTFilter } from '@pixi/filter-crt';
import { AnimationManager } from './core/AnimationManager';

(async function start() {
    await Assets.init({
        basePath: '/'
    });
    const app = new Application();
    await app.init({
        width: 960,
        height: 540,
        background: 0x0f0f10,
        antialias: false
    });

    document.getElementById('game-container')!.appendChild(app.canvas);

    const FLOOR_Y = 420;

    const bg = new Graphics()
        .fill(0x1b1b1f)
        .rect(0, 0, app.renderer.width, app.renderer.height)
        .fill();
    const ground = new Graphics()
        .fill(0x2a2a30)
        .rect(0, FLOOR_Y + 1, app.renderer.width, 8)
        .fill();
    app.stage.addChild(bg, ground);

    const crt = new CRTFilter({
        curvature: 2,
        lineWidth: 1.5,
        lineContrast: 0.25,
        verticalLine: true
    });
    app.stage.filters = [crt as unknown as Filter];

    const playerAnimations = await AnimationManager.loadPlayerAnimations();
    const enemyAnimations = await AnimationManager.loadEnemyAnimations();
    const kb = new Keyboard();
    const player = new Player(playerAnimations);
    const enemy = new Enemy(720, FLOOR_Y, enemyAnimations);
    app.stage.addChild(player, enemy);

    const playerHB = new HealthBar(240, 12, 'Player');
    const enemyHB = new HealthBar(240, 12, 'Enemy');
    playerHB.position.set(20, 20);
    enemyHB.position.set(app.screen.width - 260, 20);
    app.stage.addChild(playerHB, enemyHB);

    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const scale = Math.min(w / app.screen.width, h / app.screen.height);
        app.canvas.style.width = `${app.screen.width * scale}px`;
        app.canvas.style.height = `${app.screen.height * scale}px`;
    }

    window.addEventListener('resize', onResize);
    onResize();

    app.ticker.add((ticker) => {
        const dt = ticker.deltaTime / 60;

        if (player.alive) player.update(dt, kb, FLOOR_Y, enemy);
        if (enemy.alive) enemy.update(dt, player);

        if (player.alive && enemy.alive && player.isAttacking && intersects(player, enemy)) {
            const currentAttack = PlayerConfig.combat.attacks.punch;
            enemy.damage(currentAttack.hitbox.damage);
            enemy.knockback(player.x);
        }

        playerHB.setRatio(player.ratio);
        enemyHB.setRatio(enemy.ratio);

        if (enemy.alive && enemy.ratio <= 0) enemy.die();
        if (player.alive && player.ratio <= 0) player.die();
    });
})();