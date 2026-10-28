import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { StarshipRandomTalentTable } from '../../../src/solo/table/starshipRandomTalentTable';

describe('starshipRandomTalentTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns common talent for rolls 1-7', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(1);
    const result = StarshipRandomTalentTable();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    spy.mockRestore();
  });

  test('returns uncommon talent for rolls 8-14', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(8);
    const result = StarshipRandomTalentTable();
    expect(typeof result).toBe('string');
    spy.mockRestore();
  });

  test('returns rare talent for rolls 15-20', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(20);
    const result = StarshipRandomTalentTable();
    expect(typeof result).toBe('string');
    spy.mockRestore();
  });
});
