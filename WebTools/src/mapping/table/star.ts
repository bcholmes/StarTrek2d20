import { SimpleColor } from "../../common/colour";
import { SpectralClass, SpectralClassModel } from "./spectralClass";

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
    NeutronStar,
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
    new NotableSpatialPhenomenonModel(NotableSpatialPhenomenon.NeutronStar, "Neutron Star"),
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

    get massInKgs() { // times 10^30
        return (1.98847 * this.mass);
    }

    get designation() {
        if (this.spectralClass.id === SpectralClass.WhiteDwarf || this.spectralClass.id === SpectralClass.BrownDwarf) {
            return this.spectralClass.description;
        } else {
            return this.spectralClass.description + this.subClass + (this.luminosityClass != null ? (LuminosityClass[this.luminosityClass.id]) : "");
        }
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
        return this.description +
            "\nMass: " + this.mass.toFixed(2) + " Sols" +
            "\nMass: " + this.massInKgs.toFixed(4) + " x10^30 kg" +
            (this.luminosityValue ? ("\nLuminosity: " + (this.luminosityValue > 100 ? this.luminosityValue.toFixed(0) : this.luminosityValue.toFixed(4)) + " Sols") : "");
    }
}


