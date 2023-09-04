import { Character } from "../../common/character";

export interface ISoloCharacterProperties {
    character: Character;
}

export const soloCharacterMapStateToProperties = (state, ownProps) => {
    return {
        character: state.character?.currentCharacter
    };
}

