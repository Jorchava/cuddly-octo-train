//import * as PIXI from 'pixi.js'; v8 below
import { Container, Sprite } from 'pixi.js';
import { Player } from './Player';
import { AnimationSequence } from '../core/AnimationManager';

// -PIXI prefix
export class Enemy extends Container {
    private sprite: Sprite;
    private animations: Record<string, AnimationSequence>;
    private currentAnim?: AnimationSequence;
    private frameIndex = 0;
    private frameTime = 0;
    private facing = -1;

    //body: Graphics;
    vx = 0;
    speed = 100;
    hp = 60;
    maxHp = 60;
    attackCooldown = 0;
    attackRate = 0.6;
    alive = true;
    
    constructor(x: number, y: number, animations: Record<string, AnimationSequence>) {
        super();
        // this.body = new Graphics().fill(0xff5ca1).rect(-18, -60, 36, 60).fill();
        // this.addChild(this.body);
        this.animations = animations;

        // default idle enemy
        this.sprite = new Sprite(this.animations.idle.frames[0]);
        this.sprite.anchor.set(0.5, 1); // center horizontally too and bottom aligned
        this.addChild(this.sprite);

        this.position.set(x, y);
        this.playAnimation('idle');
    }

    private playAnimation(name: string, force = false) {
        if (!force && this.currentAnim?.name === name) return;

        const anim = this.animations[name];
        if(!anim) return;

        this.currentAnim = anim;
        this.frameIndex = 0;
        this.frameTime = 0;
        this.sprite.texture = anim.frames[0];
    }

    update(dt: number, player: Player) {
        if (!this.alive) return; // early exit if dead
        //internal this._position.x null skip for player is gone
        if (!player || !player.alive || player.destroyed) return;

        const dx = player.x - this.x;

        // update facing direction
        this.facing = Math.sign(dx);
        this.sprite.scale.x = -this.facing;

        // move towards player if far enough
        if (Math.abs(dx) > 50) {
            this.vx = Math.sign(dx) * this.speed;
            this.playAnimation('walk');
        } else {
            this.vx = 0;
            this.playAnimation('idle');
        }
        // move
        this.x += this.vx * dt;

        // Update animation frames
        if (this.currentAnim) {
            this.frameTime += dt;
            if (this.frameTime >= (this.currentAnim.speed || 0.1)) {
                this.frameTime = 0;
                this.frameIndex++;
                
                if (this.frameIndex >= this.currentAnim.frames.length) {
                    if (this.currentAnim.loop) {
                        this.frameIndex = 0;
                    } else {
                        this.playAnimation('idle');
                        return;
                    }
                }

                this.sprite.texture = this.currentAnim.frames[this.frameIndex];
            }
        }

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
        /* this.body.tint = 0xffc0cb;
        setTimeout(() => (this.body.tint = 0xffffff), 90); */
        this.playAnimation('punch', true);
    }

    damage(amount: number) {
        // ghost collisions
        if (!this.alive) return;
        this.hp = Math.max(0, this.hp - amount);
        // this.body.tint = 0xfff08a;
        // setTimeout(() => (this.body.tint = 0xffffff), 90);
        this.playAnimation('hurt', true);

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