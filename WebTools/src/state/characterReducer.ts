import { Character } from "../common/character";
import { SET_CHARACTER } from "./characterActions";

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
        default:
            return state;
    }
}

export default characterReducer;