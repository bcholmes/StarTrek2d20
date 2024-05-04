import { PDFDocument, PDFFont, PDFPage, rgb } from "@cantoo/pdf-lib";
import { Construct } from "../common/construct";
import { XYLocation } from "../common/xyLocation";
import { SimpleColor } from "../common/colour";

export class TextBlock {
    text: string;
    fontSize: number;
    font: PDFFont;
    height: number;
    width: number;

    static create(text: string, fontSpec: FontSpecification, descender: boolean|number = false) {

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
            color: rgb(color.red / 255.0, color.green / 255.0, color.blue / 255.0)
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
    bottom() {
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