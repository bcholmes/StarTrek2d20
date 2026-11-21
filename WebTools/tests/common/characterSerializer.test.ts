import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import i18next from 'i18next';

jest.mock('../../src/state/store', () => ({
  store: {
    getState: jest.fn(() => ({
      context: {
        sources: [1],
        era: 5,
      },
    })),
  },
}));

import '../../src/helpers/species';
import { Character } from '../../src/common/character';
import { CharacterSerializer } from '../../src/common/characterSerializer';
import { CharacterType } from '../../src/common/characterType';
import { Environment } from '../../src/helpers/environments';
import { Species } from '../../src/helpers/speciesEnum';
import translations from '../../src/i18n/locales/en/translations.json';

beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    resources: { en: { translation: translations } },
  });
});

describe('CharacterSerializer', () => {
  describe('serializeName', () => {
    test('returns name for non-Klingon character', () => {
      const character = new Character();
      character.type = CharacterType.Starfleet;
      character.name = 'James Kirk';

      expect(CharacterSerializer.serializeName(character)).toBe('James Kirk');
    });

    test('returns name for Klingon character with no lineage or house', () => {
      const character = new Character();
      character.type = CharacterType.KlingonWarrior;
      character.name = 'Worf';

      expect(CharacterSerializer.serializeName(character)).toBe('Worf');
    });

    test('includes lineage for Klingon character', () => {
      const character = new Character();
      character.type = CharacterType.KlingonWarrior;
      character.name = 'Worf';
      character.lineage = 'son of Mogh';

      expect(CharacterSerializer.serializeName(character)).toBe(
        'Worf, son of Mogh',
      );
    });

    test('formats house starting with "House of "', () => {
      const character = new Character();
      character.type = CharacterType.KlingonWarrior;
      character.name = 'Worf';
      character.house = 'House of Martok';

      expect(CharacterSerializer.serializeName(character)).toBe(
        'Worf, of the House of Martok',
      );
    });

    test('formats house starting with "House "', () => {
      const character = new Character();
      character.type = CharacterType.KlingonWarrior;
      character.name = 'Worf';
      character.house = 'House Martok';

      expect(CharacterSerializer.serializeName(character)).toBe(
        'Worf, of House Martok',
      );
    });

    test('formats house without house prefix', () => {
      const character = new Character();
      character.type = CharacterType.KlingonWarrior;
      character.name = 'Worf';
      character.house = 'Martok';

      expect(CharacterSerializer.serializeName(character)).toBe('Worf, Martok');
    });

    test('includes lineage and formatted house', () => {
      const character = new Character();
      character.type = CharacterType.KlingonWarrior;
      character.name = 'Worf';
      character.lineage = 'son of Mogh';
      character.house = 'House of Martok';

      expect(CharacterSerializer.serializeName(character)).toBe(
        'Worf, son of Mogh, of the House of Martok',
      );
    });
  });

  describe('serializeSpecies', () => {
    test('returns empty string when primary species is null', () => {
      expect(CharacterSerializer.serializeSpecies(null, null)).toBe('');
    });

    test('returns primary species name', () => {
      expect(CharacterSerializer.serializeSpecies(Species.Human, null)).toBe(
        'Human',
      );
    });

    test('returns mixed species name', () => {
      expect(
        CharacterSerializer.serializeSpecies(Species.Human, Species.Vulcan),
      ).toBe('Human/Vulcan');
    });
  });

  describe('serializeEnvironment', () => {
    test('returns undefined when environment is null', () => {
      const character = new Character();

      expect(
        CharacterSerializer.serializeEnvironment(null, null, character),
      ).toBeUndefined();
    });

    test('returns environment name', () => {
      const character = new Character();

      expect(
        CharacterSerializer.serializeEnvironment(
          Environment.Homeworld,
          null,
          character,
        ),
      ).toBe('Homeworld');
    });

    test('interpolates another species world', () => {
      const character = new Character();

      expect(
        CharacterSerializer.serializeEnvironment(
          Environment.AnotherSpeciesWorld,
          Species.Vulcan,
          character,
        ),
      ).toBe("Another Species' World (Vulcan)");
    });

    test('returns base name for another species world without other species', () => {
      const character = new Character();

      expect(
        CharacterSerializer.serializeEnvironment(
          Environment.AnotherSpeciesWorld,
          null,
          character,
        ),
      ).toBe("Another Species' World");
    });
  });
});
