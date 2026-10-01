import { test, expect, describe, jest } from '@jest/globals';
import '../../../src/helpers/species';
import { SpaceframeHelper } from '../../../src/helpers/spaceframes';
import { Spaceframe } from '../../../src/helpers/spaceframeEnum';

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

jest.mock('../../../src/state/store', () => {
  const core2ndEdition = 1; // Source.Core2ndEdition
  return {
    store: {
      getState: () => ({ context: { sources: [core2ndEdition] } }),
      dispatch: () => undefined,
    },
  };
});

function talentNames(serviceYear?: number) {
  const model = SpaceframeHelper.instance().getSpaceframe(Spaceframe.Intrepid);
  return model.talentsEffectiveForDate(serviceYear).map((t) => t.name);
}

describe('SpaceframeModel.talentsEffectiveForDate', () => {
  test('includes the Emergency Medical Hologram talent for a pre-2380 service year', () => {
    expect(talentNames(2371)).toContain('Emergency Medical Hologram');
  });

  test('excludes the Emergency Medical Hologram talent for a post-2380 service year', () => {
    expect(talentNames(2400)).not.toContain('Emergency Medical Hologram');
  });

  test('keeps talents without a maximum service year for a post-2380 service year', () => {
    const names = talentNames(2400);
    expect(names).toContain('Improved Warp Drive');
    expect(names).toContain('Advanced Sensor Suites');
  });
});
