import { D20 } from "../../common/die";

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
    TTauri,
}

export enum WorldClass {
    AsteroidBelt,
    C,
    D, 
    E,
    H,
    I,
    J,
    K,
    L,
    M,
    N,
    O,
    P,
    T,
    Y,
}

export enum RomanNumerals {
    I,
    II,
    III,
    IV,
    V,
    VI,
    VII,
    VIII,
    IX,
    X,
    XI,
    XII,
    XIII,
    XIV,
    XV,
    XVI,
    XVII,
    XVIII,
    XIX,
    XX
}

/**
 * Symbol   Class of Star                  Example
 * 0 	    Extreme, luminous supergiants 	 
 * Ia       Luminous supergiants           Betelgeuse
 * Ib       Less luminous supergiants      Antares
 * II       Bright giants                  Canopus
 * III      Normal giants                  Aldebaran
 * IV       Subgiants                      Procyon
 * V        Main sequence                  Sun
 * sd       Subdwarfs                      Kapteyn's Star (HD 33793)
 * wd or D  White dwarfs                   Sirius B
 */
 export enum LuminosityClass {
    VI,
    V,
    IV,
    III,
    II,
    Ib,
    Ia
}

export class Sector {
    public id: string;
    public systems: StarSystem[] = [];

    constructor(idPrefix: string) {
        this.id = Sector.randomId(idPrefix);
    }

    private static randomId(prefix: string) {
        const alphaNumeric = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = prefix + "-";
        for (let i = 0; i < 6; i++) {
            if (D20.roll() === 1) {
                result += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
            } else {
                result += alphaNumeric.charAt(Math.floor(Math.random() * 10));
            }
        }
        return result;
    }
}

export class SectorCoordinates {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get description() {
        return "" + this.x + ", " + this.y + ", " + this.z;
    }

    get distanceFromOrigin() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}

export class TemperatureRange {
    public from?: number;
    public to?: number;

    constructor(from?: number, to?: number) {
        this.from = from;
        this.to = to;
    }
}

export class WorldClassModel {
    public id: WorldClass;
    public description: string;

    constructor(id: WorldClass, description: string) {
        this.id = id;
        this.description = description;
    }

    get isGasGiant() {
        return this.id === WorldClass.J || this.id === WorldClass.I || this.id === WorldClass.T;
    }
}


export class SpectralClassModel {

    public id: SpectralClass;
    public description: string;

    constructor(id: SpectralClass, description: string, temperature: TemperatureRange) {
        this.id = id;
        this.description = description;
    }

    isDwarf() {
        return this.id === SpectralClass.WhiteDwarf || this.id === SpectralClass.BrownDwarf;
    }

    isHot() {
        return this.id === SpectralClass.F || this.id === SpectralClass.A || this.id === SpectralClass.B || this.id === SpectralClass.O;
    }
    isCool() {
        return this.id === SpectralClass.L || this.id === SpectralClass.Y || this.id === SpectralClass.T;
    }
}

export class Star {
    public spectralClass: SpectralClassModel;
    public subClass: number;
    public luminosityClass?: LuminosityClass;

    constructor(spectralClass: SpectralClassModel, subClass: number, luminosity?: LuminosityClass) {
        this.spectralClass = spectralClass;
        this.subClass = subClass;
        this.luminosityClass = luminosity;
    }

    get description() {
        if (this.spectralClass.id === SpectralClass.WhiteDwarf || this.spectralClass.id === SpectralClass.BrownDwarf) {
            return this.spectralClass.description;
        } else {
            return this.spectralClass.description + "" + this.subClass + (this.luminosityClass != null ? (LuminosityClass[this.luminosityClass]) : "");
        }
    }
}

export class StarSystem {
    public id: string;
    public star: Star;
    public companionStar?: Star;
    public world: World[] = [];
    public sectorCoordinates: SectorCoordinates;

    constructor (star: Star) {
        this.star = star;
    }

    get isBinary() {
        return this.companionStar != null;
    }
}

export class World {

    worldClass: WorldClassModel;
    orbit: number;

    constructor(worldClass: WorldClassModel, orbit: number) {
        this.worldClass = worldClass;
        this.orbit = orbit;
    }

    get orbitLabel() {
        return RomanNumerals[this.orbit];
    }
}