import { SimpleColor } from "../../common/colour";

export enum SpectralClass {
    M,
    K,
    G,
    F,

    A,
    B,
    O,
    L,
    Y,
    T,
    WhiteDwarf,
    BrownDwarf,
}


export class Range {
    public from?: number;
    public to?: number;

    constructor(from?: number, to?: number) {
        this.from = from;
        this.to = to;
    }

    get midpoint() {
        if (this.to == null && this.from == null) {
            return 0;
        } else if (this.to == null) {
            return this.from;
        } else if (this.from == null) {
            return this.to / 2;
        } else {
            return (this.to + this.from) / 2;
        }
    }
}

export class SpectralClassModel {

    public id: SpectralClass;
    public description: string;
    public colourDescription: string;
    public colour: SimpleColor;
    public radius: Range;

    constructor(id: SpectralClass, description: string, temperature: Range, colourDescription: string, colour: SimpleColor, radius: Range) {
        this.id = id;
        this.description = description;
        this.colourDescription = colourDescription;
        this.colour = colour;
        this.radius = radius;
    }

    get isDwarf() {
        return (this.id === SpectralClass.WhiteDwarf || this.id === SpectralClass.BrownDwarf) ||
            this.id === SpectralClass.L || this.id === SpectralClass.Y || this.id === SpectralClass.T;
    }

    isHot() {
        return this.id === SpectralClass.F || this.id === SpectralClass.A || this.id === SpectralClass.B || this.id === SpectralClass.O;
    }
    isCool() {
        return this.id === SpectralClass.L || this.id === SpectralClass.Y || this.id === SpectralClass.T;
    }
}

export class SpectralClassRegistry {

    static _instance: SpectralClassRegistry;

    static get instance() {
        if (SpectralClassRegistry._instance == null) {
            SpectralClassRegistry._instance = new SpectralClassRegistry();
        }
        return SpectralClassRegistry._instance;
    }

    readonly classes: SpectralClassModel[] = [
        new SpectralClassModel(SpectralClass.M, "M", new Range(2400, 3700), "Red", SimpleColor.from("#f40b10"), new Range(null, 0.7)),
        new SpectralClassModel(SpectralClass.K, "K", new Range(3700, 5200), "Orange", SimpleColor.from("#F89B24"), new Range(0.7, 0.96)),
        new SpectralClassModel(SpectralClass.G, "G", new Range(5200, 6000), "Yellow", SimpleColor.from("#FFCC66"), new Range(0.96, 1.15)),
        new SpectralClassModel(SpectralClass.F, "F", new Range(6000, 7500), "Yellow white", SimpleColor.from("#ffefcf"), new Range(1.15, 1.4)),
        new SpectralClassModel(SpectralClass.A, "A", new Range(7500, 10000), "White", SimpleColor.from("#fbf8ff"), new Range(1.4, 1.8)),
        new SpectralClassModel(SpectralClass.B, "B", new Range(10000, 30000), "Blue white", SimpleColor.from("#bbccff"), new Range(1.8, 6.6)),
        new SpectralClassModel(SpectralClass.L, "L", new Range(1300, 2400), "Red brown", SimpleColor.from("#a52a2a"), new Range(0.08, 0.15)),
        new SpectralClassModel(SpectralClass.Y, "Y", new Range(500, 1300), "Brown", SimpleColor.from("#964b00"), new Range(0.08, 0.14)),
        new SpectralClassModel(SpectralClass.T, "T", new Range(undefined, 500), "Dark brown", SimpleColor.from("#663300"), new Range(0.08, 0.14)),
        new SpectralClassModel(SpectralClass.WhiteDwarf, "White Dwarf", new Range(2400, 3700), "White", SimpleColor.from("#fbf8ff"), new Range(0.08, 0.14)),
        new SpectralClassModel(SpectralClass.BrownDwarf, "Brown Dwarf", new Range(2400, 3700), "Brown", SimpleColor.from("#964b00"), new Range(0.08, 0.14)),
    ];

}