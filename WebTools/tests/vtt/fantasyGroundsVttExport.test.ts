import { test, expect, describe } from '@jest/globals';
import '../../src/helpers/species';
import { FantasyGroundsVttExporter } from '../../src/vtt/fantasyGroundsVttExport';
import { makePopulatedMainCharacter, makePopulatedNpc } from './vttFixtures';
import { CharacterAdvancementStep } from '../../src/common/character';
import { CharacterAdvancementChoice } from '../../src/modify/model/characterAdvancementChoice';
import { SelectedTalent } from '../../src/common/selectedTalent';

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
    const result = FantasyGroundsVttExporter.instance.exportCharacter(
      makePopulatedMainCharacter(2),
    );
    expect(result).toMatchSnapshot();
  });

  test('exports a fully-populated NPC', () => {
    const result =
      FantasyGroundsVttExporter.instance.exportCharacter(makePopulatedNpc());
    expect(result).toMatchSnapshot();
  });

  test('puts the rank into the main-character talent name and multiple field', () => {
    const character = makePopulatedMainCharacter(2);
    const advancement = (talentName: string) => {
      const step = new CharacterAdvancementStep();
      step.choice = CharacterAdvancementChoice.Talent;
      step.value = new SelectedTalent(talentName);
      return step;
    };
    character.improvements = [
      advancement('Personal Effects'),
      advancement('Personal Effects'),
    ];

    const result =
      FantasyGroundsVttExporter.instance.exportCharacter(character);

    expect(result).toContain(
      '<name type="string">Personal Effects [x2]</name>',
    );
    expect(result).toContain('<multiple type="number">2</multiple>');
    expect(result).toContain('<name type="string">Advisor</name>');
    expect(result).not.toContain('<name type="string">Advisor [x1]</name>');
  });

  test('puts the rank into the NPC talent name', () => {
    const character = makePopulatedNpc();
    character.npcGenerationStep!.talents = [
      new SelectedTalent('Personal Effects'),
      new SelectedTalent('Personal Effects'),
    ];

    const result =
      FantasyGroundsVttExporter.instance.exportCharacter(character);

    expect(result).toContain(
      '<name type="string">Personal Effects [x2]</name>',
    );
  });
});
