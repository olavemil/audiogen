import {KeyState, KeyCode} from "keystate";
import {AudioPlayer} from "audio/audioplayer";
import {Score} from "audio/score";
import {Visualizer} from "visual/visualizer";
import {KeyBoard, WaveDefinition} from "keyboard";
import {ImpulseResponse} from "impulseresponse";

class Program {
    private readonly canvas: HTMLCanvasElement;
    private readonly visualizer: Visualizer;
    private readonly score: Score;
    private keyboard: KeyBoard;
    private audioPlayer: AudioPlayer;
    private pendingPressedKeyCodes: Set<number> = new Set<number>();
    private pendingReleasedKeyCodes: Set<number> = new Set<number>();

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        var graphicsCtx: CanvasRenderingContext2D|null = canvas.getContext('2d');
        if (graphicsCtx == null) {
            window.close();
            return;
        }
        this.visualizer = new Visualizer(canvas, graphicsCtx);
        this.score = Score.generate(0);
    }

    run(impulseResponse: string): any {
        this.audioPlayer = new AudioPlayer(new AudioContext(), impulseResponse);
        this.keyboard = new KeyBoard(this.audioPlayer);
        var keyState: KeyState = new KeyState();
        var lastTime: number = Date.now();
        var timer:number = window.setInterval(() => {
            this.mainloop(keyState, Date.now());
        }, 40);
    }

    mainloop(prevKeyState: KeyState, t: number): void {
        const keyState: KeyState = prevKeyState.update(this.pendingPressedKeyCodes, this.pendingReleasedKeyCodes);
        this.pendingPressedKeyCodes = new Set<number>();
        this.pendingReleasedKeyCodes = new Set<number>();

        if (keyState.released(KeyCode.SPACE)) {
            this.score.play(this.audioPlayer);
        }

        this.keyboard.update(keyState);
        this.visualizer.render(this.keyboard, t);
    }

    onKeyDown(event: KeyboardEvent) {
        this.pendingPressedKeyCodes.add(event.keyCode);
    }
    
    onKeyUp(event: KeyboardEvent) {
        this.pendingReleasedKeyCodes.add(event.keyCode);
        console.log(event.keyCode);
    }

    resizeCanvas(): void {            
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

window.onload = () => {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const program = new Program(canvas);
    
    program.resizeCanvas();
    window.onresize = () => program.resizeCanvas();
    document.onkeydown = (event: KeyboardEvent) => {
        program.onKeyDown(event)
    };
    document.onkeyup = (event: KeyboardEvent) => {
        program.onKeyUp(event)
    };
    program.run(ImpulseResponse.base64string);
}