import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import {
  CareerStep,
  Character,
  EducationStep,
  EnvironmentStep,
  FinishingStep,
  SpeciesStep,
  UpbringingStep,
} from '../../common/character';
import { CharacterType } from '../../common/characterType';
import { AgeHelper } from '../../helpers/age';
import { Department } from '../../helpers/department';
import { Species } from '../../helpers/speciesEnum';
import { Track } from '../../helpers/trackEnum';
import {
  setCharacterAge,
  setCharacterCareerLength,
  setCharacterEarlyOutlook,
  setCharacterEducation,
  setCharacterEnvironment,
  setCharacterFinishingTouches,
  setCharacterSpecies,
  setCharacterType,
} from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

const trackDefaults = (track: Track, step: EducationStep) => {
  switch (track) {
    case Track.EnlistedSecurityTraining:
      step.primaryDiscipline = Department.Security;
      step.disciplines = [Department.Security, Department.Conn];
      step.focuses[2] = 'Chain of Command';
      break;
    case Track.ShipOperations:
      step.primaryDiscipline = Department.Conn;
      step.disciplines = [Department.Engineering, Department.Science];
      break;
    case Track.UniversityAlumni:
      step.primaryDiscipline = Department.Science;
      step.disciplines = [Department.Engineering, Department.Command];
      break;
    case Track.ResearchInternship:
      step.primaryDiscipline = Department.Science;
      step.disciplines = [Department.Engineering, Department.Medicine];
      break;
    default:
      break;
  }
};

export const registerStepSelectionReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(setCharacterSpecies, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const originalStep = temp.speciesStep;
      temp.speciesStep = new SpeciesStep(action.payload.species);
      if (action.payload.attributes) {
        temp.speciesStep.attributes = [...action.payload.attributes];
      }
      if (action.payload.decrementAttributes?.length) {
        temp.speciesStep.decrementAttributes = [
          ...action.payload.decrementAttributes,
        ];
      }
      if (originalStep) {
        if (originalStep.species === temp.speciesStep.species) {
          if (originalStep.attributes?.length) {
            if (
              originalStep.originalSpecies != null &&
              originalStep.originalSpecies === action.payload.originalSpecies
            ) {
              temp.speciesStep.attributes = [...originalStep.attributes];
            } else if (
              originalStep.mixedSpecies != null &&
              originalStep.mixedSpecies === action.payload.mixedSpecies
            ) {
              temp.speciesStep.attributes = [...originalStep.attributes];
            }
          }
          if (temp.speciesStep.species === Species.Custom) {
            temp.speciesStep.customSpeciesName = originalStep.customSpeciesName;
          }
          temp.speciesStep.mixedSpecies = originalStep.mixedSpecies;
          temp.speciesStep.originalSpecies = originalStep.originalSpecies;
          temp.speciesStep.talent = originalStep.talent?.copy();
          temp.speciesStep.abilityOptions = originalStep.abilityOptions?.copy();
        }
      }
      if (temp.version > 1) {
        const ability = action.payload.ability;
        if (ability) {
          temp.speciesStep.ability = ability;
        }
      }

      temp.speciesStep.mixedSpecies = action.payload.mixedSpecies;
      temp.speciesStep.originalSpecies = action.payload.originalSpecies;
      if (
        temp.speciesStep.species === Species.Custom &&
        action.payload.customSpeciesName
      ) {
        temp.speciesStep.customSpeciesName = action.payload.customSpeciesName;
      }
    });
  });
  builder.addCase(setCharacterAge, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.age = action.payload.age;
      if (temp.educationStep == null) {
        temp.educationStep = new EducationStep();
      }
    });
  });
  builder.addCase(setCharacterCareerLength, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.careerStep = new CareerStep(action.payload.careerLength);
    });
  });
  builder.addCase(setCharacterEducation, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const originalStep = temp.educationStep;
      temp.educationStep = new EducationStep(
        action.payload.track,
        action.payload.enlisted,
      );
      trackDefaults(action.payload.track, temp.educationStep);
      if (originalStep) {
        if (originalStep.track === temp.educationStep.track) {
          temp.educationStep.attributes = [...originalStep.attributes];
          temp.educationStep.primaryDiscipline = originalStep.primaryDiscipline;
          temp.educationStep.decrementDisciplines = [
            ...originalStep.decrementDisciplines,
          ];
          temp.educationStep.disciplines = [...originalStep.disciplines];
          temp.educationStep.focuses = [...originalStep.focuses];
          temp.educationStep.value = originalStep.value;
          temp.educationStep.talent = originalStep.talent?.copy();
        }
      }
    });
  });
  builder.addCase(setCharacterFinishingTouches, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const originalStep = temp.finishingStep;
      temp.finishingStep = new FinishingStep();
      if (originalStep) {
        temp.finishingStep.attributes = [...originalStep.attributes];
        temp.finishingStep.disciplines = [...originalStep.disciplines];
        temp.finishingStep.value = originalStep.value;
        temp.finishingStep.talent = originalStep.talent?.copy();

        if (temp.attributeTotal < Character.totalAttributeSum(temp)) {
          temp.finishingStep.attributes = [];
        }
        if (temp.skillTotal < Character.totalDepartmentSum(temp)) {
          temp.finishingStep.disciplines = [];
        }
      }
    });
  });
  builder.addCase(setCharacterEnvironment, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const originalStep = temp.environmentStep;
      temp.environmentStep = new EnvironmentStep(
        action.payload.environment,
        action.payload.otherSpecies,
      );
      if (originalStep) {
        if (originalStep.environment === temp.environmentStep.environment) {
          temp.environmentStep.discipline = originalStep.discipline;
          if (originalStep.otherSpecies === temp.environmentStep.otherSpecies) {
            temp.environmentStep.attribute = originalStep.attribute;
          }
          temp.environmentStep.value = originalStep.value;
        }
      }
    });
  });
  builder.addCase(setCharacterEarlyOutlook, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const originalStep = temp.upbringingStep;
      temp.upbringingStep = new UpbringingStep(
        action.payload.earlyOutlook,
        action.payload.accepted,
      );
      if (originalStep) {
        if (
          originalStep.upbringing?.id === temp.upbringingStep.upbringing?.id
        ) {
          temp.upbringingStep.discipline = originalStep.discipline;
        }
        temp.upbringingStep.focus = originalStep.focus;
        temp.upbringingStep.talent = originalStep.talent?.copy();
      }
    });
  });
  builder.addCase(setCharacterType, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const originalType = temp.type;
      temp.type = action.payload.type;
      if (temp.type !== originalType) {
        if (temp.educationStep) {
          temp.educationStep = undefined;
        }

        if (
          originalType === CharacterType.Child &&
          temp.type !== CharacterType.Child
        ) {
          temp.age = AgeHelper.getAdultAge();
        } else if (
          originalType !== CharacterType.Child &&
          temp.type === CharacterType.Child
        ) {
          temp.age = AgeHelper.getAllChildAges()[0];
        }
      }
      if (temp.type === CharacterType.Child && temp.supportingStep) {
        temp.supportingStep.supervisory = false;
      }
    });
  });
};
