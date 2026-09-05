import { createAction } from '@reduxjs/toolkit';
import type { CharacterType } from '../common/characterType';
import type { SelectedTalent } from '../common/selectedTalent';
import { ShipBuildType } from '../common/shipBuildType';
import type { SimpleStats, Starship } from '../common/starship';
import type { StarshipAdvancementChoice } from '../common/starshipAdvancementChoice';
import type { Department } from '../helpers/department';
import type { Era } from '../helpers/erasEnum';
import type { MissionPodModel } from '../helpers/missionPods';
import type { MissionProfileModel } from '../helpers/missionProfiles';
import type { SpaceframeAppearance } from '../helpers/spaceframeAppearance';
import type { SpaceframeModel } from '../helpers/spaceframeModel';
import type { SpaceframeVariant } from '../helpers/spaceframeVariant';
import type { System } from '../helpers/systems';
import type { TalentModel } from '../helpers/talentModel';
import type { Weapon } from '../helpers/weapons';
import type { ServiceRecordModel } from '../starship/model/serviceRecord';
import type { ShipBuildWorkflow } from '../starship/model/shipBuildWorkflow';

export const CREATE_NEW_STARSHIP = 'CREATE_NEW_STARSHIP';
export const CREATE_STARSHIP = 'CREATE_STARSHIP';
export const CHANGE_STARSHIP_SCALE = 'CHANGE_STARSHIP_SCALE';
export const CHANGE_STARSHIP_SPACEFRAME_SCALE =
  'CHANGE_STARSHIP_SPACEFRAME_SCALE';
export const CHANGE_STARSHIP_SPACEFRAME_CLASS_NAME =
  'CHANGE_STARSHIP_SPACEFRAME_CLASS_NAME';
export const CHANGE_STARSHIP_SIMPLE_CLASS_NAME =
  'CHANGE_STARSHIP_SIMPLE_CLASS_NAME';
export const CHANGE_STARSHIP_SPACEFRAME_SYSTEM =
  'CHANGE_STARSHIP_SPACEFRAME_SYSTEM';
export const CHANGE_STARSHIP_SPACEFRAME_SERVICE_YEAR =
  'CHANGE_STARSHIP_SPACEFRAME_SERVICE_YEAR';
export const CHANGE_STARSHIP_SPACEFRAME_DEPARTMENT =
  'CHANGE_STARSHIP_SPACEFRAME_DEPARTMENT';
export const CHANGE_STARSHIP_SIMPLE_SYSTEM = 'CHANGE_STARSHIP_SIMPLE_SYSTEM';
export const CHANGE_STARSHIP_SIMPLE_DEPARTMENT =
  'CHANGE_STARSHIP_SIMPLE_DEPARTMENT';
export const NEXT_STARSHIP_WORKFLOW_STEP = 'NEXT_STARSHIP_WORKFLOW_STEP';
export const REWIND_TO_STARSHIP_WORKFLOW_STEP =
  'REWIND_TO_STARSHIP_WORKFLOW_STEP';
export const SET_STARSHIP_NAME = 'SET_STARSHIP_NAME';
export const SET_STARSHIP_REGISTRY = 'SET_STARSHIP_REGISTRY';
export const SET_STARSHIP_SPACEFRAME = 'SET_STARSHIP_SPACEFRAME';
export const SET_STARSHIP_MISSION_POD = 'SET_STARSHIP_MISSION_POD';
export const SET_STARSHIP_MISSION_PROFILE = 'SET_STARSHIP_MISSION_PROFILE';
export const SET_STARSHIP_MISSION_PROFILE_TALENT =
  'SET_STARSHIP_MISSION_PROFILE_TALENT';
export const SET_STARSHIP_TRAITS = 'SET_STARSHIP_TRAITS';
export const SET_ADDITIONAL_TALENTS = 'SET_ADDITIONAL_TALENTS';
export const ADD_STARSHIP_WEAPON = 'ADD_STARSHIP_WEAPON';
export const DELETE_STARSHIP_WEAPON = 'DELETE_STARSHIP_WEAPON';
export const ADD_STARSHIP_REFIT = 'ADD_STARSHIP_REFIT';
export const DELETE_STARSHIP_REFIT = 'DELETE_STARSHIP_REFIT';
export const SET_STARSHIP_SERVICE_YEAR = 'SET_STARSHIP_SERVICE_YEAR';
export const SET_STARSHIP_SERVICE_RECORD = 'SET_STARSHIP_SERVICE_RECORD';
export const SET_STARSHIP_SPACEFRAME_TALENTS =
  'SET_STARSHIP_SPACEFRAME_TALENTS';
export const MODIFY_STARSHIP_ADD_ADVANCEMENT =
  'MODIFY_STARSHIP_ADD_ADVANCEMENT';
export const SET_STARSHIP_SPACEFRAME_APPEARANCE =
  'SET_STARSHIP_SPACEFRAME_APPEARANCE';

export const createStarship = createAction(
  CREATE_STARSHIP,
  (starship: Starship, hash?: number) => ({
    payload: { starship: starship, hash: hash },
  }),
);

export const createNewStarship = createAction(
  CREATE_NEW_STARSHIP,
  (
    type: CharacterType,
    era: Era,
    serviceYear?: number,
    simple: SimpleStats = undefined,
    workflow?: ShipBuildWorkflow,
    buildType: ShipBuildType = ShipBuildType.Starship,
    version: number = 1,
  ) => ({
    payload: {
      type: type,
      era: era,
      serviceYear: serviceYear,
      simple: simple,
      workflow: workflow,
      buildType: buildType,
      version: version,
    },
  }),
);

export const changeStarshipScale = createAction(
  CHANGE_STARSHIP_SCALE,
  (delta: number) => ({ payload: { delta: delta } }),
);

export const changeStarshipSpaceframeScale = createAction(
  CHANGE_STARSHIP_SPACEFRAME_SCALE,
  (delta: number) => ({ payload: { delta: delta } }),
);

export const changeStarshipSpaceframeServiceYear = createAction(
  CHANGE_STARSHIP_SPACEFRAME_SERVICE_YEAR,
  (serviceYear: number) => ({ payload: { serviceYear: serviceYear } }),
);

export const setStarshipServiceYear = createAction(
  SET_STARSHIP_SERVICE_YEAR,
  (serviceYear: number) => ({ payload: { serviceYear: serviceYear } }),
);

export const changeStarshipSimpleClassName = createAction(
  CHANGE_STARSHIP_SIMPLE_CLASS_NAME,
  (className: string) => ({ payload: { className: className } }),
);

export const changeStarshipSpaceframeClassName = createAction(
  CHANGE_STARSHIP_SPACEFRAME_CLASS_NAME,
  (className: string) => ({ payload: { className: className } }),
);

export const setStarshipName = createAction(SET_STARSHIP_NAME, (name) => ({
  payload: { name },
}));

export const setStarshipSpaceframe = createAction(
  SET_STARSHIP_SPACEFRAME,
  (spaceframe: SpaceframeModel, variant?: SpaceframeVariant) => ({
    payload: { spaceframe, variant },
  }),
);

export const setStarshipSpaceframeTalents = createAction(
  SET_STARSHIP_SPACEFRAME_TALENTS,
  (talents: SelectedTalent[]) => ({ payload: { talents } }),
);

export const setStarshipServiceRecord = createAction(
  SET_STARSHIP_SERVICE_RECORD,
  (
    serviceRecord: ServiceRecordModel,
    talent: TalentModel,
    selection?: string | System,
    removedTalent?: string,
    replacedTalent?: SelectedTalent,
  ) => ({
    payload: {
      serviceRecord,
      talent,
      selection,
      removedTalent,
      replacedTalent,
    },
  }),
);

export const setStarshipMissionProfile = createAction(
  SET_STARSHIP_MISSION_PROFILE,
  (missionProfile: MissionProfileModel, system?: System) => ({
    payload: { missionProfile, system },
  }),
);

export const setStarshipMissionProfileTalent = createAction(
  SET_STARSHIP_MISSION_PROFILE_TALENT,
  (talent: SelectedTalent) => ({ payload: { talent } }),
);

export const setStarshipMissionPod = createAction(
  SET_STARSHIP_MISSION_POD,
  (
    missionPod: MissionPodModel,
    replacements?: (SelectedTalent | undefined)[],
  ) => ({ payload: { missionPod, replacements: replacements ?? [] } }),
);

export const addStarshipRefit = createAction(
  ADD_STARSHIP_REFIT,
  (refit: System) => ({ payload: { refit } }),
);

export const deleteStarshipRefit = createAction(
  DELETE_STARSHIP_REFIT,
  (refit: System) => ({ payload: { refit } }),
);

export const setStarshipRegistry = createAction(
  SET_STARSHIP_REGISTRY,
  (registry: string) => ({ payload: { registry } }),
);

export const setStarshipTraits = createAction(
  SET_STARSHIP_TRAITS,
  (traits: string) => ({ payload: { traits } }),
);

export const setStarshipSpaceframeAppearance = createAction(
  SET_STARSHIP_SPACEFRAME_APPEARANCE,
  (appearance?: SpaceframeAppearance) => ({ payload: { appearance } }),
);

export const setAdditionalTalents = createAction(
  SET_ADDITIONAL_TALENTS,
  (talents: SelectedTalent[]) => ({ payload: { talents } }),
);

export const changeStarshipSimpleSystem = createAction(
  CHANGE_STARSHIP_SIMPLE_SYSTEM,
  (delta: number, system: System) => ({ payload: { delta, system } }),
);

export const changeStarshipSpaceframeSystem = createAction(
  CHANGE_STARSHIP_SPACEFRAME_SYSTEM,
  (delta: number, system: System) => ({ payload: { delta, system } }),
);

export const changeStarshipSimpleDepartment = createAction(
  CHANGE_STARSHIP_SIMPLE_DEPARTMENT,
  (delta: number, department: Department) => ({
    payload: { delta, department },
  }),
);

export const changeStarshipSpaceframeDepartment = createAction(
  CHANGE_STARSHIP_SPACEFRAME_DEPARTMENT,
  (delta: number, department: Department) => ({
    payload: { delta, department },
  }),
);

export const nextStarshipWorkflowStep = createAction(
  NEXT_STARSHIP_WORKFLOW_STEP,
  () => ({ payload: {} }),
);

export const rewindToStarshipWorkflowStep = createAction(
  REWIND_TO_STARSHIP_WORKFLOW_STEP,
  (step: number) => ({ payload: { index: step } }),
);

export const addStarshipWeapon = createAction(
  ADD_STARSHIP_WEAPON,
  (weapon: Weapon) => ({ payload: { weapon } }),
);

export const deleteStarshipWeapon = createAction(
  DELETE_STARSHIP_WEAPON,
  (weapon: Weapon) => ({ payload: { weapon } }),
);

export const modifyStarshipAddAdvancement = createAction(
  MODIFY_STARSHIP_ADD_ADVANCEMENT,
  (
    type: StarshipAdvancementChoice,
    value: System | Department | SelectedTalent,
    removeValue?: System | Department | SelectedTalent,
  ) => {
    const payload: any = { type, value };
    if (removeValue != null) {
      payload['remove'] = removeValue;
    }
    return { payload };
  },
);
