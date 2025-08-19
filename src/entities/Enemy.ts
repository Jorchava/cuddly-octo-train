//import * as PIXI from 'pixi.js'; v8 below
import { Container, Graphics } from 'pixi.js';
import { Player } from './Player';

// -PIXI prefix
export class Enemy extends Container {
    body: Graphics;
    vx = 0;
    speed = 100;
    hp = 60;
    maxHp = 60;
    attackCooldown = 0;
    attackRate = 0.6;
    alive = true;
    
    constructor(x: number, y: number) {
        super();
        this.body = new Graphics().fill(0xff5ca1).rect(-18, -60, 36, 60).fill();
        this.addChild(this.body);
        this.position.set(x, y);
    }

    update(dt: number, player: Player) {
        if (!this.alive) return; // early exit if dead
        //internal this._position.x null skip for player is gone
        if (!player || !player.alive || player.destroyed) return;

        const dx = player.x - this.x;

        // move towards player if far enough
        if (Math.abs(dx) > 50) {
            this.vx = Math.sign(dx) * this.speed;
        } else {
            this.vx = 0;
        }
        // move
        this.x += this.vx * dt;

        // in sight try to attack
        this.attackCooldown -= dt;
        if (Math.abs(dx) <= 50 && this.attackCooldown <= 0) {
            this.attack(player);
            this.attackCooldown = this.attackRate;
        }
    }

    attack(player: Player) {
        if (!this.alive) return;
        player.damage(8);
        this.body.tint = 0xffc0cb;
        setTimeout(() => (this.body.tint = 0xffffff), 90);
    }

    damage(amount: number) {
        // ghost collisions
        if (!this.alive) return;
        this.hp = Math.max(0, this.hp - amount);
        this.body.tint = 0xfff08a;
        setTimeout(() => (this.body.tint = 0xffffff), 90);

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.alive = false;
        this.visible = false; // hides inmediately do intermittent anim later
        this.parent?.removeChild(this);
        // v8 cleanup
        this.destroy({ children: true, texture: true });
    }

    get ratio() {
        return this.hp / this.maxHp;
    }
}