import { createSlice } from '@reduxjs/toolkit';
import { setCharacter } from './characterActions';
import { registerCareerEventReducers } from './characterReducers/careerEventReducers';
import { initialState } from './characterReducers/characterReducerHelpers';
import { registerGeneralEditReducers } from './characterReducers/generalEditReducers';
import { registerIdentityReducers } from './characterReducers/identityReducers';
import { registerImprovementReducers } from './characterReducers/improvementReducers';
import { registerModifyAttributeReducers } from './characterReducers/modifyAttributeReducers';
import { registerModifyDisciplineReducers } from './characterReducers/modifyDisciplineReducers';
import { registerStepSelectionReducers } from './characterReducers/stepSelectionReducers';
import { registerSupportingNpcReducers } from './characterReducers/supportingNpcReducers';
import { registerTalentReducers } from './characterReducers/talentReducers';
import { registerValueAndFocusReducers } from './characterReducers/valueAndFocusReducers';

export const characterSlice = createSlice({
  name: 'character',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setCharacter, (state, action) => {
      const temp = action.payload.character.copy();
      return {
        ...state,
        currentCharacter: temp,
        isModified: false,
        replacementHash: action.payload.replacementHash,
      };
    });
    registerStepSelectionReducers(builder);
    registerModifyAttributeReducers(builder);
    registerModifyDisciplineReducers(builder);
    registerGeneralEditReducers(builder);
    registerImprovementReducers(builder);
    registerSupportingNpcReducers(builder);
    registerTalentReducers(builder);
    registerCareerEventReducers(builder);
    registerValueAndFocusReducers(builder);
    registerIdentityReducers(builder);
  },
});

export const characterReducer = characterSlice.reducer;
