import { D20 } from "../../common/die";
import i18next from "i18next";
import { AtmosphereDetails } from "./atmosphereTable";
import { WorldClass, WorldClassModel } from "./worldClass";
import { WorldAttribute } from "./worldAttribute";

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export enum WorldCoreType {
    Heavy, Molten, Rocky, Icy
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
            result.push(new WorldAttribute(i18next.t("World.attribute.predominantSize"), (this.asteroidSize >= 1000 ? ((this.asteroidSize / 1000).toFixed(0) + "km") : (this.asteroidSize.toFixed(0) + "m")) + " Diameter"));
        }
        if (this.depth != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.beltWidth"), this.depth.toFixed(2) + " AUs"));
        }

        if (this.nickelIronPercent > 0) {
            result.push(new WorldAttribute("Inner Belt", (this.nickelIronPercent * this.depth).toFixed(2) + " AUs (nickel-iron)"));
        }
        result.push(new WorldAttribute("Mixed Belt", (this.mixedPercent * this.depth).toFixed(2) + " AUs (mixed)"));
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
        result.push(new WorldAttribute(i18next.t("World.attribute.satellites"), this.satelliteDetails));
        if (this.ring != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.ring"), this.ring.name));
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
    atmosphereDetails: AtmosphereDetails;

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
            result.push(new WorldAttribute(i18next.t("World.attribute.rotation"), i18next.t("World.attribute.tidallyLocked")));
        } else if (this.rotationPeriod) {
            result.push(new WorldAttribute(i18next.t("World.attribute.rotation"), this.rotationPeriod.toFixed(2) + " hours" + (this.retrograde ? " (" + i18next.t("World.attribute.retrograde") + ")" : "")));
        }
        if (this.axialTilt != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.axialTilt"), this.axialTilt.toFixed(2) + '\u{b0}'));
        }
        if (this.hydrographicPercentage != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.waterCoverage"), this.hydrographicPercentage.toFixed(2) + '%'));
        }

        if (this.atmosphereDetails != null) {
            this.atmosphereDetails.attributeList.forEach(a => result.push(a));
        }

        return result;
    }
}



export class World {

    name?: string;
    orbitNumber: number;
    worldClass: WorldClassModel;
    orbit: number;
    satelliteOrbit?: number;
    numberOfSatellites: number;
    orbitalRadius: number = 0;
    satelliteOrbitalRadius?: number;
    orbitalEccentricity?: number;
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
            result.push(new WorldAttribute(i18next.t("World.attribute.designation"), this.orbitLabel));
        }
        if (this.name != null) {
            result.push(new WorldAttribute("Name", this.name));
        }

        if (this.worldClass.id === WorldClass.AsteroidBelt) {
            result.push(new WorldAttribute(i18next.t("World.attribute.classification"), "Asteroid Belt"));
        } else if (this.worldClass.id === WorldClass.ArtificialPlanet) {
            result.push(new WorldAttribute(i18next.t("World.attribute.classification"), "Artificial Planet"));
        } else {
            result.push(new WorldAttribute(i18next.t("World.attribute.classification"), i18next.t('World.class.fullDescription', {
                class: WorldClass[this.worldClass.id],
                definition: this.worldClass.description,
                interpolation: { escapeValue: false }
            })));
        }

        if (this.notes?.length) {
            result.push(new WorldAttribute(i18next.t("World.attribute.notes"), this.notes.join(', ')));
        }

        if (this.isSatellite) {
            result.push(new WorldAttribute(i18next.t("World.attribute.orbitalRadius"), Math.round(this.satelliteOrbitalRadius).toLocaleString("en-US") + " km"));
            if (this.period != null) {
                result.push(new WorldAttribute(i18next.t("World.attribute.orbitalPeriod"), this.period.toFixed(3) + " Earth Years"));
            }
        } else {
            result.push(new WorldAttribute(i18next.t("World.attribute.orbitalRadius"), this.orbitalRadius.toFixed(2) + " AUs"));
            if (this.period != null) {
                result.push(new WorldAttribute(i18next.t("World.attribute.orbitalPeriod"), this.period.toFixed(3) + " Earth Years"));
            }
        }
        if (this.orbitalEccentricity != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.eccentricity"), this.orbitalEccentricity.toFixed(3)));
        }

        if (this.diameter != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.diameter"), Math.round(this.diameter).toLocaleString("en-US") + " km"));
        }
        if (this.density != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.density"), this.density.toFixed(2) + " Earth"));
        }
        if (this.mass != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.mass"), (this.mass > 1000 ? Math.round(this.mass).toLocaleString("en-US") : this.mass.toFixed(2)) + " Earth"));
        }
        if (this.gravity != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.gravity"), this.gravity.toFixed(2) + " G"));
        }

        if (this.worldDetails != null) {
            this.worldDetails.attributeList?.forEach(a => result.push(a));
        }

        if (this.numberOfSatellites != null && this.worldClass.id !== WorldClass.AsteroidBelt) {
            result.push(new WorldAttribute(i18next.t("World.attribute.satellites"), this.numberOfSatellites.toFixed(0)));
        }
        if (this.coreType != null) {
            result.push(new WorldAttribute(i18next.t("World.attribute.core"), WorldCoreType[this.coreType]));
        }

        if (this.features?.length) {
            result.push(new WorldAttribute(i18next.t("World.attribute.features"), this.features.join(", ")));
        }
        return result;
    }
}