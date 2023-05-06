import { Species } from "../helpers/speciesEnum";

export const SET_TOKEN_SPECIES = 'SET_TOKEN_SPECIES';
export const SET_TOKEN_DIVISION_COLOR = 'SET_TOKEN_DIVISION_COLOR';

export function setTokenSpecies(species: Species) {
    let payload = { species: species };
    return {
       type: SET_TOKEN_SPECIES,
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
