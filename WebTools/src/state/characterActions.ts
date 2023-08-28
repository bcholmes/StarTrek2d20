import { Character, CharacterRank } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { Environment } from "../helpers/environments";
import { Skill } from "../helpers/skills";
import { Species } from "../helpers/speciesEnum";
export const SET_CHARACTER = 'SET_CHARACTER';
export const MODIFY_CHARACTER_REPUTATION = 'MODIFY_CHARACTER_REPUTATION';
export const MODIFY_CHARACTER_RANK = 'MODIFY_CHARACTER_RANK';
export const APPLY_NORMAL_MILESTONE_DISCIPLINE = 'APPLY_NORMAL_MILESTONE_DISCIPLINE';
export const APPLY_NORMAL_MILESTONE_FOCUS = 'APPLY_NORMAL_MILESTONE_FOCUS';
export const SET_CHARACTER_SPECIES = 'SET_CHARACTER_SPECIES';
export const SET_CHARACTER_ENVIRONMENT = 'SET_CHARACTER_ENVIRONMENT';
export const MODIFY_CHARACTER_ATTRIBUTE = 'MODIFY_CHARACTER_ATTRIBUTE';

export enum StepContext {
    Species,
    Upbringing,
    Environment
}

export function setCharacter(character: Character) {
    let payload = { character: character };
    return {
       type: SET_CHARACTER,
       payload: payload
    }
}

export function setCharacterSpecies(species: Species, attributes: Attribute[] = []) {
    let payload = { species: species, attributes: attributes };
    return {
       type: SET_CHARACTER_SPECIES,
       payload: payload
    }
}

export function setCharacterEnvironment(environment: Environment, otherSpecies?: string) {
    let payload = { environment: environment, otherSpecies: otherSpecies };
    return {
       type: SET_CHARACTER_ENVIRONMENT,
       payload: payload
    }
}

export function modifyCharacterAttribute(attribute: Attribute, context: StepContext, increase: boolean = true) {
    let payload = { attribute: attribute, context: context, increase: increase };
    return {
       type: MODIFY_CHARACTER_ATTRIBUTE,
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

export function modifyCharacterRank(rank: CharacterRank) {
    let payload = { rank: rank };
    return {
       type: MODIFY_CHARACTER_RANK,
       payload: payload
    }
}

export function applyNormalMilestoneDiscipline(decrease: Skill, increase: Skill) {
    let payload = { decrease: decrease, increase: increase };
    return {
       type: APPLY_NORMAL_MILESTONE_DISCIPLINE,
       payload: payload
    }
}

export function applyNormalMilestoneFocus(removeFocus: string, addFocus: string) {
    let payload = { removeFocus: removeFocus, addFocus: addFocus };
    return {
       type: APPLY_NORMAL_MILESTONE_FOCUS,
       payload: payload
    }
}