import { test, expect, describe } from '@jest/globals';
import { PDFDocument } from '@cantoo/pdf-lib';
import type { PDFPage } from '@cantoo/pdf-lib';
import { Column } from '../../src/exportpdf/column';
import { PageArea } from '../../src/exportpdf/pageArea';
import { XYLocation } from '../../src/common/xyLocation';

const createPage = async (): Promise<PDFPage> => {
  const pdf = await PDFDocument.create();
  return pdf.addPage([600, 800]);
};

describe('Column', () => {
  test('stores its geometry and exposes its end point', () => {
    const column = new Column(10, 20, 100, 200);

    expect(column.start).toMatchObject({ x: 10, y: 20 });
    expect(column.height).toBe(100);
    expect(column.width).toBe(200);
    expect(column.end).toMatchObject({ x: 210, y: 120 });
    expect(column.isNextColumnAvailable).toBe(false);
  });

  test('reports whether a next column is available', async () => {
    const page = await createPage();
    const next = new Column(100, 0, 100, 100);

    expect(new Column(0, 0, 100, 100, next).isNextColumnAvailable).toBe(true);
    expect(
      new Column(0, 0, 100, 100, () => new PageArea(next, page))
        .isNextColumnAvailable,
    ).toBe(true);
  });

  test('indents and unindents its geometry', () => {
    const column = new Column(10, 20, 100, 200);

    const indented = column.indent(5);
    expect(indented.start.x).toBe(15);
    expect(indented.width).toBe(195);
    expect(indented.height).toBe(100);

    const unindented = column.unindent(5);
    expect(unindented.start.x).toBe(5);
    expect(unindented.width).toBe(205);
    expect(column.start.x).toBe(10);
    expect(column.width).toBe(200);
  });

  test('translates between column and PDF coordinates', async () => {
    const page = await createPage();
    const column = new Column(10, 20, 100, 200);

    expect(column.translatedStart(page)).toMatchObject({ x: 10, y: 780 });
    expect(
      column.untranslateLocation(page, new XYLocation(10, 780)),
    ).toMatchObject({ x: 10, y: 20 });
  });

  test('contains points within its inclusive boundaries', async () => {
    const page = await createPage();
    const column = new Column(10, 20, 100, 200);

    expect(column.contains(new XYLocation(10, 780), page)).toBe(true);
    expect(column.contains(new XYLocation(210, 780), page)).toBe(true);
    expect(column.contains(new XYLocation(10, 680), page)).toBe(true);
    expect(column.contains(new XYLocation(210, 680), page)).toBe(true);
    expect(column.contains(new XYLocation(100, 700), page)).toBe(true);
    expect(column.contains(new XYLocation(9.9, 700), page)).toBe(false);
    expect(column.contains(new XYLocation(210.1, 700), page)).toBe(false);
    expect(column.contains(new XYLocation(100, 679.9), page)).toBe(false);
    expect(column.contains(new XYLocation(100, 780.1), page)).toBe(false);
  });

  test('returns undefined when no next column is configured', async () => {
    const page = await createPage();
    const column = new Column(0, 0, 100, 100);

    expect(column.advanceToNextColumn(page)).toBeUndefined();
  });

  test('advances to a configured next column', async () => {
    const page = await createPage();
    const next = new Column(100, 0, 100, 100);
    const column = new Column(0, 0, 100, 100, next);

    const area = column.advanceToNextColumn(page);

    expect(area.column).toBe(next);
    expect(area.page).toBe(page);
  });

  test('advances to a column supplied by a callback', async () => {
    const page = await createPage();
    const next = new Column(100, 0, 100, 100);
    const nextArea = new PageArea(next, page);
    const column = new Column(0, 0, 100, 100, () => nextArea);

    expect(column.advanceToNextColumn(page)).toBe(nextArea);
  });

  test('returns undefined for an unsupported next column helper', async () => {
    const page = await createPage();
    const column = new Column(0, 0, 100, 100, {} as Column);

    expect(column.advanceToNextColumn(page)).toBeUndefined();
  });

  test('returns a shorter column when the offset fits', () => {
    const next = new Column(100, 0, 100, 100);
    const column = new Column(10, 20, 100, 200, next);

    const result = column.bottomAfter(25);

    expect(result.start).toMatchObject({ x: 10, y: 45 });
    expect(result.height).toBe(75);
    expect(result.width).toBe(200);
    expect(result.nextColumnHelper).toBe(next);
  });

  test('returns a zero-height column when the offset equals the height', () => {
    const column = new Column(10, 20, 100, 200);

    const result = column.bottomAfter(100);

    expect(result.height).toBe(0);
  });

  test('advances when the offset exceeds the column height', async () => {
    const page = await createPage();
    const next = new Column(100, 0, 100, 100);
    const column = new Column(0, 0, 50, 200, next);

    const result = column.bottomAfter(51, page);

    expect(result.start).toMatchObject({ x: 100, y: 0 });
  });

  test('returns undefined when an oversized offset has no next column', async () => {
    const page = await createPage();
    const column = new Column(0, 0, 50, 200);

    expect(column.bottomAfter(51, page)).toBeUndefined();
  });

  test('returns null for an oversized offset without a page', () => {
    const column = new Column(0, 0, 50, 200);

    expect(column.bottomAfter(51)).toBeNull();
  });

  test('returns the area above the offset when it fits', () => {
    const column = new Column(10, 20, 100, 200);

    expect(column.topBefore(40)).toMatchObject({
      start: { x: 10, y: 20 },
      height: 40,
      width: 200,
    });
  });

  test('returns null when the offset exceeds the column height', () => {
    const column = new Column(10, 20, 100, 200);

    expect(column.topBefore(101)).toBeNull();
  });

  test('returns itself when it already has the requested height', async () => {
    const page = await createPage();
    const column = new Column(10, 20, 100, 200);

    const area = column.columnWithAtLeast(100, page);

    expect(area.column).toBe(column);
    expect(area.page).toBe(page);
  });

  test('advances when it is shorter than the requested height', async () => {
    const page = await createPage();
    const next = new Column(100, 0, 100, 100);
    const column = new Column(0, 0, 50, 200, next);

    expect(column.columnWithAtLeast(51, page).column).toBe(next);
  });

  test('returns undefined when it is too short and has no next column', async () => {
    const page = await createPage();
    const column = new Column(0, 0, 50, 200);

    expect(column.columnWithAtLeast(51, page)).toBeUndefined();
  });
});
