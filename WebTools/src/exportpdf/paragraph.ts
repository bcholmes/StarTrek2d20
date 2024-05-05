import { PDFFont, PDFPage } from "@cantoo/pdf-lib";
import { Column, LayoutHelper, Line } from "./icharactersheet";
import { SimpleColor } from "../common/colour";
import { XYLocation } from "../common/xyLocation";
import { FontSpecification } from "./fontSpecification";

export class Paragraph {

    layoutHelper: LayoutHelper;
    column: Column;
    lines: Line[] = [];
    symbolFont: PDFFont;
    page: PDFPage;

    // in PDF coordinate system
    private start?: XYLocation;

    constructor(page: PDFPage, layoutHelper: LayoutHelper, column: Column, symbolFont?: PDFFont) {
        this.layoutHelper = layoutHelper;
        this.column = column;
        this.page = page;
        this.symbolFont = symbolFont;
    }

    private currentLine() {
        if (this.lines.length === 0) {
            let start = this.start == null ? this.column.translatedStart(this.page) : this.start;
            return new Line(start, this.column);
        } else {
            return this.lines[this.lines.length - 1];
        }
    }

    append(text: string, font: FontSpecification, colour?: SimpleColor) {
        this.lines = this.layoutHelper.createLines(text, font, new FontSpecification(this.symbolFont, font.size), this.currentLine(), this.page, colour);
    }

    write(colour: SimpleColor = SimpleColor.from("#000000")) {
        this.lines.forEach(t => {
            t.writeTextBlocks(this.page, colour);
        });
    }

    nextParagraph(blankLine: number = 0.5) {
        let result = new Paragraph(this.page, this.layoutHelper, this.column, this.symbolFont);
        if (this.lines.length > 0) {
            let line = this.lines[this.lines.length-1];
            let newLocation = line.location;
            let currentColumn = line.column;
            newLocation = new XYLocation(line.bottom().x, line.bottom().y - (blankLine * line.height()));
            result = new Paragraph(this.page, this.layoutHelper, currentColumn, this.symbolFont);
            result.start = newLocation;
        }
        return result;
    }

    get bottom() {
        if (this.lines.length > 0) {
            let line = this.lines[this.lines.length-1];
            return this.column.untranslateLocation(this.page, line.bottom());
        } else {
            return this.column.start;
        }
    }
}