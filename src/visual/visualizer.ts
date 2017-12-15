import {KeyBoard, WaveDefinition} from "../keyboard";

export class Visualizer {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    
        constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
            this.canvas = canvas;
            this.ctx = ctx;

            this.ctx.lineWidth = 4;
        }
    
        render(keyBoard: KeyBoard, t: number) {
            const wave:WaveDefinition = keyBoard.getWaveDef();
            
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            const path: Path2D | undefined = this.pathFromWave(wave);

            this.ctx.strokeStyle = 'red';
            this.ctx.stroke(path);
        }

        private prevWave: WaveDefinition;
        private prevPath: Path2D;
        pathFromWave(wave: WaveDefinition): Path2D {
            if (wave == this.prevWave) {
                return this.prevPath;
            }
            const widthScale = this.canvas.width / 100;
            const heightScale = this.canvas.height / 2;

            var path: Path2D = new Path2D();
            path.moveTo(0, heightScale - wave.y(0) * heightScale);

            for (let i = 1; i < 100; i++) {
                const x = i * widthScale;
                const y = heightScale - wave.y(i / 100) * heightScale;
                path.lineTo(x, y);
            }

            this.prevWave = wave;            
            this.prevPath = path;
            return path;
        }
}