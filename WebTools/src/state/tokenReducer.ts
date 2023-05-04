import { Species } from "../helpers/speciesEnum";
import { Token } from "../token/model/token";
import { SET_TOKEN_SPECIES } from "./tokenActions";

const token = (state: Token = { species: Species.Human }, action) => {
    switch (action.type) {
    case SET_TOKEN_SPECIES:
        return {
            ...state,
            species: action.payload.species
        }
    default:
        return state;
    }
}


export default token;