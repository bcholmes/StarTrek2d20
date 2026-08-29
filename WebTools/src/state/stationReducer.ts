import { createSlice } from '@reduxjs/toolkit';
import type { Station } from '../common/station';
import {
  CustomStationSpaceframeStep,
  StandardStationSpaceframeStep,
  StationMissionProfileStep,
} from '../common/station';
import { StationFrame } from '../helpers/stationFrame';
import {
  addStationWeapon,
  changeStationCustomFrameDepartment,
  changeStationCustomFrameSystem,
  createStation,
  deleteStationWeapon,
  setStationAdditionalTalents,
  setStationCustomScale,
  setStationFrame,
  setStationFrameAppearance,
  setStationMissionProfile,
  setStationMissionProfileTalent,
  setStationName,
  setStationTraits,
} from './stationActions';

interface StationState {
  station?: Station;
}

const withStation = (
  state: any,
  action: any,
  mutate: (s: Station, action: any) => void,
): StationState => {
  const s = state.station?.copy();
  if (s) {
    mutate(s, action);
  }
  return {
    ...state,
    station: s,
  };
};

export const stationSlice = createSlice({
  name: 'station',
  initialState: { station: undefined } as StationState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createStation, (state, action) => {
      const s = action.payload.station;
      console.log('Create a station');
      return {
        ...state,
        station: s.copy(),
      };
    });
    builder.addCase(setStationMissionProfile, (state, action) =>
      withStation(state, action, (s, action) => {
        const original = s.missionProfileStep;
        s.missionProfileStep = new StationMissionProfileStep(
          action.payload.missionProfile,
        );
        if (original?.type === s.missionProfileStep?.type) {
          s.missionProfileStep.talent = original?.talent?.copy();
        }
      }),
    );
    builder.addCase(setStationMissionProfileTalent, (state, action) =>
      withStation(state, action, (s, action) => {
        if (s.missionProfileStep) {
          s.missionProfileStep.talent = action.payload.talent;
        }
        for (let i = 0; i < s.additionalTalents.length;) {
          if (
            s.hasBaseTalent(s.additionalTalents[i].name) &&
            s.additionalTalents[i].talentModel.maxRank === 1
          ) {
            s.additionalTalents.splice(i, 1);
          } else {
            i++;
          }
        }
      }),
    );
    builder.addCase(setStationName, (state, action) =>
      withStation(state, action, (s, action) => {
        s.name = action.payload.name;
      }),
    );
    builder.addCase(setStationCustomScale, (state, action) =>
      withStation(state, action, (s, action) => {
        if (
          s.stationFrameStep == null ||
          !(s.stationFrameStep instanceof CustomStationSpaceframeStep)
        ) {
          s.stationFrameStep = new CustomStationSpaceframeStep();
        }
        s.stationFrameStep.scale = action.payload.scale;

        for (
          let i = s.sumDepartmentPoints;
          i > s.totalAvailableDepartmentPoints;
          i = s.sumDepartmentPoints
        ) {
          let maxValue = 0;
          let indexOfMax = 0;
          for (let j = 0; j < s.departments.length; j++) {
            if (s.departments[j] >= maxValue) {
              maxValue = s.departments[j];
              indexOfMax = j;
            }
          }
          s.stationFrameStep.departments[indexOfMax] -= 1;
        }
        for (
          let i = s.sumSystemPoints;
          i > s.totalAvailableSystemPoints;
          i = s.sumSystemPoints
        ) {
          let maxValue = 0;
          let indexOfMax = 0;
          for (let j = 0; j < s.systems.length; j++) {
            if (s.systems[j] >= maxValue) {
              maxValue = s.systems[j];
              indexOfMax = j;
            }
          }
          s.stationFrameStep.systems[indexOfMax] -= 1;
        }
        for (
          let i = s.additionalTalents.length;
          i > s.freeTalentSlots;
          i = s.additionalTalents.length
        ) {
          s.additionalTalents.splice(0, 1);
        }
      }),
    );
    builder.addCase(changeStationCustomFrameSystem, (state, action) =>
      withStation(state, action, (s, action) => {
        if (
          s.stationFrameStep == null ||
          !(s.stationFrameStep instanceof CustomStationSpaceframeStep)
        ) {
          s.stationFrameStep = new CustomStationSpaceframeStep();
        }
        const system = action.payload.system;
        s.stationFrameStep.systems[system] += action.payload.delta;
        if (s.stationFrameStep.systems[system] > s.maxSystemValue) {
          s.stationFrameStep.systems[system] = s.maxSystemValue;
        }
      }),
    );
    builder.addCase(changeStationCustomFrameDepartment, (state, action) =>
      withStation(state, action, (s, action) => {
        if (
          s.stationFrameStep == null ||
          !(s.stationFrameStep instanceof CustomStationSpaceframeStep)
        ) {
          s.stationFrameStep = new CustomStationSpaceframeStep();
        }
        const department = action.payload.department;
        s.stationFrameStep.departments[department] += action.payload.delta;
        if (s.stationFrameStep.departments[department] > s.maxDepartmentValue) {
          s.stationFrameStep.departments[department] = s.maxDepartmentValue;
        }
      }),
    );
    builder.addCase(addStationWeapon, (state, action) =>
      withStation(state, action, (s, action) => {
        s.weapons.push(action.payload.weapon);
      }),
    );
    builder.addCase(deleteStationWeapon, (state, action) =>
      withStation(state, action, (s, action) => {
        if (s.weapons.indexOf(action.payload.weapon) >= 0) {
          s.weapons.splice(s.weapons.indexOf(action.payload.weapon), 1);
        }
      }),
    );
    builder.addCase(setStationAdditionalTalents, (state, action) =>
      withStation(state, action, (s, action) => {
        s.additionalTalents =
          action.payload.talents?.map((t) => t.copy()) ?? [];
      }),
    );
    builder.addCase(setStationTraits, (state, action) =>
      withStation(state, action, (s, action) => {
        s.traits = action.payload.traits;
      }),
    );
    builder.addCase(setStationFrameAppearance, (state, action) =>
      withStation(state, action, (s, action) => {
        if (s?.stationFrameStep?.type === StationFrame.Custom) {
          (s.stationFrameStep as CustomStationSpaceframeStep).appearance =
            action.payload.appearance;
        }
      }),
    );
    builder.addCase(setStationFrame, (state, action) =>
      withStation(state, action, (s, action) => {
        if (action.payload.frame === StationFrame.Custom) {
          const scale = s.scale;
          s.stationFrameStep = CustomStationSpaceframeStep.create(scale);
        } else {
          const temp = new StandardStationSpaceframeStep(action.payload.frame);
          s.stationFrameStep = temp;
          const frameModel = temp.model;
          if (frameModel.missionProfiles?.length === 1) {
            s.missionProfileStep = new StationMissionProfileStep(
              temp.model.missionProfiles[0].profile,
            );
          } else {
            s.missionProfileStep = null;
          }
          s.weapons = [];
        }
        for (let i = 0; i < s.additionalTalents.length;) {
          if (
            s.hasBaseTalent(s.additionalTalents[i].name) &&
            s.additionalTalents[i].talentModel.maxRank === 1
          ) {
            s.additionalTalents.splice(i, 1);
          } else {
            i++;
          }
        }

        for (
          let i = s.additionalTalents.length;
          i > s.freeTalentSlots;
          i = s.additionalTalents.length
        ) {
          s.additionalTalents.splice(0, 1);
        }
      }),
    );
  },
});

export const stationReducer = stationSlice.reducer;
