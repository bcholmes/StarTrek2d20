import { Starship } from "../common/starship";
import { CREATE_NEW_STARSHIP } from "./starshipActions";

interface StarshipState {
    starship?: Starship;
}

const starshipReducer = (state: StarshipState = { starship: undefined }, action) => {
    switch (action.type) {
        case CREATE_NEW_STARSHIP:
            let s = new Starship();
            s.type = action.payload.type;
            s.serviceYear = action.payload.serviceYear;
            return {
                ...state,
                starship: s
            }
        default:
            return state;
    }
};

export default starshipReducer;