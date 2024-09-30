import { PDFDocument, PDFForm, PDFPage } from "@cantoo/pdf-lib";
import { SimpleColor } from "../common/colour";
import { BaseNonForm2eSheet } from "./generated2eBaseSheet";
import { SheetTag } from "./icharactersheet";
import i18next from "i18next";
import { makeKey } from "../common/translationKey";
import { Attribute } from "../helpers/attributes";
import { Skill } from "../helpers/skills";
import { Character, Division } from "../common/character";
import { Paragraph } from "./paragraph";
import { FontSpecification } from "./fontSpecification";
import { Construct } from "../common/construct";
import { Column } from "./column";
import { XYLocation } from "../common/xyLocation";
import { FontOptions } from "./fontOptions";
import { FontType } from "./fontLibrary";
import { bullet2EWriter } from "./bullet2eWriter";
import { divisionColour2e, tealColour2e } from "./colourProvider2e";

export class BasicGeneratedHalfPageCharacterSheet extends BaseNonForm2eSheet {

    mainBlock: Column = new Column(59, 72, 338-72, 304-59);

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

    getTags(): SheetTag[] {
        return [ SheetTag.HalfPage, SheetTag.Style2e, SheetTag.LanguageSupport ];
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        let character = construct as Character;

        const page = pdf.getPage(0);
        const labelFont = new FontSpecification(this.boldFont, this.determineLabelFontSize(character));

        let bottom = this.writeCharacterDetails(page, character);
        this.writeSpeciesAbility(page, character, bottom);

        this.writeLabel(page, i18next.t("Construct.attribute.control"),
            this.controlBlock, labelFont, tealColour2e);
        this.writeLabel(page, i18next.t("Construct.attribute.daring"),
            this.daringBlock, labelFont, tealColour2e);
        this.writeLabel(page, i18next.t("Construct.attribute.fitness"),
            this.fitnessBlock, labelFont, tealColour2e);
        this.writeLabel(page, i18next.t("Construct.attribute.insight"),
            this.insightBlock, labelFont, tealColour2e);
        this.writeLabel(page, i18next.t("Construct.attribute.presence"),
            this.presenceBlock, labelFont, tealColour2e);
        this.writeLabel(page, i18next.t("Construct.attribute.reason"),
            this.reasonBlock, labelFont, tealColour2e);

        this.writeLabel(page, "" + character.attributes[Attribute.Control].value,
            this.valueBlock(this.controlBlock), labelFont, tealColour2e);
        this.writeLabel(page, "" + character.attributes[Attribute.Daring].value,
            this.valueBlock(this.daringBlock), labelFont, tealColour2e);
        this.writeLabel(page, "" + character.attributes[Attribute.Fitness].value,
            this.valueBlock(this.fitnessBlock), labelFont, tealColour2e);
        this.writeLabel(page, "" + character.attributes[Attribute.Insight].value,
            this.valueBlock(this.insightBlock), labelFont, tealColour2e);
        this.writeLabel(page, "" + character.attributes[Attribute.Presence].value,
            this.valueBlock(this.presenceBlock), labelFont, tealColour2e);
        this.writeLabel(page, "" + character.attributes[Attribute.Reason].value,
            this.valueBlock(this.reasonBlock), labelFont, tealColour2e);

        this.writeLabel(page, i18next.t("Construct.discipline.command"),
            this.commandBlock, labelFont, divisionColour2e(construct.era, Division.Command));
        this.writeLabel(page, i18next.t("Construct.discipline.conn"),
            this.connBlock, labelFont, divisionColour2e(construct.era, Division.Command));
        this.writeLabel(page, i18next.t("Construct.discipline.engineering"),
            this.engineeringBlock, labelFont, divisionColour2e(construct.era, Division.Operations));
        this.writeLabel(page, i18next.t("Construct.discipline.security"),
            this.securityBlock, labelFont, divisionColour2e(construct.era, Division.Operations));
        this.writeLabel(page, i18next.t("Construct.discipline.science"),
            this.scienceBlock, labelFont, divisionColour2e(construct.era, Division.Science));
        this.writeLabel(page, i18next.t("Construct.discipline.medicine"),
            this.medicineBlock, labelFont, divisionColour2e(construct.era, Division.Science));

        this.writeLabel(page, "" + character.skills[Skill.Command].expertise,
            this.valueBlock(this.commandBlock), labelFont, divisionColour2e(construct.era, Division.Command));
        this.writeLabel(page, "" + character.skills[Skill.Conn].expertise,
            this.valueBlock(this.connBlock), labelFont, divisionColour2e(construct.era, Division.Command));
        this.writeLabel(page, "" + character.skills[Skill.Engineering].expertise,
            this.valueBlock(this.engineeringBlock), labelFont, divisionColour2e(construct.era, Division.Operations));
        this.writeLabel(page, "" + character.skills[Skill.Security].expertise,
            this.valueBlock(this.securityBlock), labelFont, divisionColour2e(construct.era, Division.Operations));
        this.writeLabel(page, "" + character.skills[Skill.Science].expertise,
            this.valueBlock(this.scienceBlock), labelFont, divisionColour2e(construct.era, Division.Science));
        this.writeLabel(page, "" + character.skills[Skill.Medicine].expertise,
            this.valueBlock(this.medicineBlock), labelFont, divisionColour2e(construct.era, Division.Science));

        this.writeSubTitle(page, i18next.t("Construct.other.attributes"), this.attributeTitleBlock);
        if (character.version > 1) {
            this.writeSubTitle(page, i18next.t("Construct.other.departments"), this.departmentTitleBlock);
        } else {
            this.writeSubTitle(page, i18next.t("Construct.other.disciplines"), this.departmentTitleBlock);
        }

        this.writeCharacterName(page, character);

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

    determineLabelFontSize(character: Character) {
        let text = this.determineAllStatLabels(character);

        let minWidth = [this.controlBlock, this.daringBlock, this.fitnessBlock, this.insightBlock, this.presenceBlock, this.reasonBlock,
            this.commandBlock, this.connBlock, this.engineeringBlock, this.securityBlock, this.scienceBlock, this.medicineBlock].map(b => b.width)
            .sort()[0];

        return this.determineFontSizeForWidth(text, minWidth);
    }

    writeCharacterDetails(page: PDFPage, character: Character) {
        let paragraph = new Paragraph(page, this.mainBlock, this.fonts);
        paragraph.append(i18next.t("Construct.other.purpose").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), tealColour2e);
        paragraph.append(character.jobAssignment ?? i18next.t("Common.text.none"), new FontSpecification(this.textFont, 9));
        paragraph.write();

        if (character.pronouns?.length) {
            paragraph = paragraph?.nextParagraph();
            paragraph?.append(i18next.t("Construct.other.pronouns").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), tealColour2e);
            paragraph?.append(character.pronouns, new FontSpecification(this.textFont, 9));
            paragraph?.write();
        }

        paragraph = paragraph?.nextParagraph();
        paragraph?.append(i18next.t("Construct.other.speciesAndTraits").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), tealColour2e);
        paragraph?.append(character.getAllTraits(), new FontSpecification(this.textFont, 9));
        paragraph?.write();

        if (character.focuses?.length) {
            paragraph = paragraph?.nextParagraph();
            paragraph?.append(i18next.t("Construct.other.focuses").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), tealColour2e);
            paragraph?.append(character.focuses.join(", "), new FontSpecification(this.textFont, 9));
            paragraph?.write();
        }

        if (character.values?.length) {
            paragraph = paragraph?.nextParagraph();
            paragraph?.append(i18next.t("Construct.other.values").toLocaleUpperCase() + ":", new FontOptions(9, FontType.Bold), tealColour2e);
            paragraph?.write();

            character.values.forEach((v, i) => {
                paragraph = paragraph?.nextParagraph();
                paragraph?.indent(15);
                paragraph?.append(v, new FontOptions(9));
                paragraph?.write();

                bullet2EWriter(page, paragraph, tealColour2e);
            })
        }

        return paragraph?.bottom;
    }

    writeSpeciesAbility(page: PDFPage, character: Character, offset: XYLocation) {
        if (character.version > 1 && character.speciesStep?.ability) {
            let column = this.mainBlock.bottomAfter(offset.y - this.mainBlock.start.y + 16);
            this.writeSubTitle(page, i18next.t("Construct.other.speciesAbility"), column.topBefore(13));

            column = column.bottomAfter(16);
            let paragraph = new Paragraph(page, column, this.fonts);
            paragraph.append(character.speciesStep.ability.name + ": ", new FontOptions(9, FontType.Bold), tealColour2e);
            paragraph.append(character.speciesStep.ability.description, new FontOptions(9));
            paragraph.write();
        }
    }

    writeCharacterName(page: PDFPage, character: Character) {
        if (character.name?.length) {
            let name = character.name;
            let rank = character.rank?.localizedAbbreviation;
            if (rank) {
                name = rank + " " + name;
            }
            this.writeName(page, name, tealColour2e);
        }
    }


}