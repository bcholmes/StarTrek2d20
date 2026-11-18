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
import {
  AlliedMilitaryDetails,
  CareerStep,
  Character,
  CharacterRank,
  GovernmentDetails,
  OtherDetails,
  SpeciesStep,
  TokenConfig,
} from '../../src/common/character';
import { Stereotype } from '../../src/common/construct';
import { Specialization } from '../../src/common/specializationEnum';
import {
  AllyHelper,
  AlliedMilitaryType,
} from '../../src/helpers/alliedMilitary';
import { Attribute } from '../../src/helpers/attributes';
import { Career } from '../../src/helpers/careerEnum';
import { Department } from '../../src/helpers/department';
import { EquipmentModel, EquipmentType } from '../../src/helpers/equipment';
import { Era } from '../../src/helpers/erasEnum';
import { Governments, Polity } from '../../src/helpers/governments';
import { marshaller } from '../../src/helpers/marshaller';
import { Role } from '../../src/helpers/roles';
import { Species } from '../../src/helpers/speciesEnum';
import { Spaceframe } from '../../src/helpers/spaceframeEnum';
import { SpaceframeAppearance } from '../../src/helpers/spaceframeAppearance';
import { SpaceframeModel } from '../../src/helpers/spaceframeModel';
import { System } from '../../src/helpers/systems';
import { TokenModel } from '../../src/token/model/tokenModel';
import { StarshipWeaponRegistry } from '../../src/helpers/weapons';
import translations from '../../src/i18n/locales/en/translations.json';
import {
  makePopulatedMainCharacter,
  makePopulatedNpc,
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

describe('marshaller NPC and supporting character coverage', () => {
  test('round-trips a populated NPC with specialization and equipment', () => {
    const npc = makePopulatedNpc();
    npc.npcGenerationStep!.specialization = Specialization.Security;
    npc.npcGenerationStep!.equipment = [
      EquipmentType.Communicator,
      new EquipmentModel(EquipmentType.Other, 'Custom Kit'),
    ];
    npc.additionalTraits = 'Vulcan, Logical';
    npc.pronouns = 'he/him';
    npc.jobAssignment = 'Liaison Officer';
    npc.careerStep = new CareerStep(Career.Experienced);
    npc.careerStep.value = 'Logic';
    npc.careerStep.talent = new SelectedTalent('Bold');
    npc.legacyMode = true;
    npc.attributeValues = [9, 9, 8, 8, 7, 7];
    npc.skills = [3, 2, 2, 1, 1, 1];

    const encoded = marshaller.encodeConstruct(npc);
    const json = marshaller.decode(encoded);
    const restored = marshaller.decodeCharacter(json);

    expect(json.stereotype).toBe('npc');
    expect(restored.stereotype).toBe(Stereotype.Npc);
    expect(restored.name).toBe(npc.name);
    expect(restored.type).toBe(npc.type);
    expect(restored.era).toBe(npc.era);
    expect(restored.version).toBe(npc.version);
    expect(restored.description).toBe(npc.description);
    expect(restored.additionalTraits).toBe('Vulcan, Logical');
    expect(restored.pronouns).toBe('he/him');
    expect(restored.jobAssignment).toBe('Liaison Officer');
    expect(restored.rankValue?.name).toBe('Commander');
    expect(restored.careerStep?.career).toBe(Career.Experienced);
    expect(restored.attributeValues).toEqual([9, 9, 8, 8, 7, 7]);

    const step = restored.npcGenerationStep!;
    expect(step.values).toEqual(['Logic', 'Peace']);
    expect(step.talents.map((t) => t.name)).toEqual(['Bold', 'Veteran']);
    expect(step.specialization).toBe(Specialization.Security);
    expect(step.type).toBe(npc.npcGenerationStep?.type);
    expect(step.attributes).toEqual([0, 1, 0, 1, 0, 1]);
    expect(step.departments).toEqual([3, 2, 2, 1, 1, 1]);
    expect(step.focuses).toEqual([
      'Meditation',
      'Vulcan Nerve Pinch',
      'Science',
    ]);
    expect(step.weapons).toEqual(npc.npcGenerationStep?.weapons);
    expect(step.equipment[0]).toBe(EquipmentType.Communicator);
    const customEquipment = step.equipment[1] as EquipmentModel;
    expect(customEquipment.type).toBe(EquipmentType.Other);
    expect(customEquipment.name).toBe('Custom Kit');
  });

  test('decodes legacy OrionPirate NPC specialization', () => {
    const restored = marshaller.decodeCharacter({
      stereotype: 'npc',
      type: 'Starfleet',
      era: 'NextGeneration',
      version: 2,
      name: 'Orion Pirate',
      npc: { specialization: 'OrionPirate' },
    });

    expect(restored.npcGenerationStep?.specialization).toBe(
      Specialization.Pirate,
    );
  });

  test.each([1, 2] as const)(
    'round-trips a populated v%s supporting character',
    (version) => {
      const character = Character.createSupportingCharacter(
        Era.NextGeneration,
        version,
      );
      character.name = 'Mara Voss';
      character.description = 'A supporting character.';
      character.additionalTraits = 'Observant, Steady';
      character.pronouns = 'they/them';
      character.jobAssignment = 'Bartender';
      character.speciesStep!.attributes = [
        Attribute.Control,
        Attribute.Insight,
        Attribute.Presence,
      ];
      character.careerStep = new CareerStep(Career.Experienced);
      character.careerStep.value = 'Service';
      character.careerStep.talent = new SelectedTalent('Bold');
      character.supportingStep!.focuses = ['Diplomacy', 'Piloting', ''];
      character.supportingStep!.attributes = [
        Attribute.Daring,
        Attribute.Control,
        Attribute.Fitness,
        Attribute.Insight,
        Attribute.Presence,
        Attribute.Reason,
      ];
      character.supportingStep!.disciplines = [
        Department.Command,
        Department.Conn,
        Department.Engineering,
        Department.Security,
        Department.Science,
        Department.Medicine,
      ];
      character.supportingStep!.supervisory = true;
      character.supportingStep!.value = 'Service';

      const encoded = marshaller.encodeConstruct(character);
      const json = marshaller.decode(encoded);
      const restored = marshaller.decodeCharacter(json);

      expect(json.stereotype).toBe('supportingCharacter');
      expect(restored.stereotype).toBe(Stereotype.SupportingCharacter);
      expect(restored.name).toBe('Mara Voss');
      expect(restored.description).toBe('A supporting character.');
      expect(restored.additionalTraits).toBe('Observant, Steady');
      expect(restored.pronouns).toBe('they/them');
      expect(restored.jobAssignment).toBe('Bartender');
      expect(restored.version).toBe(version);
      expect(restored.type).toBe(CharacterType.Starfleet);
      expect(restored.era).toBe(Era.NextGeneration);
      expect(restored.speciesStep?.species).toBe(Species.Human);
      expect(restored.speciesStep?.attributes).toEqual(
        character.speciesStep?.attributes,
      );
      expect(restored.careerStep?.career).toBe(Career.Experienced);
      expect(restored.rankValue?.id).toBe(character.rankValue?.id);

      expect(restored.supportingStep?.focuses).toEqual([
        'Diplomacy',
        'Piloting',
      ]);
      expect(restored.supportingStep?.attributes).toEqual(
        character.supportingStep?.attributes,
      );
      expect(restored.supportingStep?.disciplines).toEqual(
        character.supportingStep?.disciplines,
      );
      expect(restored.supportingStep?.supervisory).toBe(true);
      expect(restored.supportingStep?.value).toBe('Service');
    },
  );

  test('round-trips legacy supporting attributes and disciplines', () => {
    const character = Character.createSupportingCharacter(
      Era.NextGeneration,
      2,
    );
    character.name = 'Legacy Supporting';
    character.legacyMode = true;
    character.attributeValues = [8, 9, 7, 6, 5, 4];
    character.skills = [3, 2, 2, 1, 1, 0];

    const restored = marshaller.decodeCharacter(
      marshaller.decode(marshaller.encodeConstruct(character)),
    );

    expect(restored.stereotype).toBe(Stereotype.SupportingCharacter);
    expect(restored.attributeValues).toEqual([8, 9, 7, 6, 5, 4]);
    expect(restored.skills).toEqual([3, 2, 2, 1, 1, 0]);
  });
});

describe('marshaller solo character coverage', () => {
  test('round-trips a populated solo character', () => {
    const character = Character.createSoloCharacter(Era.NextGeneration);
    character.version = 2;
    character.type = CharacterType.Starfleet;
    character.name = 'Solo Emissary';
    character.description = 'A solo character.';
    character.pronouns = 'she/her';
    character.additionalTraits = 'Diplomatic';
    character.legacyMode = true;
    character.attributeValues = [8, 7, 7, 8, 7, 8];
    character.rankValue = new CharacterRank('Commander');
    character.role = Role.ChiefEngineer;
    character.secondaryRole = Role.OperationsManager;
    character.jobAssignment = 'First Officer';
    character.assignedShip = 'USS Venture';
    character.speciesStep = new SpeciesStep(Species.Vulcan);
    character.speciesStep.attributes = [
      Attribute.Control,
      Attribute.Insight,
      Attribute.Reason,
    ];
    character.careerStep = new CareerStep(Career.Experienced);
    character.careerStep.value = 'Logic';
    character.careerStep.talent = new SelectedTalent('Bold');

    const encoded = marshaller.encodeConstruct(character);
    const json = marshaller.decode(encoded);
    const restored = marshaller.decodeCharacter(json);

    expect(json.stereotype).toBe('soloCharacter');
    expect(restored.stereotype).toBe(Stereotype.SoloCharacter);
    expect(restored.name).toBe('Solo Emissary');
    expect(restored.description).toBe('A solo character.');
    expect(restored.pronouns).toBe('she/her');
    expect(restored.additionalTraits).toBe('Diplomatic');
    expect(restored.type).toBe(CharacterType.Starfleet);
    expect(restored.era).toBe(Era.NextGeneration);
    expect(restored.version).toBe(2);
    expect(restored.rankValue?.name).toBe('Commander');
    expect(restored.role).toBe(Role.ChiefEngineer);
    expect(restored.secondaryRole).toBe(Role.OperationsManager);
    expect(restored.jobAssignment).toBe('First Officer');
    expect(restored.assignedShip).toBe('USS Venture');
    expect(restored.attributeValues).toEqual([8, 7, 7, 8, 7, 8]);
    expect(restored.skills).toEqual([1, 1, 1, 1, 1, 1]);
    expect(restored.speciesStep?.species).toBe(Species.Vulcan);
    expect(restored.speciesStep?.attributes).toEqual([
      Attribute.Control,
      Attribute.Insight,
      Attribute.Reason,
    ]);
    expect(restored.careerStep?.career).toBe(Career.Experienced);
    expect(restored.careerStep?.value).toBe('Logic');
    expect(restored.careerStep?.talent?.name).toBe('Bold');
  });
});

describe('marshaller type details coverage', () => {
  test('round-trips allied military type details', () => {
    const character = Character.createMainCharacter(
      CharacterType.AlliedMilitary,
      Era.NextGeneration,
      2,
    );
    character.name = 'Klingon Officer';
    character.typeDetails = new AlliedMilitaryDetails(
      AllyHelper.instance.findOption(AlliedMilitaryType.KlingonDefenceForce)!,
      'Klingon Exchange Officer',
    );

    const restored = marshaller.decodeCharacter(
      marshaller.decode(marshaller.encodeConstruct(character)),
    );
    expect(restored.type).toBe(CharacterType.AlliedMilitary);
    expect(restored.typeDetails).toBeInstanceOf(AlliedMilitaryDetails);
    const details = restored.typeDetails as AlliedMilitaryDetails;
    expect(details.type).toBe(AlliedMilitaryType.KlingonDefenceForce);
    expect(details.alliedMilitary.name).toBe('Klingon Defence Force');
  });

  test('round-trips ambassador type details', () => {
    const character = Character.createMainCharacter(
      CharacterType.AmbassadorDiplomat,
      Era.NextGeneration,
      2,
    );
    character.name = 'Federation Envoy';
    character.typeDetails = new GovernmentDetails(
      Governments.findOption(Polity.Federation)!,
      'Federation Envoy',
    );

    const restored = marshaller.decodeCharacter(
      marshaller.decode(marshaller.encodeConstruct(character)),
    );
    expect(restored.type).toBe(CharacterType.AmbassadorDiplomat);
    expect(restored.typeDetails).toBeInstanceOf(GovernmentDetails);
    const details = restored.typeDetails as GovernmentDetails;
    expect(details.type).toBe(Polity.Federation);
    expect(details.government.name).toBe('Federation');
  });

  test('round-trips other type details', () => {
    const character = Character.createMainCharacter(
      CharacterType.Other,
      Era.NextGeneration,
      2,
    );
    character.name = 'Freelance Trader';
    character.typeDetails = new OtherDetails('Freelance Trader');

    const restored = marshaller.decodeCharacter(
      marshaller.decode(marshaller.encodeConstruct(character)),
    );
    expect(restored.type).toBe(CharacterType.Other);
    expect(restored.typeDetails).toBeInstanceOf(OtherDetails);
    expect((restored.typeDetails as OtherDetails).name).toBe(
      'Freelance Trader',
    );
  });

  test('decodes unknown allied military and government type details', () => {
    const allied = marshaller.decodeCharacter({
      stereotype: 'mainCharacter',
      type: 'AlliedMilitary',
      era: 'NextGeneration',
      version: 2,
      name: 'Unknown Ally',
      typeDetails: {
        type: 'UnknownType',
        typeName: 'Unknown Force',
        name: 'Unknown Envoy',
      },
    });
    const alliedDetails = allied.typeDetails as AlliedMilitaryDetails;
    expect(alliedDetails.alliedMilitary.type).toBeUndefined();
    expect(alliedDetails.alliedMilitary.name).toBe('Unknown Force');

    const ambassador = marshaller.decodeCharacter({
      stereotype: 'mainCharacter',
      type: 'AmbassadorDiplomat',
      era: 'NextGeneration',
      version: 2,
      name: 'Unknown Ambassador',
      typeDetails: {
        type: 'UnknownPolity',
        typeName: 'Unknown Government',
        name: 'Unknown Ambassador',
      },
    });
    const governmentDetails = ambassador.typeDetails as GovernmentDetails;
    expect(governmentDetails.government.type).toBeUndefined();
    expect(governmentDetails.government.name).toBe('Unknown Government');
  });
});
