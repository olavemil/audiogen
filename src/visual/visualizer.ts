import {Score} from "../audio/score";

export class Visualizer {    
    readonly ctx: CanvasRenderingContext2D;
    
        constructor(ctx: CanvasRenderingContext2D) {
            this.ctx = ctx;
        }
    
        render(score: Score, t: number) {
    
        }
}