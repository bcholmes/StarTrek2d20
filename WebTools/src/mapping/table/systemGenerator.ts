import { Color } from "../../common/colour";
import { D20, D6 } from "../../common/die";
import { setSector, setStar } from "../../state/starActions";
import store from "../../state/store";
import { LuminosityTable } from "./luminosityTable";
import { addNoiseToValue } from "./noise";
import { Orbit, Orbits } from "./orbit";
import { Sector, SectorCoordinates } from "./sector";
import { LuminosityClass, LuminosityClassModel, SpectralClass, SpectralClassModel, Star, Range, SpaceRegionModel, SpecialSectors, NotableSpatialPhenomenonModel, NotableSpatialPhenomenon, SpaceRegion } from "./star";
import { CompanionType, StarSystem } from "./starSystem";
import { AsteroidBeltDetails, GasGiantDetails, StandardWorldDetails, World, WorldClass, WorldClassModel, WorldCoreType } from "./world";

enum AsteroidBeltZone {
    Nickel, Mixed, CarbonaceousOrIce
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

class GeneralPlanetaryType {
    worldClass: WorldClassModel;
    notes?: string;

    constructor(worldClass: WorldClassModel, notes?: string) {
        this.worldClass = worldClass;
        this.notes = notes;
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
        new WorldClassModel(WorldClass.B, "Geomorphic"),
        new WorldClassModel(WorldClass.C, "Icy Geoinactive"),
        new WorldClassModel(WorldClass.D, "Icy/Rocky Barren"),
        new WorldClassModel(WorldClass.E, "Geoplastic"),
        new WorldClassModel(WorldClass.H, "Desert"),
        new WorldClassModel(WorldClass.I, "Ammonia Clouds/Gas Supergiant"),
        new WorldClassModel(WorldClass.J, "Jovian Gas Giant"),
        new WorldClassModel(WorldClass.K, "Adaptable"),
        new WorldClassModel(WorldClass.L, "Marginal"),
        new WorldClassModel(WorldClass.M, "Terrestrial"),
        new WorldClassModel(WorldClass.N, "Reducing"),
        new WorldClassModel(WorldClass.O, "Pelagic/Ocean"),
        new WorldClassModel(WorldClass.P, "Glaciated"),
        new WorldClassModel(WorldClass.T, "Gas Ultragiants"),
        new WorldClassModel(WorldClass.Y, "Demon"),
        new WorldClassModel(WorldClass.ArtificialPlanet, "Artificial Planet"),
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

    private gasGiantSatellitesTable: { [roll: number] : (gasGiant: World) => void } = {

        1: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        2: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        3: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        4: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        5: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        6: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        7: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        8: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        9: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        10: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoons(gasGiant) },
        11: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createFaintRing(gasGiant) },
        12: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createFaintRing(gasGiant) },
        13: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createFaintRing(gasGiant) },
        14: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createFaintRing(gasGiant) },
        15: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createFaintRing(gasGiant) },
        16: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBrightRing(gasGiant) },
        17: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBrightRing(gasGiant) },
        18: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createAsteroidBelt(gasGiant) },
        19: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createOortBelt(gasGiant) },
        20: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createTwiceAsManyWorlds(gasGiant) },
        21: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoonsWithEcosphere(gasGiant) },
        22: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoonsWithEcosphere(gasGiant) },
        23: (gasGiant: World) => { gasGiant.worldDetails = GasGiantDetails.createBasicDistributionOfMoonsWithEcosphere(gasGiant) }
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
            18: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NeutronStar] ],
            19: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NeutronStar] ],
            20: [ NotableSpatialPhenomenonModel.allNotableSpatialPhenomenon()[NotableSpatialPhenomenon.NeutronStar] ],
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

    // from the Core rulebook, p. 307
    private generalPlanetaryType: { [roll: number]: GeneralPlanetaryType } = {

        2: new GeneralPlanetaryType(this.worldClasses[WorldClass.ArtificialPlanet], "Non-obvious"),
        3: new GeneralPlanetaryType(this.worldClasses[WorldClass.ArtificialPlanet], "Non-obvious"),
        4: new GeneralPlanetaryType(this.worldClasses[WorldClass.ArtificialPlanet], "Non-obvious"),
        5: new GeneralPlanetaryType(this.worldClasses[WorldClass.ArtificialPlanet], "Non-obvious"),
        6: new GeneralPlanetaryType(this.worldClasses[WorldClass.D]),
        7: new GeneralPlanetaryType(this.worldClasses[WorldClass.D]),
        8: new GeneralPlanetaryType(this.worldClasses[WorldClass.D]),
        9: new GeneralPlanetaryType(this.worldClasses[WorldClass.H]),
        10: new GeneralPlanetaryType(this.worldClasses[WorldClass.H]),
        11: new GeneralPlanetaryType(this.worldClasses[WorldClass.L], "Land life has not yet evolved"),
        12: new GeneralPlanetaryType(this.worldClasses[WorldClass.L], "Land life has not yet evolved"),
        13: new GeneralPlanetaryType(this.worldClasses[WorldClass.L], "Land life has not yet evolved"),
        14: new GeneralPlanetaryType(this.worldClasses[WorldClass.O], "Water world with only small islands"),
        15: new GeneralPlanetaryType(this.worldClasses[WorldClass.O], "Water world with only small islands"),
        16: new GeneralPlanetaryType(this.worldClasses[WorldClass.O], "Water world with only small islands"),
        17: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Verdant jungle world"),
        18: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Verdant jungle world"),
        19: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Verdant jungle world"),
        20: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Temperate world — like Earth"),
        21: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Temperate world — like Earth"),
        22: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Temperate world — like Earth"),
        23: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Dry hot world — like Vulcan"),
        24: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Dry hot world — like Vulcan"),
        25: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Dry hot world — like Vulcan"),
        26: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Ice age world"),
        27: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Ice age world"),
        28: new GeneralPlanetaryType(this.worldClasses[WorldClass.M], "Ice age world"),
        29: new GeneralPlanetaryType(this.worldClasses[WorldClass.L], "Marginally habitable world"),
        30: new GeneralPlanetaryType(this.worldClasses[WorldClass.L], "Marginally habitable world"),
        31: new GeneralPlanetaryType(this.worldClasses[WorldClass.K], "Neptune-like"),
        32: new GeneralPlanetaryType(this.worldClasses[WorldClass.K], "Mars-like"),
        33: new GeneralPlanetaryType(this.worldClasses[WorldClass.K], "Mars-like"),
        34: new GeneralPlanetaryType(this.worldClasses[WorldClass.Y]),
        35: new GeneralPlanetaryType(this.worldClasses[WorldClass.Y]),
        36: new GeneralPlanetaryType(this.worldClasses[WorldClass.ArtificialPlanet], "Obvious"),
        37: new GeneralPlanetaryType(this.worldClasses[WorldClass.ArtificialPlanet], "Obvious"),
        38: new GeneralPlanetaryType(this.worldClasses[WorldClass.J]),
        39: new GeneralPlanetaryType(this.worldClasses[WorldClass.J]),
        40: new GeneralPlanetaryType(this.worldClasses[WorldClass.T]),
    }

    private innerWorldTable: { [roll: number]: WorldClassModel[] } = {
        1: [ this.worldClasses[WorldClass.Y] ], // Y
        2: [ this.worldClasses[WorldClass.B] ], // B
        3: [ this.worldClasses[WorldClass.B] ], // B
        4: [ this.worldClasses[WorldClass.N] ], // N
        5: [ this.worldClasses[WorldClass.N] ], // N
        6: [ this.worldClasses[WorldClass.N] ], // N
        7: [ this.worldClasses[WorldClass.J] ], // J
        8: [ this.worldClasses[WorldClass.J] ], // J
        9: [ this.worldClasses[WorldClass.J] ], // J
        10: [ this.worldClasses[WorldClass.J] ], // J
        11: [ this.worldClasses[WorldClass.J] ], // J
        12: [ this.worldClasses[WorldClass.D], this.worldClasses[WorldClass.AsteroidBelt] ], // D or Asteroid
        13: [ this.worldClasses[WorldClass.D], this.worldClasses[WorldClass.AsteroidBelt] ], // D or Asteroid
        14: [ this.worldClasses[WorldClass.D], this.worldClasses[WorldClass.AsteroidBelt] ], // D or Asteroid
        15: [ this.worldClasses[WorldClass.D], this.worldClasses[WorldClass.AsteroidBelt] ], // D or Asteroid
        16: [ this.worldClasses[WorldClass.D], this.worldClasses[WorldClass.AsteroidBelt] ], // D or Asteroid
        17: [ this.worldClasses[WorldClass.H] ], // H
        18: [ this.worldClasses[WorldClass.H] ], // H
        19: [ this.worldClasses[WorldClass.H] ], // H
        20: [ this.worldClasses[WorldClass.L], this.worldClasses[WorldClass.K], this.worldClasses[WorldClass.M] ], // L, K, or M
    }

    private outerWorldTable: { [roll: number]: WorldClassModel[] } = {
        1: [ this.worldClasses[WorldClass.L] ], // L
        2: [ this.worldClasses[WorldClass.C] ], // C
        3: [ this.worldClasses[WorldClass.C] ], // C
        4: [ this.worldClasses[WorldClass.C] ], // C
        5: [ this.worldClasses[WorldClass.C] ], // C
        6: [ this.worldClasses[WorldClass.J] ], // J
        7: [ this.worldClasses[WorldClass.J] ], // J
        8: [ this.worldClasses[WorldClass.J] ], // J
        9: [ this.worldClasses[WorldClass.J] ], // J
        10: [ this.worldClasses[WorldClass.J] ], // J
        11: [ this.worldClasses[WorldClass.J] ], // J
        12: [ this.worldClasses[WorldClass.J] ], // J
        13: [ this.worldClasses[WorldClass.J] ], // J
        14: [ this.worldClasses[WorldClass.J] ], // J
        15: [ this.worldClasses[WorldClass.D], this.worldClasses[WorldClass.AsteroidBelt] ], // D or Asteroid
        16: [ this.worldClasses[WorldClass.D], this.worldClasses[WorldClass.AsteroidBelt] ], // D or Asteroid
        17: [ this.worldClasses[WorldClass.D], this.worldClasses[WorldClass.AsteroidBelt] ], // D or Asteroid
        18: [ this.worldClasses[WorldClass.D], this.worldClasses[WorldClass.AsteroidBelt] ], // D or Asteroid
        19: [ this.worldClasses[WorldClass.I] ], // I
        20: [ this.worldClasses[WorldClass.P] ], // P
    }

    private primaryWorldTable: { [roll: number]: WorldClassModel[] } = {
        1: [ this.worldClasses[WorldClass.L], this.worldClasses[WorldClass.E] ], // L or E
        2: [ this.worldClasses[WorldClass.L], this.worldClasses[WorldClass.E] ], // L or E
        3: [ this.worldClasses[WorldClass.L], this.worldClasses[WorldClass.E] ], // L or E
        4: [ this.worldClasses[WorldClass.L], this.worldClasses[WorldClass.E] ], // L or E
        5: [ this.worldClasses[WorldClass.L], this.worldClasses[WorldClass.E] ], // L or E
        6: [ this.worldClasses[WorldClass.M] ], // M
        7: [ this.worldClasses[WorldClass.M] ], // M
        8: [ this.worldClasses[WorldClass.M] ], // M
        9: [ this.worldClasses[WorldClass.M] ], // M
        10: [ this.worldClasses[WorldClass.M] ], // M
        11: [ this.worldClasses[WorldClass.M] ], // M
        12: [ this.worldClasses[WorldClass.M] ], // M
        13: [ this.worldClasses[WorldClass.K] ], // K
        14: [ this.worldClasses[WorldClass.K] ], // K
        15: [ this.worldClasses[WorldClass.K] ], // K
        16: [ this.worldClasses[WorldClass.K] ], // K
        17: [ this.worldClasses[WorldClass.K] ], // K
        18: [ this.worldClasses[WorldClass.K] ], // K
        19: [ this.worldClasses[WorldClass.O], this.worldClasses[WorldClass.P] ], // O or P
        20: [ this.worldClasses[WorldClass.O], this.worldClasses[WorldClass.P] ], // O or P
    }

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

    private asteroidSizeTable: { [roll: number] : number } = {
        1: 1,
        2: 5,
        3: 10,
        4: 25,
        5: 50,
        6: 75,
        7: 100,
        8: 150,
        9: 200,
        10: 300,
        11: 500,
        12: 1000,
        13: 2500,
        14: 5000,
        15: 10000,
        16: 25000,
        17: 50000,
        18: 100000,
        19: 250000,
        20: 500000,
    }

    private planetaryFeaturesOfInterest = (roll: number) => {
        switch (roll) {
            case 1:
            case 2:
                return "Exceedingly dangerous animal or plant life";
            case 3:
            case 4:
                return "Peaceful primitive inhabitants";
            case 5:
            case 6:
                return "Warlike primitive inhabitants";
            case 7:
                return "Peaceful technological inhabitants";
            case 8:
            case 9:
                return "Warlike technological inhabitants";
            case 10:
            case 11:
                return "Transcendent inhabitants of great power";
            case 12:
            case 13:
                return "Ancient ruins or artifacts";
            case 14:
            case 15:
                return "Off-world visitors";
            case 16:
            case 17:
                return "Crashed spacecraft";
            case 18:
                return "Local conditions that limit or prohibit transporter use";
            case 19:
            case 20:
            default:
                return "Dangerous natural phenomena";
        }
    }

    private planetaryDetails = (roll: number) => {
        switch (roll) {
            case 1:
                return "Opaque or partially opaque atmosphere (fog, smoke, opaque gasses, swarms of air-plankton)"
            case 2:
                return "Perpetual darkness";
            case 3:
                return "Perpetual dim light"
            case 4:
                return "Many huge animals (anywhere from the size of a large dinosaur to the size of a large starship)";
            case 5:
                return "Most animals (and perhaps also plants) are well camouflaged and difficult to notice"
            case 6:
                return "The air is filled with floating and flying creatures of all sizes";
            case 7:
            case 8:
            case 9:
                return "Earth-like vegetation and animals";
            case 10:
            case 11:
            case 12:
                return "Most life-forms are unusually colored (blue, purple, bright red, monochromatic...)";
            case 13:
            case 14:
                return "Most life-forms have more or fewer than 4 limbs, perhaps 3, maybe 6, 8 or even more";
            case 15:
            case 16:
                return "Gelid or blobby life-forms";
            case 17:
            case 18:
                return "Animate plants, sessile animals, or no distinction between plants and animals";
            case 19:
            case 20:
            default:
                return "Crystalline life-forms";
        }
    }

    private asteroidBeltZoneDominance = (roll: number) => {
        switch (roll) {
            case 1:
            case 2:
            case 3:
            case 4:
                return AsteroidBeltZone.Nickel;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
                return AsteroidBeltZone.Mixed;
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
                return AsteroidBeltZone.CarbonaceousOrIce;
        }
    }

    private asteroidBeltZoneDepths = (zone: AsteroidBeltZone, roll: number) => {
        switch (zone) {
            case AsteroidBeltZone.Nickel:
                switch (roll) {
                    case 1:
                    case 2:
                    case 3:
                        return { nZone: 40, mZone: 30, cZone: 30};
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                        return { nZone: 40, mZone: 40, cZone: 20};

                    case 11:
                    case 12:
                    case 13:
                    case 14:
                        return { nZone: 50, mZone: 40, cZone: 10};
                    case 15:
                    case 16:
                        return { nZone: 50, mZone: 30, cZone: 20};
                    case 17:
                    case 18:
                        return { nZone: 60, mZone: 30, cZone: 10};
                    case 19:
                    case 20:
                    default:
                        return { nZone: 60, mZone: 20, cZone: 20};
                }

            case AsteroidBeltZone.Mixed:
                switch (roll) {
                    case 1:
                    case 2:
                    case 3:
                        return { nZone: 20, mZone: 50, cZone: 30};
                    case 4:
                    case 5:
                    case 6:
                        return { nZone: 30, mZone: 50, cZone: 20};

                    case 7:
                    case 8:
                    case 9:
                        return { nZone: 20, mZone: 60, cZone: 20};
                    case 10:
                    case 11:
                        return { nZone: 30, mZone: 60, cZone: 10};
                    case 12:
                    case 13:
                        return { nZone: 10, mZone: 70, cZone: 20};
                    case 14:
                    case 15:
                        return { nZone: 20, mZone: 70, cZone: 10};
                    case 16:
                    case 17:
                        return { nZone: 10, mZone: 80, cZone: 10};
                    case 18:
                    case 19:
                        return { nZone: 0, mZone: 80, cZone: 20};
                    case 20:
                    default:
                        return { nZone: 0, mZone: 90, cZone: 10};
                }

            case AsteroidBeltZone.CarbonaceousOrIce:
                switch (roll) {
                    case 1:
                    case 2:
                    case 3:
                        return { nZone: 20, mZone: 30, cZone: 50};
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                        return { nZone: 10, mZone: 30, cZone: 60};

                    case 11:
                    case 12:
                    case 13:
                    case 14:
                        return { nZone: 10, mZone: 20, cZone: 70};
                    case 15:
                    case 16:
                        return { nZone: 10, mZone: 10, cZone: 80};
                    case 17:
                    case 18:
                        return { nZone: 0, mZone: 20, cZone: 80};
                    case 19:
                    case 20:
                    default:
                        return { nZone: 0, mZone: 10, cZone: 90};
                }

            default:
        }
    }

    private orbitalEccentricity = () => {
        let roll = D20.roll();
        switch (roll) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                return 0.0;
            case 11:
            case 12:
                return 0.005;
            case 13:
            case 14:
                return 0.010;
            case 15:
            case 16:
                return 0.015;
            case 17:
            case 18:
                return 0.020;
            case 19:
            case 20:
            default:
                switch (D20.roll()) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        return 0.025;
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        return 0.050;
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                        return 0.100;
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                        return 0.200;
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    default:
                        return 0.250;
                }
        }
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
            let system = this.generateStarSystem(region, sectorType);
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
            s.id = idString;
            s.rootName = sector.simpleName;
        });

        store.dispatch(setSector(sector));
        store.dispatch(setStar(sector.systems[0]));

    }

    generateStarSystem(region: SpaceRegionModel, sectorType?: SpecialSectors) {
        let star = this.generateStar();
        let phenomenon = undefined;

        if (star == null && sectorType != null) { // roll of 20
            phenomenon = this.generateSpatialPhenomenon(sectorType);

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
                        if ((companion as Star).mass <= star.mass) {
                            starSystem.companionStar = companion;

                            if (D20.roll() <= 10) {
                                starSystem.companionType = CompanionType.Close;
                            } else {
                                starSystem.companionType = CompanionType.Distant;
                            }
                            break;
                        }
                    }
                }
            }

            this.generateSystem(region, starSystem);
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
        let star = new Star(spectralClass, subClass, luminosity, mass);
        if (!star.spectralClass.isDwarf) {
            let luminosityValue = LuminosityTable.generateLuminosity(star);
            star.luminosityValue = luminosityValue;
        }

        return star;
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

    rollWorldType(table: { [roll: number]: WorldClassModel[] }) {
        let worldRoll = D20.roll();
        let worldTypes = table[worldRoll];
        let worldType = worldTypes[0];
        if (worldTypes.length > 1) {
            worldType = worldTypes[Math.floor(Math.random() * worldTypes.length)];
        }
        return worldType;
    }

    createBasicWorld(isPrimaryWorld: boolean, orbit: Orbit, romanNumeral: number, region: SpaceRegionModel, starSystem: StarSystem, useCoreTable: boolean = false) {
        if (region.id !== SpaceRegion.ShackletonExpanse && (isPrimaryWorld || useCoreTable || (orbit.radius < starSystem.gardenZoneOuterRadius && orbit.radius >= starSystem.gardenZoneInnerRadius))) {

            let roll = D20.roll() + D20.roll();
            let type = this.generalPlanetaryType[roll];

            let world = this.createBasicWorldAttributes(type.worldClass, orbit, romanNumeral, starSystem);
            if (type.notes) {
                world.notes.push(type.notes);
            }

            if (isPrimaryWorld && world.worldClass.id !== WorldClass.D && !world.worldClass.isGasGiant) {
                world.features.push(this.planetaryFeaturesOfInterest(D20.roll()));
                let feature2 = this.planetaryFeaturesOfInterest(D20.roll());
                if (world.features.indexOf(feature2) < 0) {
                    world.features.push(feature2);
                }

                world.features.push(this.planetaryDetails(D20.roll()));
            }

            return world;
        } else {

            let table = this.innerWorldTable;
            if (isPrimaryWorld) {
                table = this.primaryWorldTable;
            } else if (orbit.radius > starSystem.gardenZoneOuterRadius) {
                table = this.outerWorldTable;
            } else if (orbit.radius >= starSystem.gardenZoneInnerRadius) {
                table = this.primaryWorldTable;
            }

            let worldType = this.rollWorldType(table);

            return this.createBasicWorldAttributes(worldType, orbit, romanNumeral, starSystem);
        }
    }

    createBasicWorldAttributes(worldType: WorldClassModel, orbit: Orbit, romanNumeral: number, starSystem: StarSystem) {
        let world = new World(worldType, worldType.id === WorldClass.AsteroidBelt ? undefined : romanNumeral);
        world.orbitalRadius = orbit.radius;
        world.orbitNumber = orbit.index;
        world.orbitalEccentricity = Math.abs(addNoiseToValue(this.orbitalEccentricity(), 10));
        world.period = Math.sqrt(Math.pow(world.orbitalRadius, 3) / starSystem.star.mass);
        return world;
    }

    generateSystem(region: SpaceRegionModel, starSystem: StarSystem) {

        if (!starSystem.star.spectralClass.isDwarf) {
            let roll = D20.roll();
            this.numberOfPlanetsModifiers.forEach(mod => roll += mod(starSystem));
            roll = Math.max(1, Math.min(20, roll));

            let worldCount = this.numberOfPlanetsTable[roll];
            let orbits = Orbits.createOrbits(worldCount, starSystem);
            let primaryWorldOrbit =  orbits.primaryWorldOrbit;

            let romanNumeralId = 0;

            for (let i = 0; i < worldCount; i++) {

                let orbit = orbits.orbits[i];
                let world = null;
                if (i === (primaryWorldOrbit-1) && orbit.radius > starSystem.gardenZoneOuterRadius) {
                    let roll = D20.roll();
                    let worldClass = this.worldClasses[WorldClass.J];
                    if (roll >= 9) {
                        worldClass = this.worldClasses[WorldClass.I];
                    } else if (roll > 16) {
                        worldClass = this.worldClasses[WorldClass.T];
                    }
                    world = this.createBasicWorldAttributes(worldClass, orbit, romanNumeralId, starSystem);
                    this.createGasGiantDetails(world, orbit, starSystem, region, true);
                    romanNumeralId++;
                } else {
                    world = this.createBasicWorld(i === (primaryWorldOrbit-1), orbit, romanNumeralId, region, starSystem);
                    if (world.worldClass.id === WorldClass.AsteroidBelt) {
                        world.numberOfSatellites = 0;
                    } else {
                        romanNumeralId++;
                        if (!world.worldClass.isGasGiant) {
                            world.numberOfSatellites = this.numberOfMoonsTable[D20.roll()];
                        }
                    }

                    if (world.worldClass.id === WorldClass.AsteroidBelt) {
                        let details = new AsteroidBeltDetails();

                        let roll = Math.ceil((D20.roll() + D20.roll()) / 2);
                        details.asteroidSize = this.asteroidSizeTable[roll];

                        let maxDepth = orbits.orbits[0].radius / 2;
                        if (i > 0) {
                            maxDepth = (world.orbitalRadius - orbits.orbits[i-1].radius);
                        }
                        if (i < worldCount-1) {
                            maxDepth = Math.min(maxDepth, (orbits.orbits[i+1].radius - world.orbitalRadius));
                        }

                        let depth = maxDepth;
                        roll = Math.ceil((D20.roll() + D20.roll()) / 4);

                        if (i < 4) {
                            roll -= 3;
                        } else if (i < 8) {
                            roll -= 1;
                        } else if (i < 12) {
                            roll += 1;
                        } else {
                            roll += 2;
                        }
                        switch (roll) {
                        case 1:
                            depth = 0.01;
                            break
                        case 2:
                            depth = 0.05;
                            break
                        case 3:
                        case 4:
                            depth = 0.1;
                            break
                        case 5:
                        case 6:
                            depth = 0.5;
                            break
                        case 7:
                            depth = 1.0;
                            break
                        case 8:
                            depth = 1.5;
                            break
                        case 9:
                            depth = 2.0;
                            break
                        case 10:
                            depth = 5.0;
                            break
                        default:
                            depth = 10.0;
                        }
                        details.depth = addNoiseToValue(Math.min(maxDepth, depth));
                        let zoneRoll = D20.roll();
                        if (orbit.radius >= starSystem.gardenZoneInnerRadius && orbit.radius < starSystem.gardenZoneOuterRadius) {
                            zoneRoll = Math.max(1, zoneRoll - 5);
                        } else if (orbit.radius >= starSystem.gardenZoneOuterRadius) {
                            zoneRoll = Math.min(20, zoneRoll + 5);
                        }
                        let zone = this.asteroidBeltZoneDominance(zoneRoll)
                        let { nZone, mZone, cZone } = this.asteroidBeltZoneDepths(zone, D20.roll());
                        details.nickelIronPercent = nZone / 100.0;
                        details.mixedPercent = mZone / 100.0;
                        details.carbonaceousOrIcePercent = cZone / 100.0;
                        world.worldDetails = details;
                    } else if (world.worldClass.id === WorldClass.ArtificialPlanet) {
                    } else if (world.worldClass.isGasGiant) {
                        this.createGasGiantDetails(world, orbit, starSystem, region);
                    } else {
                        this.calculateStandardPlanetSize(world, starSystem);
                        world.worldDetails = this.deriveStandardWorldDetails(world);
                    }
                }



                starSystem.worlds.push(world);
            }
        }
    }

    createGasGiantDetails(world: World, orbit: Orbit, starSystem: StarSystem, region: SpaceRegionModel, forceEcosphere: boolean = false) {
        let detailsRoll = D20.roll();
        if (orbit.radius < starSystem.gardenZoneInnerRadius) {
            // don't modify the result; we don't want a ecosphere world
        } else if (world.worldClass.id === WorldClass.J) {
            detailsRoll += 2
        } else if (world.worldClass.id === WorldClass.T || world.worldClass.id === WorldClass.I) {
            detailsRoll += 3
        }
        this.gasGiantSatellitesTable[forceEcosphere ? 23 : detailsRoll](world);
        this.calculateGasGiantSize(world);
        let details = world.worldDetails as GasGiantDetails;
        if (details.ecosphere) {
            details.ecosphereWorlds = [ this.createSatelliteWorld(world, orbit, starSystem, region, forceEcosphere) ];
        }
    }

    createSatelliteWorld(gasGiant: World, orbit: Orbit, starSystem: StarSystem, region: SpaceRegionModel, isPrimary: boolean) {
        let details = gasGiant.worldDetails as GasGiantDetails;
        let moonWorld = this.createBasicWorld(isPrimary, orbit, gasGiant.orbit, region, starSystem, true);
        let done = false;
        while (!done) {
            if (moonWorld.worldClass.id !== WorldClass.ArtificialPlanet && !moonWorld.worldClass.isGasGiant) {
                if (details.giantMoons > 0) {
                    moonWorld.satelliteOrbit = Math.floor(Math.random() * details.giantMoons);
                } else {
                    moonWorld.satelliteOrbit = Math.floor(Math.random() * details.largeMoons);
                }
                moonWorld.notes.push("Satellite world orbiting in gas giant's ecosphere");
                this.calculateStandardPlanetSize(moonWorld, starSystem);
                moonWorld.worldDetails = this.deriveStandardWorldDetails(moonWorld);

                let orbitalRadius = (D20.roll() * D20.roll() / 4) + D20.roll();
                moonWorld.satelliteOrbitalRadius = orbitalRadius * gasGiant.diameter;
                moonWorld.period = Math.sqrt((Math.pow(moonWorld.satelliteOrbitalRadius / 400000, 3) * 793.64) / gasGiant.mass) / 365.25;
                done = true;
            } else {
                moonWorld = this.createBasicWorld(isPrimary, orbit, gasGiant.orbit, region, starSystem, true);
            }
        }
        return moonWorld;
    }

    deriveStandardWorldDetails(world: World) {
        let result = new StandardWorldDetails();
        if (world.orbitalRadius != null) {
            let period = D20.roll() + D20.roll() + 5 + (world.mass / world.orbitalRadius);

            if (period > 40) {
                let specialRoll = Math.ceil(D20.roll() / 2);
                switch (specialRoll) {
                    case 1:
                        result.rotationPeriod = addNoiseToValue(D20.roll() * 3) * 24;
                        result.retrograde = true;
                        break;
                    case 2:
                        result.rotationPeriod = addNoiseToValue(D20.roll() * 6) * 24;
                        break;
                    case 3:
                        result.rotationPeriod = addNoiseToValue(D20.roll() * 3) * 24;
                        break;
                    case 4:
                    case 5:
                    case 6:
                        result.tidallyLocked = true;
                        break;
                    case 7:
                        result.rotationPeriod = addNoiseToValue(D20.roll() * 3) * 24;
                        break;
                    case 8:
                        result.rotationPeriod = addNoiseToValue(D20.roll() * 15) * 24;
                        break;
                    case 9:
                        result.rotationPeriod = addNoiseToValue(D20.roll() * 15) * 24;
                        result.retrograde = true;
                        break;
                    case 10:
                        result.rotationPeriod = period;
                        break
                }
            } else {
                result.rotationPeriod = addNoiseToValue(period);
            }
        }

        if (world.worldClass.id === WorldClass.O) {
            result.hydrographicPercentage = Math.min(100, addNoiseToValue(D20.roll() + 80));
        } else if (world.worldClass.id === WorldClass.K || world.worldClass.id === WorldClass.L) {
            result.hydrographicPercentage = addNoiseToValue(D20.roll() / 2);
        } else if (world.worldClass.id === WorldClass.M) {
            result.hydrographicPercentage = addNoiseToValue(10 + (D20.roll() / 2) + D20.roll() + D20.roll() + D20.roll());
        } else if (world.worldClass.id === WorldClass.H) {
            result.hydrographicPercentage = Math.max(0, addNoiseToValue(D20.roll() / 2 - 5));
        }

        let roll = D20.roll();
        switch (roll) {
        case 1:
        case 2:
        case 3:
            result.axialTilt = Math.max(0, addNoiseToValue(D20.roll() / 2));
            break;
        case 4:
        case 5:
        case 6:
        case 7:
            result.axialTilt = Math.max(0, addNoiseToValue(D20.roll() / 2 + 10));
            break;
        case 8:
        case 9:
        case 10:
        case 11:
            result.axialTilt = Math.max(0, addNoiseToValue(D20.roll() / 2 + 20));
            break;
        case 12:
        case 13:
        case 14:
        case 15:
            result.axialTilt = Math.max(0, addNoiseToValue(D20.roll() / 2 + 30));
            break;
        case 16:
        case 17:
        case 18:
        case 19:
            result.axialTilt = Math.max(0, addNoiseToValue(D20.roll() / 2 + 40));
            break;

        case 20:
            let subRoll = Math.ceil(D20.roll() / 5) * 10 + 40;
            result.axialTilt = Math.min(90, addNoiseToValue(D20.roll() / 2 + subRoll));
            break;
        }

        if (D20.roll() <= 10) {
            result.axialTilt = -result.axialTilt;
        }

        return result;
    }

    calculateGasGiantSize(world: World) {
        let minimumDiameter = 50000;
        let maximumDiameter = 140000;

        if (world.worldClass.id === WorldClass.I) {
            minimumDiameter = 140000;
            maximumDiameter = 10000000;
//        } else if (world.worldClass.id === WorldClass.S) {
//            minimumDiameter = 10000000;
//            maximumDiameter = 50000000;
        } else if (world.worldClass.id === WorldClass.T) {
            minimumDiameter = 50000000;
            maximumDiameter = 120000000;
        }

        let delta = (maximumDiameter - minimumDiameter) / (40 - 1);
        let roll = D20.roll() + D20.roll();

        let diameter = (roll - 2) * delta + minimumDiameter;
        world.diameter = addNoiseToValue(diameter);
        world.density = addNoiseToValue((D20.roll() + D20.roll()) / 2  * 0.01 + 0.1);
    }

    calculateStandardPlanetSize(world: World, starSystem: StarSystem) {
        // class E, F, G, L, M, N, P, O
        let minimumDiameter = 10000;
        let maximumDiameter = 15000;

        if (world.worldClass.id === WorldClass.K) {
            minimumDiameter = 5000;
        } else if (world.worldClass.id === WorldClass.H) {
            minimumDiameter = 8000;
        } else if (world.worldClass.id === WorldClass.Y) {
            maximumDiameter = 50000;
        } else if (world.worldClass.id === WorldClass.B) {
            minimumDiameter = 1000;
            maximumDiameter = 10000;
        } else if (world.worldClass.id === WorldClass.D) {
            minimumDiameter = 100;
            maximumDiameter = 1000;
        }
        let delta = (maximumDiameter - minimumDiameter) / (40 - 1);
        let roll = D20.roll() + D20.roll();
        let diameter = (roll - 2) * delta + minimumDiameter;
        world.diameter = addNoiseToValue(diameter);

        let core = D20.roll() > 2 ? WorldCoreType.Molten : WorldCoreType.Heavy;
        if (world.worldClass.id === WorldClass.B || world.worldClass.id === WorldClass.E || world.worldClass.id === WorldClass.Y) { // also F
            core = WorldCoreType.Molten;
        } else if (world.worldClass.id === WorldClass.M || world.worldClass.id === WorldClass.K
                || world.worldClass.id === WorldClass.L || world.worldClass.id === WorldClass.O) {
            core = D20.roll() > 4 ? WorldCoreType.Molten : WorldCoreType.Heavy;
        } else if (world.worldClass.id === WorldClass.D && starSystem.gardenZoneOuterRadius < world.orbitalRadius) {
            core = D20.roll() >= 10 ? WorldCoreType.Icy : WorldCoreType.Rocky;
        } else if (world.worldClass.id === WorldClass.D) {
            core = WorldCoreType.Rocky;
        } else if (world.diameter < 6400 && starSystem.gardenZoneOuterRadius < world.orbitalRadius) {
            let temp = D20.roll();
            if (temp >= 14) {
                core = WorldCoreType.Icy
            } else if (temp >= 8) {
                core = WorldCoreType.Rocky
            } else {
                core = WorldCoreType.Molten;
            }
        }
        world.coreType = core;

        if (world.coreType === WorldCoreType.Heavy) {
            world.density = ((D20.roll() + D20.roll()) - 2) * 0.03 + 1.10;
        } else if (world.coreType === WorldCoreType.Molten) {
            world.density = ((D20.roll() + D20.roll()) - 2) * 0.01 + 0.8;
        } else if (world.coreType === WorldCoreType.Rocky) {
            world.density = ((D20.roll() + D20.roll()) - 2) * 0.01 + 0.48;
        } else if (world.coreType === WorldCoreType.Icy) {
            world.density = ((D20.roll() + D20.roll()) - 2) * 0.01 + 0.15;
        }

        world.gravity = world.mass * (Math.pow(12750, 2) / Math.pow(world.diameter, 2));
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
