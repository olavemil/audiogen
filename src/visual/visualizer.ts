import {KeyBoard, WaveDefinition} from "../keyboard";

export class Visualizer {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    
        constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
            this.canvas = canvas;
            this.ctx = ctx;

        }
    
        render(keyBoard: KeyBoard, t: number) {
            const wave:WaveDefinition = keyBoard.getWaveDef();
            
            this.ctx.fillStyle = 'rgba(0, 0, 0, '+ (keyBoard.audioPlayer.reverbOn ? '0.08' : '0.2') + ')';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            const path: Path2D | undefined = this.pathFromWave(wave, t);

            const instr: number = keyBoard.getInstrument();
            switch(instr) {
                case 0:this.ctx.strokeStyle = 'rgb(255, 64, 64)';break;
                case 1:this.ctx.strokeStyle = 'rgb(64, 255, 64)';break;
                case 2:this.ctx.strokeStyle = 'rgb(64, 64, 255)';break;
                default:this.ctx.strokeStyle = 'rgb(255, 255, 0)';break;
            }
            
            const count = Object.keys(keyBoard.keyByCode).length;
            const width: number = (count + 0.5) * .8;

            this.ctx.lineWidth = width;
            this.ctx.stroke(path);

            const height: number = (keyBoard.audioPlayer.reverbOn ? 2 : 1) + count;
            const phase = 0.6 + 0.4 * Math.sin(Math.PI * t / 500.0);
            const alpha: number = phase * (12 - height) / 12;

            this.ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha+ ')';
            this.ctx.fillRect(0, (this.canvas.height - height) / 2, this.canvas.width, height);
            
            for (const key of Object.keys(keyBoard.keyByCode)) {
                
            }
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fillRect(0, (this.canvas.height - height) / 2, this.canvas.width, height);
        }

        private prevWave: WaveDefinition;
        private prevPath: Path2D;

        pathFromWave(wave: WaveDefinition, t: number): Path2D {
            const samples: number = this.canvas.width;

            var path: Path2D = new Path2D();

            const phase: number = (t/8)%samples;
            const y = [];
            var max: number = 0;
            for (let i = 1; i < samples; i++) {
                const value: any = wave.y((phase + i) / samples);
                if (Math.abs(value) > max) {
                    max = Math.abs(value);
                }
                y.push(value);
            }

            const heightScale = this.canvas.height / 2;
            path.moveTo(0, heightScale - wave.y(0) * heightScale);
            for (let i = 1; i < samples; i++) {
                path.lineTo(i, heightScale - y[i] * heightScale/max);
            }

            this.prevWave = wave;            
            this.prevPath = path;
            return path;
        }
}