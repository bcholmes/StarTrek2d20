import { Species } from "../helpers/speciesEnum";
import { DivisionColors } from "../token/model/divisionColors";
import { HairType } from "../token/model/hairTypeEnum";
import { HeadType } from "../token/model/headTypeEnum";
import { RankIndicator } from "../token/model/rankIndicatorEnum";
import SpeciesOptions from "../token/model/speciesOptions";
import { Token } from "../token/model/token";
import { UniformEra } from "../token/model/uniformEra";
import { SET_TOKEN_DIVISION_COLOR, SET_TOKEN_HAIR_COLOR, SET_TOKEN_HAIR_TYPE, SET_TOKEN_HEAD_TYPE, SET_TOKEN_RANK, SET_TOKEN_SKIN_COLOR, SET_TOKEN_SPECIES } from "./tokenActions";

const initialState = {
    species: Species.Human,
    divisionColor: DivisionColors.getColors(UniformEra.DominionWar)[0],
    skinColor: SpeciesOptions.DEFAULT_SKIN_COLOR,
    headType: HeadType.StandardMale,
    rankIndicator: RankIndicator.None,
    hairType: HairType.Bald,
    hairColor: SpeciesOptions.DEFAULT_HAIR_COLOR
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
        return {
            ...state,
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