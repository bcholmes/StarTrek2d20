import { Species } from "../helpers/speciesEnum";
import { HairType } from "../token/model/hairTypeEnum";
import { RankIndicator } from "../token/model/rankIndicatorEnum";

export const SET_TOKEN_SPECIES = 'SET_TOKEN_SPECIES';
export const SET_TOKEN_DIVISION_COLOR = 'SET_TOKEN_DIVISION_COLOR';
export const SET_TOKEN_SKIN_COLOR = 'SET_TOKEN_SKIN_COLOR';
export const SET_TOKEN_RANK = 'SET_TOKEN_RANK';
export const SET_TOKEN_HAIR_TYPE = 'SET_TOKEN_HAIR_TYPE';

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

export function setTokenRank(rank: RankIndicator) {
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

export function setTokenHairType(hairType: HairType) {
    let payload = { hairType: hairType };
    return {
       type: SET_TOKEN_HAIR_TYPE,
       payload: payload
    }
}
