import { character, CharacterType } from '../common/character';
import { Attribute } from '../helpers/attributes';
import { Skill } from '../helpers/skills';
import { PDFDocument, PDFForm } from 'pdf-lib'
import { CharacterSerializer } from '../common/characterSerializer';
import { UpbringingsHelper } from './upbringings';
import { Era } from './eras';

class Weapon {
    name: string;
    dice: number;
    qualities: string;

    constructor(name: string, dice: number, qualities: string) {
        this.name = name;
        this.dice = dice;
        this.qualities = qualities;
    }
}


export interface ICharacterSheet {
    getName(): string;
    getThumbnailUrl(): string;
    getPdfUrl(): string;
    populate(pdf: PDFDocument);
}

abstract class BasicShortCharacterSheet implements ICharacterSheet {

    getName(): string {
        throw new Error('Method not implemented.');
    }
    getThumbnailUrl(): string {
        throw new Error('Method not implemented.');
    }
    getPdfUrl(): string {
        throw new Error('Method not implemented.');
    }
    populate(pdf: PDFDocument) {
        const form = pdf.getForm();
        this.populateForm(form);
    }

    populateForm(form: PDFForm) {
        this.fillName(form);
        this.fillField(form, 'Department', CharacterSerializer.serializeAssignment(character));
        this.fillField(form, 'Purpose', CharacterSerializer.serializeAssignment(character));
        this.fillField(form, 'Rank', character.rank);
        this.fillField(form, 'Species', CharacterSerializer.serializeSpecies(character.species, character.mixedSpecies));
        this.fillField(form, 'Traits', CharacterSerializer.serializeTraits(character.traits));
        character.focuses.forEach( (f, i) => {
            this.fillField(form, 'Focus ' + (i+1), f);
        });

        this.fillAttributes(form);
        this.fillSkills(form);
        this.fillStress(form);
    }

    fillName(form: PDFForm) {
        this.fillField(form, 'Name', character.name);
    }

    fillStress(form: PDFForm) {
        var stress = character.stress || 0; 
        if (stress == 0) {
            character.attributes.forEach( (a, i) => {
                switch(a.attribute) {
                case Attribute.Fitness:
                    stress += a.value;
                    break;
                default:
                }
            })

            character.skills.forEach( (s, i) => {
                switch(s.skill) {
                case Skill.Security:
                    stress += s.expertise;
                    break;
                default:
                }
            })
        }

        for (var i = 1; i <= 30; i++) {
            this.fillCheckbox(form, "Stress " + i, i > stress);
        }
    }

    fillAttributes(form: PDFForm) {
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

    fillSkills(form: PDFForm) {
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

    fillCheckbox(form: PDFForm, name: string, value: boolean) {
        try {
            const field = form.getCheckBox(name)
            if (field) {
                if (value) {
                    field.check();
                } else {
                    field.uncheck();
                }
            }
        } catch (e) {
            // ignore it
        }
    }
}

abstract class BasicFullCharacterSheet extends BasicShortCharacterSheet {

    populateForm(form: PDFForm) {
        super.populateForm(form);

        var upbringing = UpbringingsHelper.getUpbringing(character.upbringing);
        if (upbringing) {
            this.fillField(form, 'Upbringing', upbringing.name);
        }
        this.fillField(form, 'Assignment', CharacterSerializer.serializeAssignment(character));
        this.fillField(form, 'Environment', CharacterSerializer.serializeEnvironment(character.environment, character.otherSpeciesWorld));

        this.fillValues(form);
        this.fillTalents(form);
        this.fillEquipment(form);

        this.fillWeapons(form);
    }

    findSecurityValue() {
        var result = undefined;
        character.skills.forEach( (s, i) => {
            if (s.skill == Skill.Security) {
                result = s.expertise;
            }
        });
        return result;
    }    

    fillWeapons(form: PDFForm) {
        var weapons = this.determineWeapons();
        const security = this.findSecurityValue() || 0;

        weapons.forEach( (w, i) => {
            this.fillField(form, 'Weapon ' + (i+1) + ' name', w.name);
            this.fillField(form, 'Weapon ' + (i+1) + ' dice', "" + (security + w.dice));
            this.fillField(form, 'Weapon ' + (i+1) + ' qualities', w.qualities);
        });
    }

    determineWeapons() {
        var result: Weapon[] = [];
        
        if (character.hasTalent("Mean Right Hook")) {
            result.push(new Weapon("Unarmed Strike", 1, "Knockdown, Non-lethal Vicious 1"));
        } else {
            result.push(new Weapon("Unarmed Strike", 1, "Knockdown"));
        }

        if (character.hasTalent("The Ushaan")) {
            result.push(new Weapon("Ushaan-tor", 1, "Vicious 1"));
        }

        if (character.type === CharacterType.KlingonWarrior) {
            result.push(new Weapon("d’k tahg daggar", 1, "Vicious 1, Deadly, Hidden 1"));
            result.push(new Weapon("Disruptor Pistol", 3, "Vicious 1"));
        } else {
            result.push(new Weapon("Phaser type-2", 2, "Charges"));
        }
        return result;
    }

    fillName(form: PDFForm) {
        this.fillField(form, 'Name', CharacterSerializer.serializeName(character));
    }

    fillTalents(form: PDFForm) {
        var i = 1;
        for (var talent in character.talents) {
            this.fillField(form, 'Talent ' + i, talent);
            i++;
        }
    }

    fillEquipment(form: PDFForm) {
        character.equipment.forEach( (e, i) => {
            this.fillField(form, 'Equipment ' + (i+1), e);
        });
    }

    fillValues(form: PDFForm) {
        this.fillField(form, 'Value 1', character.environmentValue);
        this.fillField(form, 'Value 2', character.trackValue);
        this.fillField(form, 'Value 3', character.careerValue);
        this.fillField(form, 'Value 4', character.finishValue);
    }
}

class HalfPageSupportingCharacterSheet extends BasicShortCharacterSheet {
    getName(): string {
        return 'Half-Page Supporting Character Sheet'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/res/img/sheets/TNG_Supporting_Character_Half_Page.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/res/pdf/TNG_Supporting_Character_Half_Page.pdf'
    }
}

class StandardTngCharacterSheet extends BasicFullCharacterSheet {
    getName(): string {
        return 'Standard TNG Character Sheet'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/res/img/sheets/TNG_Standard_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/res/pdf/TNG_Standard_Character_Sheet.pdf'
    }
}

class StandardTosCharacterSheet extends BasicFullCharacterSheet {
    getName(): string {
        return 'TOS Character Sheet (Landscape)'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/res/img/sheets/TOS_Standard_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/res/pdf/TOS_Standard_Character_Sheet.pdf'
    }
}


class KlingonCharacterSheet extends BasicFullCharacterSheet {
    getName(): string {
        return 'Klingon Character Sheet'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/res/img/sheets/STA_Klingon_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/res/pdf/STA_Klingon_Character_Sheet.pdf'
    }

    populateForm(form: PDFForm) {
        super.populateForm(form);

        this.fillField(form, 'House', character.house);
    }

    fillName(form: PDFForm) {
        this.fillField(form, 'Name', this.concatenateName());
    }

    concatenateName() {
        var result = character.name;
        if (character.lineage) {
            result += (", " + character.lineage);
        }
        return result;
    }
}


class CharacterSheets {
    public getSupportingCharacterSheet(): ICharacterSheet[] {
        if (character.era == Era.NextGeneration) {
            return [ new StandardTngCharacterSheet(), new HalfPageSupportingCharacterSheet(), new StandardTosCharacterSheet()  ];
        } else {
            return [ new StandardTosCharacterSheet(), new StandardTngCharacterSheet(), new HalfPageSupportingCharacterSheet() ];
        }
    }

    public getCharacterSheets(): ICharacterSheet[] {
        if (character.type == CharacterType.KlingonWarrior) {
            return [ new KlingonCharacterSheet(), new StandardTngCharacterSheet(), new StandardTosCharacterSheet() ];
        } else if (character.era == Era.NextGeneration) {
            return [ new StandardTngCharacterSheet(), new KlingonCharacterSheet(), new StandardTosCharacterSheet() ];
        } else {
            return [ new StandardTosCharacterSheet(), new KlingonCharacterSheet(), new StandardTngCharacterSheet() ];
        }
    }
}

export const CharacterSheetRegistry = new CharacterSheets();