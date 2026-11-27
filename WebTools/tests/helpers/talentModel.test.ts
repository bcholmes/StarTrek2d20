import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { Character } from '../../src/common/character';
import { Starship } from '../../src/common/starship';
import { AliasModel } from '../../src/helpers/aliases';
import {
  AllOfPrerequisite,
  AnyOfPrerequisite,
  AnySpeciesPrerequisite,
  MainCharacterPrerequisite,
  NeverPrerequisite,
  ServiceYearPrerequisite,
  SourcePrerequisite,
  SpeciesPrerequisite,
} from '../../src/helpers/prerequisite';
import { NotSourcePrerequisite } from '../../src/helpers/spaceframes';
import { Species } from '../../src/helpers/speciesEnum';
import { Source } from '../../src/helpers/sources';
import { MaxServiceYearPrerequisite } from '../../src/helpers/talents';
import {
  TalentCategorization,
  TalentCategory,
} from '../../src/helpers/talentCategory';
import { TalentModel } from '../../src/helpers/talentModel';
import { hasAnySource } from '../../src/state/contextFunctions';
import { store } from '../../src/state/store';

const mockTranslations: Record<string, string> = {};
let sourceState: Source[] = [Source.Core];

jest.mock('i18next', () => {
  const mockI18n: any = (key: string) => key;
  mockI18n.t = (key: string) => mockTranslations[key] ?? key;
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

jest.mock('../../src/state/store', () => ({
  store: {
    getState: jest.fn(() => ({
      context: {
        sources: sourceState,
        allowCrossSpeciesTalents: false,
      },
    })),
    dispatch: jest.fn(),
  },
}));

jest.mock('../../src/state/contextFunctions', () => ({
  hasAnySource: jest.fn(),
  hasSource: jest.fn(),
}));

const hasAnySourceMock = jest.mocked(hasAnySource);

const setTranslations = (translations: Record<string, string>) => {
  Object.entries(translations).forEach(([key, value]) => {
    mockTranslations[key] = value;
  });
};

describe('TalentModel', () => {
  beforeEach(() => {
    sourceState = [Source.Core];
    hasAnySourceMock.mockReturnValue(false);
  });

  afterEach(() => {
    hasAnySourceMock.mockReset();
    jest.restoreAllMocks();
    Object.keys(mockTranslations).forEach(
      (key) => delete mockTranslations[key],
    );
  });

  describe('constructor and special rules', () => {
    test('applies constructor defaults', () => {
      const talent = new TalentModel('Commanding', 'Base description', []);

      expect(talent.name).toBe('Commanding');
      expect(talent.maxRank).toBe(1);
      expect(talent.aliases).toEqual([]);
      expect(talent.category).toBeInstanceOf(TalentCategorization);
      expect(talent.category.category).toBe(TalentCategory.General);
      expect(talent.isSpecialRule(1)).toBe(false);
    });

    test('wraps boolean and function special rules', () => {
      const always = new TalentModel(
        'Always Special',
        '',
        [],
        2,
        new TalentCategorization(TalentCategory.General),
        true,
      );
      const secondEditionOnly = new TalentModel(
        'Second Edition Only',
        '',
        [],
        1,
        new TalentCategorization(TalentCategory.General),
        (version) => version === 2,
      );

      expect(always.maxRank).toBe(2);
      expect(always.isSpecialRule(1)).toBe(true);
      expect(always.isSpecialRule(2)).toBe(true);
      expect(secondEditionOnly.isSpecialRule(1)).toBe(false);
      expect(secondEditionOnly.isSpecialRule(2)).toBe(true);
    });

    test('maps a species name into a talent categorization', () => {
      const talent = new TalentModel('Vulcan Ability', '', [], 1, 'Vulcan');

      expect(talent.category.category).toBe(TalentCategory.Species);
      expect(talent.category.type).toEqual([Species.Vulcan]);
    });

    test('logs an unmapped category string', () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      const talent = new TalentModel('Unknown Category', '', [], 1, 'General');

      expect(log).toHaveBeenCalledWith('Talent category General');
      expect((talent as any).category).toBeUndefined();
    });

    test('identifies starship and starbase categorizations', () => {
      const starship = new TalentModel(
        'Starship Talent',
        '',
        [],
        1,
        new TalentCategorization(TalentCategory.Starship),
      );
      const starbase = new TalentModel(
        'Starbase Talent',
        '',
        [],
        1,
        new TalentCategorization(TalentCategory.Starbase),
      );

      expect(starship.isStarshipTalent).toBe(true);
      expect(starship.isStarbaseTalent).toBe(false);
      expect(starbase.isStarshipTalent).toBe(false);
      expect(starbase.isStarbaseTalent).toBe(true);
    });

    test('supports raw string categories assigned after construction', () => {
      const starship = new TalentModel('Raw Starship', '', []) as any;
      starship.category = 'Starship';
      const starbase = new TalentModel('Raw Starbase', '', []) as any;
      starbase.category = 'Starbase';

      expect(starship.isStarshipTalent).toBe(true);
      expect(starbase.isStarbaseTalent).toBe(true);
    });
  });

  describe('localization', () => {
    test('falls back to raw values when translations are missing', () => {
      const talent = new TalentModel('Commanding', 'Base description', []);

      expect(talent.rootKey).toBe('commanding');
      expect(talent.localizedName).toBe('Commanding');
      expect(talent.localizedDisplayName).toBe('Commanding');
      expect(talent.localizedDescription).toBe('Base description');
      expect(talent.localizedDescription2e).toBe('Base description');
      expect(talent.localizedSoloDescription).toBe('');
      expect(talent.is2eDescriptionPresent).toBe(false);
    });

    test('uses translated values when available', () => {
      setTranslations({
        'Talent.commanding': 'Kommandierend',
        'Talent.commanding.description': 'Translated description',
        'Talent.commanding.description2e': 'Second edition description',
        'Talent.commanding.soloDescription': 'Short description',
      });
      const talent = new TalentModel('Commanding', 'Base description', []);

      expect(talent.localizedName).toBe('Kommandierend');
      expect(talent.localizedDisplayName).toBe('Kommandierend');
      expect(talent.localizedDescription).toBe('Translated description');
      expect(talent.localizedDescription2e).toBe('Second edition description');
      expect(talent.localizedSoloDescription).toBe('Short description');
      expect(talent.is2eDescriptionPresent).toBe(true);
    });

    test('normalizes root keys from punctuation', () => {
      expect(new TalentModel('Command / Control-Systems', '', []).rootKey).toBe(
        'commandControlSystems',
      );
      expect(new TalentModel('Captain’s Fury', '', []).rootKey).toBe(
        'captainsFury',
      );
      expect(new TalentModel('2230', '', []).rootKey).toBe('2230');
    });

    test('strips category suffixes from display names', () => {
      const objectSuffix = new TalentModel(
        'Advanced Fire Control ([object Object])',
        '',
        [],
      );
      const rawCategory = new TalentModel(
        'Advanced Fire Control (Starship)',
        '',
        [],
      ) as any;
      rawCategory.category = 'Starship';

      expect(objectSuffix.displayName).toBe('Advanced Fire Control');
      expect(rawCategory.displayName).toBe('Advanced Fire Control');
      expect(new TalentModel('Advanced Fire Control', '', []).displayName).toBe(
        'Advanced Fire Control',
      );
    });

    test('strips a category suffix from a fallback localized display name', () => {
      const talent = new TalentModel(
        'Advanced Fire Control (Starship)',
        '',
        [],
      ) as any;
      talent.category = 'Starship';

      expect(talent.localizedDisplayName).toBe('Advanced Fire Control');
    });

    test('returns a translated display name without suffix stripping', () => {
      setTranslations({
        'Talent.advancedFireControl': 'Advanced Fire Control (Starship)',
      });
      const talent = new TalentModel('Advanced Fire Control', '', []);

      expect(talent.localizedDisplayName).toBe(
        'Advanced Fire Control (Starship)',
      );
    });

    test('localizes the category and throws for an unmapped category', () => {
      setTranslations({ 'TalentCategory.general': 'General' });
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      const invalid = new TalentModel('Invalid', '', [], 1, 'General');

      expect(
        new TalentModel('Commanding', '', []).localizedCategoryString,
      ).toBe('General');
      expect(() => invalid.localizedCategoryString).toThrow(TypeError);
      expect(log).toHaveBeenCalledWith('Talent category General');
    });
  });

  describe('names and aliases', () => {
    test('normalizes bracketed names for X qualification', () => {
      const qualified = new TalentModel(
        'Tactical Officer X (Starship)',
        '',
        [],
      );

      expect(qualified.nameWithoutBracketedPart).toBe('Tactical Officer X');
      expect(qualified.isXQualified).toBe(true);
      expect(new TalentModel('Tactical Officer', '', []).isXQualified).toBe(
        false,
      );
    });

    test('matches raw names, aliases, and apostrophe variants', () => {
      const talent = new TalentModel(
        'Captain’s Fury',
        '',
        [],
        1,
        new TalentCategorization(TalentCategory.General),
        false,
        new AliasModel('Captain’s Wrath', Source.Core),
      );

      expect(talent.matches("Captain's Fury")).toBe(true);
      expect(talent.matches('Captain’s Wrath')).toBe(true);
      expect(talent.matches("Captain's Wrath")).toBe(true);
      expect(talent.matches('Battle Ready')).toBe(false);
    });

    test('uses the first source-specific alias and falls back to the base name', () => {
      const talent = new TalentModel(
        'Base Name',
        '',
        [],
        1,
        new TalentCategorization(TalentCategory.General),
        false,
        new AliasModel('Core Name', Source.Core),
        new AliasModel('Second Name', Source.Core2ndEdition),
        new AliasModel('Duplicate Name', Source.Core2ndEdition),
      );

      expect(talent.nameForSource(Source.Core2ndEdition)).toBe('Second Name');
      expect(talent.nameForSource(Source.DS9)).toBe('Base Name');
      expect(talent.localizedNameForSource(Source.Core)).toBe('Core Name');
      expect(talent.localizedNameForSource(Source.DS9)).toBe('Base Name');
    });
  });

  describe('sources and second edition support', () => {
    test('defaults to the core source', () => {
      expect(new TalentModel('Commanding', '', []).sources).toEqual([
        Source.Core,
      ]);
      expect(store.getState).toBeDefined();
    });

    test('collects direct and nested sources without duplicates', () => {
      const talent = new TalentModel('Sourced Talent', '', [
        new SourcePrerequisite(Source.Core2ndEdition, Source.TNG),
        new AllOfPrerequisite(
          new SourcePrerequisite(Source.DS9),
          new MainCharacterPrerequisite(),
        ),
        new AnyOfPrerequisite(new SourcePrerequisite(Source.TNG)),
        new MainCharacterPrerequisite(),
      ]);

      expect(talent.sources).toEqual([
        Source.Core2ndEdition,
        Source.TNG,
        Source.DS9,
      ]);
    });

    test('deduplicates repeated direct source prerequisites', () => {
      const talent = new TalentModel('Repeated Sources', '', [
        new SourcePrerequisite(Source.Core),
        new SourcePrerequisite(Source.DS9),
      ]);

      expect(talent.sources).toEqual([Source.Core]);
    });

    test('reports second edition support from sources and descriptions', () => {
      const fromSource = new TalentModel('Second Edition Source', '', [
        new SourcePrerequisite(Source.Core2ndEdition),
      ]);
      const fromDescription = new TalentModel('Second Edition Text', '', [
        new SourcePrerequisite(Source.Core),
      ]);

      expect(fromSource.is2eSupported).toBe(true);
      expect(fromDescription.is2eSupported).toBe(false);

      setTranslations({ 'Talent.secondEditionText.description2e': '2E text' });
      expect(fromDescription.is2eSupported).toBe(true);
    });
  });

  describe('prerequisites', () => {
    test('skips species prerequisites when checking character availability', () => {
      const talent = new TalentModel('Species Talent', '', [
        new SpeciesPrerequisite(Species.Vulcan),
        new AnySpeciesPrerequisite(false, Species.Vulcan),
        new MainCharacterPrerequisite(),
      ]);

      expect(talent.isAvailableExcludingSpecies(new Character())).toBe(true);
    });

    test('blocks character availability for non-species failures', () => {
      const talent = new TalentModel('Blocked Talent', '', [
        new SpeciesPrerequisite(Species.Vulcan),
        new NeverPrerequisite(),
      ]);

      expect(talent.isAvailableExcludingSpecies(new Character())).toBe(false);
    });

    test('does not skip species prerequisites nested in composites', () => {
      const talent = new TalentModel('Nested Species Talent', '', [
        new AnyOfPrerequisite(new SpeciesPrerequisite(Species.Vulcan)),
      ]);

      expect(talent.isAvailableExcludingSpecies(new Character())).toBe(false);
    });

    test('checks only service year prerequisites for starships', () => {
      const starship = new Starship();
      starship.serviceYear = 2350;
      const talent = new TalentModel('Service Year Talent', '', [
        new ServiceYearPrerequisite(2350),
        new MaxServiceYearPrerequisite(2400),
        new NeverPrerequisite(),
      ]);

      expect(talent.isAvailableForServiceYear(starship)).toBe(true);

      starship.serviceYear = 2349;
      expect(talent.isAvailableForServiceYear(starship)).toBe(false);

      starship.serviceYear = 2401;
      expect(talent.isAvailableForServiceYear(starship)).toBe(false);
    });

    test('evaluates all prerequisites generically', () => {
      const character = new Character();
      const empty = new TalentModel('Empty', '', []);
      const mainCharacter = new TalentModel('Main Character', '', [
        new MainCharacterPrerequisite(),
      ]);
      const impossible = new TalentModel('Impossible', '', [
        new NeverPrerequisite(),
      ]);
      const composite = new TalentModel('Composite', '', [
        new AnyOfPrerequisite(
          new MainCharacterPrerequisite(),
          new NeverPrerequisite(),
        ),
        new AllOfPrerequisite(new MainCharacterPrerequisite()),
      ]);

      expect(empty.isPrerequisiteFulfilled(character)).toBe(true);
      expect(mainCharacter.isPrerequisiteFulfilled(character)).toBe(true);
      expect(impossible.isPrerequisiteFulfilled(character)).toBe(false);
      expect(composite.isPrerequisiteFulfilled(character)).toBe(true);
    });

    test('checks source prerequisites against the current source selection', () => {
      const talent = new TalentModel('Source Talent', '', [
        new SourcePrerequisite(Source.Core),
      ]);
      const character = new Character();

      expect(talent.isSourcePrerequisiteFulfilled(character)).toBe(true);

      sourceState = [Source.DS9];
      expect(talent.isSourcePrerequisiteFulfilled(character)).toBe(false);
    });

    test('checks not-source prerequisites only for starships', () => {
      const talent = new TalentModel('Not Source Talent', '', [
        new NotSourcePrerequisite(Source.Core),
      ]);

      expect(talent.isSourcePrerequisiteFulfilled(new Starship())).toBe(true);

      hasAnySourceMock.mockReturnValue(true);
      expect(talent.isSourcePrerequisiteFulfilled(new Starship())).toBe(false);
      expect(talent.isSourcePrerequisiteFulfilled(new Character())).toBe(true);
    });

    test('assembles non-empty prerequisite descriptions', () => {
      const empty = new TalentModel('Empty Requirement', '', []);
      const single = new TalentModel('Single Requirement', '', [
        new MainCharacterPrerequisite(),
      ]);
      const multiple = new TalentModel('Multiple Requirements', '', [
        new MainCharacterPrerequisite(),
        new ServiceYearPrerequisite(2400),
        new NeverPrerequisite(),
      ]);

      expect(empty.requirement).toBeUndefined();
      expect(single.requirement).toBe('Main Character only');
      expect(multiple.requirement).toBe('Main Character only, 2400 or later');
    });
  });
});
