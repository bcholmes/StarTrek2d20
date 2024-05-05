import { PDFFont } from "@cantoo/pdf-lib";

export class FontSpecification {
    font: PDFFont;
    size: number;

    constructor(font: PDFFont, size: number) {
        this.font = font;
        this.size = size;
    }
}