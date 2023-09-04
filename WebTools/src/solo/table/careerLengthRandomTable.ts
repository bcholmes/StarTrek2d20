import { D20 } from "../../common/die";
import { Career } from "../../helpers/careerEnum";

export const CareerLengthRandomTable = () => {
    let roll = D20.roll();
    switch (roll) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return Career.Young;
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
            return Career.Experienced;
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        default:
            return Career.Veteran;
    }
}