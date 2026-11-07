import { test, expect, describe, jest, afterEach } from '@jest/globals';
import {
  CreatureSize,
  CreatureSizeHelper,
  CreatureSizeModel,
  generateRandomCreatureSize,
} from '../../../src/creature/model/creatureSize';
import { D20 } from '../../../src/common/die';

const allSizes: [CreatureSize, string][] = [
  [CreatureSize.Swarm, 'Swarm'],
  [CreatureSize.Small, 'Small'],
  [CreatureSize.Average, 'Average'],
  [CreatureSize.Large, 'Large'],
  [CreatureSize.Huge, 'Huge'],
  [CreatureSize.Gigantic, 'Gigantic'],
];

describe('CreatureSizeModel', () => {
  test('exposes its id and localized name', () => {
    const model = new CreatureSizeModel(CreatureSize.Huge, 'Huge');

    expect(model.id).toBe(CreatureSize.Huge);
    expect(model.localizedName).toBe('Huge');
  });
});

describe('CreatureSizeHelper', () => {
  test('returns a cached singleton', () => {
    expect(CreatureSizeHelper.instance).toBe(CreatureSizeHelper.instance);
  });

  test('returns every creature size', () => {
    const sizes = CreatureSizeHelper.instance.getTypes();

    expect(sizes.map((model) => model.id)).toEqual(allSizes.map(([id]) => id));
    expect(sizes.map((model) => model.localizedName)).toEqual(
      allSizes.map(([, name]) => name),
    );
  });

  test.each(allSizes)('finds size %s by id', (id, name) => {
    const model = CreatureSizeHelper.instance.getTypeById(id);

    expect(model?.id).toBe(id);
    expect(model?.localizedName).toBe(name);
  });

  test('returns undefined for an unknown id', () => {
    expect(
      CreatureSizeHelper.instance.getTypeById(99 as CreatureSize),
    ).toBeUndefined();
  });

  test.each(allSizes)('finds size %s by enum name', (id, name) => {
    const model = CreatureSizeHelper.instance.getTypeByIdName(name);

    expect(model?.id).toBe(id);
    expect(model?.localizedName).toBe(name);
  });

  test('returns undefined for an unknown enum name', () => {
    expect(
      CreatureSizeHelper.instance.getTypeByIdName('Dragon'),
    ).toBeUndefined();
  });

  test.each(['Microscopic', 'Tiny', 'Cosmozoan'])(
    'returns undefined for deprecated size %s',
    (name) => {
      expect(CreatureSizeHelper.instance.getTypeByIdName(name)).toBeUndefined();
    },
  );
});

const sizesByRoll: CreatureSize[] = [
  CreatureSize.Swarm,
  CreatureSize.Swarm,
  CreatureSize.Swarm,
  CreatureSize.Small,
  CreatureSize.Small,
  CreatureSize.Small,
  CreatureSize.Average,
  CreatureSize.Average,
  CreatureSize.Average,
  CreatureSize.Average,
  CreatureSize.Large,
  CreatureSize.Large,
  CreatureSize.Large,
  CreatureSize.Large,
  CreatureSize.Huge,
  CreatureSize.Huge,
  CreatureSize.Huge,
  CreatureSize.Gigantic,
  CreatureSize.Gigantic,
  CreatureSize.Gigantic,
];

const sizeRollCases: [number, CreatureSize][] = sizesByRoll.map(
  (size, index) => [index + 1, size],
);

describe('generateRandomCreatureSize', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each(sizeRollCases)('maps roll %i to %s', (roll, expectedSize) => {
    const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

    expect(generateRandomCreatureSize()).toBe(expectedSize);
    expect(d20).toHaveBeenCalledTimes(1);
  });

  test.each([0, 21])('returns undefined for out-of-range roll %i', (roll) => {
    const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

    expect(generateRandomCreatureSize()).toBeUndefined();
    expect(d20).toHaveBeenCalledTimes(1);
  });
});
