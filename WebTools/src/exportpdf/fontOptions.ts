import { FontType } from "./fontLibrary";

export class FontOptions {
    readonly fontType: FontType;
    readonly size: number;

    constructor(size: number, type: FontType = FontType.Standard) {
        this.fontType = type;
        this.size = size;
    }
}