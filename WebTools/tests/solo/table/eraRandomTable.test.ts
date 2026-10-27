import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import {
  eraRandomTable,
  eraRandomTableForStarships,
} from '../../../src/solo/table/eraRandomTable';
import { Era } from '../../../src/helpers/erasEnum';

describe('eraRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('eraRandomTable returns Enterprise for 1-6', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(6);
    expect(eraRandomTable()).toBe(Era.Enterprise);
    spy.mockRestore();
  });

  test('eraRandomTable rerolls on default and returns NextGeneration', () => {
    const values = [19, 18];
    const spy = jest
      .spyOn(D20, 'roll')
      .mockImplementation(() => values.shift() as number);
    expect(eraRandomTable()).toBe(Era.NextGeneration);
    spy.mockRestore();
  });

  test('eraRandomTableForStarships returns Discovery32 for default', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(19);
    expect(eraRandomTableForStarships()).toBe(Era.Discovery32);
    spy.mockRestore();
  });

  test('eraRandomTableForStarships returns PicardProdigy for 15-18', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(18);
    expect(eraRandomTableForStarships()).toBe(Era.PicardProdigy);
    spy.mockRestore();
  });
});
