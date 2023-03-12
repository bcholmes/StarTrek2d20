import { D20 } from "../../common/die";

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export enum WorldCoreType {
    Heavy, Molten, Rocky, Icy
}

export enum WorldClass {
    AsteroidBelt,
    B,
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
    ArtificialPlanet,
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

export enum RingType {
    None,
    Faint,
    Spectacular,
    OortCloud,
    AsteroidBelt
}

export class RingTypeModel {
    id: RingType;
    name: string;

    private static types: RingTypeModel[];

    constructor(id: RingType, name: string) {
        this.id = id;
        this.name = name;
    }

    static getTypes() {
        if (this.types == null) {
            this.types = [
                new RingTypeModel(RingType.None, "None"),
                new RingTypeModel(RingType.Faint, "Faint ring"),
                new RingTypeModel(RingType.Spectacular, "Spectacular ring"),
                new RingTypeModel(RingType.OortCloud, "Oort Belt of slush balls"),
                new RingTypeModel(RingType.AsteroidBelt, "Asteroid Belt of small moons and moonlets"),
            ];
        }
        return this.types;
    }

    static getType(type: RingType) {
        return this.getTypes()[type];
    }
    static getTypeNone() {
        return this.getTypes()[0];
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

export class WorldDetails {
    plainText() {
        return "";
    }
}

export class AsteroidBeltDetails extends WorldDetails {
    asteroidSize: number;
    depth: number;
    nickelIronPercent: number;
    carbonaceousOrIcePercent: number;
    mixedPercent: number;

    plainText() {
        return (this.depth != null ? "\nBelt Width: " + this.depth.toFixed(2) + " AUs" : "") +
            (this.asteroidSize != null ? "\nPredominant Size: " + (this.asteroidSize >= 1000 ? ((this.asteroidSize / 1000).toFixed(0) + "km") : (this.asteroidSize.toFixed(0) + "m")) + " Diameter" : "");
    }

    get attributeList() {
        let result = [];
        if (this.asteroidSize != null) {
            result.push(new WorldAttribute("Predominant Size", (this.asteroidSize >= 1000 ? ((this.asteroidSize / 1000).toFixed(0) + "km") : (this.asteroidSize.toFixed(0) + "m")) + " Diameter"));
        }
        if (this.depth != null) {
            result.push(new WorldAttribute("Belt Width", this.depth.toFixed(2) + " AUs"));
        }

        if (this.nickelIronPercent > 0) {
            result.push(new WorldAttribute("Inner Belt", (this.nickelIronPercent * this.depth).toFixed(2) + " AUs (nickel-iron)"));
        }
        result.push(new WorldAttribute("Mixed Belt", (this.mixedPercent * this.depth).toFixed(2) + " AUs (Mixed)"));
        result.push(new WorldAttribute("Outer Belt", (this.carbonaceousOrIcePercent * this.depth).toFixed(2) + " AUs (carbonaceous and/or ice)"));

        return result;
    }
}

export class GasGiantDetails extends WorldDetails {
    moonlets?: number;
    smallMoons?: number;
    mediumMoons?: number;
    largeMoons?: number;
    giantMoons?: number;

    ecosphereWorlds: World[] = [];

    ring?: RingTypeModel = RingTypeModel.getTypeNone();

    ecosphere: boolean;

    public static createBasicDistributionOfMoons(gasGiant: World) {
        let result = new GasGiantDetails();
        let modifier = 0;
        if (gasGiant?.worldClass?.id === WorldClass.J) {
            modifier = 1;
        } else if (gasGiant?.worldClass?.id === WorldClass.T ||
            gasGiant.worldClass.id === WorldClass.I) {
            modifier = 2;
        }
        result.moonlets = Math.ceil(D20.roll() / 2) + Math.ceil(D20.roll() / 2) + modifier;
        result.smallMoons = Math.ceil(D20.roll() / 4) + Math.ceil(D20.roll() / 4) + modifier;
        result.mediumMoons = Math.ceil(D20.roll() / 3) + modifier + 1;
        result.largeMoons = Math.max(0, Math.ceil(D20.roll() / 3) + modifier - 3);
        result.giantMoons = Math.max(0, Math.ceil(D20.roll() / 3) + modifier - 5);
        return result;
    }

    public static createBasicDistributionOfMoonsWithEcosphere(gasGiant: World) {
        let result = this.createBasicDistributionOfMoons(gasGiant);
        if (D20.roll() > 10) {
            result.giantMoons = Math.max(1, result.giantMoons);
        } else {
            result.largeMoons = Math.max(1, result.largeMoons);
        }
        result.ecosphere = true;
        return result;
    }

    public static createFaintRing(gasGiant: World) {
        let result = this.createBasicDistributionOfMoons(gasGiant);
        result.ring = RingTypeModel.getType(RingType.Faint);
        return result;
    }

    public static createTwiceAsManyWorlds(gasGiant: World) {
        let result = this.createBasicDistributionOfMoons(gasGiant);
        result.moonlets += result.moonlets;
        result.smallMoons += result.smallMoons;
        result.mediumMoons += result.mediumMoons;
        result.largeMoons += result.largeMoons;
        result.giantMoons += result.giantMoons;
        return result;
    }

    public static createBrightRing(gasGiant: World) {
        let result = this.createBasicDistributionOfMoons(gasGiant);
        result.ring = RingTypeModel.getType(RingType.Spectacular);
        return result;
    }

    public static createOortBelt(gasGiant: World) {
        let result = this.createBasicDistributionOfMoons(gasGiant);
        result.ring = RingTypeModel.getType(RingType.OortCloud);
        return result;
    }

    public static createAsteroidBelt(gasGiant: World) {
        let result = this.createBasicDistributionOfMoons(gasGiant);
        result.moonlets = undefined;
        result.smallMoons = undefined;
        result.ring = RingTypeModel.getType(RingType.AsteroidBelt);
        return result;
    }

    public get satelliteDetails() {
        if ((this.giantMoons ?? 0) === 0 && (this.largeMoons ?? 0) === 0 && (this.mediumMoons ?? 0) === 0 && (this.smallMoons ?? 0) === 0 && (this.moonlets ?? 0) !== 0) {
            return this.moonlets + " moonlets";
        } else if ((this.giantMoons ?? 0) === 0 && (this.largeMoons ?? 0) === 0 && (this.mediumMoons ?? 0) === 0 && (this.smallMoons ?? 0) !== 0) {
            return this.smallMoons + " small moons, " + this.moonlets + " moonlets";
        } else if ((this.giantMoons ?? 0) === 0 && (this.largeMoons ?? 0) === 0 && (this.mediumMoons ?? 0) !== 0) {
            return this.mediumMoons + " medium moons" +
                (this.ring?.id !== RingType.AsteroidBelt ? ", " + this.smallMoons + " small moons, " + this.moonlets + " moonlets" : "");
        } else if ((this.giantMoons ?? 0) === 0 && (this.largeMoons ?? 0) !== 0) {
            return this.largeMoons + " large moons, " + this.mediumMoons + " medium moons" +
                (this.ring?.id !== RingType.AsteroidBelt ? ", " + this.smallMoons + " small moons, " + this.moonlets + " moonlets" : "");
        } else if ((this.giantMoons ?? 0) !== 0) {
            return this.giantMoons + " giant moons, " + this.largeMoons + " large moons, " + this.mediumMoons + " medium moons" +
                (this.ring?.id !== RingType.AsteroidBelt ? ", " + this.smallMoons + " small moons, " + this.moonlets + " moonlets" : "");
        } else {
            return "None";
        }
    }

    get attributeList() {
        let result = [];
        result.push(new WorldAttribute("Satellites", this.satelliteDetails));
        if (this.ring != null) {
            result.push(new WorldAttribute("Ring", this.ring.name));
        }
        return result;
    }
}

export class StandardWorldDetails extends WorldDetails {
    tidallyLocked: boolean;
    retrograde: boolean;
    rotationPeriod: number;
    hydrographicPercentage: number;
    axialTilt: number;

    plainText() {
        return (this.rotationPeriod ? ("\nRotation: " + (this.tidallyLocked
                ? "Tidally Locked"
                : (this.rotationPeriod.toFixed(2) + " hours" + (this.retrograde ? " (Retrograde)" : "")))) : "") +
            (this.axialTilt != null ? "\nAxial Tilt: " + this.axialTilt.toFixed(2) + " deg" : "") +
            (this.hydrographicPercentage != null ? "\nWater Coverage: " + this.hydrographicPercentage.toFixed(2) + '%' : "");
    }

    get attributeList() {
        let result = [];
        if (this.tidallyLocked != null) {
            result.push(new WorldAttribute("Rotation", "Tidally Locked"));
        } else if (this.rotationPeriod) {
            result.push(new WorldAttribute("Rotation", this.rotationPeriod.toFixed(2) + " hours" + (this.retrograde ? " (Retrograde)" : "")));
        }
        if (this.axialTilt != null) {
            result.push(new WorldAttribute("Axial Tilt", this.axialTilt.toFixed(2) + '\u{b0}'));
        }
        if (this.hydrographicPercentage != null) {
            result.push(new WorldAttribute("Water Coverage", this.hydrographicPercentage.toFixed(2) + '%'));
        }
        return result;
    }
}

export class WorldAttribute {
    readonly name: string;
    readonly value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}

export class World {

    orbitNumber: number;
    worldClass: WorldClassModel;
    orbit: number;
    satelliteOrbit?: number;
    numberOfSatellites: number;
    orbitalRadius: number = 0;
    satelliteOrbitalRadius?: number;
    period: number;
    worldDetails?: AsteroidBeltDetails|StandardWorldDetails|GasGiantDetails;
    diameter?: number;
    density?: number;
    coreType?: WorldCoreType;
    gravity?: number;
    notes: string[] = [];
    features: string[] = [];

    get isSatellite() {
        return this.satelliteOrbit != null;
    }

    get orbitId() {
        return '' + this.orbitNumber + (this.satelliteOrbit == null ? '' : (ALPHABET.charAt(this.satelliteOrbit)));
    }

    get mass() {
        if (this.diameter != null && this.density != null) {
            return (this.density * Math.pow(this.diameter / 12750, 3));
        } else {
            return undefined;
        }
    }

    constructor(worldClass: WorldClassModel, orbit?: number) {
        this.worldClass = worldClass;
        this.orbit = orbit;
    }

    get orbitLabel() {
        return this.orbit == null ? undefined : (RomanNumerals[this.orbit] + (this.satelliteOrbit == null ? '' : (ALPHABET.charAt(this.satelliteOrbit))));
    }

    get plainText() {
        return (this.orbitLabel ? "\nDesignation: " + this.orbitLabel : "") +
            (this.worldClass ? "\nClassification: " +  (this.worldClass.id === WorldClass.AsteroidBelt
                ? "Asteroid Belt"
                : ("Class " + WorldClass[this.worldClass.id] + " (" + this.worldClass.description + ")")) : "") +
            (this.worldClass.id !== WorldClass.AsteroidBelt ? "\nNumber of satellites: " + this.numberOfSatellites : "") +
            "\nOrbital Radius: " + this.orbitalRadius.toFixed(2) + " AUs" +
            "\nOrbital Period: " + this.period.toFixed(3) + " Earth Years" +
            (this.diameter != null ? ("\nDiameter: " + Math.round(this.diameter).toLocaleString("en-US") + " km") : "") +
            (this.density != null ? ("\nDensity: " + this.density.toFixed(2) + " Earth") : "") +
            (this.mass != null ? ("\nMass: " + (this.mass >= 1000 ? Math.round(this.mass).toLocaleString("en-US") : this.mass.toFixed(2)) + " Earth") : "") +
            (this.gravity != null ? ("\nGravity: " + this.gravity.toFixed(2) + " G") : "" ) +
            (this.worldDetails != null ? this.worldDetails.plainText() : "") +
            (this.coreType != null ? ("\nCore: " + WorldCoreType[this.coreType]) : "");
    }

    get attributeList() {
        let result = [];
        if (this.orbitLabel != null) {
            result.push(new WorldAttribute("Designation", this.orbitLabel));
        }

        if (this.worldClass.id === WorldClass.AsteroidBelt) {
            result.push(new WorldAttribute("Classification", "Asteroid Belt"));
        } else if (this.worldClass.id === WorldClass.ArtificialPlanet) {
            result.push(new WorldAttribute("Classification", "Artificial Planet"));
        } else {
            result.push(new WorldAttribute("Classification", "Class " + WorldClass[this.worldClass.id] + " (" + this.worldClass.description + ")"));
        }

        if (this.notes?.length) {
            result.push(new WorldAttribute("Notes", this.notes.join(', ')));
        }

        if (this.isSatellite) {
            result.push(new WorldAttribute("Orbital Radius", Math.round(this.satelliteOrbitalRadius).toLocaleString("en-US") + " km"));
            if (this.period != null) {
                result.push(new WorldAttribute("Orbital Period", this.period.toFixed(3) + " Earth Years"));
            }
        } else {
            result.push(new WorldAttribute("Orbital Radius", this.orbitalRadius.toFixed(2) + " AUs"));
            if (this.period != null) {
                result.push(new WorldAttribute("Orbital Period", this.period.toFixed(3) + " Earth Years"));
            }
        }

        if (this.diameter != null) {
            result.push(new WorldAttribute("Diameter", Math.round(this.diameter).toLocaleString("en-US") + " km"));
        }
        if (this.density != null) {
            result.push(new WorldAttribute("Density", this.density.toFixed(2) + " Earth"));
        }
        if (this.mass != null) {
            result.push(new WorldAttribute("Mass", this.mass.toFixed(2) + " Earth"));
        }
        if (this.gravity != null) {
            result.push(new WorldAttribute("Gravity", this.gravity.toFixed(2) + " G"));
        }

        if (this.worldDetails != null) {
            this.worldDetails.attributeList?.forEach(a => result.push(a));
        }

        if (this.numberOfSatellites != null && this.worldClass.id !== WorldClass.AsteroidBelt) {
            result.push(new WorldAttribute("Satellites", this.numberOfSatellites.toFixed(0)));
        }
        if (this.coreType != null) {
            result.push(new WorldAttribute("Core", WorldCoreType[this.coreType]));
        }

        if (this.features?.length) {
            result.push(new WorldAttribute("Features", this.features.join(", ")));
        }
        return result;
    }
}