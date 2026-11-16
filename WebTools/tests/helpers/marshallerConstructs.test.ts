import { describe, expect, jest, test } from '@jest/globals';
import '../../src/helpers/species';
import { Asset, AssetAbility, AssetStat } from '../../src/asset/asset';
import { AssetType } from '../../src/asset/assetType';
import { TokenConfig, ImageConfig } from '../../src/common/character';
import { CharacterType } from '../../src/common/characterType';
import {
  CustomStationSpaceframeStep,
  StandardStationSpaceframeStep,
  Station,
} from '../../src/common/station';
import { Creature } from '../../src/creature/model/creature';
import {
  CreatureSize,
  CreatureSizeHelper,
} from '../../src/creature/model/creatureSize';
import {
  CreatureType,
  CreatureTypeHelper,
} from '../../src/creature/model/creatureType';
import { DietType, DietTypeHelper } from '../../src/creature/model/diet';
import { Habitat, HabitatHelper } from '../../src/creature/model/habitat';
import {
  LocomotionModel,
  LocomotionType,
  LocomotionTypeHelper,
} from '../../src/creature/model/locomotion';
import { NaturalAttacks } from '../../src/creature/model/naturalAttacks';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { Era } from '../../src/helpers/erasEnum';
import { marshaller } from '../../src/helpers/marshaller';
import { MissionProfile } from '../../src/helpers/missionProfiles';
import { Rank } from '../../src/helpers/ranks';
import { Spaceframe } from '../../src/helpers/spaceframeEnum';
import { Species } from '../../src/helpers/speciesEnum';
import {
  StationFrame,
  StationFrameAppearance,
} from '../../src/helpers/stationFrame';
import { StarshipWeaponRegistry } from '../../src/helpers/weapons';
import { ExtraType } from '../../src/token/model/extrasTypeEnum';
import { FacialHairType } from '../../src/token/model/facialHairEnum';
import { TokenModel } from '../../src/token/model/tokenModel';
import { makePopulatedStation } from '../vtt/vttFixtures';

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

const stats = [
  new AssetStat(),
  new AssetStat(1, 2),
  new AssetStat(3, 4),
  new AssetStat(5, 6),
  new AssetStat(7, 8),
];

describe('marshaller construct coverage', () => {
  test('round-trips a standard station with a mission profile, weapons, and talents', () => {
    const station = makePopulatedStation();
    station.missionProfileStep!.talent = new SelectedTalent('Bold');
    station.weapons = [
      StarshipWeaponRegistry.getWeaponByName('Phaser Banks', 2),
    ];

    const json = marshaller.decode(marshaller.encodeConstruct(station));
    const restored = marshaller.decodeStation(json);

    expect(json.stereotype).toBe('station');
    expect(restored.name).toBe(station.name);
    expect(restored.type).toBe(CharacterType.Starfleet);
    expect(restored.era).toBe(Era.NextGeneration);
    expect(restored.version).toBe(2);
    expect(restored.stationFrameStep).toBeInstanceOf(
      StandardStationSpaceframeStep,
    );
    expect(
      (restored.stationFrameStep as StandardStationSpaceframeStep).type,
    ).toBe(StationFrame.FederationStarbase);
    expect(restored.missionProfileStep?.type).toBe(
      MissionProfile.ResearchStation,
    );
    expect(restored.missionProfileStep?.talent?.name).toBe('Bold');
    expect(restored.traits).toEqual(station.traits);
    expect(restored.weapons.map((w) => w.name)).toEqual(['Phaser Banks']);
    expect(restored.additionalTalents.map((t) => t.name)).toEqual([
      'Secondary Reactors',
    ]);
  });

  test('round-trips a custom station frame and appearance', () => {
    const station = Station.create(
      CharacterType.Starfleet,
      2,
      Era.NextGeneration,
    );
    station.name = 'Custom Outpost';
    station.stationFrameStep = CustomStationSpaceframeStep.create(5);
    station.stationFrameStep.appearance = StationFrameAppearance.Spacedock;

    const restored = marshaller.decodeStation(
      marshaller.decode(marshaller.encodeConstruct(station)),
    );
    const frame = restored.stationFrameStep as CustomStationSpaceframeStep;

    expect(frame).toBeInstanceOf(CustomStationSpaceframeStep);
    expect(frame.scale).toBe(5);
    expect(frame.appearance).toBe(StationFrameAppearance.Spacedock);
    expect(frame.systems).toEqual(station.stationFrameStep.systems);
    expect(frame.departments).toEqual(station.stationFrameStep.departments);
  });

  test('round-trips a populated creature', () => {
    const creature = new Creature();
    creature.name = 'Forest Targ';
    creature.description = 'A sturdy predator.';
    creature.era = Era.NextGeneration;
    creature.version = 2;
    creature.habitat = HabitatHelper.instance.getTypeById(Habitat.Forest);
    creature.creatureType = CreatureTypeHelper.instance.getTypeById(
      CreatureType.Mammal,
    );
    creature.diet = DietTypeHelper.instance.getTypeById(DietType.Carnivore);
    creature.size = CreatureSizeHelper.instance.getTypeById(CreatureSize.Large);
    creature.naturalAttacks = NaturalAttacks.TeethAndClaws;
    creature.locomotion = [
      new LocomotionModel(
        LocomotionTypeHelper.instance.getTypeById(LocomotionType.Legs),
        4,
      ),
    ];
    creature.additionalTalents = [new SelectedTalent('Bold')];
    creature.additionalTraits = ['Furry', 'Nocturnal'];
    creature.form = 'Quadruped';
    creature.attributes = [8, 9, 7, 6, 5, 3];
    creature.departments = [1, 2, 3, 4, 5, 6];

    const json = marshaller.decode(marshaller.encodeConstruct(creature));
    const restored = marshaller.decodeCreature(json);

    expect(json.stereotype).toBe('creature');
    expect(restored.name).toBe('Forest Targ');
    expect(restored.description).toBe('A sturdy predator.');
    expect(restored.era).toBe(Era.NextGeneration);
    expect(restored.version).toBe(2);
    expect(restored.habitat?.id).toBe(Habitat.Forest);
    expect(restored.creatureType?.id).toBe(CreatureType.Mammal);
    expect(restored.diet?.id).toBe(DietType.Carnivore);
    expect(restored.size?.id).toBe(CreatureSize.Large);
    expect(restored.naturalAttacks).toBe(NaturalAttacks.TeethAndClaws);
    expect(restored.locomotion[0].type?.id).toBe(LocomotionType.Legs);
    expect(restored.locomotion[0].count).toBe(4);
    expect(restored.additionalTalents.map((t) => t.name)).toEqual(['Bold']);
    expect(restored.additionalTraits).toEqual(['Furry', 'Nocturnal']);
    expect(restored.form).toBe('Quadruped');
    expect(restored.attributes).toEqual(creature.attributes);
    expect(restored.departments).toEqual(creature.departments);
  });

  test('round-trips ship, character, and resource assets', () => {
    const assets = [
      new Asset(
        AssetType.Ship,
        'USS Venture',
        stats,
        Spaceframe.Galaxy_2E,
        new AssetAbility('Flagship', 'Assists other ships.'),
      ),
      new Asset(
        AssetType.Character,
        'Captain Rhea Voss',
        stats,
        Rank.Captain,
        new AssetAbility('Decisive', 'Acts first.'),
      ),
      new Asset(
        AssetType.Resource,
        'Supply Depot',
        stats,
        undefined,
        new AssetAbility('Resupply', 'Restores supplies.'),
      ),
    ];

    assets.forEach((asset) => {
      const restored = marshaller.decodeAsset(marshaller.encodeAsset(asset));
      expect(restored.type).toBe(asset.type);
      expect(restored.name).toBe(asset.name);
      expect(restored.stats.map((s) => s.asString)).toEqual(
        asset.stats.map((s) => s.asString),
      );
      expect(restored.additionalInformation).toBe(asset.additionalInformation);
      expect(restored.specialAbility?.title).toBe(asset.specialAbility?.title);
      expect(restored.specialAbility?.description).toBe(
        asset.specialAbility?.description,
      );
    });
  });

  test('round-trips a customized token with cosmetic options', () => {
    const model = TokenModel.createDefault();
    model.primarySpecies = Species.Human;
    model.secondarySpecies = Species.Vulcan;
    model.rankIndicator = Rank.Commander;
    model.facialHairType = [FacialHairType.BushyGoatee];
    model.extras = [ExtraType.Visor];

    const json = marshaller.encodeToken(
      new TokenConfig(model, true, true),
    ) as any;
    const restored = marshaller.decodeToken(json) as TokenConfig;

    expect(json.token.secondarySpecies).toBeDefined();
    expect(restored).toBeInstanceOf(TokenConfig);
    expect(restored.token.primarySpecies).toBe(model.primarySpecies);
    expect(restored.token.uniformEra).toBe(model.uniformEra);
    expect(restored.token.variant).toBe(model.variant);
    expect(restored.token.divisionColor).toBe(model.divisionColor);
    expect(restored.token.rankIndicator).toBe(Rank.Commander);
    expect(restored.token.facialHairType).toEqual([FacialHairType.BushyGoatee]);
    expect(restored.token.extras).toEqual([ExtraType.Visor]);
    expect(restored.rounded).toBe(true);
    expect(restored.bordered).toBe(true);
  });

  test('round-trips an image-backed token', () => {
    const restored = marshaller.decodeToken(
      marshaller.encodeToken(new ImageConfig('image/png', 'abc123')),
    ) as ImageConfig;

    expect(restored).toBeInstanceOf(ImageConfig);
    expect(restored.type).toBe('image/png');
    expect(restored.contents).toBe('abc123');
  });
});
