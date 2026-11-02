import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import {
  earlyOutlookUpbringingRandomTable,
  earlyOutlookCasteRandomTable,
  earlyOutlookAspirationRandomTable,
} from '../../../src/solo/table/earlyOutlookRandomTable';
import { EarlyOutlook } from '../../../src/helpers/upbringings';

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

const upbringingByRoll: EarlyOutlook[] = [
  EarlyOutlook.MilitaryOrExploration,
  EarlyOutlook.MilitaryOrExploration,
  EarlyOutlook.MilitaryOrExploration,
  EarlyOutlook.BusinessOrTrade,
  EarlyOutlook.BusinessOrTrade,
  EarlyOutlook.BusinessOrTrade,
  EarlyOutlook.AgricultureOrRural,
  EarlyOutlook.AgricultureOrRural,
  EarlyOutlook.AgricultureOrRural,
  EarlyOutlook.ScienceAndTechnology,
  EarlyOutlook.ScienceAndTechnology,
  EarlyOutlook.ScienceAndTechnology,
  EarlyOutlook.ArtisticAndCreative,
  EarlyOutlook.ArtisticAndCreative,
  EarlyOutlook.ArtisticAndCreative,
  EarlyOutlook.DiplomacyAndPolitics,
  EarlyOutlook.DiplomacyAndPolitics,
  EarlyOutlook.DiplomacyAndPolitics,
];

const casteByRoll: EarlyOutlook[] = [
  EarlyOutlook.WarriorCaste,
  EarlyOutlook.WarriorCaste,
  EarlyOutlook.WarriorCaste,
  EarlyOutlook.MerchantCaste,
  EarlyOutlook.MerchantCaste,
  EarlyOutlook.MerchantCaste,
  EarlyOutlook.AgriculturalCaste,
  EarlyOutlook.AgriculturalCaste,
  EarlyOutlook.AgriculturalCaste,
  EarlyOutlook.ScientificCaste,
  EarlyOutlook.ScientificCaste,
  EarlyOutlook.ScientificCaste,
  EarlyOutlook.ArtisticCaste,
  EarlyOutlook.ArtisticCaste,
  EarlyOutlook.ArtisticCaste,
  EarlyOutlook.AcademicCaste,
  EarlyOutlook.AcademicCaste,
  EarlyOutlook.AcademicCaste,
];

const aspirationByRoll: EarlyOutlook[] = [
  EarlyOutlook.ToExplore,
  EarlyOutlook.ToExplore,
  EarlyOutlook.ToExplore,
  EarlyOutlook.ToFly,
  EarlyOutlook.ToFly,
  EarlyOutlook.ToFly,
  EarlyOutlook.ToCreate,
  EarlyOutlook.ToCreate,
  EarlyOutlook.ToCreate,
  EarlyOutlook.ToDiscover,
  EarlyOutlook.ToDiscover,
  EarlyOutlook.ToDiscover,
  EarlyOutlook.ToProtect,
  EarlyOutlook.ToProtect,
  EarlyOutlook.ToProtect,
  EarlyOutlook.ToProsper,
  EarlyOutlook.ToProsper,
  EarlyOutlook.ToProsper,
];

describe('earlyOutlookRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns every upbringing for rolls 1-18', () => {
    expectRolls(upbringingByRoll, earlyOutlookUpbringingRandomTable);
  });

  test.each([19, 20, 21])(
    'rerolls the upbringing when the roll is %i',
    (roll) => {
      queueRolls([roll, 1]);

      expect(earlyOutlookUpbringingRandomTable()).toBe(
        EarlyOutlook.MilitaryOrExploration,
      );
    },
  );

  test('returns every caste for rolls 1-18', () => {
    expectRolls(casteByRoll, earlyOutlookCasteRandomTable);
  });

  test.each([19, 20, 21])('rerolls the caste when the roll is %i', (roll) => {
    queueRolls([roll, 1]);

    expect(earlyOutlookCasteRandomTable()).toBe(EarlyOutlook.WarriorCaste);
  });

  test('returns every aspiration for rolls 1-18', () => {
    expectRolls(aspirationByRoll, earlyOutlookAspirationRandomTable);
  });

  test.each([19, 20, 21])(
    'rerolls the aspiration when the roll is %i',
    (roll) => {
      queueRolls([roll, 1]);

      expect(earlyOutlookAspirationRandomTable()).toBe(EarlyOutlook.ToExplore);
    },
  );
});
