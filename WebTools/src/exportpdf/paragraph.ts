import { PDFFont, PDFPage, last } from "@cantoo/pdf-lib";
import { Column } from "./column";
import { SimpleColor } from "../common/colour";
import { XYLocation } from "../common/xyLocation";
import { FontSpecification } from "./fontSpecification";
import { CHALLENGE_DICE_NOTATION } from "../common/challengeDiceNotation";
import { TextBlock } from "./textBlock";

// A line represents one line of text inside a paragrap and/or column of text. The line can
// contain different text blocks (including some blocks that have different fonts or font weights),
// and we need to adjust the overall baseline of the line so that it can accommodate all such
// blocks.
export class Line {
    blocks: TextBlock[];
    column: Column;
    location: XYLocation; // represents the upper-left-hand corner of the line

    constructor(location: XYLocation, column: Column, blocks?: TextBlock[]) {
        this.location = location;
        this.blocks = blocks || [];
        this.column = column;
    }

    height() {
        let h = 0.0;
        this.blocks.forEach(b => {if (b.height > h) h = b.height; });
        return h;
    }
    bottom(): XYLocation {
        return new XYLocation(this.location.x, this.location.y - this.height());
    }
    availableWidth() {
        let w = 0.0;
        this.blocks.forEach(b => w += b.width);
        return this.column.width - w;
    }
    isEmpty() {
        return this.blocks.length === 0;
    }
    append(block: TextBlock) {
        if (this.blocks.length) {
            let lastBlock = this.blocks[this.blocks.length - 1];
            if (block.font === lastBlock.font
                && block.fontSize === lastBlock.fontSize
                && block.colour?.asHex() === lastBlock.colour?.asHex()
                && block.descender === lastBlock.descender) {

                let newBlock = TextBlock.create(lastBlock.text + block.text,
                    new FontSpecification(block.font, block.fontSize), block.descender, block.colour);
                this.blocks[this.blocks.length-1] = newBlock;

            } else {
                this.blocks.push(block);
            }
        } else {
            this.blocks.push(block);
        }
    }
    add(block: TextBlock) {
        this.blocks.push(block);
    }
    addAll(blocks: TextBlock[]) {
        Array.prototype.push.apply(this.blocks, blocks);
    }

    nextLine(page: PDFPage) {
        return new Line(new XYLocation(this.bottom().x, this.bottom().y), this.column).moveToNextColumnIfNecessary(page);
    }

    public moveToNextColumnIfNecessary(page: PDFPage) {
        if (this.column.contains(this.bottom(), page)) {
            return this;
        } else if (this.column.nextColumn == null) {
            return null;
        } else {
            return new Line(this.column.nextColumn.translatedStart(page), this.column.nextColumn, this.blocks);
        }
    }

    writeTextBlocks(page: PDFPage, color: SimpleColor) {
        let x = this.bottom().x;
        this.blocks.forEach(textBlock => {
            textBlock.writeToPage(x, this.bottom().y, page, color);
            x += textBlock.width;
        });
    }

    get width() {
        let result = 0;
        this.blocks.forEach(b => result += b.width);
        return result;
    }
}

export class Paragraph {

    column: Column;
    lines: Line[] = [];
    symbolFont: PDFFont;
    page: PDFPage;
    indentAmount: number;

    // in PDF coordinate system
    private start?: XYLocation;

    constructor(page: PDFPage, column: Column, symbolFont?: PDFFont) {
        this.column = column;
        this.page = page;
        this.symbolFont = symbolFont;
    }

    get startColumn() {
        if (this.lines?.length) {
            let firstLine = this.lines[0];
            return Paragraph.unindentedColumn(firstLine.column, this.indentAmount);
        } else {
            return this.column;
        }
    }

    get endColumn() {
        if (this.lines?.length) {
            let lastLine = this.lines[this.lines.length - 1];
            return Paragraph.unindentedColumn(lastLine.column, this.indentAmount);
        } else {
            return this.column;
        }
    }

    private currentLine() {
        if (this.lines.length === 0) {
            let column = this.column;
            let start = this.start;
            if (this.indentAmount) {
                column = Paragraph.indentedColumn(column, this.indentAmount);
                if (start != null) {
                    start = new XYLocation(start.x + this.indentAmount, start.y);
                }
            }
            if (start == null) {
                start = column.translatedStart(this.page);
            }
            return new Line(start, column);
        } else {
            return this.lines[this.lines.length - 1];
        }
    }

    get spansColumns() {
        if (this.lines?.length === 1) {
            return false;
        } else if (this.lines?.length) {
            let firstLine = this.lines[0];
            let lastLine = this.lines[this.lines.length-1];

            return !(firstLine.column.start.x === lastLine.column.start.x
                && firstLine.column.start.y === lastLine.column.start.y
                && firstLine.column.height === lastLine.column.height
                && firstLine.column.width === lastLine.column.width);
        } else {
            return false;
        }
    }

    private static indentedColumn(column: Column, indentAmount: number) {
        return new Column(column.start.x + indentAmount, column.start.y, column.height, column.width - indentAmount,
            column.nextColumn ? Paragraph.indentedColumn(column.nextColumn, indentAmount) : undefined)
    }

    private static unindentedColumn(column: Column, indentAmount: number) {
        if (indentAmount) {
            return new Column(column.start.x - indentAmount, column.start.y, column.height, column.width + indentAmount,
                column.nextColumn ? Paragraph.unindentedColumn(column.nextColumn, indentAmount) : undefined)
        } else {
            return column;
        }
    }
    indent(amount: number) {
        this.indentAmount = amount;
    }

    append(text: string|number, font: FontSpecification, colour?: SimpleColor) {
        this.lines = this.createLines("" + text, font, new FontSpecification(this.symbolFont, font.size), this.currentLine(), this.page, colour);
    }

    write(colour: SimpleColor = SimpleColor.from("#000000")) {
        this.lines.forEach(t => {
            t.writeTextBlocks(this.page, colour);
        });
    }

    nextParagraph(blankLine: number = 0.5) {
        let result = new Paragraph(this.page, this.endColumn, this.symbolFont);
        if (this.lines.length > 0) {
            let line = this.lines[this.lines.length-1];
            let newLocation = line.location;
            newLocation = new XYLocation(line.bottom().x, line.bottom().y - (blankLine * line.height()));

            if (newLocation && line.column) {
                let currentColumn = line.column;
                let newLine = new Line(newLocation, currentColumn);
                line = newLine.moveToNextColumnIfNecessary(this.page);
            }

            if (line) {
                result = new Paragraph(this.page, Paragraph.unindentedColumn(line.column, this.indentAmount), this.symbolFont);
                result.start = this.indentAmount ? new XYLocation(newLocation.x - this.indentAmount, newLocation.y) : newLocation;
            } else {
                result = null;
            }
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

    private createLines(text: string, fontSpec: FontSpecification, symbolStyle: FontSpecification, lines: Line|(Line[]), page: PDFPage, colour?: SimpleColor) {
        let result: Line[] = [];
        if (lines instanceof Line) {
            result.push(lines as Line);
        } else if (lines.length > 0) {
            const l = lines as (Line[]);
            result = [...l];
        }

        let words = text.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
            let line = result[result.length-1];

            let word = words[i];
            if (!line.isEmpty()) {
                word = " " + word;
            }
            let parts = this.containsDelta(word) ? this.separateDeltas(word) : [word];
            let blocks = parts.map(p => {
                if (p === CHALLENGE_DICE_NOTATION) {
                    return TextBlock.create("A", symbolStyle, false, colour);
                } else {
                    return TextBlock.create(p, fontSpec, false, colour);
                }
            });

            let sum = 0;
            blocks.forEach(b => sum += b.width);

            if (sum < line.availableWidth()) {
                blocks.forEach(b => line.append(b));
            } else {
                line = line.nextLine(this.page);
                if (line != null) {
                    result.push(line);

                    let parts = this.separateDeltas(words[i]); // get the original word without the leading space
                    line.addAll(parts.map(p => {
                        if (p === CHALLENGE_DICE_NOTATION) {
                            return TextBlock.create("A", symbolStyle, false, colour);
                        } else {
                            return TextBlock.create(p, fontSpec, false, colour);
                        }
                    }));
                } else {
                    break;
                }
            }

            // maybe the latest changes required a column change
            let newLine = line.moveToNextColumnIfNecessary(page);
            if (newLine !== line) {
                result[result.length-1] = newLine;
            }
        }

        return result;
    }

    private containsDelta(word: string) {
        return word.indexOf("[D]") >= 0;
    }

    private separateDeltas(word: string) {
        let result: string[] = [];
        while (word.length > 0) {
            let index = word.indexOf(CHALLENGE_DICE_NOTATION);
            if (index > 0) {
                result.push(word.substring(0, index));
                result.push(word.substring(index, index+3));
                word = word.substring(index + 3);
            } else if (index === 0) {
                result.push(word.substring(index, index+3));
                word = word.substring(index + 3);
            } else {
                result.push(word);
                word = "";
            }
        }
        return result;
    }

}