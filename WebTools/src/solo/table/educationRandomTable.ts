import { CharacterType } from "../../common/characterType";
import { D20 } from "../../common/die";

export const EducationCategoryRandomTable = () => {
    let roll = D20.roll();
    switch (roll) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            return CharacterType.Starfleet;
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return CharacterType.AlliedMilitary;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
            return CharacterType.AmbassadorDiplomat;
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        default:
            return CharacterType.Civilian;
    }
}