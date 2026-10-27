import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import {
  educationCategoryRandomTable,
  educationTrackRandomTable,
} from '../../../src/solo/table/educationRandomTable';
import { CharacterType } from '../../../src/common/characterType';
import { Track } from '../../../src/helpers/trackEnum';

describe('educationRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('category returns Starfleet for 1-5', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(5);
    expect(educationCategoryRandomTable()).toBe(CharacterType.Starfleet);
    spy.mockRestore();
  });

  test('category returns Civilian for 20/default', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(20);
    expect(educationCategoryRandomTable()).toBe(CharacterType.Civilian);
    spy.mockRestore();
  });

  test('track Starfleet returns Command for 1-6', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(6);
    expect(educationTrackRandomTable(CharacterType.Starfleet)).toBe(
      Track.Command,
    );
    spy.mockRestore();
  });

  test('track AlliedMilitary returns Officer for 6-10', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(10);
    expect(educationTrackRandomTable(CharacterType.AlliedMilitary)).toBe(
      Track.Officer,
    );
    spy.mockRestore();
  });

  test('track AmbassadorDiplomat returns DiplomaticCorps for 1-10', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(10);
    expect(educationTrackRandomTable(CharacterType.AmbassadorDiplomat)).toBe(
      Track.DiplomaticCorps,
    );
    spy.mockRestore();
  });

  test('track Civilian rerolls on 19-20', () => {
    const values = [19, 1];
    const spy = jest
      .spyOn(D20, 'roll')
      .mockImplementation(() => values.shift() as number);
    expect(educationTrackRandomTable(CharacterType.Civilian)).toBe(
      Track.FreightAndTransport,
    );
    spy.mockRestore();
  });
});
