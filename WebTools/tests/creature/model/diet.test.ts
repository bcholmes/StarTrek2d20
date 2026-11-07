import { test, expect, describe, jest, afterEach } from '@jest/globals';
import {
  DietType,
  DietTypeHelper,
  DietTypeModel,
  createRandomDiet,
  createRandomEsotericDietType,
} from '../../../src/creature/model/diet';
import { D20 } from '../../../src/common/die';

const allDiets: [DietType, string, string][] = [
  [DietType.Herbivore, 'Herbivore', 'Herbivore'],
  [DietType.Carnivore, 'Carnivore', 'Carnivore'],
  [DietType.Omnivore, 'Omnivore', 'Omnivore'],
  [DietType.MineralsOrMetal, 'MineralsOrMetal', 'Minerals or Metal'],
  [DietType.Energy, 'Energy', 'Energy'],
  [DietType.PsychicEnergy, 'PsychicEnergy', 'Psychic Energy'],
];

const repeated = <T>(value: T, count: number): T[] =>
  Array.from({ length: count }, () => value);

const dietsByRoll: DietType[] = [
  ...repeated(DietType.Herbivore, 6),
  ...repeated(DietType.Carnivore, 6),
  ...repeated(DietType.Omnivore, 7),
];

const esotericDietsByRoll: DietType[] = [
  ...repeated(DietType.Energy, 7),
  ...repeated(DietType.MineralsOrMetal, 7),
  ...repeated(DietType.PsychicEnergy, 6),
];

const dietRollCases: [number, DietType][] = dietsByRoll.map((diet, index) => [
  index + 1,
  diet,
]);

const esotericDietRollCases: [number, DietType][] = esotericDietsByRoll.map(
  (diet, index) => [index + 1, diet],
);

describe('DietTypeModel', () => {
  test('exposes its id and localized name', () => {
    const model = new DietTypeModel(
      DietType.MineralsOrMetal,
      'Minerals or Metal',
    );

    expect(model.id).toBe(DietType.MineralsOrMetal);
    expect(model.localizedName).toBe('Minerals or Metal');
  });
});

describe('DietTypeHelper', () => {
  test('returns a cached singleton', () => {
    expect(DietTypeHelper.instance).toBe(DietTypeHelper.instance);
  });

  test('returns every diet type', () => {
    const diets = DietTypeHelper.instance.getTypes();

    expect(diets.map((model) => model.id)).toEqual(allDiets.map(([id]) => id));
    expect(diets.map((model) => model.localizedName)).toEqual(
      allDiets.map(([, , name]) => name),
    );
  });

  test.each(allDiets)('finds diet %s by id', (id, _enumName, name) => {
    const model = DietTypeHelper.instance.getTypeById(id);

    expect(model?.id).toBe(id);
    expect(model?.localizedName).toBe(name);
  });

  test('returns undefined for an unknown id', () => {
    expect(DietTypeHelper.instance.getTypeById(99 as DietType)).toBeUndefined();
  });

  test.each(allDiets)('finds diet %s by enum name', (id, enumName, name) => {
    const model = DietTypeHelper.instance.getTypeByIdName(enumName);

    expect(model?.id).toBe(id);
    expect(model?.localizedName).toBe(name);
  });

  test('returns undefined for an unknown enum name', () => {
    expect(DietTypeHelper.instance.getTypeByIdName('Dragon')).toBeUndefined();
  });
});

describe('createRandomDiet', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each(dietRollCases)('maps roll %i to %s', (roll, expectedDiet) => {
    const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

    expect(createRandomDiet()).toBe(expectedDiet);
    expect(d20).toHaveBeenCalledTimes(1);
  });

  test.each(esotericDietRollCases)(
    'maps an outer roll of 20 and an esoteric roll of %i to %s',
    (esotericRoll, expectedDiet) => {
      const d20 = jest
        .spyOn(D20, 'roll')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(esotericRoll);

      expect(createRandomDiet()).toBe(expectedDiet);
      expect(d20).toHaveBeenCalledTimes(2);
    },
  );

  test.each([0, 21])(
    'returns undefined for out-of-range outer roll %i',
    (roll) => {
      const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

      expect(createRandomDiet()).toBeUndefined();
      expect(d20).toHaveBeenCalledTimes(1);
    },
  );

  test.each([0, 21])(
    'returns undefined when the outer roll is 20 and the esoteric roll is %i',
    (esotericRoll) => {
      const d20 = jest
        .spyOn(D20, 'roll')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(esotericRoll);

      expect(createRandomDiet()).toBeUndefined();
      expect(d20).toHaveBeenCalledTimes(2);
    },
  );
});

describe('createRandomEsotericDietType', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each(esotericDietRollCases)(
    'maps roll %i to %s',
    (roll, expectedDiet) => {
      const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

      expect(createRandomEsotericDietType()).toBe(expectedDiet);
      expect(d20).toHaveBeenCalledTimes(1);
    },
  );

  test.each([0, 21])('returns undefined for out-of-range roll %i', (roll) => {
    const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

    expect(createRandomEsotericDietType()).toBeUndefined();
    expect(d20).toHaveBeenCalledTimes(1);
  });
});
