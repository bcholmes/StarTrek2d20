import { createAction } from '@reduxjs/toolkit';
import type { SelectedTalent } from '../common/selectedTalent';
import type { Station } from '../common/station';
import type { Department } from '../helpers/department';
import type { MissionProfile } from '../helpers/missionProfiles';
import type {
  StationFrame,
  StationFrameAppearance,
} from '../helpers/stationFrame';
import type { System } from '../helpers/systems';
import type { Weapon } from '../helpers/weapons';

export const CREATE_STATION = 'CREATE_STATION';
export const SET_STATION_MISSION_PROFILE = 'SET_STATION_MISSION_PROFILE';
export const SET_STATION_NAME = 'SET_STATION_NAME';
export const SET_STATION_TRAITS = 'SET_STATION_TRAITS';
export const SET_STATION_CUSTOM_SCALE = 'SET_STATION_CUSTOM_SCALE';
export const MODIFY_STATION_CUSTOM_FRAME_SYSTEM =
  'MODIFY_STATION_CUSTOM_FRAME_SYSTEM';
export const MODIFY_STATION_CUSTOM_FRAME_DEPARTMENT =
  'MODIFY_STATION_CUSTOM_FRAME_DEPARTMENT';
export const ADD_STATION_WEAPON = 'ADD_STATION_WEAPON';
export const DELETE_STATION_WEAPON = 'DELETE_STATION_WEAPON';
export const SET_STATION_MISSION_PROFILE_TALENT =
  'SET_STATION_MISSION_PROFILE_TALENT';
export const SET_STATION_ADDITIONAL_TALENTS = 'SET_STATION_ADDITIONAL_TALENTS';
export const SET_STATION_FRAME = 'SET_STATION_FRAME';
export const SET_STATION_FRAME_APPEARANCE = 'SET_STATION_FRAME_APPEARANCE';

export const createStation = createAction(
  CREATE_STATION,
  (station: Station) => ({
    payload: { station: station },
  }),
);

export const setStationMissionProfile = createAction(
  SET_STATION_MISSION_PROFILE,
  (missionProfile: MissionProfile) => ({
    payload: { missionProfile: missionProfile },
  }),
);

export const setStationMissionProfileTalent = createAction(
  SET_STATION_MISSION_PROFILE_TALENT,
  (talent: SelectedTalent) => ({
    payload: { talent: talent },
  }),
);

export const setStationName = createAction(
  SET_STATION_NAME,
  (name: string) => ({
    payload: { name: name },
  }),
);

export const setStationCustomScale = createAction(
  SET_STATION_CUSTOM_SCALE,
  (scale: number) => ({
    payload: { scale: scale },
  }),
);

export const setStationTraits = createAction(
  SET_STATION_TRAITS,
  (traits: string[]) => ({
    payload: { traits: traits },
  }),
);

export const changeStationCustomFrameSystem = createAction(
  MODIFY_STATION_CUSTOM_FRAME_SYSTEM,
  (delta: number, system: System) => ({
    payload: { delta: delta, system: system },
  }),
);

export const changeStationCustomFrameDepartment = createAction(
  MODIFY_STATION_CUSTOM_FRAME_DEPARTMENT,
  (delta: number, department: Department) => ({
    payload: { delta: delta, department: department },
  }),
);

export const addStationWeapon = createAction(
  ADD_STATION_WEAPON,
  (weapon: Weapon) => ({
    payload: { weapon: weapon },
  }),
);

export const deleteStationWeapon = createAction(
  DELETE_STATION_WEAPON,
  (weapon: Weapon) => ({
    payload: { weapon: weapon },
  }),
);

export const setStationAdditionalTalents = createAction(
  SET_STATION_ADDITIONAL_TALENTS,
  (talents: SelectedTalent[]) => ({
    payload: { talents: talents },
  }),
);

export const setStationFrame = createAction(
  SET_STATION_FRAME,
  (frame: StationFrame) => ({
    payload: { frame: frame },
  }),
);

export const setStationFrameAppearance = createAction(
  SET_STATION_FRAME_APPEARANCE,
  (appearance: StationFrameAppearance) => ({
    payload: { appearance: appearance },
  }),
);
