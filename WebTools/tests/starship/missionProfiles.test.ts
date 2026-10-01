import { test, expect, describe, jest, afterEach } from '@jest/globals';
import '../../src/helpers/species';
import { Starship } from '../../src/common/starship';
import { CharacterType } from '../../src/common/characterType';
import { Era } from '../../src/helpers/erasEnum';
import {
  MissionProfiles,
  MissionProfile,
} from '../../src/helpers/missionProfiles';
import { Department } from '../../src/helpers/department';
import { Source } from '../../src/helpers/sources';

jest.mock('i18next', () => {
  const mockI18n: any = (key: string) => key;
  mockI18n.t = (key: string) => key;
  mockI18n.use = function () {
    return this;
  };
  mockI18n.init = function () {
    return this;
  };
  mockI18n.on = function () {
    return this;
  };
  mockI18n.changeLanguage = function () {
    return Promise.resolve();
  };
  return mockI18n;
});

const mockStoreState: { context: { sources: number[] } } = {
  context: { sources: [Source.Core2ndEdition] },
};
jest.mock('../../src/state/store', () => ({
  store: {
    getState: () => mockStoreState,
    dispatch: () => undefined,
  },
}));

function createStarship(type: CharacterType, version: number) {
  return Starship.createStandardStarship(Era.NextGeneration, type, version);
}

describe('MissionProfiles', () => {
  describe('getMissionProfiles', () => {
    test('returns 2e Core profiles with systems for a 2e Starfleet ship', () => {
      const profiles = MissionProfiles.instance.getMissionProfiles(
        createStarship(CharacterType.Starfleet, 2),
      );

      expect(profiles.length).toBeGreaterThan(0);
      expect(profiles.every((p) => p.systems.length > 0)).toBe(true);
      expect(
        profiles.some((p) => p.type === CharacterType.KlingonWarrior),
      ).toBe(false);
    });

    test('returns the Starfleet 2e profiles for a 2e Klingon Warrior ship', () => {
      const klingonProfiles = MissionProfiles.instance.getMissionProfiles(
        createStarship(CharacterType.KlingonWarrior, 2),
      );

      expect(klingonProfiles.length).toBeGreaterThan(0);
      expect(
        klingonProfiles.every((p) => p.type === CharacterType.KlingonWarrior),
      ).toBe(true);
      expect(klingonProfiles.every((p) => p.systems.length > 0)).toBe(true);
    });

    test('returns Klingon Core profiles without systems for a 1e Klingon Warrior ship', () => {
      const profiles = MissionProfiles.instance.getMissionProfiles(
        createStarship(CharacterType.KlingonWarrior, 1),
      );

      expect(profiles.length).toBeGreaterThan(0);
      expect(
        profiles.every((p) => p.type === CharacterType.KlingonWarrior),
      ).toBe(true);
      expect(profiles.every((p) => p.systems.length === 0)).toBe(true);
    });

    test('returns 1e Core profiles for a 1e Starfleet ship', () => {
      const profiles = MissionProfiles.instance.getMissionProfiles(
        createStarship(CharacterType.Starfleet, 1),
      );

      expect(profiles.length).toBeGreaterThan(0);
      expect(
        profiles.some((p) => p.type === CharacterType.KlingonWarrior),
      ).toBe(false);
    });
  });

  describe('getMissionProfileByName', () => {
    test('returns a Klingon Core profile for a 2e Klingon Warrior ship', () => {
      const profile = MissionProfiles.instance.getMissionProfileByName(
        'Warship',
        CharacterType.KlingonWarrior,
        2,
      );

      expect(profile).toBeDefined();
      expect(profile.type).toBe(CharacterType.KlingonWarrior);
      expect(profile.systems.length).toBeGreaterThan(0);
    });

    test('does not return a Starfleet 2e profile for a 2e Klingon Warrior ship', () => {
      const profile = MissionProfiles.instance.getMissionProfileByName(
        'Tactical',
        CharacterType.KlingonWarrior,
        2,
      );

      expect(profile).toBeNull();
    });

    test('returns a Starfleet 2e profile for a 2e Starfleet ship', () => {
      const profile = MissionProfiles.instance.getMissionProfileByName(
        'Tactical',
        CharacterType.Starfleet,
        2,
      );

      expect(profile).toBeDefined();
      expect(profile.type).not.toBe(CharacterType.KlingonWarrior);
    });

    test('returns a Klingon Core profile without systems for a 1e Klingon Warrior ship', () => {
      const profile = MissionProfiles.instance.getMissionProfileByName(
        'Warship',
        CharacterType.KlingonWarrior,
        1,
      );

      expect(profile).toBeDefined();
      expect(profile.type).toBe(CharacterType.KlingonWarrior);
      expect(profile.systems.length).toBe(0);
    });
  });
});

describe('Strategic and Diplomatic Operations mission profile (#342)', () => {
  function strategicDiplomaticProfile(type: CharacterType, version: number) {
    const starship = createStarship(type, version);
    return MissionProfiles.instance
      .getMissionProfiles(starship)
      .find((p) => p.id === MissionProfile.StrategicAndDiplomatic);
  }

  test('grants a Command bonus rather than a Science bonus for a 2e Starfleet ship', () => {
    const profile = strategicDiplomaticProfile(CharacterType.Starfleet, 2);

    expect(profile).toBeDefined();
    expect(profile.departments[Department.Command]).toBe(3);
    expect(profile.departments[Department.Science]).toBe(2);
    expect(profile.departments[Department.Command]).toBeGreaterThan(
      profile.departments[Department.Science],
    );
  });

  test('matches the errata departments for every edition and faction', () => {
    const expectedDepartments = [3, 1, 2, 2, 2, 2];
    const editionsAndFactions = [
      [CharacterType.Starfleet, 1],
      [CharacterType.Starfleet, 2],
      [CharacterType.KlingonWarrior, 1],
      [CharacterType.KlingonWarrior, 2],
    ];

    for (const [type, version] of editionsAndFactions) {
      const profile = strategicDiplomaticProfile(type, version);
      expect(profile).toBeDefined();
      expect(profile.departments).toEqual(expectedDepartments);
    }
  });
});

describe('Mission profiles from Utopia Planitia (#115)', () => {
  function starfleet1eProfiles() {
    return MissionProfiles.instance.getMissionProfiles(
      createStarship(CharacterType.Starfleet, 1),
    );
  }

  afterEach(() => {
    mockStoreState.context.sources = [Source.Core2ndEdition];
  });

  test('offers the Warship profile to a 1e Starfleet ship when the Utopia Planitia source is enabled', () => {
    mockStoreState.context.sources = [Source.Core, Source.UtopiaPlanitia];

    const warship = starfleet1eProfiles().find(
      (p) => p.id === MissionProfile.Warship,
    );

    expect(warship).toBeDefined();
  });

  test('does not offer the Warship profile to a 1e Starfleet ship without the Utopia Planitia source', () => {
    mockStoreState.context.sources = [Source.Core];

    const warship = starfleet1eProfiles().find(
      (p) => p.id === MissionProfile.Warship,
    );

    expect(warship).toBeUndefined();
  });

  test('gives the Warship profile Expanded Munitions in place of Quantum Torpedoes', () => {
    mockStoreState.context.sources = [Source.Core, Source.UtopiaPlanitia];

    const warship = starfleet1eProfiles().find(
      (p) => p.id === MissionProfile.Warship,
    );

    expect(warship).toBeDefined();
    const talents = warship.talents.map((t) => t.name);
    expect(talents).toContain('Expanded Munitions');
    expect(talents).not.toContain('Quantum Torpedoes');
  });

  test('gives the 1e Tactical Operations profile the Expanded Munitions talent', () => {
    const tacOps = starfleet1eProfiles().find(
      (p) => p.id === MissionProfile.Tactical,
    );

    expect(tacOps).toBeDefined();
    expect(tacOps.talents.map((t) => t.name)).toContain('Expanded Munitions');
  });
});
