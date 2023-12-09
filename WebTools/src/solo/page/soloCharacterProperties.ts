import { Character } from "../../common/character";

export interface ICharacterProperties {
    character: Character;
}

export const characterMapStateToProperties = (state, ownProps) => {
    return {
        character: state.character?.currentCharacter
    };
}

