import { Color } from "../../common/colour";
import { D20, D6 } from "../../common/die";
import { setSector, setStar } from "../../state/starActions";
import store from "../../state/store";
import { LuminosityClass, LuminosityClassModel, Sector, SectorCoordinates, SpectralClass, SpectralClassModel, Star, StarSystem, Range, World, WorldClass, WorldClassModel, SpaceRegionModel, SpecialSectors, NotableSpatialPhenomenonModel, NotableSpatialPhenomenon } from "./star";

const BLAGG_CONSTANT = 1.7275;

class GardenZone {
    spectralClass: SpectralClass;
    luminosity: LuminosityClass;
    from: number;
    to: number;

    constructor(spectralClass: SpectralClass, luminosity: LuminosityClass, from: number, to: number) {
        this.spectralClass = spectralClass;
        this.luminosity = luminosity;
        this.from = from;
        this.to = to;
    }
}

class LuminosityCrossReference {
    spectralClass: SpectralClass;
    subSpectralClass: number;
    luminosityClass: LuminosityClass;
    luminosity: number;

    constructor(spectralClass: SpectralClass, subSpectralClass: number, luminosityClass: LuminosityClass, luminosity: number) {
        this.spectralClass = spectralClass;
        this.subSpectralClass = subSpectralClass;
        this.luminosityClass = luminosityClass;
        this.luminosity = luminosity;
    }

}

class StellarMass {
    spectralClass: SpectralClass;
    luminosityClass: LuminosityClass;
    mass: number;

    constructor(spectralClass: SpectralClass, luminosityClass: LuminosityClass, mass: number) {
        this.spectralClass = spectralClass;
        this.luminosityClass = luminosityClass;
        this.mass = mass;
    }
}

class SystemGeneration {

    private spectralClasses: SpectralClassModel[] = [
        new SpectralClassModel(SpectralClass.M, "M", new Range(2400, 3700), "Red", Color.from("#f40b10"), new Range(null, 0.7)),
        new SpectralClassModel(SpectralClass.K, "K", new Range(3700, 5200), "Orange", Color.from("#F89B24"), new Range(0.7, 0.96)),
        new SpectralClassModel(SpectralClass.G, "G", new Range(5200, 6000), "Yellow", Color.from("#FFCC66"), new Range(0.96, 1.15)),
        new SpectralClassModel(SpectralClass.F, "F", new Range(6000, 7500), "Yellow white", Color.from("#ffefcf"), new Range(1.15, 1.4)),
        new SpectralClassModel(SpectralClass.A, "A", new Range(7500, 10000), "White", Color.from("#fbf8ff"), new Range(1.4, 1.8)),
        new SpectralClassModel(SpectralClass.B, "B", new Range(10000, 30000), "Blue white", Color.from("#bbccff"), new Range(1.8, 6.6)),
        new SpectralClassModel(SpectralClass.L, "L", new Range(1300, 2400), "Red brown", Color.from("#a52a2a"), new Range(0.08, 0.15)),
        new SpectralClassModel(SpectralClass.Y, "Y", new Range(500, 1300), "Brown", Color.from("#964b00"), new Range(0.08, 0.14)),
        new SpectralClassModel(SpectralClass.T, "T", new Range(undefined, 500), "Dark brown", Color.from("#663300"), new Range(0.08, 0.14)),
        new SpectralClassModel(SpectralClass.WhiteDwarf, "White Dwarf", new Range(2400, 3700), "White", Color.from("#fbf8ff"), new Range(0.08, 0.14)),
        new SpectralClassModel(SpectralClass.BrownDwarf, "Brown Dwarf", new Range(2400, 3700), "Brown", Color.from("#964b00"), new Range(0.08, 0.14)),
    ];

    private worldClasses: WorldClassModel[] = [
        new WorldClassModel(WorldClass.AsteroidBelt, "Asteroid Belt"),
        new WorldClassModel(WorldClass.C, "Icy Geoinactive"),
        new WorldClassModel(WorldClass.D, "Icy/Rocky Barren"),
        new WorldClassModel(WorldClass.E, "Geoplastic"),
        new WorldClassModel(WorldClass.I, "Ammonia Clouds/Gas Supergiant"),
        new WorldClassModel(WorldClass.J, "Jovian Gas Giant"),
        new WorldClassModel(WorldClass.K, "Adaptable"),
        new WorldClassModel(WorldClass.L, "Marginal"),
        new WorldClassModel(WorldClass.M, "Terrestrial"),
        new WorldClassModel(WorldClass.O, "Pelagic/Ocean"),
        new WorldClassModel(WorldClass.P, "Glaciated"),

        // not listed in Shackleton Expanse
        new WorldClassModel(WorldClass.H, "Desert"),
        new WorldClassModel(WorldClass.N, "Reducing"),
        new WorldClassModel(WorldClass.T, "Gas Ultragiants"),
        new WorldClassModel(WorldClass.Y, "Demon"),
    ];

    private spectralClassTable: { [roll: number]: SpectralClassModel } = {
        1: this.spectralClasses[0],
        2: this.spectralClasses[0],
        3: this.spectralClasses[0],
        4: this.spectralClasses[0],
        5: this.spectralClasses[0],
        6: this.spectralClasses[0],
        7: this.spectralClasses[0],
        8: this.spectralClasses[0],
        9: this.spectralClasses[0],
        10: this.spectralClasses[0],
        11: this.spectralClasses[0],
        12: this.spectralClasses[0],
        13: this.spectralClasses[1],
        14: this.spectralClasses[1],
        15: this.spectralClasses[1],
        16: this.spectralClasses[1],
        17: this.spectralClasses[2],
        18: this.spectralClasses[2],
        19: this.spectralClasses[3],
    }

    private specialSpectraTable: { [roll: number]: SpectralClassModel[] } = {
        1: [this.spectralClasses[4] ],
        2: [this.spectralClasses[4] ],
        3: [this.spectralClasses[4] ],
        4: [this.spectralClasses[5] ],
        5: [this.spectralClasses[5] ],
        6: [this.spectralClasses[5] ],
        7: [this.spectralClasses[6], this.spectralClasses[7], this.spectralClasses[8] ],
        8: [this.spectralClasses[6], this.spectralClasses[7], this.spectralClasses[8] ],
        9: [this.spectralClasses[6], this.spectralClasses[7], this.spectralClasses[8] ],
        10: [this.spectralClasses[6], this.spectralClasses[7], this.spectralClasses[8] ],
        11: [this.spectralClasses[6], this.spectralClasses[7], this.spectralClasses[8] ],
        12: [this.spectralClasses[6], this.spectralClasses[7], this.spectralClasses[8] ],
        13: [this.spectralClasses[9] ],
        14: [this.spectralClasses[9] ],
        15: [this.spectralClasses[9] ],
        16: [this.spectralClasses[10] ],
        17: [this.spectralClasses[10] ],
        18: [this.spectralClasses[10] ],
        19: [this.spectralClasses[10] ],
    };

    private luminosityTable: LuminosityClassModel[] = [
        new LuminosityClassModel(LuminosityClass.Ia, "Luminous supergiant"),
        new LuminosityClassModel(LuminosityClass.Ib, "Less luminous supergiant"),
        new LuminosityClassModel(LuminosityClass.II, "Bright giant"),
        new LuminosityClassModel(LuminosityClass.III, "Normal giant"),
        new LuminosityClassModel(LuminosityClass.IV, "Subgiant"),
        new LuminosityClassModel(LuminosityClass.V, "Main Sequence"),
        new LuminosityClassModel(LuminosityClass.VI, "Subdwarf")
    ];

    private luminosityClassTable: { [roll: number] : LuminosityClassModel[] } = {
        1: [ this.luminosityTable[6] ],
        2: [ this.luminosityTable[6] ],
        3: [ this.luminosityTable[5] ],
        4: [ this.luminosityTable[5] ],
        5: [ this.luminosityTable[5] ],
        6: [ this.luminosityTable[5] ],
        7: [ this.luminosityTable[5] ],
        8: [ this.luminosityTable[5] ],
        9: [ this.luminosityTable[5] ],
        10: [ this.luminosityTable[5] ],
        11: [ this.luminosityTable[5] ],
        12: [ this.luminosityTable[5] ],
        13: [ this.luminosityTable[5] ],
        14: [ this.luminosityTable[5] ],
        15: [ this.luminosityTable[5] ],
        16: [ this.luminosityTable[5] ],
        17: [ this.luminosityTable[4] ],
        18: [ this.luminosityTable[4] ],
        19: [ this.luminosityTable[3] ],
        20: [ this.luminosityTable[2], this.luminosityTable[1], this.luminosityTable[0] ],
    };

    private numberOfPlanetsTable: { [roll: number] : number } = {
        1: 1,
        2: 3,
        3: 3,
        4: 3,
        5: 3,
        6: 5,
        7: 5,
        8: 5,
        9: 7,
        10: 7,
        11: 7,
        12: 7,
        13: 7,
        14: 7,
        15: 7,
        16: 9,
        17: 9,
        18: 10,
        19: 10,
        20: 11
    }

    private notablePhenomenonTable: { [roll: number]: NotableSpatialPhenomenonModel[]}[] = [
        {
            1: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            2: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            3: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            4: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass2] ],
            5: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass2] ],
            6: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass2] ],
            7: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass2] ],
            8: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass2] ],
            9: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            10: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            11: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            12: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            13: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            14: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass2] ],
            15: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass2] ],
            16: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass2] ],
            17: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass2] ],
            18: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass3] ],
            19: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass3] ],
            20: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass3] ],
        },
        {
            1: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RoguePlanet] ],
            2: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RoguePlanet] ],
            3: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RoguePlanet] ],
            4: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            5: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            6: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            7: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            8: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            9: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            10: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            11: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            12: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            13: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            14: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass3],
                    NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass4],
                    NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass5],],
            15: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass3],
                    NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass4],
                    NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass5]],
            16: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass3],
                    NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass4],
                    NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass5]],
            17: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass3],
                    NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass4],
                    NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.RadiationStormClass5]],
            18: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NeutonStar] ],
            19: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NeutonStar] ],
            20: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NeutonStar] ],
        },{
            1: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass1] ],
            2: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass1] ],
            3: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass1] ],
            4: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            5: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            6: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            7: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            8: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            9: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            10: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            11: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            12: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            13: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            14: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            15: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            16: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            17: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.EmberStar] ],
            18: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass2] ],
            19: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass2] ],
            20: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass2] ],
        },{
            1: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass2] ],
            2: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass2] ],
            3: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass2] ],
            4: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass3] ],
            5: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass3] ],
            6: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass3] ],
            7: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass3] ],
            8: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass3] ],
            9: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass4] ],
            10: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass4] ],
            11: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass4] ],
            12: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass4] ],
            13: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass4] ],
            14: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass1] ],
            15: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass1] ],
            16: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass1] ],
            17: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.StellarFlareClass1] ],
            18: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.TTauriStar] ],
            19: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.TTauriStar] ],
            20: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.TTauriStar] ],
        },{
            1: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass1] ],
            2: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass1] ],
            3: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass1] ],
            4: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            5: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            6: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            7: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            8: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass1] ],
            9: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            10: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            11: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            12: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            13: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NebulaClass1] ],
            14: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass2] ],
            15: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass2] ],
            16: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass2] ],
            17: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.GravittionalWavesClass2] ],
            18: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass2] ],
            19: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass2] ],
            20: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.IonStormClass2] ],
        }
    ];

    private numberOfPlanetsModifiers: { (starSystem: StarSystem): number; }[] = [
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.M ? -3 : 0 ),
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.K ? -2 : 0 ),
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.G ? 0 : 0 ),
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.F ? 1 : 0 ),
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.A ? 1 : 0 ),
        ( (starSystem) => (starSystem.star.spectralClass.id === SpectralClass.B || starSystem.star.spectralClass.id === SpectralClass.O) ? 0 : 0 ),
        ( (starSystem) => (starSystem.star.luminosityClass != null && starSystem.star.luminosityClass.id === LuminosityClass.III) ? -3 : 0 ),
        ( (starSystem) => (starSystem.star.luminosityClass != null && (starSystem.star.luminosityClass.id === LuminosityClass.II || starSystem.star.luminosityClass.id === LuminosityClass.Ia || starSystem.star.luminosityClass.id === LuminosityClass.Ib)) ? -5 : 0 ),
        ( (starSystem) => (starSystem.star.spectralClass.id === SpectralClass.BrownDwarf ? -1 : 0) ),
        ( (starSystem) => (starSystem.star.spectralClass.id === SpectralClass.WhiteDwarf || (starSystem.phenomenon != null && starSystem.phenomenon.id === NotableSpatialPhenomenon.TTauriStar)) ? -5 : 0),
        ( (starSystem) => starSystem.isBinary ? -3 : 0 ),
    ];

    private innerOrOuterWorldTable: { [roll: number]: WorldClassModel[] } = {
        1: [ this.worldClasses[7] ], // L
        2: [ this.worldClasses[1] ], // C
        3: [ this.worldClasses[1] ], // C
        4: [ this.worldClasses[1] ], // C
        5: [ this.worldClasses[1] ], // C
        6: [ this.worldClasses[5] ], // J
        7: [ this.worldClasses[5] ], // J
        8: [ this.worldClasses[5] ], // J
        9: [ this.worldClasses[5] ], // J
        10: [ this.worldClasses[5] ], // J
        11: [ this.worldClasses[5] ], // J
        12: [ this.worldClasses[5] ], // J
        13: [ this.worldClasses[5] ], // J
        14: [ this.worldClasses[5] ], // J
        15: [ this.worldClasses[2], this.worldClasses[0] ], // D or Asteroid
        16: [ this.worldClasses[2], this.worldClasses[0] ], // D or Asteroid
        17: [ this.worldClasses[2], this.worldClasses[0] ], // D or Asteroid
        18: [ this.worldClasses[2], this.worldClasses[0] ], // D or Asteroid
        19: [ this.worldClasses[4] ], // I
        20: [ this.worldClasses[10] ], // P
    }

    private primaryWorldTable: { [roll: number]: WorldClassModel[] } = {
        1: [ this.worldClasses[7], this.worldClasses[3] ], // L or E
        2: [ this.worldClasses[7], this.worldClasses[3] ], // L or E
        3: [ this.worldClasses[7], this.worldClasses[3] ], // L or E
        4: [ this.worldClasses[7], this.worldClasses[3] ], // L or E
        5: [ this.worldClasses[7], this.worldClasses[3] ], // L or E
        6: [ this.worldClasses[8] ], // M
        7: [ this.worldClasses[8] ], // M
        8: [ this.worldClasses[8] ], // M
        9: [ this.worldClasses[8] ], // M
        10: [ this.worldClasses[8] ], // M
        11: [ this.worldClasses[8] ], // M
        12: [ this.worldClasses[8] ], // M
        13: [ this.worldClasses[6] ], // K
        14: [ this.worldClasses[6] ], // K
        15: [ this.worldClasses[6] ], // K
        16: [ this.worldClasses[6] ], // K
        17: [ this.worldClasses[6] ], // K
        18: [ this.worldClasses[6] ], // K
        19: [ this.worldClasses[9], this.worldClasses[10] ], // O or P
        20: [ this.worldClasses[9], this.worldClasses[10] ], // O or P
    }

    private gardenZoneTable: GardenZone[] = [
        new GardenZone(SpectralClass.O, LuminosityClass.Ia, 790, 1190),
        new GardenZone(SpectralClass.O, LuminosityClass.Ib, 630, 950),
        new GardenZone(SpectralClass.O, LuminosityClass.V, 500, 750),
        new GardenZone(SpectralClass.B, LuminosityClass.Ia, 500, 750),
        new GardenZone(SpectralClass.B, LuminosityClass.Ib, 320, 480),
        new GardenZone(SpectralClass.B, LuminosityClass.II, 250, 375),
        new GardenZone(SpectralClass.B, LuminosityClass.III, 200, 300),
        new GardenZone(SpectralClass.B, LuminosityClass.IV, 180, 270),
        new GardenZone(SpectralClass.B, LuminosityClass.V, 30, 45),
        new GardenZone(SpectralClass.A, LuminosityClass.Ia, 200, 300),
        new GardenZone(SpectralClass.A, LuminosityClass.Ib, 50, 75),
        new GardenZone(SpectralClass.A, LuminosityClass.II, 20, 30),
        new GardenZone(SpectralClass.A, LuminosityClass.III, 5.0, 7.5),
        new GardenZone(SpectralClass.A, LuminosityClass.IV, 4.0, 6.0),
        new GardenZone(SpectralClass.A, LuminosityClass.V, 3.1, 4.7),
        new GardenZone(SpectralClass.F, LuminosityClass.Ia, 200, 300),
        new GardenZone(SpectralClass.F, LuminosityClass.Ib, 50, 75),
        new GardenZone(SpectralClass.F, LuminosityClass.II, 13, 19),
        new GardenZone(SpectralClass.F, LuminosityClass.III, 2.5, 3.7),
        new GardenZone(SpectralClass.F, LuminosityClass.IV, 2.0, 3.0),
        new GardenZone(SpectralClass.F, LuminosityClass.V, 1.6, 2.4),
        new GardenZone(SpectralClass.G, LuminosityClass.Ia, 160, 240),
        new GardenZone(SpectralClass.G, LuminosityClass.Ib, 50, 75),
        new GardenZone(SpectralClass.G, LuminosityClass.II, 13, 19),
        new GardenZone(SpectralClass.G, LuminosityClass.III, 3.1, 4.7),
        new GardenZone(SpectralClass.G, LuminosityClass.IV, 1.0, 1.5),
        new GardenZone(SpectralClass.G, LuminosityClass.V, 0.8, 1.2),
        new GardenZone(SpectralClass.G, LuminosityClass.VI, 0.5, 0.8),
        new GardenZone(SpectralClass.K, LuminosityClass.Ia, 125, 190),
        new GardenZone(SpectralClass.K, LuminosityClass.Ib, 50, 75),
        new GardenZone(SpectralClass.K, LuminosityClass.II, 13, 19),
        new GardenZone(SpectralClass.K, LuminosityClass.III, 4.0, 5.9),
        new GardenZone(SpectralClass.K, LuminosityClass.IV, 1.0, 1.5),
        new GardenZone(SpectralClass.K, LuminosityClass.V, 0.5, 0.6),
        new GardenZone(SpectralClass.K, LuminosityClass.VI, 0.2, 0.3),
        new GardenZone(SpectralClass.M, LuminosityClass.Ia, 100, 150),
        new GardenZone(SpectralClass.M, LuminosityClass.Ib, 50, 76),
        new GardenZone(SpectralClass.M, LuminosityClass.II, 16, 24),
        new GardenZone(SpectralClass.M, LuminosityClass.III, 5.0, 7.5),
        new GardenZone(SpectralClass.M, LuminosityClass.IV, 1.0, 1.5),
        new GardenZone(SpectralClass.M, LuminosityClass.V, 0.1, 0.2),
        new GardenZone(SpectralClass.M, LuminosityClass.VI, 0.1, 0.1),
    ];

    private luminosityCrossReferenceTable: LuminosityCrossReference[] = [
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.Ia, 560000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.Ib, 270000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.II, 170000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.III, 107000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.IV, 81000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.V, 560000),

        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.Ia, 204000),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.Ib, 46700),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.II, 18600),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.III, 6700),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.IV, 2000),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.V, 1400),

        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.Ia, 60000),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.Ib, 4100),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.II, 3200),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.III, 2100),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.IV, 1200),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.V, 800),

        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.Ia, 107000),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.Ib, 15000),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.II, 2200),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.III, 280),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.IV, 156),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.V, 90),

        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.Ia, 81000),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.Ib, 11700),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.II, 850),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.III, 90),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.IV, 37),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.V, 16),

        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.Ia, 61000),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.Ib, 7400),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.II, 600),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.III, 53),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.IV, 19),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.V, 8.1),

        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.Ia, 51000),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.Ib, 5100),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.II, 510),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.III, 43),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.IV, 12),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.V, 3.5),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.VI, 0.97),

        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.Ia, 67000),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.Ib, 6100),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.II, 560),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.III, 50),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.IV, 6.5),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.V, 1.21),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.VI, .32),

        new LuminosityCrossReference(SpectralClass.G, 2, LuminosityClass.V, 1), // the sun (Sol)

        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.Ia, 89000),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.Ib, 8100),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.II, 740),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.III, 75),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.IV, 4.9),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.V, 0.67),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.VI, 0.186),

        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.Ia, 97000),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.Ib, 11700),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.II, 890),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.III, 95),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.IV, 4.65),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.V, 0.42),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.VI, 0.117),

        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.Ia, 107000),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.Ib, 20400),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.II, 2450),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.III, 320),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.IV, 4.75),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.V, 0.08),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.VI, 0.025),

        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.Ia, 117000),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.Ib, 46000),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.II, 4600),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.III, 470),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.IV, 4.9),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.V, 0.04),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.VI, 0.011),

        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.Ia, 129000),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.Ib, 89000),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.II, 14900),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.III, 2280),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.IV, 5.6),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.V, 0.007),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.VI, 0.002),

        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.Ia, 141000),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.Ib, 117000),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.II, 16200),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.III, 2690),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.IV, 6.2),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.V, 0.001),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.VI, 0.00006),
    ];

    private notableSystemsTable: { [roll: number] : number } = {
        1: 3,
        2: 3,
        3: 3,
        4: 5,
        5: 5,
        6: 5,
        7: 5,
        8: 5,
        9: 7,
        10: 7,
        11: 7,
        12: 7,
        13: 7,
        14: 7,
        15: 7,
        16: 9,
        17: 9,
        18: 9,
        19: 9,
        20: 11,
    }

    private numberOfMoonsTable: { [roll: number] : number } = {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 2,
        12: 2,
        13: 2,
        14: 2,
        15: 2,
        16: 3,
        17: 3,
        18: 4,
        19: 4,
        20: 5,
    }

    private stellarMassTable: StellarMass[] = [
        new StellarMass(SpectralClass.O, LuminosityClass.Ia, 70),
        new StellarMass(SpectralClass.O, LuminosityClass.Ib, 60),
        new StellarMass(SpectralClass.O, LuminosityClass.II, 57),
        new StellarMass(SpectralClass.O, LuminosityClass.III, 54),
        new StellarMass(SpectralClass.O, LuminosityClass.IV, 52),
        new StellarMass(SpectralClass.O, LuminosityClass.V, 50),

        new StellarMass(SpectralClass.B, LuminosityClass.Ia, 50),
        new StellarMass(SpectralClass.B, LuminosityClass.Ib, 40),
        new StellarMass(SpectralClass.B, LuminosityClass.II, 35),
        new StellarMass(SpectralClass.B, LuminosityClass.III, 30),
        new StellarMass(SpectralClass.B, LuminosityClass.IV, 20),
        new StellarMass(SpectralClass.B, LuminosityClass.V, 10),

        new StellarMass(SpectralClass.A, LuminosityClass.Ia, 30),
        new StellarMass(SpectralClass.A, LuminosityClass.Ib, 16),
        new StellarMass(SpectralClass.A, LuminosityClass.II, 10),
        new StellarMass(SpectralClass.A, LuminosityClass.III, 6),
        new StellarMass(SpectralClass.A, LuminosityClass.IV, 4),
        new StellarMass(SpectralClass.A, LuminosityClass.V, 3),

        new StellarMass(SpectralClass.F, LuminosityClass.Ia, 15),
        new StellarMass(SpectralClass.F, LuminosityClass.Ib, 13),
        new StellarMass(SpectralClass.F, LuminosityClass.II, 8),
        new StellarMass(SpectralClass.F, LuminosityClass.III, 2.5),
        new StellarMass(SpectralClass.F, LuminosityClass.IV, 2.2),
        new StellarMass(SpectralClass.F, LuminosityClass.V, 1.9),

        new StellarMass(SpectralClass.G, LuminosityClass.Ia, 12),
        new StellarMass(SpectralClass.G, LuminosityClass.Ib, 10),
        new StellarMass(SpectralClass.G, LuminosityClass.II, 6),
        new StellarMass(SpectralClass.G, LuminosityClass.III, 2.7),
        new StellarMass(SpectralClass.G, LuminosityClass.IV, 1.8),
        new StellarMass(SpectralClass.G, LuminosityClass.V, 1.1),        
        new StellarMass(SpectralClass.G, LuminosityClass.VI, 0.8), 

        new StellarMass(SpectralClass.K, LuminosityClass.Ia, 15),
        new StellarMass(SpectralClass.K, LuminosityClass.Ib, 12),
        new StellarMass(SpectralClass.K, LuminosityClass.II, 6),
        new StellarMass(SpectralClass.K, LuminosityClass.III, 3),
        new StellarMass(SpectralClass.K, LuminosityClass.IV, 2.3),
        new StellarMass(SpectralClass.K, LuminosityClass.V, 0.9),
        new StellarMass(SpectralClass.K, LuminosityClass.VI, 0.5), 

        new StellarMass(SpectralClass.M, LuminosityClass.Ia, 20),
        new StellarMass(SpectralClass.M, LuminosityClass.Ib, 16),
        new StellarMass(SpectralClass.M, LuminosityClass.II, 8),
        new StellarMass(SpectralClass.M, LuminosityClass.III, 4),
        new StellarMass(SpectralClass.M, LuminosityClass.IV, 2),
        new StellarMass(SpectralClass.M, LuminosityClass.V, 0.3),
        new StellarMass(SpectralClass.M, LuminosityClass.VI, 0.2), 

        new StellarMass(SpectralClass.L, null, 0.11), 
        new StellarMass(SpectralClass.T, null, 0.10), 
        new StellarMass(SpectralClass.Y, null, 0.10), 

        new StellarMass(SpectralClass.WhiteDwarf, null, 0.8),
        new StellarMass(SpectralClass.BrownDwarf, null, 0.15),
    ]

    generateSector(region: SpaceRegionModel, sectorType?: SpecialSectors) {
        let count = this.notableSystemsTable[D20.roll()];
        let sector = new Sector(region.prefix);
        for (let i = 0; i < count; i++) {
            let system = this.generateStarSystem(sectorType);
            if (system) {
                sector.systems.push(system);
            }
        }

        let maxId = 250;
        let interval = Math.round(maxId / sector.systems.length);

        let start = 1;
        sector.systems.forEach((s) => {
            const id = Math.floor(Math.random() * interval) + start;
            start = id + 1;

            const idString = ("0000" + id).slice(-4);
            s.id = sector.id + "-" + idString;
        });

        store.dispatch(setSector(sector));
        store.dispatch(setStar(sector.systems[0]));

    }

    generateStarSystem(sectorType?: SpecialSectors) {
        let star = this.generateStar();
        let phenomenon = undefined;

        if (star == null && sectorType != null) { // roll of 20
            console.log("need a notable spatial phenomenon");
            phenomenon = this.generateSpatialPhenomenon(sectorType);
            console.log("Phenomenon: " + phenomenon.name);

            while (phenomenon.id !== NotableSpatialPhenomenon.RoguePlanet && star == null) {
                star = this.generateStar();
                if (phenomenon.id === NotableSpatialPhenomenon.TTauriStar && star != null 
                    && [SpectralClass.F, SpectralClass.G, SpectralClass.K, SpectralClass.M].indexOf(star.spectralClass.id) >= 0) {
                    
                    star = undefined;
                }
            }
        }

        if (star != null) {
            let starSystem = new StarSystem(star);
            starSystem.phenomenon = phenomenon;
            starSystem.sectorCoordinates = this.generateCoordinates();

            if (D6.rollFace().isEffect) {
                let tries = 10;
                while (tries-- > 0) {
                    let companion = this.generateStar();
                    if (companion != null && companion instanceof Star) {
                        console.log("star mass " + star.mass + " and companion mass " + companion.mass);
                        if ((companion as Star).mass <= star.mass) {
                            starSystem.companionStar = companion;
                            break;
                        }
                    }
                }
            }

            this.generateSystem(starSystem);
            return starSystem;
        } else {
            return undefined;
        }
    }

    generateSpatialPhenomenon(sectorType: SpecialSectors) {
        let roll = D20.roll();
        let table = this.notablePhenomenonTable[sectorType];
        let candidates = table[roll];
        if (candidates.length === 1) {
            return candidates[0];
        } else {
            let r = Math.floor(Math.random() * candidates.length);
            return candidates[r];
        }
    }

    generateStar() {
        let spectralClass = this.rollSpectralClass();
        if (spectralClass != null) {
            return this.generateStarDetails(spectralClass);
        } else {
            return undefined;
        }
    }

    generateStarDetails(spectralClass: SpectralClassModel) {
        let subClass = this.rollSubSpectralClass();
        let mass = null;
        let luminosity = null;
        while (mass == null) {
            luminosity = (spectralClass != null && !spectralClass.isDwarf) ? this.rollLuminosity(spectralClass) : undefined;
            mass = this.determineMass(spectralClass, luminosity);
        }
        return new Star(spectralClass, subClass, luminosity, mass);
    }

    determineMass(spectralClass: SpectralClassModel, luminosityClass: LuminosityClassModel) {

        for (let i = 0; i < this.stellarMassTable.length; i++) {
            let mass = this.stellarMassTable[i];
            if (mass.spectralClass === spectralClass.id 
                && ((luminosityClass == null && mass.luminosityClass == null) || (luminosityClass != null && luminosityClass.id === mass.luminosityClass))) {

                let baseMass = mass.mass;
                
                let roll = (D20.roll() - 10) / 10;
                if (roll < 0) {
                    let delta = Math.min(baseMass / 2, 10);
                    if (i > 0) {
                        let previous = this.stellarMassTable[i-1];
                        if (previous.spectralClass === spectralClass.id) {
                            delta = previous.mass - baseMass;
                        }
                    }
                    let result = baseMass - roll * delta / 2;
                    if (result < 0) {
                        console.log("Weird! " + roll +  " " + baseMass + " " + delta);
                    }
                    return baseMass - roll * delta / 2;
                } else {
                    let delta = Math.min(baseMass / 2, 0.1);
                    if (i < (this.stellarMassTable.length - 1)) {
                        let next = this.stellarMassTable[i+1];
                        if (next.spectralClass === spectralClass.id) {
                            delta = baseMass - next.mass;
                        }
                    }
                    return baseMass - roll * delta / 2;
                }
            }
        }
        return null;
    }

    generateCoordinates() {
        let x = D20.roll() - (D20.roll() / 20.0);
        let y = D20.roll() - (D20.roll() / 20.0);
        let z = D20.roll() - (D20.roll() / 20.0);
        return new SectorCoordinates(x, y, z);
    }

    generateSystem(starSystem: StarSystem) {

        if (!starSystem.star.spectralClass.isDwarf) {
            let roll = D20.roll();
            this.numberOfPlanetsModifiers.forEach(mod => roll += mod(starSystem));
            roll = Math.max(1, Math.min(20, roll));

            let worldCount = this.numberOfPlanetsTable[roll];

            let primaryWorldOrbit =  Math.min(worldCount, Math.ceil(D20.roll() / 4.0));

            let initialOrbit = this.determineInitialOrbit(starSystem);
            let bodeConstant = (D20.roll() / 4) * 0.1;
            let orbitIndex = 0;

            for (let i = 1; i <= worldCount; i++) {

                let worldRoll = D20.roll();
                let worldTypes =  (i === primaryWorldOrbit) 
                    ? this.primaryWorldTable[worldRoll] 
                    : this.innerOrOuterWorldTable[worldRoll];
                let worldType = worldTypes[0];
                if (worldTypes.length > 1) {
                    worldType = worldTypes[Math.floor(Math.random() * worldTypes.length)];
                }

                let world = new World(worldType, starSystem.world.length);
                if (worldType.id === WorldClass.AsteroidBelt) {
                    world.numberOfSatellites = 0;
                } else if (worldType.isGasGiant) {
                    world.numberOfSatellites = Math.ceil(D20.roll() / 4);
                } else {
                    world.numberOfSatellites = this.numberOfMoonsTable[D20.roll()];
                }
                starSystem.world.push(world);

                if (D20.roll() === 20) {
                    orbitIndex += 1; // throw in an empty orbit
                }

                if (orbitIndex === 0) {
                    world.orbitalRadius = initialOrbit;
                } else {
                    world.orbitalRadius = initialOrbit + Math.pow(BLAGG_CONSTANT, orbitIndex) * bodeConstant;
                }

                orbitIndex += 1;
            }

            /*
            for (let i = 0; i < this.gardenZoneTable.length; i++) {
                let zone = this.gardenZoneTable[i];
                if (starSystem.star.spectralClass.id === zone.spectralClass && starSystem.star.luminosityClass.id === zone.luminosity) {
                    console.log("Garden zone: " + zone.from + "-" + zone.to);
                }
            }
            */
        } else {
            console.log("star " + starSystem.star.spectralClass.id + " is a dwarf?");
        }
    }

    determineInitialOrbit(system: StarSystem) {
        if (system.star.spectralClass.id === SpectralClass.M && system.star.luminosityClass != null && system.star.luminosityClass.id === LuminosityClass.VI) {
            return 0.2;
        } else {
            let orbits = [0.3, 0.35, 0.4];
            return orbits[Math.floor(Math.random() * orbits.length)];
        }
    }

    rollSpectralClass() {
        let roll1 = D20.roll();
        
        if (roll1 === 20) {
            let roll2 = D20.roll();
            if (roll2 === 20) {
                return undefined;
            } else {
                let spectralClasses = this.specialSpectraTable[roll2];
                let spectralClass = spectralClasses[0];
                if (spectralClasses.length > 1) {
                    spectralClass = spectralClasses[Math.floor(Math.random() * spectralClasses.length)];
                }
                return spectralClass;
            }
        } else {
            let spectralClass = this.spectralClassTable[roll1];
            return spectralClass;
        }
    }

    rollSubSpectralClass() {
        let roll = D20.roll();
        if (roll === 20) {
            return 0;
        } else {
            return Math.floor(roll / 2.0);
        }
    }

    rollLuminosity(spectralClass: SpectralClassModel) {
        let luminosity = undefined;
        while (true) {
            let roll = D20.roll();
            let lumens = this.luminosityClassTable[roll];
            luminosity = lumens[0];
            if (lumens.length > 1) {
                luminosity = lumens[Math.floor(Math.random() * lumens.length)];
            }
            if (luminosity.id !== LuminosityClass.II && luminosity.id !== LuminosityClass.Ia && luminosity.id !== LuminosityClass.Ib) {
                break;
            } else if (!spectralClass.isCool() && !spectralClass.isHot()) {
                break;
            } else if (spectralClass.isHot() && Math.random() < 0.02) { // the rule says that it's "exceedingly rare"
                break;
            }
        }
        return luminosity;
    }
}

export const SystemGenerationTable = new SystemGeneration();