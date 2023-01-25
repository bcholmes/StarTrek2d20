import { Character } from "../common/character";
import { MODIFY_CHARACTER_RANK, MODIFY_CHARACTER_REPUTATION, SET_CHARACTER } from "./characterActions";

interface CharacterState {
    currentCharacter?: Character;
    isModified: boolean
}

const characterReducer = (state: CharacterState = { currentCharacter: undefined, isModified: false }, action) => {
    switch (action.type) {

        case SET_CHARACTER: {
            let temp = action.payload.character.copy();
            return {
                ...state,
                currentCharacter: temp,
                isModified: false
            }
        }
        case MODIFY_CHARACTER_REPUTATION: {
            let temp = state.currentCharacter.copy();
            temp.reputation += action.payload.delta;
            return {
                ...state,
                currentCharacter: temp,
                isModified: true
            }
        }
        case MODIFY_CHARACTER_RANK: {
            let temp = state.currentCharacter.copy();
            temp.rank = action.payload.rank;
            return {
                ...state,
                currentCharacter: temp,
                isModified: true
            }
        }
        default:
            return state;
    }
}

export default characterReducer;