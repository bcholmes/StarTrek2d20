import { CharacterType } from "../../common/characterType";
import { D20 } from "../../common/die";
import { Track } from "../../helpers/trackEnum";

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

export const EducationTrackRandomTable = (type: CharacterType) => {
    let roll = D20.roll();
    switch (type) {
        case CharacterType.Starfleet: {
            switch (roll) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    return Track.Command;
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    return Track.Sciences;
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                default:
                    return Track.Operations;
            }
        }
        case CharacterType.AlliedMilitary: {
            switch (roll) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    return Track.RankAndFile;
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    return Track.Officer;
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    return Track.IntelligenceTraining;
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                default:
                    return Track.MilitiaAndGuerillas;
            }
        }
        case CharacterType.AmbassadorDiplomat: {
            switch (roll) {
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
                    return Track.DiplomaticCorps;
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                default:
                    return Track.HonoraryStatus;
            }
        }
        case CharacterType.Civilian:
        default: {
            while (true) {
                switch (roll) {
                    case 1:
                    case 2:
                    case 3:
                        return Track.FreightAndTransport;
                    case 4:
                    case 5:
                    case 6:
                        return Track.LawEnforcement;
                    case 7:
                    case 8:
                    case 9:
                        return Track.Physician;
                    case 10:
                    case 11:
                    case 12:
                        return Track.PoliticianOrBureaucrat;
                    case 13:
                    case 14:
                    case 15:
                        return Track.ScientificOrTechnicalExpert;
                    case 16:
                    case 17:
                    case 18:
                        return Track.TraderOrMerchant;
                    case 19:
                    case 20:
                    default:
                        roll = D20.roll();
                }
            }
        }
    }
}