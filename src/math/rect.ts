import { Vector2 } from "./vector2";

export interface Positioned {
    readonly position: Vector2;
    move(offset: Vector2): void;
}

export interface Sized {
    readonly size: Vector2;
    inset(x: number, y: number, w: number, h: number): void;
    scale(x: number, y: number): void;
}

export class Rect implements Positioned, Sized {
    private backingPosition: Vector2;
    private backingSize: Vector2;
    
    get position(): Vector2 {
        return this.position;
    }

    get size(): Vector2 {
        return this.size;
    }

    get center(): Vector2 {
        return this.position.add(this.size.divs(2));
    }

    get bottom(): number {
        return this.position.y + this.size.y;
    }

    get right(): number {
        return this.position.x + this.size.x;
    }

    move(offset: Vector2): void {
        this.backingPosition = this.backingPosition.add(offset);
    }

    inset(l: number, t: number, r: number, b: number): void {
        this.backingPosition = new Vector2(this.backingPosition.x+l, this.backingPosition.y+t);
        this.backingSize = new Vector2(this.backingSize.x - (l+r), this.backingSize.y - (t+b));
    }

    scale(x: number, y: number=x): void {
        const newSize = this.backingSize.mul(new Vector2(y, x));
    }

    constructor(position: Vector2, size: Vector2){
        this.backingPosition = position;
        this.backingSize = size;
    }

    static rect(x: number, y: number, w: number, h: number): Rect {
        return new Rect(new Vector2(x, y), new Vector2(w, h));
    }

    contains(point: Vector2): boolean {
        return point.x >= this.position.x &&
        point.y >= this.position.y &&
        point.x < this.right &&
        point.y < this.bottom;
    }
    
    overlaps(rect: Rect): boolean {
        return rect.right >= this.position.x &&
        rect.bottom >= this.position.y &&
        rect.position.x < this.right &&
        rect.position.x < this.bottom;
    }
}

export interface Bounded {
    readonly bounds: Rect;
}