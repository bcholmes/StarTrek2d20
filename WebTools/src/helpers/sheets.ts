import {character} from '../common/character';
import { Attribute } from '../helpers/attributes';
import { Skill } from '../helpers/skills';
import { PDFDocument, PDFForm } from 'pdf-lib'
import { SpaceframeHelper } from '../helpers/spaceframes';
import { MissionProfileHelper } from '../helpers/missionProfiles';
import { CharacterSerializer } from '../common/characterSerializer';
import { Department } from './departments';
import { System } from './systems';

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
    createFileName(suffix: string);
}

abstract class BasicSheet implements ICharacterSheet {
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
    }

    fillField(form: PDFForm, name: string, value: string) {
        if (value) {
            try {
                const field = form.getTextField(name)
                if (field) {
                    field.setText(value)
                }
            } catch (e) {
                // ignore it
            }
        }
    }
    createFileName(suffix: string): string {
        if (character.name == null || character.name.length == 0) {
            return suffix + ".pdf";
        } else {
            var escaped = character.name.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_');
            return escaped + '-'  + suffix + ".pdf";
        }
    }

    fillTalents(form: PDFForm, talents: string[]) {
        var i = 1;
        for (var talent of talents) {
            this.fillField(form, 'Talent ' + i, talent);
            i++;
        }
    }
}

abstract class BasicStarshipSheet extends BasicSheet {

    populateForm(form: PDFForm) {
        this.fillField(form, 'Name', character.starship.name);
        this.fillField(form, 'Service Date', character.starship.serviceYear.toString());
        this.fillField(form, 'Designation', character.starship.reegistry);
        let trait = "Federation Starship";
        if (character.starship.traits !== undefined) {
            trait += `, ${character.starship.traits}`;
        }
        this.fillField(form, 'Traits', trait);

        let talents = [];

        const spaceframe = SpaceframeHelper.getSpaceframe(character.starship.spaceframe);
        if (spaceframe) {
            this.fillField(form, 'Space Frame', spaceframe.name);
            this.fillField(form, 'Scale', spaceframe.scale.toString());
            talents = [...spaceframe.talents.map(t => { return t.name; })];
        }
        const missionProfile = MissionProfileHelper.getMissionProfile(character.starship.missionProfile);
        if (missionProfile) {
            this.fillField(form, 'Mission Profile', missionProfile.name);
        }
        const missionPod = SpaceframeHelper.getMissionPod(character.starship.missionPod);
        talents.push(character.starship.profileTalent);
        character.starship.additionalTalents.forEach(t => {
            talents.push(t);
        });
        if (missionPod) {
            missionPod.talents.forEach(t => {
                talents.push(t.name);
            });
        }
console.log(talents);
        this.fillSystems(form);
        this.fillDepartments(form);
        this.fillTalents(form, talents);
    }

    fillSystems(form: PDFForm) {
        this.fillFieldWithNumber(form, "Engines", character.starship.systems[System.Engines]);
        this.fillFieldWithNumber(form, "Structure", character.starship.systems[System.Structure]);
        this.fillFieldWithNumber(form, "Computers", character.starship.systems[System.Computer]);
        this.fillFieldWithNumber(form, "Sensors", character.starship.systems[System.Sensors]);
        this.fillFieldWithNumber(form, "Weapons", character.starship.systems[System.Weapons]);
        this.fillFieldWithNumber(form, "Communications", character.starship.systems[System.Comms]);
    }

    fillDepartments(form: PDFForm) {
        this.fillFieldWithNumber(form, "Command", character.starship.departments[Department.Command]);
        this.fillFieldWithNumber(form, "Conn", character.starship.departments[Department.Conn]);
        this.fillFieldWithNumber(form, "Security", character.starship.departments[Department.Security]);
        this.fillFieldWithNumber(form, "Engineering", character.starship.departments[Department.Engineering]);
        this.fillFieldWithNumber(form, "Science", character.starship.departments[Department.Science]);
        this.fillFieldWithNumber(form, "Medicine", character.starship.departments[Department.Medicine]);
    }

    fillFieldWithNumber(form: PDFForm, name: string, value: number) {
        if (value) {
            this.fillField(form, name, value.toString());
        }
    }
    createFileName(suffix: string): string {
        if (character.starship.name) {
            var escaped = character.starship.name.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_');
            return escaped + '-'  + suffix + ".pdf";
        } else {
            return suffix + ".pdf";
        }
    }
}

class StandardTngStarshipSheet extends BasicStarshipSheet {
    getName(): string {
        return 'TNG Standard Starship Sheet (Landscape)'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/res/img/sheets/TNG_Standard_Starship_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/res/pdf/TNG_Standard_Starship_Sheet.pdf'
    }
}


abstract class BasicShortCharacterSheet extends BasicSheet {

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
        this.fillField(form, 'Name', character.name);
        this.fillField(form, 'Department', character.role);
        this.fillField(form, 'Purpose', character.role);
        this.fillField(form, 'Rank', character.rank);
        this.fillField(form, 'Species', CharacterSerializer.serializeSpecies(character.species, character.mixedSpecies));
        this.fillField(form, 'Traits', CharacterSerializer.serializeTraits(character.traits));
        character.focuses.forEach( (f, i) => {
            this.fillField(form, 'Focus ' + (i+1), f);
        });

        this.fillAttributes(form);
        this.fillSkills(form);
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

class StandardCharacterSheet extends BasicShortCharacterSheet {
    getName(): string {
        return 'Standard Character Sheet'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/res/img/sheets/TNG_Standard_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/res/pdf/TNG_Standard_Character_Sheet.pdf'
    }
}

class CharacterSheets {
    public getCharacterSheet(): ICharacterSheet {
        return new HalfPageSupportingCharacterSheet()
    }

    public getSupportingCharacterSheet(): ICharacterSheet[] {
        var result: ICharacterSheet[] = [ new StandardCharacterSheet(), new HalfPageSupportingCharacterSheet() ];
        return result
    }

    public getStarshipSheets(): ICharacterSheet[] {
        return [ new StandardTngStarshipSheet() ];
    }
}

export const CharacterSheetRegistry = new CharacterSheets();