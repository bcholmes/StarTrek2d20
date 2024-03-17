import i18next from "i18next";
import { D20 } from "../../common/die";
import { WorldAttribute } from "./worldAttribute";
import { WorldClass } from "./worldClass";
import { makeKey } from "../../common/translationKey";

export enum AtmosphereType {
    Vacuum,
    StandardOxygenNitrogenMix,
    OxygenArgonMix,
    HydrogenCompoundsAndReactiveGases,
    CarbonDioxide,
    ToxicChemicals,
}

export enum AtmosphericDensityType {
    VeryThin,
    Thin,
    Standard,
    Dense,
    VeryDense,
}

export enum AtmosphericContaminantType {
    BacteriaOrViruses,
    UnusualGases,
    HighOxygen,
    Pollutants,
    SulfurCompounds,
    Radioactives,
    LowOxygen,
    AcidRain,
    CorrosiveGases,
    IrritantPollens
}

export class AtmosphereDetails {
    readonly type: AtmosphereType
    density: AtmosphericDensityType;
    contaiminants: AtmosphericContaminantType[];

    constructor(type: AtmosphereType) {
        this.type = type;
    }

    get attributeList(): WorldAttribute[] {
        let result = [];
        result.push(new WorldAttribute(i18next.t('World.attribute.atmosphereType'),
            i18next.t(makeKey('World.atmosphereType.', AtmosphereType[this.type]))));

        if (this.density != null) {
            result.push(new WorldAttribute(i18next.t('World.attribute.atmosphericDensity'),
                i18next.t(makeKey('World.atmosphericDensity.', AtmosphericDensityType[this.density]))));
        }

        if (this.contaiminants?.length) {
            result.push(new WorldAttribute(i18next.t('World.attribute.atmosphericContaminants'),
                this.contaiminants.map(c => i18next.t(makeKey('World.atmosphericContaminant.', AtmosphericContaminantType[c]))).join(", ")));
        }

        return result;
    }
}

export const atmosphereTable = (worldClass: WorldClass) => {

    switch (worldClass) {
        case WorldClass.D:
            return atmosphereTableClassD();

        case WorldClass.E:
            return atmosphereTableClassE();

        case WorldClass.K:
            return atmosphereTableClassK();

        case WorldClass.L:
            return atmosphereTableClassL();

        case WorldClass.M:
        case WorldClass.O:
            return atmosphereTableClassM();

        case WorldClass.Y:
            return atmosphereTableClassY();


        default:
            return null;
    }
}

const atmosphereTableClassD = () => {
    return new AtmosphereDetails(AtmosphereType.Vacuum);
}

const atmosphereTableClassY = () => {
    return new AtmosphereDetails(AtmosphereType.ToxicChemicals);
}

const atmosphereTableClassE = () => {
    return new AtmosphereDetails(AtmosphereType.HydrogenCompoundsAndReactiveGases);
}

const atmosphereTableClassK = () => {
    let result = new AtmosphereDetails(AtmosphereType.StandardOxygenNitrogenMix);
    result.density = D20.roll() <= 10 ? AtmosphericDensityType.VeryThin : AtmosphericDensityType.Thin;
    return result;
}

const atmosphereTableClassL = () => {
    let result = new AtmosphereDetails(AtmosphereType.OxygenArgonMix);
    result.density = D20.roll() <= 10 ? AtmosphericDensityType.VeryThin : AtmosphericDensityType.Thin;
    return result;
}

const atmosphereTableClassM = () => {

    let result = new AtmosphereDetails(AtmosphereType.StandardOxygenNitrogenMix);

    switch (D20.roll()) {
        case 1:
        case 2:
            result.density = AtmosphericDensityType.VeryThin;
            break;
        case 3:
        case 4:
        case 5:
        case 6:
            result.density = AtmosphericDensityType.Thin;
            break;
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
            result.density = AtmosphericDensityType.Standard;
            break;
        case 15:
        case 16:
        case 17:
        case 18:
            result.density = AtmosphericDensityType.Dense;
            break;
        case 19:
        case 20:
            result.density = AtmosphericDensityType.VeryDense;
            break;
    }

    result.contaiminants = atmosphericContaminantTable();

    return result;
}

const atmosphericContaminantTable = () => {

    switch (D20.roll()) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            return [];
        case 10:
            return [AtmosphericContaminantType.BacteriaOrViruses]
        case 11:
            return [AtmosphericContaminantType.UnusualGases]
        case 12:
            return [AtmosphericContaminantType.HighOxygen]
        case 13:
            return [AtmosphericContaminantType.Pollutants]
        case 14:
            return [AtmosphericContaminantType.SulfurCompounds]
        case 15:
            return [AtmosphericContaminantType.Radioactives]
        case 16:
            return [AtmosphericContaminantType.LowOxygen]
        case 17:
            return [AtmosphericContaminantType.AcidRain]
        case 18:
            return [AtmosphericContaminantType.CorrosiveGases]
        case 19:
            return [AtmosphericContaminantType.IrritantPollens]
        case 20:
            let result = atmosphericContaminantTable();
            let more = atmosphericContaminantTable();
            more.forEach(c => {
                if (result.indexOf(c) < 0 ) {
                    if (c === AtmosphericContaminantType.LowOxygen && result.indexOf(AtmosphericContaminantType.HighOxygen) >= 0) {
                        // skip it
                    } else if (c === AtmosphericContaminantType.HighOxygen && result.indexOf(AtmosphericContaminantType.LowOxygen) >= 0) {
                        // skip it
                    } else {
                        result.push(c);
                    }
                }
            });
            return result;
    }
}