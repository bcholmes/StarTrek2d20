import { describe, expect, jest, test } from '@jest/globals';
import { PDFDocument, StandardFonts } from '@cantoo/pdf-lib';
import '../../src/helpers/species';
import { Character } from '../../src/common/character';
import { CharacterType } from '../../src/common/characterType';
import { Starship } from '../../src/common/starship';
import { Era } from '../../src/helpers/erasEnum';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { Attribute } from '../../src/helpers/attributes';
import { Department } from '../../src/helpers/department';
import { System } from '../../src/helpers/systems';
import {
  TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_BOLD,
  TALENT_NAME_COLLABORATION,
  TALENT_NAME_DEDICATED_PERSONNEL,
  TALENT_NAME_EXPANSIVE_DEPARTMENT,
  TALENT_NAME_EXTRAORDINARY_ATTRIBUTE_X,
  TALENT_NAME_REDUNDANT_SYSTEMS,
  TALENT_NAME_WARRIORS_SPIRIT,
  TalentsHelper,
} from '../../src/helpers/talents';
import { PropulsionSystemType } from '../../src/helpers/propulsionSystem';
import { SpecialWeapon } from '../../src/common/specialWeapon';
import { CharacterSerializer } from '../../src/common/characterSerializer';
import {
  assembleStarshipTalents,
  assembleWritableItems,
  BasicGeneratedSheet,
} from '../../src/exportpdf/generatedsheet';
import { ReadableTalentModel } from '../../src/exportpdf/talentWriter';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

jest.mock('../../src/state/store', () => ({
  store: {
    getState: () => ({ context: { sources: [1] } }),
    dispatch: () => undefined,
  },
}));

class TestSheet extends BasicGeneratedSheet {
  getName() {
    return 'Test';
  }
  getThumbnailUrl() {
    return '/thumb.png';
  }
  getPdfUrl() {
    return '/sheet.pdf';
  }
}

describe('generatedsheet', () => {
  test('createFileName sanitizes names and falls back', () => {
    const sheet = new TestSheet();
    expect(sheet.createFileName('sheet', { name: '' } as any)).toBe(
      'sheet.pdf',
    );
    expect(sheet.createFileName('sheet', { name: 'A/B C\\D' } as any)).toBe(
      'A_B_C_D-sheet.pdf',
    );
  });

  test('determineIdealFontWidth reduces font size when needed', async () => {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const sheet = new TestSheet();

    const size = sheet.determineIdealFontWidth(
      ['A very long line that should not fit'],
      20,
      12,
      6,
      font,
    );

    expect(size).toBeLessThan(12);
    expect(size).toBeGreaterThanOrEqual(6);
  });

  test('assembleWritableItems includes role models', () => {
    const character = Character.createMainCharacter(
      CharacterType.Starfleet,
      Era.NextGeneration,
      2,
    );
    character.role = 1;
    character.secondaryRole = 2;

    const items = assembleWritableItems(character) as any[];
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((i) => !(i instanceof ReadableTalentModel))).toBe(true);
  });

  test('assembleStarshipTalents captures starship talent selections', () => {
    const starship = Starship.createStandardStarship(
      Era.NextGeneration,
      CharacterType.Starfleet,
      2,
    );
    const redundant = new SelectedTalent(TALENT_NAME_REDUNDANT_SYSTEMS);
    redundant.selection = 'Backup';
    redundant.system = System.Engines;
    const propulsion = new SelectedTalent(
      TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
    );
    propulsion.selection = PropulsionSystemType.QuantumSlipstreamDrive;
    const dedicated = new SelectedTalent(TALENT_NAME_DEDICATED_PERSONNEL);
    dedicated.department = Department.Engineering;
    const expansive = new SelectedTalent(TALENT_NAME_EXPANSIVE_DEPARTMENT);
    expansive.department = Department.Medicine;
    starship.additionalTalents = [redundant, propulsion, dedicated, expansive];

    const items = assembleStarshipTalents(
      starship,
      false,
    ) as ReadableTalentModel[];
    const byName = Object.fromEntries(items.map((i) => [i.talent.name, i]));
    expect(byName[TALENT_NAME_REDUNDANT_SYSTEMS].selection).toBe('Backup');
    expect(byName[TALENT_NAME_REDUNDANT_SYSTEMS].system).toBe(System.Engines);
    expect(byName[TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM].selection).toBe(
      PropulsionSystemType.QuantumSlipstreamDrive,
    );
    expect(byName[TALENT_NAME_DEDICATED_PERSONNEL].departments).toEqual([
      Department.Engineering,
    ]);
  });
});
