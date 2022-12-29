import { CharacterWithTracking } from "../tracker/model/characterWithTracking";
import { ADD_GM_TRACKED_CHARACTER, REMOVE_GM_TRACKED_CHARACTER, SET_GM_TRACKED_CHARACTER_NOTES, SET_GM_TRACKED_CHARACTER_STRESS } from "./gmTrackerActions";


interface IGMTrackerState {
    characters: CharacterWithTracking[];
}

const gmTracker = (state: IGMTrackerState = { characters: [] }, action) => {
    switch (action.type) {
        case ADD_GM_TRACKED_CHARACTER:
            return {
                ...state,
                characters: [...state.characters, new CharacterWithTracking(action.payload.character)]
            }
        case REMOVE_GM_TRACKED_CHARACTER: {
            let characters = [ ...state.characters ];
            let index = characters.map((c, i) => c.id === action.payload.character?.id ? i : -1).filter(index => index !== -1);
            if (index.length) {
                characters.splice(index[0], 1);
            }
            return {
                ...state,
                characters: characters
            }
        }
        case SET_GM_TRACKED_CHARACTER_STRESS: {
            let characters = [ ...state.characters ];
            let index = characters.map((c, i) => c.id === action.payload.character?.id ? i : -1).filter(index => index !== -1);
            if (index.length) {
                let existing = characters[index[0]];
                let tracking = new CharacterWithTracking(existing.character);
                tracking.id = existing.id;
                tracking.currentStress = action.payload.stress;
                tracking.notes = existing.notes;
                characters[index[0]] = tracking;
            }
            return {
                ...state,
                characters: characters
            }
        }
        case SET_GM_TRACKED_CHARACTER_NOTES: {
            let characters = [ ...state.characters ];
            let index = characters.map((c, i) => c.id === action.payload.character?.id ? i : -1).filter(index => index !== -1);
            if (index.length) {
                let existing = characters[index[0]];
                let tracking = new CharacterWithTracking(existing.character);
                tracking.id = existing.id;
                tracking.currentStress = existing.currentStress;
                tracking.notes = action.payload.notes;
                characters[index[0]] = tracking;
            }
            return {
                ...state,
                characters: characters
            }
        }
        default:
            return state;
    }
}

export default gmTracker;