import { test, expect, describe, jest } from '@jest/globals';
import { PDFDocument, StandardFonts } from '@cantoo/pdf-lib';
import type { PDFPage } from '@cantoo/pdf-lib';
import { Line, Paragraph } from '../../src/exportpdf/paragraph';
import { XYLocation } from '../../src/common/xyLocation';
import { Column } from '../../src/exportpdf/column';
import { PageArea } from '../../src/exportpdf/pageArea';
import { TextBlock } from '../../src/exportpdf/textBlock';
import { FontSpecification } from '../../src/exportpdf/fontSpecification';
import { FontLibrary, FontType } from '../../src/exportpdf/fontLibrary';
import { FontOptions } from '../../src/exportpdf/fontOptions';
import { SimpleColor } from '../../src/common/colour';
import { TextAlign } from '../../src/exportpdf/textAlign';

const createFixture = async () => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([600, 800]);
  const fonts = new FontLibrary();
  fonts.addFont(
    FontType.Standard,
    await pdf.embedFont(StandardFonts.Helvetica),
  );
  fonts.addFont(
    FontType.Bold,
    await pdf.embedFont(StandardFonts.HelveticaBold),
  );
  fonts.addFont(
    FontType.Italic,
    await pdf.embedFont(StandardFonts.HelveticaOblique),
  );
  fonts.addFont(
    FontType.BoldItalic,
    await pdf.embedFont(StandardFonts.HelveticaBoldOblique),
  );
  fonts.addFont(FontType.Symbol, await pdf.embedFont(StandardFonts.Symbol));
  fonts.addFont(
    FontType.Heading,
    await pdf.embedFont(StandardFonts.TimesRomanBold),
  );
  return { page, fonts };
};

const textOf = (line: Line) => line.blocks.map((block) => block.text).join('');

const paragraphText = (paragraph: Paragraph) =>
  paragraph.lines.map(textOf).join('');

const standardSpecification = (fontSize: number, fonts: FontLibrary) =>
  new FontSpecification(fonts.fontByType(FontType.Standard), fontSize);

describe('Line', () => {
  test('applies indentation to its location and reports empty geometry', async () => {
    const { page } = await createFixture();
    const column = new Column(10, 20, 500, 100);
    const line = new Line(new XYLocation(10, 780), page, column, 15);

    expect(line.location).toMatchObject({ x: 25, y: 780 });
    expect(line.isEmpty()).toBe(true);
    expect(line.height()).toBe(0);
    expect(line.width).toBe(0);
    expect(line.availableWidth()).toBe(85);
    expect(line.bottom()).toMatchObject({ x: 25, y: 780 });
  });

  test('uses the tallest block for its height and sums block widths', async () => {
    const { page, fonts } = await createFixture();
    const line = new Line(
      new XYLocation(0, 780),
      page,
      new Column(0, 20, 500, 200),
    );

    line.add(TextBlock.create('small', standardSpecification(9, fonts)));
    line.add(TextBlock.create('large', standardSpecification(18, fonts)));

    expect(line.height()).toBe(line.blocks[1].height);
    expect(line.width).toBe(line.blocks[0].width + line.blocks[1].width);
  });

  test('merges consecutive blocks with identical formatting', async () => {
    const { page, fonts } = await createFixture();
    const line = new Line(
      new XYLocation(0, 780),
      page,
      new Column(0, 20, 500, 200),
    );

    line.add(TextBlock.create('A', standardSpecification(10, fonts)));
    line.append(TextBlock.create('B', standardSpecification(10, fonts)));

    expect(line.blocks).toHaveLength(1);
    expect(line.blocks[0].text).toBe('AB');
  });

  test('keeps blocks with different formatting separate', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const standard = standardSpecification(10, fonts);
    const probes = [
      TextBlock.create(
        'B',
        new FontSpecification(fonts.fontByType(FontType.Bold), 10),
      ),
      TextBlock.create(
        'B',
        new FontSpecification(fonts.fontByType(FontType.Standard), 11),
      ),
      TextBlock.create('B', standard, false, SimpleColor.from('#ff0000')),
      TextBlock.create('B', standard, 1),
      TextBlock.create('B', standard, false, undefined, true),
    ];

    probes.forEach((probe) => {
      const line = new Line(new XYLocation(0, 780), page, column);
      line.add(TextBlock.create('A', standard));
      line.append(probe);
      expect(line.blocks).toHaveLength(2);
    });
  });

  test('adds blocks individually and in bulk', async () => {
    const { page, fonts } = await createFixture();
    const line = new Line(
      new XYLocation(0, 780),
      page,
      new Column(0, 20, 500, 200),
    );

    line.addAll([
      TextBlock.create('A', standardSpecification(10, fonts)),
      TextBlock.create('B', standardSpecification(10, fonts)),
    ]);

    expect(line.blocks).toHaveLength(2);
  });

  test('creates the next line below the current line', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 0, 500, 200);
    const line = new Line(column.translatedStart(page), page, column);
    line.add(TextBlock.create('A', standardSpecification(10, fonts)));

    const next = line.nextLine();

    expect(next).not.toBeUndefined();
    expect(next.column).toBe(column);
    expect(next.location.y).toBeLessThan(line.location.y);
  });

  test('moves the next line to a following column', async () => {
    const { page } = await createFixture();
    const nextColumn = new Column(100, 0, 500, 100);
    const column = new Column(0, 0, 500, 100, nextColumn);
    const line = new Line(new XYLocation(0, 0), page, column);

    const next = line.nextLine();

    expect(next).not.toBeUndefined();
    expect(next.column).toBe(nextColumn);
    expect(next.location).toMatchObject({ x: 100, y: 800 });
  });

  test('moves the next line to a column supplied by a callback', async () => {
    const { page } = await createFixture();
    const nextColumn = new Column(100, 0, 500, 100);
    const nextArea = new PageArea(nextColumn, page);
    const column = new Column(0, 0, 500, 100, () => nextArea);
    const line = new Line(new XYLocation(0, 0), page, column);

    const next = line.nextLine();

    expect(next).not.toBeUndefined();
    expect(next.column).toBe(nextColumn);
  });

  test('returns undefined when no next line can be placed', async () => {
    const { page } = await createFixture();
    const column = new Column(0, 0, 500, 100);
    const line = new Line(new XYLocation(0, 0), page, column);

    expect(line.nextLine()).toBeUndefined();
  });

  test('writes all text blocks at increasing x positions', async () => {
    const { page, fonts } = await createFixture();
    const line = new Line(
      new XYLocation(0, 780),
      page,
      new Column(0, 20, 500, 200),
    );
    line.add(TextBlock.create('A', standardSpecification(10, fonts)));
    line.add(TextBlock.create('B', standardSpecification(10, fonts)));
    const drawText = jest.spyOn(page, 'drawText');

    line.writeTextBlocks(SimpleColor.from('#000000'));

    expect(drawText).toHaveBeenCalledTimes(2);
    const first = drawText.mock.calls[0][1];
    const second = drawText.mock.calls[1][1];
    expect(second.x).toBeCloseTo(first.x + line.blocks[0].width);
  });
});

describe('Paragraph', () => {
  test('creates from a page area and reports empty state', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const paragraph = Paragraph.create(new PageArea(column, page), fonts);

    expect(paragraph.lines).toHaveLength(0);
    expect(paragraph.startColumn).toBe(column);
    expect(paragraph.endColumn).toBe(column);
    expect(paragraph.endPage).toBe(page);
    expect(paragraph.bottom).toBe(column.start);
    expect(paragraph.spansColumns).toBe(false);
    expect(paragraph.symbolFont).toBe(fonts.fontByType(FontType.Symbol));
    expect(paragraph.nextColumn().start).toMatchObject({
      x: column.start.x,
      y: column.start.y,
    });
  });

  test('appends numbers, font specifications, and font options', async () => {
    const { page, fonts } = await createFixture();
    const paragraph = new Paragraph(page, new Column(0, 20, 500, 200), fonts);

    paragraph.append(42, new FontOptions(10));
    paragraph.append('spec', standardSpecification(12, fonts));

    expect(paragraphText(paragraph)).toBe('42 spec');
    expect(paragraph.lines[0].blocks[1].fontSize).toBe(12);
  });

  test('applies indentation to the first line', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const paragraph = new Paragraph(page, column, fonts);

    paragraph.indent(10);
    paragraph.append('text', new FontOptions(10));

    expect(paragraph.lines[0].location.x).toBe(
      column.translatedStart(page).x + 10,
    );
  });

  test('renders bold, italic, and underlined markup', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const render = (text: string) => {
      const paragraph = new Paragraph(page, column, fonts);
      paragraph.append(text, new FontOptions(10));
      return paragraph.lines[0].blocks;
    };

    const bold = render('**bold**');
    const italic = render('_italic_');
    const alternateItalic = render('*alternate*');
    const underlined = render('<u>underlined</u>');

    expect(bold[0].text).toBe('bold');
    expect(bold[0].font).toBe(fonts.fontByType(FontType.Bold));
    expect(italic[0].font).toBe(fonts.fontByType(FontType.Italic));
    expect(alternateItalic[0].font).toBe(fonts.fontByType(FontType.Italic));
    expect(underlined[0].text).toBe('underlined');
    expect(underlined[0].underlined).toBe(true);
  });

  test('combines bold and italic markup', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const render = (text: string) => {
      const paragraph = new Paragraph(page, column, fonts);
      paragraph.append(text, new FontOptions(10));
      return paragraph.lines[0].blocks;
    };

    expect(render('**_both_**')[0].font).toBe(
      fonts.fontByType(FontType.BoldItalic),
    );
    expect(render('**bold _both_**')[1].font).toBe(
      fonts.fontByType(FontType.BoldItalic),
    );
    expect(render('_**both**_')[0].font).toBe(
      fonts.fontByType(FontType.BoldItalic),
    );
    expect(render('_italic_**bold**')[0].font).toBe(
      fonts.fontByType(FontType.Italic),
    );
  });

  test('renders challenge dice with the symbol font', async () => {
    const { page, fonts } = await createFixture();
    const paragraph = new Paragraph(page, new Column(0, 20, 500, 200), fonts);

    paragraph.append('[D]', new FontOptions(10));

    expect(paragraph.lines[0].blocks[0].text).toBe('A');
    expect(paragraph.lines[0].blocks[0].font).toBe(
      fonts.fontByType(FontType.Symbol),
    );
  });

  test('wraps a challenge die onto a new line', async () => {
    const { page, fonts } = await createFixture();
    const paragraph = new Paragraph(page, new Column(0, 0, 500, 1), fonts);

    paragraph.append('[D]', new FontOptions(10));

    expect(paragraph.lines).toHaveLength(2);
    expect(paragraph.lines[1].blocks[0].text).toBe('A');
  });

  test('stops rendering when no line can hold a challenge die', async () => {
    const { page, fonts } = await createFixture();
    const paragraph = new Paragraph(page, new Column(0, 0, 10, 1), fonts);

    expect(() => paragraph.append('a', new FontOptions(10))).not.toThrow();
    expect(() => paragraph.append('[D]', new FontOptions(10))).not.toThrow();
  });

  test('wraps words onto new lines', async () => {
    const { page, fonts } = await createFixture();
    const paragraph = new Paragraph(page, new Column(0, 0, 500, 40), fonts);

    paragraph.append('alpha beta', new FontOptions(10));

    expect(paragraph.lines).toHaveLength(2);
    expect(textOf(paragraph.lines[0])).toBe('alpha');
    expect(textOf(paragraph.lines[1])).toBe('beta');
  });

  test('stops rendering when a word cannot fit on a new line', async () => {
    const { page, fonts } = await createFixture();
    const paragraph = new Paragraph(page, new Column(0, 0, 10, 1), fonts);

    expect(() => paragraph.append('a bbbb', new FontOptions(10))).not.toThrow();
  });

  test('reports whether its lines span columns', async () => {
    const { page, fonts } = await createFixture();
    const firstColumn = new Column(0, 20, 500, 100);
    const secondColumn = new Column(100, 20, 500, 100);
    const paragraph = new Paragraph(page, firstColumn, fonts);
    const firstLine = new Line(
      firstColumn.translatedStart(page),
      page,
      firstColumn,
    );

    paragraph.lines = [firstLine];
    expect(paragraph.spansColumns).toBe(false);

    paragraph.lines = [
      firstLine,
      new Line(secondColumn.translatedStart(page), page, firstColumn),
    ];
    expect(paragraph.spansColumns).toBe(false);

    paragraph.lines = [
      firstLine,
      new Line(secondColumn.translatedStart(page), page, secondColumn),
    ];
    expect(paragraph.spansColumns).toBe(true);
  });

  test('reports the columns and page of its lines', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const paragraph = new Paragraph(page, column, fonts);

    paragraph.append('text', new FontOptions(10));

    expect(paragraph.startColumn).toBe(paragraph.lines[0].column);
    expect(paragraph.endColumn).toBe(paragraph.lines[0].column);
    expect(paragraph.endPage).toBe(paragraph.lines[0].page);
  });

  test('reports the bottom of its last line', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const paragraph = new Paragraph(page, column, fonts);

    paragraph.append('text', new FontOptions(10));

    const expected = column.untranslateLocation(
      page,
      paragraph.lines[0].bottom(),
    );
    expect(paragraph.bottom).toMatchObject({
      x: expected.x,
      y: expected.y,
    });
  });

  test('returns the remaining column below the paragraph', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const paragraph = new Paragraph(page, column, fonts);

    paragraph.append('text', new FontOptions(10));
    const next = paragraph.nextColumn();

    expect(next.start.x).toBe(column.start.x);
    expect(next.start.y).toBeGreaterThan(column.start.y);
    expect(next.height).toBeLessThan(column.height);
  });

  test('returns the page area below the paragraph', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const paragraph = new Paragraph(page, column, fonts);

    paragraph.append('text', new FontOptions(10));
    const area = paragraph.nextArea(page);

    expect(area.page).toBe(page);
    expect(area.column.start.y).toBeGreaterThan(column.start.y);
  });

  test('returns the current page area when the paragraph is empty', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const paragraph = new Paragraph(page, column, fonts);

    const area = paragraph.nextArea(page);

    expect(area.page).toBe(page);
    expect(area.column).toBe(column);
  });

  test('moves to the next column when the minimum height is unavailable', async () => {
    const { page, fonts } = await createFixture();
    const nextColumn = new Column(100, 0, 500, 100);
    const column = new Column(0, 0, 50, 200, nextColumn);
    const paragraph = new Paragraph(page, column, fonts);

    paragraph.append('text', new FontOptions(10));
    const area = paragraph.nextArea(page, 1000);

    expect(area.column).toBe(nextColumn);
  });

  test('returns undefined when no area meets the minimum height', async () => {
    const { page, fonts } = await createFixture();
    const paragraph = new Paragraph(page, new Column(0, 0, 50, 200), fonts);

    paragraph.append('text', new FontOptions(10));

    expect(paragraph.nextArea(page, 1000)).toBeUndefined();
  });

  test('creates an empty paragraph when there are no lines', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const paragraph = new Paragraph(page, column, fonts);

    const next = paragraph.nextParagraph();

    expect(next).not.toBeNull();
    expect(next.lines).toHaveLength(0);
    expect(next.column).toBe(column);
    expect(next.page).toBe(page);
  });

  test('creates the next paragraph below an indented paragraph', async () => {
    const { page, fonts } = await createFixture();
    const paragraph = new Paragraph(page, new Column(0, 20, 500, 200), fonts);

    paragraph.indent(5);
    paragraph.append('text', new FontOptions(10));
    const next = paragraph.nextParagraph(1);

    expect(next).not.toBeNull();
    expect(next.indentAmount).toBe(5);
    next.append('more', new FontOptions(10));
    expect(next.lines[0].location.y).toBeLessThan(
      paragraph.lines[0].location.y,
    );
  });

  test('returns null when the next paragraph falls outside the column', async () => {
    const { page, fonts } = await createFixture();
    const paragraph = new Paragraph(page, new Column(0, 20, 500, 200), fonts);

    paragraph.lines = [
      new Line(new XYLocation(0, 0), page, new Column(10, 10, 10, 10), 0, [
        TextBlock.create('A', standardSpecification(10, fonts)),
      ]),
    ];

    expect(paragraph.nextParagraph(1)).toBeNull();
  });

  test('writes left-aligned and centred text', async () => {
    const { page, fonts } = await createFixture();
    const column = new Column(0, 20, 500, 200);
    const left = new Paragraph(page, column, fonts);
    left.append('text', new FontOptions(10));
    const drawText = jest.spyOn(page, 'drawText');

    left.write();
    const leftX = drawText.mock.calls[0][1].x;
    drawText.mockClear();

    const centred = new Paragraph(page, column, fonts);
    centred.textAlignment = TextAlign.Centre;
    centred.append('text', new FontOptions(10));
    centred.write();
    const centredX = drawText.mock.calls[0][1].x;

    expect(centredX).toBeGreaterThan(leftX);
  });
});
