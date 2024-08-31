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
        let result = this.fonts[type];
        if (result == null) {
            console.log("Cannot find " + FontType[type]);
            console.log(Object.keys(this.fonts));
        }
        return result;
    }

    addFont(type: FontType, font: PDFFont) {
        this.fonts[type] = font;
    }
}