import { test, expect, describe, afterEach, jest } from '@jest/globals';
import '../../src/helpers/species';
import { Roll20VttExporter } from '../../src/vtt/roll20VttExporter';
import {
  makePopulatedMainCharacter,
  makePopulatedStarship,
} from './vttFixtures';

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

beforeEach(() => {
  jest.spyOn(Math, 'random').mockReturnValue(0.7);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Roll20 JSON export golden output', () => {
  test('exports a fully-populated 2e character', () => {
    const result = Roll20VttExporter.instance.exportCharacter(
      makePopulatedMainCharacter(2),
    );
    expect(JSON.stringify(result, null, 4)).toMatchSnapshot();
  });

  test('exports a fully-populated 2e starship', () => {
    const result = Roll20VttExporter.instance.exportStarship(
      makePopulatedStarship(),
    );
    expect(JSON.stringify(result, null, 4)).toMatchSnapshot();
  });

  test('exports a fully-populated 2e starship as a handout', () => {
    const result = Roll20VttExporter.instance.exportStarshipAsHandout(
      makePopulatedStarship(),
    );
    expect(JSON.stringify(result, null, 4)).toMatchSnapshot();
  });
});

describe('Roll20 export known divergences', () => {
  test('uses the misspelled "communcation" attrib key', () => {
    const result: any = Roll20VttExporter.instance.exportStarship(
      makePopulatedStarship(),
    );
    const attribNames = result.character.attribs.map((a) => a.name);
    expect(attribNames).toEqual(expect.arrayContaining(['ship_communcation']));
    expect(attribNames).not.toContain('ship_communications');
  });
});
