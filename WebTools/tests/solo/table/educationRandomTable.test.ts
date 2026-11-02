import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import {
  educationCategoryRandomTable,
  educationTrackRandomTable,
} from '../../../src/solo/table/educationRandomTable';
import { CharacterType } from '../../../src/common/characterType';
import { Track } from '../../../src/helpers/trackEnum';

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

const categoryByRoll: CharacterType[] = [
  CharacterType.Starfleet,
  CharacterType.Starfleet,
  CharacterType.Starfleet,
  CharacterType.Starfleet,
  CharacterType.Starfleet,
  CharacterType.AlliedMilitary,
  CharacterType.AlliedMilitary,
  CharacterType.AlliedMilitary,
  CharacterType.AlliedMilitary,
  CharacterType.AlliedMilitary,
  CharacterType.AmbassadorDiplomat,
  CharacterType.AmbassadorDiplomat,
  CharacterType.AmbassadorDiplomat,
  CharacterType.AmbassadorDiplomat,
  CharacterType.AmbassadorDiplomat,
  CharacterType.Civilian,
  CharacterType.Civilian,
  CharacterType.Civilian,
  CharacterType.Civilian,
  CharacterType.Civilian,
  CharacterType.Civilian,
];

const starfleetTrackByRoll: Track[] = [
  Track.Command,
  Track.Command,
  Track.Command,
  Track.Command,
  Track.Command,
  Track.Command,
  Track.Sciences,
  Track.Sciences,
  Track.Sciences,
  Track.Sciences,
  Track.Sciences,
  Track.Sciences,
  Track.Sciences,
  Track.Operations,
  Track.Operations,
  Track.Operations,
  Track.Operations,
  Track.Operations,
  Track.Operations,
  Track.Operations,
  Track.Operations,
];

const alliedMilitaryTrackByRoll: Track[] = [
  Track.RankAndFile,
  Track.RankAndFile,
  Track.RankAndFile,
  Track.RankAndFile,
  Track.RankAndFile,
  Track.Officer,
  Track.Officer,
  Track.Officer,
  Track.Officer,
  Track.Officer,
  Track.IntelligenceTraining,
  Track.IntelligenceTraining,
  Track.IntelligenceTraining,
  Track.IntelligenceTraining,
  Track.IntelligenceTraining,
  Track.MilitiaAndGuerillas,
  Track.MilitiaAndGuerillas,
  Track.MilitiaAndGuerillas,
  Track.MilitiaAndGuerillas,
  Track.MilitiaAndGuerillas,
  Track.MilitiaAndGuerillas,
];

const ambassadorDiplomatTrackByRoll: Track[] = [
  Track.DiplomaticCorps,
  Track.DiplomaticCorps,
  Track.DiplomaticCorps,
  Track.DiplomaticCorps,
  Track.DiplomaticCorps,
  Track.DiplomaticCorps,
  Track.DiplomaticCorps,
  Track.DiplomaticCorps,
  Track.DiplomaticCorps,
  Track.DiplomaticCorps,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
  Track.HonoraryStatus,
];

const civilianTrackByRoll: Track[] = [
  Track.FreightAndTransport,
  Track.FreightAndTransport,
  Track.FreightAndTransport,
  Track.LawEnforcement,
  Track.LawEnforcement,
  Track.LawEnforcement,
  Track.Physician,
  Track.Physician,
  Track.Physician,
  Track.PoliticianOrBureaucrat,
  Track.PoliticianOrBureaucrat,
  Track.PoliticianOrBureaucrat,
  Track.ScientificOrTechnicalExpert,
  Track.ScientificOrTechnicalExpert,
  Track.ScientificOrTechnicalExpert,
  Track.TraderOrMerchant,
  Track.TraderOrMerchant,
  Track.TraderOrMerchant,
];

describe('educationRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns every category for rolls 1-20 and default', () => {
    expectRolls(categoryByRoll, educationCategoryRandomTable);
  });

  test('returns every Starfleet track for rolls 1-20 and default', () => {
    expectRolls(starfleetTrackByRoll, () =>
      educationTrackRandomTable(CharacterType.Starfleet),
    );
  });

  test('returns every Allied Military track for rolls 1-20 and default', () => {
    expectRolls(alliedMilitaryTrackByRoll, () =>
      educationTrackRandomTable(CharacterType.AlliedMilitary),
    );
  });

  test('returns every Ambassador Diplomat track for rolls 1-20 and default', () => {
    expectRolls(ambassadorDiplomatTrackByRoll, () =>
      educationTrackRandomTable(CharacterType.AmbassadorDiplomat),
    );
  });

  test('returns every Civilian track for rolls 1-18', () => {
    expectRolls(civilianTrackByRoll, () =>
      educationTrackRandomTable(CharacterType.Civilian),
    );
  });

  test.each([19, 20, 21])(
    'rerolls the Civilian track when the roll is %i',
    (roll) => {
      queueRolls([roll, 1]);

      expect(educationTrackRandomTable(CharacterType.Civilian)).toBe(
        Track.FreightAndTransport,
      );
    },
  );

  test('falls back to the Civilian tracks for other character types', () => {
    queueRolls([1]);

    expect(educationTrackRandomTable(CharacterType.Cadet)).toBe(
      Track.FreightAndTransport,
    );
  });
});
