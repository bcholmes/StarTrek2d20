import { PDFDocument, PDFFont, PDFPage } from "@cantoo/pdf-lib";
import { Column, FontSpecification, ICharacterSheet, TextBlock } from "./icharactersheet";
import fontkit from '@pdf-lib/fontkit'
import { Construct } from "../common/construct";
import i18next from "i18next";
import { makeKey } from "../common/translationKey";
import { SimpleColor } from "../common/colour";
import { Character } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { Skill } from "../helpers/skills";

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


    attributeTitleBlock: Column = new Column(322, 72, 13, 550-322);
    departmentTitleBlock: Column = new Column(322, 127, 13, 550-322);

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
    scienceBlock: Column = new Column(478, 143, 11, 58);
    medicineBlock: Column = new Column(478, 158, 11, 58);

    textFont: PDFFont;
    boldFont: PDFFont;
    headingFont: PDFFont;

    getName(): string {
        return i18next.t(makeKey('Sheet.', "BasicGeneratedHalfPageCharacterSheet"),
            { "defaultValue": "New 2nd Ed.-style Character Sheet"});
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
        const fontBytes = await fetch("/static/font/Michroma-Regular.ttf").then(res => res.arrayBuffer());
        this.headingFont = await pdf.embedFont(fontBytes);

        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        this.boldFont = await pdf.embedFont(boldFontBytes);
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        let character = construct as Character;

        const page = pdf.getPage(0);
        const labelFont = new FontSpecification(this.boldFont, 8.5);

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

        this.writeLabel(page, i18next.t("Construct.department.command"),
            this.commandBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.goldColour);
        this.writeLabel(page, i18next.t("Construct.department.conn"),
            this.connBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.goldColour);
        this.writeLabel(page, i18next.t("Construct.department.engineering"),
            this.engineeringBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.redColour);
        this.writeLabel(page, i18next.t("Construct.department.security"),
            this.securityBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.redColour);
        this.writeLabel(page, i18next.t("Construct.department.science"),
            this.scienceBlock, labelFont, BasicGeneratedHalfPageCharacterSheet.blueColour);
        this.writeLabel(page, i18next.t("Construct.department.medicine"),
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
}