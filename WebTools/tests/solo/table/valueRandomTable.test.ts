import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { Department } from '../../../src/helpers/department';
import { Species } from '../../../src/helpers/speciesEnum';
import { hasSource } from '../../../src/state/contextFunctions';
import {
  valueRandomTable,
  randomUniqueValue,
} from '../../../src/solo/table/valueRandomTable';

jest.mock('../../../src/state/contextFunctions', () => ({
  hasSource: jest.fn(),
}));

const hasSourceMock = jest.mocked(hasSource);

const rollsInRange = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const rollsForTotal = (total: number): number[] => {
  const first = Math.min(20, total - 2);
  const second = Math.min(20, total - first - 1);
  return [first, second, total - first - second];
};

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

describe('valueRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    hasSourceMock.mockReset();
  });

  test('covers every StandardValuesTable roll when ContinuingMissions is absent', () => {
    hasSourceMock.mockReturnValue(false);
    const rolls = [...rollsInRange(1, 20), 21];
    queueRolls(rolls.flatMap((roll) => [16, roll]));

    for (const roll of rolls) {
      expect(valueRandomTable().length).toBeGreaterThan(0);
    }
  });

  test('uses the StandardValuesTable when the source is absent and the outer roll is low', () => {
    hasSourceMock.mockReturnValue(false);
    queueRolls([1, 1]);

    expect(valueRandomTable()).toBe('A good mystery is irresistible');
  });

  test('uses the StandardValuesTable when the outer roll is above 15', () => {
    hasSourceMock.mockReturnValue(true);
    queueRolls([16, 20]);

    expect(valueRandomTable()).toBe(
      'You must walk barefoot in the dirt to really understand a world',
    );
  });

  test('covers every VulcanValuesTable roll', () => {
    hasSourceMock.mockReturnValue(true);
    const rolls = [...rollsInRange(1, 20), 21];
    queueRolls(rolls.flatMap((roll) => [1, 1, roll]));

    for (const roll of rolls) {
      expect(valueRandomTable(Species.Vulcan).length).toBeGreaterThan(0);
    }
  });

  test('covers every KlingonValuesTable roll', () => {
    hasSourceMock.mockReturnValue(true);
    const rolls = [...rollsInRange(1, 20), 21];
    queueRolls(rolls.flatMap((roll) => [1, 1, roll]));

    for (const roll of rolls) {
      expect(valueRandomTable(Species.Klingon).length).toBeGreaterThan(0);
    }
  });

  test('covers every GeneralValuesTable roll when no species or discipline is provided', () => {
    hasSourceMock.mockReturnValue(true);
    const totals = [...rollsInRange(3, 60), 61];
    queueRolls(totals.flatMap((total) => [1, 1, ...rollsForTotal(total)]));

    for (const total of totals) {
      expect(valueRandomTable().length).toBeGreaterThan(0);
    }
  });

  test('uses the GeneralValuesTable when the sub-roll is above 10', () => {
    hasSourceMock.mockReturnValue(true);
    queueRolls([1, 11, ...rollsForTotal(3)]);

    expect(valueRandomTable()).toBe(
      'Infinite diversity in infinite combinations',
    );
  });

  test.each([
    Department.Command,
    Department.Conn,
    Department.Security,
    Department.Engineering,
    Department.Science,
    Department.Medicine,
  ])('covers every discipline table roll for department %s', (department) => {
    hasSourceMock.mockReturnValue(true);
    const totals = [...rollsInRange(3, 60), 61];
    queueRolls(totals.flatMap((total) => [1, 1, ...rollsForTotal(total)]));

    for (const total of totals) {
      expect(valueRandomTable(undefined, department).length).toBeGreaterThan(0);
    }
  });

  test('uses the species table when both species and discipline are provided and the choice roll is 10 or lower', () => {
    hasSourceMock.mockReturnValue(true);
    queueRolls([1, 1, 10, 1]);

    expect(valueRandomTable(Species.Vulcan, Department.Command)).toBe(
      'A logical mind is a focused mind',
    );
  });

  test('uses the discipline table when both species and discipline are provided and the choice roll is above 10', () => {
    hasSourceMock.mockReturnValue(true);
    queueRolls([1, 1, 11, ...rollsForTotal(3)]);

    expect(valueRandomTable(Species.Vulcan, Department.Command)).toBe(
      "A captain's place is on the bridge",
    );
  });

  test('uses the discipline table when the species has no table of its own', () => {
    hasSourceMock.mockReturnValue(true);
    queueRolls([1, 1, ...rollsForTotal(3)]);

    expect(valueRandomTable(Species.Human, Department.Command)).toBe(
      "A captain's place is on the bridge",
    );
  });

  test('uses the species table when the discipline is unknown', () => {
    hasSourceMock.mockReturnValue(true);
    queueRolls([1, 1, 1]);

    expect(valueRandomTable(Species.Vulcan, 999 as Department)).toBe(
      'A logical mind is a focused mind',
    );
  });

  test('falls back to the GeneralValuesTable when both species and discipline are unknown', () => {
    hasSourceMock.mockReturnValue(true);
    queueRolls([1, 1, ...rollsForTotal(3)]);

    expect(valueRandomTable(Species.Human, 999 as Department)).toBe(
      'Infinite diversity in infinite combinations',
    );
  });

  test('returns a string', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = valueRandomTable();
    expect(typeof result).toBe('string');
    spy.mockRestore();
  });

  test('can return the same value on successive rolls', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const first = valueRandomTable();
    const second = valueRandomTable();
    expect(first).toBe(second);
    spy.mockRestore();
  });
});

describe('randomUniqueValue', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    hasSourceMock.mockReset();
  });

  test('returns a string', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = randomUniqueValue([]);
    expect(typeof result).toBe('string');
    spy.mockRestore();
  });

  test('rerolls when the rolled value is already assigned', () => {
    // With the default store, valueRandomTable uses StandardValuesTable.
    // Math.random 0.5 rolls an 11, and 0.6 rolls a 13.
    const assigned = 'Push me too far and you’ll see my ugly side';
    const rerolled = 'Seeking to find myself far from home';

    // valueRandomTable consumes two random values per attempt
    // (an unused outer roll and the StandardValuesTable roll).
    const randomValues = [0.5, 0.5, 0.5, 0.6];
    const spy = jest
      .spyOn(Math, 'random')
      .mockImplementation(() => randomValues.shift());
    const result = randomUniqueValue([assigned]);
    expect(result).toBe(rerolled);
    spy.mockRestore();
  });

  test('never returns a value already assigned', () => {
    const assigned = [
      'A good mystery is irresistible',
      'Act with confidence, even if you don’t feel confident',
    ];
    let calls = 0;
    const spy = jest.spyOn(Math, 'random').mockImplementation(() => {
      calls = (calls + 1) % 1000;
      return calls / 1000;
    });
    for (let i = 0; i < 50; i++) {
      const result = randomUniqueValue(assigned);
      expect(assigned).not.toContain(result);
    }
    spy.mockRestore();
  });
});
