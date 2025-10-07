/**
 * Collision detection system optimized for 2D fighting game mechanics.
 * Uses PixiJS v8's improved bounds calculation and hit testing.
 */
import { Container } from 'pixi.js';
/**
 * Checks for intersection between two display objects
 * Benefits from v8's more accurate bounds calculations
 */
export function intersects(a: Container, b: Container): boolean {
    const A = a.getBounds();
    const B = b.getBounds();
    return !(A.right < B.left || A.left > B.right || A.bottom < B.top || A.top > B.bottom);
}