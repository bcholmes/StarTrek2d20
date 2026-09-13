import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import {
  Promotion,
  ReputationChangeStep,
  CharacterAdvancementStep,
} from '../../common/character';
import type { SelectedTalent } from '../../common/selectedTalent';
import { CharacterAdvancementChoice } from '../../modify/model/characterAdvancementChoice';
import {
  addCharacterLogEntry,
  modifyCharacterAddAdvancement,
  modifyCharacterRank,
  modifyCharacterReputation,
} from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

export const registerImprovementReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(addCharacterLogEntry, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.improvements == null) {
        temp.improvements = [];
      }
      temp.improvements.push(action.payload.logEntry);
    });
  });
  builder.addCase(modifyCharacterRank, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.improvements == null) {
        temp.improvements = [];
      }
      temp.improvements.push(
        new Promotion(action.payload.rank, action.payload.type),
      );
    });
  });
  builder.addCase(modifyCharacterReputation, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.improvements == null) {
        temp.improvements = [];
      }
      temp.improvements.push(new ReputationChangeStep(action.payload.delta));
    });
  });
  builder.addCase(modifyCharacterAddAdvancement, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.improvements == null) {
        temp.improvements = [];
      }
      const improvement = new CharacterAdvancementStep();
      improvement.choice = action.payload.type;
      if (action.payload.type === CharacterAdvancementChoice.Talent) {
        improvement.value = (action.payload.value as SelectedTalent).copy();
        if (action.payload.remove != null) {
          improvement.removeValue = (
            action.payload.remove as SelectedTalent
          ).copy();
        }
        temp.improvements.push(improvement);
      } else {
        improvement.value = action.payload.value;
        if (action.payload.remove != null) {
          improvement.removeValue = action.payload.remove;
        }
        temp.improvements.push(improvement);
      }
      improvement.log = action.payload.logEntry?.id;
      improvement.logCallback = action.payload.logEntryCallback?.id;
    });
  });
};
