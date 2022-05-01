import { Color } from "../../common/colour";
import { D20, D6 } from "../../common/die";
import { setSector, setStar } from "../../state/starActions";
import store from "../../state/store";
import { LuminosityClass, LuminosityClassModel, Sector, SectorCoordinates, SpectralClass, SpectralClassModel, Star, StarSystem, Range, World, WorldClass, WorldClassModel } from "./star";


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

class SystemGeneration {

    private spectralClasses: SpectralClassModel[] = [
        new SpectralClassModel(SpectralClass.M, "M", new Range(2400, 3700), "Red", Color.from("#ff0000"), new Range(null, 0.7)),
        new SpectralClassModel(SpectralClass.K, "K", new Range(3700, 5200), "Orange", Color.from("#ff9833"), new Range(0.7, 0.96)),
        new SpectralClassModel(SpectralClass.G, "G", new Range(5200, 6000), "Yellow", Color.from("#ffff00"), new Range(0.96, 1.15)),
        new SpectralClassModel(SpectralClass.F, "F", new Range(6000, 7500), "Yellow white", Color.from("#ffffed"), new Range(1.15, 1.4)),
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

    private numberOfPlanetsModifiers: { (starSystem: StarSystem): number; }[] = [
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.M ? -3 : 0 ),
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.K ? -2 : 0 ),
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.G ? 0 : 0 ),
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.F ? 1 : 0 ),
        ( (starSystem) => starSystem.star.spectralClass.id === SpectralClass.A ? 1 : 0 ),
        ( (starSystem) => (starSystem.star.spectralClass.id === SpectralClass.B || starSystem.star.spectralClass.id === SpectralClass.O) ? 0 : 0 ),
        ( (starSystem) => (starSystem.star.luminosityClass != null && starSystem.star.luminosityClass.id === LuminosityClass.III) ? -3 : 0 ),
        ( (starSystem) => (starSystem.star.luminosityClass != null && (starSystem.star.luminosityClass.id === LuminosityClass.II || starSystem.star.luminosityClass.id === LuminosityClass.Ia || starSystem.star.luminosityClass.id === LuminosityClass.Ib)) ? -5 : 0 ),
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

    generateSector() {
        let count = this.notableSystemsTable[D20.roll()];
        let sector = new Sector("SE");
        for (let i = 0; i < count; i++) {
            let system = this.generateStarSystem();
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

    generateStarSystem() {
        let star = this.generateStar();
        if (star != null) {
            let starSystem = new StarSystem(star);
            starSystem.sectorCoordinates = this.generateCoordinates();
            console.log(starSystem.sectorCoordinates.description);

            if (D6.rollFace().isEffect) {
                console.log("should generate a companion star");
                while (true) {
                    let companion = this.generateStar();
                    if (companion != null && companion instanceof Star) {
                        starSystem.companionStar = companion;
                        break;
                    }
                }
            }

            this.generateSystem(starSystem);
            return starSystem;
        } else {
            return undefined;
        }
    }

    generateStar() {
        let spectralClass = this.rollSpectralClass();
        if (spectralClass) {

            let subClass = this.rollSubSpectralClass();
            let luminosity = (spectralClass != null && !spectralClass.isDwarf()) ? this.rollLuminosity(spectralClass) : undefined;
            return new Star(spectralClass, subClass, luminosity);
        } else {
            return undefined;
        }
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

            console.log("number of worlds: " + worldCount + ". Primary world: " + primaryWorldOrbit);


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
            }

            for (let i = 0; i < this.gardenZoneTable.length; i++) {
                let zone = this.gardenZoneTable[i];
                if (starSystem.star.spectralClass.id === zone.spectralClass && starSystem.star.luminosityClass.id === zone.luminosity) {
                    console.log("Garden zone: " + zone.from + "-" + zone.to);
                }
            }
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