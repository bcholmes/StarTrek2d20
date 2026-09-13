import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { NpcGenerationStep, SupportingStep } from '../../common/character';
import { Stereotype } from '../../common/construct';
import {
  setCharacterFocus,
  setCharacterValue,
  StepContext,
} from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

export const registerValueAndFocusReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(setCharacterValue, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.stereotype === Stereotype.SupportingCharacter) {
        if (temp.supportingStep == null) {
          temp.supportingStep = new SupportingStep();
        }
        temp.supportingStep.value = action.payload.value;
      } else if (
        action.payload.context === StepContext.Environment &&
        temp.environmentStep != null
      ) {
        temp.environmentStep.value = action.payload.value;
      } else if (
        action.payload.context === StepContext.Education &&
        temp.educationStep != null
      ) {
        temp.educationStep.value = action.payload.value;
      } else if (
        action.payload.context === StepContext.Career &&
        temp.careerStep != null
      ) {
        temp.careerStep.value = action.payload.value;
      } else if (
        action.payload.context === StepContext.FinishingTouches &&
        temp.finishingStep != null
      ) {
        temp.finishingStep.value = action.payload.value;
      }
    });
  });
  builder.addCase(setCharacterFocus, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.stereotype === Stereotype.SupportingCharacter) {
        if (temp.supportingStep == null) {
          temp.supportingStep = new SupportingStep();
        }
        const index = action.payload.index ?? 0;
        for (let i = temp.supportingStep.focuses.length; i <= index; i++) {
          temp.supportingStep.focuses.push('');
        }
        temp.supportingStep.focuses[index] = action.payload.focus;
      } else if (temp.stereotype === Stereotype.Npc) {
        if (temp.npcGenerationStep == null) {
          temp.npcGenerationStep = new NpcGenerationStep();
        }
        const index = action.payload.index ?? 0;
        for (let i = temp.npcGenerationStep.focuses.length; i <= index; i++) {
          temp.npcGenerationStep.focuses.push('');
        }
        temp.npcGenerationStep.focuses[index] = action.payload.focus;
      } else if (
        action.payload.context === StepContext.EarlyOutlook &&
        temp.upbringingStep
      ) {
        temp.upbringingStep.focus = action.payload.focus;
      } else if (
        action.payload.context === StepContext.Education &&
        temp.educationStep &&
        action.payload.index <= 2
      ) {
        temp.educationStep.focuses[action.payload.index] = action.payload.focus;
      } else if (
        action.payload.context === StepContext.CareerEvent1 &&
        temp.careerEvents[0]
      ) {
        temp.careerEvents[0].focus = action.payload.focus;
      } else if (
        action.payload.context === StepContext.CareerEvent2 &&
        temp.careerEvents[1]
      ) {
        temp.careerEvents[1].focus = action.payload.focus;
      }
    });
  });
};
