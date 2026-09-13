import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { CharacterType } from '../../common/characterType';
import { modifyCharacterAttribute, StepContext } from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

export const registerModifyAttributeReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(modifyCharacterAttribute, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const attribute = action.payload.attribute;
      const positive = action.payload.positive;
      if (action.payload.context === StepContext.Species && temp.speciesStep) {
        if (positive) {
          temp.speciesStep.attributes.push(action.payload.attribute);
          if (temp.speciesStep.attributes.length > 3) {
            const attributes = [...temp.speciesStep.attributes];
            attributes.splice(0, attributes.length - 3);
            temp.speciesStep.attributes = attributes;
          }
        } else if (
          temp.speciesStep.attributes.includes(action.payload.attribute)
        ) {
          const attributes = [...temp.speciesStep.attributes];
          attributes.splice(
            temp.speciesStep.attributes.indexOf(action.payload.attribute),
            1,
          );
          temp.speciesStep.attributes = attributes;
        }
      } else if (
        action.payload.context === StepContext.Environment &&
        temp.environmentStep
      ) {
        if (positive) {
          temp.environmentStep.attribute = action.payload.attribute;
        } else if (
          temp.environmentStep.attribute === action.payload.attribute
        ) {
          temp.environmentStep.attribute = undefined;
        }
      } else if (
        action.payload.context === StepContext.Education &&
        temp.educationStep
      ) {
        if (
          action.payload.forceDecrement &&
          temp.type === CharacterType.Child
        ) {
          if (positive) {
            temp.educationStep.decrementAttributes.splice(
              temp.educationStep.decrementAttributes.indexOf(
                action.payload.attribute,
              ),
              1,
            );
          } else {
            temp.educationStep.decrementAttributes.push(
              action.payload.attribute,
            );
          }
        } else {
          if (positive) {
            temp.educationStep.attributes.push(action.payload.attribute);
          } else if (
            temp.educationStep.attributes.includes(action.payload.attribute)
          ) {
            temp.educationStep.attributes.splice(
              temp.educationStep.attributes.indexOf(action.payload.attribute),
              1,
            );
          }
        }
      } else if (
        action.payload.context === StepContext.CareerEvent1 &&
        temp.hasCareerEvents
      ) {
        temp.careerEvents[0].attribute = positive ? attribute : undefined;
      } else if (
        action.payload.context === StepContext.CareerEvent2 &&
        temp.careerEvents?.length > 1
      ) {
        temp.careerEvents[1].attribute = positive ? attribute : undefined;
      } else if (
        action.payload.context === StepContext.FinishingTouches &&
        temp.finishingStep
      ) {
        if (positive) {
          temp.finishingStep.attributes.push(attribute);
        } else {
          const index = temp.finishingStep.attributes.indexOf(attribute);
          if (index >= 0) {
            temp.finishingStep.attributes.splice(index, 1);
          }
        }
      }
    });
  });
};
