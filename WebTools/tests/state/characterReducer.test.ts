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
import { LogEntry } from '../../src/common/logEntry';
import { NpcType } from '../../src/npc/model/npcType';
import { Role } from '../../src/helpers/roles';
import { Rank } from '../../src/helpers/ranks';
import { Era } from '../../src/helpers/erasEnum';
import { ModificationType } from '../../src/modify/model/modificationType';
import {
  AssemblyContext,
  ValueAssembly,
} from '../../src/common/characterAssembly';
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
    ])('sets the %s', (_label, action, selector) => {
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
    it('updates a value via UPDATE_CHARACTER_GENERAL_EDIT_VALUE', () => {
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
