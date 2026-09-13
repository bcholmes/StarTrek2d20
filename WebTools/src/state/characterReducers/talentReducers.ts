import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import {
  FinishingStep,
  CareerStep,
  SpeciesAbilityOptions,
} from '../../common/character';
import { SelectedTalent } from '../../common/selectedTalent';
import type { ITalent } from '../../helpers/italent';
import {
  TALENT_NAME_BORG_IMPLANTS,
  TALENT_NAME_UNTAPPED_POTENTIAL,
} from '../../helpers/talents';
import {
  addCharacterBorgImplant,
  addCharacterBorgImplantSpeciesOption,
  addCharacterTalent,
  addCharacterTalentFocus,
  addCharacterTalentValue,
  addCharacterUntappedPotentialAttribute,
  removeCharacterBorgImplant,
  removeCharacterBorgImplantSpeciesOption,
  setCharacterSpeciesAbilityChoice,
  setCharacterSpeciesAbilityFocus,
  StepContext,
} from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

export const registerTalentReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(addCharacterUntappedPotentialAttribute, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const talent = temp.getTalentByName(TALENT_NAME_UNTAPPED_POTENTIAL);
      if (talent) {
        talent.attribute = action.payload.attribute;
      }
    });
  });
  builder.addCase(addCharacterBorgImplant, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const talent = temp.getTalentByName(TALENT_NAME_BORG_IMPLANTS);
      if (talent) {
        talent.implants.push(action.payload.type);
        while (talent.implants.length > 3) {
          talent.implants.splice(0, 1);
        }
      }
    });
  });
  builder.addCase(addCharacterBorgImplantSpeciesOption, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (
        temp.speciesStep != null &&
        temp.speciesStep?.abilityOptions == null
      ) {
        temp.speciesStep.abilityOptions = new SpeciesAbilityOptions();
      }
      temp.speciesStep?.abilityOptions?.implants.push(action.payload.type);
      while (temp.speciesStep?.abilityOptions?.implants.length > 3) {
        temp.speciesStep?.abilityOptions?.implants.splice(0, 1);
      }
    });
  });
  builder.addCase(removeCharacterBorgImplant, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const talent = temp.getTalentByName(TALENT_NAME_BORG_IMPLANTS);
      if (talent) {
        const index = talent.implants.indexOf(action.payload.type);
        if (index >= 0) {
          talent.implants.splice(index, 1);
        }
      }
    });
  });
  builder.addCase(removeCharacterBorgImplantSpeciesOption, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (
        temp.speciesStep != null &&
        temp.speciesStep?.abilityOptions != null
      ) {
        const index = temp.speciesStep?.abilityOptions?.implants?.indexOf(
          action.payload.type,
        );
        if (index >= 0) {
          temp.speciesStep?.abilityOptions?.implants?.splice(index, 1);
        }
      }
    });
  });
  builder.addCase(setCharacterSpeciesAbilityFocus, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (
        temp.speciesStep != null &&
        temp.speciesStep?.abilityOptions == null
      ) {
        temp.speciesStep.abilityOptions = new SpeciesAbilityOptions();
      }
      if (temp.speciesStep?.abilityOptions != null) {
        const index = action.payload.index;
        const focus = action.payload.focus;
        while (temp.speciesStep.abilityOptions.focuses.length < index) {
          temp.speciesStep.abilityOptions.focuses[
            temp.speciesStep.abilityOptions.focuses.length
          ] = '';
        }
        temp.speciesStep.abilityOptions.focuses[index] = focus;
      }
    });
  });
  builder.addCase(setCharacterSpeciesAbilityChoice, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (
        temp.speciesStep != null &&
        temp.speciesStep?.abilityOptions == null
      ) {
        temp.speciesStep.abilityOptions = new SpeciesAbilityOptions();
      }
      if (temp.speciesStep?.abilityOptions != null) {
        temp.speciesStep.abilityOptions.choice = action.payload.choice;
      }
    });
  });
  builder.addCase(addCharacterTalentFocus, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const talent = temp.getTalentByName(action.payload.talent);
      if (talent) {
        const index = action.payload.index;
        for (let i = talent.focuses.length; i <= index; i++) {
          talent.focuses.push('');
        }
        talent.focuses[index] = action.payload.focus;
      }
    });
  });
  builder.addCase(addCharacterTalentValue, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const talent = temp.getTalentByName(action.payload.talent);
      if (talent) {
        talent.value = action.payload.value;
      }
    });
  });
  builder.addCase(addCharacterTalent, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const t = action.payload.talent;
      let talent = undefined;
      if (t != null && t instanceof SelectedTalent) {
        talent = (t as SelectedTalent).copy();
      } else if (t != null) {
        talent = new SelectedTalent((t as ITalent).name);
      }
      if (action.payload.context === StepContext.Species) {
        temp.speciesStep.talent = talent;
      } else if (action.payload.context === StepContext.EarlyOutlook) {
        temp.upbringingStep.talent = talent;
      } else if (action.payload.context === StepContext.Education) {
        temp.educationStep.talent = talent;
      } else if (action.payload.context === StepContext.Career) {
        const original = temp.careerStep;
        if (temp.careerStep == null) {
          temp.careerStep = new CareerStep();
        }
        temp.careerStep.talent = talent;
        if (original?.talent?.talent === talent?.talent && talent != null) {
          temp.careerStep.talent.attribute = original?.talent?.attribute;
        }
      } else if (action.payload.context === StepContext.FinishingTouches) {
        if (temp.finishingStep == null) {
          temp.finishingStep = new FinishingStep();
        }
        temp.finishingStep.talent = talent;
      }
    });
  });
};
