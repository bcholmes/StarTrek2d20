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
import { WeaponType, WeaponTypeModel } from "../helpers/weapons";
import { CHALLENGE_DICE_NOTATION } from "../common/challengeDiceNotation";
import { Paragraph } from "./paragraph";
import { XYLocation } from "../common/xyLocation";
import { Starship } from "../common/starship";

export abstract class BaseNonForm2eSheet extends BasicGeneratedSheet {

    static readonly tealColour: SimpleColor = SimpleColor.from("#39AAA3");
    static readonly goldColour: SimpleColor = SimpleColor.from("#D49F00");
    static readonly redColour: SimpleColor = SimpleColor.from("#C51A1B");
    static readonly blueColour: SimpleColor = SimpleColor.from("#2384B3");
    static readonly greyColour: SimpleColor = SimpleColor.from("#979696");

    static readonly bulletPath = "M 1.98633,0 C 0.88552,0 0,0.887478 0,1.988281 v 2.52539 C 0,5.614474 0.88552,6.5 1.98633,6.5 H 7.35 C 9.1505,6.5 10.6,5.050496 10.6,3.25 10.6,1.449502 9.1505,0 7.35,0 Z";

    textFont: PDFFont;
    boldFont: PDFFont;
    symbolFont: PDFFont;
    headingFont: PDFFont;


    async initializeFonts(pdf: PDFDocument) {
        await super.initializeFonts(pdf);

        this.textFont = this.formFont;
        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        this.boldFont = await pdf.embedFont(boldFontBytes);

        const fontBytes = await fetch("/static/font/Michroma-Regular.ttf").then(res => res.arrayBuffer());
        this.headingFont = await pdf.embedFont(fontBytes);

        const symbolFontBytes = await fetch("/static/font/Trek_Arrowheads.ttf").then(res => res.arrayBuffer());
        this.symbolFont = await pdf.embedFont(symbolFontBytes);
    }

    get nameColumn() {
        return new Column(90, 48, 15, 550-90);
    }

    writeName(page: PDFPage, name: string) {
        if (name?.length) {
            const textBlock = TextBlock.create(name.toLocaleUpperCase(), new FontSpecification(this.headingFont, 10), false);
            let y = this.nameColumn.end.y - 3 - ((this.nameColumn.height - textBlock.height) / 2);
            let x = this.nameColumn.start.x;

            let endX = this.nameColumn.start.x + textBlock.width + 15;

            let originalEndX = 253.55664;
            let originalCurveHandleX = 248.47878;
            let originalCurveEndX = 242.2168;

            let curveHandleX = endX - (originalEndX - originalCurveHandleX);
            let curveEndX = endX - (originalEndX - originalCurveEndX);

            let curvePath = "M 108.57031 44.523438 L 108.57031 63.693359 "
                + "L " + endX + " 63.693359 L " + endX + " 55.863281 C " + endX + " 49.601295 " + curveHandleX + " 44.523438 " + curveEndX + " 44.523438 "
                + "L 108.57031 44.523438 z";
            page.moveTo(0, page.getHeight());
            page.drawSvgPath(curvePath, {
                color: BaseNonForm2eSheet.tealColour.asPdfRbg(),
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


    writeAttacks(page: PDFPage, construct: Construct, column: Column) {

        let indentedColumn = new Column(column.start.x + 15, column.start.y, column.height, column.width - 15);

        let bold = new FontSpecification(this.boldFont, 9);
        let standard = new FontSpecification(this.textFont, 9);
        let security = 0;
        let personal = false;
        if (construct instanceof Character) {
            let character = construct as Character;
            security = character.skills[Skill.Security].expertise;
            personal = true;
        } else if (construct instanceof Starship) {
            let starship = construct as Starship;
            security = starship.departments[Department.Security];
        }

        let paragraph = null;
        let bottom = column.start;

        construct.determineWeapons().forEach(w => {
            let type = WeaponTypeModel.TYPES[w.type].description;
            if (personal) {
                type = w.type === WeaponType.MELEE ? i18next.t("Weapon.common.melee") : i18next.t("Weapon.common.ranged");
            }
            let qualities = w.weaponQualities.map(q => q.localizedDescription).join(", ");
            if (qualities?.length) {
                qualities = ", " + qualities;
            } else {
                qualities = "";
            }
            const dice = (construct instanceof Starship) ? (construct as Starship).getDiceForWeapon(w, true) : (w.dice + security);

            let text = type + ", " + dice + CHALLENGE_DICE_NOTATION + qualities
                + (w.hands != null ? ", " + i18next.t("Weapon.common.size", { hands: w.hands }) : "");

            paragraph = paragraph == null ? new Paragraph(page, indentedColumn, this.symbolFont) : paragraph.nextParagraph(0);
            paragraph.append(w.description + ": ", bold);
            paragraph.append(text, standard);
            paragraph.write();

            if (paragraph.lines.length) {
                let location = column.untranslateLocation(page, paragraph.lines[0].location);
                page.moveTo(column.start.x, page.getHeight() - (location.y + 3));
                page.drawSvgPath(BaseNonForm2eSheet.bulletPath, {
                    color: BaseNonForm2eSheet.tealColour.asPdfRbg(),
                    borderWidth: 0
                });
            }

            bottom = paragraph.bottom;
        });

        return new XYLocation(column.start.x, bottom.y);
    }
}