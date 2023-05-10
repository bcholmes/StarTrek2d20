import { Species } from "../../helpers/speciesEnum";
import { HairType } from "./hairTypeEnum";
import { HeadType } from "./headTypeEnum";
import { MouthType } from "./mouthTypeEnum";
import { NoseType } from "./noseTypeEnum";
import { RankIndicator } from "./rankIndicatorEnum";

export interface Token {
    species: Species;
    divisionColor: string;
    skinColor: string;
    headType: HeadType;
    rankIndicator: RankIndicator;
    noseType: NoseType;
    hairType: HairType;
    hairColor: string;
    eyeColor: string;
    mouthType: MouthType;
}
