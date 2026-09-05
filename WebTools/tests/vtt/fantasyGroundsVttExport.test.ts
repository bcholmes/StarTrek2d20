import { test, expect, describe } from '@jest/globals';
import '../../src/helpers/species';
import { FantasyGroupsVttExporter } from '../../src/vtt/fantasyGroundsVttExport';
import { makePopulatedMainCharacter, makePopulatedNpc } from './vttFixtures';

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

describe('FantasyGrounds XML export golden output', () => {
  test('exports a fully-populated 2e main character', () => {
    const result = FantasyGroupsVttExporter.instance.exportCharacter(
      makePopulatedMainCharacter(2),
    );
    expect(result).toMatchSnapshot();
  });

  test('exports a fully-populated NPC', () => {
    const result =
      FantasyGroupsVttExporter.instance.exportCharacter(makePopulatedNpc());
    expect(result).toMatchSnapshot();
  });
});
