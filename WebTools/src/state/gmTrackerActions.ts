import { Character } from "../common/character";
import { CharacterWithTracking } from "../tracker/model/characterWithTracking";

export const ADD_GM_TRACKED_CHARACTER = 'ADD_GM_TRACKED_CHARACTER';
export const REMOVE_GM_TRACKED_CHARACTER = 'REMOVE_GM_TRACKED_CHARACTER';
export const SET_GM_TRACKED_CHARACTER_STRESS = 'SET_GM_TRACKED_CHARACTER_STRESS';
export const SET_GM_TRACKED_CHARACTER_NOTES = 'SET_GM_TRACKED_CHARACTER_NOTES';

export function addGMTrackedCharacter(character: Character) {
    let payload = { character: character };
    return {
       type: ADD_GM_TRACKED_CHARACTER,
       payload: payload
    }
}

export function removeGMTrackedCharacter(character: CharacterWithTracking) {
    let payload = { character: character };
    return {
       type: REMOVE_GM_TRACKED_CHARACTER,
       payload: payload
    }
}

export function setGMTrackedCharacterStress(character: CharacterWithTracking, stress: number) {
    let payload = { character: character, stress: stress };
    return {
       type: SET_GM_TRACKED_CHARACTER_STRESS,
       payload: payload
    }
}

export function setGMTrackedCharacterNotes(character: CharacterWithTracking, notes: string) {
    let payload = { character: character, notes: notes };
    return {
       type: SET_GM_TRACKED_CHARACTER_NOTES,
       payload: payload
    }
}