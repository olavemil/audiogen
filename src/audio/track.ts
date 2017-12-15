import {Segment, Sound} from "sound";
import {Random} from "../math/random";

export class Note {
    static readonly interval: number = 1.059463;

    readonly voice: number;
    readonly t: number;
    readonly d: number;
    readonly frequency: number;
    readonly pan: number;//-1 to 1

    constructor(cfg: BarConfig, voice: number, t: number, d: number, frequency: number) {
        this.voice = voice;
        this.frequency = frequency;
        this.pan = cfg.pan;
        this.t = t;
        this.d = d;
    }

    static semitone(cfg: BarConfig, voice: number, t: number, d: number, semitone: number, octaveOffset:number=0): Note {
        const octave = Math.floor(cfg.trackConfig.octaveOffset + octaveOffset);
        const freq = 440 * (Note.interval ** (octave * 12 - semitone));

        return new Note(cfg, voice, t, d, freq);
    }
}

export class Bar {
    readonly notes: Note[];
    private readonly cfg: BarConfig;

    constructor(cfg: BarConfig, notes: Note[]) {
        this.notes = notes;
        this.cfg = cfg;
    }

    get duration(): number {
        return this.cfg.beats * this.cfg.trackConfig.bps;
    }
}

class BarConfig {
    trackConfig: TrackConfig;
    beats: number = 4;
    pan: number = 0;
}

export interface TrackConfig {
    readonly duration: number;
    readonly random: Random;
    readonly bps: number;
    readonly octaveOffset: number;
    readonly voice: number;
    readonly pan: number;
}

export class MutableTrackConfig implements TrackConfig {
    duration: number = 30;
    bps: number = 2;
    octaveOffset: number = 0;
    voice: number = 0;
    pan: number = 0;
    readonly random: Random;

    constructor(seed: number) {
        this.random = new Random(seed);
    }
}

export class Track {
    readonly bars: Bar[];

    private constructor(bars: Bar[]) {
        this.bars = bars;
    }

    static fromBars(bars: Bar[]): Track {
        return new Track(bars);
    }

    static generate(cfg: TrackConfig): Track {
        const bars: Bar[] = [];
        var t: number = 0;
        
        var barCfg: BarConfig = new BarConfig();
        barCfg.trackConfig = cfg;
        barCfg.pan = cfg.pan;

        while (t < cfg.duration) {
            const bar: Bar = Track.generateBar(barCfg, t);
            bars.push(bar);
            t += bar.duration;
        }
        return new Track(bars);
    }

    static generateBar(cfg: BarConfig, t: number): Bar {
        const notes: Note[] = [];
        var barT = 0;
        const random = cfg.trackConfig.random;

        const beatDuration: number = 1 / cfg.trackConfig.bps; 
        while (barT < cfg.beats * cfg.trackConfig.bps) {
            const dPan = random.floatRange(-1, 1);
            cfg.pan = (cfg.pan + dPan)/2;
            const octaveOffset: number = random.intRange(-1, 1, 2);
                        
            const semitone: number = random.bool(0.05) ? random.intRange(12) : Track.cleanNote(random);
            
            const d: number = beatDuration * Track.beatLength(random);
            t += d;
            barT += d;
            notes.push(Note.semitone(cfg, cfg.trackConfig.voice, t, d, semitone, octaveOffset));
        }
        return new Bar(cfg, notes);
    }

    static cleanNote(random: Random): number {
        switch(random.intRange(8)) {
            case 0:return 0;
            case 1:return 2;
            case 2:return 3;
            case 3:return 5;
            case 4:return 7;
            case 5:return 9;
            case 6:return 10;
            default:return 12;
        }
    }
    
    static beatLength(random: Random): number {
        switch(random.intRange(0, 24)) {
            case 0:return 0.25;
            case 1:return 0.5;
            case 2:return 0.5;
            case 3:return 0.75;
            case 4:return 0.75;
            case 5:return 1;
            case 6:return 1;
            case 7:return 1;
            case 8:return 1;
            case 9:return 1;
            case 10:return 1.25;
            case 11:return 1.5;
            case 12:return 1.5;
            case 13:return 2;
            case 14:return 2;
            case 15:return 2;
            case 16:return 2.5;
            case 17:return 3;
            case 18:return 4;
            case 19:return 4;
            case 20:return 6;
            default:return 0;
        }
    }
}