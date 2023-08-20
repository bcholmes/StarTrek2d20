import { D20 } from "../common/die"
import { Era } from "../helpers/eras";

export const eraRandomTable = () => {

    let roll = D20.roll();

    switch (roll) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return Era.Enterprise;
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
            return Era.OriginalSeries;
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
            return Era.NextGeneration;
        default:
            return eraRandomTable();
    }
}