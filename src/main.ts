// wire the scene
//import * as PIXI from 'pixi.js'; v8 APIs changed GRaphics etc
import { Application, Graphics, Filter } from 'pixi.js';
import { Keyboard } from './core/Keyboard';
import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { intersects } from './systems/CollisionSystem';
import { HealthBar } from './ui/HealthBar';
// npm i @pixi/filter-crt upgrade for pixiv8
import { CRTFilter } from '@pixi/filter-crt';

(async function start() {
    // 1 app
    // v8 needs init async await
    const app = new Application();
    //const app = new PIXI.Application({
    await app.init({
        width: 960,
        height: 540,
        //still works but changed
        //backgroundColor: 0x0f0f10,
        background: 0x0f0f10,
        //preference: 'webgl',
        antialias: false
    });

    //canvas v8 needs app.canvas not app.view
    document.getElementById('game-container')!.appendChild(app.canvas);

    //2 world
    const FLOOR_Y = 420;

    //3 bg + ground line v8 -PIXI change begin, draw, end to v8 fill
    const bg = new Graphics()
        .fill(0x1b1b1f)
        .rect(0, 0, app.renderer.width, app.renderer.height)
        .fill();
    const ground = new Graphics()
        .fill(0x2a2a30)
        .rect(0, FLOOR_Y + 1, app.renderer.width, 8)
        .fill();
    app.stage.addChild(bg, ground);

    // 4 WebGL filter upgrade filter for v8
    const crt = new CRTFilter({
        curvature: 2,
        lineWidth: 1.5,
        lineContrast: 0.25,
        verticalLine: true
    });
    //app.stage.filters = [crt] err, Type assertion to bypass ts
    app.stage.filters = [crt as unknown as Filter];

    // 5 entities
    const kb = new Keyboard();
    const player = new Player();
    const enemy = new Enemy(720, FLOOR_Y);
    app.stage.addChild(player, enemy);

    // 6 ui v8 position app.screen
    const playerHB = new HealthBar(240, 12, 'Player');
    const enemyHB = new HealthBar(240, 12, 'Enemy');
    playerHB.position.set(20, 20);
    enemyHB.position.set(app.screen.width - 260, 20);
    app.stage.addChild(playerHB, enemyHB);

    // 7 responsive / aspect ratio v8 app.canvas not app.view
    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const scale = Math.min(w / app.screen.width, h / app.screen.height);
        app.canvas.style.width = `${app.screen.width * scale}px`;
        app.canvas.style.height = `${app.screen.height * scale}px`;
    }

    window.addEventListener('resize', onResize);
    onResize();

    // 8 game loop v8 passes ticker obj
    app.ticker.add((ticker) => {
        const dt = ticker.deltaTime / 60; // normalize to s 60 fps

        if (player.alive) player.update(dt, kb, FLOOR_Y);
        if (enemy.alive) enemy.update(dt, player);

        // check and damage enemy
        if (player.alive && enemy.alive && player.hitBox && !player.hitBox.destroyed && !enemy.destroyed && intersects(player.hitBox, enemy)) {
            enemy.damage(12);
            if (enemy.alive) enemy.x += (enemy.x < player.x ? -1 : 1) * 16; // knockback
        }

        // update ui
        playerHB.setRatio(player.ratio);
        enemyHB.setRatio(enemy.ratio);

        // visibility of KO
        if (enemy.ratio <= 0) enemy.visible = false;
        if (player.ratio <= 0) player.visible = false;
    });
})();