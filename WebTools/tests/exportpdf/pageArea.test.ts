import { test, expect, describe } from '@jest/globals';
import { PDFDocument } from '@cantoo/pdf-lib';
import type { PDFPage } from '@cantoo/pdf-lib';
import { Column } from '../../src/exportpdf/column';
import { PageArea } from '../../src/exportpdf/pageArea';

const createPage = async (): Promise<PDFPage> => {
  const pdf = await PDFDocument.create();
  return pdf.addPage([600, 800]);
};

describe('PageArea', () => {
  test('stores its column and page', async () => {
    const page = await createPage();
    const column = new Column(10, 20, 100, 200);

    const area = new PageArea(column, page);

    expect(area.column).toBe(column);
    expect(area.page).toBe(page);
  });

  test('returns a smaller area below itself', async () => {
    const page = await createPage();
    const column = new Column(10, 20, 100, 200);
    const area = new PageArea(column, page);

    const result = area.bottomAfter(25);

    expect(result.column.start).toMatchObject({ x: 10, y: 45 });
    expect(result.column.height).toBe(75);
    expect(result.page).toBe(page);
  });

  test('advances to the next column when the offset is too large', async () => {
    const page = await createPage();
    const next = new Column(100, 0, 100, 100);
    const area = new PageArea(new Column(0, 0, 50, 200, next), page);

    const result = area.bottomAfter(51);

    expect(result.column).toBe(next);
  });

  test('returns null when the offset is too large and no next column exists', async () => {
    const page = await createPage();
    const area = new PageArea(new Column(0, 0, 50, 200), page);

    expect(area.bottomAfter(51)).toBeNull();
  });

  test('returns an area with the requested height when available', async () => {
    const page = await createPage();
    const column = new Column(10, 20, 100, 200);
    const area = new PageArea(column, page);

    const result = area.areaWithAtLeast(100);

    expect(result.column).toBe(column);
    expect(result.page).toBe(page);
  });

  test('advances when the requested height is unavailable', async () => {
    const page = await createPage();
    const next = new Column(100, 0, 100, 100);
    const area = new PageArea(new Column(0, 0, 50, 200, next), page);

    expect(area.areaWithAtLeast(51).column).toBe(next);
  });

  test('returns undefined when the requested height is unavailable', async () => {
    const page = await createPage();
    const area = new PageArea(new Column(0, 0, 50, 200), page);

    expect(area.areaWithAtLeast(51)).toBeUndefined();
  });
});
