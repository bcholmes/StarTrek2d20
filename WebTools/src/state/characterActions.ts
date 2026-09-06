import { createAction } from '@reduxjs/toolkit';
import type { Character, CharacterRank } from '../common/character';
import type { CharacterType } from '../common/characterType';
import type { Age } from '../helpers/age';
import type { Attribute } from '../helpers/attributes';
import type { BorgImplantType } from '../helpers/borgImplant';
import type { Career } from '../helpers/careerEnum';
import type { Environment } from '../helpers/environments';
import type { Rank } from '../helpers/ranks';
import type { Role } from '../helpers/roles';
import type { Department } from '../helpers/department';
import type { Species } from '../helpers/speciesEnum';
import type { ITalent } from '../helpers/italent';
import type { Track } from '../helpers/trackEnum';
import type { EarlyOutlookModel } from '../helpers/upbringings';
import type { CharacterAdvancementChoice } from '../modify/model/characterAdvancementChoice';
import type { SelectedTalent } from '../common/selectedTalent';
import type { ModificationType } from '../modify/model/modificationType';
import type { EquipmentModel, EquipmentType } from '../helpers/equipment';
import type { PersonalWeaponType } from '../helpers/weapons';
import type { LogEntry } from '../common/logEntry';
import type { SpeciesAbilityChoice } from '../helpers/speciesAbility';
import { SpeciesAbilityList } from '../helpers/speciesAbility';
import { hasSource } from './contextFunctions';
import type {
  FocusAssembly,
  TalentAssembly,
  ValueAssembly,
} from '../common/characterAssembly';

export const SET_CHARACTER = 'SET_CHARACTER';
export const MODIFY_CHARACTER_REPUTATION = 'MODIFY_CHARACTER_REPUTATION';
export const MODIFY_CHARACTER_RANK = 'MODIFY_CHARACTER_RANK';
export const SET_CHARACTER_SPECIES = 'SET_CHARACTER_SPECIES';
export const SET_CHARACTER_FOCUS = 'SET_CHARACTER_FOCUS';
export const SET_CHARACTER_VALUE = 'SET_CHARACTER_VALUE';
export const SET_CHARACTER_AGE = 'SET_CHARACTER_AGE';
export const SET_CHARACTER_LINEAGE = 'SET_CHARACTER_LINEAGE';
export const SET_CHARACTER_ASSIGNED_SHIP = 'SET_CHARACTER_ASSIGNED_SHIP';
export const SET_CHARACTER_HOUSE = 'SET_CHARACTER_HOUSE';
export const SET_CHARACTER_ADDITIONAL_TRAITS =
  'SET_CHARACTER_ADDITIONAL_TRAITS';
export const SET_CHARACTER_NAME = 'SET_CHARACTER_NAME';
export const SET_CHARACTER_PASTIME = 'SET_CHARACTER_PASTIME';
export const SET_CHARACTER_RANK = 'SET_CHARACTER_RANK';
export const SET_CHARACTER_ROLE = 'SET_CHARACTER_ROLE';
export const SET_CHARACTER_PRONOUNS = 'SET_CHARACTER_PRONOUNS';
export const SET_CHARACTER_EDUCATION = 'SET_CHARACTER_EDUCATION';
export const SET_CHARACTER_ENVIRONMENT = 'SET_CHARACTER_ENVIRONMENT';
export const SET_CHARACTER_EARLY_OUTLOOK = 'SET_CHARACTER_EARLY_OUTLOOK';
export const SET_CHARACTER_FINISHING_TOUCHES =
  'SET_CHARACTER_FINISHING_TOUCHES';
export const SET_CHARACTER_CAREER_LENGTH = 'SET_CHARACTER_CAREER_LENGTH';
export const MODIFY_CHARACTER_ATTRIBUTE = 'MODIFY_CHARACTER_ATTRIBUTE';
export const MODIFY_CHARACTER_DISCIPLINE = 'MODIFY_CHARACTER_DISCIPLINE';
export const SET_CHARACTER_TYPE = 'SET_CHARACTER_TYPE';
export const ADD_CHARACTER_CAREER_EVENT = 'ADD_CHARACTER_CAREER_EVENT';
export const SET_CHARACTER_CAREER_EVENT_TRAIT =
  'SET_CHARACTER_CAREER_EVENT_TRAIT';
export const ADD_CHARACTER_BORG_IMPLANT = 'ADD_CHARACTER_BORG_IMPLANT';
export const ADD_CHARACTER_UNTAPPED_POTENTIAL_ATTRIBUTE =
  'ADD_CHARACTER_UNTAPPED_POTENTIAL_ATTRIBUTE';
export const REMOVE_CHARACTER_BORG_IMPLANT = 'REMOVE_CHARACTER_BORG_IMPLANT';
export const ADD_CHARACTER_TALENT = 'ADD_CHARACTER_TALENT';
export const ADD_CHARACTER_TALENT_FOCUS = 'ADD_CHARACTER_TALENT_FOCUS';
export const ADD_CHARACTER_TALENT_VALUE = 'ADD_CHARACTER_TALENT_VALUE';
export const SET_SUPPORTING_CHARACTER_DISCIPLINES =
  'SET_SUPPORTING_CHARACTER_DISCIPLINES';
export const SET_NPC_CHARACTER_DEPARTMENTS = 'SET_NPC_CHARACTER_DEPARTMENTS';
export const SET_SUPPORTING_CHARACTER_ATTRIBUTES =
  'SET_SUPPORTING_CHARACTER_ATTRIBUTES';
export const SET_SUPPORTING_CHARACTER_SUPERVISORY =
  'SET_SUPPORTING_CHARACTER_SUPERVISORY';
export const ADD_CHARACTER_SPECIES_ABILITY_FOCUS =
  'ADD_CHARACTER_SPECIES_ABILITY_FOCUS';
export const SET_CHARACTER_SPECIES_ABILITY_CHOICE =
  'SET_CHARACTER_SPECIES_ABILITY_CHOICE';
export const MODIFY_CHARACTER_ADD_ADVANCEMENT =
  'MODIFY_CHARACTER_ADD_ADVANCEMENT';
export const ADD_NPC_CHARACTER_VALUE = 'SET_NPC_CHARACTER_VALUE';
export const SET_NPC_CHARACTER_ATTRIBUTES = 'SET_NPC_CHARACTER_ATTRIBUTES';
export const ADD_NPC_CHARACTER_EQUIPMENT = 'ADD_NPC_CHARACTER_EQUIPMENT';
export const REMOVE_NPC_CHARACTER_EQUIPMENT = 'REMOVE_NPC_CHARACTER_EQUIPMENT';
export const REMOVE_NPC_CHARACTER_WEAPON = 'REMOVE_NPC_CHARACTER_WEAPON';
export const ADD_NPC_CHARACTER_WEAPON = 'ADD_NPC_CHARACTER_WEAPON';
export const SET_NPC_CHARACTER_TALENTS = 'SET_NPC_CHARACTER_TALENTS';
export const ADD_CHARACTER_LOG_ENTRY = 'ADD_CHARACTER_LOG_ENTRY';
export const REMOVE_CHARACTER_BORG_IMPLANT_SPECIES_OPTION =
  'REMOVE_CHARACTER_BORG_IMPLANT_SPECIES_OPTION';
export const ADD_CHARACTER_BORG_IMPLANT_SPECIES_OPTION =
  'ADD_CHARACTER_BORG_IMPLANT_SPECIES_OPTION';
export const UPDATE_CHARACTER_GENERAL_EDIT_VALUE =
  'UPDATE_CHARACTER_GENERAL_EDIT_VALUE';
export const UPDATE_CHARACTER_GENERAL_EDIT_SPECIES_ABILITY =
  'UPDATE_CHARACTER_GENERAL_EDIT_SPECIES_ABILITY';
export const UPDATE_CHARACTER_GENERAL_EDIT_FOCUS =
  'UPDATE_CHARACTER_GENERAL_EDIT_FOCUS';
export const UPDATE_CHARACTER_GENERAL_EDIT_TALENT =
  'UPDATE_CHARACTER_GENERAL_EDIT_TALENT';

export enum StepContext {
  Species,
  Environment,
  EarlyOutlook,
  Education,
  Career,
  CareerEvent1,
  CareerEvent2,
  FinishingTouches,
}

export const setCharacter = createAction(
  SET_CHARACTER,
  (character: Character, replacementHash?: number) => ({
    payload: { character, replacementHash },
  }),
);

export const addCharacterBorgImplant = createAction(
  ADD_CHARACTER_BORG_IMPLANT,
  (type: BorgImplantType) => ({ payload: { type } }),
);

export const addCharacterBorgImplantSpeciesOption = createAction(
  ADD_CHARACTER_BORG_IMPLANT_SPECIES_OPTION,
  (type: BorgImplantType) => ({ payload: { type } }),
);

export const addCharacterUntappedPotentialAttribute = createAction(
  ADD_CHARACTER_UNTAPPED_POTENTIAL_ATTRIBUTE,
  (attribute: Attribute) => ({ payload: { attribute } }),
);

export const removeCharacterBorgImplant = createAction(
  REMOVE_CHARACTER_BORG_IMPLANT,
  (type: BorgImplantType) => ({ payload: { type } }),
);

export const removeCharacterBorgImplantSpeciesOption = createAction(
  REMOVE_CHARACTER_BORG_IMPLANT_SPECIES_OPTION,
  (type: BorgImplantType) => ({ payload: { type } }),
);

export const setCharacterSpecies = createAction(
  SET_CHARACTER_SPECIES,
  (
    species: Species,
    attributes: Attribute[] = [],
    mixedSpecies?: Species,
    originalSpecies?: Species,
    customSpeciesName?: string,
    decrementAttributes: Attribute[] = [],
  ) => {
    const payload: any = {
      species,
      attributes,
      mixedSpecies,
      originalSpecies,
      customSpeciesName,
      decrementAttributes,
    };
    const ability = SpeciesAbilityList.instance.getBySpecies(species);
    if (ability && (ability.source == null || hasSource(ability.source))) {
      payload['ability'] = ability;
    }
    return { payload };
  },
);

export const setSupportingCharacterSupervisory = createAction(
  SET_SUPPORTING_CHARACTER_SUPERVISORY,
  (supervisory: boolean) => ({ payload: { supervisory } }),
);

export const setSupportingCharacterDepartments = createAction(
  SET_SUPPORTING_CHARACTER_DISCIPLINES,
  (disciplines: Department[]) => ({ payload: { disciplines } }),
);

export const setNpcCharacterDepartments = createAction(
  SET_NPC_CHARACTER_DEPARTMENTS,
  (departments: number[]) => ({ payload: { departments } }),
);

export const setNpcCharacterAttributes = createAction(
  SET_NPC_CHARACTER_ATTRIBUTES,
  (attributes: number[]) => ({ payload: { attributes } }),
);

export const setNpcCharacterTalents = createAction(
  SET_NPC_CHARACTER_TALENTS,
  (talents: SelectedTalent[]) => ({ payload: { talents } }),
);

export const addNpcCharacterEquipment = createAction(
  ADD_NPC_CHARACTER_EQUIPMENT,
  (equipment: EquipmentType | EquipmentModel) => ({ payload: { equipment } }),
);

export const addNpcCharacterWeapon = createAction(
  ADD_NPC_CHARACTER_WEAPON,
  (weapon: PersonalWeaponType) => ({ payload: { weapon } }),
);

export const removeNpcCharacterEquipment = createAction(
  REMOVE_NPC_CHARACTER_EQUIPMENT,
  (equipment: EquipmentType | EquipmentModel) => ({ payload: { equipment } }),
);

export const removeNpcCharacterWeapon = createAction(
  REMOVE_NPC_CHARACTER_WEAPON,
  (weapon: PersonalWeaponType) => ({ payload: { weapon } }),
);

export const setSupportingCharacterAttributes = createAction(
  SET_SUPPORTING_CHARACTER_ATTRIBUTES,
  (attributes: Attribute[]) => ({ payload: { attributes } }),
);

export const setCharacterEnvironment = createAction(
  SET_CHARACTER_ENVIRONMENT,
  (environment: Environment, otherSpecies?: Species) => ({
    payload: { environment, otherSpecies },
  }),
);

export const setCharacterEducation = createAction(
  SET_CHARACTER_EDUCATION,
  (track: Track, enlisted: boolean = false) => ({
    payload: { track, enlisted },
  }),
);

export const setCharacterFinishingTouches = createAction(
  SET_CHARACTER_FINISHING_TOUCHES,
  () => ({ payload: {} }),
);

export const addCharacterCareerEvent = createAction(
  ADD_CHARACTER_CAREER_EVENT,
  (
    eventId: number,
    context: StepContext,
    attribute?: Attribute,
    discipline?: Department,
  ) => ({
    payload: { eventId, attribute, discipline, context },
  }),
);

export const setCharacterEarlyOutlook = createAction(
  SET_CHARACTER_EARLY_OUTLOOK,
  (earlyOutlook: EarlyOutlookModel, accepted: boolean = true) => ({
    payload: { earlyOutlook, accepted },
  }),
);

export const setCharacterFocus = createAction(
  SET_CHARACTER_FOCUS,
  (focus: string, context: StepContext, index: number = 0) => ({
    payload: { focus, context, index },
  }),
);

export const addCharacterTalentFocus = createAction(
  ADD_CHARACTER_TALENT_FOCUS,
  (focus: string, talent: string, index: number = 0) => ({
    payload: { focus, talent, index },
  }),
);

export const setCharacterSpeciesAbilityFocus = createAction(
  ADD_CHARACTER_SPECIES_ABILITY_FOCUS,
  (focus: string, index: number = 0) => ({ payload: { focus, index } }),
);

export const setCharacterSpeciesAbilityChoice = createAction(
  SET_CHARACTER_SPECIES_ABILITY_CHOICE,
  (choice?: SpeciesAbilityChoice) => ({ payload: { choice } }),
);

export const addCharacterLogEntry = createAction(
  ADD_CHARACTER_LOG_ENTRY,
  (logEntry: LogEntry) => ({ payload: { logEntry } }),
);

export const addCharacterTalentValue = createAction(
  ADD_CHARACTER_TALENT_VALUE,
  (value: string, talent: string | ITalent) => {
    const talentName =
      typeof talent === 'string'
        ? (talent as string)
        : (talent as ITalent).name;
    return { payload: { value, talent: talentName } };
  },
);

export const addCharacterTalent = createAction(
  ADD_CHARACTER_TALENT,
  (talent: ITalent | SelectedTalent, context: StepContext) => ({
    payload: { talent, context },
  }),
);

export const setCharacterValue = createAction(
  SET_CHARACTER_VALUE,
  (value: string, context: StepContext) => ({ payload: { value, context } }),
);

export const updateCharacterGeneralEditValueChange = createAction(
  UPDATE_CHARACTER_GENERAL_EDIT_VALUE,
  (oldValue: ValueAssembly, newValue: string) => ({
    payload: { oldValue, newValue },
  }),
);

export const updateCharacterGeneralEditFocusChange = createAction(
  UPDATE_CHARACTER_GENERAL_EDIT_FOCUS,
  (oldValue: FocusAssembly, newValue: string) => ({
    payload: { oldValue, newValue },
  }),
);

export const updateCharacterGeneralEditTalentChange = createAction(
  UPDATE_CHARACTER_GENERAL_EDIT_TALENT,
  (oldValue: TalentAssembly, newValue: SelectedTalent) => ({
    payload: { oldValue, newValue },
  }),
);

export const updateCharacterGeneralEditSpeciesAbility = createAction(
  UPDATE_CHARACTER_GENERAL_EDIT_SPECIES_ABILITY,
  (species: Species) => {
    const payload: any = {};
    const ability = SpeciesAbilityList.instance.getBySpecies(species);
    if (ability && (ability.source == null || hasSource(ability.source))) {
      payload['ability'] = ability;
    }
    return { payload };
  },
);

export const addNpcCharacterValue = createAction(
  ADD_NPC_CHARACTER_VALUE,
  (value: string, index: number) => ({ payload: { value, index } }),
);

export const setCharacterName = createAction(SET_CHARACTER_NAME, (name) => ({
  payload: { name },
}));

export const setCharacterPastime = createAction(
  SET_CHARACTER_PASTIME,
  (pastime: string) => ({ payload: { pastime } }),
);

export const setCharacterAge = createAction(SET_CHARACTER_AGE, (age: Age) => ({
  payload: { age },
}));

export const setCharacterLineage = createAction(
  SET_CHARACTER_LINEAGE,
  (lineage: string) => ({ payload: { lineage } }),
);

export const setCharacterHouse = createAction(
  SET_CHARACTER_HOUSE,
  (house: string) => ({ payload: { house } }),
);

export const setCharacterCareerEventTrait = createAction(
  SET_CHARACTER_CAREER_EVENT_TRAIT,
  (trait: string, context: StepContext) => ({ payload: { trait, context } }),
);

export const setCharacterAdditionalTraits = createAction(
  SET_CHARACTER_ADDITIONAL_TRAITS,
  (traits: string) => ({ payload: { traits } }),
);

export const setCharacterRank = createAction(
  SET_CHARACTER_RANK,
  (name: string, rank?: Rank) => ({ payload: { name, rank } }),
);

export const setCharacterAssignment = createAction(
  SET_CHARACTER_ROLE,
  (role?: string | Role, secondaryRole?: Role) => ({
    payload: { role, secondaryRole },
  }),
);

export const setCharacterAssignedShip = createAction(
  SET_CHARACTER_ASSIGNED_SHIP,
  (assignedShip: string) => ({ payload: { assignedShip } }),
);

export const setCharacterPronouns = createAction(
  SET_CHARACTER_PRONOUNS,
  (pronouns: string) => ({ payload: { pronouns } }),
);

export const setCharacterType = createAction(
  SET_CHARACTER_TYPE,
  (type: CharacterType) => ({ payload: { type } }),
);

export const setCharacterCareerLength = createAction(
  SET_CHARACTER_CAREER_LENGTH,
  (careerLength: Career) => ({ payload: { careerLength } }),
);

export const modifyCharacterAttribute = createAction(
  MODIFY_CHARACTER_ATTRIBUTE,
  (
    attribute: Attribute,
    context: StepContext,
    positive: boolean = true,
    forceDecrement: boolean = false,
  ) => ({ payload: { attribute, context, positive, forceDecrement } }),
);

export const modifyCharacterDiscipline = createAction(
  MODIFY_CHARACTER_DISCIPLINE,
  (
    discipline: Department,
    context: StepContext,
    positive: boolean = true,
    primaryDisciplines: Department[] = [],
    forceDecrement: boolean = false,
  ) => ({
    payload: {
      discipline,
      context,
      positive,
      primaryDisciplines,
      forceDecrement,
    },
  }),
);

export const modifyCharacterReputation = createAction(
  MODIFY_CHARACTER_REPUTATION,
  (delta: number) => ({ payload: { delta } }),
);

export const modifyCharacterRank = createAction(
  MODIFY_CHARACTER_RANK,
  (
    rank: CharacterRank,
    type: ModificationType.Promotion | ModificationType.Demotion,
  ) => ({
    payload: { rank, type },
  }),
);

export const modifyCharacterAddAdvancement = createAction(
  MODIFY_CHARACTER_ADD_ADVANCEMENT,
  (
    type: CharacterAdvancementChoice,
    value: string | Attribute | Department | SelectedTalent,
    removeValue?: string | Attribute | Department | SelectedTalent,
    logEntry?: LogEntry,
    logEntryCallback?: LogEntry,
  ) => {
    const payload: any = { type, value, logEntry, logEntryCallback };
    if (removeValue != null) {
      payload['remove'] = removeValue;
    }
    return { payload };
  },
);
