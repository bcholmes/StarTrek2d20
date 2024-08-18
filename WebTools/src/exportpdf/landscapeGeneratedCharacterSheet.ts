import { PDFDocument, PDFForm, PDFPage } from "@cantoo/pdf-lib";
import { SimpleColor } from "../common/colour";
import { XYLocation } from "../common/xyLocation";
import { SheetTag } from "./icharactersheet";
import i18next from "i18next";
import { Character } from "../common/character";
import { Construct } from "../common/construct";
import { TALENT_NAME_BORG_IMPLANTS, TalentsHelper } from "../helpers/talents";
import { FontSpecification } from "./fontSpecification";
import { Paragraph } from "./paragraph";
import { RolesHelper } from "../helpers/roles";
import { BorgImplants } from "../helpers/borgImplant";
import { BaseTNGGeneratedCharacterSheet } from "./baseTngGeneratedCharacterSheet";
import { Column } from "./column";

export class LandscapeGeneratedCharacterSheet extends BaseTNGGeneratedCharacterSheet {

    static readonly talentsColumn = new Column(583, 45, 563-45, 757-583);
    static readonly headingColumn = new Column(42.4, 28.8, 14.5, 178.2);

    get stressPill() {
        return "m 15.479,4.826 c 0,-2.661 -2.044,-4.825 -4.558,-4.825 L 4.557,0 C 2.044,0 0,2.165 0,4.826 0,7.487 2.044,9.651 4.557,9.651 L 10.921,9.65 c 2.514,0 4.558,-2.163 4.558,-4.824 z";
    }

    get stressPillLocations() {
        return [
            new XYLocation(352.3, 212.2),
            new XYLocation(373.1, 212.2),
            new XYLocation(393.9, 212.2),
            new XYLocation(414.7, 212.2),
            new XYLocation(435.4, 212.2),

            new XYLocation(352.3, 227.2),
            new XYLocation(373.1, 227.2),
            new XYLocation(393.9, 227.2),
            new XYLocation(414.7, 227.2),
            new XYLocation(435.4, 227.2),

            new XYLocation(352.3, 242.1),
            new XYLocation(373.1, 242.1),
            new XYLocation(393.9, 242.1),
            new XYLocation(414.7, 242.1),
            new XYLocation(435.4, 242.1),

            new XYLocation(352.3, 257.1),
            new XYLocation(373.1, 257.1),
            new XYLocation(393.9, 257.1),
            new XYLocation(414.7, 257.1),
            new XYLocation(435.4, 257.1),

            new XYLocation(352.3, 272.1),
            new XYLocation(373.1, 272.1),
            new XYLocation(393.9, 272.1),
            new XYLocation(414.7, 272.1),
            new XYLocation(435.4, 272.1),
        ];
    }

    get determinationPills() {
        return [
            new Column(151.5, 266, 10.7, 22.5),
            new Column(181.3, 266, 10.7, 22.5),
            new Column(211.2, 266, 10.7, 22.5)
        ];
    }

    get subTitleLocations() {
        return {
            "attacks": new Column(40.2, 390.9, 11.8, 142.9),
            "attributes": new Column(366.5, 27.5, 11.8, 142.9),
            "departments": new Column(366.5, 97.7, 11.8, 142.9),
            "equipment": new Column(40.2, 291.3, 11.8, 142.9),
            "focuses": new Column(366.5, 293.5, 11.8, 142.9),
            "injuries": new Column(477.3, 192.4, 11.8, 77.8),
            "stress": new Column(366.5, 192.4, 11.8, 77.8),
            "talents": new Column(599.2, 27.5, 11.8, 142.9),
            "values": new Column(366.5, 475.6, 11.8, 142.9),
        }
    }

    get statLocations() {
        return {
            "Construct.attribute.control": new Column(357.5, 49.4, 9, 45),
            "Construct.attribute.daring": new Column(357.5, 72.7, 9, 45),
            "Construct.attribute.fitness": new Column(429.8, 49.4, 9, 45),
            "Construct.attribute.insight": new Column(429.8, 72.7, 9, 45),
            "Construct.attribute.presence": new Column(503.7, 49.4, 9, 45),
            "Construct.attribute.reason": new Column(503.7, 72.7, 9, 45),

            "Construct.discipline.command": new Column(357.5, 119.4, 9, 45),
            "Construct.discipline.conn": new Column(357.5, 142.7, 9, 45),
            "Construct.discipline.engineering": new Column(429.8, 142.7, 9, 45),
            "Construct.discipline.medicine": new Column(503.7, 142.7, 9, 45),
            "Construct.discipline.science": new Column(503.7, 119.4, 9, 45),
            "Construct.discipline.security": new Column(429.8, 119.4, 9, 45),

            "Construct.other.protection": new Column(357.5, 171.1, 9, 45),
            "Construct.other.reputation": new Column(429.8, 171.1, 9, 45),
            "Construct.other.reprimands": new Column(503.7, 171.1, 9, 45),
        };
    }

    get detailLabels() {
        return {
            "Construct.other.name": new Column(26.5, 55.7, 11.8, 65.6),
            "Construct.other.rank": new Column(26.5, 73.1, 11.8, 65.6),
            "Construct.other.pronouns": new Column(26.5, 90.8, 11.8, 65.6),
            "Construct.other.assignment": new Column(26.5, 110.1, 11.8, 65.6),
            "Construct.other.ship": new Column(26.5, 128.1, 11.8, 65.6),
            "Construct.other.species": new Column(26.5, 146.9, 11.8, 65.6),
            "Construct.other.traits": new Column(26.5, 164.7, 11.8, 65.6),
            "Construct.other.environment": new Column(26.5, 183, 11.8, 65.6),
            "Construct.other.upbringing": new Column(26.5, 202.2, 11.8, 65.6),
            "Construct.other.careerEvent1.short": new Column(26.5, 220.9, 11.8, 65.6),
            "Construct.other.careerEvent2.short": new Column(26.5, 239.8, 11.8, 65.6),
        };
    }

    getName(): string {
        return i18next.t("Sheet.landscapeGeneratedCharacterSheet");
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/TNG_Landscape_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return '/static/pdf/TNG_Landscape_Character_Sheet.pdf'
    }

    getDefaultFontPath() {
        return "/static/font/OpenSansCondensed-Light.ttf";
    }

    getTags(): SheetTag[] {
        return [ SheetTag.Landscape, SheetTag.Lcars, SheetTag.LanguageSupport, SheetTag.TalentText, SheetTag.UsLetter ];
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        let character = construct as Character;

        const page = pdf.getPage(0);

        this.writeWeaponLabels(page);
        this.writeRoleAndTalents(page, character);
    }

    get determinationLabelBlock() {
        return new Column(26.5, 265.9, 11.8, 85);
    }

    writeTitle(page: PDFPage) {
        const originalText = i18next.t("Sheet.text.title").toLocaleUpperCase();
        let text = originalText;
        const fontSize = this.determineIdealFontWidth([ text ],
            LandscapeGeneratedCharacterSheet.headingColumn.width, 20.4, 15);
        const block = LandscapeGeneratedCharacterSheet.headingColumn;
        let width = this.headingFont.widthOfTextAtSize(text, fontSize);
        while (width > block.width) {
            text = text.substring(0, text.length-1);
            width = this.headingFont.widthOfTextAtSize(text + "...", fontSize);
        }

        if (text !== originalText) {
            text += "...";
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
            color: LandscapeGeneratedCharacterSheet.orangeColour.asPdfRbg(),
            font: this.headingFont,
            size: fontSize
        });
    }



    writeWeaponLabels(page: PDFPage) {
        let fontSize = this.determineIdealFontWidth(
            [i18next.t("Weapon.common.name").toLocaleUpperCase(),
            i18next.t("Weapon.common.qualities").toLocaleUpperCase()],
            38.1, 12.5, 8);

        let offset = 460.3 - 414.6;
        for (let i = 0; i < 4; i++) {
            let block = new Column(32.5, 414.6 + (offset * i), 10.1, 38.1);
            this.writeLabel(page, i18next.t("Weapon.common.name").toLocaleUpperCase(), fontSize, block,
                SimpleColor.from("#ffffff"), "", true);

            let block2 = new Column(32.5, 434.6 + (offset * i), 10.1, 38.1);
            this.writeLabel(page, i18next.t("Weapon.common.qualities").toLocaleUpperCase(), fontSize, block2,
                SimpleColor.from("#ffffff"), "", true);
        };
    }


    writeRoleAndTalents(page: PDFPage, character: Character) {
        let paragraph = new Paragraph(page, LandscapeGeneratedCharacterSheet.talentsColumn, this.symbolFont);
        if (character.role != null) {
            let role = RolesHelper.instance.getRole(character.role, character.type);
            if (role) {
                paragraph.append(role.localizedName + ": ", new FontSpecification(this.boldFont, 9));
                paragraph.append(role.localizedAbility, new FontSpecification(this.textFont, 9));

                paragraph.write();
                paragraph = paragraph.nextParagraph();
            }
        }

        if (character.speciesStep?.ability != null) {
            let ability = character.speciesStep.ability;
            paragraph.append(ability.name + " (" + i18next.t('Construct.other.speciesAbility') + "): ",
                new FontSpecification(this.boldFont, 9));
            paragraph.append(ability.description, new FontSpecification(this.textFont, 9));

            paragraph.write();
            paragraph = paragraph.nextParagraph();
        }

        for (let t of character.getDistinctTalentNameList()) {

            if (paragraph) {
                const talent = TalentsHelper.getTalent(t);
                let talentName = talent.localizedDisplayName;
                if (talent && talent.maxRank > 1) {
                    let rank = character.getRankForTalent(t);
                    talentName += " [Rank: " + rank + "]";
                }
                paragraph.append(talentName + ": ", new FontSpecification(this.boldFont, 9));
                if (character.version === 1) {
                    paragraph.append(talent.localizedDescription, new FontSpecification(this.textFont, 9));
                } else {
                    paragraph.append(talent.localizedDescription2e, new FontSpecification(this.textFont, 9));
                }
                paragraph.write();

                if (talent.name === TALENT_NAME_BORG_IMPLANTS) {
                    character.implants.forEach(implantType => {

                        let implant = BorgImplants.instance.getImplantByType(implantType);
                        paragraph = paragraph.nextParagraph(0);
                        if (paragraph) {
                            paragraph.indent(10);
                            paragraph.append(implant.localizedName + ": ", new FontSpecification(this.boldFont, 9));
                            paragraph.append(implant.description, new FontSpecification(this.textFont, 9));
                            paragraph.write();
                        }
                    });
                }

                paragraph = paragraph ? paragraph.nextParagraph() : null;
            }
        };
    }

    fillFocuses(form: PDFForm, character: Character) {
        let index = 0;
        character.focuses.forEach( (f) => {
            this.fillField(form, 'Focus ' + (++index), f);
        });

        if (character.version > 1 && character.pastime?.length) {
            character.pastime.forEach((p) => {
                this.fillField(form, 'Focus ' + (++index), i18next.t('Construct.other.pastimes') + ": " + p);
            });
        }
    }

    get pillSize() {
        return {
            height: 9.7,
            width: 15.5
        };
    }
}