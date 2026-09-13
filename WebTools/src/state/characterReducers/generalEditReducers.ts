import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { CharacterAdvancementStep } from '../../common/character';
import { AssemblyContext } from '../../common/characterAssembly';
import type {
  FocusAssembly,
  TalentAssembly,
  ValueAssembly,
} from '../../common/characterAssembly';
import { LogEntry } from '../../common/logEntry';
import type { SelectedTalent } from '../../common/selectedTalent';
import { CharacterAdvancementChoice } from '../../modify/model/characterAdvancementChoice';
import {
  updateCharacterGeneralEditFocusChange,
  updateCharacterGeneralEditSpeciesAbility,
  updateCharacterGeneralEditTalentChange,
  updateCharacterGeneralEditValueChange,
} from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

export const registerGeneralEditReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(updateCharacterGeneralEditSpeciesAbility, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.speciesStep.ability = action.payload.ability;
      temp.speciesStep.talent = undefined;
    });
  });
  builder.addCase(updateCharacterGeneralEditValueChange, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const oldValue = action.payload.oldValue as ValueAssembly;

      if (
        oldValue.context === AssemblyContext.FinishingTouches &&
        temp.finishingStep
      ) {
        temp.finishingStep.value = action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.Career &&
        temp.careerStep
      ) {
        temp.careerStep.value = action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.Education &&
        temp.educationStep
      ) {
        temp.educationStep.value = action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.Environment &&
        temp.environmentStep
      ) {
        temp.environmentStep.value = action.payload.newValue;
      } else if (oldValue.context === AssemblyContext.Talent) {
        const talent = temp.talents[oldValue.contextIndex];
        talent.value = action.payload.newValue;
      } else if (oldValue.context === AssemblyContext.Improvement) {
        const improvement = temp.improvements[oldValue.contextIndex];
        if (
          improvement instanceof LogEntry &&
          improvement.valuesUsed?.length &&
          oldValue.index != null
        ) {
          const values = improvement.valuesUsed;
          values[oldValue.index] = action.payload.newValue;
        } else if (
          improvement instanceof CharacterAdvancementStep &&
          improvement.choice === CharacterAdvancementChoice.Value
        ) {
          improvement.value = action.payload.newValue;
        }
      }
    });
  });
  builder.addCase(updateCharacterGeneralEditFocusChange, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const oldValue = action.payload.oldValue as FocusAssembly;

      if (
        oldValue.context === AssemblyContext.CareerEvent &&
        temp.careerEvents
      ) {
        temp.careerEvents[oldValue.contextIndex].focus =
          action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.Education &&
        temp.educationStep
      ) {
        temp.educationStep.focuses[oldValue.index] = action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.EarlyOutlook &&
        temp.upbringingStep
      ) {
        temp.upbringingStep.focus = action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.SpeciesAbility &&
        temp.speciesStep?.abilityOptions
      ) {
        temp.speciesStep.abilityOptions.focuses[oldValue.index] =
          action.payload.newValue;
      } else if (oldValue.context === AssemblyContext.Talent) {
        const talent = temp.talents[oldValue.contextIndex];
        talent.focuses[oldValue.index] = action.payload.newValue;
      } else if (oldValue.context === AssemblyContext.Improvement) {
        const improvement = temp.improvements[oldValue.contextIndex];
        if (
          improvement instanceof CharacterAdvancementStep &&
          improvement.choice === CharacterAdvancementChoice.Focus
        ) {
          improvement.value = action.payload.newValue;
        }
      }
    });
  });
  builder.addCase(updateCharacterGeneralEditTalentChange, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const oldValue = action.payload.oldValue as TalentAssembly;

      if (oldValue.context === AssemblyContext.Species && temp.speciesStep) {
        temp.speciesStep.talent = action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.EarlyOutlook &&
        temp.upbringingStep
      ) {
        temp.upbringingStep.focus = action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.Education &&
        temp.educationStep
      ) {
        temp.educationStep.talent = action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.Career &&
        temp.careerStep
      ) {
        temp.careerStep.talent = action.payload.newValue;
      } else if (
        oldValue.context === AssemblyContext.FinishingTouches &&
        temp.finishingStep
      ) {
        temp.finishingStep.talent = action.payload.newValue;
      } else if (oldValue.context === AssemblyContext.Improvement) {
        const improvement = temp.improvements[oldValue.contextIndex];
        if (
          improvement instanceof CharacterAdvancementStep &&
          improvement.choice === CharacterAdvancementChoice.Talent
        ) {
          improvement.value = action.payload.newValue as SelectedTalent;
        }
      }
    });
  });
};
