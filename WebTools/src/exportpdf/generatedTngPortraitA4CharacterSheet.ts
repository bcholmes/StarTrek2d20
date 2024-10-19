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
import { Construct } from "../common/construct";

export class GeneratedTngPortraitA4CharacterSheet extends BaseTNGGeneratedCharacterSheet {

    static readonly headingColumn = new Column(251.3, 20.6, 17.8, 307.9);

    getName(): string {
        return i18next.t("Sheet.generatedTngPortraitA4CharacterSheet")
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/TNG_Standard_A4_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return '/static/pdf/TNG_Standard_A4_Character_Sheet.pdf'
    }

    getTags(): SheetTag[] {
        return [ SheetTag.Portrait, SheetTag.Lcars, SheetTag.LanguageSupport, SheetTag.A4 ]
    }

    get subTitleLocations() {
        return {
            "attacks": new Column(175.2, 621.1, 12.1, 187.8),
            "attributes": new Column(175.2, 200.5, 12.1, 187.8),
            "departments": new Column(175.2, 272.1, 12.1, 187.8),
            "equipment": new Column(422.4, 622.1, 12.1, 130.0),
            "focuses": new Column(422.4, 200.5, 12.1, 130.0),
            "injuries": new Column(422.4, 514, 12.1, 130.0),
            "stress": new Column(422.4, 404.2, 12.1, 130.0),
            "talents": new Column(175.2, 465, 12.1, 187.8),
            "values": new Column(175.2, 344.3, 12.1, 187.8),
        }
    }

    get stressPill() {
        return "M 20.939,4.962 C 20.939,2.226 18.837,0 16.252,0 H 11.066 L 9.873,0.0001 4.687,0 C 2.103,0 0,2.226 0,4.962 0,7.698 2.103,9.924 4.687,9.924 h 5.186 l 1.193,-0.0001 h 5.186 c 2.585,0 4.687,-2.225 4.687,-4.961 z";
    }

    get stressPillLocations() {
        return [
            new XYLocation(409.9, 422.7),
            new XYLocation(441.7, 422.7),
            new XYLocation(473.6, 422.7),
            new XYLocation(505.5, 422.7),
            new XYLocation(537.4, 422.7),

            new XYLocation(409.9, 439.1),
            new XYLocation(441.7, 439.1),
            new XYLocation(473.6, 439.1),
            new XYLocation(505.5, 439.1),
            new XYLocation(537.4, 439.1),

            new XYLocation(409.9, 455.4),
            new XYLocation(441.7, 455.4),
            new XYLocation(473.6, 455.4),
            new XYLocation(505.5, 455.4),
            new XYLocation(537.4, 455.4),

            new XYLocation(409.9, 471.7),
            new XYLocation(441.7, 471.7),
            new XYLocation(473.6, 471.7),
            new XYLocation(505.5, 471.7),
            new XYLocation(537.4, 471.7),

            new XYLocation(409.9, 488.1),
            new XYLocation(441.7, 488.1),
            new XYLocation(473.6, 488.1),
            new XYLocation(505.5, 488.1),
            new XYLocation(537.4, 488.1),
        ];
    }

    get statLocations() {
        return {
            "Construct.attribute.control": new Column(164.7, 222.9, 9, 46),
            "Construct.attribute.fitness": new Column(249.2, 222.9, 9, 46),
            "Construct.attribute.presence": new Column(330.5, 222.9, 9, 46),

            "Construct.attribute.daring": new Column(164.7, 247.1, 9, 46),
            "Construct.attribute.insight": new Column(249.2, 247.1, 9, 46),
            "Construct.attribute.reason": new Column(330.5, 247.1, 9, 46),


            "Construct.discipline.command": new Column(164.7, 294.8, 9, 46),
            "Construct.discipline.security": new Column(249.2, 294.8, 9, 46),
            "Construct.discipline.science": new Column(330.5, 294.8, 9, 46),

            "Construct.discipline.conn": new Column(164.7, 318.8, 9, 46),
            "Construct.discipline.engineering": new Column(249.2, 318.8, 9, 46),
            "Construct.discipline.medicine": new Column(330.5, 318.8, 9, 46),

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
            new Column(309.3, 441.7, 11, 23.1),
            new Column(339.9, 441.7, 11, 23.1),
            new Column(370.6, 441.7, 11, 23.1)
        ];
    }

    get determinationLabelBlock() {
        return new Column(159.7, 441.2, 12.1, 144.8);
    }

    get detailLabels() {
        return {
            "Construct.other.name": new Column(159.9, 50.8, 12.1, 66.8),
            "Construct.other.rank": new Column(368.2, 68.8, 12.1, 66.8),
            "Construct.other.assignment": new Column(159.9, 104.7, 12.1, 66.8),
            "Construct.other.species": new Column(159.9, 68.8, 12.1, 66.8),
            "Construct.other.traits": new Column(159.9, 121.7, 12.1, 66.8),
            "Construct.other.environment": new Column(159.9, 86.7, 12.1, 66.8),
            "Construct.other.upbringing": new Column(368.2, 86.7, 12.1, 66.8),
        };
    }

    populateForm(form: PDFForm, character: Character): void {
        super.populateForm(form, character);
        this.fillTalents(form, character);
    }


    writeStress(pdf: PDFDocument, page: PDFPage, character: Character, colour: SimpleColor = BaseTNGGeneratedCharacterSheet.purpleColour) {
        super.writeStress(pdf, page, character, GeneratedTngPortraitA4CharacterSheet.lightPurpleColour);
    }

    writeTitle(page: PDFPage) {
        const originalText = i18next.t("Sheet.text.title").toLocaleUpperCase();
        let text = originalText;
        const fontSize = this.determineIdealFontWidth([ text ],
            GeneratedTngPortraitA4CharacterSheet.headingColumn.width, 25, 18, this.headingFont);
        const block = GeneratedTngPortraitA4CharacterSheet.headingColumn;
        let width = this.headingFont.widthOfTextAtSize(text, fontSize);
        while (width > block.width) {
            text = text.substring(0, text.length-1);
            width = this.headingFont.widthOfTextAtSize(text + "...", fontSize);
        }

        if (text !== originalText) {
            text += "...";
        }

        page.drawText(text, {
            x:  GeneratedTngPortraitA4CharacterSheet.headingColumn.start.x + GeneratedTngPortraitA4CharacterSheet.headingColumn.width - width,
            y: page.getHeight() - (block.end.y),
            color: GeneratedTngPortraitA4CharacterSheet.orangeColour.asPdfRbg(),
            font: this.headingFont,
            size: fontSize
        });
    }

    writeDetailLabels(page: PDFPage, construct: Construct, colour?: SimpleColor): void {
        super.writeDetailLabels(page, construct, SimpleColor.from("#9676A9"));
    }

    writeWeaponLabels(page: PDFPage) {
        let fontSize = this.determineIdealFontWidth(
            [i18next.t("Weapon.common.name").toLocaleUpperCase(),
            i18next.t("Weapon.common.qualities").toLocaleUpperCase()],
            41.5, 12.5, 8, this.headingFont);

        let offset = 697.6 - 643.6;
        for (let i = 0; i < 3; i++) {
            let block = new Column(164.9, 643.6 + (offset * i), 10.1, 50.3);
            this.writeLabel(page, i18next.t("Weapon.common.name").toLocaleUpperCase(), fontSize, block,
                SimpleColor.from("#ffffff"), "", true);

            let block2 = new Column(164.9, 666.6 + (offset * i), 10.1, 50.3);
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

    fillFocuses(form: PDFForm, character: Character) {
        let index = 0;
        character.focuses.forEach( (f) => {
            this.fillField(form, 'Focus ' + (++index), f);
        });

        if (character.version > 1 && character.pastime?.length) {
            index++;
            character.pastime.forEach((p) => {
                this.fillField(form, 'Focus ' + (++index), i18next.t('Construct.other.pastimes') + ": " + p);
            });
        }
    }

}
