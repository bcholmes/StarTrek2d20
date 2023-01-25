import { Character } from "../common/character";
export const SET_CHARACTER = 'SET_CHARACTER';
export const MODIFY_CHARACTER_REPUTATION = 'MODIFY_CHARACTER_REPUTATION';
export const MODIFY_CHARACTER_RANK = 'MODIFY_CHARACTER_RANK';

export function setCharacter(character: Character) {
    let payload = { character: character };
    return {
       type: SET_CHARACTER,
       payload: payload
    }
}

export function modifyCharacterReputation(delta: number) {
    let payload = { delta: delta };
    return {
       type: MODIFY_CHARACTER_REPUTATION,
       payload: payload
    }
}

export function modifyCharacterRank(rank: string) {
    let payload = { rank: rank };
    return {
       type: MODIFY_CHARACTER_RANK,
       payload: payload
    }
}