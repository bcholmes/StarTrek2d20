import { PDFDocument, PDFFont, PDFPage } from "@cantoo/pdf-lib";
import { Construct } from "../common/construct";
import { XYLocation } from "../common/xyLocation";
import { SimpleColor } from "../common/colour";
import { CHALLENGE_DICE_NOTATION } from "../helpers/talents";

export class TextBlock {
    text: string;
    fontSize: number;
    font: PDFFont;
    height: number;
    width: number;
    colour?: SimpleColor;

    static create(text: string, fontSpec: FontSpecification, descender: boolean|number = false, colour?: SimpleColor) {

        let weight = 0.5;
        if (typeof descender === "boolean") {
            if (descender === true) {
                weight = 1;
            }
        } else {
            weight = descender;
        }

        let textBlock = new TextBlock();
        textBlock.text = text;
        const textWidth = fontSpec.font.widthOfTextAtSize(text, fontSpec.size);
        const textHeight = fontSpec.font.heightAtSize(fontSpec.size, { descender: false }) + this.descenderFor(fontSpec) * weight;
        textBlock.height = textHeight;
        textBlock.width = textWidth;
        textBlock.font = fontSpec.font;
        textBlock.fontSize = fontSpec.size;
        textBlock.colour = colour;
        return textBlock;
    }

    static descenderFor(fontSpec: FontSpecification) {
        return fontSpec.font.heightAtSize(fontSpec.size) - fontSpec.font.heightAtSize(fontSpec.size, { descender: false });
    }

    writeToPage(x: number, y: number, page: PDFPage, color: SimpleColor) {
        page.drawText(this.text, {
            x: x,
            y: y,
            size: this.fontSize,
            font: this.font,
            color: this.colour == null ? color.asPdfRbg() : this.colour.asPdfRbg()
        });
    }
}

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
    add(block: TextBlock) {
        this.blocks.push(block);
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

export class LayoutHelper {

    symbolFont: PDFFont;

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
                        blocks.forEach(b => line.add(b));
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
                        parts.forEach(p => {
                            if (p === CHALLENGE_DICE_NOTATION) {
                                line.add(TextBlock.create("A", symbolStyle, false, colour));
                            } else {
                                line.add(TextBlock.create(p, fontSpec, false, colour));
                            }
                        });
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

export class FontSpecification {
    font: PDFFont;
    size: number;

    constructor(font: PDFFont, size: number) {
        this.font = font;
        this.size = size;
    }
}


export class Column {
    start: XYLocation;
    height: number;
    width: number;
    nextColumn?: Column;

    constructor(x: number, y: number, height: number, width: number, nextColumn?: Column) {
        this.start = new XYLocation(x, y);
        this.height = height;
        this.width = width;
        this.nextColumn = nextColumn;
    }

    contains(point: XYLocation, page: PDFPage) {
        return point.x >= this.start.x && point.x <= (this.start.x + this.width)
            && point.y <= (page.getSize().height - this.start.y) && point.y >= (page.getSize().height - this.start.y - this.height);
    }
    translatedStart(page: PDFPage) {
        let x = this.start.x;
        let y = page.getSize().height - this.start.y;
        return new XYLocation(x, y);
    }

    get end() {
        return new XYLocation(this.start.x + this.width, this.start.y + this.height);
    }
}


export interface ICharacterSheet {
    getLanguage(): string;
    getName(): string;
    getThumbnailUrl(): string;
    getPdfUrl(): string;
    populate(pdf: PDFDocument, construct: Construct);
    createFileName(suffix: string, construct: Construct);
}