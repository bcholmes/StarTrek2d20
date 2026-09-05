import { createSlice } from '@reduxjs/toolkit';
import {
  CareerEventStep,
  CareerStep,
  Character,
  CharacterRank,
  EducationStep,
  EnvironmentStep,
  FinishingStep,
  Promotion,
  SpeciesAbilityOptions,
  SpeciesStep,
  CharacterAdvancementStep,
  SupportingStep,
  UpbringingStep,
  NpcGenerationStep,
  ReputationChangeStep,
} from '../common/character';
import type {
  FocusAssembly,
  TalentAssembly,
  ValueAssembly,
} from '../common/characterAssembly';
import { AssemblyContext } from '../common/characterAssembly';
import { CharacterType } from '../common/characterType';
import { Stereotype } from '../common/construct';
import { LogEntry } from '../common/logEntry';
import { SelectedTalent } from '../common/selectedTalent';
import { AgeHelper } from '../helpers/age';
import { Department } from '../helpers/department';
import { EquipmentModel } from '../helpers/equipment';
import type { ITalent } from '../helpers/italent';
import { Species } from '../helpers/speciesEnum';
import {
  TALENT_NAME_BORG_IMPLANTS,
  TALENT_NAME_UNTAPPED_POTENTIAL,
} from '../helpers/talents';
import { Track } from '../helpers/trackEnum';
import { CharacterAdvancementChoice } from '../modify/model/characterAdvancementChoice';
import {
  addCharacterBorgImplant,
  addCharacterBorgImplantSpeciesOption,
  addCharacterCareerEvent,
  addCharacterLogEntry,
  addCharacterTalent,
  addCharacterTalentFocus,
  addCharacterTalentValue,
  addCharacterUntappedPotentialAttribute,
  addNpcCharacterEquipment,
  addNpcCharacterValue,
  addNpcCharacterWeapon,
  modifyCharacterAddAdvancement,
  modifyCharacterAttribute,
  modifyCharacterDiscipline,
  modifyCharacterRank,
  modifyCharacterReputation,
  removeCharacterBorgImplant,
  removeCharacterBorgImplantSpeciesOption,
  removeNpcCharacterEquipment,
  removeNpcCharacterWeapon,
  setCharacter,
  setCharacterAdditionalTraits,
  setCharacterAge,
  setCharacterAssignedShip,
  setCharacterAssignment,
  setCharacterCareerEventTrait,
  setCharacterCareerLength,
  setCharacterEarlyOutlook,
  setCharacterEducation,
  setCharacterEnvironment,
  setCharacterFinishingTouches,
  setCharacterFocus,
  setCharacterHouse,
  setCharacterLineage,
  setCharacterName,
  setCharacterPastime,
  setCharacterPronouns,
  setCharacterRank,
  setCharacterSpecies,
  setCharacterSpeciesAbilityChoice,
  setCharacterSpeciesAbilityFocus,
  setCharacterType,
  setCharacterValue,
  setNpcCharacterAttributes,
  setNpcCharacterDepartments,
  setNpcCharacterTalents,
  setSupportingCharacterAttributes,
  setSupportingCharacterDepartments,
  setSupportingCharacterSupervisory,
  StepContext,
  updateCharacterGeneralEditFocusChange,
  updateCharacterGeneralEditSpeciesAbility,
  updateCharacterGeneralEditTalentChange,
  updateCharacterGeneralEditValueChange,
} from './characterActions';

interface CharacterState {
  currentCharacter?: Character;
  isModified: boolean;
  replacementHash?: number;
}

const initialState: CharacterState = {
  currentCharacter: undefined,
  isModified: false,
};

const trackDefaults = (track: Track, step: EducationStep) => {
  switch (track) {
    case Track.EnlistedSecurityTraining:
      step.primaryDiscipline = Department.Security;
      step.disciplines = [Department.Security, Department.Conn];
      step.focuses[2] = 'Chain of Command';
      break;
    case Track.ShipOperations:
      step.primaryDiscipline = Department.Conn;
      step.disciplines = [Department.Engineering, Department.Science];
      break;
    case Track.UniversityAlumni:
      step.primaryDiscipline = Department.Science;
      step.disciplines = [Department.Engineering, Department.Command];
      break;
    case Track.ResearchInternship:
      step.primaryDiscipline = Department.Science;
      step.disciplines = [Department.Engineering, Department.Medicine];
      break;
    default:
      break;
  }
};

const withCharacter = (
  state: any,
  action: any,
  mutate: (temp: Character, action: any) => void,
): CharacterState => {
  const temp = state.currentCharacter.copy();
  mutate(temp, action);
  return {
    ...state,
    currentCharacter: temp,
    isModified: true,
  };
};

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
    builder.addCase(setCharacterSpecies, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        const originalStep = temp.speciesStep;
        temp.speciesStep = new SpeciesStep(action.payload.species);
        if (action.payload.attributes) {
          temp.speciesStep.attributes = [...action.payload.attributes];
        }
        if (action.payload.decrementAttributes?.length) {
          temp.speciesStep.decrementAttributes = [
            ...action.payload.decrementAttributes,
          ];
        }
        if (originalStep) {
          if (originalStep.species === temp.speciesStep.species) {
            if (originalStep.attributes?.length) {
              if (
                originalStep.originalSpecies != null &&
                originalStep.originalSpecies === action.payload.originalSpecies
              ) {
                temp.speciesStep.attributes = [...originalStep.attributes];
              } else if (
                originalStep.mixedSpecies != null &&
                originalStep.mixedSpecies === action.payload.mixedSpecies
              ) {
                temp.speciesStep.attributes = [...originalStep.attributes];
              }
            }
            if (temp.speciesStep.species === Species.Custom) {
              temp.speciesStep.customSpeciesName =
                originalStep.customSpeciesName;
            }
            temp.speciesStep.mixedSpecies = originalStep.mixedSpecies;
            temp.speciesStep.originalSpecies = originalStep.originalSpecies;
            temp.speciesStep.talent = originalStep.talent?.copy();
            temp.speciesStep.abilityOptions =
              originalStep.abilityOptions?.copy();
          }
        }
        if (temp.version > 1) {
          const ability = action.payload.ability;
          if (ability) {
            temp.speciesStep.ability = ability;
          }
        }

        temp.speciesStep.mixedSpecies = action.payload.mixedSpecies;
        temp.speciesStep.originalSpecies = action.payload.originalSpecies;
        if (
          temp.speciesStep.species === Species.Custom &&
          action.payload.customSpeciesName
        ) {
          temp.speciesStep.customSpeciesName = action.payload.customSpeciesName;
        }
      });
    });
    builder.addCase(setCharacterAge, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        temp.age = action.payload.age;
        if (temp.educationStep == null) {
          temp.educationStep = new EducationStep();
        }
      });
    });
    builder.addCase(setCharacterCareerLength, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        temp.careerStep = new CareerStep(action.payload.careerLength);
      });
    });
    builder.addCase(setCharacterEducation, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        const originalStep = temp.educationStep;
        temp.educationStep = new EducationStep(
          action.payload.track,
          action.payload.enlisted,
        );
        trackDefaults(action.payload.track, temp.educationStep);
        if (originalStep) {
          if (originalStep.track === temp.educationStep.track) {
            temp.educationStep.attributes = [...originalStep.attributes];
            temp.educationStep.primaryDiscipline =
              originalStep.primaryDiscipline;
            temp.educationStep.decrementDisciplines = [
              ...originalStep.decrementDisciplines,
            ];
            temp.educationStep.disciplines = [...originalStep.disciplines];
            temp.educationStep.focuses = [...originalStep.focuses];
            temp.educationStep.value = originalStep.value;
            temp.educationStep.talent = originalStep.talent?.copy();
          }
        }
      });
    });
    builder.addCase(setCharacterFinishingTouches, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        const originalStep = temp.finishingStep;
        temp.finishingStep = new FinishingStep();
        if (originalStep) {
          temp.finishingStep.attributes = [...originalStep.attributes];
          temp.finishingStep.disciplines = [...originalStep.disciplines];
          temp.finishingStep.value = originalStep.value;
          temp.finishingStep.talent = originalStep.talent?.copy();

          if (temp.attributeTotal < Character.totalAttributeSum(temp)) {
            temp.finishingStep.attributes = [];
          }
          if (temp.skillTotal < Character.totalDepartmentSum(temp)) {
            temp.finishingStep.disciplines = [];
          }
        }
      });
    });
    builder.addCase(setCharacterEnvironment, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        const originalStep = temp.environmentStep;
        temp.environmentStep = new EnvironmentStep(
          action.payload.environment,
          action.payload.otherSpecies,
        );
        if (originalStep) {
          if (originalStep.environment === temp.environmentStep.environment) {
            temp.environmentStep.discipline = originalStep.discipline;
            if (
              originalStep.otherSpecies === temp.environmentStep.otherSpecies
            ) {
              temp.environmentStep.attribute = originalStep.attribute;
            }
            temp.environmentStep.value = originalStep.value;
          }
        }
      });
    });
    builder.addCase(setCharacterEarlyOutlook, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        const originalStep = temp.upbringingStep;
        temp.upbringingStep = new UpbringingStep(
          action.payload.earlyOutlook,
          action.payload.accepted,
        );
        if (originalStep) {
          if (
            originalStep.upbringing?.id === temp.upbringingStep.upbringing?.id
          ) {
            temp.upbringingStep.discipline = originalStep.discipline;
          }
          temp.upbringingStep.focus = originalStep.focus;
          temp.upbringingStep.talent = originalStep.talent?.copy();
        }
      });
    });
    builder.addCase(modifyCharacterAttribute, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        const attribute = action.payload.attribute;
        const positive = action.payload.positive;
        if (
          action.payload.context === StepContext.Species &&
          temp.speciesStep
        ) {
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
    builder.addCase(addCharacterLogEntry, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        if (temp.improvements == null) {
          temp.improvements = [];
        }
        temp.improvements.push(action.payload.logEntry);
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
          temp.npcGenerationStep.weapons =
            temp.npcGenerationStep.weapons.filter((e) => e !== weapon);
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
    builder.addCase(setCharacterType, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        const originalType = temp.type;
        temp.type = action.payload.type;
        if (temp.type !== originalType) {
          if (temp.educationStep) {
            temp.educationStep = undefined;
          }

          if (
            originalType === CharacterType.Child &&
            temp.type !== CharacterType.Child
          ) {
            temp.age = AgeHelper.getAdultAge();
          } else if (
            originalType !== CharacterType.Child &&
            temp.type === CharacterType.Child
          ) {
            temp.age = AgeHelper.getAllChildAges()[0];
          }
        }
        if (temp.type === CharacterType.Child && temp.supportingStep) {
          temp.supportingStep.supervisory = false;
        }
      });
    });
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
    builder.addCase(
      removeCharacterBorgImplantSpeciesOption,
      (state, action) => {
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
      },
    );
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
    builder.addCase(setCharacterName, (state, action) => {
      return withCharacter(state, action, (temp, action) => {
        temp.name = action.payload.name;
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
    builder.addCase(
      updateCharacterGeneralEditSpeciesAbility,
      (state, action) => {
        return withCharacter(state, action, (temp, action) => {
          temp.speciesStep.ability = action.payload.ability;
          temp.speciesStep.talent = undefined;
        });
      },
    );
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
          temp.educationStep.focuses[action.payload.index] =
            action.payload.focus;
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
                } else if (
                  temp.educationStep.primaryDiscipline === discipline
                ) {
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
  },
});

export const characterReducer = characterSlice.reducer;
