import { test, expect, describe, jest, afterEach } from '@jest/globals';
import {
  CreatureType,
  CreatureTypeHelper,
  CreatureTypeModel,
  createRandomCreatureType,
  habitatsByCreatureType,
} from '../../../src/creature/model/creatureType';
import { Habitat, HabitatHelper } from '../../../src/creature/model/habitat';
import { D20 } from '../../../src/common/die';

const allTypes: [CreatureType, string][] = [
  [CreatureType.Amphibian, 'Amphibian'],
  [CreatureType.Bird, 'Bird'],
  [CreatureType.Fish, 'Fish'],
  [CreatureType.Invertebrate, 'Invertebrate'],
  [CreatureType.Mammal, 'Mammal'],
  [CreatureType.Plant, 'Plant'],
  [CreatureType.Reptile, 'Reptile'],
  [CreatureType.Energy, 'Energy'],
];

describe('CreatureTypeModel', () => {
  test('exposes its id and localized name', () => {
    const model = new CreatureTypeModel(CreatureType.Bird, 'Bird');

    expect(model.id).toBe(CreatureType.Bird);
    expect(model.localizedName).toBe('Bird');
  });
});

describe('CreatureTypeHelper', () => {
  test('returns a cached singleton', () => {
    expect(CreatureTypeHelper.instance).toBe(CreatureTypeHelper.instance);
  });

  test('returns every creature type', () => {
    const types = CreatureTypeHelper.instance.getTypes();

    expect(types.map((model) => model.id)).toEqual(allTypes.map(([id]) => id));
    expect(types.map((model) => model.localizedName)).toEqual(
      allTypes.map(([, name]) => name),
    );
  });

  test.each(allTypes)('finds type %s by id', (id, name) => {
    const model = CreatureTypeHelper.instance.getTypeById(id);

    expect(model?.id).toBe(id);
    expect(model?.localizedName).toBe(name);
  });

  test('returns undefined for an unknown id', () => {
    expect(
      CreatureTypeHelper.instance.getTypeById(99 as CreatureType),
    ).toBeUndefined();
  });

  test.each(allTypes)('finds type %s by enum name', (id, name) => {
    const model = CreatureTypeHelper.instance.getTypeByIdName(name);

    expect(model?.id).toBe(id);
    expect(model?.localizedName).toBe(name);
  });

  test('returns undefined for an unknown enum name', () => {
    expect(
      CreatureTypeHelper.instance.getTypeByIdName('Dragon'),
    ).toBeUndefined();
  });
});

const habitatsByType: [CreatureType, Habitat[]][] = [
  [
    CreatureType.Invertebrate,
    [
      Habitat.Caves,
      Habitat.Desert,
      Habitat.Forest,
      Habitat.Hills,
      Habitat.Jungle,
      Habitat.Mountains,
      Habitat.Ocean,
      Habitat.Plains,
      Habitat.River,
      Habitat.Space,
      Habitat.Swamp,
      Habitat.UpperAtmosphere,
    ],
  ],
  [
    CreatureType.Reptile,
    [
      Habitat.Caves,
      Habitat.Desert,
      Habitat.Forest,
      Habitat.Hills,
      Habitat.Jungle,
      Habitat.Mountains,
      Habitat.Plains,
      Habitat.River,
      Habitat.Space,
      Habitat.Swamp,
      Habitat.UpperAtmosphere,
    ],
  ],
  [
    CreatureType.Amphibian,
    [
      Habitat.Caves,
      Habitat.Desert,
      Habitat.Forest,
      Habitat.Hills,
      Habitat.Jungle,
      Habitat.Mountains,
      Habitat.Plains,
      Habitat.River,
      Habitat.Swamp,
    ],
  ],
  [
    CreatureType.Bird,
    [
      Habitat.Caves,
      Habitat.Desert,
      Habitat.Forest,
      Habitat.Hills,
      Habitat.Jungle,
      Habitat.Mountains,
      Habitat.Ocean,
      Habitat.Plains,
      Habitat.River,
      Habitat.Swamp,
      Habitat.UpperAtmosphere,
    ],
  ],
  [
    CreatureType.Energy,
    [Habitat.Caves, Habitat.Desert, Habitat.Ocean, Habitat.UpperAtmosphere],
  ],
  [CreatureType.Fish, [Habitat.Ocean, Habitat.River, Habitat.Swamp]],
  [
    CreatureType.Mammal,
    [
      Habitat.Caves,
      Habitat.Desert,
      Habitat.Forest,
      Habitat.Hills,
      Habitat.Jungle,
      Habitat.Mountains,
      Habitat.Ocean,
      Habitat.Plains,
      Habitat.River,
      Habitat.Space,
      Habitat.Swamp,
      Habitat.UpperAtmosphere,
    ],
  ],
  [
    CreatureType.Plant,
    [
      Habitat.Caves,
      Habitat.Desert,
      Habitat.Forest,
      Habitat.Hills,
      Habitat.Jungle,
      Habitat.Mountains,
      Habitat.Ocean,
      Habitat.Plains,
      Habitat.River,
      Habitat.Swamp,
    ],
  ],
];

describe('habitatsByCreatureType', () => {
  test.each(habitatsByType)(
    'returns the habitats for creature type %s',
    (creatureType, expectedHabitats) => {
      expect(habitatsByCreatureType(creatureType)).toEqual(expectedHabitats);
    },
  );

  test('returns every habitat for an unknown creature type', () => {
    const allHabitatIds = HabitatHelper.instance
      .getTypes()
      .map((habitat) => habitat.id);

    expect(habitatsByCreatureType(99 as CreatureType)).toEqual(allHabitatIds);
  });
});

const cavesAndDesert: CreatureType[] = [
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Plant,
  CreatureType.Plant,
  CreatureType.Energy,
];

const mountainsHillsPlains: CreatureType[] = [
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Plant,
  CreatureType.Plant,
  CreatureType.Plant,
  CreatureType.Plant,
];

const swampAndRiver: CreatureType[] = [
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Amphibian,
  CreatureType.Amphibian,
  CreatureType.Amphibian,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Plant,
  CreatureType.Plant,
  CreatureType.Fish,
  CreatureType.Fish,
  CreatureType.Fish,
];

const forestAndJungle: CreatureType[] = [
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Amphibian,
  CreatureType.Amphibian,
  CreatureType.Amphibian,
  CreatureType.Amphibian,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Plant,
  CreatureType.Plant,
  CreatureType.Plant,
];

const ocean: CreatureType[] = [
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Plant,
  CreatureType.Plant,
  CreatureType.Plant,
  CreatureType.Plant,
  CreatureType.Fish,
  CreatureType.Fish,
  CreatureType.Fish,
  CreatureType.Fish,
  CreatureType.Fish,
  CreatureType.Energy,
];

const upperAtmosphere: CreatureType[] = [
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Bird,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Energy,
];

const space: CreatureType[] = [
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Invertebrate,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Mammal,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Reptile,
  CreatureType.Energy,
  CreatureType.Energy,
  CreatureType.Energy,
  CreatureType.Energy,
];

const typesByHabitat: [Habitat, CreatureType[]][] = [
  [Habitat.Caves, cavesAndDesert],
  [Habitat.Desert, cavesAndDesert],
  [Habitat.Hills, mountainsHillsPlains],
  [Habitat.Mountains, mountainsHillsPlains],
  [Habitat.Plains, mountainsHillsPlains],
  [Habitat.River, swampAndRiver],
  [Habitat.Swamp, swampAndRiver],
  [Habitat.Forest, forestAndJungle],
  [Habitat.Jungle, forestAndJungle],
  [Habitat.Ocean, ocean],
  [Habitat.UpperAtmosphere, upperAtmosphere],
  [Habitat.Space, space],
];

describe('createRandomCreatureType', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each(typesByHabitat)(
    'maps every roll for habitat %s',
    (habitat, expectedTypesByRoll) => {
      const roll = jest.spyOn(D20, 'roll');

      expectedTypesByRoll.forEach((expectedType, index) => {
        roll.mockReturnValueOnce(index + 1);

        expect(createRandomCreatureType(habitat)).toBe(expectedType);
      });

      expect(roll).toHaveBeenCalledTimes(20);
    },
  );

  test.each(typesByHabitat)(
    'returns undefined for out-of-range rolls in habitat %s',
    (habitat) => {
      const roll = jest.spyOn(D20, 'roll').mockReturnValue(0);

      expect(createRandomCreatureType(habitat)).toBeUndefined();
      expect(roll).toHaveBeenCalledTimes(1);

      roll.mockReturnValue(21);

      expect(createRandomCreatureType(habitat)).toBeUndefined();
      expect(roll).toHaveBeenCalledTimes(2);
    },
  );

  test('returns null for an unknown habitat without rolling', () => {
    const roll = jest.spyOn(D20, 'roll');

    expect(createRandomCreatureType(99 as Habitat)).toBeNull();
    expect(roll).not.toHaveBeenCalled();
  });
});
