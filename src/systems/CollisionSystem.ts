// colilsion util AABB using pixi bounds
// import * as PIXI from 'pixi.js';
// DisplayObject error was not living in pixi.js ? found deleted v8?
import { Container } from 'pixi.js';

export function intersects(a: Container, b: Container): boolean {
    //v8 DisplayObject already has getBounds() watch out for performance
    // in larger, scaled games
    //const A = (a as any).getBounds?.() as PIXI.Rectangle;
    //const B = (b as any).getBounds?.() as PIXI.Rectangle;
    const A = a.getBounds();
    const B = b.getBounds();
    //if (!A || !B) return false;
    //return !(A.right < B.left || A.left > B.right || A.bottom < B.top || A.top > B.bottom);
    return !(
        A.maxX < B.minX ||
        A.minX > B.maxX ||
        A.maxY < B.minY ||
        A.minY > B.maxY
    );
}