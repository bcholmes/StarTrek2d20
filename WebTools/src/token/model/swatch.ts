import { Token } from "./token";

class Swatch {
    id: number;
    name: string;
    svg: string|((token: Token) => string);

    constructor(id: number, name: string, svg: string|((token: Token) => string)) {
        this.id = id;
        this.name = name;
        this.svg = svg;
    }
}

export default Swatch;
