export class Vector2 {
    public static readonly zero: Vector2 = new Vector2(0, 0);
    public static readonly unit: Vector2 = new Vector2(1, 1);
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    static random(multiplier: number = 1): Vector2 {
        return new Vector2(
            (2 * Math.random() - 1) * multiplier,
            (2 * Math.random() - 1) * multiplier);
    }

    static x(y: number) {
        return new Vector2(0, y);
    }
    
    static y(x: number) {
        return new Vector2(x, 0);
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    
    adds(scalar: number): Vector2 {
        return new Vector2(this.x + scalar, this.y + scalar);
    }
    
    sub(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    
    subs(scalar: number): Vector2 {
        return new Vector2(this.x - scalar, this.y - scalar);
    }
    
    mul(other: Vector2): Vector2 {
        return new Vector2(this.x * other.x, this.y * other.y);
    }
    
    muls(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    
    div(other: Vector2): Vector2 {
        return new Vector2(this.x / other.x, this.y / other.y);
    }
    
    divs(scalar: number): Vector2 {
        return new Vector2(this.x / scalar, this.y / scalar);
    }
    
    dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    public toString(): string {
        if (this == Vector2.zero) {
            return "<zero>";
        }
        if (this == Vector2.unit) {
            return "<unit>";
        }
        return "<x:" + this.x + ", y:" + this.y + ">";
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(multiplier: number = 1): Vector2 {
        var length: number = this.length();
        if (length == 0) {
            return Vector2.zero;
        }
        return this.muls(multiplier / length);
    }

    limit(limit: number = 1): Vector2 {
        if (this.length() > limit) {
            return this.normalize(limit);
        }
        return this;
    }
}