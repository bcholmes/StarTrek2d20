import { test, expect, describe, jest, afterEach } from '@jest/globals';
import {
  Habitat,
  HabitatHelper,
  HabitatModel,
  createRandomHabitat,
} from '../../../src/creature/model/habitat';
import { D20 } from '../../../src/common/die';

const allHabitats: [Habitat, string, string][] = [
  [Habitat.Caves, 'Caves', 'Caves'],
  [Habitat.Desert, 'Desert', 'Desert'],
  [Habitat.Forest, 'Forest', 'Forest'],
  [Habitat.Hills, 'Hills', 'Hills'],
  [Habitat.Jungle, 'Jungle', 'Jungle'],
  [Habitat.Mountains, 'Mountains', 'Mountains'],
  [Habitat.Ocean, 'Ocean', 'Ocean'],
  [Habitat.Plains, 'Plains', 'Plains'],
  [Habitat.River, 'River', 'River'],
  [Habitat.Space, 'Space', 'Space'],
  [Habitat.Swamp, 'Swamp', 'Swamp'],
  [Habitat.UpperAtmosphere, 'UpperAtmosphere', 'Upper Atmosphere'],
];

const habitatsByRoll: Habitat[] = [
  Habitat.Caves,
  Habitat.Caves,
  Habitat.Desert,
  Habitat.Desert,
  Habitat.Forest,
  Habitat.Forest,
  Habitat.Hills,
  Habitat.Hills,
  Habitat.Jungle,
  Habitat.Jungle,
  Habitat.Mountains,
  Habitat.Mountains,
  Habitat.Ocean,
  Habitat.Ocean,
  Habitat.Plains,
  Habitat.Plains,
  Habitat.Space,
  Habitat.Swamp,
  Habitat.Swamp,
  Habitat.UpperAtmosphere,
];

const habitatRollCases: [number, Habitat][] = habitatsByRoll.map(
  (habitat, index) => [index + 1, habitat],
);

describe('HabitatModel', () => {
  test('exposes its id and localized name', () => {
    const model = new HabitatModel(Habitat.UpperAtmosphere, 'Upper Atmosphere');

    expect(model.id).toBe(Habitat.UpperAtmosphere);
    expect(model.localizedName).toBe('Upper Atmosphere');
  });
});

describe('HabitatHelper', () => {
  test('returns a cached singleton', () => {
    expect(HabitatHelper.instance).toBe(HabitatHelper.instance);
  });

  test('returns every habitat', () => {
    const habitats = HabitatHelper.instance.getTypes();

    expect(habitats.map((model) => model.id)).toEqual(
      allHabitats.map(([id]) => id),
    );
    expect(habitats.map((model) => model.localizedName)).toEqual(
      allHabitats.map(([, , name]) => name),
    );
  });

  test.each(allHabitats)('finds habitat %s by id', (id, _enumName, name) => {
    const model = HabitatHelper.instance.getTypeById(id);

    expect(model?.id).toBe(id);
    expect(model?.localizedName).toBe(name);
  });

  test('returns undefined for an unknown id', () => {
    expect(HabitatHelper.instance.getTypeById(99 as Habitat)).toBeUndefined();
  });

  test.each(allHabitats)(
    'finds habitat %s by enum name',
    (id, enumName, name) => {
      const model = HabitatHelper.instance.getTypeByIdName(enumName);

      expect(model?.id).toBe(id);
      expect(model?.localizedName).toBe(name);
    },
  );

  test('returns undefined for an unknown enum name', () => {
    expect(HabitatHelper.instance.getTypeByIdName('Dragon')).toBeUndefined();
  });
});

describe('createRandomHabitat', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each(habitatRollCases)('maps roll %i to %s', (roll, expectedHabitat) => {
    const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

    expect(createRandomHabitat()).toBe(expectedHabitat);
    expect(d20).toHaveBeenCalledTimes(1);
  });

  test.each([0, 21])('returns undefined for out-of-range roll %i', (roll) => {
    const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

    expect(createRandomHabitat()).toBeUndefined();
    expect(d20).toHaveBeenCalledTimes(1);
  });
});
