import { Sector, StarSystem } from "../mapping/table/star";

export const SET_STAR = 'SET_STAR';
export const SET_SECTOR = 'SET_SECTOR';
export const SET_SECTOR_NAME = 'SET_SECTOR_NAME';
export const SET_STAR_SYSTEM_NAME = 'SET_STAR_SYSTEM_NAME';

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

export function setSectorName(name: string) {
    let payload = { name: name };
    return {
       type: SET_SECTOR_NAME,
       payload: payload
    }
}

export function setStarSystemName(name: string) {
    let payload = { name: name };
    return {
       type: SET_STAR_SYSTEM_NAME,
       payload: payload
    }
}
