export class KeyCode {

    static readonly ESCAPE: number = 27;
    static readonly SPACE: number = 32;

    static readonly LEFT: number = 37;
    static readonly UP: number = 38;
    static readonly RIGHT: number = 39;
    static readonly DOWN: number = 40;
    
    static readonly NUM_MINUS: number = 109;
    static readonly NUM_PLUS: number = 107;

    static readonly REVERB: number = 16;
}

export class KeyState {
    readonly pressedKeys: Set<number>;
    readonly releasedKeys: Set<number>;

    constructor(
        pressedKeys: Set<number> = new Set<number>(),
        releasedKeys: Set<number> = new Set<number>())
    {
        this.pressedKeys = pressedKeys;
        this.releasedKeys = releasedKeys;
    }

    public pressed(keyCode: number): boolean {
        return this.pressedKeys.has(keyCode);
    }

    public released(keyCode: number): boolean {
        return this.releasedKeys.has(keyCode);
    }

    update(added: Set<number>, removed: Set<number>): KeyState {
        if (added.size == 0 && removed.size == 0) {
            return this;
        }
        var pressedKeys: Set<number> = this.pressedKeys;
        added.forEach(add => pressedKeys.add(add));
        removed.forEach(remove => pressedKeys.delete(remove));
        return new KeyState(pressedKeys, removed);
    }
}
