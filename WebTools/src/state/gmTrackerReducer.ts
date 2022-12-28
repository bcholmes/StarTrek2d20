import { Character } from "../common/character";
import { CharacterWithTracking } from "../tracker/model/characterWithTracking";
import { ADD_GM_TRACKED_CHARACTER } from "./gmTrackerActions";


interface IGMTrackerState {
    characters: Character[];
}

const gmTracker = (state: IGMTrackerState = { characters: [] }, action) => {
    switch (action.type) {
        case ADD_GM_TRACKED_CHARACTER:
            return {
                ...state,
                characters: [...state.characters, new CharacterWithTracking(action.payload.character)]
            }
        default:
            return state;
    }
}

export default gmTracker;