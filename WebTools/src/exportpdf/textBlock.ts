import { PDFFont, PDFPage } from "@cantoo/pdf-lib";
import { SimpleColor } from "../common/colour";
import { FontSpecification } from "./fontSpecification";

export class TextBlock {
    text: string;
    fontSize: number;
    font: PDFFont;
    height: number;
    width: number;
    colour?: SimpleColor;
    descender: number;

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
        textBlock.descender = weight;
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

