import { Container, Sprite, Graphics, Rectangle } from 'pixi.js';
import { Player } from './Player';
import { AnimationSequence } from '../core/AnimationManager';
import { EnemyConfig } from '../config/EnemyConfig';
import { intersects } from '../systems/CollisionSystem';
export class Enemy extends Container {
    private sprite: Sprite;
    private animations: Record<string, AnimationSequence>;
    private currentAnim?: AnimationSequence;
    private frameIndex = 0;
    private frameTime = 0;
    private facing = -1;
    private vx = 0;
    private attackCooldown = EnemyConfig.combat.attackRate;
    private tintTimeout?: number;
    private isAttacking = false;
    private hitBox?: Graphics;

    public hp: number = EnemyConfig.combat.maxHp;
    public readonly maxHp = EnemyConfig.combat.maxHp;
    public alive = true;
    
    constructor(x: number, y: number, animations: Record<string, AnimationSequence>) {
        super();
        this.animations = animations;
        this.sprite = new Sprite(this.animations.idle.frames[0]);
        this.sprite.anchor.set(
            EnemyConfig.animation.spriteAnchor.x,
            EnemyConfig.animation.spriteAnchor.y
        );
        this.addChild(this.sprite);
        this.position.set(x, y);
        this.playAnimation('idle');
    }

    update(dt: number, player: Player) {
        if (!this.alive || !player.alive || player.destroyed) return;

        const dx = player.x - this.x;
        this.facing = Math.sign(dx);
        this.sprite.scale.x = -this.facing;

        if (!this.isAttacking) {
            if (Math.abs(dx) > EnemyConfig.combat.attackRange) {
                this.vx = Math.sign(dx) * EnemyConfig.movement.speed;
                this.playAnimation('walk');
            } else {
                this.vx = 0;
                this.playAnimation('idle');
            }

            this.x += this.vx * dt;
        }

        this.updateAnimations(dt);
        this.updateCombat(dt, dx, player);
        this.updateHitbox(dt);
    }

    private updateAnimations(dt: number) {
        if (this.currentAnim) {
            this.frameTime += dt;
            if (this.frameTime >= (this.currentAnim.speed || EnemyConfig.animation.defaultSpeed)) {
                this.frameTime = 0;
                this.frameIndex++;
                
                if (this.frameIndex >= this.currentAnim.frames.length) {
                    if (this.currentAnim.loop) {
                        this.frameIndex = 0;
                    } else {
                        if (this.isAttacking && this.currentAnim.name === 'punch') {
                            this.isAttacking = false;
                        }
                        this.playAnimation('idle');
                        return;
                    }
                }

                this.sprite.texture = this.currentAnim.frames[this.frameIndex];
            }
        }
    }

    public reset() {
        this.hp = EnemyConfig.combat.maxHp;
        this.alive = true;
        this.visible = true;
        this.vx = 0;
        this.attackCooldown = EnemyConfig.combat.attackRate;
        this.facing = -1;
        this.currentAnim = undefined;
        this.playAnimation('idle');
        if (this.tintTimeout) {
            clearTimeout(this.tintTimeout);
            this.tintTimeout = undefined;
        }
        this.sprite.tint = EnemyConfig.visual.normalTint;
    }

    public knockback(fromX: number) {
        if (!this.alive) return;
        const direction = this.x < fromX ? -1 : 1;
        this.x += direction * EnemyConfig.visual.knockbackAmount;
    }

    private updateCombat(dt: number, dx: number, player: Player) {
        this.attackCooldown -= dt;
        if (Math.abs(dx) <= EnemyConfig.combat.attackRange && this.attackCooldown <= 0) {
            this.attack(player);
            this.attackCooldown = EnemyConfig.combat.attackRate;
        }
    }

    private playAnimation(name: string, force = false) {
        if (!force && this.currentAnim?.name === name) return;

        const anim = this.animations[name];
        if(!anim) {
            console.warn(`Enemy animation "${name}" not found`);
            return;
        }

        console.debug(`Enemy playing animation: ${name}`);
        this.currentAnim = anim;
        this.frameIndex = 0;
        this.frameTime = 0;
        this.sprite.texture = anim.frames[0];
    }

    private updateHitbox(dt: number) {
        if (this.hitBox) {
            this.hitBox.alpha -= dt * 3;
            if (this.hitBox.alpha <= 0) {
                this.hitBox.destroy();
                this.hitBox = undefined;
            }
        }
    }

    attack(player: Player) {
        if (!this.alive || this.isAttacking) return;

        this.isAttacking = true;
        this.vx = 0;
        this.playAnimation('punch', true);

        // Create hitbox for attack
        const hitboxWidth = 30;
        const hitboxHeight = 20;
        const hitboxOffsetX = this.facing > 0 ? 24 : -24 - hitboxWidth;
        
        const hb = new Graphics()
            .fill(0xffd166)
            .rect(0, 0, hitboxWidth, hitboxHeight)
            .fill();
            
        hb.position.set(this.x + hitboxOffsetX, this.y - 42);
        hb.alpha = 0.8;
        this.parent?.addChild(hb);
        this.hitBox = hb;

        if (intersects(this.hitBox, player)) {
            player.damage(EnemyConfig.combat.attackDamage);
            player.knockback(this.x);
        }

        setTimeout(() => {
            if (this.hitBox) {
                this.hitBox.destroy();
                this.hitBox = undefined;
            }
            this.isAttacking = false;
        }, EnemyConfig.combat.attackRate * 1000);
    }

    damage(amount: number) {
        if (!this.alive) return;

        this.hp = Math.max(0, this.hp - amount);
        this.sprite.tint = EnemyConfig.visual.hitFlashColor;
        this.playAnimation('hurt', true);

        if (this.tintTimeout) {
            clearTimeout(this.tintTimeout);
        }
        
        this.tintTimeout = setTimeout(
            () => (this.sprite.tint = EnemyConfig.visual.normalTint),
            EnemyConfig.combat.hitFlashDuration
        );

        this.knockback(this.x);

        if (this.hp <= 0) {
            setTimeout(() => this.die(), 200);
        }
    }

    die() {
        this.alive = false;
        this.visible = false;
        if (this.tintTimeout) {
            clearTimeout(this.tintTimeout);
            this.tintTimeout = undefined;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.destroy({ children: true });
    }

    public get bounds(): Rectangle {
        return new Rectangle(
            this.x - EnemyConfig.dimensions.width/2,
            this.y - EnemyConfig.dimensions.height,
            EnemyConfig.dimensions.width,
            EnemyConfig.dimensions.height
        );
    }

    get ratio() {
        return this.hp / this.maxHp;
    }
}