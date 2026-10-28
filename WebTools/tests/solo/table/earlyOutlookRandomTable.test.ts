import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import {
  earlyOutlookUpbringingRandomTable,
  earlyOutlookCasteRandomTable,
  earlyOutlookAspirationRandomTable,
} from '../../../src/solo/table/earlyOutlookRandomTable';
import { EarlyOutlook } from '../../../src/helpers/upbringings';

describe('earlyOutlookRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('upbringing returns MilitaryOrExploration for 1-3', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(1);
    expect(earlyOutlookUpbringingRandomTable()).toBe(
      EarlyOutlook.MilitaryOrExploration,
    );
    spy.mockRestore();
  });

  test('upbringing rerolls on default (>18)', () => {
    const values = [19, 4];
    const spy = jest
      .spyOn(D20, 'roll')
      .mockImplementation(() => values.shift() as number);
    expect(earlyOutlookUpbringingRandomTable()).toBe(
      EarlyOutlook.BusinessOrTrade,
    );
    spy.mockRestore();
  });

  test('caste returns WarriorCaste for 1-3', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(3);
    expect(earlyOutlookCasteRandomTable()).toBe(EarlyOutlook.WarriorCaste);
    spy.mockRestore();
  });

  test('aspiration returns ToExplore for 1-3', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(2);
    expect(earlyOutlookAspirationRandomTable()).toBe(EarlyOutlook.ToExplore);
    spy.mockRestore();
  });
});
