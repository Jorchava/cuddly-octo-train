/**
 * Player entity implementing PixiJS v8 features:
 * - Advanced sprite manipulation
 * - Efficient animation system
 * - WebGL 2 optimizations
 * 
 * Notable v8 improvements:
 * - Better texture management
 * - Improved render batching
 * - More efficient state updates
 */
import { Container, Graphics, Sprite, Rectangle } from 'pixi.js';
import { Keyboard } from '../core/Keyboard';
import { AnimationSequence } from '../core/AnimationManager';
import { PlayerConfig, AttackType } from '../config/PlayerConfig';
export class Player extends Container {
    // Animation properties
    private sprite: Sprite;
    private animations: Record<string, AnimationSequence>;
    private currentAnim?: AnimationSequence;
    private frameIndex = 0;
    private frameTime = 0;

    // Combat properties
    private comboWindow = 0;
    private currentAttack: AttackType | null = null;
    private attackCooldown = 0;
    private hitBox?: Graphics;

    // Physics properties
    private vx = 0;
    private vy = 0;

    // So enemy can access them
    protected onGround = false;
    protected facing = 1;

    // Combat state public as they are part of the public API
    public hp: number = PlayerConfig.combat.maxHp;
    public readonly maxHp = PlayerConfig.combat.maxHp;
    public alive = true;

    constructor(animations: Record<string, AnimationSequence>) {
        super();
        this.animations = animations;
        this.sprite = new Sprite(this.animations.idle.frames[0]);
        this.sprite.anchor.set(
            PlayerConfig.animation.spriteAnchor.x,
            PlayerConfig.animation.spriteAnchor.y
        );
        this.scale.set(2);
        this.addChild(this.sprite);
        this.position.set(
            PlayerConfig.position.initial.x,
            PlayerConfig.position.initial.y
        );
        this.playAnimation('idle');
    }

    update(dt: number, kb: Keyboard, floorY: number, enemy?: Container) {
        if (!this.alive) return;

        this.updateMovement(dt, kb, enemy);
        this.updateCombat(dt, kb);
        this.updateAnimations(dt);
        this.updatePhysics(dt, floorY);
        this.updateHitbox(dt);
    }
    /**
     * Updates player movement and facing direction
     * @param dt Delta time for frame-independent movement
     * @param kb Keyboard input handler
     * @param enemy Optional enemy reference for auto-facing
     */
    private updateMovement(dt: number, kb: Keyboard, enemy?: Container) {
        const left = kb.isDown('arrowleft') || kb.isDown('a');
        const right = kb.isDown('arrowright') || kb.isDown('d');
        const jump = kb.isDown('arrowup') || kb.isDown('w') || kb.isDown(' ');

        if (left && !right) {
            this.vx = -PlayerConfig.movement.speed;
            this.facing = -1;
        } else if (right && !left) {
            this.vx = PlayerConfig.movement.speed;
            this.facing = 1;
        } else {
            this.vx = 0;
            // auto update facing to enemy when not moving
            if (enemy && 'alive' in enemy && (enemy as any).alive) {
                this.facing = enemy.x > this.x ? 1 : -1;
            }
        }

        if (jump && this.onGround) {
            this.vy = -PlayerConfig.movement.jumpStrength;
            this.onGround = false;
            this.playAnimation('jump');
        }
    }

    private updatePhysics(dt: number, floorY: number) {
        this.vy += PlayerConfig.movement.gravity * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.y >= floorY) {
            this.y = floorY;
            this.vy = 0;
            this.onGround = true;
        }
    }

    private updateHitbox(dt: number) {
        if (this.hitBox) {
            this.hitBox.alpha -= dt * PlayerConfig.combat.hitboxFadeSpeed;
            if (this.hitBox.alpha <= 0) {
                this.parent?.removeChild(this.hitBox);
                this.hitBox.destroy();
                this.hitBox = undefined;
            }
        }
    }

    /**
     * Handles attack execution and hitbox creation
     * Uses v8's improved Graphics API for better performance
     */
    private executeAttack(type: AttackType) {
        const attackConfig = PlayerConfig.combat.attacks[type];
        this.currentAttack = type;
        this.playAnimation(type, true);
        this.swing();
        this.attackCooldown = attackConfig.duration;
        
        setTimeout(() => {
            if (this.currentAttack === type) {
                this.currentAttack = null;
            }
        }, attackConfig.duration * 1000);
    }

    swing() {
        if (!this.alive || !this.currentAttack) return;

        const config = PlayerConfig.combat.attacks[this.currentAttack].hitbox;
        const offsetX = this.facing > 0 ? config.offsetX : -config.offsetX - config.width;
        
        const hb = new Graphics()
            .fill(PlayerConfig.visual.hitboxColor)
            .rect(0, 0, config.width * this.scale.x, config.height * this.scale.y)
            .fill();

        hb.position.set(
            this.x + offsetX * this.scale.x, 
            this.y - config.height * this.scale.y * 1.4
        );
        hb.alpha = PlayerConfig.visual.hitboxAlpha;
        this.parent?.addChild(hb);
        this.hitBox = hb;
    }

    private updateAnimations(dt: number) {
        if (this.currentAnim) {
            this.frameTime += dt;
            if (this.frameTime >= (this.currentAnim.speed || PlayerConfig.animation.defaultSpeed)) {
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

        if (!this.currentAttack) {
            if (!this.onGround) {
                this.playAnimation('jump');
            } else if (Math.abs(this.vx) > 0) {
                this.playAnimation('walk');
            } else {
                this.playAnimation('idle');
            }
        }

        this.sprite.scale.x = this.facing;
    }

    private updateCombat(dt: number, kb: Keyboard) {
        this.attackCooldown -= dt;
        this.comboWindow = Math.max(0, this.comboWindow - dt);

        if (this.attackCooldown <= 0) {
            const jump = kb.isDown('arrowup') || kb.isDown('w') || kb.isDown(' ');
            const down = kb.isDown('arrowdown') || kb.isDown('s');
            
            if (kb.isJustPressed('z')) {
                if (jump && !this.onGround) {
                    this.executeAttack('jump_kick');
                } else if (down && kb.isHeld('arrowdown', 200)) {
                    this.executeAttack('dive_kick');
                } else {
                    this.executeAttack('kick');
                }
            } else if (kb.isJustPressed('q')) {
                this.executeAttack('jab');
            } else if (kb.isJustPressed('s')) {
                this.executeAttack('punch');
            }
        }
    }

    private playAnimation(name: string, force = false) {
        if (!force && this.currentAnim?.name === name) return;
        
        const anim = this.animations[name];
        if (!anim) {
            console.warn(`Player animation "${name}" not found`);
            return;
        }

        console.debug(`Player playing animation: ${name}`);
        this.currentAnim = anim;
        this.frameIndex = 0;
        this.frameTime = 0;
        this.sprite.texture = anim.frames[0];
    }

    reset() {
        this.hp = PlayerConfig.combat.maxHp;
        this.alive = true;
        this.visible = true;
        this.vx = 0;
        this.vy = 0;
        this.position.set(
            PlayerConfig.position.initial.x,
            PlayerConfig.position.initial.y
        );
        this.facing = 1;
        this.currentAttack = null;
        this.attackCooldown = 0;
        this.comboWindow = 0;
        this.playAnimation('idle');

        if (this.hitBox) {
            this.hitBox.destroy();
            this.hitBox = undefined;
        }
    }

    destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean; }) {
        if (this.hitBox) {
            this.hitBox.destroy();
            this.hitBox = undefined;
        }
        super.destroy(options);
    }

    public knockback(fromX: number) {
        if (!this.alive) return;
        const direction = this.x < fromX ? -1 : 1;
        this.x += direction * PlayerConfig.visual.knockbackAmount;
    }

    public damage(amount: number) {
        if (!this.alive) return;
        this.hp = Math.max(0, this.hp - amount);
        this.sprite.tint = PlayerConfig.visual.damageFlashColor;
        setTimeout(
            () => (this.sprite.tint = PlayerConfig.visual.normalTint), 
            PlayerConfig.combat.hitFlashDuration
        );
        this.playAnimation('hurt', true);

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        if (!this.alive) return;
        
        this.playAnimation('hurt', true);
        this.alive = false;

        const hurtDuration = (this.animations.hurt?.frames.length || 2) * 
                           (this.animations.hurt?.speed || PlayerConfig.animation.defaultSpeed) * 1000;

        setTimeout(() => {
            this.visible = false;
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.destroy({ children: true });
        }, hurtDuration);
    }

    public get isAttacking(): boolean {
        return this.currentAttack !== null;
    }

    public get bounds(): Rectangle {
        return new Rectangle(
            this.x - PlayerConfig.dimensions.width/2,
            this.y - PlayerConfig.dimensions.height,
            PlayerConfig.dimensions.width,
            PlayerConfig.dimensions.height
        );
    }

    get ratio() {
        return this.hp / this.maxHp;
    }
}