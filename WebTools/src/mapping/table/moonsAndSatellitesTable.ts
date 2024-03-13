import { D20 } from "../../common/die"
import { TableRoll } from "../../common/tableRoll"

export const numberOfMoonsTable: TableRoll<number> = () => {

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
        case 10:
            return 1;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
            return 2;
        case 16:
        case 17:
            return 3;
        case 18:
        case 19:
            return 4;
        case 20:
        default:
            return 5;
    }
}

