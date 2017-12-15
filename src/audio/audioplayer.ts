import {Note} from "track";

export class AudioPlayer {
    readonly ctx: AudioContext;
    readonly output: GainNode;
    readonly reverb: ConvolverNode;
    readonly panners: {[track: number]:StereoPannerNode;} = {};
    private reverbOn: boolean;

    constructor(ctx: AudioContext, impulseResponse: string) {
        this.ctx = ctx;

        this.reverb = ctx.createConvolver();
        this.reverb.connect(ctx.destination);

        this.reverb.buffer;
        const self: AudioPlayer = this;
        ctx.decodeAudioData(AudioPlayer.base64ToArrayBuffer(impulseResponse), function(buffer: AudioBuffer) {
            self.reverb.buffer = buffer;
        });

        this.output = ctx.createGain();
        this.output.connect(this.reverb);
        this.output.gain.value = 1;

        this.reverbOn = true;
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

    toggleReverb(): void {
        if (this.reverbOn) {
            this.output.disconnect(this.reverb);
            this.output.connect(this.ctx.destination);
            this.reverbOn = false;
        } else {
            this.output.disconnect(this.ctx.destination);
            this.output.connect(this.reverb);
            this.reverbOn = true;
        }
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
    
    private static base64ToArrayBuffer(base64: string): ArrayBufferLike {
        var binaryString: string = window.atob(base64);
        var len = binaryString.length;
        var bytes: Uint8Array = new Uint8Array(len);
        for (var i = 0; i < len; i++)        {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}