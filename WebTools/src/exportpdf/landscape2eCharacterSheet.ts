import i18next from "i18next";
import { SimpleColor } from "../common/colour";
import { BaseFormFillingSheet } from "./baseFormFillingSheet";
import { Column } from "./column";
import { SheetTag } from "./icharactersheet";
import { PDFDocument, PDFPage } from "@cantoo/pdf-lib";
import { Construct, Stereotype } from "../common/construct";
import { TalentWriter } from "./talentWriter";
import { Character } from "../common/character";
import { assembleWritableItems } from "./generatedsheet";
import { FontLibrary, FontType } from "./fontLibrary";
import { labelWriter } from "./labelWriter";
import { TextAlign } from "./textAlign";
import { Era } from "../helpers/eras";
import { CheckMarkMaker } from "./checkMarkMaker";

export class Landscape2eCharacterSheet extends BaseFormFillingSheet {

    static readonly talentsColumn3 = new Column(390.6, 361, 200, 162);
    static readonly talentsColumn2 = new Column(221.7, 361, 200, 162, this.talentsColumn3);
    static readonly talentsColumn1 = new Column(51.5, 373, 180, 162, this.talentsColumn2);

    static readonly tealColour: SimpleColor = SimpleColor.from("#39AAA3");
    static readonly goldColour: SimpleColor = SimpleColor.from("#D49F00");
    static readonly redColour: SimpleColor = SimpleColor.from("#C51A1B");
    static readonly blueColour: SimpleColor = SimpleColor.from("#2384B3");
    static readonly greyColour: SimpleColor = SimpleColor.from("#979696");

    static readonly headingColumn = new Column(73.8, 45, 8.8, 200);

    fonts: FontLibrary = new FontLibrary();

    getName(): string {
        return i18next.t("Sheet.landscape2eCharacterSheet");
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/STA_2e_Landscape_Sheet.png'
    }
    getPdfUrl(): string {
        return '/static/pdf/STA_2e_Landscape_Sheet.pdf'
    }

    getDefaultFontPath() {
        return "/static/font/OpenSansCondensed-Light.ttf";
    }

    getTags(): SheetTag[] {
        return [ SheetTag.Landscape, SheetTag.Style2e, SheetTag.UsLetter, SheetTag.LanguageSupport ];
    }

    async initializeFonts(pdf: PDFDocument) {
        await super.initializeFonts(pdf);

        const fontBytes = await fetch("/static/font/Michroma-Regular.ttf").then(res => res.arrayBuffer());
        this.headingFont = await pdf.embedFont(fontBytes);

        this.fonts.addFont(FontType.Standard, this.formFont);

        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const boldFont = await pdf.embedFont(boldFontBytes);
        this.fonts.addFont(FontType.Bold, boldFont);

        const italicFontBytes = await fetch("/static/font/OpenSansCondensed-LightItalic.ttf").then(res => res.arrayBuffer());
        const italicFont = await pdf.embedFont(italicFontBytes);
        this.fonts.addFont(FontType.Italic, italicFont);

        const symbolFontBytes = await fetch("/static/font/Trek_Arrowheads.ttf").then(res => res.arrayBuffer());
        const symbolFont = await pdf.embedFont(symbolFontBytes);
        this.fonts.addFont(FontType.Symbol, symbolFont);
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        const page = pdf.getPage(0);
        this.writeLabels(page, construct as Character);
        this.writeRoleAndTalents(page, construct as Character);
        this.writeTitle(page);

        this.createDeterminationBoxes(page, pdf);
        this.createStressBoxes(page, pdf, construct as Character);
    }

    writeLabels(page: PDFPage, construct: Character) {
        const subHeadings = {
            "Construct.other.attributes": new Column(55.1, 287.2, 9.5, 211),
            "Construct.other.departments": new Column(286.8, 287.2, 9.5, 211),
        }

        if (construct.stereotype === Stereotype.Npc || construct.stereotype === Stereotype.SupportingCharacter) {
            subHeadings["Construct.other.specialRules"] = new Column(51.5, 361, 9.5, 162);
        } else {
            subHeadings["Construct.other.talents"] = new Column(51.5, 361, 9.5, 162);
        }

        labelWriter(page, subHeadings, construct.version,
            this.headingFont, 9, Landscape2eCharacterSheet.greyColour, TextAlign.Centre);

        labelWriter(page, {
                "Construct.attribute.control": new Column(56.8, 308, 8.5, 45),
                "Construct.attribute.daring": new Column(56.8, 332.9, 8.5, 45),
                "Construct.attribute.fitness": new Column(129.9, 308, 8.5, 45),
                "Construct.attribute.insight": new Column(129.9, 332.9, 8.5, 45),
                "Construct.attribute.presence": new Column(202.5, 308, 8.5, 45),
                "Construct.attribute.reason": new Column(202.5, 332.9, 8.5, 45),

                "Construct.discipline.command": new Column(289, 308, 8.5, 45),
                "Construct.discipline.conn": new Column(289, 332.9, 8.5, 45),
                "Construct.discipline.engineering": new Column(361.1, 308, 8.5, 45),
                "Construct.discipline.security": new Column(361.1, 332.9, 8.5, 45),
                "Construct.discipline.medicine": new Column(433.2, 308, 8.5, 45),
                "Construct.discipline.science": new Column(433.2, 332.9, 8.5, 45),
            }, construct.version,
            this.fonts.fontByType(FontType.Bold), 8, ((label) => {
                if (label === "Construct.discipline.command" ||
                    label === "Construct.discipline.conn") {
                    return construct.era === Era.NextGeneration ? Landscape2eCharacterSheet.redColour : Landscape2eCharacterSheet.goldColour;
                } else if (label === "Construct.discipline.engineering" ||
                        label === "Construct.discipline.security") {
                    return construct.era === Era.NextGeneration ? Landscape2eCharacterSheet.goldColour : Landscape2eCharacterSheet.redColour;
                } else if (label === "Construct.discipline.medicine" ||
                        label === "Construct.discipline.science") {
                    return Landscape2eCharacterSheet.blueColour;
                } else {
                    return Landscape2eCharacterSheet.tealColour;
                }
            }));

        labelWriter(page, {
            "Construct.other.name": new Column(55.4 + 3, 72.4 + 1, 6, 248.2 - 5),
            "Construct.other.pronouns": new Column(309.2 + 3, 72.4 + 1, 6, 86.1 - 5),
            "Construct.other.rank": new Column(55.4 + 3, 102 + 2, 6, 166 - 5),
            "Construct.other.assignment": new Column(227 + 3, 102 + 1, 6, 166 - 5),
            "Construct.other.characterRole": new Column(55.4 + 3, 131.3 + 1, 6, 248.2 - 5),
            "Construct.other.reputation": new Column(309.2 + 3, 131.3 + 1, 6, 86.1 - 5),
            "Construct.other.speciesAndTraits": new Column(55.4 + 3, 161 + 1, 6, 339.9 - 5),
            "Construct.other.environment": new Column(55.4 + 3, 190.8 + 1, 6, 166 - 5),
            "Construct.other.upbringing": new Column(227 + 3, 190.8 + 1, 6, 166 - 5),
            "Construct.other.careerPath": new Column(55.4 + 3, 220.1 + 1, 6, 166 - 5),
            "Construct.other.experience": new Column(227 + 3, 220.1 + 1, 6, 166 - 5),
            "Construct.other.careerEvent1": new Column(55.4 + 3, 249.4 + 1, 6, 166 - 5),
            "Construct.other.careerEvent2": new Column(227 + 3, 249.4 + 1, 6, 166 - 5),
            "Construct.other.focuses": new Column(561.5 + 3, 96.2 + 1, 6, 162.7 - 5),
            "Construct.other.pastimes": new Column(561.5 + 3, 268.1 + 1, 6, 162.7 - 5),
            "Construct.other.values": new Column(561.5 + 3, 303.6 + 1, 6, 162.7 - 5),
            "Construct.other.attacks": new Column(561.5 + 3, 427.7 + 1, 6, 162.7 - 5),
            "Construct.other.equipment": new Column(561.5 + 3, 502.9 + 1, 6, 162.7 - 5),
        }, construct.version,
        this.headingFont, 5, Landscape2eCharacterSheet.tealColour);

        labelWriter(page, {
                "Construct.other.determination": new Column(564.1, 77.8, 6, 70),
                "Construct.other.stress": new Column(421.2, 224.6, 6, 36.4),
            }, construct.version,
            this.headingFont, 5, Landscape2eCharacterSheet.greyColour, TextAlign.Left);

        labelWriter(page, {
                "Construct.other.resistance": new Column(506.8, 305, 6, 46.5)
            }, construct.version,
            this.headingFont, 5, Landscape2eCharacterSheet.greyColour, TextAlign.Centre);

    }

    writeRoleAndTalents(page: PDFPage, character: Character) {
        new TalentWriter(page, this.fonts, character.version).writeTalents(
            assembleWritableItems(character),
            Landscape2eCharacterSheet.talentsColumn1, 8);
    }

    createDeterminationBoxes(page: PDFPage, pdf: PDFDocument) {
        new CheckMarkMaker(page, pdf).createCheckMarksAndBoxes(
            [
                new Column(650.4, 77.1, 9.5, 9.5),
                new Column(665.2, 77.1, 9.5, 9.5),
                new Column(680, 77.1, 9.5, 9.5),
            ], "Determination ", Landscape2eCharacterSheet.greyColour
        );
    }

    createStressBoxes(page: PDFPage, pdf: PDFDocument, character: Character) {
        let columns = [];
        let startX = 464.9;
        let startY = 221.3;
        let gap = 478.8 - startX;

        let availableVerticalSpace = 4 * gap;
        let numberOfLines = Math.ceil(character.stress / 5);

        let verticalOffset = (availableVerticalSpace - numberOfLines * gap) / 2;

        for (let i = 0; i < character.stress; i++) {
            let x = startX + (gap * (i % 5));
            let y = startY + (gap * Math.floor(i / 5)) + verticalOffset;
            columns.push(new Column(x, y, 9.5, 9.5));
        }

        new CheckMarkMaker(page, pdf).createCheckMarksAndBoxes(columns, "Stress ",
            Landscape2eCharacterSheet.greyColour);
    }

    writeTitle(page: PDFPage) {
        const originalText = i18next.t("Sheet.text.title.alt").toLocaleUpperCase();
        let text = originalText;
        const fontSize = this.determineIdealFontWidth([ text ],
            Landscape2eCharacterSheet.headingColumn.width, 10, 7.5);
        const block = Landscape2eCharacterSheet.headingColumn;
        let width = this.headingFont.widthOfTextAtSize(text, fontSize);
        while (width > block.width) {
            text = text.substring(0, text.length-1);
            width = this.headingFont.widthOfTextAtSize(text + "...", fontSize);
        }

        if (text !== originalText) {
            text += "...";
        }

        const triangle = "M 60.232529,54.856579 V 44.842907 l 8.671875,5.009766 z m 0.580078,-1.001953 6.9375,-4.001953 -6.9375,-4.007813 z"


        let widthOfTab = Math.max(146.205, width + 30);
        let startOffset = 54.966797;

        let farthestEdge = widthOfTab + startOffset;
        let circle1 = farthestEdge - (189.83203 - 184.75613);
        let circle2 = farthestEdge - (189.83203 - 178.49414);


        const tab = "M 54.966797 40.257812 " +
            "C 48.704803 40.257812 43.626953 45.333709 43.626953 51.595703 " +
            "L 43.626953 79.257812 " +
            "L 44.046875 79.257812 " +
            "L 44.048828 70.263672 " +
            "C 44.048828 64.286678 48.911678 59.425781 54.888672 59.425781 " +
            "L " + farthestEdge + " 59.425781 " +
            "L " + farthestEdge + " 51.595703 " +
            "C " + farthestEdge + " 45.333709 " + circle1 + " 40.257812 " + circle2 + " 40.257812 " +
            "L 54.966797 40.257812 " +
            "z"

        page.moveTo(0, page.getHeight());

        page.drawSvgPath(tab, {
            borderColor: SimpleColor.from("#000000").asPdfRbg(),
            color: Landscape2eCharacterSheet.tealColour.asPdfRbg(),
            borderWidth: 0
        });

        page.drawSvgPath(triangle, {
            borderColor: SimpleColor.from("#000000").asPdfRbg(),
            color: SimpleColor.from("#ffffff").asPdfRbg(),
            borderWidth: 0
        });

        page.drawText(text, {
            x: block.start.x,
            y: page.getHeight() - (block.end.y),
            color: SimpleColor.from("#ffffff").asPdfRbg(),
            font: this.headingFont,
            size: fontSize
        });
    }
}