import { Species } from "../helpers/speciesEnum";
import { BodyType } from "../token/model/bodyTypeEnum";
import { DivisionColors } from "../token/model/divisionColors";
import { EyeType } from "../token/model/eyeTypeEnum";
import { HairType } from "../token/model/hairTypeEnum";
import { HeadType } from "../token/model/headTypeEnum";
import { MouthType } from "../token/model/mouthTypeEnum";
import { NasoLabialFoldType } from "../token/model/nasoLabialFoldTypeEnum";
import { NoseType } from "../token/model/noseTypeEnum";
import { RankIndicator } from "../token/model/rankIndicatorEnum";
import SpeciesOptions from "../token/model/speciesOptions";
import { Token } from "../token/model/token";
import { UniformEra } from "../token/model/uniformEra";
import { SET_TOKEN_BODY_TYPE, SET_TOKEN_DIVISION_COLOR, SET_TOKEN_EYE_COLOR, SET_TOKEN_EYE_TYPE, SET_TOKEN_HAIR_COLOR, SET_TOKEN_HAIR_TYPE, SET_TOKEN_HEAD_TYPE, SET_TOKEN_MOUTH_TYPE, SET_TOKEN_NASO_LABIAL_FOLD_TYPE, SET_TOKEN_NOSE_TYPE, SET_TOKEN_RANK, SET_TOKEN_SKIN_COLOR, SET_TOKEN_SPECIES } from "./tokenActions";

const initialState = {
    species: Species.Human,
    divisionColor: DivisionColors.getColors(UniformEra.DominionWar)[0],
    skinColor: SpeciesOptions.DEFAULT_SKIN_COLOR,
    headType: HeadType.StandardMale,
    rankIndicator: RankIndicator.None,
    hairType: HairType.DeLeve,
    hairColor: SpeciesOptions.DEFAULT_HAIR_COLOR,
    eyeColor: SpeciesOptions.getDefaultEyeColor(Species.Human),
    eyeType: EyeType.Eye3,
    noseType: NoseType.StraightBasic,
    mouthType: MouthType.Mouth2,
    uniformEra: UniformEra.DominionWar,
    bodyType: BodyType.Body1,
    nasoLabialFold: NasoLabialFoldType.None
}

const token = (state: Token = initialState, action) => {
    switch (action.type) {
    case SET_TOKEN_SPECIES: {
        let skinColor = state.skinColor;
        let palette = SpeciesOptions.getSkinColors(action.payload.species);
        if (palette.indexOf(skinColor) < 0) {
            skinColor = palette[Math.floor(palette.length / 2)];
        }
        let hairType = state.hairType;
        let hairTypes = SpeciesOptions.getHairTypes(action.payload.species);
        if (hairTypes.indexOf(hairType) < 0) {
            hairType = hairTypes[0];
        }

        let eyeColor = state.eyeColor;
        let speciesEyeColours = SpeciesOptions.getEyeColors(action.payload.species);
        if (speciesEyeColours.indexOf(eyeColor) < 0) {
            eyeColor = speciesEyeColours[Math.floor(speciesEyeColours.length / 2)];
        }
        return {
            ...state,
            eyeColor: eyeColor,
            hairType: hairType,
            skinColor: skinColor,
            species: action.payload.species
        }
    }
    case SET_TOKEN_DIVISION_COLOR:
        return {
            ...state,
            divisionColor: action.payload.color
        }
    case SET_TOKEN_RANK:
        return {
            ...state,
            rankIndicator: action.payload.rank
        }
    case SET_TOKEN_HAIR_TYPE:
        return {
            ...state,
            hairType: action.payload.hairType
        }
    case SET_TOKEN_HEAD_TYPE:
        return {
            ...state,
            headType: action.payload.headType
        }
    case SET_TOKEN_NOSE_TYPE:
        return {
            ...state,
            noseType: action.payload.noseType
        }
    case SET_TOKEN_NASO_LABIAL_FOLD_TYPE:
        return {
            ...state,
            nasoLabialFold: action.payload.type
        }
    case SET_TOKEN_BODY_TYPE:
        return {
            ...state,
            bodyType: action.payload.type
        }
    case SET_TOKEN_EYE_TYPE:
        return {
            ...state,
            eyeType: action.payload.eyeType
        }
    case SET_TOKEN_MOUTH_TYPE:
        return {
            ...state,
            mouthType: action.payload.mouthType
        }
    case SET_TOKEN_EYE_COLOR:
        return {
            ...state,
            eyeColor: action.payload.color
        }
    case SET_TOKEN_HAIR_COLOR:
        return {
            ...state,
            hairColor: action.payload.color
        }
    case SET_TOKEN_SKIN_COLOR:
        return {
            ...state,
            skinColor: action.payload.color
        }
    default:
        return state;
    }
}


export default token;