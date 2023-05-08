import { Species } from "../../helpers/speciesEnum";
import { HairType } from "./hairTypeEnum";
import { HeadType } from "./headTypeEnum";
import { RankIndicator } from "./rankIndicatorEnum";

export interface Token {
    species: Species;
    divisionColor: string;
    skinColor: string;
    headType: HeadType;
    rankIndicator: RankIndicator;
    hairType: HairType;
    hairColor: string;
}
