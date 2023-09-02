import { D20 } from "../../common/die";
import { EarlyOutlook } from "../../helpers/upbringings";

export const EarlyOutlookUpbringingRandomTable = () => {
    let roll = D20.roll();
    while (true) {
        switch (roll) {
            case 1:
            case 2:
            case 3:
                return EarlyOutlook.MilitaryOrExploration;
            case 4:
            case 5:
            case 6:
                return EarlyOutlook.BusinessOrTrade;
            case 7:
            case 8:
            case 9:
                return EarlyOutlook.AgricultureOrRural;
            case 10:
            case 11:
            case 12:
                return EarlyOutlook.ScienceAndTechnology;
            case 13:
            case 14:
            case 15:
                return EarlyOutlook.ArtisticAndCreative;
            case 16:
            case 17:
            case 18:
                return EarlyOutlook.DiplomacyAndPolitics;
            default:
                roll = D20.roll();
        }
    }
}

export const EarlyOutlookCasteRandomTable = () => {
    let roll = D20.roll();
    while (true) {
        switch (roll) {
            case 1:
            case 2:
            case 3:
                return EarlyOutlook.WarriorCaste;
            case 4:
            case 5:
            case 6:
                return EarlyOutlook.MerchantCaste;
            case 7:
            case 8:
            case 9:
                return EarlyOutlook.AgriculturalCaste;
            case 10:
            case 11:
            case 12:
                return EarlyOutlook.ScientificCaste;
            case 13:
            case 14:
            case 15:
                return EarlyOutlook.ArtisticCaste;
            case 16:
            case 17:
            case 18:
                return EarlyOutlook.AcademicCaste;
            default:
                roll = D20.roll();
        }
    }
}

export const EarlyOutlookAspirationRandomTable = () => {
    let roll = D20.roll();
    while (true) {
        switch (roll) {
            case 1:
            case 2:
            case 3:
                return EarlyOutlook.ToExplore;
            case 4:
            case 5:
            case 6:
                return EarlyOutlook.ToFly;
            case 7:
            case 8:
            case 9:
                return EarlyOutlook.ToCreate;
            case 10:
            case 11:
            case 12:
                return EarlyOutlook.ToDiscover;
            case 13:
            case 14:
            case 15:
                return EarlyOutlook.ToProtect;
            case 16:
            case 17:
            case 18:
                return EarlyOutlook.ToProsper;
            default:
                roll = D20.roll();
        }
    }
}