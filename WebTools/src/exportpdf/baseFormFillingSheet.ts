import { PDFDocument, PDFFont, PDFForm, PDFPage } from "@cantoo/pdf-lib";
import { BasicGeneratedSheet } from "./generatedsheet";
import { Construct } from "../common/construct";
import { Character } from "../common/character";
import { CharacterSerializer } from "../common/characterSerializer";
import { Skill } from "../helpers/skills";
import { CareerEventsHelper } from "../helpers/careerEvents";
import { Attribute } from "../helpers/attributes";
import { Column } from "./column";
import i18next from "i18next";
import { SimpleColor } from "../common/colour";
import { TextAlign } from "./textAlign";
import { WeaponDescriber } from "./weaponDescriber";

export abstract class BaseFormFillingSheet extends BasicGeneratedSheet {

    headingFont: PDFFont;

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);
        let character = construct as Character;

        this.populateForm(pdf.getForm(), character);
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

    fillReputation(form: PDFForm, character: Character) {
        this.fillField(form, 'Reputation', "" + character.reputation);
    }

    fillAssignment(form: PDFForm, character: Character) {
        this.fillField(form, 'Assignment', this.serializeAssignment(character));
    }
    populateForm(form: PDFForm, character: Character) {
        this.fillName(form, character);
        this.fillField(form, 'Pronouns', character.pronouns);
        this.fillAssignment(form, character);
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
        this.fillReputation(form, character);
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
        const weapons = construct.determineWeapons();
        const describer = new WeaponDescriber(construct.version, construct instanceof Character);

        weapons.forEach( (w, i) => {
            this.fillField(form, 'Weapon ' + (i+1) + ' name', w.name);
            this.fillField(form, 'Weapon ' + (i+1) + ' dice', (w.dice == null) ? "" : ("" + construct.getDiceForWeapon(w)));
            this.fillField(form, 'Weapon ' + (i+1) + ' qualities', describer.describe(w));
        });
    }
    formatNameWithoutPronouns(character: Character) {
        return CharacterSerializer.serializeName(character);
    }

    get statLocations(): {[key: string]: Column} {
        return {};
    }

    getStatLabelColour(key: String): SimpleColor {
        return SimpleColor.from("#ffffff");
    }

    writeStatLabels(page: PDFPage, character: Character, textAlign: TextAlign = TextAlign.Right,
        fontSize: number = 12.5, minFontSize: number = 8) {

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
                if (fontSize < minFontSize) {
                    break;
                }
            }
        })

        Object.keys(this.statLocations).forEach(key => {
            let block = this.statLocations[key];
            if (key === "Construct.other.protection" && character.version === 1) {
                key = "Construct.other.resistance";
            }
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

            let x = block.start.x;
            if (textAlign === TextAlign.Right) {
                x = block.end.x - width - 2;
            }

            page.drawText(text, {
                x: x,
                y: page.getHeight() - (block.end.y - offset),
                color: this.getStatLabelColour(key).asPdfRbg(),
                font: this.headingFont,
                size: fontSize
            });
        });

    }
}