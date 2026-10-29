import { test, expect, describe, jest } from '@jest/globals';
import '../../src/helpers/species';
import { SpeciesHelper } from '../../src/helpers/species';
import { CharacterType } from '../../src/common/characterType';
import { Species } from '../../src/helpers/speciesEnum';
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

jest.mock('../../src/state/store', () => {
  const core2ndEdition = 1;
  const enterpriseEra = 0;
  return {
    store: {
      getState: () => ({ context: { sources: [core2ndEdition], era: enterpriseEra } }),
      dispatch: () => undefined,
    },
  };
});

describe('SpeciesHelper', () => {
  test('getAllSpecies returns species', () => {
    const all = SpeciesHelper.getAllSpecies();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  test('getSpecies returns species for character types', () => {
    const starfleet = SpeciesHelper.getSpecies(CharacterType.Starfleet);
    const civilian = SpeciesHelper.getSpecies(CharacterType.Civilian);
    const klingonWarrior = SpeciesHelper.getSpecies(CharacterType.KlingonWarrior);
    expect(Array.isArray(starfleet)).toBe(true);
    expect(Array.isArray(civilian)).toBe(true);
    expect(Array.isArray(klingonWarrior)).toBe(true);
    expect(starfleet.length).toBeGreaterThan(0);
  });

  test('getSpeciesByType and getSpeciesByName', () => {
    const model = SpeciesHelper.getSpeciesByType(Species.Human);
    expect(model).toBeDefined();
    expect(model?.id).toBe(Species.Human);

    const byName = SpeciesHelper.getSpeciesByName('Human');
    expect(byName).toBeDefined();

    const bad = SpeciesHelper.getSpeciesByName('NotARealSpeciesXYZ123');
    expect(bad).toBeUndefined();
  });

  test('getSpeciesTypeByName', () => {
    const type = SpeciesHelper.getSpeciesTypeByName('Human');
    expect(typeof type).toBe('number');
  });

  test('getCaptainsLogSpecies', () => {
    const captainsLog = SpeciesHelper.getCaptainsLogSpecies();
    expect(Array.isArray(captainsLog)).toBe(true);
  });

  test('generateFromGammaQuadrantTable and generateFromDeltaQuadrantTable', () => {
    const gamma = SpeciesHelper.generateFromGammaQuadrantTable();
    const delta = SpeciesHelper.generateFromDeltaQuadrantTable();
    expect(gamma === null || typeof gamma === 'number').toBe(true);
    expect(delta === null || typeof delta === 'number').toBe(true);
  });

  test('generateRandomSpeciesForQuadrant', () => {
    const result = SpeciesHelper.generateRandomSpeciesForQuadrant(Source.GammaQuadrant);
    expect(result === null || typeof result === 'number').toBe(true);
  });
});
