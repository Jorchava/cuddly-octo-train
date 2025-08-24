// import * as PIXI from 'pixi.js';
import { Container, Graphics, Sprite } from 'pixi.js';
import { Keyboard } from '../core/Keyboard';
import { AnimationSequence } from '../core/AnimationManager';

// v8 -PIXI Container
export class Player extends Container {
    private sprite: Sprite;
    private animations: Record<string, AnimationSequence>;
    private currentAnim?: AnimationSequence;
    private frameIndex = 0;
    private frameTime = 0;

    //body: Graphics;
    vx = 0;
    vy = 0;
    speed = 220;
    jumpStrength = 460;
    gravity = 1200;  
    onGround = false;
    facing = 1; // -1 left
    hp = 100;
    maxHp = 100;
    attackCooldown = 0;
    attackRate = 0.35; // between next attack
    hitBox?: Graphics;
    alive = true;

    constructor(animations: Record<string, AnimationSequence>) {
        super();
        // 40x64 rectangle
        //this.body = new Graphics().fill(0x4da3ff).rect(-20, -64, 40, 64).fill();
        //this.addChild(this.body);
        this.animations = animations;

        // default first frame of idle
        this.sprite = new Sprite(this.animations.idle.frames[0]);
        this.sprite.anchor.set(0.5, 1); // center horizontally, aligned bottom
        this.addChild(this.sprite);
        this.position.set(160, 360);
        this.playAnimation('idle');
    }

    private playAnimation(name: string, force = false) {
        // don't restart if already playing
        if (!force && this.currentAnim?.name === name) return;

        const anim = this.animations[name];
        if (!anim) return;

        this.currentAnim = anim;
        this.frameIndex = 0;
        this.frameTime = 0;
        this.sprite.texture = anim.frames[0];
    }

    update(dt: number, kb: Keyboard, floorY: number) {
        // early exit if dead, later retry or game over screen
        if (!this.alive) return;
        // <= and =>
        const left = kb.isDown('arrowleft') || kb.isDown('a');
        const right = kb.isDown('arrowright') || kb.isDown('d');

        if (left && !right) {
            this.vx = -this.speed;
            this.facing = -1;
        } else if (right && !left) {
            this.vx = this.speed;
            this.facing = 1;
        } else {
            this.vx = 0;
        }

        // animation states
        if (!this.onGround) {
            this.playAnimation('jump');
        } else if (this.vx !== 0) {
            this.playAnimation('walk');
        } else {
            this.playAnimation('idle');
        }

        // flip based on facing direction
        this.sprite.scale.x = this.facing;

        // update animation frames
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

        // jump
        const jump = kb.isDown('arrowup') || kb.isDown('w') || kb.isDown(' ');
        if (jump && this.onGround) {
            this.vy = -this.jumpStrength;
            this.onGround = false;
        }

        // gravity + integrate
        this.vy += this.gravity * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // ground
        if (this.y >= floorY) {
            this.y = floorY;
            this.vy = 0;
            this.onGround = true;
        }

        // atk
        this.attackCooldown -= dt;
        if ((kb.isDown(' ') || kb.isDown('q') || kb.isDown('s') || kb.isDown('z')) && this.attackCooldown <= 0) {
            this.playAnimation('punch');
            this.swing();
            this.attackCooldown = this.attackRate;
        }

        // hitbox
        if (this.hitBox) {
            this.hitBox.alpha -= dt * 3;
            if (this.hitBox.alpha <= 0) {
                this.parent?.removeChild(this.hitBox);
                this.hitBox.destroy();
                this.hitBox = undefined;
            }
        }
    }

    swing() {
        if (!this.alive) return;
        // simulate a punch rectangle
        const w = 30;
        const h = 20;
        const offsetX = this.facing > 0 ? 24 : -24 - w;
        // check later why v8 Graphics api just rect fill didn't work
        const hb = new Graphics().fill(0xffd166).rect(0, 0, w, h).fill();
        hb.position.set(this.x + offsetX, this.y - 42);
        hb.alpha = 0.8;
        this.parent?.addChild(hb);
        this.hitBox = hb;
    }

    damage(amount: number) {
        if (!this.alive) return; // ghost collisions
        this.hp = Math.max(0, this.hp - amount);
        // visual feedback, now using sprite instead of body
        this.sprite.tint = 0xff6262;
        setTimeout(() => (this.sprite.tint = 0xffffff), 90);

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.alive = false;
        this.visible = false; // dead anim later
        this.parent?.removeChild(this);
        this.destroy({ children: true, texture: true });
    }

    get ratio() {
        return this.hp / this.maxHp;
    }
}