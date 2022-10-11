import { SimpleStats, Starship } from "../common/starship";
import { CHANGE_STARSHIP_SCALE, CHANGE_STARSHIP_SIMPLE_CLASS_NAME, CHANGE_STARSHIP_SIMPLE_DEPARTMENT, CHANGE_STARSHIP_SIMPLE_SYSTEM, CREATE_NEW_STARSHIP } from "./starshipActions";

interface StarshipState {
    starship?: Starship;
}

const starshipReducer = (state: StarshipState = { starship: undefined }, action) => {
    switch (action.type) {
        case CREATE_NEW_STARSHIP: {
            let s = new Starship();
            s.type = action.payload.type;
            s.serviceYear = action.payload.serviceYear;
            s.scale = 4;
            if (action.payload.simple) {
                s.simpleStats = new SimpleStats();
            }
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SCALE: {
            let s = state.starship.copy();
            s.scale += action.payload.delta;
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SIMPLE_CLASS_NAME: {
            let s = state.starship.copy();
            if (s.simpleStats == null) {
                s.simpleStats = new SimpleStats();
            }
            s.simpleStats.className = action.payload.className;
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SIMPLE_SYSTEM: {
            let s = state.starship.copy();
            if (s.simpleStats == null) {
                s.simpleStats = new SimpleStats();
            }
            s.simpleStats.systems[action.payload.system] += action.payload.delta;
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SIMPLE_DEPARTMENT: {
            let s = state.starship.copy();
            if (s.simpleStats == null) {
                s.simpleStats = new SimpleStats();
            }
            s.simpleStats.deparments[action.payload.department] += action.payload.delta;
            return {
                ...state,
                starship: s
            }
        }
        default:
            return state;
    }
};

export default starshipReducer;