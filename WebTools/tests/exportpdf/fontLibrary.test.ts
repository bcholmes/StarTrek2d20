import { describe, expect, jest, test } from '@jest/globals';
import { PDFDocument, StandardFonts } from '@cantoo/pdf-lib';
import { FontLibrary, FontType } from '../../src/exportpdf/fontLibrary';

describe('FontLibrary', () => {
  test('returns added fonts by type', async () => {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const library = new FontLibrary();

    library.addFont(FontType.Standard, font);

    expect(library.fontByType(FontType.Standard)).toBe(font);
  });

  test('logs when font type is missing', () => {
    const library = new FontLibrary();
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(library.fontByType(FontType.Bold)).toBeUndefined();
    expect(log).toHaveBeenCalled();

    log.mockRestore();
  });

  test('copies initial fonts', async () => {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const library = new FontLibrary({ [FontType.Standard]: font });

    expect(library.fontByType(FontType.Standard)).toBe(font);
  });
});
