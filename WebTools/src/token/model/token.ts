import { Rank } from "../../helpers/ranks";
import { Species } from "../../helpers/speciesEnum";
import { BodyType } from "./bodyTypeEnum";
import { ExtraType } from "./extrasTypeEnum";
import { EyeType } from "./eyeTypeEnum";
import { FacialHairType } from "./facialHairEnum";
import { HairType } from "./hairTypeEnum";
import { HeadType } from "./headTypeEnum";
import { MouthType } from "./mouthTypeEnum";
import { NasoLabialFoldType } from "./nasoLabialFoldTypeEnum";
import { NoseType } from "./noseTypeEnum";
import { SpeciesOption } from "./speciesOptionEnum";
import { UniformEra } from "./uniformEra";
import { UniformVariantType } from "./uniformVariantTypeEnum";

export interface Token {
    species: Species;
    divisionColor: string;
    skinColor: string;
    headType: HeadType;
    rankIndicator: Rank;
    noseType: NoseType;
    nasoLabialFold: NasoLabialFoldType;
    hairType: HairType;
    uniformEra: UniformEra;
    bodyType: BodyType;
    hairColor: string;
    eyeColor: string;
    eyeType: EyeType;
    mouthType: MouthType;
    lipstickColor: string;
    facialHairType: FacialHairType[];
    speciesOption: SpeciesOption;
    extras: ExtraType[];
    variant: UniformVariantType;
}
