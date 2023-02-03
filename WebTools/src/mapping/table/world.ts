import { D20, D6 } from "../../common/die";

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
}

export class GasGiantDetails extends WorldDetails {
    moonlets?: number;
    smallMoons?: number;
    mediumMoons?: number;
    largeMoons?: number;
    giantMoons?: number;

    ring?: string = "None";

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
        result.ring = "Faint Ring";
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
        result.ring = "Spectacular Ring";
        return result;
    }

    public static createOortBelt(gasGiant: World) {
        let result = this.createBasicDistributionOfMoons(gasGiant);
        result.ring = "Oort Belt of slush balls";
        return result;
    }

    public static createAsteroidBelt(gasGiant: World) {
        let result = this.createBasicDistributionOfMoons(gasGiant);
        result.ring = "Asteroid Belt of small moons and moonlets";
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
}

export class World {

    worldClass: WorldClassModel;
    orbit: number;
    numberOfSatellites: number;
    orbitalRadius: number = 0;
    period: number;
    worldDetails?: AsteroidBeltDetails|StandardWorldDetails|GasGiantDetails;
    diameter?: number;
    density?: number;
    coreType?: WorldCoreType;
    gravity?: number;

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
        return this.orbit == null ? undefined : RomanNumerals[this.orbit];
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
            (this.mass != null ? ("\nMass: " + this.mass.toFixed(2) + " Earth") : "") +
            (this.gravity != null ? ("\nGravity: " + this.gravity.toFixed(2) + " G") : "" ) +
            (this.worldDetails != null ? this.worldDetails.plainText() : "") +
            (this.coreType != null ? ("\nCore: " + WorldCoreType[this.coreType]) : "");
    }
}