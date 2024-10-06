import { PDFDocument, PDFFont, PDFPage } from "@cantoo/pdf-lib";
import { BasicGeneratedSheet } from "./generatedsheet";
import { TextBlock } from "./textBlock";
import { FontSpecification } from "./fontSpecification";
import { Column } from "./column";
import { SimpleColor } from "../common/colour";
import { Construct } from "../common/construct";
import { Skill, SkillsHelper } from "../helpers/skills";
import { Attribute, AttributesHelper } from "../helpers/attributes";
import i18next from "i18next";
import { makeKey } from "../common/translationKey";
import { Character } from "../common/character";
import { Department, allDepartments } from "../helpers/departments";
import { System, allSystems } from "../helpers/systems";
import { Paragraph } from "./paragraph";
import { XYLocation } from "../common/xyLocation";
import { FontLibrary, FontType } from "./fontLibrary";
import { FontOptions } from "./fontOptions";
import { WeaponDescriber } from "./weaponDescriber";
import { bullet2EWriter } from "./bullet2eWriter";
import { tealColour2e } from "./colourProvider2e";

export abstract class BaseNonForm2eSheet extends BasicGeneratedSheet {

    static readonly greyColour: SimpleColor = SimpleColor.from("#979696");

    static readonly bulletPath = "M 1.98633,0 C 0.88552,0 0,0.887478 0,1.988281 v 2.52539 C 0,5.614474 0.88552,6.5 1.98633,6.5 H 7.35 C 9.1505,6.5 10.6,5.050496 10.6,3.25 10.6,1.449502 9.1505,0 7.35,0 Z";

    fonts: FontLibrary = new FontLibrary();
    headingFont: PDFFont;

    async initializeFonts(pdf: PDFDocument) {
        await super.initializeFonts(pdf);

        this.fonts.addFont(FontType.Standard, this.formFont);
        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const boldFont = await pdf.embedFont(boldFontBytes);
        this.fonts.addFont(FontType.Bold, boldFont);

        const italicFontBytes = await fetch("/static/font/OpenSansCondensed-LightItalic.ttf").then(res => res.arrayBuffer());
        const italicFont = await pdf.embedFont(italicFontBytes);
        this.fonts.addFont(FontType.Italic, italicFont);

        const fontBytes = await fetch("/static/font/Michroma-Regular.ttf").then(res => res.arrayBuffer());
        this.headingFont = await pdf.embedFont(fontBytes);

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

    get nameColumn() {
        return new Column(75, 48, 15, 550-90);
    }

    writeName(page: PDFPage, name: string, colour: SimpleColor) {
        if (name?.length) {
            const textBlock = TextBlock.create(name.toLocaleUpperCase(), new FontSpecification(this.headingFont, 10), false);
            let y = this.nameColumn.end.y - 3 - ((this.nameColumn.height - textBlock.height) / 2);
            let x = this.nameColumn.start.x;

            const triangle = "M 59.14167,59.12397 V 49.110298 l 8.671875,5.009766 z m 0.580078,-1.001953 6.9375,-4.001953 -6.9375,-4.007813 z";

            let width = textBlock.width;
            let widthOfTab = Math.max(120, width + 50);
            let startOffset = 42.537;

            let farthestEdge = widthOfTab + startOffset;
            let circle1 = farthestEdge - (226.5918 - 221.51591);
            let circle2 = farthestEdge - (226.5918 - 215.25391);

            let curvePath = "M 53.876953 44.523438 C 47.614953 44.523438 42.537109 49.601281 42.537109 55.863281 L 42.537109 83.523438 L 42.958984 83.523438 L 42.958984 74.53125 C 42.958984 68.55425 47.821828 63.693359 53.798828 63.693359 "
                + "L " + farthestEdge + " 63.693359 L " + farthestEdge + " 55.863281 C "
                + farthestEdge + " 49.601281 " + circle1 + " 44.523438 " + circle2 + " 44.523438 L 53.876953 44.523438 z";

            page.moveTo(0, page.getHeight());
            page.drawSvgPath(curvePath, {
                color: colour.asPdfRbg(),
                borderWidth: 0
            });


            page.drawSvgPath(triangle, {
                borderColor: SimpleColor.from("#000000").asPdfRbg(),
                color: SimpleColor.from("#ffffff").asPdfRbg(),
                borderWidth: 0
            });

            textBlock.writeToPage(x, page.getHeight() - y, page, SimpleColor.from("#ffffff"));
        }
    }

    writeLabel(page: PDFPage, originalText: string, column: Column, font: FontSpecification, colour: SimpleColor) {
        originalText = originalText.toLocaleUpperCase();
        let textBlock = TextBlock.create(originalText, font, false);

        let text = originalText;
        let width = font.font.widthOfTextAtSize(text, font.size);
        while (width > column.width) {
            text = text.substring(0, text.length-1);
            width = font.font.widthOfTextAtSize(text + "...", font.size);
        }

        if (text !== originalText) {
            text += "...";
            textBlock = TextBlock.create(text, font, false);
        }

        let y = column.end.y - 1 - ((column.height - textBlock.height) / 2);
        let x = column.start.x + (column.width - textBlock.width);
        textBlock.writeToPage(x, page.getHeight() - y, page, colour);
    }

    determineAllStatLabels(construct: Construct) {
        let text = [];
        if (construct instanceof Character) {
            SkillsHelper.getSkills().forEach(s => text.push(i18next.t(makeKey('Construct.discipline.', Skill[s]))));
            AttributesHelper.getAllAttributes().forEach(a => text.push(i18next.t(makeKey('Construct.attribute.', Attribute[a]))));
        } else {
            allDepartments().forEach(d => text.push(i18next.t(makeKey('Construct.department.', Department[d]))));
            allSystems().forEach(s => text.push(i18next.t(makeKey('Construct.system.', System[s]))));
        }
        return text;
    }

    determineFontSizeForWidth(text: string[], minWidth: number) {
        let fontSize = 5.5;
        for (let i = 8.5; i >= 5.5; i -= 0.25) {

            let ok = true;
            for (const t of text) {
                let block = TextBlock.create(t, new FontSpecification(this.boldFont, i));
                if (block.width > (minWidth - 4)) {
                    ok = false;
                    break;
                }
            }

            if (ok) {
                fontSize = i;
                break;
            }

        }
        return fontSize;
    }

    writeSubTitle(page: PDFPage, text: string, block: Column) {
        if (block.height > 13) {
            block = block.topBefore(13);
        }
        const font = new FontSpecification(this.headingFont, 9);
        const textBlock = TextBlock.create(text.toLocaleUpperCase(), font, 0);

        let lead = (block.width - textBlock.width) / 2;
        lead = Math.min(12, lead - 4);

        let x = block.start.x + lead + 4;
        let y = block.end.y - 1 - ((block.height - textBlock.height) / 2);
        textBlock.writeToPage(x, page.getHeight() - y, page, SimpleColor.from("#000000"));


        page.drawLine({
            start: { x: block.start.x, y: page.getHeight() - (y + 3 - block.height / 2) },
            end: { x: block.start.x + lead, y: page.getHeight() - (y + 3 - block.height / 2) },
            thickness: 1,
            color: BaseNonForm2eSheet.greyColour.asPdfRbg()
        });

        let end = block.start.x + lead + 4 + textBlock.width + 4;
        if (end < block.end.x) {
            page.drawLine({
                start: { x: end, y: page.getHeight() - (y + 3 - block.height / 2) },
                end: { x: block.end.x, y: page.getHeight() - (y + 3 - block.height / 2) },
                thickness: 1,
                color: BaseNonForm2eSheet.greyColour.asPdfRbg()
            });
        }
    }

    valueBlock(block: Column) {
        return new Column(block.end.x + 1, block.start.y, block.height, 10);
    }


    writeAttacks(page: PDFPage, construct: Construct, column: Column, colour: SimpleColor = tealColour2e) {

        let bold = new FontOptions(9, FontType.Bold);
        let standard = new FontOptions(9);
        let paragraph = null;
        let bottom = column.start;

        construct.determineWeapons().forEach(w => {
            const text = new WeaponDescriber(construct.version, false).describeFully(w, construct);
            paragraph = paragraph == null ? new Paragraph(page, column, this.fonts) : paragraph.nextParagraph(0);
            paragraph?.indent(15);
            paragraph?.append(w.description + ": ", bold);
            paragraph?.append(text, standard);
            paragraph?.write();

            if (paragraph?.lines?.length) {
                bullet2EWriter(page, paragraph, colour);
            }

            bottom = paragraph?.bottom;
        });

        return bottom ? column.bottomAfter(bottom.y - column.start.y) : null;
    }
}