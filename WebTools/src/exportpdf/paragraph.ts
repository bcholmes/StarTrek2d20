import { PDFPage } from "@cantoo/pdf-lib";
import { Column } from "./column";
import { SimpleColor } from "../common/colour";
import { XYLocation } from "../common/xyLocation";
import { FontSpecification } from "./fontSpecification";
import { CHALLENGE_DICE_NOTATION } from "../common/challengeDiceNotation";
import { TextBlock } from "./textBlock";
import { FontLibrary, FontType } from "./fontLibrary";
import { textTokenizer } from "./textTokenizer";
import { FontOptions } from "./fontOptions";

// A line represents one line of text inside a paragrap and/or column of text. The line can
// contain different text blocks (including some blocks that have different fonts or font weights),
// and we need to adjust the overall baseline of the line so that it can accommodate all such
// blocks.
export class Line {
    readonly indentAmount: number;
    blocks: TextBlock[];
    column: Column;
    page: PDFPage;
    location: XYLocation; // represents the upper-left-hand corner of the line

    constructor(location: XYLocation, page: PDFPage, column: Column, indentAmount: number = 0, blocks?: TextBlock[]) {
        this.location = indentAmount > 0 ? new XYLocation(location.x + indentAmount, location.y) : location;
        this.blocks = blocks || [];
        this.column = column;
        this.page = page;
        this.indentAmount = indentAmount;
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
        return this.column.width - this.indentAmount - w;
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

    nextLine() {
        return new Line(new XYLocation(this.bottom().x - this.indentAmount, this.bottom().y), this.page, this.column, this.indentAmount)
            .moveToNextColumnIfNecessary();
    }

    public moveToNextColumnIfNecessary() {
        if (this.column.contains(this.bottom(), this.page)) {
            return this;
        } else {
            const result = this.column.advanceToNextColumn(this.page);
            if (result) {
                let location = result.column.translatedStart(result.page);
                return new Line(location,
                    result.page, result.column, this.indentAmount, this.blocks);
            } else {
                return undefined;
            }
        }
    }

    writeTextBlocks(color: SimpleColor) {
        let x = this.bottom().x;
        this.blocks.forEach(textBlock => {
            textBlock.writeToPage(x, this.bottom().y, this.page, color);
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
    page: PDFPage;
    indentAmount: number;
    fontLibrary: FontLibrary;

    // in PDF coordinate system
    private start?: XYLocation;

    constructor(page: PDFPage, column: Column, fontLibrary: FontLibrary) {
        this.column = column;
        this.page = page;
        this.fontLibrary = fontLibrary;
    }

    get symbolFont() {
        return this.fontLibrary.fontByType(FontType.Symbol);
    }

    get startColumn(): Column {
        if (this.lines?.length) {
            let firstLine = this.lines[0];
            return firstLine.column;
        } else {
            return this.column;
        }
    }

    get endColumn(): Column {
        if (this.lines?.length) {
            let lastLine = this.lines[this.lines.length - 1];
            return lastLine.column;
        } else {
            return this.column;
        }
    }

    get endPage(): PDFPage {
        if (this.lines?.length) {
            let lastLine = this.lines[this.lines.length - 1];
            return lastLine.page;
        } else {
            return this.page;
        }
    }

    private currentLine() {
        if (this.lines.length === 0) {
            let column = this.column;
            let start = this.start;
            if (start == null) {
                start = column.translatedStart(this.page);
            }
            return new Line(start, this.page, column, this.indentAmount);
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

    indent(amount: number) {
        this.indentAmount = amount;
    }

    append(text: string|number, font: FontSpecification|FontOptions, colour?: SimpleColor) {
        let fontSpecification = null;
        let options = null;
        if (font instanceof FontSpecification) {
            fontSpecification = font as FontSpecification;
        } else {
            options = font as FontOptions;
            let pdfFont = this.fontLibrary.fontByType(options.fontType);
            fontSpecification = new FontSpecification(pdfFont, options.size);
        }
        this.lines = this.createLines("" + text, fontSpecification, options, this.page, colour);
    }

    write(colour: SimpleColor = SimpleColor.from("#000000")) {
        this.lines.forEach(t => {
            t.writeTextBlocks(colour);
        });
    }

    nextParagraph(blankLine: number = 0.5) {
        let result = new Paragraph(this.endPage, this.endColumn, this.fontLibrary);
        if (this.lines.length > 0) {
            let line = this.lines[this.lines.length-1];
            let newLocation = line.location;
            newLocation = new XYLocation(line.bottom().x - line.indentAmount, line.bottom().y - (blankLine * line.height()));

            if (newLocation && line.column) {
                let currentColumn = line.column;
                let newLine = new Line(newLocation, this.endPage, currentColumn, this.indentAmount);
                line = newLine.moveToNextColumnIfNecessary();
                if (line) {
                    newLocation = new XYLocation(line.bottom().x  - line.indentAmount, line.bottom().y);
                }
            }

            if (line) {
                result = new Paragraph(line.page, line.column, this.fontLibrary);
                result.start = newLocation;
                if (this.indentAmount) {
                    result.indent(this.indentAmount);
                }
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

    private createLines(text: string, initialFont: FontSpecification, options: FontOptions, page: PDFPage, colour?: SimpleColor) {
        let result: Line[] = [...this.lines];
        let fontSpec = initialFont;
        let fontType = options?.fontType;
        if (result.length === 0) {
            let temp = this.currentLine();
            if (temp != null) {
                result.push(temp);
            }
        }

        let tokens = textTokenizer(text);
        let skipSpace = false;
        for (let t = 0; t < tokens.length; t++) {
            let token = tokens[t];
            if (token === "_" || token === "**") {
                skipSpace = true;
                if (options != null) {
                    if (fontType !== options.fontType) {
                        fontType = options.fontType;
                        fontSpec = initialFont;
                    } else if (token === "**") {
                        let font = this.fontLibrary.fontByType(FontType.Bold);
                        if (font != null) {
                            fontType = FontType.Bold;
                            fontSpec = new FontSpecification(font, options.size);
                        }
                    } else if (token === "_") {
                        let font = this.fontLibrary.fontByType(FontType.Italic);
                        if (font != null) {
                            fontType = FontType.Italic;
                            fontSpec = new FontSpecification(font, options.size);
                        }
                    }
                }
            } else if (token === CHALLENGE_DICE_NOTATION) {
                let block = TextBlock.create("A", new FontSpecification(this.fontLibrary.fontByType(FontType.Symbol), fontSpec.size), false, colour);
                let line = result[result.length-1];
                if (block.width < line.availableWidth()) {
                    line.append(block);
                } else {
                    line = line.nextLine();
                    if (line != null) {
                        result.push(line);
                        line.append(block);

                        // maybe the latest changes required a column change
                        let newLine = line.moveToNextColumnIfNecessary();
                        if (newLine == null) {
                            // skip it
                        } else if (newLine !== line) {
                            result[result.length-1] = newLine;
                        }
                    } else {
                        break;
                    }
                }
            } else {
                let words = token.split(/\s+/);
                for (let i = 0; i < words.length; i++) {
                    let line = result[result.length-1];

                    if (line) {

                        let word = words[i];
                        if (!line?.isEmpty() && !skipSpace) {
                            word = " " + word;
                        } else {
                            skipSpace = false;
                        }
                        let block = TextBlock.create(word, fontSpec, false, colour);

                        if (block.width < line.availableWidth()) {
                            line.append(block);
                        } else {
                            line = line.nextLine();
                            if (line != null) {
                                result.push(line);

                                line.append(TextBlock.create(word.trim(), fontSpec, false, colour));
                            } else {
                                tokens = [];
                                break;
                            }
                        }

                        // maybe the latest changes required a column change
                        let newLine = line.moveToNextColumnIfNecessary();
                        if (newLine != null && newLine !== line) {
                            result[result.length-1] = newLine;
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        return result;
    }
}