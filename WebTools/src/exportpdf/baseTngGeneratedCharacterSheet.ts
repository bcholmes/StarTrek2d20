import { PDFDocument, PDFPage } from "@cantoo/pdf-lib";
import { Character } from "../common/character";
import { SimpleColor } from "../common/colour";
import { Construct, Stereotype } from "../common/construct";
import { Column } from "./column";
import { XYLocation } from "../common/xyLocation";
import i18next from "i18next";
import { getCurrentLanguageCode } from "../i18n/config";
import { FontLibrary, FontType } from "./fontLibrary";
import { BaseFormFillingSheet } from "./baseFormFillingSheet";
import { labelWriter } from "./labelWriter";
import { TextAlign } from "./textAlign";

export abstract class BaseTNGGeneratedCharacterSheet extends BaseFormFillingSheet {
    static readonly lightPurpleColour = SimpleColor.from("#c3bcde");
    static readonly purpleColour = SimpleColor.from("#B6B2D9");
    static readonly darkPurpleColour = SimpleColor.from("#8964AB")
    static readonly headingColour = SimpleColor.from("#9C3478");
    static readonly orangeColour = SimpleColor.from("#F9A164");

    fonts: FontLibrary = new FontLibrary();

    get determinationPills(): Column[] {
        return [];
    }

    get stressPillLocations(): XYLocation[] {
        return [];
    }

    get stressPill(): string {
        return "";
    }

    get subTitleLocations(): {[key: string]: Column} {
        return {};
    }

    get statLocations(): {[key: string]: Column} {
        return {};
    }

    get detailLabels(): {[key: string]: Column} {
        return {};
    }

    get determinationLabelBlock(): Column {
        return null;
    }

    async initializeFonts(pdf: PDFDocument) {
        await super.initializeFonts(pdf);

        this.fonts.addFont(FontType.Standard, this.formFont);

        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const boldFont = await pdf.embedFont(boldFontBytes);
        this.fonts.addFont(FontType.Bold, boldFont);

        if (getCurrentLanguageCode() === "ru") {
            this.headingFont = boldFont;
        } else {
            const fontBytes = await fetch("/static/font/lcars_font.TTF").then(res => res.arrayBuffer());
            this.headingFont = await pdf.embedFont(fontBytes);
        }

        const italicFontBytes = await fetch("/static/font/OpenSansCondensed-LightItalic.ttf").then(res => res.arrayBuffer());
        const italicFont = await pdf.embedFont(italicFontBytes);
        this.fonts.addFont(FontType.Italic, italicFont);

        const symbolFontBytes = await fetch("/static/font/Trek_Arrowheads.ttf").then(res => res.arrayBuffer());
        const symbolFont = await pdf.embedFont(symbolFontBytes);
        this.fonts.addFont(FontType.Symbol, symbolFont);
    }

    get boldFont() {
        return this.fonts.fontByType(FontType.Bold);
    }

    get textFont() {
        return this.fonts.fontByType(FontType.Standard);
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        let character = construct as Character;

        const page = pdf.getPage(0);

        this.writeTitle(page);
        this.writeSubTitles(page, character);
        this.writeStatLabels(page, character);
        this.writeDetailLabels(page, construct);
        this.writeWeaponLabels(page);

        this.writeStress(pdf, page, character);
        this.createDeterminationCheckmarks(pdf, page);

    }

    createDeterminationCheckmarks(pdf: PDFDocument, page: PDFPage) {
        let form = pdf.getForm();
        this.determinationPills.forEach((block, i) => {

            let checkbox = form.createCheckBox("Determination " + (i+1));
            checkbox.addToPage(page, {
                x: block.start.x + 4,
                y: page.getHeight() - block.start.y - (block.height - 1),
                width: block.width - 8,
                height: block.height - 2,
                textColor: SimpleColor.from("#000000").asPdfRbg(),
                borderWidth: 0
            });
        });
    }

    get pillSize() {
        return {
            height: 0,
            width: 0
        };
    }

    writeLabel(page: PDFPage, originalText: string, fontSize: number, block: Column, colour: SimpleColor, suffix: string = "", rightJustify: boolean = false) {
        let text = originalText;
        let width = this.headingFont.widthOfTextAtSize(text + suffix, fontSize);
        while (width > block.width) {
            text = text.substring(0, text.length-1);
            width = this.headingFont.widthOfTextAtSize(text + "..." + suffix, fontSize);
        }

        if (text !== originalText) {
            text += "...";
        }

        text += suffix;

        let height = this.headingFont.heightAtSize(fontSize, { descender: false });
        let offset = Math.max(0, block.height - height) / 2;

        page.drawText(text, {
            x: rightJustify ? block.end.x - width - 2 : block.start.x,
            y: page.getHeight() - (block.end.y - offset),
            color: colour.asPdfRbg(),
            font: this.headingFont,
            size: fontSize
        });
    }

    writeDetailLabels(page: PDFPage, construct: Construct, colour: SimpleColor = BaseTNGGeneratedCharacterSheet.darkPurpleColour) {

        let minWidth = Math.min.apply(Math,
            Object.keys(this.detailLabels).map(key => this.detailLabels[key].width));
        let fontSize = this.determineIdealFontWidth(
            Object.keys(this.detailLabels).map(key => i18next.t(key).toLocaleUpperCase()),
            minWidth, 16.5, 9);

        labelWriter(page, this.detailLabels, construct.version, this.headingFont, 16.5, colour, TextAlign.Left, ": ");

        this.writeLabel(page, i18next.t("Construct.other.determination").toLocaleUpperCase(), fontSize,
            this.determinationLabelBlock, colour, ":");
    }


    writeStress(pdf: PDFDocument, page: PDFPage, character: Character, colour: SimpleColor = BaseTNGGeneratedCharacterSheet.purpleColour) {
        let form = pdf.getForm();
        let { height, width } = this.pillSize;
        this.stressPillLocations.forEach((pill, i) => {

            if (i >= character.stress) {
                page.moveTo(pill.x, page.getHeight() - pill.y);
                page.drawSvgPath(this.stressPill, {
                    color: colour.asPdfRbg(),
                    borderColor: colour.asPdfRbg(),
                    borderWidth: 1
                });
            } else {
                let checkbox = form.createCheckBox("Stress " + (i+1));
                checkbox.addToPage(page, {
                    x: pill.x + (width - 9.5) / 2,
                    y: page.getHeight() - pill.y - (height - 0.6),
                    width: 9.5,
                    height: 8.5,
                    textColor: SimpleColor.from("#000000").asPdfRbg(),
                    borderWidth: 0
                });
            }
        });
    }

    writeSubTitles(page: PDFPage, character: Character) {
        const originalFontSize = 16.5;

        const table = this.subTitleLocations;
        Object.keys(table).forEach(key => {
            let fontSize = originalFontSize;
            let block = table[key];
            if (key === "departments" && character.version === 1) {
                key = "disciplines";
            } else if (key === "talents" && character.stereotype === Stereotype.Npc) {
                key = "specialRules";
            }

            const originalText = i18next.t("Construct.other." + key).toLocaleUpperCase();
            let text = originalText;
            let width = this.headingFont.widthOfTextAtSize(text, fontSize);
            while (width > block.width) {
                fontSize -= 0.25;
                width = this.headingFont.widthOfTextAtSize(text, fontSize);
                if (fontSize < 8) {
                    break;
                }
            }

            page.drawRectangle({
                x: block.start.x - 3,
                y: page.getHeight() - (block.end.y + 1.5),
                width: width + 6,
                height: block.height + 3,
                color: SimpleColor.from("#ffffff").asPdfRbg()
            });

            page.drawText(text, {
                x: block.start.x,
                y: page.getHeight() - (block.end.y),
                color: BaseTNGGeneratedCharacterSheet.headingColour.asPdfRbg(),
                font: this.headingFont,
                size: fontSize
            });
        });

    }

    writeTitle(page: PDFPage) {
    }

    writeWeaponLabels(page: PDFPage) {
    }
}