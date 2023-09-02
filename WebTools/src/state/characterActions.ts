import { Character, CharacterRank } from "../common/character";
import { CharacterType } from "../common/characterType";
import { Attribute } from "../helpers/attributes";
import { Environment } from "../helpers/environments";
import { Skill } from "../helpers/skills";
import { Species } from "../helpers/speciesEnum";
import { EarlyOutlookModel } from "../helpers/upbringings";
export const SET_CHARACTER = 'SET_CHARACTER';
export const MODIFY_CHARACTER_REPUTATION = 'MODIFY_CHARACTER_REPUTATION';
export const MODIFY_CHARACTER_RANK = 'MODIFY_CHARACTER_RANK';
export const APPLY_NORMAL_MILESTONE_DISCIPLINE = 'APPLY_NORMAL_MILESTONE_DISCIPLINE';
export const APPLY_NORMAL_MILESTONE_FOCUS = 'APPLY_NORMAL_MILESTONE_FOCUS';
export const SET_CHARACTER_SPECIES = 'SET_CHARACTER_SPECIES';
export const SET_CHARACTER_FOCUS = 'SET_CHARACTER_FOCUS';
export const SET_CHARACTER_NAME = 'SET_CHARACTER_NAME';
export const SET_CHARACTER_PRONOUNS = 'SET_CHARACTER_PRONOUNS';
export const SET_CHARACTER_ENVIRONMENT = 'SET_CHARACTER_ENVIRONMENT';
export const SET_CHARACTER_EARLY_OUTLOOK = 'SET_CHARACTER_EARLY_OUTLOOK';
export const MODIFY_CHARACTER_ATTRIBUTE = 'MODIFY_CHARACTER_ATTRIBUTE';
export const MODIFY_CHARACTER_DISCIPLINE = 'MODIFY_CHARACTER_DISCIPLINE';
export const SET_CHARACTER_TYPE = 'SET_CHARACTER_TYPE';

export enum StepContext {
    Species,
    Environment,
    EarlyOutlook,
    Education,
    Career,
    CareerEvent1,
    CareerEvent2
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

export function setCharacterEnvironment(environment: Environment, otherSpecies?: Species) {
    let payload = { environment: environment, otherSpecies: otherSpecies };
    return {
       type: SET_CHARACTER_ENVIRONMENT,
       payload: payload
    }
}

export function setCharacterEarlyOutlook(earlyOutlook: EarlyOutlookModel, accepted: boolean = true) {
    let payload = { earlyOutlook: earlyOutlook, accepted: accepted };
    return {
       type: SET_CHARACTER_EARLY_OUTLOOK,
       payload: payload
    }
}

export function setCharacterFocus(focus: string, context: StepContext, index: number = 0) {
    let payload = { focus: focus, context: context };
    return {
       type: SET_CHARACTER_FOCUS,
       payload: payload
    }
}

export function setCharacterName(name: string) {
    let payload = { name: name };
    return {
       type: SET_CHARACTER_NAME,
       payload: payload
    }
}

export function setCharacterPronouns(pronouns: string) {
    let payload = { pronouns: pronouns };
    return {
       type: SET_CHARACTER_PRONOUNS,
       payload: payload
    }
}

export function setCharacterType(type: CharacterType) {
    let payload = { type: type };
    return {
       type: SET_CHARACTER_TYPE,
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

export function modifyCharacterDiscipline(discipline: Skill, context: StepContext, increase: boolean = true) {
    let payload = { discipline: discipline, context: context, increase: increase };
    return {
       type: MODIFY_CHARACTER_DISCIPLINE,
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