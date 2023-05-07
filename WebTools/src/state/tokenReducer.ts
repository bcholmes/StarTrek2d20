import { Species } from "../helpers/speciesEnum";
import { DivisionColors } from "../token/model/divisionColors";
import { HairType } from "../token/model/hairTypeEnum";
import { RankIndicator } from "../token/model/rankIndicatorEnum";
import SpeciesColors from "../token/model/speciesColors";
import { Token } from "../token/model/token";
import { UniformEra } from "../token/model/uniformEra";
import { SET_TOKEN_DIVISION_COLOR, SET_TOKEN_HAIR_TYPE, SET_TOKEN_RANK, SET_TOKEN_SKIN_COLOR, SET_TOKEN_SPECIES } from "./tokenActions";

const initialState = {
    species: Species.Human,
    divisionColor: DivisionColors.getColors(UniformEra.DominionWar)[0],
    skinColor: SpeciesColors.DEFAULT_SKIN_COLOR,
    rankIndicator: RankIndicator.None,
    hairType: HairType.Bald
}

const token = (state: Token = initialState, action) => {
    switch (action.type) {
    case SET_TOKEN_SPECIES:
        return {
            ...state,
            species: action.payload.species
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