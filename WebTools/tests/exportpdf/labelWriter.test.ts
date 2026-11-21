import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import { PDFDocument, StandardFonts } from '@cantoo/pdf-lib';
import i18next from 'i18next';
import { Column } from '../../src/exportpdf/column';
import { SimpleColor } from '../../src/common/colour';
import {
  labelWriter,
  simpleLabelWriter,
  VerticalAlignment,
} from '../../src/exportpdf/labelWriter';
import { TextAlign } from '../../src/exportpdf/textAlign';
import translations from '../../src/i18n/locales/en/translations.json';

beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    resources: { en: { translation: translations } },
  });
});

const createPage = async () => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([600, 800]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  return { page, font };
};

describe('labelWriter', () => {
  test('writes labels with default colour, alignment, and suffix', async () => {
    const { page, font } = await createPage();
    const drawText = jest.spyOn(page, 'drawText');
    const locations = {
      'Construct.other.attributes': new Column(10, 20, 500, 100),
    };

    labelWriter(page, locations, 2, font, 12);

    expect(drawText).toHaveBeenCalledTimes(1);
    const [text, options] = drawText.mock.calls[0];
    expect(text).toBe(
      i18next.t('Construct.other.attributes').toLocaleUpperCase(),
    );
    expect(options.x).toBe(10);
    expect(options.size).toBe(12);
  });

  test('uses version-specific labels and colour provider', async () => {
    const { page, font } = await createPage();
    const drawText = jest.spyOn(page, 'drawText');
    const colour = SimpleColor.from('#123456');
    const locations = {
      'Construct.other.departments': new Column(10, 20, 500, 100),
      'Construct.other.protection': new Column(10, 40, 500, 100),
    };

    labelWriter(
      page,
      locations,
      1,
      font,
      12,
      () => colour,
      TextAlign.Right,
      ':',
    );

    const texts = drawText.mock.calls.map((c) => c[0]);
    expect(texts).toContain(
      i18next.t('Construct.other.disciplines').toLocaleUpperCase() + ':',
    );
    expect(texts).toContain(
      i18next.t('Construct.other.resistance').toLocaleUpperCase() + ':',
    );
    drawText.mock.calls.forEach((call) => {
      expect(call[1].color).toEqual(colour.asPdfRbg());
      expect(call[1].x).toBeLessThan(500);
    });
  });

  test('shrinks and truncates labels that do not fit', async () => {
    const { page, font } = await createPage();
    const drawText = jest.spyOn(page, 'drawText');
    const locations = {
      'Construct.other.characterRole': new Column(10, 20, 35, 20),
    };

    labelWriter(page, locations, 2, font, 12);

    const [text, options] = drawText.mock.calls[0];
    expect(text.endsWith('...')).toBe(true);
    expect(options.size).toBeLessThanOrEqual(12);
    expect(font.widthOfTextAtSize(text, options.size)).toBeLessThanOrEqual(
      25.01,
    );
  });

  test('simpleLabelWriter supports centre and middle alignment', async () => {
    const { page, font } = await createPage();
    const drawText = jest.spyOn(page, 'drawText');
    const column = new Column(100, 100, 80, 200);
    const colour = SimpleColor.from('#abcdef');

    simpleLabelWriter(
      page,
      'TEST',
      column,
      font,
      12,
      colour,
      TextAlign.Centre,
      VerticalAlignment.Middle,
    );

    const [, options] = drawText.mock.calls[0];
    const width = font.widthOfTextAtSize('TEST', 12);
    expect(options.x).toBeCloseTo(100 + (200 - width) / 2);
    expect(options.y).toBeGreaterThan(page.getHeight() - 180);
  });
});
