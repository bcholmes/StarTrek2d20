import type { Character } from '../../common/character';

export interface CharacterState {
  currentCharacter?: Character;
  isModified: boolean;
  replacementHash?: number;
}

export const initialState: CharacterState = {
  currentCharacter: undefined,
  isModified: false,
};

export const withCharacter = (
  state: any,
  action: any,
  mutate: (temp: Character, action: any) => void,
): CharacterState => {
  const temp = state.currentCharacter.copy();
  mutate(temp, action);
  return {
    ...state,
    currentCharacter: temp,
    isModified: true,
  };
};
