import { PDFDocument, PDFPage } from "@cantoo/pdf-lib";
import { Construct } from "../common/construct";
import { XYLocation } from "../common/xyLocation";

export enum SheetTag {
    LanguageSupport,
    Landscape,
    Portrait,
    TalentText,
    Lcars,
    UsLetter,
    HalfPage,
    Style2e,
    TwoPage
}

export interface ICharacterSheet {
    getLanguage(): string;
    getName(): string;
    getThumbnailUrl(): string;
    getPdfUrl(): string;
    populate(pdf: PDFDocument, construct: Construct);
    createFileName(suffix: string, construct: Construct);
    getTags(): SheetTag[];
}