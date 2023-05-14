import { Species } from "../../helpers/speciesEnum";
import { BodyType } from "./bodyTypeEnum";
import { EyeType } from "./eyeTypeEnum";
import { HairType } from "./hairTypeEnum";
import { HeadType } from "./headTypeEnum";
import { MouthType } from "./mouthTypeEnum";
import { NasoLabialFoldType } from "./nasoLabialFoldTypeEnum";
import { NoseType } from "./noseTypeEnum";
import { RankIndicator } from "./rankIndicatorEnum";
import { UniformEra } from "./uniformEra";

export interface Token {
    species: Species;
    divisionColor: string;
    skinColor: string;
    headType: HeadType;
    rankIndicator: RankIndicator;
    noseType: NoseType;
    nasoLabialFold: NasoLabialFoldType;
    hairType: HairType;
    uniformEra: UniformEra;
    bodyType: BodyType;
    hairColor: string;
    eyeColor: string;
    eyeType: EyeType;
    mouthType: MouthType;
}
