import { Character, CharacterRank } from "../common/character";
import { CharacterType } from "../common/characterType";
import { Age } from "../helpers/age";
import { Attribute } from "../helpers/attributes";
import { BorgImplantType } from "../helpers/borgImplant";
import { Career } from "../helpers/careerEnum";
import { Environment } from "../helpers/environments";
import { Rank } from "../helpers/ranks";
import { Role } from "../helpers/roles";
import { Skill } from "../helpers/skills";
import { Species } from "../helpers/speciesEnum";
import { ITalent } from "../helpers/italent";
import { Track } from "../helpers/trackEnum";
import { EarlyOutlookModel } from "../helpers/upbringings";
export const SET_CHARACTER = 'SET_CHARACTER';
export const MODIFY_CHARACTER_REPUTATION = 'MODIFY_CHARACTER_REPUTATION';
export const MODIFY_CHARACTER_RANK = 'MODIFY_CHARACTER_RANK';
export const APPLY_NORMAL_MILESTONE_DISCIPLINE = 'APPLY_NORMAL_MILESTONE_DISCIPLINE';
export const APPLY_NORMAL_MILESTONE_FOCUS = 'APPLY_NORMAL_MILESTONE_FOCUS';
export const SET_CHARACTER_SPECIES = 'SET_CHARACTER_SPECIES';
export const SET_CHARACTER_FOCUS = 'SET_CHARACTER_FOCUS';
export const SET_CHARACTER_VALUE = 'SET_CHARACTER_VALUE';
export const SET_CHARACTER_AGE = 'SET_CHARACTER_AGE';
export const SET_CHARACTER_LINEAGE = 'SET_CHARACTER_LINEAGE';
export const SET_CHARACTER_ASSIGNED_SHIP = 'SET_CHARACTER_ASSIGNED_SHIP';
export const SET_CHARACTER_HOUSE = 'SET_CHARACTER_HOUSE';
export const SET_CHARACTER_ADDITIONAL_TRAITS = 'SET_CHARACTER_ADDITIONAL_TRAITS';
export const SET_CHARACTER_NAME = 'SET_CHARACTER_NAME';
export const SET_CHARACTER_PASTIME = 'SET_CHARACTER_PASTIME';
export const SET_CHARACTER_RANK = 'SET_CHARACTER_RANK';
export const SET_CHARACTER_ROLE = 'SET_CHARACTER_ROLE';
export const SET_CHARACTER_PRONOUNS = 'SET_CHARACTER_PRONOUNS';
export const SET_CHARACTER_EDUCATION = 'SET_CHARACTER_EDUCATION';
export const SET_CHARACTER_ENVIRONMENT = 'SET_CHARACTER_ENVIRONMENT';
export const SET_CHARACTER_EARLY_OUTLOOK = 'SET_CHARACTER_EARLY_OUTLOOK';
export const SET_CHARACTER_FINISHING_TOUCHES = "SET_CHARACTER_FINISHING_TOUCHES";
export const SET_CHARACTER_CAREER_LENGTH = 'SET_CHARACTER_CAREER_LENGTH';
export const MODIFY_CHARACTER_ATTRIBUTE = 'MODIFY_CHARACTER_ATTRIBUTE';
export const MODIFY_CHARACTER_DISCIPLINE = 'MODIFY_CHARACTER_DISCIPLINE';
export const SET_CHARACTER_TYPE = 'SET_CHARACTER_TYPE';
export const ADD_CHARACTER_CAREER_EVENT = "ADD_CHARACTER_CAREER_EVENT";
export const SET_CHARACTER_CAREER_EVENT_TRAIT = "SET_CHARACTER_CAREER_EVENT_TRAIT";
export const ADD_CHARACTER_BORG_IMPLANT = "ADD_CHARACTER_BORG_IMPLANT";
export const ADD_CHARACTER_UNTAPPED_POTENTIAL_ATTRIBUTE = "ADD_CHARACTER_UNTAPPED_POTENTIAL_ATTRIBUTE";
export const REMOVE_CHARACTER_BORG_IMPLANT = "REMOVE_CHARACTER_BORG_IMPLANT";
export const ADD_CHARACTER_TALENT = "ADD_CHARACTER_TALENT";
export const ADD_CHARACTER_TALENT_FOCUS = "ADD_CHARACTER_TALENT_FOCUS";
export const ADD_CHARACTER_TALENT_VALUE = "ADD_CHARACTER_TALENT_VALUE";
export const SET_SUPPORTING_CHARACTER_DISCIPLINES = "SET_SUPPORTING_CHARACTER_DISCIPLINES";
export const SET_SUPPORTING_CHARACTER_ATTRIBUTES = "SET_SUPPORTING_CHARACTER_ATTRIBUTES";
export const ADD_CHARACTER_SPECIES_ABILITY_FOCUS = "ADD_CHARACTER_SPECIES_ABILITY_FOCUS";

export enum StepContext {
    Species,
    Environment,
    EarlyOutlook,
    Education,
    Career,
    CareerEvent1,
    CareerEvent2,
    FinishingTouches
}

export function setCharacter(character: Character) {
    let payload = { character: character };
    return {
       type: SET_CHARACTER,
       payload: payload
    }
}


export function addCharacterBorgImplant(type: BorgImplantType) {
    let payload = { type: type };
    return {
       type: ADD_CHARACTER_BORG_IMPLANT,
       payload: payload
    }
}

export function addCharacterUntappedPotentialAttribute(attribute: Attribute) {
    let payload = { attribute: attribute };
    return {
       type: ADD_CHARACTER_UNTAPPED_POTENTIAL_ATTRIBUTE,
       payload: payload
    }
}

export function removeCharacterBorgImplant(type: BorgImplantType) {
    let payload = { type: type };
    return {
       type: REMOVE_CHARACTER_BORG_IMPLANT,
       payload: payload
    }
}

export function setCharacterSpecies(species: Species, attributes: Attribute[] = [], mixedSpecies?: Species, originalSpecies?: Species, customSpeciesName?: string) {
    let payload = { species: species, attributes: attributes, mixedSpecies: mixedSpecies,
        originalSpecies: originalSpecies, customSpeciesName: customSpeciesName };
    return {
       type: SET_CHARACTER_SPECIES,
       payload: payload
    }
}

export function setSupportingCharacterDisciplines(disciplines: Skill[]) {
    let payload = { disciplines: disciplines };
    return {
       type: SET_SUPPORTING_CHARACTER_DISCIPLINES,
       payload: payload
    }
}

export function setSupportingCharacterAttributes(attributes: Attribute[]) {
    let payload = { attributes: attributes };
    return {
       type: SET_SUPPORTING_CHARACTER_ATTRIBUTES,
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

export function setCharacterEducation(track: Track, enlisted: boolean = false) {
    let payload = { track: track, enlisted: enlisted };
    return {
       type: SET_CHARACTER_EDUCATION,
       payload: payload
    }
}

export function setCharacterFinishingTouches() {
    return {
       type: SET_CHARACTER_FINISHING_TOUCHES,
    }
}

export function addCharacterCareerEvent(eventId: number, context: StepContext, attribute?: Attribute, discipline?: Skill) {
    let payload = { eventId: eventId, attribute: attribute, discipline: discipline, context: context };
    return {
       type: ADD_CHARACTER_CAREER_EVENT,
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
    let payload = { focus: focus, context: context, index: index };
    return {
       type: SET_CHARACTER_FOCUS,
       payload: payload
    }
}

export function addCharacterTalentFocus(focus: string, talent: string, index: number = 0) {
    let payload = { focus: focus, talent: talent, index: index };
    return {
       type: ADD_CHARACTER_TALENT_FOCUS,
       payload: payload
    }
}


export function setCharacterSpeciesAbilityFocus(focus: string, index: number = 0) {
    let payload = { focus: focus, index: index };
    return {
       type: ADD_CHARACTER_SPECIES_ABILITY_FOCUS,
       payload: payload
    }
}



export function addCharacterTalentValue(value: string, talent: string|ITalent) {
    let talentName = typeof talent === "string" ? talent as string : (talent as ITalent).name;
    let payload = { value: value, talent: talentName };
    return {
       type: ADD_CHARACTER_TALENT_VALUE,
       payload: payload
    }
}

export function addCharacterTalent(talent: ITalent, context: StepContext) {
    let payload = { talent: talent == null ? undefined : talent.name, context: context };
    return {
       type: ADD_CHARACTER_TALENT,
       payload: payload
    }
}

export function setCharacterValue(value: string, context: StepContext) {
    let payload = { value: value, context: context };
    return {
       type: SET_CHARACTER_VALUE,
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

export function setCharacterPastime(pastime: string) {
    let payload = { pastime: pastime };
    return {
       type: SET_CHARACTER_PASTIME,
       payload: payload
    }
}

export function setCharacterAge(age: Age) {
    let payload = { age: age };
    return {
       type: SET_CHARACTER_AGE,
       payload: payload
    }
}

export function setCharacterLineage(lineage: string) {
    let payload = { lineage: lineage };
    return {
       type: SET_CHARACTER_LINEAGE,
       payload: payload
    }
}

export function setCharacterHouse(house: string) {
    let payload = { house: house };
    return {
       type: SET_CHARACTER_HOUSE,
       payload: payload
    }
}

export function setCharacterCareerEventTrait(trait: string, context: StepContext) {
    let payload = { trait: trait, context: context };
    return {
       type: SET_CHARACTER_CAREER_EVENT_TRAIT,
       payload: payload
    }
}


export function setCharacterAdditionalTraits(traits: string) {
    let payload = { traits: traits };
    return {
       type: SET_CHARACTER_ADDITIONAL_TRAITS,
       payload: payload
    }
}


export function setCharacterRank(name: string, rank?: Rank) {
    let payload = { name: name, rank: rank };
    return {
       type: SET_CHARACTER_RANK,
       payload: payload
    }
}

export function setCharacterAssignment(role?: string|Role, secondaryRole?: Role) {
    let payload = { role: role, secondaryRole: secondaryRole };
    return {
       type: SET_CHARACTER_ROLE,
       payload: payload
    }
}

export function setCharacterAssignedShip(assignedShip: string) {
    let payload = { assignedShip: assignedShip };
    return {
       type: SET_CHARACTER_ASSIGNED_SHIP,
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

export function setCharacterCareerLength(careerLength: Career) {
    let payload = { careerLength: careerLength };
    return {
       type: SET_CHARACTER_CAREER_LENGTH,
       payload: payload
    }
}

export function modifyCharacterAttribute(attribute: Attribute, context: StepContext, positive: boolean = true, forceDecrement: boolean = false) {
    let payload = { attribute: attribute, context: context, positive: positive, forceDecrement: forceDecrement };
    return {
       type: MODIFY_CHARACTER_ATTRIBUTE,
       payload: payload
    }
}

export function modifyCharacterDiscipline(discipline: Skill, context: StepContext, positive: boolean = true, primaryDisciplines: Skill[] = [], forceDecrement: boolean = false) {
    let payload = { discipline: discipline, context: context, positive: positive, primaryDisciplines: primaryDisciplines, forceDecrement: forceDecrement };
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