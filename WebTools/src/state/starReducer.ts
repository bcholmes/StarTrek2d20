import { Sector, StarSystem } from "../mapping/table/star";
import { SET_SECTOR, SET_SECTOR_NAME, SET_STAR, SET_STAR_SYSTEM_NAME } from "./starActions";

interface StarState {
    sector?: Sector;
    starSystem?: StarSystem;
}

const star = (state: StarState = { starSystem: undefined, sector: undefined }, action) => {
    switch (action.type) {
        case SET_SECTOR: 
            return {
                ...state,
                sector: action.payload.sector
            }
        case SET_SECTOR_NAME: {
            let name = action.payload.name;
            let systems = state.sector.systems.map((s) => {
                let system = s.clone();
                system.rootName = name;
                return system;
            });
            let sector = new Sector(state.sector.prefix);
            sector.id = state.sector.id;
            sector.simpleName = name;
            sector.systems = systems;

            let starSystem = state.starSystem ? state.starSystem.clone() : undefined;
            if (starSystem) {
                starSystem.rootName = name;
            }            
            return {
                ...state,
                sector: sector,
                starSystem: starSystem
            }
        }
        case SET_STAR_SYSTEM_NAME: {
            let starSystem = state.starSystem ? state.starSystem.clone() : undefined;
            if (starSystem) {
                starSystem.friendlyName = action.payload.name;
                let systems = state.sector.systems.map((s) => {
                    if (s.id === starSystem.id) {
                        return starSystem;
                    } else {
                        return s;
                    }
                });
                let sector = new Sector(state.sector.prefix);
                sector.id = state.sector.id;
                sector.simpleName = state.sector.simpleName;
                sector.systems = systems;

                return {
                    ...state,
                    sector: sector,
                    starSystem: starSystem
                }
            } else {
                return state;
            }
        }
        case SET_STAR: 
            return {
                ...state,
                starSystem: action.payload.starSystem
            }
        default:
            return state;
    }
};

export default star;