import { test, expect, describe, jest } from '@jest/globals';
import '../../src/helpers/species';
import { SelectedTalent } from '../../src/common/selectedTalent';
import {
  Weapon,
  WeaponType,
  MineTypeModel,
  TorpedoLoadTypeModel,
} from '../../src/helpers/weapons';
import { determineSelectedTalentExtraErrors } from '../../src/common/selectedTalentExtraCheck';

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
  const core2ndEdition = 1; // Source.Core2ndEdition
  return {
    store: {
      getState: () => ({ context: { sources: [core2ndEdition] } }),
      dispatch: () => undefined,
    },
  };
});

const createMineWeapon = () =>
  Weapon.createStarshipWeapon(
    'Mine',
    WeaponType.MINE,
    MineTypeModel.allTypes(1)[0],
  );

const createTorpedoWeapon = () =>
  Weapon.createStarshipWeapon(
    'Torpedo',
    WeaponType.TORPEDO,
    TorpedoLoadTypeModel.allTypes(1)[0],
  );

const createExpandedMunitionsWithWeapon = (weapon: Weapon) => {
  const talent = new SelectedTalent('Expanded Munitions');
  talent.weapon = weapon;
  return talent;
};

describe('determineSelectedTalentExtraErrors', () => {
  describe('Expanded Munitions', () => {
    test('returns an error when no weapon has been selected', () => {
      const talent = new SelectedTalent('Expanded Munitions');
      expect(determineSelectedTalentExtraErrors(talent)).toBe(
        'Talent.expandedMunitions.error',
      );
    });

    test('returns no error for a weapon selection without a construct', () => {
      const talent = createExpandedMunitionsWithWeapon(createTorpedoWeapon());
      expect(() => determineSelectedTalentExtraErrors(talent)).not.toThrow();
      expect(determineSelectedTalentExtraErrors(talent)).toBeUndefined();
    });

    test('rejects a mine weapon for a construct that is not a mine layer', () => {
      const talent = createExpandedMunitionsWithWeapon(createMineWeapon());
      const construct = { isMineLayer: false } as any;
      expect(determineSelectedTalentExtraErrors(talent, construct)).toBe(
        'Talent.expandedMunitions.errorMines',
      );
    });

    test('allows a mine weapon for a mine-layer construct', () => {
      const talent = createExpandedMunitionsWithWeapon(createMineWeapon());
      const construct = { isMineLayer: true } as any;
      expect(
        determineSelectedTalentExtraErrors(talent, construct),
      ).toBeUndefined();
    });
  });
});
