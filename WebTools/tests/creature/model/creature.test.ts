import { test, expect, describe } from '@jest/globals';
import '../../../src/common/character';
import { CharacterType } from '../../../src/common/characterType';
import { Stereotype } from '../../../src/common/construct';
import { SelectedTalent } from '../../../src/common/selectedTalent';
import { Creature } from '../../../src/creature/model/creature';
import {
  CreatureSize,
  CreatureSizeHelper,
} from '../../../src/creature/model/creatureSize';
import {
  CreatureType,
  CreatureTypeHelper,
} from '../../../src/creature/model/creatureType';
import { DietType, DietTypeHelper } from '../../../src/creature/model/diet';
import { Habitat, HabitatHelper } from '../../../src/creature/model/habitat';
import {
  LocomotionModel,
  LocomotionType,
  LocomotionTypeHelper,
} from '../../../src/creature/model/locomotion';
import { NaturalAttacks } from '../../../src/creature/model/naturalAttacks';
import {
  TALENT_NAME_AMPHIBIOUS,
  TALENT_NAME_AQUATIC_LIQUID_ENVIRONMENT,
  TALENT_NAME_CORROSIVE_SPIT,
  TALENT_NAME_ENERGY_BASED,
  TALENT_NAME_FLIGHT,
  TALENT_NAME_IMMUNE_TO_COLD,
  TALENT_NAME_IMMUNE_TO_VACUUM,
  TALENT_NAME_INCORPOREAL,
  TALENT_NAME_MASSIVE,
  TALENT_NAME_SPIKED_TAIL,
  TALENT_NAME_WHIP_LIKE_TAIL,
} from '../../../src/helpers/talents';

const habitatOf = (habitat: Habitat) =>
  HabitatHelper.instance.getTypeById(habitat);

const typeOf = (creatureType: CreatureType) =>
  CreatureTypeHelper.instance.getTypeById(creatureType);

const sizeOf = (size: CreatureSize) =>
  CreatureSizeHelper.instance.getTypeById(size);

const dietOf = (diet: DietType) => DietTypeHelper.instance.getTypeById(diet);

const locomotionOf = (type: LocomotionType, count?: number) =>
  new LocomotionModel(LocomotionTypeHelper.instance.getTypeById(type)!, count);

const talentNames = (creature: Creature) =>
  creature.talents.map((talent) => talent.talent);

describe('Creature', () => {
  test('initializes creature defaults', () => {
    const creature = new Creature();

    expect(creature.stereotype).toBe(Stereotype.Creature);
    expect(creature.type).toBe(CharacterType.Creature);
    expect(creature.attributes).toEqual([1, 1, 1, 1, 1, 0]);
    expect(creature.departments).toEqual([0, 0, 0, 0, 0, 0]);
    expect(creature.locomotion).toEqual([]);
    expect(creature.additionalTalents).toEqual([]);
    expect(creature.additionalTraits).toEqual([]);
  });

  test('grants no derived talents when type, size, and habitat are unset', () => {
    expect(talentNames(new Creature())).toEqual([]);
  });

  test.each([
    [CreatureType.Fish, TALENT_NAME_AQUATIC_LIQUID_ENVIRONMENT],
    [CreatureType.Amphibian, TALENT_NAME_AMPHIBIOUS],
    [CreatureType.Energy, TALENT_NAME_ENERGY_BASED],
  ])('grants %s the %s talent', (creatureType, expectedTalent) => {
    const creature = new Creature();
    creature.creatureType = typeOf(creatureType);

    expect(talentNames(creature)).toEqual([expectedTalent]);
  });

  test.each([
    CreatureType.Bird,
    CreatureType.Invertebrate,
    CreatureType.Mammal,
    CreatureType.Plant,
    CreatureType.Reptile,
  ])('grants no creature-type talent for %s', (creatureType) => {
    const creature = new Creature();
    creature.creatureType = typeOf(creatureType);

    expect(talentNames(creature)).toEqual([]);
  });

  test.each([
    [CreatureSize.Swarm, TALENT_NAME_INCORPOREAL],
    [CreatureSize.Gigantic, TALENT_NAME_MASSIVE],
  ])('grants %s the %s talent', (size, expectedTalent) => {
    const creature = new Creature();
    creature.size = sizeOf(size);

    expect(talentNames(creature)).toEqual([expectedTalent]);
  });

  test.each([
    CreatureSize.Small,
    CreatureSize.Average,
    CreatureSize.Large,
    CreatureSize.Huge,
  ])('grants no size talent for %s', (size) => {
    const creature = new Creature();
    creature.size = sizeOf(size);

    expect(talentNames(creature)).toEqual([]);
  });

  test('grants space habitat talents', () => {
    const creature = new Creature();
    creature.habitat = habitatOf(Habitat.Space);

    expect(talentNames(creature)).toEqual([
      TALENT_NAME_IMMUNE_TO_COLD,
      TALENT_NAME_IMMUNE_TO_VACUUM,
      TALENT_NAME_FLIGHT,
    ]);
  });

  test('grants upper atmosphere habitat talents', () => {
    const creature = new Creature();
    creature.habitat = habitatOf(Habitat.UpperAtmosphere);

    expect(talentNames(creature)).toEqual([
      TALENT_NAME_IMMUNE_TO_COLD,
      TALENT_NAME_FLIGHT,
    ]);
  });

  test('grants no habitat talent for other habitats', () => {
    const creature = new Creature();
    creature.habitat = habitatOf(Habitat.Forest);

    expect(talentNames(creature)).toEqual([]);
  });

  test('appends additional talents after derived talents', () => {
    const creature = new Creature();
    creature.creatureType = typeOf(CreatureType.Fish);
    creature.size = sizeOf(CreatureSize.Swarm);
    creature.habitat = habitatOf(Habitat.Space);
    creature.additionalTalents = [new SelectedTalent(TALENT_NAME_SPIKED_TAIL)];

    expect(talentNames(creature)).toEqual([
      TALENT_NAME_AQUATIC_LIQUID_ENVIRONMENT,
      TALENT_NAME_INCORPOREAL,
      TALENT_NAME_IMMUNE_TO_COLD,
      TALENT_NAME_IMMUNE_TO_VACUUM,
      TALENT_NAME_FLIGHT,
      TALENT_NAME_SPIKED_TAIL,
    ]);
  });

  test('lists talent names and reports whether a talent is present', () => {
    const creature = new Creature();
    creature.additionalTalents = [new SelectedTalent(TALENT_NAME_SPIKED_TAIL)];

    expect(creature.getDistinctTalentNameList()).toEqual([
      TALENT_NAME_SPIKED_TAIL,
    ]);
    expect(creature.hasTalent(TALENT_NAME_SPIKED_TAIL)).toBe(true);
    expect(creature.hasTalent(TALENT_NAME_FLIGHT)).toBe(false);
  });

  test('always reports talent rank 1', () => {
    expect(new Creature().getRankForTalent()).toBe(1);
  });

  test('is a flightless bird when it is a bird without flight', () => {
    const creature = new Creature();
    creature.creatureType = typeOf(CreatureType.Bird);

    expect(creature.isFlightlessBird).toBe(true);
  });

  test('is not a flightless bird when it has flight', () => {
    const creature = new Creature();
    creature.creatureType = typeOf(CreatureType.Bird);
    creature.additionalTalents = [new SelectedTalent(TALENT_NAME_FLIGHT)];

    expect(creature.isFlightlessBird).toBe(false);
  });

  test('is not a flightless bird without a creature type', () => {
    expect(new Creature().isFlightlessBird).toBe(false);
  });

  test('is not a flightless bird when it is not a bird', () => {
    const creature = new Creature();
    creature.creatureType = typeOf(CreatureType.Mammal);

    expect(creature.isFlightlessBird).toBe(false);
  });

  test('reports slithering locomotion', () => {
    const creature = new Creature();
    creature.locomotion = [locomotionOf(LocomotionType.Slithering)];

    expect(creature.isSlithering).toBe(true);
    expect(creature.isTentacled).toBe(false);
  });

  test('reports tentacled locomotion', () => {
    const creature = new Creature();
    creature.locomotion = [locomotionOf(LocomotionType.Tentacles)];

    expect(creature.isTentacled).toBe(true);
    expect(creature.isSlithering).toBe(false);
  });

  test('reports flippered locomotion', () => {
    const creature = new Creature();
    creature.locomotion = [locomotionOf(LocomotionType.Flippers)];

    expect(creature.isFlippered).toBe(true);
    expect(creature.isLegged).toBe(false);
  });

  test('reports legged locomotion', () => {
    const creature = new Creature();
    creature.locomotion = [locomotionOf(LocomotionType.Legs, 2)];

    expect(creature.isLegged).toBe(true);
    expect(creature.isFourOrMoreLegged).toBe(false);
  });

  test('reports four or more legs', () => {
    const creature = new Creature();
    creature.locomotion = [locomotionOf(LocomotionType.Legs, 4)];

    expect(creature.isLegged).toBe(true);
    expect(creature.isFourOrMoreLegged).toBe(true);
  });

  test('does not count four wings as four or more legs', () => {
    const creature = new Creature();
    creature.locomotion = [locomotionOf(LocomotionType.Wings, 4)];

    expect(creature.isFourOrMoreLegged).toBe(false);
  });

  test('has no natural weapons by default', () => {
    expect(new Creature().determineWeapons()).toEqual([]);
  });

  test('builds a weapon for its natural attack', () => {
    const creature = new Creature();
    creature.naturalAttacks = NaturalAttacks.Teeth;

    const weapons = creature.determineWeapons();

    expect(weapons.map((weapon) => weapon.nameValue)).toEqual(['Bite']);
  });

  test.each([
    [TALENT_NAME_SPIKED_TAIL, 'Spiked Tail'],
    [TALENT_NAME_WHIP_LIKE_TAIL, 'Whip-like Tail'],
    [TALENT_NAME_CORROSIVE_SPIT, 'Corrosive Spit'],
  ])('builds a weapon for the %s talent', (talentName, weaponName) => {
    const creature = new Creature();
    creature.additionalTalents = [new SelectedTalent(talentName)];

    expect(
      creature.determineWeapons().map((weapon) => weapon.nameValue),
    ).toEqual([weaponName]);
  });

  test('combines natural and talent weapons', () => {
    const creature = new Creature();
    creature.naturalAttacks = NaturalAttacks.Teeth;
    creature.additionalTalents = [
      new SelectedTalent(TALENT_NAME_SPIKED_TAIL),
      new SelectedTalent(TALENT_NAME_WHIP_LIKE_TAIL),
      new SelectedTalent(TALENT_NAME_CORROSIVE_SPIT),
    ];

    expect(
      creature.determineWeapons().map((weapon) => weapon.nameValue),
    ).toEqual(['Bite', 'Spiked Tail', 'Whip-like Tail', 'Corrosive Spit']);
  });

  test('is fauna by default', () => {
    expect(new Creature().getAllTraits()).toBe('Fauna');
  });

  test('is flora when it is a plant', () => {
    const creature = new Creature();
    creature.creatureType = typeOf(CreatureType.Plant);

    expect(creature.getAllTraits()).toBe('Flora');
  });

  test('includes additional traits before its derived trait', () => {
    const creature = new Creature();
    creature.additionalTraits = ['Warm-blooded', 'Nocturnal'];

    expect(creature.getAllTraits()).toBe('Warm-blooded, Nocturnal, Fauna');
  });

  test('marks a flightless bird', () => {
    const creature = new Creature();
    creature.creatureType = typeOf(CreatureType.Bird);

    expect(creature.getAllTraits()).toBe('Fauna, Flightless');
  });

  test('does not mark a bird with flight as flightless', () => {
    const creature = new Creature();
    creature.creatureType = typeOf(CreatureType.Bird);
    creature.additionalTalents = [new SelectedTalent(TALENT_NAME_FLIGHT)];

    expect(creature.getAllTraits()).toBe('Fauna');
  });

  test('keeps its diet, form, and description', () => {
    const creature = new Creature();
    creature.diet = dietOf(DietType.Omnivore);
    creature.form = 'Humanoid';
    creature.description = 'A test creature';

    expect(creature.diet.id).toBe(DietType.Omnivore);
    expect(creature.form).toBe('Humanoid');
    expect(creature.description).toBe('A test creature');
  });
});
