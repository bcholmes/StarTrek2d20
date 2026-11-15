import { test, expect, describe, it, jest } from '@jest/globals';
import '../../src/helpers/species';
import {
  Character,
  SpeciesStep,
  EnvironmentStep,
  UpbringingStep,
  EducationStep,
  FinishingStep,
  Promotion,
  CharacterRank,
  CareerEventStep,
  CareerStep,
  CharacterAdvancementStep,
  SpeciesAbilityOptions,
} from '../../src/common/character';
import {
  TALENT_NAME_BORG_IMPLANTS,
  TALENT_NAME_UNTAPPED_POTENTIAL,
} from '../../src/helpers/talents';
import { Department } from '../../src/helpers/department';
import { Environment } from '../../src/helpers/environments';
import { Attribute } from '../../src/helpers/attributes';
import { Species } from '../../src/helpers/speciesEnum';
import { Track } from '../../src/helpers/trackEnum';
import { Career } from '../../src/helpers/careerEnum';
import { SelectedTalent } from '../../src/common/selectedTalent';
import {
  setCharacter,
  addCharacterBorgImplant,
  setCharacterSpecies,
  setSupportingCharacterSupervisory,
  setCharacterEducation,
  setCharacterFinishingTouches,
  addCharacterCareerEvent,
  setCharacterEarlyOutlook,
  setCharacterFocus,
  setCharacterSpeciesAbilityFocus,
  setCharacterSpeciesAbilityChoice,
  setCharacterType,
  setCharacterEnvironment,
  setCharacterCareerEventTrait,
  modifyCharacterAttribute,
  modifyCharacterDiscipline,
  setCharacterValue,
  updateCharacterGeneralEditValueChange,
  updateCharacterGeneralEditFocusChange,
  updateCharacterGeneralEditTalentChange,
  updateCharacterGeneralEditSpeciesAbility,
  addNpcCharacterValue,
  addCharacterTalent,
  addCharacterTalentFocus,
  addCharacterTalentValue,
  addCharacterLogEntry,
  setCharacterAge,
  setCharacterLineage,
  setCharacterHouse,
  setCharacterAdditionalTraits,
  setCharacterCareerLength,
  setCharacterName,
  setCharacterPastime,
  setCharacterRank,
  setCharacterAssignment,
  setCharacterAssignedShip,
  setCharacterPronouns,
  StepContext,
  setNpcCharacterDepartments,
  setNpcCharacterAttributes,
  setNpcCharacterTalents,
  addNpcCharacterEquipment,
  addNpcCharacterWeapon,
  removeNpcCharacterEquipment,
  removeNpcCharacterWeapon,
  addCharacterUntappedPotentialAttribute,
  setSupportingCharacterAttributes,
  setSupportingCharacterDepartments,
  modifyCharacterReputation,
  modifyCharacterRank,
} from '../../src/state/characterActions';
import {
  LogEntry,
  LogValueEntry,
  ValueUseType,
} from '../../src/common/logEntry';
import { NpcType } from '../../src/npc/model/npcType';
import { Role } from '../../src/helpers/roles';
import { Rank } from '../../src/helpers/ranks';
import { Era } from '../../src/helpers/erasEnum';
import { ModificationType } from '../../src/modify/model/modificationType';
import {
  AssemblyContext,
  FocusAssembly,
  TalentAssembly,
  ValueAssembly,
} from '../../src/common/characterAssembly';
import { CharacterAdvancementChoice } from '../../src/modify/model/characterAdvancementChoice';
import { UpbringingsHelper } from '../../src/helpers/upbringings';
import { CharacterType } from '../../src/common/characterType';
import { SpeciesAbilityChoice } from '../../src/helpers/speciesAbility';
import { characterReducer } from '../../src/state/characterReducer';

jest.mock('i18next');
jest.mock('../../src/state/store', () => ({
  store: {
    getState: jest.fn(() => ({
      context: {
        sources: [1],
      },
    })),
  },
}));

const makeCharacter = () =>
  Character.createMainCharacter(CharacterType.Starfleet, Era.NextGeneration, 2);

const makeSupportingCharacter = () =>
  Character.createSupportingCharacter(Era.NextGeneration, 2);

const makeNpcCharacter = () =>
  Character.createNpcCharacter(
    Era.NextGeneration,
    2,
    NpcType.Major,
    CharacterType.Starfleet,
  );

const stateWithCharacter = (char: Character) => ({
  currentCharacter: char,
  isModified: false,
});

describe('character reducer', () => {
  describe('SET_CHARACTER', () => {
    it('copies the character and stores the replacement hash', () => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(makeCharacter()) as any,
        setCharacter(char, 42),
      );
      expect(result.currentCharacter).not.toBe(char);
      expect(result.currentCharacter).toEqual(char.copy());
      expect(result.isModified).toBe(false);
      expect(result.replacementHash).toBe(42);
    });
  });

  describe('MODIFY_CHARACTER_ATTRIBUTE', () => {
    it('adds, limits, and removes species attributes', () => {
      const char = makeCharacter();
      char.speciesStep = new SpeciesStep(Species.Human);
      let state = stateWithCharacter(char) as any;
      for (let i = 0; i < 5; i++) {
        state = characterReducer(
          state,
          modifyCharacterAttribute(
            Attribute.Control,
            StepContext.Species,
            true,
          ),
        );
      }
      expect(state.currentCharacter.speciesStep.attributes).toEqual([
        Attribute.Control,
        Attribute.Control,
        Attribute.Control,
      ]);
      const removed = characterReducer(
        state,
        modifyCharacterAttribute(Attribute.Control, StepContext.Species, false),
      );
      expect(removed.currentCharacter.speciesStep.attributes).toEqual([
        Attribute.Control,
        Attribute.Control,
      ]);
    });

    it('sets the environment attribute', () => {
      const char = makeCharacter();
      char.environmentStep = new EnvironmentStep(Environment.Homeworld);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterAttribute(
          Attribute.Daring,
          StepContext.Environment,
          true,
        ),
      );
      expect(result.currentCharacter.environmentStep.attribute).toBe(
        Attribute.Daring,
      );
    });

    it('sets the finishing touches attribute', () => {
      const char = makeCharacter();
      char.finishingStep = new FinishingStep();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterAttribute(
          Attribute.Reason,
          StepContext.FinishingTouches,
          true,
        ),
      );
      expect(result.currentCharacter.finishingStep.attributes).toEqual([
        Attribute.Reason,
      ]);
    });
  });

  describe('MODIFY_CHARACTER_DISCIPLINE', () => {
    it('adds education disciplines', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          true,
        ),
      );
      expect(result.currentCharacter.educationStep.disciplines).toEqual([
        Department.Command,
      ]);
    });

    it('sets and clears the environment discipline', () => {
      const char = makeCharacter();
      char.environmentStep = new EnvironmentStep(Environment.BusyColony);

      let state = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Security,
          StepContext.Environment,
          true,
        ),
      );
      expect(state.currentCharacter.environmentStep.discipline).toBe(
        Department.Security,
      );

      state = characterReducer(
        state as any,
        modifyCharacterDiscipline(
          Department.Security,
          StepContext.Environment,
          false,
        ),
      );
      expect(state.currentCharacter.environmentStep.discipline).toBeUndefined();
    });

    it('leaves a different environment discipline when clearing', () => {
      const char = makeCharacter();
      char.environmentStep = new EnvironmentStep(Environment.BusyColony);
      char.environmentStep.discipline = Department.Command;
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Security,
          StepContext.Environment,
          false,
        ),
      );
      expect(result.currentCharacter.environmentStep.discipline).toBe(
        Department.Command,
      );
    });

    it('sets and clears the early outlook discipline', () => {
      const outlook = UpbringingsHelper.getAllUpbringings(
        CharacterType.Starfleet,
      )[0];
      const char = makeCharacter();
      char.upbringingStep = new UpbringingStep(outlook);

      let state = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Science,
          StepContext.EarlyOutlook,
          true,
        ),
      );
      expect(state.currentCharacter.upbringingStep.discipline).toBe(
        Department.Science,
      );

      state = characterReducer(
        state as any,
        modifyCharacterDiscipline(
          Department.Science,
          StepContext.EarlyOutlook,
          false,
        ),
      );
      expect(state.currentCharacter.upbringingStep.discipline).toBeUndefined();
    });

    it('sets the primary discipline and removes the other primary picks', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      char.educationStep.disciplines = [
        Department.Command,
        Department.Security,
      ];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          true,
          [Department.Security],
        ),
      );
      expect(result.currentCharacter.educationStep.primaryDiscipline).toBe(
        Department.Command,
      );
      expect(result.currentCharacter.educationStep.disciplines).toEqual([
        Department.Command,
      ]);
    });

    it('cancels a decrement instead of adding a discipline', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      char.educationStep.decrementDisciplines = [Department.Command];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          true,
        ),
      );
      expect(
        result.currentCharacter.educationStep.decrementDisciplines,
      ).toEqual([]);
      expect(result.currentCharacter.educationStep.disciplines).toEqual([]);
    });

    it('adds a decremented discipline for a child instead of cancelling it', () => {
      const char = makeCharacter();
      char.type = CharacterType.Child;
      char.educationStep = new EducationStep(Track.Command);
      char.educationStep.decrementDisciplines = [Department.Command];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          true,
        ),
      );
      expect(
        result.currentCharacter.educationStep.decrementDisciplines,
      ).toEqual([Department.Command]);
      expect(result.currentCharacter.educationStep.disciplines).toEqual([
        Department.Command,
      ]);
    });

    it('clears the primary discipline and its related picks', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      char.educationStep.primaryDiscipline = Department.Command;
      char.educationStep.disciplines = [
        Department.Security,
        Department.Command,
      ];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          false,
          [Department.Security],
        ),
      );
      expect(
        result.currentCharacter.educationStep.primaryDiscipline,
      ).toBeNull();
      expect(result.currentCharacter.educationStep.disciplines).toEqual([
        Department.Command,
      ]);
    });

    it('removes a selected discipline when clearing', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      char.educationStep.disciplines = [Department.Command];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          false,
        ),
      );
      expect(result.currentCharacter.educationStep.disciplines).toEqual([]);
      expect(
        result.currentCharacter.educationStep.decrementDisciplines,
      ).toEqual([]);
    });

    it('records a decrement when clearing an unselected discipline', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          false,
        ),
      );
      expect(
        result.currentCharacter.educationStep.decrementDisciplines,
      ).toEqual([Department.Command]);
    });

    it('does not record a decrement for a child', () => {
      const char = makeCharacter();
      char.type = CharacterType.Child;
      char.educationStep = new EducationStep(Track.Command);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          false,
        ),
      );
      expect(
        result.currentCharacter.educationStep.decrementDisciplines,
      ).toEqual([]);
    });

    it('removes a decrement with forceDecrement', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      char.educationStep.decrementDisciplines = [Department.Command];
      char.educationStep.disciplines = [Department.Command];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          true,
          [],
          true,
        ),
      );
      expect(
        result.currentCharacter.educationStep.decrementDisciplines,
      ).toEqual([]);
      expect(result.currentCharacter.educationStep.disciplines).toEqual([
        Department.Command,
      ]);
    });

    it('adds a decrement with forceDecrement when clearing', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.Education,
          false,
          [],
          true,
        ),
      );
      expect(
        result.currentCharacter.educationStep.decrementDisciplines,
      ).toEqual([Department.Command]);
    });

    it('sets and clears career event disciplines', () => {
      const char = makeCharacter();
      char.careerEvents = [new CareerEventStep(1), new CareerEventStep(2)];

      let state = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Engineering,
          StepContext.CareerEvent1,
          true,
        ),
      );
      expect(state.currentCharacter.careerEvents[0].discipline).toBe(
        Department.Engineering,
      );

      state = characterReducer(
        state as any,
        modifyCharacterDiscipline(
          Department.Engineering,
          StepContext.CareerEvent1,
          false,
        ),
      );
      expect(state.currentCharacter.careerEvents[0].discipline).toBeUndefined();

      state = characterReducer(
        state as any,
        modifyCharacterDiscipline(
          Department.Medicine,
          StepContext.CareerEvent2,
          true,
        ),
      );
      expect(state.currentCharacter.careerEvents[1].discipline).toBe(
        Department.Medicine,
      );

      state = characterReducer(
        state as any,
        modifyCharacterDiscipline(
          Department.Medicine,
          StepContext.CareerEvent2,
          false,
        ),
      );
      expect(state.currentCharacter.careerEvents[1].discipline).toBeUndefined();
    });

    it('ignores career events when there are not enough of them', () => {
      const char = makeCharacter();
      char.careerEvents = [new CareerEventStep(1)];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.CareerEvent2,
          true,
        ),
      );
      expect(
        result.currentCharacter.careerEvents[0].discipline,
      ).toBeUndefined();
    });

    it('adds and removes finishing touches disciplines', () => {
      const char = makeCharacter();
      char.finishingStep = new FinishingStep();

      let state = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.FinishingTouches,
          true,
        ),
      );
      expect(state.currentCharacter.finishingStep.disciplines).toEqual([
        Department.Command,
      ]);

      state = characterReducer(
        state as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.FinishingTouches,
          false,
        ),
      );
      expect(state.currentCharacter.finishingStep.disciplines).toEqual([]);

      state = characterReducer(
        state as any,
        modifyCharacterDiscipline(
          Department.Command,
          StepContext.FinishingTouches,
          false,
        ),
      );
      expect(state.currentCharacter.finishingStep.disciplines).toEqual([]);
    });

    it('ignores contexts whose step is absent', () => {
      const char = makeCharacter();
      let state = stateWithCharacter(char) as any;
      for (const context of [
        StepContext.Environment,
        StepContext.EarlyOutlook,
        StepContext.Education,
        StepContext.CareerEvent1,
        StepContext.CareerEvent2,
        StepContext.FinishingTouches,
      ]) {
        state = characterReducer(
          state,
          modifyCharacterDiscipline(Department.Command, context, true),
        );
      }
      expect(state.currentCharacter.educationStep).toBeUndefined();
      expect(state.currentCharacter.environmentStep).toBeUndefined();
      expect(state.currentCharacter.upbringingStep).toBeUndefined();
      expect(state.currentCharacter.finishingStep).toBeUndefined();
    });
  });

  describe('SET_CHARACTER_SPECIES', () => {
    it('sets the species and its attributes', () => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterSpecies(Species.Human, [
          Attribute.Control,
          Attribute.Daring,
        ]),
      );
      expect(result.currentCharacter.speciesStep.species).toBe(Species.Human);
      expect(result.currentCharacter.speciesStep.attributes).toEqual([
        Attribute.Control,
        Attribute.Daring,
      ]);
    });

    it('re-selecting the same species preserves the talent', () => {
      const char = makeCharacter();
      char.speciesStep = new SpeciesStep(Species.Human);
      char.speciesStep.talent = new SelectedTalent('Bold');
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterSpecies(Species.Human),
      );
      expect(result.currentCharacter.speciesStep.talent).toEqual(
        new SelectedTalent('Bold'),
      );
      expect(result.currentCharacter.speciesStep).not.toBe(char.speciesStep);
    });

    it('replaces the species and resets attributes when changing species', () => {
      const char = makeCharacter();
      char.speciesStep = new SpeciesStep(Species.Betazoid);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterSpecies(Species.Human, [Attribute.Reason]),
      );
      expect(result.currentCharacter.speciesStep.species).toBe(Species.Human);
      expect(result.currentCharacter.speciesStep.attributes).toEqual([
        Attribute.Reason,
      ]);
    });
  });

  describe('SET_CHARACTER_ENVIRONMENT', () => {
    it('re-selecting the same environment preserves the discipline', () => {
      const char = makeCharacter();
      char.environmentStep = new EnvironmentStep(Environment.BusyColony);
      char.environmentStep.discipline = Department.Security;
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterEnvironment(Environment.BusyColony),
      );
      expect(result.currentCharacter.environmentStep.discipline).toBe(
        Department.Security,
      );
    });

    it('clears the discipline when the environment changes', () => {
      const char = makeCharacter();
      char.environmentStep = new EnvironmentStep(Environment.BusyColony);
      char.environmentStep.discipline = Department.Security;
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterEnvironment(Environment.Homeworld),
      );
      expect(result.currentCharacter.environmentStep.discipline).toBe(
        undefined,
      );
    });
  });

  describe('SET_CHARACTER_EDUCATION', () => {
    it('re-selecting the same track preserves the selections', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      char.educationStep.attributes = [Attribute.Control];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterEducation(Track.Command),
      );
      expect(result.currentCharacter.educationStep.attributes).toEqual([
        Attribute.Control,
      ]);
    });
  });

  describe('SET_CHARACTER_EARLY_OUTLOOK', () => {
    it('re-selecting the same upbringing preserves the selections', () => {
      const outlook = UpbringingsHelper.getAllUpbringings(
        CharacterType.Starfleet,
      )[0];
      const char = makeCharacter();
      char.upbringingStep = new UpbringingStep(outlook);
      char.upbringingStep.discipline = Department.Command;
      char.upbringingStep.focus = 'Leadership';
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterEarlyOutlook(outlook),
      );
      expect(result.currentCharacter.upbringingStep.discipline).toBe(
        Department.Command,
      );
      expect(result.currentCharacter.upbringingStep.focus).toBe('Leadership');
    });
  });

  describe('SET_CHARACTER_FOCUS', () => {
    it('sets the early outlook focus', () => {
      const outlook = UpbringingsHelper.getAllUpbringings(
        CharacterType.Starfleet,
      )[0];
      const char = makeCharacter();
      char.upbringingStep = new UpbringingStep(outlook);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterFocus('Leadership', StepContext.EarlyOutlook),
      );
      expect(result.currentCharacter.upbringingStep.focus).toBe('Leadership');
    });

    it('sets the education focus when the index is in range', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterFocus('Navigation', StepContext.Education, 1),
      );
      expect(result.currentCharacter.educationStep.focuses[1]).toBe(
        'Navigation',
      );
    });

    it('ignores an education focus beyond the third slot', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterFocus('Navigation', StepContext.Education, 3),
      );
      expect(result.currentCharacter.educationStep.focuses.length).toBe(3);
      expect(result.currentCharacter.educationStep.focuses[3]).toBeUndefined();
    });

    it('sets career event focuses', () => {
      const char = makeCharacter();
      char.careerEvents = [new CareerEventStep(1), new CareerEventStep(2)];

      let state = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterFocus('Starship Tactics', StepContext.CareerEvent1),
      );
      expect(state.currentCharacter.careerEvents[0].focus).toBe(
        'Starship Tactics',
      );

      state = characterReducer(
        state as any,
        setCharacterFocus('Xenobiology', StepContext.CareerEvent2),
      );
      expect(state.currentCharacter.careerEvents[1].focus).toBe('Xenobiology');
    });

    it('ignores career event focuses when the events are absent', () => {
      const char = makeCharacter();
      let state = stateWithCharacter(char) as any;
      state = characterReducer(
        state,
        setCharacterFocus('Starship Tactics', StepContext.CareerEvent1),
      );
      state = characterReducer(
        state,
        setCharacterFocus('Xenobiology', StepContext.CareerEvent2),
      );
      expect(state.currentCharacter.careerEvents).toEqual([]);
    });

    it('pads supporting character focuses up to the requested index', () => {
      const char = makeSupportingCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterFocus('Piloting', StepContext.EarlyOutlook, 4),
      );
      expect(result.currentCharacter.supportingStep.focuses).toEqual([
        '',
        '',
        '',
        '',
        'Piloting',
      ]);
    });

    it('creates a supporting step when it is absent', () => {
      const char = makeSupportingCharacter();
      char.supportingStep = undefined;
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterFocus('Piloting', StepContext.EarlyOutlook, 0),
      );
      expect(result.currentCharacter.supportingStep.focuses[0]).toBe(
        'Piloting',
      );
    });

    it('pads npc focuses up to the requested index', () => {
      const char = makeNpcCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterFocus('Engineering', StepContext.EarlyOutlook, 2),
      );
      expect(result.currentCharacter.npcGenerationStep.focuses).toEqual([
        '',
        '',
        'Engineering',
      ]);
    });

    it('creates an npc generation step when it is absent', () => {
      const char = makeNpcCharacter();
      char.npcGenerationStep = undefined;
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterFocus('Engineering', StepContext.EarlyOutlook, 0),
      );
      expect(result.currentCharacter.npcGenerationStep.focuses[0]).toBe(
        'Engineering',
      );
    });
  });

  describe('SET_CHARACTER_FINISHING_TOUCHES', () => {
    it('preserves the value and talent but resets low-total attributes', () => {
      const char = makeCharacter();
      char.finishingStep = new FinishingStep();
      char.finishingStep.attributes = [Attribute.Control];
      char.finishingStep.value = 'Worn with Age';
      char.finishingStep.talent = new SelectedTalent('Bold');
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterFinishingTouches(),
      );
      expect(result.currentCharacter.finishingStep.value).toBe('Worn with Age');
      expect(result.currentCharacter.finishingStep.talent).toEqual(
        new SelectedTalent('Bold'),
      );
      expect(result.currentCharacter.finishingStep.attributes).toEqual([]);
    });
  });

  describe('ADD_CHARACTER_BORG_IMPLANT', () => {
    it('caps the implants at three', () => {
      const char = makeCharacter();
      char.speciesStep = new SpeciesStep(Species.Human);
      char.speciesStep.talent = new SelectedTalent(TALENT_NAME_BORG_IMPLANTS);
      let state = stateWithCharacter(char) as any;
      for (let i = 0; i < 5; i++) {
        state = characterReducer(state, addCharacterBorgImplant(i));
      }
      const talent = state.currentCharacter.getTalentByName(
        TALENT_NAME_BORG_IMPLANTS,
      );
      expect(talent.implants).toEqual([2, 3, 4]);
    });
  });

  describe('ADD_CHARACTER_TALENT / ADD_CHARACTER_TALENT_FOCUS / ADD_CHARACTER_TALENT_VALUE', () => {
    it('adds a talent to the species step', () => {
      const char = makeCharacter();
      char.speciesStep = new SpeciesStep(Species.Human);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        addCharacterTalent(
          new SelectedTalent('Shield Operator'),
          StepContext.Species,
        ),
      );
      expect(result.currentCharacter.speciesStep.talent).toEqual(
        new SelectedTalent('Shield Operator'),
      );
    });

    it('adds a focus to an existing talent', () => {
      const char = makeCharacter();
      char.speciesStep = new SpeciesStep(Species.Human);
      char.speciesStep.talent = new SelectedTalent('Shield Operator');
      const result = characterReducer(
        stateWithCharacter(char) as any,
        addCharacterTalentFocus('Fit', 'Shield Operator', 0),
      );
      expect(result.currentCharacter.speciesStep.talent.focuses).toEqual([
        'Fit',
      ]);
    });

    it('sets a value on an existing talent', () => {
      const char = makeCharacter();
      char.speciesStep = new SpeciesStep(Species.Human);
      char.speciesStep.talent = new SelectedTalent('Integrity');
      const result = characterReducer(
        stateWithCharacter(char) as any,
        addCharacterTalentValue('Worn with Age', 'Integrity'),
      );
      expect(result.currentCharacter.speciesStep.talent.value).toBe(
        'Worn with Age',
      );
    });

    it('sets the untapped potential attribute', () => {
      const char = makeCharacter();
      char.speciesStep = new SpeciesStep(Species.Human);
      char.speciesStep.talent = new SelectedTalent(
        TALENT_NAME_UNTAPPED_POTENTIAL,
      );
      const result = characterReducer(
        stateWithCharacter(char) as any,
        addCharacterUntappedPotentialAttribute(Attribute.Reason),
      );
      expect(result.currentCharacter.speciesStep.talent.attribute).toBe(
        Attribute.Reason,
      );
    });
  });

  describe('ADD_CHARACTER_CAREER_EVENT', () => {
    it('adds career events', () => {
      const char = makeCharacter();
      let state = characterReducer(
        stateWithCharacter(char) as any,
        addCharacterCareerEvent(1, StepContext.CareerEvent1),
      );
      state = characterReducer(
        state as any,
        addCharacterCareerEvent(2, StepContext.CareerEvent2),
      );
      expect(state.currentCharacter.careerEvents.length).toBe(2);
      expect(state.currentCharacter.careerEvents[0].id).toBe(1);
      expect(state.currentCharacter.careerEvents[1].id).toBe(2);
    });
  });

  describe('ADD_CHARACTER_LOG_ENTRY', () => {
    it('records the log entry as an improvement', () => {
      const char = makeCharacter();
      const logEntry = new LogEntry(3);
      logEntry.adventureTitle = 'Skirmish';
      const result = characterReducer(
        stateWithCharacter(char) as any,
        addCharacterLogEntry(logEntry),
      );
      expect(result.currentCharacter.improvements).toEqual([logEntry]);
    });
  });

  describe('supporting characters', () => {
    it('handles the supervisory flag and value', () => {
      const char = makeSupportingCharacter();
      char.supportingStep.value = 'The Needs of the Many';
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setSupportingCharacterSupervisory(true),
      );
      expect(result.currentCharacter.supportingStep.supervisory).toBe(true);
      expect(result.currentCharacter.supportingStep.value).toBe(
        'The Needs of the Many',
      );
    });

    it('sets supporting character departments and attributes', () => {
      const char = makeSupportingCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setSupportingCharacterDepartments([Department.Command]),
      );
      const attributesResult = characterReducer(
        result as any,
        setSupportingCharacterAttributes([Attribute.Control, Attribute.Daring]),
      );
      expect(result.currentCharacter.supportingStep.disciplines).toEqual([
        Department.Command,
      ]);
      expect(
        attributesResult.currentCharacter.supportingStep.attributes,
      ).toEqual([Attribute.Control, Attribute.Daring]);
    });
  });

  describe('NPC characters', () => {
    it('sets the NPC departments and attributes', () => {
      const char = makeNpcCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setNpcCharacterDepartments([3, 2, 1, 0, 0, 0]),
      );
      expect(result.currentCharacter.npcGenerationStep.departments).toEqual([
        3, 2, 1, 0, 0, 0,
      ]);
      const attributesResult = characterReducer(
        result as any,
        setNpcCharacterAttributes([8, 8, 8, 7, 7, 7]),
      );
      expect(
        attributesResult.currentCharacter.npcGenerationStep.attributes,
      ).toEqual([8, 8, 8, 7, 7, 7]);
    });

    it('adds values via the SET_NPC_CHARACTER_VALUE action', () => {
      const char = makeNpcCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        addNpcCharacterValue('Cunning', 2),
      );
      expect(result.currentCharacter.npcGenerationStep.values[2]).toBe(
        'Cunning',
      );
    });

    it('adds and removes equipment', () => {
      const char = makeNpcCharacter();
      const equipment = {
        type: undefined,
        name: 'Type-2 Phaser',
        protection: 0,
      };
      let result = characterReducer(
        stateWithCharacter(char) as any,
        addNpcCharacterEquipment(equipment as any),
      );
      expect(result.currentCharacter.npcGenerationStep.equipment).toEqual([
        equipment,
      ]);
      result = characterReducer(
        result as any,
        removeNpcCharacterEquipment(equipment as any),
      );
      expect(result.currentCharacter.npcGenerationStep.equipment).toEqual([]);
    });

    it('adds and removes weapons', () => {
      const char = makeNpcCharacter();
      const weapon = {};
      let result = characterReducer(
        stateWithCharacter(char) as any,
        addNpcCharacterWeapon(weapon as any),
      );
      expect(result.currentCharacter.npcGenerationStep.weapons).toEqual([
        weapon,
      ]);
      result = characterReducer(
        result as any,
        removeNpcCharacterWeapon(weapon as any),
      );
      expect(result.currentCharacter.npcGenerationStep.weapons).toEqual([]);
    });

    it('copies the NPC talents', () => {
      const char = makeNpcCharacter();
      const talent = new SelectedTalent('Bold');
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setNpcCharacterTalents([talent]),
      );
      expect(result.currentCharacter.npcGenerationStep.talents).toEqual([
        talent,
      ]);
      expect(result.currentCharacter.npcGenerationStep.talents[0]).not.toBe(
        talent,
      );
    });
  });

  describe('reputation and rank', () => {
    it('modifies reputation', () => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterReputation(1),
      );
      expect(result.currentCharacter.reputation).toBe(4);
    });

    it('records a promotion', () => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        modifyCharacterRank(
          new CharacterRank('Commander', Rank.Commander),
          ModificationType.Promotion,
        ),
      );
      expect(result.currentCharacter.improvements[0]).toBeInstanceOf(Promotion);
      expect(
        (result.currentCharacter.improvements[0] as Promotion).rank.name,
      ).toBe('Commander');
    });
  });

  describe('simple setters', () => {
    const cases: [string, any, (c: Character) => any][] = [
      ['name', setCharacterName('Jean-Luc Picard'), (c) => c.name],
      ['pastime', setCharacterPastime('Chess'), (c) => c.pastime],
      ['lineage', setCharacterLineage('Family'), (c) => c.lineage],
      ['house', setCharacterHouse('House of Mogh'), (c) => c.house],
      ['pronouns', setCharacterPronouns('they/them'), (c) => c.pronouns],
      [
        'additionalTraits',
        setCharacterAdditionalTraits('Brave'),
        (c) => c.additionalTraits,
      ],
      [
        'rankValue',
        setCharacterRank('Captain', Rank.Captain),
        (c) => c.rankValue,
      ],
      [
        'assignedShip',
        setCharacterAssignedShip('USS Enterprise'),
        (c) => c.assignedShip,
      ],
    ];

    it.each(cases)('sets the %s', (_label, action, selector) => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        action,
      ) as any;
      switch (_label) {
        case 'name':
          expect(selector(result.currentCharacter)).toBe('Jean-Luc Picard');
          break;
        case 'pastime':
          expect(selector(result.currentCharacter)).toEqual(['Chess']);
          break;
        case 'lineage':
          expect(selector(result.currentCharacter)).toBe('Family');
          break;
        case 'house':
          expect(selector(result.currentCharacter)).toBe('House of Mogh');
          break;
        case 'pronouns':
          expect(selector(result.currentCharacter)).toBe('they/them');
          break;
        case 'additionalTraits':
          expect(selector(result.currentCharacter)).toBe('Brave');
          break;
        case 'rankValue':
          expect(selector(result.currentCharacter).name).toBe('Captain');
          break;
        case 'assignedShip':
          expect(selector(result.currentCharacter)).toBe('USS Enterprise');
          break;
      }
    });

    it.each([
      [
        'age',
        setCharacterAge(makeCharacter().age),
        (c: Character) => c.age,
      ] as any,
    ])('sets the %s', (_label, _done) => {
      const source = makeCharacter();
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterAge(source.age),
      ) as any;
      expect(result.currentCharacter.age).toBe(source.age);
    });
  });

  describe('role/assignment and career length', () => {
    it('sets the role via SET_CHARACTER_ROLE', () => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterAssignment(Role.CommandingOfficer),
      );
      expect(result.currentCharacter.role).toBe(Role.CommandingOfficer);
    });

    it('sets the job assignment when given a string role', () => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterAssignment('Chief Engineer'),
      );
      expect(result.currentCharacter.jobAssignment).toBe('Chief Engineer');
    });

    it('sets the career length', () => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterCareerLength(Career.Veteran),
      );
      expect(result.currentCharacter.careerStep?.career).toBe(Career.Veteran);
    });
  });

  describe('character type changes', () => {
    it('sets the character type to Cadet', () => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterType(CharacterType.Cadet),
      );
      expect(result.currentCharacter.type).toBe(CharacterType.Cadet);
    });
  });

  describe('value and career event updates', () => {
    it('sets a value via SET_CHARACTER_VALUE', () => {
      const char = makeCharacter();
      char.environmentStep = new EnvironmentStep(Environment.Homeworld);
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterValue('The Needs of the Many', StepContext.Environment),
      );
      expect(result.currentCharacter.environmentStep?.value).toBe(
        'The Needs of the Many',
      );
    });

    it('sets education, career, and finishing touches values', () => {
      const char = makeCharacter();
      char.educationStep = new EducationStep(Track.Command);

      let state = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterValue('Explore the Unknown', StepContext.Education),
      );
      expect(state.currentCharacter.educationStep.value).toBe(
        'Explore the Unknown',
      );

      state.currentCharacter.careerStep = new CareerStep(Career.Experienced);
      state = characterReducer(
        state as any,
        setCharacterValue('Serve with Honor', StepContext.Career),
      );
      expect(state.currentCharacter.careerStep.value).toBe('Serve with Honor');

      state.currentCharacter.finishingStep = new FinishingStep();
      state = characterReducer(
        state as any,
        setCharacterValue('Never Give Up', StepContext.FinishingTouches),
      );
      expect(state.currentCharacter.finishingStep.value).toBe('Never Give Up');
    });

    it('sets a supporting character value and creates the step when absent', () => {
      const char = makeSupportingCharacter();
      let state = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterValue('Protect the Crew', StepContext.EarlyOutlook),
      );
      expect(state.currentCharacter.supportingStep.value).toBe(
        'Protect the Crew',
      );

      state.currentCharacter.supportingStep = undefined;
      state = characterReducer(
        state as any,
        setCharacterValue('Question Orders', StepContext.EarlyOutlook),
      );
      expect(state.currentCharacter.supportingStep.value).toBe(
        'Question Orders',
      );
    });

    it('ignores a value change when the step is absent', () => {
      const char = makeCharacter();
      const result = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterValue('The Needs of the Many', StepContext.Environment),
      );
      expect(result.currentCharacter.environmentStep).toBeUndefined();
    });

    it('sets the career event trait', () => {
      const char = makeCharacter();
      let state = characterReducer(
        stateWithCharacter(char) as any,
        addCharacterCareerEvent(1, StepContext.CareerEvent1),
      );
      state = characterReducer(
        state as any,
        setCharacterCareerEventTrait('Anomaly', StepContext.CareerEvent1),
      );
      expect(state.currentCharacter.careerEvents[0].trait).toBe('Anomaly');
    });
  });

  describe('general edit updates', () => {
    describe('UPDATE_CHARACTER_GENERAL_EDIT_VALUE', () => {
      it('updates an education value', () => {
        const char = makeCharacter();
        char.educationStep = new EducationStep(Track.Command);
        char.educationStep.value = 'Old Value';
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old Value', AssemblyContext.Education, 0),
            'New Value',
          ),
        );
        expect(result.currentCharacter.educationStep?.value).toBe('New Value');
      });

      it('updates finishing touches, career, and environment values', () => {
        const char = makeCharacter();
        char.finishingStep = new FinishingStep();
        char.careerStep = new CareerStep(Career.Experienced);
        char.environmentStep = new EnvironmentStep(Environment.Homeworld);

        let state = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old', AssemblyContext.FinishingTouches, 0),
            'Finishing',
          ),
        );
        expect(state.currentCharacter.finishingStep.value).toBe('Finishing');

        state = characterReducer(
          state as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old', AssemblyContext.Career, 0),
            'Career',
          ),
        );
        expect(state.currentCharacter.careerStep.value).toBe('Career');

        state = characterReducer(
          state as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old', AssemblyContext.Environment, 0),
            'Environment',
          ),
        );
        expect(state.currentCharacter.environmentStep.value).toBe(
          'Environment',
        );
      });

      it('updates a talent value', () => {
        const char = makeCharacter();
        char.speciesStep = new SpeciesStep(Species.Human);
        char.speciesStep.talent = new SelectedTalent('Bold');
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old', AssemblyContext.Talent, 0),
            'New Value',
          ),
        );
        expect(result.currentCharacter.speciesStep.talent.value).toBe(
          'New Value',
        );
      });

      it('updates a log entry value when an index is supplied', () => {
        const char = makeCharacter();
        const logEntry = new LogEntry(1);
        logEntry.valuesUsed = [new LogValueEntry('Old Value')];
        char.improvements = [logEntry];
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old Value', AssemblyContext.Improvement, 0, 0),
            'New Value',
          ),
        );
        expect(result.currentCharacter.improvements[0]).toBeInstanceOf(
          LogEntry,
        );
        expect(
          (result.currentCharacter.improvements[0] as LogEntry).valuesUsed,
        ).toHaveLength(1);
      });

      it('ignores a log entry value change without an index', () => {
        const char = makeCharacter();
        const logEntry = new LogEntry(1);
        logEntry.valuesUsed = [new LogValueEntry('Old Value')];
        char.improvements = [logEntry];
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old Value', AssemblyContext.Improvement, 0),
            'New Value',
          ),
        );
        expect(
          (result.currentCharacter.improvements[0] as LogEntry).valuesUsed[0]
            .value,
        ).toBe('Old Value');
      });

      it('updates a value improvement', () => {
        const char = makeCharacter();
        const step = new CharacterAdvancementStep();
        step.choice = CharacterAdvancementChoice.Value;
        char.improvements = [step];
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old', AssemblyContext.Improvement, 0),
            'New Value',
          ),
        );
        expect(
          (result.currentCharacter.improvements[0] as CharacterAdvancementStep)
            .value,
        ).toBe('New Value');
      });

      it('ignores a value improvement with a different choice', () => {
        const char = makeCharacter();
        const step = new CharacterAdvancementStep();
        step.choice = CharacterAdvancementChoice.Focus;
        char.improvements = [step];
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old', AssemblyContext.Improvement, 0),
            'New Value',
          ),
        );
        expect(
          (result.currentCharacter.improvements[0] as CharacterAdvancementStep)
            .value,
        ).toBeUndefined();
      });

      it('ignores a value change when the step is absent', () => {
        const char = makeCharacter();
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditValueChange(
            new ValueAssembly('Old', AssemblyContext.FinishingTouches, 0),
            'New Value',
          ),
        );
        expect(result.currentCharacter.finishingStep).toBeUndefined();
      });
    });

    describe('UPDATE_CHARACTER_GENERAL_EDIT_FOCUS', () => {
      it('updates a career event focus', () => {
        const char = makeCharacter();
        char.careerEvents = [new CareerEventStep(1)];
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditFocusChange(
            new FocusAssembly('Old', AssemblyContext.CareerEvent, 0),
            'New Focus',
          ),
        );
        expect(result.currentCharacter.careerEvents[0].focus).toBe('New Focus');
      });

      it('updates an education focus', () => {
        const char = makeCharacter();
        char.educationStep = new EducationStep(Track.Command);
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditFocusChange(
            new FocusAssembly('Old', AssemblyContext.Education, 0, 1),
            'New Focus',
          ),
        );
        expect(result.currentCharacter.educationStep.focuses[1]).toBe(
          'New Focus',
        );
      });

      it('updates an early outlook focus', () => {
        const outlook = UpbringingsHelper.getAllUpbringings(
          CharacterType.Starfleet,
        )[0];
        const char = makeCharacter();
        char.upbringingStep = new UpbringingStep(outlook);
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditFocusChange(
            new FocusAssembly('Old', AssemblyContext.EarlyOutlook, 0),
            'New Focus',
          ),
        );
        expect(result.currentCharacter.upbringingStep.focus).toBe('New Focus');
      });

      it('updates a species ability focus', () => {
        const char = makeCharacter();
        char.speciesStep = new SpeciesStep(Species.Human);
        char.speciesStep.abilityOptions = new SpeciesAbilityOptions();
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditFocusChange(
            new FocusAssembly('Old', AssemblyContext.SpeciesAbility, 0, 0),
            'New Focus',
          ),
        );
        expect(
          result.currentCharacter.speciesStep.abilityOptions.focuses[0],
        ).toBe('New Focus');
      });

      it('updates a talent focus', () => {
        const char = makeCharacter();
        char.speciesStep = new SpeciesStep(Species.Human);
        char.speciesStep.talent = new SelectedTalent('Bold');
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditFocusChange(
            new FocusAssembly('Old', AssemblyContext.Talent, 0, 0),
            'New Focus',
          ),
        );
        expect(result.currentCharacter.speciesStep.talent.focuses[0]).toBe(
          'New Focus',
        );
      });

      it('updates a focus improvement', () => {
        const char = makeCharacter();
        const step = new CharacterAdvancementStep();
        step.choice = CharacterAdvancementChoice.Focus;
        char.improvements = [step];
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditFocusChange(
            new FocusAssembly('Old', AssemblyContext.Improvement, 0),
            'New Focus',
          ),
        );
        expect(
          (result.currentCharacter.improvements[0] as CharacterAdvancementStep)
            .value,
        ).toBe('New Focus');
      });

      it('ignores a focus improvement with a different choice', () => {
        const char = makeCharacter();
        const step = new CharacterAdvancementStep();
        step.choice = CharacterAdvancementChoice.Value;
        char.improvements = [step];
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditFocusChange(
            new FocusAssembly('Old', AssemblyContext.Improvement, 0),
            'New Focus',
          ),
        );
        expect(
          (result.currentCharacter.improvements[0] as CharacterAdvancementStep)
            .value,
        ).toBeUndefined();
      });

      it('ignores a focus change when the step is absent', () => {
        const char = makeCharacter();
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditFocusChange(
            new FocusAssembly('Old', AssemblyContext.Education, 0, 0),
            'New Focus',
          ),
        );
        expect(result.currentCharacter.educationStep).toBeUndefined();
      });
    });

    describe('UPDATE_CHARACTER_GENERAL_EDIT_TALENT', () => {
      it('updates species, early outlook, education, career, and finishing talents', () => {
        const outlook = UpbringingsHelper.getAllUpbringings(
          CharacterType.Starfleet,
        )[0];
        const char = makeCharacter();
        char.speciesStep = new SpeciesStep(Species.Human);
        char.upbringingStep = new UpbringingStep(outlook);
        char.educationStep = new EducationStep(Track.Command);
        char.careerStep = new CareerStep(Career.Experienced);
        char.finishingStep = new FinishingStep();

        let state = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditTalentChange(
            new TalentAssembly(
              new SelectedTalent('Old'),
              AssemblyContext.Species,
              0,
            ),
            new SelectedTalent('Species'),
          ),
        );
        expect(state.currentCharacter.speciesStep.talent.talent).toBe(
          'Species',
        );

        state = characterReducer(
          state as any,
          updateCharacterGeneralEditTalentChange(
            new TalentAssembly(
              new SelectedTalent('Old'),
              AssemblyContext.EarlyOutlook,
              0,
            ),
            new SelectedTalent('Outlook'),
          ),
        );
        expect(state.currentCharacter.upbringingStep.talent.talent).toBe(
          'Outlook',
        );

        state = characterReducer(
          state as any,
          updateCharacterGeneralEditTalentChange(
            new TalentAssembly(
              new SelectedTalent('Old'),
              AssemblyContext.Education,
              0,
            ),
            new SelectedTalent('Education'),
          ),
        );
        expect(state.currentCharacter.educationStep.talent.talent).toBe(
          'Education',
        );

        state = characterReducer(
          state as any,
          updateCharacterGeneralEditTalentChange(
            new TalentAssembly(
              new SelectedTalent('Old'),
              AssemblyContext.Career,
              0,
            ),
            new SelectedTalent('Career'),
          ),
        );
        expect(state.currentCharacter.careerStep.talent.talent).toBe('Career');

        state = characterReducer(
          state as any,
          updateCharacterGeneralEditTalentChange(
            new TalentAssembly(
              new SelectedTalent('Old'),
              AssemblyContext.FinishingTouches,
              0,
            ),
            new SelectedTalent('Finishing'),
          ),
        );
        expect(state.currentCharacter.finishingStep.talent.talent).toBe(
          'Finishing',
        );
      });

      it('updates a talent improvement', () => {
        const char = makeCharacter();
        const step = new CharacterAdvancementStep();
        step.choice = CharacterAdvancementChoice.Talent;
        char.improvements = [step];
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditTalentChange(
            new TalentAssembly(
              new SelectedTalent('Old'),
              AssemblyContext.Improvement,
              0,
            ),
            new SelectedTalent('New'),
          ),
        );
        expect(
          (
            (
              result.currentCharacter
                .improvements[0] as CharacterAdvancementStep
            ).value as SelectedTalent
          ).talent,
        ).toBe('New');
      });

      it('ignores a talent improvement with a different choice', () => {
        const char = makeCharacter();
        const step = new CharacterAdvancementStep();
        step.choice = CharacterAdvancementChoice.Value;
        char.improvements = [step];
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditTalentChange(
            new TalentAssembly(
              new SelectedTalent('Old'),
              AssemblyContext.Improvement,
              0,
            ),
            new SelectedTalent('New'),
          ),
        );
        expect(
          (result.currentCharacter.improvements[0] as CharacterAdvancementStep)
            .value,
        ).toBeUndefined();
      });

      it('ignores a talent change when the step is absent', () => {
        const char = makeCharacter();
        const result = characterReducer(
          stateWithCharacter(char) as any,
          updateCharacterGeneralEditTalentChange(
            new TalentAssembly(
              new SelectedTalent('Old'),
              AssemblyContext.Species,
              0,
            ),
            new SelectedTalent('New'),
          ),
        );
        expect(result.currentCharacter.speciesStep).toBeUndefined();
      });
    });

    describe('UPDATE_CHARACTER_GENERAL_EDIT_SPECIES_ABILITY', () => {
      it('sets the species ability and clears the selected talent', () => {
        const char = makeCharacter();
        char.speciesStep = new SpeciesStep(Species.Human);
        char.speciesStep.talent = new SelectedTalent('Bold');
        const action = updateCharacterGeneralEditSpeciesAbility(Species.Human);
        const result = characterReducer(
          stateWithCharacter(char) as any,
          action,
        );
        expect(result.currentCharacter.speciesStep.ability).toBe(
          action.payload.ability,
        );
        expect(result.currentCharacter.speciesStep.talent).toBeUndefined();
      });
    });

    it('updates a value used in a log entry', () => {
      const char = makeCharacter();
      const logEntry = new LogEntry(1);
      logEntry.valuesUsed = [
        new LogValueEntry('Old Value', ValueUseType.Challenged, 'Replacement'),
      ];
      char.improvements = [logEntry];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        updateCharacterGeneralEditValueChange(
          new ValueAssembly('Old Value', AssemblyContext.Improvement, 0, 0),
          'New Value',
        ),
      );
      const updated = (result.currentCharacter.improvements[0] as LogEntry)
        .valuesUsed[0];
      expect(updated).toBeInstanceOf(LogValueEntry);
      expect(updated.value).toBe('New Value');
      expect(updated.useType).toBe(ValueUseType.Challenged);
      expect(updated.newValue).toBe('Replacement');
    });

    it('ignores an out-of-range log entry value index', () => {
      const char = makeCharacter();
      const logEntry = new LogEntry(1);
      logEntry.valuesUsed = [new LogValueEntry('Old Value')];
      char.improvements = [logEntry];
      const result = characterReducer(
        stateWithCharacter(char) as any,
        updateCharacterGeneralEditValueChange(
          new ValueAssembly('Old Value', AssemblyContext.Improvement, 0, 5),
          'New Value',
        ),
      );
      expect(
        (result.currentCharacter.improvements[0] as LogEntry).valuesUsed[0]
          .value,
      ).toBe('Old Value');
    });
  });

  describe('species ability', () => {
    it('adds a species ability focus', () => {
      const char = makeCharacter();
      let state = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterSpecies(Species.Human),
      );
      state = characterReducer(
        state as any,
        setCharacterSpeciesAbilityFocus('Navigation, Spaceflight'),
      );
      expect(state.currentCharacter.speciesStep.abilityOptions.focuses[0]).toBe(
        'Navigation, Spaceflight',
      );
    });

    it('sets the species ability choice', () => {
      const char = makeCharacter();
      let state = characterReducer(
        stateWithCharacter(char) as any,
        setCharacterSpecies(Species.Human),
      );
      state = characterReducer(
        state as any,
        setCharacterSpeciesAbilityChoice(SpeciesAbilityChoice.Choice2),
      );
      expect(state.currentCharacter.speciesStep.abilityOptions.choice).toBe(
        SpeciesAbilityChoice.Choice2,
      );
    });
  });

  it('uses the default state when state is undefined', () => {
    const result = characterReducer(
      undefined as any,
      setCharacter(makeCharacter()),
    );
    expect(result.currentCharacter).toBeDefined();
  });
});
