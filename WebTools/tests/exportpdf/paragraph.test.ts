import { test, expect, describe } from '@jest/globals'
import { Line } from '../../src/exportpdf/paragraph';
import { XYLocation } from '../../src/common/xyLocation';
import { Column } from '../../src/exportpdf/column';
import { TextBlock } from '../../src/exportpdf/textBlock';
import { PDFDocument, StandardFonts } from '@cantoo/pdf-lib';
import { FontSpecification } from '../../src/exportpdf/fontSpecification';
import { SimpleColor } from '../../src/common/colour';

describe('testing line functions', () => {
    test('should append block', async () => {

        const pdf = await PDFDocument.create()
        const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
        let line = new Line(new XYLocation(0, 0), pdf.getPage(0), new Column(0, 0, 500, 100));
        line.add(TextBlock.create("Text", new FontSpecification(helvetica, 9), false));

        line.append(TextBlock.create(" Block", new FontSpecification(helvetica, 9), false));

        expect(line.blocks?.length).toEqual(1);
    });

    test('should not append different block (colour)', async () => {

        const pdf = await PDFDocument.create()
        const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
        let line = new Line(new XYLocation(0, 0), pdf.getPage(0), new Column(0, 0, 500, 100));
        line.add(TextBlock.create("Text", new FontSpecification(helvetica, 9), false));

        line.append(TextBlock.create(" Block", new FontSpecification(helvetica, 9), false, SimpleColor.from("#ff0000")));

        expect(line.blocks?.length).toEqual(2);
    });

    test('should not append different block (font size)', async () => {

        const pdf = await PDFDocument.create()
        const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
        let line = new Line(new XYLocation(0, 0), pdf.getPage(0), new Column(0, 0, 500, 100));
        line.add(TextBlock.create("Text", new FontSpecification(helvetica, 9), false));

        line.append(TextBlock.create(" Block", new FontSpecification(helvetica, 10), false));

        expect(line.blocks?.length).toEqual(2);
    });
});