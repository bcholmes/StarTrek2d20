import { PDFDocument, PDFForm, PDFPage } from "@cantoo/pdf-lib";
import { XYLocation } from "../common/xyLocation";
import { BaseTNGGeneratedCharacterSheet } from "./baseTngGeneratedCharacterSheet";
import { SheetTag } from "./icharactersheet";
import { Character } from "../common/character";
import { SimpleColor } from "../common/colour";
import i18next from "i18next";
import { CharacterSerializer } from "../common/characterSerializer";
import { TalentsHelper } from "../helpers/talents";
import { Column } from "./column";

export class GeneratedTngPortraitCharacterSheet extends BaseTNGGeneratedCharacterSheet {

    static readonly headingColumn = new Column(167.9, 12.9, 17.8, 401);

    getName(): string {
        return i18next.t("Sheet.generatedTngPortraitCharacterSheet")
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/TNG_Standard_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return '/static/pdf/TNG_Standard_Character_Sheet.pdf'
    }

    getTags(): SheetTag[] {
        return [ SheetTag.Portrait, SheetTag.Lcars, SheetTag.LanguageSupport, SheetTag.UsLetter ]
    }

    get subTitleLocations() {
        return {
            "attacks": new Column(184.6, 604.1, 12.1, 187.8),
            "attributes": new Column(184.6, 188.2, 12.1, 187.8),
            "disciplines": new Column(184.6, 260.1, 12.1, 187.8),
            "equipment": new Column(422.4, 604.1, 12.1, 130.0),
            "focuses": new Column(422.4, 188.1, 12.1, 130.0),
            "injuries": new Column(422.4, 508.1, 12.1, 130.0),
            "stress": new Column(422.4, 418.1, 12.1, 130.0),
            "talents": new Column(184.6, 472, 12.1, 187.8),
            "values": new Column(184.6, 358.1, 12.1, 187.8),
        }
    }

    get stressPill() {
        return "M 20.939,4.962 C 20.939,2.226 18.837,0 16.252,0 H 11.066 L 9.873,0.0001 4.687,0 C 2.103,0 0,2.226 0,4.962 0,7.698 2.103,9.924 4.687,9.924 h 5.186 l 1.193,-0.0001 h 5.186 c 2.585,0 4.687,-2.225 4.687,-4.961 z";
    }

    get stressPillLocations() {
        return [
            new XYLocation(407.7, 436.7),
            new XYLocation(435.6, 436.7),
            new XYLocation(463.5, 436.7),
            new XYLocation(491.5, 436.7),
            new XYLocation(519.4, 436.7),
            new XYLocation(547.4, 436.7),

            new XYLocation(407.7, 453),
            new XYLocation(435.6, 453),
            new XYLocation(463.5, 453),
            new XYLocation(491.5, 453),
            new XYLocation(519.4, 453),
            new XYLocation(547.4, 453),

            new XYLocation(407.7, 469.4),
            new XYLocation(435.6, 469.4),
            new XYLocation(463.5, 469.4),
            new XYLocation(491.5, 469.4),
            new XYLocation(519.4, 469.4),
            new XYLocation(547.4, 469.4),

            new XYLocation(407.7, 485.8),
            new XYLocation(435.6, 485.8),
            new XYLocation(463.5, 485.8),
            new XYLocation(491.5, 485.8),
            new XYLocation(519.4, 485.8),
            new XYLocation(547.4, 485.8),
        ];
    }

    get statLocations() {
        return {
            "Construct.attribute.control": new Column(175.5, 210.4, 9, 46),
            "Construct.attribute.fitness": new Column(247.7, 210.4, 9, 46),
            "Construct.attribute.presence": new Column(322.5, 210.4, 9, 46),

            "Construct.attribute.daring": new Column(175.5, 234.5, 9, 46),
            "Construct.attribute.insight": new Column(247.7, 234.5, 9, 46),
            "Construct.attribute.reason": new Column(322.5, 234.5, 9, 46),


            "Construct.discipline.command": new Column(175.5, 282.5, 9, 46),
            "Construct.discipline.security": new Column(247.7, 282.5, 9, 46),
            "Construct.discipline.science": new Column(322.5, 282.5, 9, 46),

            "Construct.discipline.conn": new Column(175.5, 306.5, 9, 46),
            "Construct.discipline.engineering": new Column(247.7, 306.5, 9, 46),
            "Construct.discipline.medicine": new Column(322.5, 306.5, 9, 46),


            "Construct.other.resistance": new Column(175.5, 336.5, 9, 46),
            "Construct.other.reputation": new Column(247.7, 336.5, 9, 46),
            "Construct.other.reprimands": new Column(322.5, 336.5, 9, 46),
        };
    }

    get pillSize() {
        return {
            height: 9.9,
            width: 20.9
        };
    }

    get determinationPills() {
        return [
            new Column(304, 448.7, 11, 23.1),
            new Column(334.7, 448.7, 11, 23.1),
            new Column(365.4, 448.7, 11, 23.1)
        ];
    }

    get determinationLabelBlock() {
        return new Column(169.2, 448.1, 12.1, 116.5);
    }

    get detailLabels() {
        return {
            "Construct.other.name": new Column(169.3, 43.1, 12.1, 66.8),
            "Construct.other.rank": new Column(378, 61.1, 12.1, 66.8),
            "Construct.other.assignment": new Column(169.3, 97.1, 12.1, 66.8),
            "Construct.other.species": new Column(169.3, 61.1, 12.1, 66.8),
            "Construct.other.traits": new Column(169.3, 115.1, 12.1, 66.8),
            "Construct.other.environment": new Column(169.3, 79.1, 12.1, 66.8),
            "Construct.other.upbringing": new Column(378, 79.1, 12.1, 66.8),
        };
    }

    populateForm(form: PDFForm, character: Character): void {
        super.populateForm(form, character);
        this.fillTalents(form, character);
    }


    writeStress(pdf: PDFDocument, page: PDFPage, character: Character, colour: SimpleColor = BaseTNGGeneratedCharacterSheet.purpleColour) {
        super.writeStress(pdf, page, character, GeneratedTngPortraitCharacterSheet.lightPurpleColour);
    }

    writeTitle(page: PDFPage) {
        const originalText = i18next.t("Sheet.text.title").toLocaleUpperCase();
        let text = originalText;
        const fontSize = this.determineIdealFontWidth([ text ],
            GeneratedTngPortraitCharacterSheet.headingColumn.width, 25, 18);
        const block = GeneratedTngPortraitCharacterSheet.headingColumn;
        let width = this.headingFont.widthOfTextAtSize(text, fontSize);
        while (width > block.width) {
            text = text.substring(0, text.length-1);
            width = this.headingFont.widthOfTextAtSize(text + "...", fontSize);
        }

        if (text !== originalText) {
            text += "...";
        }

        page.drawText(text, {
            x:  GeneratedTngPortraitCharacterSheet.headingColumn.start.x + GeneratedTngPortraitCharacterSheet.headingColumn.width - block.start.x,
            y: page.getHeight() - (block.end.y),
            color: GeneratedTngPortraitCharacterSheet.orangeColour.asPdfRbg(),
            font: this.headingFont,
            size: fontSize
        });
    }

    writeDetailLabels(page: PDFPage, colour?: SimpleColor): void {
        super.writeDetailLabels(page, SimpleColor.from("#9676A9"));
    }

    writeWeaponLabels(page: PDFPage) {
        let fontSize = this.determineIdealFontWidth(
            [i18next.t("Weapon.common.name").toLocaleUpperCase(),
            i18next.t("Weapon.common.qualities").toLocaleUpperCase()],
            41.5, 12.5, 8);

        let offset = 680.6 - 626.1;
        for (let i = 0; i < 4; i++) {
            let block = new Column(173.3, 626.1 + (offset * i), 10.1, 41.5);
            this.writeLabel(page, i18next.t("Weapon.common.name").toLocaleUpperCase(), fontSize, block,
                SimpleColor.from("#ffffff"), "", true);

            let block2 = new Column(173.3, 650.6 + (offset * i), 10.1, 41.5);
            this.writeLabel(page, i18next.t("Weapon.common.qualities").toLocaleUpperCase(), fontSize, block2,
                SimpleColor.from("#ffffff"), "", true);
        };
    }

    fillTalents(form: PDFForm, character: Character) {
        let i = 1;
        for (var t of character.getDistinctTalentNameList()) {
            let talent = TalentsHelper.getTalent(t);
            if (talent && talent.maxRank > 1) {
                this.fillField(form, 'Talent ' + i, talent.localizedDisplayName + " [Rank " + character.getRankForTalent(t) + "]");
            } else {
                this.fillField(form, 'Talent ' + i, talent.localizedDisplayName);
            }
            i++;
        }
    }

    fillName(form: PDFForm, character: Character) {
        this.fillField(form, 'Name', this.formatName(character));
    }

    formatNameWithoutPronouns(character: Character) {
        return CharacterSerializer.serializeName(character);
    }

    formatName(character: Character) {
        let name = this.formatNameWithoutPronouns(character);
        if (character?.pronouns?.length > 0) {
            name += " (" + character.pronouns + ")";
        }
        return name;
    }

    fillEquipment(form: PDFForm, character: Character) {
        character.equipmentAndImplants.forEach((e, i) => {
            this.fillField(form, 'Equipment ' + (i+1), e.localizedName);
        });
    }

    serializeAssignment(character: Character) {
        let result = this.serializeBasicAssignment(character);
        if (character.assignedShip != null) {
            if (result) {
                result += ", ";
            } else {
                result = "";
            }
            result += character.assignedShip;
        }
        return result;
    }

    serializeBasicAssignment(character: Character) {
        return character.localizedAssignmentWithoutShip;
    }
}
