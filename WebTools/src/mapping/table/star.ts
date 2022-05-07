import { Color } from "../../common/colour";
import { D20 } from "../../common/die";

export enum SpaceRegion {
    AlphaQuadrant,
    BetaQuadrant,
    GammaQuadrant,
    DeltaQuadrant,
    ShackletonExpanse
}

export class SpaceRegionModel {
    id: SpaceRegion;
    name: string;
    prefix: string;

    constructor(id: SpaceRegion, name: string, prefix: string) {
        this.id = id;
        this.name = name;
        this.prefix = prefix;
    }

    public static allRegions(): SpaceRegionModel[] {
        return regions;
    }

    public static for(id: SpaceRegion): SpaceRegionModel {
        return SpaceRegionModel.allRegions()[id];
    }
}

let regions = [
    new SpaceRegionModel(SpaceRegion.AlphaQuadrant, "Alpha Quadrant", "AL"),
    new SpaceRegionModel(SpaceRegion.BetaQuadrant, "Beta Quadrant", "BE"),
    new SpaceRegionModel(SpaceRegion.GammaQuadrant, "Gamma Quadrant", "GA"),
    new SpaceRegionModel(SpaceRegion.DeltaQuadrant, "Delta Quadrant", "DE"),
    new SpaceRegionModel(SpaceRegion.ShackletonExpanse, "Shackleton Expanse", "SE"),
];

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
 * Symbol    Class of Star                  Example
 * 0 	     Extreme, luminous supergiants 	 
 * Ia        Luminous supergiants           Betelgeuse
 * Ib        Less luminous supergiants      Antares
 * II        Bright giants                  Canopus
 * III       Normal giants                  Aldebaran
 * IV        Subgiants                      Procyon
 * V         Main sequence                  Sun
 * VI or sd  Subdwarfs                      Kapteyn's Star (HD 33793)
 * wd or D   White dwarfs                   Sirius B
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

export class LuminosityClassModel {

    public id: LuminosityClass;
    public description: string;

    constructor(id: LuminosityClass, description: string) {
        this.id = id;
        this.description = description;
    }
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
        return "" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2);
    }

    get distanceFromOrigin() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
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
    public colourDescription: string;
    public colour: Color;
    public radius: Range;

    constructor(id: SpectralClass, description: string, temperature: Range, colourDescription: string, colour: Color, radius: Range) {
        this.id = id;
        this.description = description;
        this.colourDescription = colourDescription;
        this.colour = colour;
        this.radius = radius;
    }

    get isDwarf() {
        return (this.id === SpectralClass.WhiteDwarf || this.id === SpectralClass.BrownDwarf);
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
    public luminosityClass?: LuminosityClassModel;

    constructor(spectralClass: SpectralClassModel, subClass: number, luminosity?: LuminosityClassModel) {
        this.spectralClass = spectralClass;
        this.subClass = subClass;
        this.luminosityClass = luminosity;
    }

    get description() {
        if (this.spectralClass.id === SpectralClass.WhiteDwarf || this.spectralClass.id === SpectralClass.BrownDwarf) {
            return this.spectralClass.description;
        } else {
            let designation = this.spectralClass.description + this.subClass + (this.luminosityClass != null ? (LuminosityClass[this.luminosityClass.id]) : "");
            let description = this.spectralClass.colourDescription + (this.luminosityClass != null ? (" / " + this.luminosityClass.description) : "");
            return designation + " (" + description + ")";
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
    numberOfSatellites: number;

    constructor(worldClass: WorldClassModel, orbit: number) {
        this.worldClass = worldClass;
        this.orbit = orbit;
    }

    get orbitLabel() {
        return RomanNumerals[this.orbit];
    }
}