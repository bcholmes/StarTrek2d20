import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { CharacterRank } from '../../common/character';
import {
  setCharacterAdditionalTraits,
  setCharacterAssignedShip,
  setCharacterAssignment,
  setCharacterDescription,
  setCharacterHouse,
  setCharacterLineage,
  setCharacterName,
  setCharacterPastime,
  setCharacterPronouns,
  setCharacterRank,
} from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

export const registerIdentityReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(setCharacterName, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.name = action.payload.name;
    });
  });
  builder.addCase(setCharacterDescription, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.description = action.payload.description;
    });
  });
  builder.addCase(setCharacterPastime, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.pastime = [action.payload.pastime];
    });
  });
  builder.addCase(setCharacterLineage, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.lineage = action.payload.lineage;
    });
  });
  builder.addCase(setCharacterHouse, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.house = action.payload.house;
    });
  });
  builder.addCase(setCharacterAssignedShip, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.assignedShip = action.payload.assignedShip;
    });
  });
  builder.addCase(setCharacterAdditionalTraits, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.additionalTraits = action.payload.traits;
    });
  });
  builder.addCase(setCharacterRank, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.rankValue = new CharacterRank(
        action.payload.name,
        action.payload.rank ?? undefined,
      );
    });
  });
  builder.addCase(setCharacterAssignment, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (action.payload.role != null) {
        if (typeof action.payload.role === 'string') {
          temp.role = undefined;
          temp.secondaryRole = undefined;
          temp.jobAssignment = action.payload.role;
        } else {
          temp.role = action.payload.role;
          temp.jobAssignment = undefined;

          if (action.payload.secondaryRole != null) {
            temp.secondaryRole = action.payload.secondaryRole;
          } else {
            temp.secondaryRole = undefined;
          }
        }
      } else {
        temp.role = undefined;
        temp.secondaryRole = undefined;
        temp.jobAssignment = undefined;
      }
    });
  });
  builder.addCase(setCharacterPronouns, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      temp.pronouns = action.payload.pronouns;
    });
  });
};
