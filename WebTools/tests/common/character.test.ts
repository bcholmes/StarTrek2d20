import { describe, expect, test } from '@jest/globals';
import {
  CareerStep,
  Character,
  CharacterAdvancementStep,
  EducationStep,
  EnvironmentStep,
  FinishingStep,
  NpcGenerationStep,
  SpeciesAbilityOptions,
  SpeciesStep,
  SupportingStep,
} from '../../src/common/character';
import { Stereotype } from '../../src/common/construct';
import { AssemblyContext } from '../../src/common/characterAssembly';
import {
  LogEntry,
  LogValueEntry,
  ValueUseType,
} from '../../src/common/logEntry';
import { CharacterAdvancementChoice } from '../../src/modify/model/characterAdvancementChoice';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { Role } from '../../src/helpers/roles';
import { Species } from '../../src/helpers/speciesEnum';
import { Environment } from '../../src/helpers/environments';
import { Track } from '../../src/helpers/trackEnum';
import { Career } from '../../src/helpers/careerEnum';
import { NpcType } from '../../src/npc/model/npcType';

const makeCharacter = (stereotype: Stereotype): Character => {
  const character = new Character();
  character.stereotype = stereotype;
  character.improvements = [];
  character.legacyMode = false;
  return character;
};

const withTalents = (character: Character, talents: SelectedTalent[]) => {
  Object.defineProperty(character, 'talents', {
    configurable: true,
    get: () => talents,
  });
  return character;
};

const withSpeciesFocuses = (character: Character, focuses: string[]) => {
  const speciesStep = new SpeciesStep(Species.Human);
  speciesStep.abilityOptions = new SpeciesAbilityOptions();
  speciesStep.abilityOptions.focuses = focuses;
  character.speciesStep = speciesStep;
  return character;
};

describe('Character', () => {
  describe('copy', () => {
    test('copies the primary role', () => {
      const character = new Character();
      character.role = Role.ScienceOfficer;

      const result = character.copy();

      expect(result.role).toBe(Role.ScienceOfficer);
    });

    test('copies the secondary role', () => {
      const character = new Character();
      character.role = Role.ScienceOfficer;
      character.secondaryRole = Role.ChiefMedicalOfficer;

      const result = character.copy();

      expect(result.role).toBe(Role.ScienceOfficer);
      expect(result.secondaryRole).toBe(Role.ChiefMedicalOfficer);
    });
  });

  describe('value assemblies', () => {
    test('assembles main values with their contexts', () => {
      const character = withTalents(
        makeCharacter(Stereotype.MainCharacter),
        [],
      );
      const environment = new EnvironmentStep(Environment.Homeworld);
      environment.value = 'Duty';
      const education = new EducationStep(Track.Command);
      education.value = 'Curiosity';
      const career = new CareerStep(Career.Experienced);
      career.value = 'Serve';
      const finishing = new FinishingStep();
      finishing.value = 'Never Give Up';
      character.environmentStep = environment;
      character.educationStep = education;
      character.careerStep = career;
      character.finishingStep = finishing;

      const valued = new SelectedTalent('Bold');
      valued.value = 'Courage';
      const blank = new SelectedTalent('Cautious');
      blank.value = '';
      withTalents(character, [valued, blank]);

      expect(character.values).toEqual([
        'Duty',
        'Curiosity',
        'Serve',
        'Never Give Up',
        'Courage',
      ]);
      expect(character.valueAssemblies.map((a) => a.context)).toEqual([
        AssemblyContext.Environment,
        AssemblyContext.Education,
        AssemblyContext.Career,
        AssemblyContext.FinishingTouches,
        AssemblyContext.Talent,
      ]);
      expect(character.valueAssemblies[4].contextIndex).toBe(0);
    });

    test('assembles supporting values', () => {
      const character = withTalents(
        makeCharacter(Stereotype.SupportingCharacter),
        [],
      );
      const supporting = new SupportingStep();
      supporting.value = 'Compassion';
      character.supportingStep = supporting;

      expect(character.values).toEqual(['Compassion']);
      expect(character.valueAssemblies[0].context).toBe(
        AssemblyContext.Supporting,
      );
    });

    test('returns NPC values without assembly', () => {
      const character = makeCharacter(Stereotype.Npc);
      const generation = new NpcGenerationStep(NpcType.Notable);
      generation.values = ['Logic', ''];
      character.npcGenerationStep = generation;

      expect(character.values).toEqual(['Logic', '']);
    });

    test('replaces and appends values through advancements', () => {
      const character = withTalents(
        makeCharacter(Stereotype.MainCharacter),
        [],
      );
      const environment = new EnvironmentStep(Environment.Homeworld);
      environment.value = 'Old';
      character.environmentStep = environment;

      const replace = new CharacterAdvancementStep();
      replace.choice = CharacterAdvancementChoice.Value;
      replace.removeValue = 'Old';
      replace.value = 'New';
      const append = new CharacterAdvancementStep();
      append.choice = CharacterAdvancementChoice.Value;
      append.removeValue = 'Absent';
      append.value = 'Extra';
      character.improvements = [replace, append];

      expect(character.values).toEqual(['New', 'Extra']);
      expect(character.valueAssemblies.map((a) => a.context)).toEqual([
        AssemblyContext.Improvement,
        AssemblyContext.Improvement,
      ]);
      expect(character.valueAssemblies[0].contextIndex).toBe(0);
      expect(character.valueAssemblies[1].contextIndex).toBe(1);
    });

    test('replaces challenged log values and skips unusable entries', () => {
      const character = withTalents(
        makeCharacter(Stereotype.MainCharacter),
        [],
      );
      const environment = new EnvironmentStep(Environment.Homeworld);
      environment.value = 'Old';
      character.environmentStep = environment;

      const log = new LogEntry(1);
      log.valuesUsed = [
        new LogValueEntry('Old', ValueUseType.Challenged, 'New'),
        new LogValueEntry('NoNew', ValueUseType.Challenged),
        new LogValueEntry(
          'Positive',
          ValueUseType.UsedPositively,
          'Should not appear',
        ),
      ];
      character.improvements = [log];

      expect(character.values).toEqual(['New']);
      expect(character.valueAssemblies[0].context).toBe(
        AssemblyContext.Improvement,
      );
      expect(character.valueAssemblies[0].index).toBe(0);
    });
  });

  describe('focus assemblies', () => {
    test('assembles main focuses with their contexts', () => {
      const character = withSpeciesFocuses(
        makeCharacter(Stereotype.MainCharacter),
        ['Navigation, Spaceflight', ''],
      );
      character.upbringingStep = { focus: 'Curiosity' } as any;
      const education = new EducationStep(Track.Command);
      education.focuses = ['Engineering', ''];
      character.educationStep = education;
      character.careerEvents = [
        { focus: 'Survival' } as any,
        { focus: '' } as any,
      ];
      const talent = new SelectedTalent('Bold');
      talent.focuses = ['   ', 'Teamwork'];
      withTalents(character, [talent]);

      expect(character.focuses).toEqual([
        'Navigation, Spaceflight',
        'Curiosity',
        'Engineering',
        'Survival',
        'Teamwork',
      ]);
      expect(character.focusAssemblies.map((f) => f.context)).toEqual([
        AssemblyContext.SpeciesAbility,
        AssemblyContext.EarlyOutlook,
        AssemblyContext.Education,
        AssemblyContext.CareerEvent,
        AssemblyContext.Talent,
      ]);
    });

    test('replaces main focuses with legacy focuses in legacy mode', () => {
      const character = withSpeciesFocuses(
        makeCharacter(Stereotype.MainCharacter),
        ['Navigation'],
      );
      character.upbringingStep = { focus: 'Curiosity' } as any;
      character.focusValues = ['Legacy A', 'Legacy B'];
      character.legacyMode = true;
      const talent = new SelectedTalent('Bold');
      talent.focuses = ['Teamwork'];
      withTalents(character, [talent]);

      expect(character.focuses).toEqual(['Legacy A', 'Legacy B']);
      expect(character.focusAssemblies.map((f) => f.context)).toEqual([
        AssemblyContext.Legacy,
        AssemblyContext.Legacy,
      ]);
    });

    test('assembles supporting focuses with blank filtering', () => {
      const character = withSpeciesFocuses(
        makeCharacter(Stereotype.SupportingCharacter),
        ['Navigation', ''],
      );
      const supporting = new SupportingStep();
      supporting.focuses = ['Diplomacy', '  ', ''];
      character.supportingStep = supporting;
      withTalents(character, []);

      expect(character.focuses).toEqual(['Navigation', 'Diplomacy']);
      expect(character.focusAssemblies.map((f) => f.context)).toEqual([
        AssemblyContext.SpeciesAbility,
        AssemblyContext.Supporting,
      ]);
    });

    test('assembles NPC focuses with blank filtering', () => {
      const character = withSpeciesFocuses(makeCharacter(Stereotype.Npc), [
        'Navigation',
        '',
      ]);
      const generation = new NpcGenerationStep(NpcType.Notable);
      generation.focuses = ['Meditation', '  ', ''];
      character.npcGenerationStep = generation;

      expect(character.focuses).toEqual(['Navigation', 'Meditation']);
      expect(character.focusAssemblies.map((f) => f.context)).toEqual([
        AssemblyContext.SpeciesAbility,
        AssemblyContext.Npc,
      ]);
    });

    test('replaces and appends focuses through advancements', () => {
      const character = withTalents(
        makeCharacter(Stereotype.MainCharacter),
        [],
      );
      character.upbringingStep = { focus: 'Old' } as any;

      const replace = new CharacterAdvancementStep();
      replace.choice = CharacterAdvancementChoice.Focus;
      replace.removeValue = 'Old';
      replace.value = 'New';
      const append = new CharacterAdvancementStep();
      append.choice = CharacterAdvancementChoice.Focus;
      append.value = 'Extra';
      character.improvements = [replace, append];

      expect(character.focuses).toEqual(['New', 'Extra']);
      expect(character.focusAssemblies.map((f) => f.context)).toEqual([
        AssemblyContext.Improvement,
        AssemblyContext.Improvement,
      ]);
    });
  });
});
