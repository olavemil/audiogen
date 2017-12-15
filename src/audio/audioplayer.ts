import {Note} from "track";

export class AudioPlayer {
    readonly ctx: AudioContext;
    readonly output: GainNode;
    readonly panners: {[track: number]:StereoPannerNode;} = {};

    constructor(ctx: AudioContext) {
        this.ctx = ctx;
        this.output = ctx.createGain();
        this.output.connect(ctx.destination);
        this.output.gain.value = 0.5;
    }

    playSoundOnce(buffer: AudioBuffer, t: number): void {
        const source: AudioBufferSourceNode = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.output);
        source.start(t);
    }

    play(note: Note, track: number): void {
        var panner: StereoPannerNode|null = this.panners[track];
        if (!panner) {
            panner = this.ctx.createStereoPanner();
            panner.connect(this.output);
            this.panners[track] = panner;
        }
        const oscillator: OscillatorNode = this.ctx.createOscillator();
        oscillator.frequency.value = note.frequency;
        oscillator.type = AudioPlayer.voice(note.voice);
        oscillator.connect(panner);
        panner.pan.value = note.pan;
        oscillator.start(note.t);
        oscillator.stop(note.t + note.d);
    }

    static voice(voice: number): OscillatorType {
        switch(voice) {
            case 1: return 'square';
            case 2: return "sawtooth";
            case 3: return "triangle";
            //case 4: return "custom";
            default: return 'sine';
        }
    }
}