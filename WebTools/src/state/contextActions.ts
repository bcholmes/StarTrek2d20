import { Era } from "../helpers/eras";
import { Source } from "../helpers/sources";

export const SET_SOURCES = 'SET_SOURCES';
export const SET_ERA = 'SET_ERA';
export const SET_ALLOW_CROSS_SPECIES_TALENTS = 'SET_ALLOW_CROSS_SPECIES_TALENTS';

export function setSources(sources: Source[]) {
    let payload = { sources: sources };
    return {
       type: SET_SOURCES,
       payload: payload
    }
}

export function setEra(era: Era) {
    let payload = era;
    return {
       type: SET_ERA,
       payload: payload
    }
}

export function setAllowCrossSpeciesTalents(value: boolean) {
    let payload = value;
    return {
       type: SET_ALLOW_CROSS_SPECIES_TALENTS,
       payload: payload
    }
}
