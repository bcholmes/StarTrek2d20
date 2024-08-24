import { FontType } from "./fontLibrary";

export class FontOptions {
    readonly fontType: FontType;
    readonly size: number;

    constructor(type: FontType, size: number) {
        this.fontType = type;
        this.size = size;
    }
}