import { test, expect, describe } from '@jest/globals';
import { NameGenerator } from '../../src/npc/nameGenerator';
import type { ISpecies, NameModel } from '../../src/helpers/species';
import { Species } from '../../src/helpers/speciesEnum';

class MockSpecies implements ISpecies {
  id: Species;
  name: string;
  nameSuggestions: NameModel[] = [];

  constructor(id: Species, name: string) {
    this.id = id;
    this.name = name;
  }
}

describe('testing name generation', () => {
  test('should create name', () => {
    const { name, pronouns } = NameGenerator.instance.createName(
      new MockSpecies(Species.Human, 'Human'),
    );
    expect(name).toBeDefined();
    expect(pronouns).toBeDefined();
  });

  test('should create female name', () => {
    for (let i = 100; i >= 0; i--) {
      const { name, pronouns } = NameGenerator.instance.createName(
        new MockSpecies(Species.Human, 'Human'),
        'Female',
      );
      expect(name).toBeDefined();
      expect(pronouns).toBe('she/her');
    }
  });

  test('should create Borg name', () => {
    const name = NameGenerator.instance.createBorgName().split(' ');
    expect(Number(name[0])).toBeGreaterThan(0);
    expect(Number(name[2])).toBeGreaterThan(0);
    expect(Number(name[0])).toBeLessThanOrEqual(Number(name[2]));
  });

  test('should create male name', () => {
    for (let i = 100; i >= 0; i--) {
      const { name, pronouns } = NameGenerator.instance.createName(
        new MockSpecies(Species.Human, 'Human'),
        'Male',
      );
      expect(name).toBeDefined();
      expect(pronouns).toBe('he/him');
    }
  });

  test('is not supported for custom species', () => {
    expect(NameGenerator.instance.isSupported(undefined)).toBeFalsy();
  });

  test('is supported for human', () => {
    const result = NameGenerator.instance.isSupported(
      new MockSpecies(Species.Human, 'Human'),
    );
    expect(result).toBeTruthy();
  });

  test('should create Vulcan name', () => {
    const { name } = NameGenerator.instance.createName(
      new MockSpecies(Species.Vulcan, 'Vulcan'),
    );
    expect(name.indexOf(' ') >= 0).toBeFalsy();
  });
});
