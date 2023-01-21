import { Character } from "../common/character";
export const SET_CHARACTER = 'SET_CHARACTER';

export function setCharacter(character: Character) {
    let payload = { character: character };
    return {
       type: SET_CHARACTER,
       payload: payload
    }
}