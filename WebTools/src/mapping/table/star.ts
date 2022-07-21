import { Color } from "../../common/colour";
import { createRandomValue } from "../../common/randomValueGenerator";

export enum SpaceRegion {
    AlphaQuadrant,
    BetaQuadrant,
    GammaQuadrant,
    DeltaQuadrant,
    ShackletonExpanse
}

export enum SpecialSectors {
    PinwheelSector,
    EnduranceDivide,
    EmberSector,
    TKalNursery,
    GeneralExpanse
}

export enum NotableSpatialPhenomenon {
    EmberStar,
    GravittionalWavesClass1,
    GravittionalWavesClass2,
    GravittionalWavesClass3,
    IonStormClass1,
    IonStormClass2,
    NebulaClass1,
    NebulaClass2,
    NebulaClass3,
    NebulaClass4,
    NeutonStar,
    RadiationStormClass3,
    RadiationStormClass4,
    RadiationStormClass5,
    RoguePlanet,
    StellarFlareClass1,
    StellarFlareClass2,
    TTauriStar,
}

export class SpecialSectorTypeModel {
    id: SpecialSectors;
    name: string;

    constructor(id: SpecialSectors, name: string) {
        this.id = id;
        this.name = name;
    }

    public static allSpecialSectorTypes() {
        return sectorsTypes;
    }
}

let sectorsTypes = [
    new SpecialSectorTypeModel(SpecialSectors.PinwheelSector, "Pinwheel Sector"),
    new SpecialSectorTypeModel(SpecialSectors.EnduranceDivide, "Endurance Divide"),
    new SpecialSectorTypeModel(SpecialSectors.EmberSector, "Ember Sector"),
    new SpecialSectorTypeModel(SpecialSectors.TKalNursery, "T'Kal Nursery"),
    new SpecialSectorTypeModel(SpecialSectors.GeneralExpanse, "General Expanse"),
];

export class NotableSpatialPhenomenonModel {
    id: NotableSpatialPhenomenon;
    name: string;

    constructor(id: NotableSpatialPhenomenon, name: string) {
        this.id = id;
        this.name = name;
    }

    public static allNotableSpatialPhenomenon() {
        return phenomenon;
    }
}

let phenomenon = [
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.EmberStar, "Ember Star"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.GravittionalWavesClass1, "Gravitational Waves, Class 1"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.GravittionalWavesClass2, "Gravitational Waves, Class 2"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.GravittionalWavesClass3, "Gravitational Waves, Class 3"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.IonStormClass1, "Ion Storm, Class 1"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.IonStormClass2, "Ion Storm, Class 2"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.NebulaClass1, "Nebula, Class 1"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.NebulaClass2, "Nebula, Class 2"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.NebulaClass3, "Nebula, Class 3"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.NebulaClass4, "Nebula, Class 4"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.NeutonStar, "Neutron Star"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.RadiationStormClass3, "Radiation Storm, Class 3"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.RadiationStormClass4, "Radiation Storm, Class 4"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.RadiationStormClass5, "Radiation Storm, Class 5"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.RoguePlanet, "Rogue Planet"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.StellarFlareClass1, "Stellar Flare, Class 1"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.StellarFlareClass2, "Stellar Flare, Class 2"),
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.TTauriStar, "T-Tauri Star"),
];

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
    public prefix: string;
    public id: string;
    public systems: StarSystem[] = [];
    public simpleName: string;

    constructor(idPrefix: string) {
        this.prefix = idPrefix;
        this.id = Sector.randomId(idPrefix);
        this.simpleName = this.id;
    }

    private static randomId(prefix: string) {
        return prefix + "-" + createRandomValue();
    }
    get name() {
        if (this.simpleName != null && this.simpleName.length > 0) {
            return this.simpleName;
        } else {
            return this.id;
        }
    }

    get plainText() {
        let systems = this.systems.map(s => s.plainText).join('\n\n');
        return "Sector: " + this.name + "\n\n" + systems;
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

export class Star {
    public spectralClass: SpectralClassModel;
    public subClass: number;
    public luminosityClass: LuminosityClassModel|null;
    public mass: number;
    public luminosityValue: number|null = null;

    constructor(spectralClass: SpectralClassModel, subClass: number, luminosity: LuminosityClassModel|null, mass: number) {
        this.spectralClass = spectralClass;
        this.subClass = subClass;
        this.luminosityClass = luminosity;
        this.mass = mass;
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
    get plainText() {
        return this.description;
    }
}

export class StarSystem {
    public id: string;
    public star: Star;
    public companionStar?: Star;
    public world: World[] = [];
    public sectorCoordinates: SectorCoordinates;
    public phenomenon: NotableSpatialPhenomenonModel;
    public rootName: string;
    public friendlyName: string;

    constructor (star: Star) {
        this.star = star;
    }

    get isBinary() {
        return this.companionStar != null;
    }

    get name() {
        if (this.friendlyName) {
            return this.friendlyName;
        } else {
            return this.rootName + "-" + this.id;
        }
    }

    clone() {
        let result = new StarSystem(this.star);
        result.id = this.id;
        result.sectorCoordinates = this.sectorCoordinates;
        result.world = this.world;
        result.companionStar = this.companionStar;
        result.phenomenon = this.phenomenon;
        result.rootName = this.rootName;
        result.friendlyName = this.friendlyName;
        return result;
    }

    get gardenZoneInnerRadius() {
        if (this.star && this.star.luminosityValue) {
            return Math.sqrt(this.star.luminosityValue) * 0.72;
        } else {
            return undefined;
        }
    }

    get gardenZoneOuterRadius() {
        if (this.star && this.star.luminosityValue) {
            return Math.sqrt(this.star.luminosityValue) * 1.45;
        } else {
            return undefined;
        }
    }

    get gardenZoneIdealRadius() {
        if (this.star && this.star.luminosityValue) {
            return Math.sqrt(this.star.luminosityValue);
        } else {
            return undefined;
        }
    }

    get plainText() {
        let worlds = this.world.map(w => w.plainText).join("\n\n");

        return "Star System: " + this.name + "\n"
            + "Star: " + this.star.plainText + "\n"
            + (this.companionStar == null ? "" : ("Companion Star: " + this.companionStar.plainText)) 
            + "\n" + worlds;
    }
}

export class World {

    worldClass: WorldClassModel;
    orbit: number;
    numberOfSatellites: number;
    orbitalRadius: number = 0;

    constructor(worldClass: WorldClassModel, orbit?: number) {
        this.worldClass = worldClass;
        this.orbit = orbit;
    }

    get orbitLabel() {
        return this.orbit == null ? undefined : RomanNumerals[this.orbit];
    }

    get plainText() {
        return "Class: " + this.worldClass.description + "\n" +
            "Orbit: " + this.orbitLabel + "\n" +
            "Number of satellites: " + this.numberOfSatellites + "\n" +
            "Orbital Radius: " + this.orbitalRadius.toFixed(2);
    }
}