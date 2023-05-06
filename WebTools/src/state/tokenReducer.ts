import { Species } from "../helpers/speciesEnum";
import { DivisionColors } from "../token/model/divisionColors";
import { Token } from "../token/model/token";
import { UniformEra } from "../token/model/uniformEra";
import { SET_TOKEN_DIVISION_COLOR, SET_TOKEN_SPECIES } from "./tokenActions";

const initialState = {
    species: Species.Human,
    divisionColor: DivisionColors.getColors(UniformEra.DominionWar)[0]
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
    default:
        return state;
    }
}


export default token;