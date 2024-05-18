import { PDFFont, PDFPage } from "@cantoo/pdf-lib";
import { Column } from "./icharactersheet";
import { SimpleColor } from "../common/colour";
import { XYLocation } from "../common/xyLocation";
import { FontSpecification } from "./fontSpecification";
import { CHALLENGE_DICE_NOTATION } from "../helpers/talents";
import { TextBlock } from "./textBlock";

// A line represents one line of text inside a paragrap and/or column of text. The line can
// contain different text blocks (including some blocks that have different fonts or font weights),
// and we need to adjust the overall baseline of the line so that it can accommodate all such
// blocks.
class Line {
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
    add(block: TextBlock) {
        this.blocks.push(block);
    }
    addAll(blocks: TextBlock[]) {
        Array.prototype.push.apply(this.blocks, blocks);
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
}

class LayoutHelper {

    createLines(text: string, fontSpec: FontSpecification, symbolStyle: FontSpecification, lines: Line|(Line[]), page: PDFPage, colour?: SimpleColor) {
        let result: Line[] = [];
        if (result instanceof Line) {
            // ignore
        } else if (result.length > 0) {
            let l = lines as (Line[]);
            result = [...l].splice(l.length-1, 1);
        }
        let line = null;
        if (lines instanceof Line) {
            line = lines as Line;
        } else if (lines.length > 0) {
            line = lines[lines.length-1];
        }
        if (line) {
            let words = text.split(/\s+/);
            let previousBlock = null;
            let textPortion = "";
            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                if (textPortion !== "" || !line.isEmpty()) {
                    word = " " + word;
                }
                if (this.containsDelta(word)) {
                    let parts = this.separateDeltas(word);
                    let blocks = parts.map(p => {
                        if (p === CHALLENGE_DICE_NOTATION) {
                            return TextBlock.create("A", symbolStyle, false, colour);
                        } else {
                            return TextBlock.create(p, fontSpec, false, colour);
                        }
                    });
                    let sum = previousBlock == null ? 0 : previousBlock.width;
                    blocks.forEach(b => sum += b.width);

                    if (sum < line.availableWidth()) {
                        if (previousBlock != null) {
                            line.add(previousBlock);
                            previousBlock = null;
                        }
                        line.addAll(blocks);
                        textPortion = "";

                    } else {
                        line.add(previousBlock);
                        line = line.moveToNextColumnIfNecessary(page);
                        previousBlock = null;
                        if (line) {
                            result.push(line);
                            line = new Line(line.bottom(), line.column);
                        } else {
                            break;
                        }

                        let parts = this.separateDeltas(words[i]); // get the original word without the leading space
                        line.addAll(parts.map(p => {
                            if (p === CHALLENGE_DICE_NOTATION) {
                                return TextBlock.create("A", symbolStyle, false, colour);
                            } else {
                                return TextBlock.create(p, fontSpec, false, colour);
                            }
                        }));
                    }
                } else {
                    textPortion += word;
                    let block = TextBlock.create(textPortion, fontSpec, false, colour);
                    if (block.width < line.availableWidth()) {
                        previousBlock = block;
                    } else {
                        if (previousBlock != null) {
                            line.add(previousBlock);
                            line = line.moveToNextColumnIfNecessary(page);
                            previousBlock = null;
                            if (line) {
                                result.push(line);
                                line = new Line(line.bottom(), line.column);
                            } else {
                                break;
                            }
                        }
                        textPortion = words[i];
                        previousBlock = TextBlock.create(textPortion, fontSpec, false, colour);
                    }
                }
            }
            if (previousBlock != null && line != null) {
                line.add(previousBlock);
                result.push(line);
            }
        }
        return result;
    }

    containsDelta(word: string) {
        return word.indexOf("[D]") >= 0;
    }

    separateDeltas(word: string) {
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

export class Paragraph {

    layoutHelper: LayoutHelper;
    column: Column;
    lines: Line[] = [];
    symbolFont: PDFFont;
    page: PDFPage;
    indentAmount: number;

    // in PDF coordinate system
    private start?: XYLocation;

    constructor(page: PDFPage, column: Column, symbolFont?: PDFFont) {
        this.layoutHelper = new LayoutHelper();
        this.column = column;
        this.page = page;
        this.symbolFont = symbolFont;
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

    append(text: string, font: FontSpecification, colour?: SimpleColor) {
        this.lines = this.layoutHelper.createLines(text, font, new FontSpecification(this.symbolFont, font.size), this.currentLine(), this.page, colour);
    }

    write(colour: SimpleColor = SimpleColor.from("#000000")) {
        this.lines.forEach(t => {
            t.writeTextBlocks(this.page, colour);
        });
    }

    nextParagraph(blankLine: number = 0.5) {
        let result = new Paragraph(this.page, this.column, this.symbolFont);
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
}