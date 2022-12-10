import { Character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Attribute } from '../helpers/attributes';
import { Skill } from '../helpers/skills';
import { PDFCheckBox, PDFDocument, PDFFont, PDFForm, PDFPage, PDFTextField, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { CharacterSerializer } from '../common/characterSerializer';
import { Era } from './eras';
import { Department } from './departments';
import { System } from './systems';
import { Weapon } from './weapons';
import { SheetOutlineOptions, SpaceframeOutline, XYLocation } from './spaceframeOutlineHelper';
import { TalentsHelper } from './talents';
import { CareerEventsHelper } from './careerEvents';
import { RolesHelper } from './roles';
import { Construct } from '../common/construct';
import { Starship } from '../common/starship';
import { staTextFieldAppearanceProvider } from './pdfTextFieldAppearance';
import store from '../state/store';
import { CareersHelper } from './careers';

class TextBlock {
    text: string;
    fontSize: number;
    font: PDFFont;
    height: number;
    width: number;
}

class Line {
    blocks: TextBlock[];
    column: Column;
    location: XYLocation; // represents the upper-left-hand corner of the line

    constructor(location: XYLocation, column: Column, blocks?: TextBlock[]) {
        this.location = location;
        this.blocks = blocks || [];
        this.column = column;
    }

    height() {
        let h = 0.0;
        this.blocks.forEach(b => {if (b.height > h) h = b.height; });
        return h;
    }
    bottom() {
        return new XYLocation(this.location.x, this.location.y - this.height());
    }
    availableWidth() {
        let w = 0.0;
        this.blocks.forEach(b => w += b.width);
        return this.column.width - w;
    }
    isEmpty() {
        return this.blocks.length === 0;
    }
    add(block: TextBlock) {
        this.blocks.push(block);
    }

    moveToNextColumnIfNecessary(page: PDFPage) {
        if (this.column.contains(this.bottom(), page)) {
            return this;
        } else if (this.column.nextColumn == null) {
            return null;
        } else {
            return new Line(this.column.nextColumn.translatedStart(page), this.column.nextColumn, this.blocks);
        }
    }
}

class FontSpecification {
    font: PDFFont;
    size: number;

    constructor(font: PDFFont, size: number) {
        this.font = font;
        this.size = size;
    }
}


class Column {
    start: XYLocation;
    height: number;
    width: number;
    nextColumn?: Column;

    constructor(x: number, y: number, height: number, width: number, nextColumn?: Column) {
        this.start = new XYLocation(x, y);
        this.height = height;
        this.width = width;
        this.nextColumn = nextColumn;
    }

    contains(point: XYLocation, page: PDFPage) {
        return point.x >= this.start.x && point.x <= (this.start.x + this.width)
            && point.y <= (page.getSize().height - this.start.y) && point.y >= (page.getSize().height - this.start.y - this.height);
    }
    translatedStart(page: PDFPage) {
        let x = this.start.x;
        let y = page.getSize().height - this.start.y;
        return new XYLocation(x, y);
    }
}

export interface ICharacterSheet {
    getName(): string;
    getThumbnailUrl(): string;
    getPdfUrl(): string;
    populate(pdf: PDFDocument, construct: Construct);
    createFileName(suffix: string, construct: Construct);
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
    async populate(pdf: PDFDocument, construct: Construct) {
        const form = pdf.getForm();
        pdf.setTitle(construct.name);
        this.populateForm(form, construct);
    }

    populateForm(form: PDFForm, construct: Construct) {
    }

    fillField(form: PDFForm, name: string, value: string) {
        if (value != null) {
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
    createFileName(suffix: string, construct: Construct): string {
        if (construct.name == null || construct.name.length === 0) {
            return suffix + ".pdf";
        } else {
            var escaped = construct.name.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_');
            return escaped + '-'  + suffix + ".pdf";
        }
    }

    findSecurityValue(construct: Construct) {
        return 0;
    }

    fillWeapons(form: PDFForm, construct: Construct) {
        var weapons = construct.determineWeapons();
        weapons.forEach( (w, i) => {
            this.fillWeapon(form, w, i+1, construct);
        });
    }

    fillWeapon(form: PDFForm, weapon: Weapon, index: number, construct: Construct) {
        const security = this.findSecurityValue(construct) || 0;

        this.fillField(form, 'Weapon ' + index + ' name', weapon.name);
        this.fillField(form, 'Weapon ' + index + ' dice', (weapon.dice == null) ? "" : ("" + (security + weapon.dice)));
        this.fillField(form, 'Weapon ' + index + ' qualities', weapon.qualities);
    }

    fillCheckbox(form: PDFForm, name: string, value: boolean) {
        try {
            const field = form.getCheckBox(name);
            this.fillCheckboxValue(form, field, value);
        } catch (e) {
            // ignore it
        }
    }

    fillCheckboxValue(form: PDFForm, field: PDFCheckBox, value: boolean) {
        if (field) {
            if (value) {
                form.removeField(field);
            } else {
                field.uncheck();
            }
        }
    }
}

abstract class BasicStarshipSheet extends BasicSheet {

    populateForm(form: PDFForm, construct: Construct) {
        let starship = construct as Starship;
        this.fillField(form, 'Name', starship.name);
        if (starship.serviceYear != null) {
            this.fillField(form, 'Service Date', starship.serviceYear.toString());
        }
        if (starship.type === CharacterType.KlingonWarrior) {
            this.fillField(form, 'Designation', 'N/A');
        } else {
            this.fillField(form, 'Designation', starship.registry);
        }

        const talents = starship.getTalentSelectionList().map(t => t.description);

        this.fillField(form, 'Space Frame', starship.className);
        if (starship.scale) {
            this.fillField(form, 'Scale', starship.scale.toString());
        }
        this.fillField(form, 'Traits', starship.getAllTraits());
        const missionProfile = starship.missionProfileModel;
        if (missionProfile) {
            this.fillField(form, 'Mission Profile', missionProfile.name);
        }

        let power = starship.power;
        if (power) {
            this.fillField(form, "Power Total", starship.power == null ? "" : power.toString());
        }
        if (starship.scale) {
            this.fillField(form, "Resistance",  this.calculateResistance(starship.scale, talents));
            this.fillField(form, "Crew Total",  this.calculateCrewSupport(starship.crewSupport));
        }

        if (starship.shields != null) {
            this.fillShields(form, starship.shields);
        }

        this.fillRefits(form, starship);
        this.fillSystems(form, starship);
        this.fillDepartments(form, starship);
        this.fillTalents(form, starship);
        this.fillWeapons(form, construct);
    }

    fillRefits(form: PDFForm, starship: Starship) {
        this.fillField(form, "Refit", starship.refitsAsString());
    }

    calculateCrewSupport(crew: number) {
        return crew.toString();
    }

    calculateResistance(scale: number, talents: string[]) {
        var resistance = scale;

        if (talents.indexOf("Ablative Armor") > -1) {
            resistance += 2;
        }

        if (talents.indexOf("Improved Hull Integrity") > -1) {
            resistance++;
        }

        return resistance.toString();
    }

    isSpecialRuleSectionAvailable(form: PDFForm) {
        try {
            form.getTextField("Special Rule 1");
            return true;
        } catch (e) {
            return false;
        }
    }

    fillTalents(form: PDFForm, starship: Starship) {
        let talents = starship.getTalentSelectionList().map(t => t.description);
        let specialRules = [];
        if (this.isSpecialRuleSectionAvailable(form)) {
            talents = starship.getTalentSelectionList().filter(t => !t.talent.specialRule).map(t => t.description);
            specialRules = starship.getTalentSelectionList().filter(t => t.talent.specialRule).map(t => t.description);
        }

        let i = 1;
        for (let t of talents) {
            this.fillField(form, 'Talent ' + i, t);
            i++;
        }

        i = 1;
        for (let s of specialRules) {
            if (s === "Mission Pod" && starship.missionPodModel != null) {
                this.fillField(form, 'Special Rule ' + i, s + ": " + starship.missionPodModel.name);
            } else {
                this.fillField(form, 'Special Rule ' + i, s);
            }
            i++;
        }
    }

    fillShields(form: PDFForm, shields: number) {
        for (var i = 1; i <= 30; i++) {
            this.fillCheckbox(form, "Shields " + i, i > shields);
        }
    }

    findSecurityValue(construct: Construct) {
        return (construct as Starship).departments[Department.Security];
    }

    fillSystems(form: PDFForm, construct: Construct) {
        let starship = construct as Starship;
        this.fillFieldWithNumber(form, "Engines", starship.getSystemValue(System.Engines));
        this.fillFieldWithNumber(form, "Structure", starship.getSystemValue(System.Structure));
        this.fillFieldWithNumber(form, "Computers", starship.getSystemValue(System.Computer));
        this.fillFieldWithNumber(form, "Sensors", starship.getSystemValue(System.Sensors));
        this.fillFieldWithNumber(form, "Weapons", starship.getSystemValue(System.Weapons));
        this.fillFieldWithNumber(form, "Communications", starship.getSystemValue(System.Comms));
    }

    fillDepartments(form: PDFForm, construct: Construct) {
        let starship = construct as Starship;
        this.fillFieldWithNumber(form, "Command", starship.departments[Department.Command]);
        this.fillFieldWithNumber(form, "Conn", starship.departments[Department.Conn]);
        this.fillFieldWithNumber(form, "Security", starship.departments[Department.Security]);
        this.fillFieldWithNumber(form, "Engineering", starship.departments[Department.Engineering]);
        this.fillFieldWithNumber(form, "Science", starship.departments[Department.Science]);
        this.fillFieldWithNumber(form, "Medicine", starship.departments[Department.Medicine]);
    }

    fillFieldWithNumber(form: PDFForm, name: string, value: number) {
        if (value != null) {
            this.fillField(form, name, value.toString());
        }
    }

    fillWeapon(form: PDFForm, weapon: Weapon, index: number, construct: Construct) {
        let starship = construct as Starship;
        const security = this.findSecurityValue(construct) || 0;

        let dice = security + weapon.dice;
        if (weapon.isTractorOrGrappler) {
            dice = starship.scale - 1;
            if (starship.hasTalent("High-Power Tractor Beam")) {
                dice += 2;
            }
        } else if (weapon.scaleApplies) {
            const scale = starship && starship.scale ? starship.scale : 0;
            dice += scale;
        }

        this.fillField(form, 'Weapon ' + index + ' name', weapon.description);
        this.fillField(form, 'Weapon ' + index + ' dice', "" + dice);
        this.fillField(form, 'Weapon ' + index + ' qualities', weapon.qualities);
    }
}

class StandardTngStarshipSheet extends BasicStarshipSheet {
    getName(): string {
        return 'TNG Standard Starship Sheet (Landscape)'
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/TNG_Standard_Starship_Sheet.png'
    }
    getPdfUrl(): string {
        return '/static/pdf/TNG_Standard_Starship_Sheet_no_outline.pdf'
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        super.populate(pdf, construct);
        let starship = construct as Starship;

        SpaceframeOutline.draw(pdf, new SheetOutlineOptions(new XYLocation(43.5, 290.25), rgb(245.0/255, 157.0/255.0, 8.0/255.0)), starship);
    }
}

class StandardTosStarshipSheet extends BasicStarshipSheet {
    getName(): string {
        return 'TOS Standard Starship Sheet (Landscape)'
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/TOS_Standard_Starship_Sheet.png'
    }
    getPdfUrl(): string {
        return '/static/pdf/STA_TOS_Starship_Sheet.pdf'
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        super.populate(pdf, construct);
        let starship = construct as Starship;

        SpaceframeOutline.draw(pdf, new SheetOutlineOptions(new XYLocation(32, 240.0), rgb(237.0/255, 27.0/255.0, 47.0/255.0), 0.85), starship);
    }
}

class StandardKlingonStarshipSheet extends BasicStarshipSheet {
    getName(): string {
        return 'Klingon Starship Sheet (Landscape)'
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/STA_Klingon_Starship_Sheet.png'
    }
    getPdfUrl(): string {
        return '/static/pdf/STA_Klingon_Starship_Sheet_revised.pdf'
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
    async populate(pdf: PDFDocument, construct: Construct) {
        const form = pdf.getForm();
        pdf.setTitle(construct.name);
        this.populateForm(form, construct);
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
        if (character.role != null) {
            var result = character.role;
            if (character.secondaryRole) {
                result = result + " / " + character.secondaryRole;
            }
            return result;
        } else if (character.jobAssignment != null) {
            return character.jobAssignment;
        } else {
            return "";
        }
    }


    populateForm(form: PDFForm, construct: Construct) {
        let character = construct as Character;
        this.fillName(form, character);
        this.fillField(form, 'Department', this.serializeAssignment(character));
        this.fillField(form, 'Purpose', this.serializeAssignment(character));
        this.fillField(form, 'Rank', character.rank);
        this.fillField(form, 'Species', character.speciesName);
        let traits = character.baseTraits;
        if (character.additionalTraits) {
            traits.push(character.additionalTraits);
        }

        this.fillField(form, 'Traits', CharacterSerializer.serializeTraits(traits));
        character.focuses.forEach( (f, i) => {
            this.fillField(form, 'Focus ' + (i+1), f);
        });

        this.fillAttributes(form, character);
        this.fillSkills(form, character);
        this.fillStress(form, character);
    }

    fillName(form: PDFForm, character: Character) {
        this.fillField(form, 'Name', this.formatName(character));
    }

    formatNameWithoutPronouns(character: Character) {
        return CharacterSerializer.serializeName(character);
    }

    formatName(character: Character) {
        let name = this.formatNameWithoutPronouns(character);
        if (character.pronouns.length > 0) {
            name += " (" + character.pronouns + ")";
        }
        return name;
    }

    fillStress(form: PDFForm, character: Character) {
        var stress = character.stress;
        for (var i = 1; i <= 30; i++) {
            this.fillCheckbox(form, "Stress " + i, i > stress);
        }
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

    populateForm(form: PDFForm, construct: Construct) {
        let character = construct as Character;
        super.populateForm(form, construct);

        var upbringing = character.upbringing;
        if (upbringing != null) {
            this.fillField(form, 'Upbringing', upbringing.name + (character.acceptedUpbringing ? " (A)" : " (R)"));
        }
        this.fillField(form, 'Assignment', this.serializeAssignment(character));
        this.fillField(form, 'Environment', CharacterSerializer.serializeEnvironment(character.environment, character.otherSpeciesWorld, character.type));

        this.fillValues(form, character);
        this.fillTalents(form, character);
        this.fillEquipment(form, character);

        this.fillWeapons(form, construct);
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

    fillWeapons(form: PDFForm, construct: Construct) {
        var weapons = construct.determineWeapons();
        const security = this.findSecurityValue(construct) || 0;

        weapons.forEach( (w, i) => {
            this.fillField(form, 'Weapon ' + (i+1) + ' name', w.name);
            this.fillField(form, 'Weapon ' + (i+1) + ' dice', (w.dice == null) ? "" : ("" + (security + w.dice)));
            this.fillField(form, 'Weapon ' + (i+1) + ' qualities', w.qualities);
        });
    }

    fillTalents(form: PDFForm, character: Character) {
        let i = 1;
        for (var t in character.talents) {
            let talent = TalentsHelper.getTalent(t);
            if (talent && talent.maxRank > 1) {
                let rank = character.talents[t];
                this.fillField(form, 'Talent ' + i, t + " [Rank " + rank.rank + "]");
            } else {
                this.fillField(form, 'Talent ' + i, t);
            }
            i++;
        }
    }

    fillEquipment(form: PDFForm, character: Character) {
        character.equipment.forEach( (e, i) => {
            this.fillField(form, 'Equipment ' + (i+1), e);
        });
    }

    fillValues(form: PDFForm, character: Character) {
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
        return 'https://sta.bcholmes.org/static/img/sheets/TNG_Supporting_Character_Half_Page.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/static/pdf/TNG_Supporting_Character_Half_Page.pdf'
    }
}

class StandardTngCharacterSheet extends BasicFullCharacterSheet {
    getName(): string {
        return 'Standard TNG Character Sheet'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/static/img/sheets/TNG_Standard_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/static/pdf/TNG_Standard_Character_Sheet.pdf'
    }
}

class StandardTosCharacterSheet extends BasicFullCharacterSheet {
    getName(): string {
        return 'TOS Character Sheet (Landscape)'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/static/img/sheets/TOS_Standard_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/static/pdf/TOS_Standard_Character_Sheet.pdf'
    }
}


class KlingonCharacterSheet extends BasicFullCharacterSheet {
    getName(): string {
        return 'Klingon Character Sheet'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/static/img/sheets/STA_Klingon_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/static/pdf/STA_Klingon_Character_Sheet.pdf'
    }

    populateForm(form: PDFForm, construct: Construct) {
        super.populateForm(form, construct);

        this.fillField(form, 'House', (construct as Character).house);
    }

    formatNameWithoutPronouns(character) {
        var result = character.name;
        if (character.lineage) {
            result += (", " + character.lineage);
        }
        return result;
    }
}

class BaseTextCharacterSheet extends BasicFullCharacterSheet {

    addBlankLineAfter(lines: Line[], page: PDFPage) {
        let currentColumn = null;
        let newLocation = null;
        if (lines.length > 0) {
            let line = lines[lines.length-1];
            newLocation = line.location;
            currentColumn = line.column;
            newLocation = new XYLocation(line.bottom().x, line.bottom().y - (0.5 * line.height()));
        }

        if (newLocation && currentColumn) {
            let line = new Line(newLocation, currentColumn);
            line = line.moveToNextColumnIfNecessary(page);
            return line;
        } else {
            return null;
        }
    }

    writeRoleAndTalents(page: PDFPage, character: Character, titleStyle: FontSpecification, paragraphStyle: FontSpecification, symbolStyle: FontSpecification, currentColumn: Column) {
        let start = currentColumn.translatedStart(page);
        let lines: Line[] = [];
        let startLine = new Line(start, currentColumn);
        if (character.role != null) {
            let role = RolesHelper.getRoleModelByName(character.role, character.type);
            if (role) {
                let blocks = this.createTextBlocks(role.name + ":", titleStyle, symbolStyle, startLine, page);
                blocks.forEach((b, i) => { if (i < blocks.length -1) lines.push(b); });

                let line = (blocks.length > 0) ? blocks[blocks.length - 1] : new Line(startLine.location, startLine.column);

                blocks = this.createTextBlocks(role.ability, paragraphStyle, symbolStyle, line, page);
                blocks.forEach(b => lines.push(b));
                startLine = this.addBlankLineAfter(lines, page);
            }
        }

        if (startLine) {
            for (var t in character.talents) {
                let text = t;

                const talent = TalentsHelper.getTalent(t);
                if (talent && talent.maxRank > 1) {
                    let rank = character.talents[t];
                    text += " [Rank: " + rank.rank + "]";
                }

                let blocks = this.createTextBlocks(text + ":", titleStyle, symbolStyle, startLine, page);
                blocks.forEach((b, i) => { if (i < blocks.length -1) lines.push(b); });
                let line = (blocks.length > 0) ? blocks[blocks.length - 1] : new Line(startLine.location, startLine.column);

                if (talent) {
                    blocks = this.createTextBlocks(talent.description, paragraphStyle, symbolStyle, line, page);
                    blocks.forEach(b => lines.push(b));
                    startLine = this.addBlankLineAfter(lines, page);
                    if (startLine == null) {
                        break;
                    }
                }
            };
        }

        lines.forEach(t =>
            this.writeTextBlock(t, page)
        );
    }

    createTextBlocks(text: string, fontSpec: FontSpecification, symbolStyle: FontSpecification, line: Line, page: PDFPage) {
        let result: Line[] = [];
        if (line) {
            let words = text.split(/\s+/);
            let previousBlock = null;
            let textPortion = "";
            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                if (textPortion !== "" || !line.isEmpty()) {
                    word = " " + word;
                }
                if (this.containsDelta(word)) {
                    let parts = this.separateDeltas(word);
                    let blocks = parts.map(p => {
                        if (p === '[D]') {
                            return this.createTextBlock("A", symbolStyle);
                        } else {
                            return this.createTextBlock(p, fontSpec);
                        }
                    });
                    let sum = previousBlock == null ? 0 : previousBlock.width;
                    blocks.forEach(b => sum += b.width);

                    if (sum < line.availableWidth()) {
                        if (previousBlock != null) {
                            line.add(previousBlock);
                            previousBlock = null;
                        }
                        blocks.forEach(b => line.add(b));
                        textPortion = "";

                    } else {
                        line.add(previousBlock);
                        line = line.moveToNextColumnIfNecessary(page);
                        previousBlock = null;
                        if (line) {
                            result.push(line);
                            line = new Line(line.bottom(), line.column);
                        } else {
                            break;
                        }

                        let parts = this.separateDeltas(words[i]); // get the original word without the leading space
                        parts.forEach(p => {
                            if (p === '[D]') {
                                line.add(this.createTextBlock("A", symbolStyle));
                            } else {
                                line.add(this.createTextBlock(p, fontSpec));
                            }
                        });
                    }
                } else {
                    textPortion += word;
                    let block = this.createTextBlock(textPortion, fontSpec);
                    if (block.width < line.availableWidth()) {
                        previousBlock = block;
                    } else {
                        if (previousBlock != null) {
                            line.add(previousBlock);
                            line = line.moveToNextColumnIfNecessary(page);
                            previousBlock = null;
                            if (line) {
                                result.push(line);
                                line = new Line(line.bottom(), line.column);
                            } else {
                                break;
                            }
                        }
                        textPortion = words[i];
                        previousBlock = this.createTextBlock(textPortion, fontSpec);
                    }
                }
            }
            if (previousBlock != null && line != null) {
                line.add(previousBlock);
                result.push(line);
            }
        }
        return result;
    }

    containsDelta(word: string) {
        return word.indexOf("[D]") >= 0;
    }

    separateDeltas(word: string) {
        let result: string[] = [];
        while (word.length > 0) {
            let index = word.indexOf("[D]");
            if (index > 0) {
                result.push(word.substring(0, index));
                result.push(word.substring(index, index+3));
                word = word.substring(index + 3);
            } else if (index === 0) {
                result.push(word.substring(index, index+3));
                word = word.substring(index + 3);
            } else {
                result.push(word);
                word = "";
            }
        }
        return result;
    }

    createTextBlock(text: string, fontSpec: FontSpecification) {
        let textBlock = new TextBlock();
        textBlock.text = text;
        const textWidth = fontSpec.font.widthOfTextAtSize(text, fontSpec.size);
        const textHeight = fontSpec.font.heightAtSize(fontSpec.size);
        textBlock.height = textHeight;
        textBlock.width = textWidth;
        textBlock.font = fontSpec.font;
        textBlock.fontSize = fontSpec.size;
        return textBlock;
    }

    writeTextBlock(line: Line, page: PDFPage) {
        let x = line.bottom().x;
        line.blocks.forEach(textBlock => {
            page.drawText(textBlock.text, {
                x: x,
                y: line.bottom().y,
                size: textBlock.fontSize,
                font: textBlock.font,
                color: rgb(0.1, 0.1, 0.1)
            });
            x += textBlock.width;
        });
    }
}

class TwoPageTngCharacterSheet extends BaseTextCharacterSheet {
    getName(): string {
        return '2-Page TNG Character Sheet'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/static/img/sheets/TNG_2_Page_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/static/pdf/TNG_2_Page_Character_Sheet_new.pdf'
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        pdf.registerFontkit(fontkit);
        await super.populate(pdf, construct);
        await this.fillPageTwo(pdf, construct as Character);

        // pdf-lib does awful things to empty multi-line fields
        // See: https://github.com/Hopding/pdf-lib/discussions/1196
        const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
        let form = pdf.getForm();
        form.getFields().forEach(f => {
            if (f instanceof PDFTextField) {
                let textField = f as PDFTextField;
                if (textField.isMultiline() && (textField.getText() == null || textField.getText().length === 0)) {
                    textField.updateAppearances(helvetica, staTextFieldAppearanceProvider);
                }
            }
        });
    }

    populateForm(form: PDFForm, construct: Construct): void {
        super.populateForm(form, construct);
        const character = construct as Character;

        if (character.careerEvents && character.careerEvents.length > 0) {
            let event1 = CareerEventsHelper.getCareerEvent(character.careerEvents[0], character.type);
            if (event1) {
                this.fillField(form, 'Career Event 1', event1.name);
            }

            if (character.careerEvents && character.careerEvents.length > 1) {
                let event2 = CareerEventsHelper.getCareerEvent(character.careerEvents[1], character.type);
                if (event2) {
                    this.fillField(form, 'Career Event 2', event2.name);
                }
            }
        }

        // I don't know why PDF-Lib changes the font size, but let's try to
        // change it back.
        this.fixFontSize(form, "Career Event 1 description");
        this.fixFontSize(form, "Career Event 2 description");
        this.fixFontSize(form, "Awards and Reputation");
        this.fixFontSize(form, "Notes");
    }

    fixFontSize(form: PDFForm, fieldName: string) {
        try {
            const field = form.getTextField(fieldName)
            if (field) {
                field.enableMultiline();
                field.setFontSize(9);
            }
        } catch (e) {
            // ignore it
        }
    }

    async fillPageTwo(pdf: PDFDocument, character: Character) {
        const page2 = pdf.getPages()[1];
        const symbolFontBytes = await fetch("/static/font/Trek_Arrowheads.ttf").then(res => res.arrayBuffer());

        const helveticaBold = await pdf.embedFont(StandardFonts.HelveticaBold);
        const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
        const symbolFont = await pdf.embedFont(symbolFontBytes);

        const titleStyle = new FontSpecification(helveticaBold, 10);
        const paragraphStyle = new FontSpecification(helvetica, 10);
        const symbolStyle = new FontSpecification(symbolFont, 10);

        let column1 = new Column(369, 40, 774-40, 585-369);
        let currentColumn = column1;

        this.writeRoleAndTalents(page2, character, titleStyle, paragraphStyle, symbolStyle, currentColumn);
    }
}

class TwoPageKlingonCharacterSheet extends BaseTextCharacterSheet {

    getName(): string {
        return '2-Page Klingon Character Sheet'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/static/img/sheets/STA_2_Page_Klingon_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/static/pdf/STA_2_Page_Klingon_Character_Sheet.pdf'
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        pdf.registerFontkit(fontkit);
        await super.populate(pdf, construct);
        await this.fillPageTwo(pdf, construct as Character);

        // pdf-lib does awful things to empty multi-line fields
        // See: https://github.com/Hopding/pdf-lib/discussions/1196
        const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
        let form = pdf.getForm();
        form.getFields().forEach(f => {
            if (f instanceof PDFTextField) {
                let textField = f as PDFTextField;
                if (textField.isMultiline() && (textField.getText() == null || textField.getText().length === 0)) {
                    textField.updateAppearances(helvetica, staTextFieldAppearanceProvider);
                }
            }
        });
    }

    populateForm(form: PDFForm, construct: Construct): void {
        super.populateForm(form, construct);
        const character = construct as Character;

        if (character.careerEvents && character.careerEvents.length > 0) {
            let event1 = CareerEventsHelper.getCareerEvent(character.careerEvents[0], character.type);
            if (event1) {
                this.fillField(form, 'Career Event 1', event1.name);
            }

            if (character.careerEvents && character.careerEvents.length > 1) {
                let event2 = CareerEventsHelper.getCareerEvent(character.careerEvents[1], character.type);
                if (event2) {
                    this.fillField(form, 'Career Event 2', event2.name);
                }
            }
        }

        if (character.career != null) {
            this.fillField(form, 'Career', CareersHelper.getCareer(character.career).name);
        }

        this.fillField(form, 'House', (construct as Character).house);

        // I don't know why PDF-Lib changes the font size, but let's try to
        // change it back.
        this.fixFontSize(form, "Environment Details");
        this.fixFontSize(form, "Upbringing Details");
        this.fixFontSize(form, "Career Details");
        this.fixFontSize(form, "Career Event 1 Details");
        this.fixFontSize(form, "Career Event 2 Details");
    }

    formatNameWithoutPronouns(character) {
        var result = character.name;
        if (character.lineage) {
            result += (", " + character.lineage);
        }
        return result;
    }

    fixFontSize(form: PDFForm, fieldName: string) {
        try {
            const field = form.getTextField(fieldName)
            if (field) {
                field.enableMultiline();
                field.setFontSize(9);
            }
        } catch (e) {
            // ignore it
        }
    }

    async fillPageTwo(pdf: PDFDocument, character: Character) {
        const page2 = pdf.getPages()[1];
        const symbolFontBytes = await fetch("/static/font/Trek_Arrowheads.ttf").then(res => res.arrayBuffer());

        const helveticaBold = await pdf.embedFont(StandardFonts.HelveticaBold);
        const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
        const symbolFont = await pdf.embedFont(symbolFontBytes);

        const titleStyle = new FontSpecification(helveticaBold, 10);
        const paragraphStyle = new FontSpecification(helvetica, 10);
        const symbolStyle = new FontSpecification(symbolFont, 10);

        let column1 = new Column(318, 105, 702-105, 551-318);
        let currentColumn = column1;

        this.writeRoleAndTalents(page2, character, titleStyle, paragraphStyle, symbolStyle, currentColumn);
    }
}

class LandscapeTngCharacterSheet extends BaseTextCharacterSheet {
    getName(): string {
        return 'Landscape TNG Character Sheet'
    }
    getThumbnailUrl(): string {
        return 'https://sta.bcholmes.org/static/img/sheets/TNG_Landscape_Character_Sheet.png'
    }
    getPdfUrl(): string {
        return 'https://sta.bcholmes.org/static/pdf/TNG_Landscape_Character_Sheet.pdf'
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        pdf.registerFontkit(fontkit);
        await super.populate(pdf, construct);
        await this.fillTalentTextBlock(pdf, construct as Character);
    }

    async fillTalentTextBlock(pdf: PDFDocument, character: Character) {
        const page = pdf.getPages()[0];
        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const lightFontBytes = await fetch("/static/font/OpenSansCondensed-Light.ttf").then(res => res.arrayBuffer());
        const symbolFontBytes = await fetch("/static/font/Trek_Arrowheads.ttf").then(res => res.arrayBuffer());

        const openSansBold = await pdf.embedFont(boldFontBytes);
        const openSansLight = await pdf.embedFont(lightFontBytes);
        const symbolFont = await pdf.embedFont(symbolFontBytes);
        const titleStyle = new FontSpecification(openSansBold, 9);
        const paragraphStyle = new FontSpecification(openSansLight, 9);
        const symbolStyle = new FontSpecification(symbolFont, 9);

        let currentColumn = new Column(583, 45, 563-45, 757-583);

        this.writeRoleAndTalents(page, character, titleStyle, paragraphStyle, symbolStyle, currentColumn);
    }

    populateForm(form: PDFForm, construct: Construct): void {
        let character = construct as Character;
        super.populateForm(form, construct);

        this.fillField(form, "Pronouns", character.pronouns);
        if (character.assignedShip) {
            this.fillField(form, "Ship", character.assignedShip);
        }

        if (character.careerEvents && character.careerEvents.length > 0) {
            let event1 = CareerEventsHelper.getCareerEvent(character.careerEvents[0], character.type);
            if (event1) {
                this.fillField(form, 'Career Event 1', event1.name);
            }

            if (character.careerEvents && character.careerEvents.length > 1) {
                let event2 = CareerEventsHelper.getCareerEvent(character.careerEvents[1], character.type);
                if (event2) {
                    this.fillField(form, 'Career Event 2', event2.name);
                }
            }
        }

        this.fillField(form, "Resistance", "" + character.calculateResistance());
    }

    serializeAssignment(character: Character): string {
        return this.serializeBasicAssignment(character);
    }

    fillName(form: PDFForm, character: Character) {
        this.fillField(form, 'Name', this.formatNameWithoutPronouns(character));
    }
}

class CharacterSheets {
    public getSupportingCharacterSheet(c: Character, era: Era = store.getState().context.era): ICharacterSheet[] {
        if (c.isKlingon()) {
            return [ new KlingonCharacterSheet(), new StandardTngCharacterSheet(), new StandardTosCharacterSheet(), new HalfPageSupportingCharacterSheet() ];
        } else if (era === Era.NextGeneration) {
            return [ new StandardTngCharacterSheet(), new HalfPageSupportingCharacterSheet(), new StandardTosCharacterSheet(), new KlingonCharacterSheet()  ];
        } else {
            return [ new StandardTosCharacterSheet(), new StandardTngCharacterSheet(), new HalfPageSupportingCharacterSheet(), new KlingonCharacterSheet() ];
        }
    }

    public getCharacterSheets(character: Character, era: Era = store.getState().context.era): ICharacterSheet[] {
        if (character.isKlingon()) {
            return [ new KlingonCharacterSheet(), new TwoPageKlingonCharacterSheet(), new StandardTngCharacterSheet(), new StandardTosCharacterSheet(), new LandscapeTngCharacterSheet(), new TwoPageTngCharacterSheet() ];
        } else if (era === Era.NextGeneration) {
            return [ new StandardTngCharacterSheet(), new KlingonCharacterSheet(), new StandardTosCharacterSheet(), new LandscapeTngCharacterSheet(), new TwoPageTngCharacterSheet(), new TwoPageKlingonCharacterSheet() ];
        } else {
            return [ new StandardTosCharacterSheet(), new KlingonCharacterSheet(), new StandardTngCharacterSheet(), new LandscapeTngCharacterSheet(), new TwoPageTngCharacterSheet(), new TwoPageKlingonCharacterSheet() ];
        }
    }

    public getStarshipSheets(starship: Starship, era: Era): ICharacterSheet[] {
        if (starship.type === CharacterType.KlingonWarrior) {
            return [ new StandardKlingonStarshipSheet(), new StandardTngStarshipSheet(), new StandardTosStarshipSheet() ];
        } else if (era === Era.NextGeneration) {
            return [ new StandardTngStarshipSheet(), new StandardTosStarshipSheet(), new StandardKlingonStarshipSheet() ];
        } else {
            return [ new StandardTosStarshipSheet(), new StandardTngStarshipSheet(), new StandardKlingonStarshipSheet() ];
        }
    }
}

export const CharacterSheetRegistry = new CharacterSheets();