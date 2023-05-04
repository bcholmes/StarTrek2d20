import { Species } from "../helpers/speciesEnum";

export const SET_TOKEN_SPECIES = 'SET_TOKEN_SPECIES';

export function setTokenSpecies(species: Species) {
    let payload = { species: species };
    return {
       type: SET_TOKEN_SPECIES,
       payload: payload
    }
}
