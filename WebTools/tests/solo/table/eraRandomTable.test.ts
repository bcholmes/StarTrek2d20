import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import {
  eraRandomTable,
  eraRandomTableForStarships,
} from '../../../src/solo/table/eraRandomTable';
import { Era } from '../../../src/helpers/erasEnum';

const queueRolls = (rolls: number[]) => {
  const remaining = [...rolls];

  return jest.spyOn(D20, 'roll').mockImplementation(() => {
    const value = remaining.shift();
    if (value == null) {
      throw new Error('No mocked D20 roll remaining');
    }
    return value;
  });
};

const expectRolls = <T>(expectedByRoll: T[], roll: () => T) => {
  const spy = queueRolls(expectedByRoll.map((_, index) => index + 1));

  for (const expected of expectedByRoll) {
    expect(roll()).toBe(expected);
  }

  spy.mockRestore();
};

const eraByRoll: Era[] = [
  Era.Enterprise,
  Era.Enterprise,
  Era.Enterprise,
  Era.Enterprise,
  Era.Enterprise,
  Era.Enterprise,
  Era.OriginalSeries,
  Era.OriginalSeries,
  Era.OriginalSeries,
  Era.OriginalSeries,
  Era.OriginalSeries,
  Era.OriginalSeries,
  Era.NextGeneration,
  Era.NextGeneration,
  Era.NextGeneration,
  Era.NextGeneration,
  Era.NextGeneration,
  Era.NextGeneration,
];

const starshipEraByRoll: Era[] = [
  Era.Enterprise,
  Era.Enterprise,
  Era.Enterprise,
  Era.Enterprise,
  Era.OriginalSeries,
  Era.OriginalSeries,
  Era.OriginalSeries,
  Era.OriginalSeries,
  Era.OriginalSeries,
  Era.NextGeneration,
  Era.NextGeneration,
  Era.NextGeneration,
  Era.NextGeneration,
  Era.NextGeneration,
  Era.PicardProdigy,
  Era.PicardProdigy,
  Era.PicardProdigy,
  Era.PicardProdigy,
  Era.Discovery32,
  Era.Discovery32,
  Era.Discovery32,
];

describe('eraRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns every era for rolls 1-18', () => {
    expectRolls(eraByRoll, eraRandomTable);
  });

  test.each([19, 20, 21])('rerolls the era when the roll is %i', (roll) => {
    queueRolls([roll, 13]);

    expect(eraRandomTable()).toBe(Era.NextGeneration);
  });

  test('returns every starship era for rolls 1-20 and default', () => {
    expectRolls(starshipEraByRoll, eraRandomTableForStarships);
  });
});
