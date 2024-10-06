import { PDFDocument, PDFForm, PDFPage } from "@cantoo/pdf-lib";
import { SimpleColor } from "../common/colour";
import { BaseNonForm2eSheet } from "./generated2eBaseSheet";
import { SheetTag } from "./icharactersheet";
import i18next from "i18next";
import { makeKey } from "../common/translationKey";
import { Attribute } from "../helpers/attributes";
import { Skill } from "../helpers/skills";
import { Character } from "../common/character";
import { Paragraph } from "./paragraph";
import { FontSpecification } from "./fontSpecification";
import { Construct } from "../common/construct";
import { Column } from "./column";
import { XYLocation } from "../common/xyLocation";
import { FontOptions } from "./fontOptions";
import { FontType } from "./fontLibrary";
import { bullet2EWriter } from "./bullet2eWriter";
import { labelColourProvider, tealColour2e } from "./colourProvider2e";
import { labelWriter, VerticalAlignment } from "./labelWriter";
import { TextAlign } from "./textAlign";
import { assembleWritableItems } from "./generatedsheet";
import { SpeciesAbility } from "../helpers/speciesAbility";

export class BasicGeneratedHalfPageCharacterSheet extends BaseNonForm2eSheet {

    secondBlock: Column = new Column(314, 72, 338-72, 552-314);
    mainBlock: Column = new Column(59, 72, 338-72, 298-59, this.secondBlock);

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
        this.writeCharacterName(page, character);

        let bottom = this.writeCharacterDetails(page, character);

        let remainingColumn = this.mainBlock.bottomAfter(bottom.y - this.mainBlock.start.y + 16);
        remainingColumn = this.writeStatBoxes(page, remainingColumn, character);

        if (remainingColumn.height <= 40) {
            remainingColumn = remainingColumn.nextColumn;
        }

        this.writeSubTitle(page, i18next.t("Construct.other.attacks"), remainingColumn.topBefore(13));
        remainingColumn = remainingColumn.bottomAfter(16);

        remainingColumn = this.writeAttacks(page, character, remainingColumn);

        if (character.isStressTrackPresent) {
            if (remainingColumn.height <= 40) {
                remainingColumn = remainingColumn.nextColumn;
            } else {
                remainingColumn = remainingColumn.bottomAfter(16);
            }

            this.writeSubTitle(page, i18next.t("Construct.other.stress"), remainingColumn.topBefore(13));
            remainingColumn = remainingColumn.bottomAfter(16);
            if (remainingColumn) {
                remainingColumn = this.writeStressBoxes(page, pdf.getForm(), character, remainingColumn);
            }
        }

        if (remainingColumn.height <= 40) {
            remainingColumn = remainingColumn.nextColumn;
        } else {
            remainingColumn = remainingColumn.bottomAfter(15);
        }
        this.writeSpeciesAbility(page, character, remainingColumn);
    }

    writeStatBoxes(page: PDFPage, column: Column, character: Character) {

        this.writeSubTitle(page, i18next.t("Construct.other.attributes"), column.topBefore(13));
        column = column.bottomAfter(5 + 13);

        let boxes = new XYLocation(column.start.x, column.start.y);
        const statFrame = "M 2.835,0 C 1.269,0 0,1.269 0,2.835 V 9 c 0,1.565 1.269,2.835 2.835,2.835 h 66.567 c 1.565,0 2.835,-1.27 2.835,-2.835 V 2.835 C 72.237,1.269 70.967,0 69.402,0 Z";

        const rowHeight = 16;
        let labels = {};
        [Attribute.Control, Attribute.Fitness, Attribute.Presence, Attribute.Daring, Attribute.Insight, Attribute.Reason].forEach((a, i) => {

            let location = new XYLocation(boxes.x + i % 3 * 81, boxes.y + Math.floor(i / 3) * rowHeight);
            let x = location.x;
            const y = page.getHeight() - location.y;
            page.moveTo(x, y);
            page.drawSvgPath(statFrame, {
                borderColor: SimpleColor.from("#979696").asPdfRbg(),
                borderWidth: 0.5
            });

            let labelColumn = new Column(x + 2, location.y, 11.8, 72.2 * 0.8);
            const key = i18next.t(makeKey("Construct.attribute.", Attribute[a]));
            labels[key] = labelColumn;

            this.writeLabel(page, "" + character.attributes[a].value, this.valueBlock(labelColumn), new FontSpecification(this.boldFont, 9),
                tealColour2e);
        });

        column = column.bottomAfter(10 + 2 * rowHeight);
        if (character.version > 1) {
            this.writeSubTitle(page, i18next.t("Construct.other.departments"), column.topBefore(13));
        } else {
            this.writeSubTitle(page, i18next.t("Construct.other.disciplines"), column.topBefore(13));
        }
        column = column.bottomAfter(5 + 13);

        boxes = new XYLocation(column.start.x, column.start.y);
        [Skill.Command, Skill.Engineering, Skill.Medicine, Skill.Conn, Skill.Security, Skill.Science].forEach((s, i) => {

            let location = new XYLocation(boxes.x + i % 3 * 81, boxes.y + Math.floor(i / 3) * rowHeight);
            let x = location.x;
            const y = page.getHeight() - location.y;
            page.moveTo(x, y);
            page.drawSvgPath(statFrame, {
                borderColor: SimpleColor.from("#979696").asPdfRbg(),
                borderWidth: 0.5
            });

            let labelColumn = new Column(x + 2, location.y, 11.8, 72.2 * 0.8);
            const key = makeKey("Construct.discipline.", Skill[s]);
            labels[key] = labelColumn;

            this.writeLabel(page, "" + character.departments[s], this.valueBlock(labelColumn), new FontSpecification(this.boldFont, 9),
                labelColourProvider(character.era, key));
        });

        labelWriter(page, labels, character.version, this.boldFont, 9, (label) => labelColourProvider(character.era, label),
            TextAlign.Right, "", VerticalAlignment.Middle);

        return column.bottomAfter(10 + 2 * rowHeight);
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

        const height = 10;
        const result = column.bottomAfter(height);
        return result == null ? column.nextColumn : result;
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
                paragraph = paragraph?.nextParagraph(0.2);
                paragraph?.indent(15);
                paragraph?.append(v, new FontOptions(9));
                paragraph?.write();

                bullet2EWriter(page, paragraph, tealColour2e);
            })
        }

        return paragraph?.bottom;
    }

    writeSpeciesAbility(page: PDFPage, character: Character, column: Column) {
        let items = assembleWritableItems(character);

        if (character.version > 1 && items.length > 0) {
            if (items.length === 1 && items[0] instanceof SpeciesAbility) {
                this.writeSubTitle(page, i18next.t("Construct.other.speciesAbility"), column.topBefore(13));
            } else {
                this.writeSubTitle(page, i18next.t("Construct.other.specialRules"), column.topBefore(13));
            }

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