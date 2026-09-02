import { createSlice } from '@reduxjs/toolkit';
import { Stereotype } from '../common/construct';
import type { SelectedTalent } from '../common/selectedTalent';
import {
  MissionProfileStep,
  ServiceRecordStep,
  SimpleStats,
  SpaceframeStep,
  Starship,
  StarshipAdvancementStep,
} from '../common/starship';
import { StarshipAdvancementChoice } from '../common/starshipAdvancementChoice';
import type { System } from '../helpers/systems';
import { ShipBuildWorkflow } from '../starship/model/shipBuildWorkflow';
import {
  addStarshipRefit,
  addStarshipWeapon,
  changeStarshipScale,
  changeStarshipSimpleClassName,
  changeStarshipSimpleDepartment,
  changeStarshipSimpleSystem,
  changeStarshipSpaceframeClassName,
  changeStarshipSpaceframeDepartment,
  changeStarshipSpaceframeScale,
  changeStarshipSpaceframeServiceYear,
  changeStarshipSpaceframeSystem,
  createNewStarship,
  createStarship,
  deleteStarshipRefit,
  deleteStarshipWeapon,
  modifyStarshipAddAdvancement,
  nextStarshipWorkflowStep,
  rewindToStarshipWorkflowStep,
  setAdditionalTalents,
  setStarshipMissionPod,
  setStarshipMissionProfile,
  setStarshipMissionProfileTalent,
  setStarshipName,
  setStarshipRegistry,
  setStarshipServiceRecord,
  setStarshipServiceYear,
  setStarshipSpaceframe,
  setStarshipSpaceframeAppearance,
  setStarshipSpaceframeTalents,
  setStarshipTraits,
} from './starshipActions';

interface StarshipState {
  starship?: Starship;
  workflow?: ShipBuildWorkflow;
  hash?: number;
}

const initialState = {
  starship: undefined,
  workflow: undefined,
  hash: undefined,
};

const withStarship = (
  state: any,
  action: any,
  mutate: (s: Starship, action: any) => void,
): StarshipState => {
  const s = state.starship.copy();
  mutate(s, action);
  return {
    ...state,
    starship: s,
  };
};

export const starshipSlice = createSlice({
  name: 'starship',
  initialState: initialState as StarshipState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createStarship, (state, action) => {
      const s = action.payload.starship;
      const hash = action.payload.hash;
      return {
        ...state,
        starship: s.copy(),
        hash: hash,
      };
    });

    builder.addCase(modifyStarshipAddAdvancement, (state, action) => {
      const temp = state.starship.copy();
      const improvement = new StarshipAdvancementStep();
      improvement.choice = action.payload.type;
      if (action.payload.type === StarshipAdvancementChoice.Talent) {
        improvement.value = (action.payload.value as SelectedTalent).copy();
        if (action.payload.remove != null) {
          improvement.removeValue = (
            action.payload.remove as SelectedTalent
          ).copy();
        }
        temp.advancementSteps.push(improvement);
      } else {
        improvement.value = action.payload.value;
        if (action.payload.remove != null) {
          improvement.removeValue = action.payload.remove;
        }
        temp.advancementSteps.push(improvement);
      }
      return {
        ...state,
        starship: temp,
      };
    });

    builder.addCase(createNewStarship, (state, action) => {
      const s = Starship.createStandardStarship(
        action.payload.era,
        action.payload.type,
        action.payload.version,
      );
      s.serviceYear = action.payload.serviceYear;
      if (action.payload.buildType != null) {
        s.buildType = action.payload.buildType;
      }
      if (action.payload.simple) {
        s.stereotype = Stereotype.SimpleStarship;
        s.simpleStats = new SimpleStats();
        s.simpleStats.scale = action.payload.simple.scale;
        s.simpleStats.systems = [...action.payload.simple.systems];
        s.simpleStats.departments = [...action.payload.simple.departments];
        s.simpleStats.className = action.payload.simple.className;
      }
      return {
        ...state,
        starship: s,
        workflow: action.payload.workflow,
        hash: undefined,
      };
    });
    builder.addCase(changeStarshipScale, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s.simpleStats == null) {
          s.simpleStats = new SimpleStats();
        }
        s.simpleStats.scale += action.payload.delta;
        s.pruneExcessTalents();
      });
    });
    builder.addCase(changeStarshipSpaceframeScale, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s?.spaceframeModel?.isCustom) {
          const original = s.spaceframeStep;
          const spaceframe = s.spaceframeModel.copy();
          spaceframe.scale += action.payload.delta;
          s.spaceframeStep = new SpaceframeStep(spaceframe);
          if (original?.appearance != null) {
            s.spaceframeStep.appearance = original.appearance;
          }
        }
        s.pruneExcessTalents();
      });
    });
    builder.addCase(changeStarshipSpaceframeServiceYear, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s?.spaceframeModel?.isCustom) {
          const original = s.spaceframeStep;
          const spaceframe = s.spaceframeModel.copy();
          spaceframe.serviceYear = action.payload.serviceYear;
          s.spaceframeStep = new SpaceframeStep(spaceframe);
          if (original?.appearance != null) {
            s.spaceframeStep.appearance = original.appearance;
          }
        }
      });
    });
    builder.addCase(setStarshipServiceYear, (state, action) => {
      return withStarship(state, action, (s, action) => {
        s.serviceYear = action.payload.serviceYear;
      });
    });
    builder.addCase(changeStarshipSpaceframeClassName, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s?.spaceframeModel?.isCustom) {
          const original = s.spaceframeStep;
          const spaceframe = s.spaceframeModel.copy();
          spaceframe.name = action.payload.className;
          s.spaceframeStep = new SpaceframeStep(spaceframe);
          if (original?.appearance != null) {
            s.spaceframeStep.appearance = original.appearance;
          }
        }
      });
    });
    builder.addCase(changeStarshipSimpleClassName, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s.simpleStats == null) {
          s.simpleStats = new SimpleStats();
        }
        s.simpleStats.className = action.payload.className;
      });
    });
    builder.addCase(setStarshipName, (state, action) => {
      return withStarship(state, action, (s, action) => {
        s.name = action.payload.name;
      });
    });
    builder.addCase(setStarshipServiceRecord, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (action.payload.serviceRecord == null) {
          s.serviceRecordStep = null;
        } else {
          const original = s.serviceRecordStep;
          s.serviceRecordStep = new ServiceRecordStep(
            action.payload.serviceRecord,
          );
          s.serviceRecordStep.specialRule = action.payload.talent;
          if (original?.type?.type === s.serviceRecordStep.type.type) {
            s.serviceRecordStep.selection = original.selection;
            s.serviceRecordStep.system = original.system;
          }
          if (action.payload.selection != null) {
            if (typeof action.payload.selection === 'string') {
              s.serviceRecordStep.selection = action.payload
                .selection as string;
            } else {
              s.serviceRecordStep.system = action.payload.selection as System;
            }
          }
          if (action.payload.removedTalent != null) {
            s.serviceRecordStep.removedTalent = action.payload.removedTalent;
          }
          if (action.payload.replacedTalent != null) {
            s.serviceRecordStep.selectedTalent =
              action.payload.replacedTalent.copy();
          }
        }
      });
    });
    builder.addCase(setStarshipSpaceframe, (state, action) => {
      return withStarship(state, action, (s, action) => {
        const original = s.spaceframeModel;
        s.spaceframeStep = new SpaceframeStep(action.payload.spaceframe);
        if (original != null && s.spaceframeModel?.scale < original?.scale) {
          s.pruneExcessTalents();
        }
        s.spaceframeStep.variant = action.payload.variant;
      });
    });
    builder.addCase(setStarshipSpaceframeTalents, (state, action) => {
      return withStarship(state, action, (s, action) => {
        const newStep = s.spaceframeStep.copy();
        newStep.talents = action.payload.talents;
        s.spaceframeStep = newStep;
      });
    });
    builder.addCase(setStarshipMissionProfile, (state, action) => {
      return withStarship(state, action, (s, action) => {
        const original = s.missionProfileStep;
        s.missionProfileStep = new MissionProfileStep(
          action.payload.missionProfile,
        );
        if (original?.type?.id === s.missionProfileStep?.type?.id) {
          s.missionProfileStep.system = original?.system;
          s.missionProfileStep.talent = original?.talent;
        }
        if (action.payload.system != null) {
          s.missionProfileStep.system = action.payload.system;
        }
      });
    });
    builder.addCase(setStarshipMissionProfileTalent, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s.missionProfileStep) {
          s.missionProfileStep.talent = action.payload.talent;
        }
      });
    });
    builder.addCase(setStarshipMissionPod, (state, action) => {
      return withStarship(state, action, (s, action) => {
        s.missionPodModel = action.payload.missionPod;
        if (s.missionPodModel == null) {
          s.missionPodReplacements = [];
        } else {
          const replacements = (action.payload.replacements ?? []).map((r) =>
            r?.copy(),
          );
          while (replacements.length < s.missionPodModel.talents.length) {
            replacements.push(undefined);
          }
          s.missionPodReplacements = replacements;
        }
        if (s.missionPodModel) {
          const podTalentNames = s.missionPodModel.talents.map((t) => t.name);
          s.additionalTalents = s.additionalTalents.filter(
            (t) => !podTalentNames.includes(t.name),
          );
          s.pruneExcessTalents();
        }
      });
    });
    builder.addCase(addStarshipRefit, (state, action) => {
      return withStarship(state, action, (s, action) => {
        const refits = [...s.refits, action.payload.refit];
        while (refits.length > s.numberOfRefits) {
          refits.splice(0, 1);
        }
        s.refits = refits;
      });
    });
    builder.addCase(deleteStarshipRefit, (state, action) => {
      return withStarship(state, action, (s, action) => {
        const refits = [...s.refits];
        const index = refits.indexOf(action.payload.refit);
        if (index >= 0) {
          refits.splice(index, 1);
        }
        s.refits = refits;
      });
    });
    builder.addCase(setStarshipRegistry, (state, action) => {
      return withStarship(state, action, (s, action) => {
        s.registry = action.payload.registry;
      });
    });
    builder.addCase(setStarshipTraits, (state, action) => {
      return withStarship(state, action, (s, action) => {
        s.traits = action.payload.traits;
      });
    });
    builder.addCase(setAdditionalTalents, (state, action) => {
      return withStarship(state, action, (s, action) => {
        s.additionalTalents =
          action.payload.talents?.map((t) => t.copy()) ?? [];
      });
    });
    builder.addCase(addStarshipWeapon, (state, action) => {
      return withStarship(state, action, (s, action) => {
        s.additionalWeapons.push(action.payload.weapon);
      });
    });
    builder.addCase(deleteStarshipWeapon, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s.additionalWeapons.indexOf(action.payload.weapon) >= 0) {
          s.additionalWeapons.splice(
            s.additionalWeapons.indexOf(action.payload.weapon),
            1,
          );
        }
      });
    });
    builder.addCase(changeStarshipSimpleSystem, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s.simpleStats == null) {
          s.simpleStats = new SimpleStats();
        }
        s.simpleStats.systems[action.payload.system] += action.payload.delta;
      });
    });
    builder.addCase(changeStarshipSpaceframeSystem, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s?.spaceframeModel?.isCustom) {
          const original = s.spaceframeStep;
          const spaceframe = s.spaceframeModel.copy();
          spaceframe.systems[action.payload.system] += action.payload.delta;
          s.spaceframeStep = new SpaceframeStep(spaceframe);
          if (original?.appearance != null) {
            s.spaceframeStep.appearance = original.appearance;
          }
        }
      });
    });
    builder.addCase(changeStarshipSimpleDepartment, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s.simpleStats == null) {
          s.simpleStats = new SimpleStats();
        }
        s.simpleStats.departments[action.payload.department] +=
          action.payload.delta;
      });
    });
    builder.addCase(changeStarshipSpaceframeDepartment, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s?.spaceframeModel?.isCustom) {
          const original = s.spaceframeStep;
          const spaceframe = s.spaceframeModel.copy();
          spaceframe.departments[action.payload.department] +=
            action.payload.delta;
          s.spaceframeStep = new SpaceframeStep(spaceframe);
          if (original?.appearance != null) {
            s.spaceframeStep.appearance = original.appearance;
          }
        }
      });
    });
    builder.addCase(setStarshipSpaceframeAppearance, (state, action) => {
      return withStarship(state, action, (s, action) => {
        if (s.simpleStats != null) {
          s.simpleStats.appearance = action.payload.appearance;
        } else if (s?.spaceframeModel?.isCustom) {
          s.spaceframeStep.appearance = action.payload.appearance;
        }
      });
    });
    builder.addCase(nextStarshipWorkflowStep, (state) => {
      if (state.workflow) {
        const w = new ShipBuildWorkflow(state.workflow.steps);
        w.currentStepIndex = state.workflow.currentStepIndex + 1;
        return {
          ...state,
          workflow: w,
        };
      } else {
        return state;
      }
    });
    builder.addCase(rewindToStarshipWorkflowStep, (state, action) => {
      if (state.workflow) {
        const w = new ShipBuildWorkflow(state.workflow.steps);
        w.currentStepIndex = action.payload.index;
        return {
          ...state,
          workflow: w,
        };
      } else {
        return state;
      }
    });
  },
});

export const starshipReducer = starshipSlice.reducer;
