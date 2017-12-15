export class Sound {
    readonly startTime: number;
    readonly duration: number;
    
    get endTime(): number {
        return this.startTime + this.duration;
    }
    
    readonly buffer: AudioBuffer;

    constructor(buffer: AudioBuffer, t: number) {
        this.buffer = buffer;
        this.startTime = t;
    }
}

export class Segment {
    readonly sounds: Sound[];
    readonly duration: number;
    startTime: number;
    
    get endTime(): number {
        return this.startTime + this.duration;
    }
    
    constructor(sounds: Sound[]) {
        this.sounds = sounds;
        var duration = 0;
        for (const sound of sounds) {
            if (sound.endTime > duration) {
                duration = sound.endTime;
            }
        }
        this.duration = duration;
    }
}