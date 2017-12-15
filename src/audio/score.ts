import {Track, Bar, MutableTrackConfig} from "track";
import {AudioPlayer} from "audioplayer";

export class Score {
    private isPlaying: boolean = false;
    private tracks: Track[];

    private constructor(tracks: Track[]) {
        this.tracks = tracks;
    }

    static generate(seed: number): Score {
        const tracks: Track[] = [];
        const cfg = new MutableTrackConfig(seed);
        cfg.duration = 240;

        //sine
        cfg.voice = 0;
        cfg.bps = 2;
        cfg.octaveOffset = 0;
        tracks.push(Track.generate(cfg));

        cfg.bps = 2;
        cfg.octaveOffset = 1;
        tracks.push(Track.generate(cfg));

        cfg.bps = 4;
        cfg.octaveOffset = 2;
        tracks.push(Track.generate(cfg));

        //square
        cfg.voice = 1;
        cfg.bps = 4;
        cfg.octaveOffset = -1;
        cfg.pan = -1;
        tracks.push(Track.generate(cfg));
        cfg.bps = 1;
        cfg.octaveOffset = -2;
        cfg.pan = 1;
        tracks.push(Track.generate(cfg));
        
        //sawtooth
        cfg.voice = 2;
        cfg.bps = 16;
        cfg.octaveOffset = 2;
        cfg.pan = 0;
        tracks.push(Track.generate(cfg));

        return new Score(tracks);
    }

    play(player: AudioPlayer): void {
        if (this.isPlaying) {
            return;
        }
        this.isPlaying = true;
        for (let t = 0; t < this.tracks.length; t++) {
            const track: Track = this.tracks[t];
            const bars = track.bars;
            for (const bar of bars) {
                const notes = bar.notes;
                for (const note of notes) {
                    player.play(note, t);
                }   
            }   
        }
    }
}