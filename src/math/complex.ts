export class Complex {
    readonly real: number;
    readonly imag: number;
    
    constructor(real: number, imag: number) {
        this.real = real;
        this.imag = imag;
    }

    static real(r: number) {
        return new Complex(r, 0);
    }
    
    static imag(i: number) {
        return new Complex(0, i);
    }

    add(other: Complex): Complex {
        return new Complex(
            this.real + other.real,
            this.imag + other.imag
        );
    }

    addr(real: number): Complex {
        return new Complex(
            this.real + real,
            this.imag
        );
    }
    
    addi(imag: number): Complex {
        return new Complex(
            this.real,
            this.imag + imag
        );
    }

    sub(other: Complex): Complex {
        return new Complex(
            this.real - other.real,
            this.imag - other.imag
        );
    }

    mul(other: Complex): Complex {
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }
    
    mulr(real: number): Complex {
        return new Complex(
            this.real * real,
            this.imag * real,
        );
    }

    muli(imag: number): Complex {
        return new Complex(
            -this.imag * imag,
            this.real * imag
        );
    }
    
    div(other: Complex): Complex {
        const divisor = other.real * other.real + other.imag * other.imag;
        return new Complex(
            (this.real * other.real + this.imag * other.imag) / divisor,
            (this.imag * other.real - this.real * other.imag) / divisor
        );
    }
    
    divr(real: number): Complex {
        return new Complex(
            this.real / real,
            this.imag / real
        );
    }
    
    divi(imag: number): Complex {
        return new Complex(
            this.imag / imag,
            -this.real / imag
        );
    }
    
    static exp(other: Complex): Complex {
        const r: number = Math.exp(other.real);
        return new Complex(
            r * Math.cos(other.imag),
            r * Math.sin(other.imag)
        )
    }

    static expi(imag: number): Complex {
        return new Complex(
            Math.cos(imag),
            Math.sin(imag)
        )
    }
}