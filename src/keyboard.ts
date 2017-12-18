import {KeyState, KeyCode} from "keystate";
import {AudioPlayer} from "audio/audioplayer";
import {Complex } from "./math/complex";
import {Random} from "math/random";

class Key {
    private readonly output: AudioNode;
    private readonly node: OscillatorNode;
    private readonly panner: StereoPannerNode;
    private readonly gain: GainNode;

    constructor(node: OscillatorNode, panner: StereoPannerNode, gain: GainNode) {
        this.node = node;
        this.panner = panner;
        this.gain = gain;
    }

    stop(): void {
        const time = this.gain.context.currentTime;
        this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.02);
        this.node.stop(time + 0.04);
    }
    
    start(): void {
        this.gain.gain.value = 0.01;
        this.gain.gain.exponentialRampToValueAtTime(1, this.gain.context.currentTime + 0.02);
        this.node.start();
    }
}

export class KeyBoard {
    private instrument: number;
    private waveDef: WaveDefinition;
    private currentWave: PeriodicWave;
    readonly keyByCode: {[key:number]:Key} = {};
    readonly audioPlayer: AudioPlayer;
    private octave: number = 0;
    private static readonly octaveLimit = 3;

    constructor(audioPlayer: AudioPlayer) {
        this.audioPlayer = audioPlayer;
        this.waveDef = this.random(4);
        this.currentWave = this.wave(this.waveDef, this.audioPlayer.ctx);
    }
    
    update(keyState: KeyState): void {
        for (const stopped of keyState.releasedKeys) {
            if (stopped == KeyCode.NUM_MINUS && this.octave > -KeyBoard.octaveLimit) {
                this.octave--;
            } else if (stopped == KeyCode.NUM_PLUS && this.octave < KeyBoard.octaveLimit) {
                this.octave++;
            } else if (stopped == KeyCode.REVERB) {
                this.audioPlayer.toggleReverb();
            } else if (this.instruments.indexOf(stopped) >= 0) {
                this.instrument = this.instruments.indexOf(stopped);
                this.waveDef = this.waveForInstrument(this.instrument);
                this.currentWave = this.wave(this.waveDef, this.audioPlayer.ctx);
            } else {
                this.stop(stopped);
            }
        }
        for (const started of keyState.pressedKeys) {
            if (this.semitoneCodes.indexOf(started) >= 0) {
                this.start(started);
            }
        }
    }
    
    stop(keyCode: number): void {
        var key: Key|null = this.keyByCode[keyCode];
        if (key != null) {
            key.stop();
            delete this.keyByCode[keyCode];
        }
    }

    start(keyCode: number): void {
        var key: Key|null = this.keyByCode[keyCode];

        if (key != null) {
            return;
        }
        key = this.keyFor(keyCode, this.audioPlayer, this.octave);
        this.keyByCode[keyCode] = key;
        key.start();
    }

    keyFor(keyCode: number, audioPlayer: AudioPlayer, octave: number): Key {
        const semitone = this.semitoneCodes.indexOf(keyCode);
        
        const gain: GainNode = audioPlayer.ctx.createGain();
        gain.connect(audioPlayer.output);

        const panner: StereoPannerNode = audioPlayer.ctx.createStereoPanner();
        panner.connect(gain);
        panner.pan.value = this.pan(semitone, octave);
        
        const oscillator: OscillatorNode = audioPlayer.ctx.createOscillator();
        const frequency: number = this.frequency(semitone, octave);
        oscillator.frequency.value = frequency / 2;
        oscillator.frequency.exponentialRampToValueAtTime(frequency, audioPlayer.ctx.currentTime + 0.03);
        oscillator.setPeriodicWave(this.currentWave);
        oscillator.connect(panner);

        return new Key(oscillator, panner, gain);
    }
    
    readonly semitoneCodes: number[] = [
        65,// A
        87,//  W
        83,// S
//69,//  E
        68,// D
        82,//  R
        70,// F
        84,//  T
        71,// G
//89,//  Y
        72,// H
        85,//  U
        74,// J
        73,//  I
        75,// K
        79,//  O
        76,// L
//80,//  P
        186,// Ø
        219,//  Å
        222,// Æ
        221,//  ¨
        220,// '
    ];

    readonly interval: number = 1.059463;
    frequency(semitone: number, octave: number): number {
        const Pa: number = 440;//Hz
        const n = octave * 12 + semitone;
        const a = 0;

        return Pa * (this.interval ** (n - a));
    }
    
    pan(semitone: number, octave: number): number {        
        //min = -1 = {octave = -4, semitone = 0} = -48 + (0 - 5.5) = -53.5
        //mid = 0 = {octave = 0, semitone = 6}
        //max = +1 = {octave = +4, semitone = 11} = 48 + (11 - 5.5) = 
        return (octave * 12 + (semitone - 5.5)) / (12 * KeyBoard.octaveLimit + 5.5 + 20);
    }

    wave(def: WaveDefinition, ctx: AudioContext): PeriodicWave {        
        return ctx.createPeriodicWave(def.real, def.imag);
    }

    getWaveDef(): WaveDefinition {
        return this.waveDef;
    }

    getInstrument(): number {
        return this.instrument;
    }

    readonly instruments: number[] = [
        97,//0 - pad
        98,//1 - piano
        99,//2 - random
        100,//3
        101,//4
        102,//5
        103,//6
        104,//7
        105//8
    ];

    waveForInstrument(instrument: number): WaveDefinition {
        switch (instrument) {
            case 2:return this.random();
            case 1:return this.piano();
            case 0:
            default:return this.pad();
        }
    }
    
    piano(n: number = 32): WaveDefinition {
        const real = new Float32Array(n);
        const imag = new Float32Array(n);

        imag.fill(0);
        real.fill(0);

        const random: Random = new Random(n);

        for (let k = 0; k < n; k++) {
            if (random.bool(k/n)) {
                continue;
            }
            var v: number = 1 / (k + 1);
            
            if (random.bool(v)) {
                real[k] = (-1)**k * v;
            }
            if (random.bool(v)) {
                imag[k] = (-1)**(3*k) * v;
            }
        }
        real[0] = 0.5;
        real[1] = 0.8;
        real[2] = 1;
        imag[2] = 1;

        return new WaveDefinition(real, imag);
    }

    pad(n: number = 128): WaveDefinition {
        const real = new Float32Array(n);
        const imag = new Float32Array(n);

        imag.fill(0);
        real.fill(0);

        const random: Random = new Random(n);

        for (let k = 0; k < n; k++) {
            if (random.bool(0.4)) {
                continue;
            }
            var v: number = 1 / (k + 1);
            
            if (random.bool(v)) {
                real[k] = (-1)**k * v;
            }
            if (random.bool(v)) {
                imag[k] = (-1)**(3*k) * v;
            }
        }

        return new WaveDefinition(real, imag);
    }
    
    random(s: number = new Date().getTime()): WaveDefinition {        
        const random: Random = new Random(s);
        const n: number = Math.min(random.intRange(4, 32), random.intRange(32));

        var real = new Float32Array(n);
        const imag = new Float32Array(n);

        imag.fill(0);
        real.fill(0);

        const t: number = random.floatRange(0, 1, 2);
        for (let k = 0; k < n; k++) {
            if (random.bool(0.3)) {
                continue;
            }
            var factor = (1 - k / (n * 2));
            factor *= factor;

            if (random.bool(0.3) && k > 1) {
                factor *= real[k-1];
            }

            real[k] = (1 - random.floatRange(-1, 1, n-k)) * factor;
            imag[k] = (1 - random.floatRange(-1, 1, k)) * factor;
        }
        const smoothing = random.intRange(3, 9);
        const window = 2;
        
        var real_t = new Float32Array(n);

        for (let i = 0; i < smoothing; i++) {
            for (let k = window; k < n-window; k++) {
                var avg: Complex = new Complex(real[k-1], imag[k-1]);
                for (let j = k-window; j < k+window; j++) {
                    avg = avg.add(new Complex(real[j], imag[j]))                    
                }
                avg = avg.divr(3);
                real_t[k] = avg.real;
                //imag[k] = avg.imag;
            }
            real = real_t;
            real_t = new Float32Array(n);
        }

        return new WaveDefinition(real, imag);
    }
}

export class WaveDefinition {
    readonly real: Float32Array;
    readonly imag: Float32Array;

    constructor(real: Float32Array, imag: Float32Array) {
        this.real = real;
        this.imag = imag;
    }
    
    y(t: number):number {
        var length: number = Math.min(this.real.length, this.imag.length);
        var y: number = this.real[0];

        for (let i = 1; i < length; i++) {
            const r: number = this.real[i];
            const e: number = this.imag[i];
            
            const component: Complex = new Complex(r,  e).mul(Complex.expi(i * t * 2 * Math.PI));
            y += component.real;
        }
        return y / length;
    }
}