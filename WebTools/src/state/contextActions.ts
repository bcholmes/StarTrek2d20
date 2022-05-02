import { Era } from "../helpers/eras";
import { Source } from "../helpers/sources";

export const ADD_SOURCE = 'ADD_SOURCE';
export const REMOVE_SOURCE = 'REMOVE_SOURCE';
export const SET_SOURCES = 'SET_SOURCES';
export const SET_ERA = 'SET_ERA';
export const SET_ALLOW_CROSS_SPECIES_TALENTS = 'SET_ALLOW_CROSS_SPECIES_TALENTS';
export const SET_ALLOW_ESOTERIC_TALENTS = 'SET_ALLOW_ESOTERIC_TALENTS';

/**
 * The context describes the environment in which the characters/starships are
 * built. It encapsulates things like "what sources are available" and 
 * "what decisions has the GM made about optional items"
 */

export function addSource(source: Source) {
    let payload = source;
    return {
       type: ADD_SOURCE,
       payload: payload
    }
}

export function removeSource(source: Source) {
    let payload = source;
    return {
       type: REMOVE_SOURCE,
       payload: payload
    }
}

export function setSources(sources: Source[]) {
    let payload = sources;
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

export function setAllowEsotericTalents(value: boolean) {
    let payload = value;
    return {
       type: SET_ALLOW_ESOTERIC_TALENTS,
       payload: payload
    }
}
