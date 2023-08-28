import { D20 } from "../../common/die";
import { Environment } from "../../helpers/environments";

export const EnvironmentSettingRandomTable = () => {
    let roll = D20.roll();
    switch (roll) {
        case 1:
        case 2:
        case 3:
        case 4:
            return Environment.Homeworld;
        case 5:
        case 6:
        case 7:
        case 8:
            return Environment.BusyColony;
        case 9:
        case 10:
        case 11:
        case 12:
            return Environment.IsolatedColony;
        case 13:
        case 14:
        case 15:
            return Environment.FrontierColony;
        case 16:
        case 17:
        case 18:
            return Environment.StarshipOrStarbase;
        default:
            return Environment.AnotherSpeciesWorld;
    }
}

export const EnvironmentConditionRandomTable = () => {
    let roll = D20.roll();
    switch (roll) {
        case 1:
        case 2:
        case 3:
        case 4:
            return Environment.UtopianParadise;
        case 5:
        case 6:
        case 7:
        case 8:
            return Environment.Cosmopolitan;
        case 9:
        case 10:
        case 11:
        case 12:
            return Environment.RigorousDiscipline;
        case 13:
        case 14:
        case 15:
            return Environment.AscetismAndIntrospection;
        case 16:
        case 17:
        case 18:
            return Environment.StruggleAndHardship;
        default:
            return Environment.OccupationOrWar;
    }
}