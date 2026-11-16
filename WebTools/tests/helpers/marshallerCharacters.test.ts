import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import i18next from 'i18next';
import '../../src/helpers/species';
import { CharacterType } from '../../src/common/characterType';
import {
  LogEntry,
  LogValueEntry,
  ValueUseType,
} from '../../src/common/logEntry';
import { SelectedTalent } from '../../src/common/selectedTalent';
import {
  SimpleStats,
  Starship,
  StarshipAdvancementStep,
} from '../../src/common/starship';
import { StarshipAdvancementChoice } from '../../src/common/starshipAdvancementChoice';
import { TokenConfig } from '../../src/common/character';
import { Department } from '../../src/helpers/department';
import { Era } from '../../src/helpers/erasEnum';
import { marshaller } from '../../src/helpers/marshaller';
import { Role } from '../../src/helpers/roles';
import { Spaceframe } from '../../src/helpers/spaceframeEnum';
import { SpaceframeAppearance } from '../../src/helpers/spaceframeAppearance';
import { SpaceframeModel } from '../../src/helpers/spaceframeModel';
import { System } from '../../src/helpers/systems';
import { TokenModel } from '../../src/token/model/tokenModel';
import { StarshipWeaponRegistry } from '../../src/helpers/weapons';
import translations from '../../src/i18n/locales/en/translations.json';
import {
  makePopulatedMainCharacter,
  makePopulatedStarship,
} from '../vtt/vttFixtures';

jest.mock('../../src/state/store', () => ({
  store: {
    getState: jest.fn(() => ({
      context: {
        sources: [1],
      },
    })),
  },
}));

beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    resources: { en: { translation: translations } },
  });
});

describe('marshaller character and starship coverage', () => {
  test.each([1, 2] as const)(
    'round-trips a populated v%s main character',
    (version) => {
      const character = makePopulatedMainCharacter(version);
      const token = TokenModel.createDefault();
      character.image = new TokenConfig(token, true, false);

      const log = new LogEntry(99);
      log.adventureTitle = 'The Last Signal';
      log.missionDescription = 'Investigate a silent relay.';
      log.notes = 'The crew performed well.';
      log.valuesUsed = [
        new LogValueEntry('Duty', ValueUseType.UsedNegatively, 'Honor'),
      ];
      log.directivesUsed = ['Prime Directive'];
      character.improvements.push(log);

      const json = marshaller.decode(marshaller.encodeConstruct(character));
      const restored = marshaller.decodeCharacter(json);

      expect(json.stereotype).toBe('mainCharacter');
      expect(restored.name).toBe(character.name);
      expect(restored.type).toBe(CharacterType.Starfleet);
      expect(restored.era).toBe(Era.NextGeneration);
      expect(restored.version).toBe(version);
      expect(restored.description).toBe(character.description);
      expect(restored.pronouns).toBe(character.pronouns);
      expect(restored.pastime).toEqual(character.pastime);
      expect(restored.additionalTraits).toBe(character.additionalTraits);
      expect(restored.rankValue?.id).toBe(character.rankValue?.id);
      expect(restored.role).toBe(Role.ChiefEngineer);
      expect(restored.secondaryRole).toBe(Role.OperationsManager);
      expect(restored.assignedShip).toBe('USS Venture');
      expect(restored.speciesStep?.species).toBe(
        character.speciesStep?.species,
      );
      expect(restored.speciesStep?.attributes).toEqual(
        character.speciesStep?.attributes,
      );
      expect(restored.environmentStep?.attribute).toBe(
        character.environmentStep?.attribute,
      );
      expect(restored.environmentStep?.value).toBe(
        character.environmentStep?.value,
      );
      expect(restored.upbringingStep?.upbringing?.id).toBe(
        character.upbringingStep?.upbringing?.id,
      );
      expect(restored.upbringingStep?.talent?.name).toBe(
        character.upbringingStep?.talent?.name,
      );
      expect(restored.educationStep?.track).toBe(
        character.educationStep?.track,
      );
      expect(restored.educationStep?.focuses).toEqual(
        character.educationStep?.focuses,
      );
      expect(restored.careerEvents.map((e) => e.id)).toEqual(
        character.careerEvents.map((e) => e.id),
      );
      expect(restored.careerEvents[0].focus).toBe('Survival');
      expect(restored.careerEvents[1].discipline).toBe(Department.Command);
      expect(restored.improvements).toHaveLength(4);

      const restoredLog = restored.logEntries[0];
      expect(restoredLog.id).toBe(99);
      expect(restoredLog.adventureTitle).toBe('The Last Signal');
      expect(restoredLog.missionDescription).toBe(
        'Investigate a silent relay.',
      );
      expect(restoredLog.notes).toBe('The crew performed well.');
      expect(restoredLog.valuesUsed?.[0].value).toBe('Duty');
      expect(restoredLog.valuesUsed?.[0].useType).toBe(
        ValueUseType.UsedNegatively,
      );
      expect(restoredLog.valuesUsed?.[0].newValue).toBe('Honor');
      expect(restoredLog.directivesUsed).toEqual(['Prime Directive']);

      expect(restored.image).toBeInstanceOf(TokenConfig);
      expect((restored.image as TokenConfig).token.primarySpecies).toBe(
        token.primarySpecies,
      );
      expect((restored.image as TokenConfig).rounded).toBe(true);
      expect((restored.image as TokenConfig).bordered).toBe(false);
    },
  );

  test('round-trips a populated starship with a mission profile and improvements', () => {
    const starship = makePopulatedStarship();

    const systemAdvancement = new StarshipAdvancementStep();
    systemAdvancement.choice = StarshipAdvancementChoice.System;
    systemAdvancement.value = System.Engines;
    systemAdvancement.removeValue = System.Structure;

    const departmentAdvancement = new StarshipAdvancementStep();
    departmentAdvancement.choice = StarshipAdvancementChoice.Department;
    departmentAdvancement.value = Department.Engineering;
    departmentAdvancement.removeValue = Department.Command;

    const talentAdvancement = new StarshipAdvancementStep();
    talentAdvancement.choice = StarshipAdvancementChoice.Talent;
    talentAdvancement.value = new SelectedTalent('Bold');
    talentAdvancement.removeValue = new SelectedTalent('Cautious');

    starship.advancementSteps = [
      systemAdvancement,
      departmentAdvancement,
      talentAdvancement,
    ];

    const encoded = marshaller.encodeConstruct(starship);
    const json = marshaller.decode(encoded);
    const restored = marshaller.decodeStarship(encoded);

    expect(json.stereotype).toBe('starship');
    expect(restored.name).toBe('USS Venture');
    expect(restored.registry).toBe('NCC-70637');
    expect(restored.serviceYear).toBe(2372);
    expect(restored.type).toBe(CharacterType.Starfleet);
    expect(restored.era).toBe(Era.NextGeneration);
    expect(restored.version).toBe(2);
    expect(restored.spaceframeModel?.id).toBe(Spaceframe.Galaxy_2E);
    expect(restored.traits).toBe('Flagship, Hero Ship');
    expect(restored.missionProfileStep?.type?.id).toBe(
      starship.missionProfileStep?.type?.id,
    );
    expect(restored.missionProfileStep?.system).toBe(
      starship.missionProfileStep?.system,
    );
    expect(restored.missionProfileStep?.talent?.name).toBe(
      starship.missionProfileStep?.talent?.name,
    );
    expect(restored.additionalTalents.map((t) => t.name)).toEqual([
      'Secondary Reactors',
      'Redundant Systems',
      'Dedicated Personnel',
    ]);
    expect(restored.refits).toEqual([System.Engines, System.Weapons]);
    expect(restored.advancementSteps).toHaveLength(3);
    expect(restored.advancementSteps[0].choice).toBe(
      StarshipAdvancementChoice.System,
    );
    expect(restored.advancementSteps[0].value).toBe(System.Engines);
    expect(restored.advancementSteps[0].removeValue).toBe(System.Structure);
    expect(restored.advancementSteps[1].choice).toBe(
      StarshipAdvancementChoice.Department,
    );
    expect(restored.advancementSteps[1].value).toBe(Department.Engineering);
    expect(restored.advancementSteps[2].choice).toBe(
      StarshipAdvancementChoice.Talent,
    );
    expect((restored.advancementSteps[2].value as SelectedTalent).name).toBe(
      'Bold',
    );
  });

  test('round-trips a custom spaceframe starship', () => {
    const starship = Starship.createStandardStarship(
      Era.NextGeneration,
      CharacterType.Starfleet,
      2,
    );
    starship.name = 'Custom Ship';
    starship.spaceframeModel = SpaceframeModel.createCustomSpaceframe(
      CharacterType.Starfleet,
      2371,
    );
    starship.serviceYear = 2371;
    starship.spaceframeStep!.appearance = SpaceframeAppearance.Freighter;
    starship.spaceframeModel!.scale = 4;
    starship.spaceframeModel!.talents = [new SelectedTalent('Bold')];

    const encoded = marshaller.encodeConstruct(starship);
    const restored = marshaller.decodeStarship(encoded);

    expect(restored.name).toBe('Custom Ship');
    expect(restored.spaceframeModel?.isCustom).toBe(true);
    expect(restored.spaceframeModel?.name).toBe(starship.spaceframeModel?.name);
    expect(restored.spaceframeModel?.scale).toBe(4);
    expect(restored.spaceframeModel?.systems).toEqual(
      starship.spaceframeModel?.systems,
    );
    expect(restored.spaceframeModel?.departments).toEqual(
      starship.spaceframeModel?.departments,
    );
    expect(restored.spaceframeStep?.appearance).toBe(
      SpaceframeAppearance.Freighter,
    );
    expect(restored.spaceframeModel?.talents.map((t) => t.name)).toEqual([
      'Bold',
    ]);
  });

  test('round-trips a simple-stats starship with additional weapons', () => {
    const starship = Starship.createStandardStarship(
      Era.NextGeneration,
      CharacterType.Starfleet,
      2,
    );
    starship.name = 'Runabout';
    starship.simpleStats = new SimpleStats();
    starship.simpleStats.scale = 2;
    starship.simpleStats.className = 'Danube';
    starship.simpleStats.systems = [8, 8, 8, 8, 8, 8];
    starship.simpleStats.departments = [1, 1, 2, 2, 1, 1];
    starship.simpleStats.appearance = SpaceframeAppearance.Freighter;
    starship.additionalWeapons = [
      StarshipWeaponRegistry.getWeaponByName('Phaser Banks', 2),
    ];

    const restored = marshaller.decodeStarship(
      marshaller.encodeConstruct(starship),
    );

    expect(restored.simpleStats?.scale).toBe(2);
    expect(restored.simpleStats?.className).toBe('Danube');
    expect(restored.simpleStats?.systems).toEqual([8, 8, 8, 8, 8, 8]);
    expect(restored.simpleStats?.departments).toEqual([1, 1, 2, 2, 1, 1]);
    expect(restored.simpleStats?.appearance).toBe(
      SpaceframeAppearance.Freighter,
    );
    expect(restored.additionalWeapons.map((w) => w.name)).toEqual([
      'Phaser Banks',
    ]);
  });
});
