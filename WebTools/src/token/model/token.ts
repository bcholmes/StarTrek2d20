import { Species } from "../../helpers/speciesEnum";
import { HairType } from "./hairTypeEnum";
import { RankIndicator } from "./rankIndicatorEnum";

export interface Token {
    species: Species;
    divisionColor: string;
    skinColor: string;
    rankIndicator: RankIndicator;
    hairType: HairType;
}
