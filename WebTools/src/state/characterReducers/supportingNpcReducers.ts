import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { NpcGenerationStep, SupportingStep } from '../../common/character';
import { Stereotype } from '../../common/construct';
import { EquipmentModel } from '../../helpers/equipment';
import {
  addNpcCharacterEquipment,
  addNpcCharacterValue,
  addNpcCharacterWeapon,
  removeNpcCharacterEquipment,
  removeNpcCharacterWeapon,
  setNpcCharacterAttributes,
  setNpcCharacterDepartments,
  setNpcCharacterTalents,
  setSupportingCharacterAttributes,
  setSupportingCharacterDepartments,
  setSupportingCharacterSupervisory,
} from '../characterActions';
import type { CharacterState } from './characterReducerHelpers';
import { withCharacter } from './characterReducerHelpers';

export const registerSupportingNpcReducers = (
  builder: ActionReducerMapBuilder<CharacterState>,
) => {
  builder.addCase(setSupportingCharacterSupervisory, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.supportingStep == null) {
        temp.supportingStep = new SupportingStep();
      }
      temp.supportingStep.supervisory = action.payload.supervisory;
      if (
        !temp.supportingStep.supervisory &&
        temp.supportingStep.value?.length
      ) {
        temp.supportingStep.value = null;
      }
      if (
        !temp.supportingStep.supervisory &&
        temp.supportingStep.focuses.length > 3
      ) {
        temp.supportingStep.focuses.splice(3);
      }
    });
  });
  builder.addCase(setSupportingCharacterDepartments, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.supportingStep == null) {
        temp.supportingStep = new SupportingStep();
      }
      temp.supportingStep.disciplines = [...action.payload.disciplines];
    });
  });
  builder.addCase(setNpcCharacterDepartments, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.npcGenerationStep == null) {
        temp.npcGenerationStep = new NpcGenerationStep();
      }
      temp.npcGenerationStep.departments = [...action.payload.departments];
    });
  });
  builder.addCase(setNpcCharacterAttributes, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.npcGenerationStep == null) {
        temp.npcGenerationStep = new NpcGenerationStep();
      }
      temp.npcGenerationStep.attributes = [...action.payload.attributes];
    });
  });
  builder.addCase(setNpcCharacterTalents, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.npcGenerationStep == null) {
        temp.npcGenerationStep = new NpcGenerationStep();
      }
      temp.npcGenerationStep.talents = [
        ...action.payload.talents.map((t) => t.copy()),
      ];
    });
  });
  builder.addCase(addNpcCharacterEquipment, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.npcGenerationStep == null) {
        temp.npcGenerationStep = new NpcGenerationStep();
      }

      temp.npcGenerationStep.equipment.push(action.payload.equipment);
    });
  });
  builder.addCase(addNpcCharacterWeapon, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.npcGenerationStep == null) {
        temp.npcGenerationStep = new NpcGenerationStep();
      }

      temp.npcGenerationStep.weapons.push(action.payload.weapon);
    });
  });
  builder.addCase(removeNpcCharacterEquipment, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const equipment = action.payload.equipment;
      if (temp.npcGenerationStep?.equipment != null) {
        temp.npcGenerationStep.equipment =
          temp.npcGenerationStep.equipment.filter((e) => {
            if (
              e instanceof EquipmentModel &&
              equipment instanceof EquipmentModel
            ) {
              return !(
                e.type === equipment.type &&
                e.name === equipment.name &&
                e.protection === equipment.protection
              );
            } else {
              return e !== equipment;
            }
          });
      }
    });
  });
  builder.addCase(removeNpcCharacterWeapon, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      const weapon = action.payload.weapon;
      if (temp.npcGenerationStep?.weapons != null) {
        temp.npcGenerationStep.weapons = temp.npcGenerationStep.weapons.filter(
          (e) => e !== weapon,
        );
      }
    });
  });
  builder.addCase(setSupportingCharacterAttributes, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.supportingStep == null) {
        temp.supportingStep = new SupportingStep();
      }
      temp.supportingStep.attributes = [...action.payload.attributes];
    });
  });
  builder.addCase(addNpcCharacterValue, (state, action) => {
    return withCharacter(state, action, (temp, action) => {
      if (temp.stereotype === Stereotype.Npc) {
        if (temp.npcGenerationStep == null) {
          temp.npcGenerationStep = new NpcGenerationStep();
        }
        const index = action.payload.index ?? 0;
        for (let i = temp.npcGenerationStep.values.length; i <= index; i++) {
          temp.npcGenerationStep.values.push('');
        }
        temp.npcGenerationStep.values[index] = action.payload.value;
      }
    });
  });
};
