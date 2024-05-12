import { PDFDocument, PDFFont, PDFForm, PDFPage } from "@cantoo/pdf-lib";
import { SimpleColor } from "../common/colour";
import { XYLocation } from "../common/xyLocation";
import { BasicGeneratedSheet } from "./generatedsheet";
import { Column } from "./icharactersheet";
import i18next from "i18next";
import { getCurrentLanguageCode } from "../i18n/config";
import { Character } from "../common/character";
import { Construct } from "../common/construct";
import { TalentsHelper } from "../helpers/talents";
import { FontSpecification } from "./fontSpecification";
import { Paragraph } from "./paragraph";
import { RolesHelper } from "../helpers/roles";
import { CharacterSerializer } from "../common/characterSerializer";
import { Skill } from "../helpers/skills";
import { Attribute } from "../helpers/attributes";
import { CareerEventsHelper } from "../helpers/careerEvents";

export class LandscapeGeneratedCharacterSheet extends BasicGeneratedSheet {

    static readonly stressPill = "m 15.479,4.826 c 0,-2.661 -2.044,-4.825 -4.558,-4.825 L 4.557,0 C 2.044,0 0,2.165 0,4.826 0,7.487 2.044,9.651 4.557,9.651 L 10.921,9.65 c 2.514,0 4.558,-2.163 4.558,-4.824 z";
    static readonly purpleColour = SimpleColor.from("#B6B2D9");
    static readonly darkPurpleColour = SimpleColor.from("#8964AB")
    static readonly headingColour = SimpleColor.from("#9C3478");
    static readonly orangeColour = SimpleColor.from("#F9A164");
    static readonly talentsColumn = new Column(583, 45, 563-45, 757-583);
    static readonly headingColumn = new Column(42.4, 28.8, 14.5, 178.2);

    static readonly stressPillLocations = [
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

    static readonly subTitleLocations = {
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

    static readonly statLocations = {
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

        "Construct.other.resistance": new Column(357.5, 171.1, 9, 45),
        "Construct.other.reputation": new Column(429.8, 171.1, 9, 45),
        "Construct.other.reprimands": new Column(503.7, 171.1, 9, 45),
    }

    static readonly detailLabels = {
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
    }

    static readonly determinationBlock = new Column(26.5, 265.9, 11.8, 85);

    textFont: PDFFont;
    boldFont: PDFFont;
    symbolFont: PDFFont;
    headingFont: PDFFont;

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

    async initializeFonts(pdf: PDFDocument) {
        await super.initializeFonts(pdf);

        this.textFont = this.formFont;
        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        this.boldFont = await pdf.embedFont(boldFontBytes);

        if (getCurrentLanguageCode() === "ru") {
            this.headingFont = this.boldFont;
        } else {
            const fontBytes = await fetch("/static/font/lcars_font.TTF").then(res => res.arrayBuffer());
            this.headingFont = await pdf.embedFont(fontBytes);
        }

        const symbolFontBytes = await fetch("/static/font/Trek_Arrowheads.ttf").then(res => res.arrayBuffer());
        this.symbolFont = await pdf.embedFont(symbolFontBytes);
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        let character = construct as Character;

        const page = pdf.getPage(0);

        this.writeTitle(page);
        this.writeSubTitles(page, character);
        this.writeStatLabels(page);
        this.writeDetailLabels(page);
        this.writeWeaponLabels(page);
        this.writeStress(pdf, page, character);
        this.writeRoleAndTalents(page, character);

        this.populateForm(pdf.getForm(), character);
    }

    populateForm(form: PDFForm, character: Character) {
        this.fillName(form, character);
        this.fillField(form, 'Pronouns', character.pronouns);
        this.fillField(form, 'Assignment', this.serializeAssignment(character));
        this.fillField(form, 'Ship', character.assignedShip ?? "");
        this.fillField(form, 'Environment', CharacterSerializer.serializeEnvironment(character.environmentStep?.environment, character.environmentStep?.otherSpecies, character.type));
        this.fillRank(form, character);
        this.fillSpecies(form, character);
        this.fillUpbringing(form, character);
        this.fillField(form, 'Traits', character.getAllTraits());
        this.fillFocuses(form, character);
        this.fillAttributes(form, character);
        this.fillSkills(form, character);
        this.fillField(form, 'Resistance', "" + character.resistance);
        this.fillField(form, 'Reputation', "" + character.reputation);
        this.fillField(form, 'Reprimands', "" + character.reprimands);
        this.fillValues(form, character);
        this.fillEquipment(form, character);
        this.fillWeapons(form, character);

        if (character.careerEvents && character.careerEvents.length > 0) {
            let event1 = CareerEventsHelper.getCareerEvent(character.careerEvents[0]?.id, character.type);
            if (event1) {
                this.fillField(form, 'Career Event 1', event1.localizedName);
            }

            if (character.careerEvents && character.careerEvents.length > 1) {
                let event2 = CareerEventsHelper.getCareerEvent(character.careerEvents[1]?.id, character.type);
                if (event2) {
                    this.fillField(form, 'Career Event 2', event2.localizedName);
                }
            }
        }

    }

    serializeAssignment(character: Character): string {
        return character.localizedAssignmentWithoutShip;;
    }

    fillAttributes(form: PDFForm, character: Character) {
        character.attributes.forEach( (a, i) => {
            switch (a.attribute) {
            case Attribute.Control:
                this.fillField(form, 'Control', "" + a.value);
                break;
            case Attribute.Fitness:
                this.fillField(form, 'Fitness', "" + a.value);
                break;
            case Attribute.Presence:
                this.fillField(form, 'Presence', "" + a.value);
                break;
            case Attribute.Daring:
                this.fillField(form, 'Daring', "" + a.value);
                break;
            case Attribute.Insight:
                this.fillField(form, 'Insight', "" + a.value);
                break;
            case Attribute.Reason:
                this.fillField(form, 'Reason', "" + a.value);
                break;
            }
        });
    }

    fillSkills(form: PDFForm, character: Character) {
        character.skills.forEach( (a, i) => {
            switch (a.skill) {
            case Skill.Command:
                this.fillField(form, 'Command', "" + a.expertise);
                break;
            case Skill.Security:
                this.fillField(form, 'Security', "" + a.expertise);
                break;
            case Skill.Science:
                this.fillField(form, 'Science', "" + a.expertise);
                break;
            case Skill.Conn:
                this.fillField(form, 'Conn', "" + a.expertise);
                break;
            case Skill.Engineering:
                this.fillField(form, 'Engineering', "" + a.expertise);
                break;
            case Skill.Medicine:
                this.fillField(form, 'Medicine', "" + a.expertise);
                break;
            }
        });
    }

    fillField(form: PDFForm, name: string, value: string) {
        try {
            const field = form.getTextField(name)
            if (field) {
                field.setText(value)
            }
        } catch (e) {
            // ignore it
        }
    }

    fillRank(form: PDFForm, character: Character) {
        this.fillField(form, 'Rank', character.rank?.localizedName);
    }

    fillSpecies(form: PDFForm, character: Character) {
        this.fillField(form, 'Species', character.localizedSpeciesName);
    }

    fillFocuses(form: PDFForm, character: Character) {
        character.focuses.forEach( (f, i) => {
            this.fillField(form, 'Focus ' + (i+1), f);
        });
    }

    fillName(form: PDFForm, character: Character) {
        this.fillField(form, 'Name', character.name);
    }

    findSecurityValue(construct: Construct) {
        let c = construct as Character;
        var result = undefined;
        c.skills.forEach( (s, i) => {
            if (s.skill === Skill.Security) {
                result = s.expertise;
            }
        });
        return result;
    }

    fillEquipment(form: PDFForm, character: Character) {
        character.equipmentAndImplants.forEach((e, i) => {
            this.fillField(form, 'Equipment ' + (i+1), e.localizedName);
        });
    }

    fillValues(form: PDFForm, character: Character) {
        character.values.forEach((v, i) => {
            this.fillField(form, 'Value ' + (i + 1), v);
        });
    }

    fillUpbringing(form: PDFForm, character: Character) {
        this.fillField(form, 'Upbringing', character.upbringingStep?.localizedDescription);
    }


    fillWeapons(form: PDFForm, construct: Construct) {
        var weapons = construct.determineWeapons();
        const security = this.findSecurityValue(construct) || 0;

        weapons.forEach( (w, i) => {
            this.fillField(form, 'Weapon ' + (i+1) + ' name', w.name);
            this.fillField(form, 'Weapon ' + (i+1) + ' dice', (w.dice == null) ? "" : ("" + (security + w.dice)));
            this.fillField(form, 'Weapon ' + (i+1) + ' qualities', w.effectsAndQualities);
        });
    }
    formatNameWithoutPronouns(character: Character) {
        return CharacterSerializer.serializeName(character);
    }

    writeStress(pdf: PDFDocument, page: PDFPage, character: Character) {
        let form = pdf.getForm();
        LandscapeGeneratedCharacterSheet.stressPillLocations.forEach((pill, i) => {

            try {
                const field = form.getCheckBox("Stress " + (i+1));
                if (field) {
                    form.removeField(field);
                }
            } catch (e) {
                // ignore it
            }

            if (i >= character.stress) {
                page.moveTo(pill.x, page.getHeight() - pill.y);
                page.drawSvgPath(LandscapeGeneratedCharacterSheet.stressPill, {
                    color: LandscapeGeneratedCharacterSheet.purpleColour.asPdfRbg(),
                    borderColor: LandscapeGeneratedCharacterSheet.purpleColour.asPdfRbg(),
                    borderWidth: 1
                });
            } else {
                let checkbox = form.createCheckBox("Stress " + (i+1));
                checkbox.addToPage(page, {
                    x: pill.x + 3.5,
                    y: page.getHeight() - pill.y - 9,
                    width: 9.5,
                    height: 8.5,
                    textColor: SimpleColor.from("#000000").asPdfRbg(),
                    borderWidth: 0
                });
            }
        });
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

    writeSubTitles(page: PDFPage, character: Character) {
        const originalFontSize = 16.5;

        Object.keys(LandscapeGeneratedCharacterSheet.subTitleLocations).forEach(key => {
            let fontSize = originalFontSize;
            let block = LandscapeGeneratedCharacterSheet.subTitleLocations[key];
            if (key === "departments" && character.version === 1) {
                key = "disciplines";
            }
            const originalText = i18next.t("Construct.other." + key).toLocaleUpperCase();
            let text = originalText;
            let width = this.headingFont.widthOfTextAtSize(text, fontSize);
            while (width > block.width) {
                fontSize -= 0.25;
                width = this.headingFont.widthOfTextAtSize(text, fontSize);
                if (fontSize < 8) {
                    break;
                }
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
                color: LandscapeGeneratedCharacterSheet.headingColour.asPdfRbg(),
                font: this.headingFont,
                size: fontSize
            });
        });

    }

    writeStatLabels(page: PDFPage) {
        let fontSize = 12.5;

        Object.keys(LandscapeGeneratedCharacterSheet.statLocations).forEach(key => {
            let block = LandscapeGeneratedCharacterSheet.statLocations[key];
            const originalText = i18next.t(key).toLocaleUpperCase();
            let text = originalText;
            let width = this.headingFont.widthOfTextAtSize(text, fontSize);
            while (width > block.width) {
                fontSize -= 0.25;
                width = this.headingFont.widthOfTextAtSize(text, fontSize);
                if (fontSize < 8) {
                    break;
                }
            }
        })

        Object.keys(LandscapeGeneratedCharacterSheet.statLocations).forEach(key => {
            let block = LandscapeGeneratedCharacterSheet.statLocations[key];
            const originalText = i18next.t(key).toLocaleUpperCase();
            let text = originalText;
            let width = this.headingFont.widthOfTextAtSize(text, fontSize);
            while (width > block.width) {
                text = text.substring(0, text.length-1);
                width = this.headingFont.widthOfTextAtSize(text + "...", fontSize);
            }

            if (text !== originalText) {
                text += "...";
            }

            let height = this.headingFont.heightAtSize(fontSize, { descender: false });
            let offset = Math.max(0, block.height - height) / 2;

            page.drawText(text, {
                x: block.end.x - width - 2,
                y: page.getHeight() - (block.end.y - offset),
                color: SimpleColor.from("#ffffff").asPdfRbg(),
                font: this.headingFont,
                size: fontSize
            });
        });

    }

    determineIdealFontWidth(text: string[], maxWidth: number, idealFontSize: number, minimumFontSize: number) {
        let fontSize = idealFontSize;
        text.forEach(t => {
            let width = this.headingFont.widthOfTextAtSize(t, fontSize);
            while (width > maxWidth) {
                fontSize -= 0.25;
                width = this.headingFont.widthOfTextAtSize(t, fontSize);
                if (fontSize <= minimumFontSize) {
                    break;
                }
            }
        });
        return fontSize;
    }

    writeDetailLabels(page: PDFPage) {

        let minWidth = Math.min.apply(Math,
            Object.keys(LandscapeGeneratedCharacterSheet.detailLabels).map(key => LandscapeGeneratedCharacterSheet.detailLabels[key].width));
        let fontSize = this.determineIdealFontWidth(
            Object.keys(LandscapeGeneratedCharacterSheet.detailLabels).map(key => i18next.t(key).toLocaleUpperCase()),
            minWidth, 16.5, 9);

        Object.keys(LandscapeGeneratedCharacterSheet.detailLabels).forEach(key => {
            let block = LandscapeGeneratedCharacterSheet.detailLabels[key];
            const originalText = i18next.t(key).toLocaleUpperCase();
            this.writeLabel(page, originalText, fontSize, block, LandscapeGeneratedCharacterSheet.darkPurpleColour, ":");
        });

        this.writeLabel(page, i18next.t("Construct.other.determination").toLocaleUpperCase(), fontSize,
            LandscapeGeneratedCharacterSheet.determinationBlock, LandscapeGeneratedCharacterSheet.darkPurpleColour, ":");
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

    writeLabel(page: PDFPage, originalText: string, fontSize: number, block: Column, colour: SimpleColor, suffix: string = "", rightJustify: boolean = false) {
        let text = originalText;
        let width = this.headingFont.widthOfTextAtSize(text + suffix, fontSize);
        while (width > block.width) {
            text = text.substring(0, text.length-1);
            width = this.headingFont.widthOfTextAtSize(text + "..." + suffix, fontSize);
        }

        if (text !== originalText) {
            text += "...";
        }

        text += suffix;

        let height = this.headingFont.heightAtSize(fontSize, { descender: false });
        let offset = Math.max(0, block.height - height) / 2;

        page.drawText(text, {
            x: rightJustify ? block.end.x - width - 2 : block.start.x,
            y: page.getHeight() - (block.end.y - offset),
            color: colour.asPdfRbg(),
            font: this.headingFont,
            size: fontSize
        });
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

        for (let t of character.getDistinctTalentNameList()) {

            if (paragraph) {
                const talent = TalentsHelper.getTalent(t);
                let talentName = talent.localizedDisplayName;
                if (talent && talent.maxRank > 1) {
                    let rank = character.getRankForTalent(t);
                    talentName += " [Rank: " + rank + "]";
                }
                paragraph.append(talentName + ": ", new FontSpecification(this.boldFont, 9));
                paragraph.append(talent.localizedDescription, new FontSpecification(this.textFont, 9));
                paragraph.write();

                paragraph = paragraph.nextParagraph();
            }
        };
    }
}