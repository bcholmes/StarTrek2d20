import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { CareerEventStep } from '../../common/character';
import {
  addCharacterCareerEvent,
  setCharacterCareerEventNotes,
  setCharacterCareerEventTrait,
  StepContext,
} from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

export const registerCareerEventReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(addCharacterCareerEvent, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const event = new CareerEventStep(action.payload.eventId);
      if (action.payload.attribute != null) {
        event.attribute = action.payload.attribute;
      }
      if (action.payload.discipline != null) {
        event.discipline = action.payload.discipline;
      }

      if (action.payload.context === StepContext.CareerEvent1) {
        if (temp.careerEvents?.length) {
          if (event.id === temp.careerEvents[0].id) {
            event.focus = temp.careerEvents[0].focus;
          }
          temp.careerEvents[0] = event;
        } else {
          temp.careerEvents.push(event);
        }
      } else if (action.payload.context === StepContext.CareerEvent2) {
        if (temp.careerEvents?.length > 1) {
          if (event.id === temp.careerEvents[1].id) {
            event.focus = temp.careerEvents[1].focus;
          }
          temp.careerEvents[1] = event;
        } else if (temp.careerEvents?.length === 1) {
          temp.careerEvents.push(event);
        }
      }
    });
  });
  builder.addCase(setCharacterCareerEventTrait, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (
        action.payload.context === StepContext.CareerEvent1 &&
        temp.careerEvents[0]
      ) {
        temp.careerEvents[0].trait = action.payload.trait;
      } else if (
        action.payload.context === StepContext.CareerEvent2 &&
        temp.careerEvents[1]
      ) {
        temp.careerEvents[1].trait = action.payload.trait;
      }
    });
  });
  builder.addCase(setCharacterCareerEventNotes, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (
        action.payload.context === StepContext.CareerEvent1 &&
        temp.careerEvents[0]
      ) {
        temp.careerEvents[0].notes = action.payload.notes;
      } else if (
        action.payload.context === StepContext.CareerEvent2 &&
        temp.careerEvents[1]
      ) {
        temp.careerEvents[1].notes = action.payload.notes;
      }
    });
  });
};
