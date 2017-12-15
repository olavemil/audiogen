export class Random {
    private readonly mt: MersenneTwister;

    constructor(seed: number) {
        this.mt = new MersenneTwister(seed);
    }
    
    bool(chance: number = 0.5): boolean {
        return this.float() < chance;
    }

    int(): number {
        return this.mt.int();
    }

    intRange(a: number, b: number=0, power: number = 1): number {
        const min = Math.min(a, b);
        const max = Math.max(a, b);
        return ~~(min + this.float(power) * (max - min));
    }
    
    float(power: number = 1): number {
        if (power == 1) {
            return this.mt.int() * (1.0 / MAX_INT);
        }
        var r: number = 1;
        for (let i = 0; i < power; i++) {
            r *= this.mt.int() * (1.0 / MAX_INT);            
        }
        return r;
    }
    
    floatRange(a: number, b: number=0, power: number = 1): number {
        const min = Math.min(a, b);
        const max = Math.max(a, b);
        return min + this.float(power) * (max - min);
    }
}

// TypeScript port of: https://github.com/pigulla/mersennetwister
/**
 * A standalone, pure JavaScript implementation of the Mersenne Twister pseudo random number generator. Compatible
 * with Node.js, requirejs and browser environments. Packages are available for npm, Jam and Bower.
 *
 * @module MersenneTwister
 * @author Raphael Pigulla <pigulla@four66.com>
 * @license See the attached LICENSE file.
 * @version 0.2.3
 */

/*
 * Most comments were stripped from the source. If needed you can still find them in the original C code:
 * http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/CODES/mt19937ar.c
 *
 * The original port to JavaScript, on which this file is based, was done by Sean McCullough. It can be found at:
 * https://gist.github.com/banksean/300494
 */

const MAX_INT = 4294967296.0;
const N = 624;
const M = 397;
const UPPER_MASK = 0x80000000;
const LOWER_MASK = 0x7fffffff;
const MATRIX_A = 0x9908b0df;

class MersenneTwister {
    private mt: number[];
    private mti: number;

    /**
     * Instantiates a new Mersenne Twister.
     */
    constructor(seed: number = new Date().getTime()) {
        this.mt = new Array(N);
        this.mti = N + 1;

        this.seed(seed);
    }

    /**
     * Initializes the state vector by using one unsigned 32-bit integer "seed", which may be zero.
     */
    seed(seed: number): void {
        let s: number;

        this.mt[0] = seed >>> 0;

        for (this.mti = 1; this.mti < N; this.mti++) {
            s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] =
                (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            this.mt[this.mti] >>>= 0;
        }
    }

    /**
     * Generates a random unsigned 32-bit integer.
     */
    int(): number {
        let y: number;
        let kk: number;
        const mag01 = new Array(0, MATRIX_A);

        if (this.mti >= N) {
            if (this.mti === N + 1) {
                this.seed(5489);
            }

            for (kk = 0; kk < N - M; kk++) {
                y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
                this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 1];
            }

            for (; kk < N - 1; kk++) {
                y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
                this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];
            }

            y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
            this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 1];
            this.mti = 0;
        }

        y = this.mt[this.mti++];

        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    }
}