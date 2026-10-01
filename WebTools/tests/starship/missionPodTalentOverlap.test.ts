import { test, expect, describe, jest } from '@jest/globals';
import '../../src/helpers/species';
import { Starship, MissionProfileStep } from '../../src/common/starship';
import { CharacterType } from '../../src/common/characterType';
import { Era } from '../../src/helpers/erasEnum';
import { MissionProfiles } from '../../src/helpers/missionProfiles';
import { MissionPodHelper } from '../../src/helpers/missionPods';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { marshaller } from '../../src/helpers/marshaller';

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

jest.mock('../../src/state/store', () => {
  const core2ndEdition = 1;
  return {
    store: {
      getState: () => ({ context: { sources: [core2ndEdition] } }),
      dispatch: () => undefined,
    },
  };
});

function shipWithRuggedDesignFromProfileAndPod() {
  const starship = Starship.createStandardStarship(
    Era.NextGeneration,
    CharacterType.Starfleet,
    2,
  );
  starship.missionProfileStep = new MissionProfileStep(
    MissionProfiles.instance.getMissionProfileByName(
      'LogisticalQuartermaster',
      CharacterType.Starfleet,
      2,
    ),
  );
  starship.missionProfileStep.talent = new SelectedTalent('Rugged Design');
  starship.missionPodModel = MissionPodHelper.instance().getMissionPodByName(
    'MobileDrydock',
    2,
  );
  return starship;
}

function countTalentNamed(starship: Starship, name: string): number {
  return starship.talentsWithoutAdditional.filter((s) => s.talent === name)
    .length;
}

describe('Mission pod and mission profile talent overlap (#345)', () => {
  test('an overlapping mission pod talent is not granted twice', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();

    expect(countTalentNamed(starship, 'Rugged Design')).toBe(1);
  });

  test('Rugged Design is not offered again as an additional talent when already granted', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();

    const isOffered = countTalentNamed(starship, 'Rugged Design') === 0;

    expect(isOffered).toBe(false);
  });
});

describe('Mission pod talent replacement rule (#345)', () => {
  test('an overlapping mission pod talent is dropped when no replacement is chosen', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();

    expect(countTalentNamed(starship, 'Rugged Design')).toBe(1);
  });

  test('an overlapping mission pod talent is replaced when a replacement is chosen', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();
    const replacement = new SelectedTalent(
      starship.getValidMissionPodReplacementTalents()[0].name,
    );

    starship.missionPodReplacements[1] = replacement;

    expect(countTalentNamed(starship, 'Rugged Design')).toBe(1);
    expect(countTalentNamed(starship, replacement.name)).toBe(1);
  });

  test('overlapping mission pod talents are identified', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();

    const overlaps = starship.getMissionPodOverlapTalents();
    expect(overlaps.map((t) => t.name)).toEqual(['Rugged Design']);
  });

  test('the replacement pool excludes already-granted talents and special rules', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();

    const pool = starship.getValidMissionPodReplacementTalents();
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.some((t) => t.name === 'Rugged Design')).toBe(false);
    expect(pool.some((t) => t.isSpecialRule(2))).toBe(false);
  });

  test('a ship with an unreplaced overlap cannot proceed until a replacement is chosen', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();
    expect(starship.hasUnreplacedMissionPodOverlaps()).toBe(true);

    starship.missionPodReplacements[1] = new SelectedTalent(
      starship.getValidMissionPodReplacementTalents()[0].name,
    );
    expect(starship.hasUnreplacedMissionPodOverlaps()).toBe(false);
  });

  test('mission pod replacements survive an encode/decode round-trip', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();
    const replacement = new SelectedTalent(
      starship.getValidMissionPodReplacementTalents()[0].name,
    );
    starship.missionPodReplacements[1] = replacement;

    const encoded = marshaller.encodeStarship(starship);
    const decoded = marshaller.decodeStarship(encoded);

    expect(decoded.missionPodModel?.name).toBe('Mobile Drydock');
    expect(decoded.missionPodReplacements?.[1]?.name).toBe(replacement.name);
  });
});
