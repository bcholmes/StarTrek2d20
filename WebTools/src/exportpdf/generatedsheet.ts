import { PDFDocument, PDFFont, PDFForm, PDFPage } from "@cantoo/pdf-lib";
import { Column, ICharacterSheet, LayoutHelper } from "./icharactersheet";
import fontkit from '@pdf-lib/fontkit'
import { Construct } from "../common/construct";
import i18next from "i18next";
import { makeKey } from "../common/translationKey";
import { SimpleColor } from "../common/colour";
import { Character } from "../common/character";
import { Attribute, AttributesHelper } from "../helpers/attributes";
import { Skill, SkillsHelper } from "../helpers/skills";
import { getCurrentLanguageCode } from "../i18n/config";
import { WeaponType } from "../helpers/weapons";
import { CHALLENGE_DICE_NOTATION } from "../helpers/talents";
import { XYLocation } from "../common/xyLocation";
import { Paragraph } from "./paragraph";
import { FontSpecification } from "./fontSpecification";
import { TextBlock } from "./textBlock";

abstract class BasicGeneratedSheet implements ICharacterSheet {

    formFont: PDFFont;

    getLanguage(): string {
        return "en";
    }
    getName(): string {
        throw new Error('Method not implemented.');
    }
    getThumbnailUrl(): string {
        throw new Error('Method not implemented.');
    }
    getPdfUrl(): string {
        throw new Error('Method not implemented.');
    }

    getDefaultFontPath() {
        return "/static/font/OpenSansCondensed-Light.ttf";
    }

    async initializeFonts(pdf: PDFDocument) {

        pdf.registerFontkit(fontkit);
        const lcarsFontBytes = await fetch(this.getDefaultFontPath()).then(res => res.arrayBuffer());
        const lcarsFont =  await pdf.embedFont(lcarsFontBytes)
        this.formFont = lcarsFont;
        const form = pdf.getForm()
        if (form) {
            const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
            form.updateFieldAppearances = function () {
                return rawUpdateFieldAppearances(lcarsFont);
            };
        }
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await this.initializeFonts(pdf);
    }

    createFileName(suffix: string, construct: Construct): string {
        if (construct.name == null || construct.name.length === 0) {
            return suffix + ".pdf";
        } else {
            var escaped = construct.name.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_');
            return escaped + '-'  + suffix + ".pdf";
        }
    }

}

export class BasicGeneratedHalfPageCharacterSheet extends BasicGeneratedSheet {

    static readonly tealColour: SimpleColor = SimpleColor.from("#39AAA3");
    static readonly goldColour: SimpleColor = SimpleColor.from("#D49F00");
    static readonly redColour: SimpleColor = SimpleColor.from("#C51A1B");
    static readonly blueColour: SimpleColor = SimpleColor.from("#2384B3");
    static readonly greyColour: SimpleColor = SimpleColor.from("#979696");

    static readonly bulletPath = "M 1.98633,0 C 0.88552,0 0,0.887478 0,1.988281 v 2.52539 C 0,5.614474 0.88552,6.5 1.98633,6.5 H 7.35 C 9.1505,6.5 10.6,5.050496 10.6,3.25 10.6,1.449502 9.1505,0 7.35,0 Z";

    layoutHelper = new LayoutHelper();

    nameBlock: Column = new Column(90, 48, 15, 550-90);
    mainBlock: Column = new Column(74, 72, 338-72, 304-74);

    attributeTitleBlock: Column = new Column(322, 72, 13, 550-322);
    departmentTitleBlock: Column = new Column(322, 127, 13, 550-322);
    attacksTitleBlock: Column = new Column(322, 182, 13, 550-322);

    controlBlock: Column = new Column(322, 88, 11, 58);
    daringBlock: Column = new Column(322, 103, 11, 58);
    fitnessBlock: Column = new Column(400, 88, 11, 58);
    insightBlock: Column = new Column(400, 103, 11, 58);
    presenceBlock: Column = new Column(478, 88, 11, 58);
    reasonBlock: Column = new Column(478, 103, 11, 58);

    commandBlock: Column = new Column(322, 143, 11, 58);
    connBlock: Column = new Column(322, 158, 11, 58);
    engineeringBlock: Column = new Column(400, 143, 11, 58);
    securityBlock: Column = new Column(400, 158, 11, 58);
    medicineBlock: Column = new Column(478, 143, 11, 58);
    scienceBlock: Column = new Column(478, 158, 11, 58);

    remainingBlock: Column = new Column(322, 198, 338-198, 550-322);


    textFont: PDFFont;
    boldFont: PDFFont;
    symbolFont: PDFFont;
    headingFont: PDFFont;

    getName(): string {
        return i18next.t(makeKey('Sheet.', "BasicGeneratedHalfPageCharacterSheet"),
            { "defaultValue": "New Half-Page 2nd Ed.-style Character Sheet"});
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/STA_2e_Half_Page_Sheet.png'
    }
    getPdfUrl(): string {
        return "/static/pdf/STA_2e_Half_Page_Sheet.pdf";
    }

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

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        let character = construct as Character;

        const page = pdf.getPage(0);
        const labelFont = new FontSpecification(this.boldFont, this.determineLabelFontSize());

        this.writeCharacterDetails(page, character);

        this.writeLabel(page, i18next.t("Construct.attribute.control"),
            this.controlBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, i18next.t("Construct.attribute.daring"),
            this.daringBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, i18next.t("Construct.attribute.fitness"),
            this.fitnessBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, i18next.t("Construct.attribute.insight"),
            this.insightBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, i18next.t("Construct.attribute.presence"),
            this.presenceBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, i18next.t("Construct.attribute.reason"),
            this.reasonBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);

        this.writeLabel(page, "" + character.attributes[Attribute.Control].value,
            this.valueBlock(this.controlBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, "" + character.attributes[Attribute.Daring].value,
            this.valueBlock(this.daringBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, "" + character.attributes[Attribute.Fitness].value,
            this.valueBlock(this.fitnessBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, "" + character.attributes[Attribute.Insight].value,
            this.valueBlock(this.insightBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, "" + character.attributes[Attribute.Presence].value,
            this.valueBlock(this.presenceBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);
        this.writeLabel(page, "" + character.attributes[Attribute.Reason].value,
            this.valueBlock(this.reasonBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.tealColour);

        this.writeLabel(page, i18next.t("Construct.discipline.command"),
            this.commandBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.goldColour);
        this.writeLabel(page, i18next.t("Construct.discipline.conn"),
            this.connBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.goldColour);
        this.writeLabel(page, i18next.t("Construct.discipline.engineering"),
            this.engineeringBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.redColour);
        this.writeLabel(page, i18next.t("Construct.discipline.security"),
            this.securityBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.redColour);
        this.writeLabel(page, i18next.t("Construct.discipline.science"),
            this.scienceBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.blueColour);
        this.writeLabel(page, i18next.t("Construct.discipline.medicine"),
            this.medicineBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.blueColour);

        this.writeLabel(page, "" + character.skills[Skill.Command].expertise,
            this.valueBlock(this.commandBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.goldColour);
        this.writeLabel(page, "" + character.skills[Skill.Conn].expertise,
            this.valueBlock(this.connBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.goldColour);
        this.writeLabel(page, "" + character.skills[Skill.Engineering].expertise,
            this.valueBlock(this.engineeringBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.redColour);
        this.writeLabel(page, "" + character.skills[Skill.Security].expertise,
            this.valueBlock(this.securityBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.redColour);
        this.writeLabel(page, "" + character.skills[Skill.Science].expertise,
            this.valueBlock(this.scienceBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.blueColour);
        this.writeLabel(page, "" + character.skills[Skill.Medicine].expertise,
            this.valueBlock(this.medicineBlock), labelFont, BasicGeneratedHalfPageCharacterSheet.blueColour);

        this.writeSubTitle(page, i18next.t("Construct.other.attributes"), this.attributeTitleBlock);
        if (character.version > 1) {
            this.writeSubTitle(page, i18next.t("Construct.other.departments"), this.departmentTitleBlock);
        } else {
            this.writeSubTitle(page, i18next.t("Construct.other.disciplines"), this.departmentTitleBlock);
        }

        this.writeName(page, character);

        this.writeSubTitle(page, i18next.t("Construct.other.attacks"), this.attacksTitleBlock);
        let remainingSpace = this.writeAttacks(page, character, this.remainingBlock);
        let remainingColumn = new Column(remainingSpace.x, remainingSpace.y + 16,
            13, this.remainingBlock.width);

        this.writeSubTitle(page, i18next.t("Construct.other.stress"), remainingColumn);
        remainingColumn = this.remainingBlock.bottomAfter(30 + remainingSpace.y - this.remainingBlock.start.y);
        if (remainingColumn) {
            this.writeStressBoxes(page, pdf.getForm(), character, remainingColumn);
        }
    }

    writeStressBoxes(page: PDFPage, form: PDFForm, character: Character, column: Column) {
        let stressBox = "m 1,0 h 7.5 c 0.554,0 1,0.446 1,1 v 7.5 c 0,0.554 -0.446,1 -1,1 H 1 C 0.446,9.5 0,9.054 0,8.5 V 1 C 0,0.446 0.446,0 1,0 Z";

        let x = column.translatedStart(page).x;
        const y = column.translatedStart(page).y;
        for (let i = 0; i < character.stress; i++) {

            page.moveTo(x, y);
            page.drawSvgPath(stressBox, {
                borderColor: SimpleColor.from("#000000").asPdfRbg(),
                borderWidth: 0.5
            });

            let checkbox = form.createCheckBox("Stress " + (i+1));
            checkbox.addToPage(page, {
                x: x + 0.5,
                y: y - 9,
                width: 8.5,
                height: 8.5,
                textColor: SimpleColor.from("#000000").asPdfRbg(),
                borderWidth: 0
            });

            x += 12;
            if (i % 5 === 4) {
                x += 10;
            }
        }
    }

    determineLabelFontSize() {
        let text = [];
        SkillsHelper.getSkills().forEach(s => text.push(i18next.t(makeKey('Construct.discipline.', Skill[s]))));
        AttributesHelper.getAllAttributes().forEach(a => text.push(i18next.t(makeKey('Construct.attribute.', Attribute[a]))));

        let minWidth = [this.controlBlock, this.daringBlock, this.fitnessBlock, this.insightBlock, this.presenceBlock, this.reasonBlock,
            this.commandBlock, this.connBlock, this.engineeringBlock, this.securityBlock, this.scienceBlock, this.medicineBlock].map(b => b.width)
            .sort()[0];

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

    writeCharacterDetails(page: PDFPage, character: Character) {
        let paragraph = new Paragraph(page, this.layoutHelper, this.mainBlock, this.symbolFont);
        paragraph.append(i18next.t("Construct.other.purpose").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), BasicGeneratedHalfPageCharacterSheet.tealColour);
        paragraph.append(character.jobAssignment ?? i18next.t("Common.text.none"), new FontSpecification(this.textFont, 9));
        paragraph.write();

        if (character.pronouns?.length) {
            paragraph = paragraph.nextParagraph();
            paragraph.append(i18next.t("Construct.other.pronouns").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), BasicGeneratedHalfPageCharacterSheet.tealColour);
            paragraph.append(character.pronouns, new FontSpecification(this.textFont, 9));
            paragraph.write();
        }

        if (character.speciesStep?.species != null) {
            paragraph = paragraph.nextParagraph();
            paragraph.append(i18next.t("Construct.other.species").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), BasicGeneratedHalfPageCharacterSheet.tealColour);
            paragraph.append(character.localizedSpeciesName, new FontSpecification(this.textFont, 9));
            paragraph.write();
        }

        paragraph = paragraph.nextParagraph();
        paragraph.append(i18next.t("Construct.other.traits").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), BasicGeneratedHalfPageCharacterSheet.tealColour);
        paragraph.append(character.getAllTraits(), new FontSpecification(this.textFont, 9));
        paragraph.write();

        if (character.focuses?.length) {
            paragraph = paragraph.nextParagraph();
            paragraph.append(i18next.t("Construct.other.focuses").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), BasicGeneratedHalfPageCharacterSheet.tealColour);
            paragraph.append(character.focuses.join(", "), new FontSpecification(this.textFont, 9));
            paragraph.write();
        }
    }

    writeName(page: PDFPage, character: Character) {
        if (character.name?.length) {
            let name = character.name;
            let rank = character.rank?.localizedAbbreviation;
            if (rank) {
                name = rank + " " + name;
            }
            const textBlock = TextBlock.create(name.toLocaleUpperCase(), new FontSpecification(this.headingFont, 10), false);
            let y = this.nameBlock.end.y - 3 - ((this.nameBlock.height - textBlock.height) / 2);
            let x = this.nameBlock.start.x;

            let endX = this.nameBlock.start.x + textBlock.width + 15;

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
                color: BasicGeneratedHalfPageCharacterSheet.tealColour.asPdfRbg(),
                borderWidth: 0
            });

            textBlock.writeToPage(x, page.getHeight() - y, page, SimpleColor.from("#ffffff"));
        }
    }

    valueBlock(block: Column) {
        return new Column(block.end.x + 1, block.start.y, block.height, 10);
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
            color: BasicGeneratedHalfPageCharacterSheet.greyColour.asPdfRbg()
        });

        let end = block.start.x + lead + 4 + textBlock.width + 4;
        if (end < block.end.x) {
            page.drawLine({
                start: { x: end, y: page.getHeight() - (y + 3 - block.height / 2) },
                end: { x: block.end.x, y: page.getHeight() - (y + 3 - block.height / 2) },
                thickness: 1,
                color: BasicGeneratedHalfPageCharacterSheet.greyColour.asPdfRbg()
            });
        }
    }

    writeLabel(page: PDFPage, text: string, block: Column, font: FontSpecification, colour: SimpleColor) {
        const textBlock = TextBlock.create(text.toLocaleUpperCase(), font, false);
        let y = block.end.y - 1 - ((block.height - textBlock.height) / 2);
        let x = block.start.x + (block.width - textBlock.width);

        textBlock.writeToPage(x, page.getHeight() - y, page, colour);
    }

    writeAttacks(page: PDFPage, character: Character, column: Column) {

        let indentedColumn = new Column(column.start.x + 15, column.start.y, column.height, column.width - 15);

        let bold = new FontSpecification(this.boldFont, 9);
        let standard = new FontSpecification(this.textFont, 9);
        let security = character.skills[Skill.Security].expertise;

        let paragraph = null;
        let bottom = column.start;

        character.determineWeapons().forEach(w => {
            let type = w.type === WeaponType.MELEE ? i18next.t("Weapon.common.melee") : i18next.t("Weapon.common.ranged");
            let qualities = w.qualities.map(q => q.localizedDescription).join(", ");
            let text = type + ", " + (w.dice + security) + CHALLENGE_DICE_NOTATION + ", " + qualities
                + (w.hands != null ? ", " + i18next.t("Weapon.common.size", { hands: w.hands }) : "");

            paragraph = paragraph == null ? new Paragraph(page, this.layoutHelper, indentedColumn, this.symbolFont) : paragraph.nextParagraph(0);
            paragraph.append(w.name + ": ", bold);
            paragraph.append(text, standard);
            paragraph.write();

            if (paragraph.lines.length) {
                let location = paragraph.lines[0].location;
                page.moveTo(column.start.x, page.getHeight() - (location.y + paragraph.lines[0].height() + 3));
                page.drawSvgPath(BasicGeneratedHalfPageCharacterSheet.bulletPath, {
                    color: BasicGeneratedHalfPageCharacterSheet.tealColour.asPdfRbg(),
                    borderWidth: 0
                });
            }

            bottom = paragraph.bottom;
        });

        return new XYLocation(column.start.x, bottom.y);
    }
}