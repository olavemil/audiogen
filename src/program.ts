import {KeyState, KeyCode} from "keystate";
import {AudioPlayer} from "audio/audioplayer";
import {Score} from "audio/score";
import {Visualizer} from "visual/visualizer";

class Program {
    private readonly canvas: HTMLCanvasElement;
    private readonly audioPlayer: AudioPlayer;
    private readonly visualizer: Visualizer;
    private readonly score: Score;
    private pendingPressedKeyCodes: Set<number> = new Set<number>();
    private pendingReleasedKeyCodes: Set<number> = new Set<number>();

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        var graphicsCtx: CanvasRenderingContext2D|null = canvas.getContext('2d');
        if (graphicsCtx == null) {
            window.close();
            return;
        }
        this.visualizer = new Visualizer(graphicsCtx);
        this.audioPlayer = new AudioPlayer(new AudioContext());
        this.score = Score.generate(0);
    }

    run(): any {
        var keyState: KeyState = new KeyState();
        var lastTime: number = Date.now();
        this.score.play(this.audioPlayer);
        var timer:number = window.setInterval(() => {
            this.mainloop(keyState, Date.now());
        }, 40);
    }

    mainloop(prevKeyState: KeyState, t: number): void {
        var keyState: KeyState = prevKeyState.update(this.pendingPressedKeyCodes, this.pendingReleasedKeyCodes);
        this.pendingPressedKeyCodes = new Set<number>();
        this.pendingReleasedKeyCodes = new Set<number>();
        this.visualizer.render(this.score, t);
        //live playing key input
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
    var canvas = <HTMLCanvasElement>document.getElementById('canvas');
    var program = new Program(canvas);
    
    window.onresize = () => program.resizeCanvas();
    document.onkeydown = (event: KeyboardEvent) => {
        program.onKeyDown(event)
    };
    document.onkeyup = (event: KeyboardEvent) => {
        program.onKeyUp(event)
    };
    program.run();
}