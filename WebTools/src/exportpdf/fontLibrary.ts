import { PDFFont } from "@cantoo/pdf-lib";

export enum FontType {
    Standard,
    Bold,
    Italic,
    Symbol
}

export class FontLibrary {

    fonts: {[id: number]: PDFFont} = {}

    constructor(fonts: {[id: number]: PDFFont } = {}) {
        this.fonts = { ...fonts };
    }

    fontByType(type: FontType) {
        return this.fonts[type];
    }

    addFont(type: FontType, font: PDFFont) {
        this.fonts[type] = font;
    }
}