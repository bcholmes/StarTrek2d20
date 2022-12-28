import { Character } from "../common/character";

export const ADD_GM_TRACKED_CHARACTER = 'ADD_GM_TRACKED_CHARACTER';

export function addGMTrackedCharacter(character: Character) {
    let payload = { character: character };
    return {
       type: ADD_GM_TRACKED_CHARACTER,
       payload: payload
    }
}