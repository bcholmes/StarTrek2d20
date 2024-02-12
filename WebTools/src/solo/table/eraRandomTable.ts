import { D20 } from "../../common/die"
import { TableRoll } from "../../common/tableRoll";
import { Era } from "../../helpers/eras";

export const eraRandomTable: TableRoll<Era> = () => {
    let roll = D20.roll();
    let era = null;

    while (era == null) {
        switch (roll) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                era = Era.Enterprise;
                break;
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
                era = Era.OriginalSeries;
                break;
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
                era = Era.NextGeneration;
                break;
            default:
                roll = D20.roll();
        }
    }
    return era;
}

export const eraRandomTableForStarships: TableRoll<Era> = () => {
    let roll = D20.roll();
    let era = null;

    while (era == null) {
        switch (roll) {
            case 1:
            case 2:
            case 3:
            case 4:
                era = Era.Enterprise;
                break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                era = Era.OriginalSeries;
                break;
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
                era = Era.NextGeneration;
                break;
            case 15:
            case 16:
            case 17:
            case 18:
                era = Era.PicardProdigy;
                break;
            default:
                era = Era.Discovery32;
                break;
        }
    }
    return era;
}