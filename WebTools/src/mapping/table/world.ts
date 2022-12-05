import { WorldCoreType } from "../view/worldView";

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
            (this.asteroidSize != null ? "\nPredominant Size: " + this.depth + "m Diameter" : "");
    }
}

export class StandardWorldDetails extends WorldDetails {
    tidallyLocked: boolean;
    retrograde: boolean;
    rotationPeriod: number;
    hydrographicPercentage: number;
    axialTilt: number;

    plainText() {
        return (this.hydrographicPercentage != null ? "\nWater Coverage: " + this.hydrographicPercentage.toFixed(2) + '%' : "") +
            (this.rotationPeriod ? ("\nRotation: " + (this.tidallyLocked
                ? "Tidally Locked"
                : (this.rotationPeriod.toFixed(2) + " hours" + (this.retrograde ? " (Retrograde)" : "")))) : "") +
            (this.axialTilt != null ? "\nAxial Tilt: " + this.axialTilt.toFixed(2) + " deg" : "");
    }
}

export class World {

    worldClass: WorldClassModel;
    orbit: number;
    numberOfSatellites: number;
    orbitalRadius: number = 0;
    period: number;
    worldDetails?: AsteroidBeltDetails|StandardWorldDetails;
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
        return "Class: " + this.worldClass.description +
            (this.orbitLabel ? "\nDesignation: " + this.orbitLabel : "") +
            (this.worldClass.id !== WorldClass.AsteroidBelt ? "\nNumber of satellites: " + this.numberOfSatellites : "") +
            "\nOrbital Radius: " + this.orbitalRadius.toFixed(2) + " AUs" +
            "\nOrbital Period: " + this.period.toFixed(3) + " Earth Years" +
            (this.diameter != null ? ("\nDiameter: " + Math.round(this.diameter).toLocaleString("en-US") + " km") : "") +
            (this.density != null ? ("\nDensity: " + this.density.toFixed(3) + " Earth") : "") +
            (this.mass != null ? ("\nMass: " + this.mass.toFixed(3) + " Earth") : "") +
            (this.gravity != null ? ("\nGravity: " + this.gravity.toFixed(2) + " G") : "" ) +
            (this.worldDetails != null ? this.worldDetails.plainText() : "") +
            (this.coreType != null ? ("\nCore: " + WorldCoreType[this.coreType]) : "");
    }
}