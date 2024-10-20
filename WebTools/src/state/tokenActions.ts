import { Rank } from "../helpers/ranks";
import { Species } from "../helpers/speciesEnum";
import { BodyType } from "../token/model/bodyTypeEnum";
import { ExtraType } from "../token/model/extrasTypeEnum";
import { EyeType } from "../token/model/eyeTypeEnum";
import { FacialHairType } from "../token/model/facialHairEnum";
import { HairType } from "../token/model/hairTypeEnum";
import { HeadType } from "../token/model/headTypeEnum";
import { MouthType } from "../token/model/mouthTypeEnum";
import { NasoLabialFoldType } from "../token/model/nasoLabialFoldTypeEnum";
import { NoseType } from "../token/model/noseTypeEnum";
import { SpeciesOption } from "../token/model/speciesOptionEnum";
import { UniformEra } from "../token/model/uniformEra";
import { UniformVariantType } from "../token/model/uniformVariantTypeEnum";

export const SET_TOKEN_SPECIES = 'SET_TOKEN_SPECIES';
export const SET_TOKEN_SPECIES_OPTION = 'SET_TOKEN_SPECIES_OPTION';
export const SET_TOKEN_UNIFORM_ERA = 'SET_TOKEN_UNIFORM_ERA';
export const SET_TOKEN_DIVISION_COLOR = 'SET_TOKEN_DIVISION_COLOR';
export const SET_TOKEN_SKIN_COLOR = 'SET_TOKEN_SKIN_COLOR';
export const SET_TOKEN_RANK = 'SET_TOKEN_RANK';
export const SET_TOKEN_HAIR_TYPE = 'SET_TOKEN_HAIR_TYPE';
export const SET_TOKEN_HAIR_COLOR = 'SET_TOKEN_HAIR_COLOR';
export const SET_TOKEN_HEAD_TYPE = 'SET_TOKEN_HEAD_TYPE';
export const SET_TOKEN_EYE_COLOR = 'SET_TOKEN_EYE_COLOR';
export const SET_TOKEN_NASO_LABIAL_FOLD_TYPE = 'SET_TOKEN_NASO_LABIAL_FOLD_TYPE';
export const SET_TOKEN_NOSE_TYPE = 'SET_TOKEN_NOSE_TYPE';
export const SET_TOKEN_MOUTH_TYPE = 'SET_TOKEN_MOUTH_TYPE';
export const SET_TOKEN_BODY_TYPE = 'SET_TOKEN_BODY_TYPE';
export const SET_TOKEN_UNIFORM_VARIANT_TYPE = 'SET_TOKEN_UNIFORM_VARIANT_TYPE';
export const SET_TOKEN_EYE_TYPE = 'SET_TOKEN_EYE_TYPE';
export const SET_TOKEN_LIPSTICK_COLOR = 'SET_TOKEN_LIPSTICK_COLOR';
export const SET_TOKEN_FACIAL_HAIR_TYPE = 'SET_TOKEN_FACIAL_HAIR_TYPE';
export const SET_TOKEN_EXTRAS_TYPE = 'SET_TOKEN_EXTRAS_TYPE';

export function setTokenSpecies(species: Species) {
    let payload = { species: species };
    return {
       type: SET_TOKEN_SPECIES,
       payload: payload
    }
}

export function setUniformEra(era: UniformEra) {
    let payload = { era: era };
    return {
       type: SET_TOKEN_UNIFORM_ERA,
       payload: payload
    }
}

export function setTokenDivisionColor(color: string) {
    let payload = { color: color };
    return {
       type: SET_TOKEN_DIVISION_COLOR,
       payload: payload
    }
}

export function setTokenRank(rank: Rank) {
    let payload = { rank: rank };
    return {
       type: SET_TOKEN_RANK,
       payload: payload
    }
}

export function setTokenSkinColor(color: string) {
    let payload = { color: color };
    return {
       type: SET_TOKEN_SKIN_COLOR,
       payload: payload
    }
}

export function setTokenEyeColor(color: string) {
    let payload = { color: color };
    return {
       type: SET_TOKEN_EYE_COLOR,
       payload: payload
    }
}

export function setTokenHairColor(color: string) {
    let payload = { color: color };
    return {
       type: SET_TOKEN_HAIR_COLOR,
       payload: payload
    }
}

export function setTokenLipstickColor(color: string) {
    let payload = { color: color };
    return {
       type: SET_TOKEN_LIPSTICK_COLOR,
       payload: payload
    }
}

export function setTokenHairType(hairType: HairType) {
    let payload = { hairType: hairType };
    return {
       type: SET_TOKEN_HAIR_TYPE,
       payload: payload
    }
}

export function setTokenHeadType(headType: HeadType) {
    let payload = { headType: headType };
    return {
       type: SET_TOKEN_HEAD_TYPE,
       payload: payload
    }
}

export function setTokenMouthType(mouthType: MouthType) {
    let payload = { mouthType: mouthType };
    return {
       type: SET_TOKEN_MOUTH_TYPE,
       payload: payload
    }
}

export function setTokenEyeType(eyeType: EyeType) {
    let payload = { eyeType: eyeType };
    return {
       type: SET_TOKEN_EYE_TYPE,
       payload: payload
    }
}

export function setTokenNoseType(noseType: NoseType) {
    let payload = { noseType: noseType };
    return {
       type: SET_TOKEN_NOSE_TYPE,
       payload: payload
    }
}

export function setTokenBodyType(type: BodyType) {
    let payload = { type: type };
    return {
       type: SET_TOKEN_BODY_TYPE,
       payload: payload
    }
}

export function setTokenUniformVariantType(type: UniformVariantType) {
    let payload = { type: type };
    return {
       type: SET_TOKEN_UNIFORM_VARIANT_TYPE,
       payload: payload
    }
}

export function setTokenFacialHairTypes(types: FacialHairType[]) {
    let payload = { types: types };
    return {
       type: SET_TOKEN_FACIAL_HAIR_TYPE,
       payload: payload
    }
}

export function setTokenExtrasTypes(types: ExtraType[]) {
    let payload = { types: types };
    return {
       type: SET_TOKEN_EXTRAS_TYPE,
       payload: payload
    }
}

export function setTokenNasoLabialFoldType(type: NasoLabialFoldType) {
    let payload = { type: type };
    return {
       type: SET_TOKEN_NASO_LABIAL_FOLD_TYPE,
       payload: payload
    }
}

export function setTokenSpeciesOption(option: SpeciesOption) {
    let payload = { option: option };
    return {
       type: SET_TOKEN_SPECIES_OPTION,
       payload: payload
    }
}
