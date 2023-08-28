import { Character, EnvironmentStep, SpeciesStep } from "../common/character";
import { APPLY_NORMAL_MILESTONE_DISCIPLINE, APPLY_NORMAL_MILESTONE_FOCUS, MODIFY_CHARACTER_ATTRIBUTE, MODIFY_CHARACTER_RANK, MODIFY_CHARACTER_REPUTATION, SET_CHARACTER, SET_CHARACTER_ENVIRONMENT, SET_CHARACTER_SPECIES, StepContext } from "./characterActions";

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
        case SET_CHARACTER_SPECIES: {
            let temp = state.currentCharacter.copy();
            temp.speciesStep = new SpeciesStep(action.payload.species);
            if (action.payload.attributes) {
                temp.speciesStep.attributes = action.payload.attributes;
            }
            return {
                ...state,
                currentCharacter: temp,
                isModified: true
            }
        }
        case SET_CHARACTER_ENVIRONMENT: {
            let temp = state.currentCharacter.copy();
            temp.environmentStep = new EnvironmentStep(action.payload.environment, action.payload.otherSpecies);
            return {
                ...state,
                currentCharacter: temp,
                isModified: true
            }
        }
        case MODIFY_CHARACTER_ATTRIBUTE: {
            let temp = state.currentCharacter.copy();
            if (action.payload.context === StepContext.Species && temp.speciesStep) {
                if (action.payload.increase) {
                    temp.speciesStep.attributes.push(action.payload.attribute);
                    if (temp.speciesStep.attributes.length > 3) {
                        let attributes = [...temp.speciesStep.attributes];
                        attributes.splice(0, attributes.length - 3);
                        temp.speciesStep.attributes = attributes;
                    }
                } else if (temp.speciesStep.attributes.indexOf(action.payload.attribute) >= 0) {
                    let attributes = [...temp.speciesStep.attributes];
                    attributes.splice(temp.speciesStep.attributes.indexOf(action.payload.attribute), 1);
                    temp.speciesStep.attributes = attributes;
                }
            } else if (action.payload.context === StepContext.Environment && temp.environmentStep) {
                if (action.payload.increase) {
                    temp.environmentStep.attribute = action.payload.attribute;
                } else if (temp.environmentStep.attribute === action.payload.attribute) {
                    temp.environmentStep.attribute = undefined;
                }
            }
            return {
                ...state,
                currentCharacter: temp,
                isModified: true
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
        case APPLY_NORMAL_MILESTONE_DISCIPLINE: {
            let temp = state.currentCharacter.copy();
            temp.skills[action.payload.decrease].expertise -= 1;
            temp.skills[action.payload.increase].expertise += 1;
            return {
                ...state,
                currentCharacter: temp,
                isModified: true
            }
        }
        case APPLY_NORMAL_MILESTONE_FOCUS: {
            let temp = state.currentCharacter.copy();
            let index = temp.focuses.indexOf(action.payload.removeFocus);
            if (index >= 0) {
                temp.focuses.splice(index, 1);
            }
            temp.focuses.push(action.payload.addFocus);
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