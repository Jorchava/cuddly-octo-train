import { Container } from 'pixi.js';

export function intersects(a: Container, b: Container): boolean {
    const A = a.getBounds();
    const B = b.getBounds();
    return !(A.right < B.left || A.left > B.right || A.bottom < B.top || A.top > B.bottom);
}