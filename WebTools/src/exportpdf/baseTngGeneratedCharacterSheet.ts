import { PDFDocument, PDFFont, PDFForm, PDFPage } from "@cantoo/pdf-lib";
import { Character } from "../common/character";
import { CharacterSerializer } from "../common/characterSerializer";
import { SimpleColor } from "../common/colour";
import { Construct, Stereotype } from "../common/construct";
import { BasicGeneratedSheet } from "./generatedsheet";
import { Skill } from "../helpers/skills";
import { Attribute } from "../helpers/attributes";
import { CareerEventsHelper } from "../helpers/careerEvents";
import { Column } from "./column";
import { XYLocation } from "../common/xyLocation";
import i18next from "i18next";
import { getCurrentLanguageCode } from "../i18n/config";
import { FontLibrary, FontType } from "./fontLibrary";

export abstract class BaseTNGGeneratedCharacterSheet extends BasicGeneratedSheet {
    static readonly lightPurpleColour = SimpleColor.from("#c3bcde");
    static readonly purpleColour = SimpleColor.from("#B6B2D9");
    static readonly darkPurpleColour = SimpleColor.from("#8964AB")
    static readonly headingColour = SimpleColor.from("#9C3478");
    static readonly orangeColour = SimpleColor.from("#F9A164");

    fonts: FontLibrary = new FontLibrary();
    headingFont: PDFFont;

    get determinationPills(): Column[] {
        return [];
    }

    get stressPillLocations(): XYLocation[] {
        return [];
    }

    get stressPill(): string {
        return "";
    }

    get subTitleLocations(): {[key: string]: Column} {
        return {};
    }

    get statLocations(): {[key: string]: Column} {
        return {};
    }

    get detailLabels(): {[key: string]: Column} {
        return {};
    }

    get determinationLabelBlock(): Column {
        return null;
    }

    async initializeFonts(pdf: PDFDocument) {
        await super.initializeFonts(pdf);

        this.fonts.addFont(FontType.Standard, this.formFont);
        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const boldFont = await pdf.embedFont(boldFontBytes);
        this.fonts.addFont(FontType.Bold, boldFont);

        if (getCurrentLanguageCode() === "ru") {
            this.headingFont = boldFont;
        } else {
            const fontBytes = await fetch("/static/font/lcars_font.TTF").then(res => res.arrayBuffer());
            this.headingFont = await pdf.embedFont(fontBytes);
        }

        const italicFontBytes = await fetch("/static/font/OpenSansCondensed-LightItalic.ttf").then(res => res.arrayBuffer());
        const italicFont = await pdf.embedFont(italicFontBytes);
        this.fonts.addFont(FontType.Italic, italicFont);

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

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        let character = construct as Character;

        const page = pdf.getPage(0);

        this.writeTitle(page);
        this.writeSubTitles(page, character);
        this.writeStatLabels(page, character);
        this.writeDetailLabels(page);
        this.writeWeaponLabels(page);

        this.writeStress(pdf, page, character);
        this.createDeterminationCheckmarks(pdf, page);

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
        character.equipmentModels.forEach((e, i) => {
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
            this.fillField(form, 'Weapon ' + (i+1) + ' qualities', construct.version > 1 ? w.injuryTypeEffectsAndQualities : w.effectsAndQualities);
        });
    }
    formatNameWithoutPronouns(character: Character) {
        return CharacterSerializer.serializeName(character);
    }

    createDeterminationCheckmarks(pdf: PDFDocument, page: PDFPage) {
        let form = pdf.getForm();
        this.determinationPills.forEach((block, i) => {

            let checkbox = form.createCheckBox("Determination " + (i+1));
            checkbox.addToPage(page, {
                x: block.start.x + 4,
                y: page.getHeight() - block.start.y - (block.height - 1),
                width: block.width - 8,
                height: block.height - 2,
                textColor: SimpleColor.from("#000000").asPdfRbg(),
                borderWidth: 0
            });
        });
    }

    get pillSize() {
        return {
            height: 0,
            width: 0
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

    writeDetailLabels(page: PDFPage, colour: SimpleColor = BaseTNGGeneratedCharacterSheet.darkPurpleColour) {

        let minWidth = Math.min.apply(Math,
            Object.keys(this.detailLabels).map(key => this.detailLabels[key].width));
        let fontSize = this.determineIdealFontWidth(
            Object.keys(this.detailLabels).map(key => i18next.t(key).toLocaleUpperCase()),
            minWidth, 16.5, 9);

        Object.keys(this.detailLabels).forEach(key => {
            let block = this.detailLabels[key];
            const originalText = i18next.t(key).toLocaleUpperCase();
            this.writeLabel(page, originalText, fontSize, block, colour, ":");
        });

        this.writeLabel(page, i18next.t("Construct.other.determination").toLocaleUpperCase(), fontSize,
            this.determinationLabelBlock, colour, ":");
    }


    writeStress(pdf: PDFDocument, page: PDFPage, character: Character, colour: SimpleColor = BaseTNGGeneratedCharacterSheet.purpleColour) {
        let form = pdf.getForm();
        let { height, width } = this.pillSize;
        this.stressPillLocations.forEach((pill, i) => {

            if (i >= character.stress) {
                page.moveTo(pill.x, page.getHeight() - pill.y);
                page.drawSvgPath(this.stressPill, {
                    color: colour.asPdfRbg(),
                    borderColor: colour.asPdfRbg(),
                    borderWidth: 1
                });
            } else {
                let checkbox = form.createCheckBox("Stress " + (i+1));
                checkbox.addToPage(page, {
                    x: pill.x + (width - 9.5) / 2,
                    y: page.getHeight() - pill.y - (height - 0.6),
                    width: 9.5,
                    height: 8.5,
                    textColor: SimpleColor.from("#000000").asPdfRbg(),
                    borderWidth: 0
                });
            }
        });
    }

    writeSubTitles(page: PDFPage, character: Character) {
        const originalFontSize = 16.5;

        const table = this.subTitleLocations;
        Object.keys(table).forEach(key => {
            let fontSize = originalFontSize;
            let block = table[key];
            if (key === "departments" && character.version === 1) {
                key = "disciplines";
            } else if (key === "talents" && character.stereotype === Stereotype.Npc) {
                key = "specialRules";
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
                color: BaseTNGGeneratedCharacterSheet.headingColour.asPdfRbg(),
                font: this.headingFont,
                size: fontSize
            });
        });

    }

    writeStatLabels(page: PDFPage, character: Character) {
        let fontSize = 12.5;

        Object.keys(this.statLocations).forEach(key => {
            let block = this.statLocations[key];
            if (key === "Construct.other.protection" && character.version === 1) {
                key = "Construct.other.resistance";
            }
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

        Object.keys(this.statLocations).forEach(key => {
            let block = this.statLocations[key];
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

    writeTitle(page: PDFPage) {
    }

    writeWeaponLabels(page: PDFPage) {
    }
}