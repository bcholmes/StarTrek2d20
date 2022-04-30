import { Era } from "../helpers/eras";
import { Source } from "../helpers/sources";

export const SET_SOURCES = 'SET_SOURCES';
export const SET_ERA = 'SET_ERA';

export function setSources(sources: Source[]) {
    let payload = { sources: sources };
    return {
       type: SET_SOURCES,
       payload: payload
    }
}

export function setEra(era: Era) {
    let payload = { era: Era };
    return {
       type: SET_ERA,
       payload: payload
    }
}
