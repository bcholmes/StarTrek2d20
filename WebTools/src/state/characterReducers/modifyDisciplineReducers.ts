import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { CharacterType } from '../../common/characterType';
import { modifyCharacterDiscipline, StepContext } from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

export const registerModifyDisciplineReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(modifyCharacterDiscipline, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const discipline = action.payload.discipline;
      const positive = action.payload.positive;
      if (
        action.payload.context === StepContext.Environment &&
        temp.environmentStep
      ) {
        if (action.payload.positive) {
          temp.environmentStep.discipline = action.payload.discipline;
        } else if (
          temp.environmentStep.discipline === action.payload.discipline
        ) {
          temp.environmentStep.discipline = undefined;
        }
      } else if (
        action.payload.context === StepContext.EarlyOutlook &&
        temp.upbringingStep
      ) {
        if (action.payload.positive) {
          temp.upbringingStep.discipline = action.payload.discipline;
        } else if (
          temp.upbringingStep.discipline === action.payload.discipline
        ) {
          temp.upbringingStep.discipline = undefined;
        }
      } else if (
        action.payload.context === StepContext.Education &&
        temp.educationStep
      ) {
        if (action.payload.forceDecrement) {
          if (positive) {
            const value = temp.departments[discipline];
            temp.educationStep.decrementDisciplines.splice(
              temp.educationStep.decrementDisciplines.indexOf(discipline),
              1,
            );
            // if we're no longer decrementing a discipline that could only be incremented because of
            // the previous decrement, then remove the increment
            if (temp.departments[discipline] === value) {
              if (temp.educationStep.disciplines.includes(discipline)) {
                temp.educationStep.disciplines.splice(
                  temp.educationStep.disciplines.indexOf(discipline),
                  1,
                );
              } else if (temp.educationStep.primaryDiscipline === discipline) {
                temp.educationStep.primaryDiscipline = undefined;
              }
            }
          } else {
            temp.educationStep.decrementDisciplines.push(discipline);
          }
        } else {
          if (action.payload.positive) {
            if (action.payload.primaryDisciplines.length > 0) {
              temp.educationStep.primaryDiscipline = discipline;
              action.payload.primaryDisciplines.forEach((d) => {
                if (temp.educationStep.disciplines.includes(d)) {
                  temp.educationStep.disciplines.splice(
                    temp.educationStep.disciplines.indexOf(d),
                    1,
                  );
                }
              });
            } else if (
              temp.educationStep.decrementDisciplines.includes(discipline) &&
              temp.type !== CharacterType.Child
            ) {
              temp.educationStep.decrementDisciplines.splice(
                temp.educationStep.decrementDisciplines.indexOf(discipline),
                1,
              );
            } else {
              temp.educationStep.disciplines.push(discipline);
            }
          } else {
            if (temp.educationStep.primaryDiscipline === discipline) {
              temp.educationStep.primaryDiscipline = null;
              action.payload.primaryDisciplines.forEach((d) => {
                if (temp.educationStep.disciplines.includes(d)) {
                  temp.educationStep.disciplines.splice(
                    temp.educationStep.disciplines.indexOf(d),
                    1,
                  );
                }
              });
            } else if (temp.educationStep.disciplines.includes(discipline)) {
              temp.educationStep.disciplines.splice(
                temp.educationStep.disciplines.indexOf(discipline),
                1,
              );
            } else if (temp.type !== CharacterType.Child) {
              temp.educationStep.decrementDisciplines.push(discipline);
            }
          }
        }
      } else if (
        action.payload.context === StepContext.CareerEvent1 &&
        temp.hasCareerEvents
      ) {
        temp.careerEvents[0].discipline = positive ? discipline : undefined;
      } else if (
        action.payload.context === StepContext.CareerEvent2 &&
        temp.careerEvents?.length > 1
      ) {
        temp.careerEvents[1].discipline = positive ? discipline : undefined;
      } else if (
        action.payload.context === StepContext.FinishingTouches &&
        temp.finishingStep
      ) {
        if (positive) {
          temp.finishingStep.disciplines.push(discipline);
        } else {
          const index = temp.finishingStep.disciplines.indexOf(discipline);
          if (index >= 0) {
            temp.finishingStep.disciplines.splice(index, 1);
          }
        }
      }
    });
  });
};
