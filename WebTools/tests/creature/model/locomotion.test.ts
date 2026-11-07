import { test, expect, describe, jest, afterEach } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { CreatureType } from '../../../src/creature/model/creatureType';
import { Habitat } from '../../../src/creature/model/habitat';
import {
  LocomotionModel,
  LocomotionType,
  LocomotionTypeHelper,
  LocomotionTypeModel,
  generateRandomLocomotionType,
} from '../../../src/creature/model/locomotion';

const allTypes: [LocomotionType, string][] = [
  [LocomotionType.Legs, 'Legs'],
  [LocomotionType.Slithering, 'Slithering'],
  [LocomotionType.Wings, 'Wings'],
  [LocomotionType.Tentacles, 'Tentacles'],
  [LocomotionType.Fins, 'Fins'],
  [LocomotionType.Flippers, 'Flippers'],
  [LocomotionType.Roots, 'Roots'],
];

const typeModel = (type: LocomotionType) =>
  LocomotionTypeHelper.instance.getTypeById(type)!;

const summarize = (locomotion: LocomotionModel[] | undefined) =>
  locomotion?.map((item) => ({ type: item.type.id, count: item.count }));

describe('LocomotionTypeModel', () => {
  test('exposes its id and localized name', () => {
    const model = new LocomotionTypeModel(
      LocomotionType.Tentacles,
      'Tentacles',
    );

    expect(model.id).toBe(LocomotionType.Tentacles);
    expect(model.localizedName).toBe('Tentacles');
  });
});

describe('LocomotionModel', () => {
  test('describes a type without a count', () => {
    const model = new LocomotionModel(typeModel(LocomotionType.Slithering));

    expect(model.description).toBe('Slithering');
  });

  test('describes a type with a count', () => {
    const model = new LocomotionModel(typeModel(LocomotionType.Legs), 4);

    expect(model.description).toBe('4 Legs');
  });
});

describe('LocomotionTypeHelper', () => {
  test('returns a cached singleton', () => {
    expect(LocomotionTypeHelper.instance).toBe(LocomotionTypeHelper.instance);
  });

  test('returns every locomotion type', () => {
    const types = LocomotionTypeHelper.instance.getTypes();

    expect(types.map((model) => model.id)).toEqual(allTypes.map(([id]) => id));
    expect(types.map((model) => model.localizedName)).toEqual(
      allTypes.map(([, name]) => name),
    );
  });

  test.each(allTypes)('finds type %s by id', (id, name) => {
    const model = LocomotionTypeHelper.instance.getTypeById(id);

    expect(model?.id).toBe(id);
    expect(model?.localizedName).toBe(name);
  });

  test('returns undefined for an unknown id', () => {
    expect(
      LocomotionTypeHelper.instance.getTypeById(99 as LocomotionType),
    ).toBeUndefined();
  });

  test.each(allTypes)('finds type %s by enum name', (id, name) => {
    const model = LocomotionTypeHelper.instance.getTypeByIdName(name);

    expect(model?.id).toBe(id);
    expect(model?.localizedName).toBe(name);
  });

  test('returns undefined for an unknown enum name', () => {
    expect(
      LocomotionTypeHelper.instance.getTypeByIdName('Dragon'),
    ).toBeUndefined();
  });
});

describe('generateRandomLocomotionType', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const singleTypeCases: [CreatureType, number, LocomotionType, number?][] = [
    [CreatureType.Invertebrate, 1, LocomotionType.Slithering, undefined],
    [CreatureType.Invertebrate, 4, LocomotionType.Slithering, undefined],
    [CreatureType.Invertebrate, 8, LocomotionType.Legs, 4],
    [CreatureType.Invertebrate, 11, LocomotionType.Legs, 4],
    [CreatureType.Invertebrate, 12, LocomotionType.Legs, 6],
    [CreatureType.Invertebrate, 14, LocomotionType.Legs, 6],
    [CreatureType.Invertebrate, 15, LocomotionType.Legs, 8],
    [CreatureType.Invertebrate, 17, LocomotionType.Legs, 8],
    [CreatureType.Invertebrate, 18, LocomotionType.Legs, 12],
    [CreatureType.Invertebrate, 20, LocomotionType.Legs, 12],
    [CreatureType.Mammal, 1, LocomotionType.Legs, 2],
    [CreatureType.Mammal, 7, LocomotionType.Legs, 2],
    [CreatureType.Mammal, 8, LocomotionType.Legs, 4],
    [CreatureType.Mammal, 14, LocomotionType.Legs, 4],
    [CreatureType.Mammal, 15, LocomotionType.Legs, 6],
    [CreatureType.Mammal, 20, LocomotionType.Legs, 6],
    [CreatureType.Reptile, 1, LocomotionType.Slithering, undefined],
    [CreatureType.Reptile, 5, LocomotionType.Slithering, undefined],
    [CreatureType.Reptile, 6, LocomotionType.Legs, 2],
    [CreatureType.Reptile, 10, LocomotionType.Legs, 2],
    [CreatureType.Reptile, 11, LocomotionType.Legs, 4],
    [CreatureType.Reptile, 15, LocomotionType.Legs, 4],
    [CreatureType.Reptile, 16, LocomotionType.Legs, 6],
    [CreatureType.Reptile, 20, LocomotionType.Legs, 6],
    [CreatureType.Fish, 1, LocomotionType.Fins, 2],
    [CreatureType.Fish, 13, LocomotionType.Fins, 2],
    [CreatureType.Fish, 14, LocomotionType.Fins, 4],
    [CreatureType.Fish, 20, LocomotionType.Fins, 4],
  ];

  test.each(singleTypeCases)(
    'maps %s roll %i to %s with count %s',
    (creatureType, roll, expectedType, expectedCount) => {
      const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

      expect(
        summarize(generateRandomLocomotionType(creatureType, Habitat.Forest)),
      ).toEqual([{ type: expectedType, count: expectedCount }]);
      expect(d20).toHaveBeenCalledTimes(1);
    },
  );

  test('uses flippers for an ocean mammal', () => {
    jest.spyOn(D20, 'roll').mockReturnValueOnce(1);

    expect(
      summarize(
        generateRandomLocomotionType(CreatureType.Mammal, Habitat.Ocean),
      ),
    ).toEqual([{ type: LocomotionType.Flippers, count: 2 }]);
  });

  test('uses legs for a non-ocean mammal', () => {
    jest.spyOn(D20, 'roll').mockReturnValueOnce(1);

    expect(
      summarize(
        generateRandomLocomotionType(CreatureType.Mammal, Habitat.River),
      ),
    ).toEqual([{ type: LocomotionType.Legs, count: 2 }]);
  });

  test.each([
    [5, 4, 4],
    [7, 20, 12],
  ])(
    'gives an invertebrate tentacles from roll %i and second roll %i with count %i',
    (roll, secondRoll, expectedCount) => {
      const d20 = jest
        .spyOn(D20, 'roll')
        .mockReturnValueOnce(roll)
        .mockReturnValueOnce(secondRoll);

      expect(
        summarize(
          generateRandomLocomotionType(
            CreatureType.Invertebrate,
            Habitat.Forest,
          ),
        ),
      ).toEqual([{ type: LocomotionType.Tentacles, count: expectedCount }]);
      expect(d20).toHaveBeenCalledTimes(2);
    },
  );

  test.each([
    [1, LocomotionType.Legs, 2, LocomotionType.Wings, 4],
    [5, LocomotionType.Legs, 2, LocomotionType.Wings, 4],
    [6, LocomotionType.Legs, 2, LocomotionType.Wings, 2],
    [15, LocomotionType.Legs, 2, LocomotionType.Wings, 2],
    [16, LocomotionType.Legs, 4, LocomotionType.Wings, 2],
    [17, LocomotionType.Legs, 4, LocomotionType.Wings, 2],
    [18, LocomotionType.Legs, 4, LocomotionType.Wings, 2],
    [19, LocomotionType.Legs, 4, LocomotionType.Wings, 2],
    [20, LocomotionType.Legs, 4, LocomotionType.Wings, 2],
  ])(
    'maps bird roll %i to legs and wings',
    (roll, legType, legCount, wingType, wingCount) => {
      jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

      expect(
        summarize(
          generateRandomLocomotionType(CreatureType.Bird, Habitat.Hills),
        ),
      ).toEqual([
        { type: legType, count: legCount },
        { type: wingType, count: wingCount },
      ]);
    },
  );

  test.each([
    [6, 4, 4],
    [10, 20, 12],
  ])(
    'gives an amphibian tentacles from roll %i and second roll %i with count %i',
    (roll, secondRoll, expectedCount) => {
      const d20 = jest
        .spyOn(D20, 'roll')
        .mockReturnValueOnce(roll)
        .mockReturnValueOnce(secondRoll);

      expect(
        summarize(
          generateRandomLocomotionType(CreatureType.Amphibian, Habitat.Forest),
        ),
      ).toEqual([{ type: LocomotionType.Tentacles, count: expectedCount }]);
      expect(d20).toHaveBeenCalledTimes(2);
    },
  );

  test.each([
    [11, Habitat.Ocean, LocomotionType.Flippers, 4],
    [11, Habitat.River, LocomotionType.Flippers, 4],
    [11, Habitat.Forest, LocomotionType.Legs, 4],
    [16, Habitat.Ocean, LocomotionType.Flippers, 6],
    [16, Habitat.Forest, LocomotionType.Legs, 6],
    [20, Habitat.River, LocomotionType.Flippers, 6],
  ])(
    'maps amphibian roll %i in %s to %s with count %i',
    (roll, habitat, expectedType, expectedCount) => {
      jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

      expect(
        summarize(
          generateRandomLocomotionType(CreatureType.Amphibian, habitat),
        ),
      ).toEqual([{ type: expectedType, count: expectedCount }]);
    },
  );

  test.each([
    [1, 2],
    [20, 12],
  ])('gives a plant %i roots from roll %i', (roll, expectedCount) => {
    const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

    expect(
      summarize(
        generateRandomLocomotionType(CreatureType.Plant, Habitat.Forest),
      ),
    ).toEqual([{ type: LocomotionType.Roots, count: expectedCount }]);
    expect(d20).toHaveBeenCalledTimes(1);
  });

  test('returns an empty list for an unknown creature type', () => {
    expect(
      generateRandomLocomotionType(99 as CreatureType, Habitat.Forest),
    ).toEqual([]);
  });

  test.each([
    CreatureType.Invertebrate,
    CreatureType.Mammal,
    CreatureType.Bird,
    CreatureType.Reptile,
    CreatureType.Amphibian,
    CreatureType.Fish,
  ])('returns undefined for out-of-range rolls for %s', (creatureType) => {
    jest.spyOn(D20, 'roll').mockReturnValueOnce(0);

    expect(
      generateRandomLocomotionType(creatureType, Habitat.Forest),
    ).toBeUndefined();
  });
});
