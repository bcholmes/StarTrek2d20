import { Sector, StarSystem } from "../mapping/table/star";

export const SET_STAR = 'SET_STAR';
export const SET_SECTOR = 'SET_SECTOR';

export function setStar(starSystem: StarSystem) {
    let payload = { starSystem: starSystem };
    return {
       type: SET_STAR,
       payload: payload
    }
}

export function setSector(sector: Sector) {
    let payload = { sector: sector };
    return {
       type: SET_SECTOR,
       payload: payload
    }
}
