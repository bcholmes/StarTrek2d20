import {Attribute} from '../helpers/attributes';
import {Skill} from '../helpers/skills';
import {Career} from '../helpers/careers';
import {Environment} from '../helpers/environments';
import {Species} from '../helpers/speciesEnum';
import {Track} from '../helpers/tracks';
import {UpbringingModel} from '../helpers/upbringings';
import {Workflow} from '../helpers/workflows';
import {TalentViewModel} from '../helpers/talents';
import {CharacterType} from './characterType';
import { AlliedMilitary, AlliedMilitaryType } from '../helpers/alliedMilitary';
import { Government, GovernmentType } from '../helpers/governments';
import AgeHelper, { Age } from '../helpers/age';
import { Weapon, WeaponType } from '../helpers/weapons';
import { Construct } from './construct';
import { Starship } from './starship';
import { SpeciesHelper } from '../helpers/species';

export abstract class CharacterTypeDetails {
}

export class AlliedMilitaryDetails extends CharacterTypeDetails {

    alliedMilitary: AlliedMilitary;
    name: string;

    constructor(alliedMilitary: AlliedMilitary, name: string) {
        super();
        this.alliedMilitary = alliedMilitary;
        this.name = name;
    }
}

export class GovernmentDetails extends CharacterTypeDetails {

    government: Government;
    name: string;

    constructor(government: Government, name: string) {
        super();
        this.government = government;
        this.name = name;
    }

    getName() {
        if (this.government && this.government.type === GovernmentType.OTHER && this.name) {
            return this.name;
        } else if (this.government) {
            return this.government.name;
        } else {
            return "";
        }
    }
}

export class CharacterAttribute {
    attribute: Attribute;
    value: number;

    constructor(attr: Attribute, val: number) {
        this.attribute = attr;
        this.value = val;
    }
}

export class CharacterSkill {
    skill: Skill;
    expertise: number;
    focus: number;

    constructor(skill: Skill, expertise: number, focus: number) {
        this.skill = skill;
        this.expertise = expertise;
        this.focus = focus;
    }
}

export class CharacterTalent {
    rank: number;

    constructor(rank: number) {
        this.rank = rank;
    }
}

class Step {
    page: number;
    character: Character;

    constructor(page: number, character: Character) {
        this.page = page;
        this.character = character;
    }
}

export class Character extends Construct {

    public static ABSOLUTE_MAX_ATTRIBUTE = 12;

    private _attributeInitialValue: number = 7;
    private _steps: Step[];

    public attributes: CharacterAttribute[] = [];
    public skills: CharacterSkill[] = [];
    public traits: string[];
    public additionalTraits: string;
    public talents: { [name: string]: CharacterTalent };
    public age: Age;
    public lineage?: string;
    public house?: string;
    public career?: Career;
    public careerEvents: number[];
    public environment?: Environment;
    public otherSpeciesWorld?: string;
    public rank?: string;
    public role?: string;
    public jobAssignment?: string;
    public assignedShip?: string;
    public secondaryRole?: string;
    public species?: Species;
    public mixedSpecies?: Species;
    public originalSpecies?: Species;
    public track?: Track;
    public upbringing?: UpbringingModel;
    public acceptedUpbringing?: boolean;
    public enlisted?: boolean;
    public environmentValue?: string;
    public trackValue?: string;
    public careerValue?: string;
    public finishValue?: string;
    public focuses: string[];
    public typeDetails: CharacterTypeDetails;
    public workflow?: Workflow;
    public pronouns: string = '';
    public implants: string[];

    public starship?: Starship;

    constructor() {
        super();
        this.attributes.push(new CharacterAttribute(Attribute.Control, this._attributeInitialValue));
        this.attributes.push(new CharacterAttribute(Attribute.Daring, this._attributeInitialValue));
        this.attributes.push(new CharacterAttribute(Attribute.Fitness, this._attributeInitialValue));
        this.attributes.push(new CharacterAttribute(Attribute.Insight, this._attributeInitialValue));
        this.attributes.push(new CharacterAttribute(Attribute.Presence, this._attributeInitialValue));
        this.attributes.push(new CharacterAttribute(Attribute.Reason, this._attributeInitialValue));

        for (var i = 0; i <= Skill.Medicine; i++) {
            this.skills.push(new CharacterSkill(i, 1, 0));
        }

        this._steps = [];
        this.traits = [];
        this.focuses = [];
        this.talents = {};
        this.implants = [];
        this.careerEvents = [];
        this.age = AgeHelper.getAdultAge();

        this.starship = undefined;
    }

    get steps() {
        return this._steps;
    }

    get stress() {
        let stress = this.attributes[Attribute.Fitness].value + this.skills[Skill.Security].expertise;

        if (this.hasTalent("Resolute")) {
            stress += 3;
        }
        return stress;
    }

    get equipment() {
        let result = [];
        if (this.age.isChild()) {
            result.push("Clothing");
        } else if (this.isCivilian()) {
            result.push("Clothing");
        } else if (this.type === CharacterType.KlingonWarrior) {
            result.push("Armor");
            result.push("Communicator");
            result.push("Tricorder");
        } else {
            result.push("Uniform");
            result.push("Communicator");
            result.push("Tricorder");
        }

        if (this.hasTalent("The Ushaan")) {
            result.push("Ushaan-tor ice pick");
        }

        if (this.implants) {
            this.implants.forEach(i => result.push(i));
        }

        return result;
    }

    get values() {
        let result = [];
        if (this.environmentValue) {
            result.push(this.environmentValue);
        }
        if (this.trackValue) {
            result.push(this.trackValue);
        }
        if (this.careerValue) {
            result.push(this.careerValue);
        }
        if (this.finishValue) {
            result.push(this.finishValue);
        }
        return result;
    }

    getTalentNameList() {
        let result = []
        for (let name in this.talents) {
            let t = this.talents[name];
            result.push(t.rank === 1 ? name : (name + " [x" + t.rank + "]"));
        }
        return result;
    }

    determineWeapons() {
        let result: Weapon[] = [];

        if (this.hasTalent("Mean Right Hook")) {
            result.push(Weapon.createCharacterWeapon("Unarmed Strike", 1, "Knockdown, Non-lethal Vicious 1", WeaponType.MELEE));
        } else {
            result.push(Weapon.createCharacterWeapon("Unarmed Strike", 1, "Knockdown", WeaponType.MELEE));
        }

        if (this.hasTalent("The Ushaan")) {
            result.push(Weapon.createCharacterWeapon("Ushaan-tor", 1, "Vicious 1", WeaponType.MELEE));
        }

        if (this.hasTalent("Warrior's Spirit")) {
            result.push(Weapon.createCharacterWeapon("Bat'leth", 3, "Vicious 1", WeaponType.MELEE));
        }

        if (this.type === CharacterType.Starfleet || this.type === CharacterType.Cadet) {
            result.push(Weapon.createCharacterWeapon("Phaser type-2", 3, "Charges", WeaponType.ENERGY));
        } else if (this.age.isAdult()) {
            if (this.isKlingon()) {
                result.push(Weapon.createCharacterWeapon("d’k tahg dagger", 1, "Vicious 1, Deadly, Hidden 1", WeaponType.MELEE));
            }
            result.push(Weapon.createCharacterWeapon("Disruptor Pistol", 3, "Vicious 1", WeaponType.ENERGY));
        }
        return result;
    }

    calculateResistance() {
        let result = 0;
        if (this.isKlingon()) {
            result += 1; // Klingon standard-issue armour
        }
        if (this.hasTalent("Chelon Shell")) {
            result += 1;
        }
        if (this.hasTalent("Morphogenic Matrix")) {
            result += 4;
        }
        if (this.hasTalent("Polyalloy Construction")) {
            result += 1;
        }
        if (this.hasTalent("Hardened Hide")) {
            result += 2;
        }
        return result;
    }

    saveStep(page: number) {
        if (!this._steps.some(s => s.page === page)) {
            const copy = this.copy();
            this._steps.push(new Step(page, copy));
        }
    }

    goToStep(page: number) {
        for (var i = this._steps.length - 1; i >= 0; i--) {
            if (this._steps[i].page === page) {
                character = this._steps[i].character;
                character.saveStep(page);
                break;
            }
        }
    }

    get speciesName() {
        if (this.species == null) {
            return "";
        } else {
            let species = SpeciesHelper.getSpeciesByType(this.species);
            let result = species.name;
            if (this.mixedSpecies != null) {
                let mixedSpecies = SpeciesHelper.getSpeciesByType(this.mixedSpecies);
                result += (" / " + mixedSpecies.name);
            }
            if (this.originalSpecies != null) {
                let orginalSpecies = SpeciesHelper.getSpeciesByType(this.originalSpecies);
                result += (" (originally " + orginalSpecies.name + ")");
            }
            return result;
        }
    }

    get baseTraits() {
        let traits = [ ...this.traits ];
        if (character.hasTalent("Augmented Ability (Control)")
                || character.hasTalent("Augmented Ability (Daring)")
                || character.hasTalent("Augmented Ability (Fitness)")
                || character.hasTalent("Augmented Ability (Insight)")
                || character.hasTalent("Augmented Ability (Presence)")
                || character.hasTalent("Augmented Ability (Reason)")
                || character.hasTalent("Augmented Ability")) {
            traits.push("Augment");
        }
        if (character.hasTalent("Joined")) {
            traits.push("Symbiont");
        }
        if (character.hasTalent("Sensory Replacement")) {
            traits.push("Artificial Sense");
        }
        if (character.role === 'Ambassador') {
            if (character.type === CharacterType.AmbassadorDiplomat && character.typeDetails) {
                let details = character.typeDetails as GovernmentDetails;
                traits.push(details.getName() ? details.getName() + " Ambassador" : "Ambassador");
            } else {
                traits.push("Ambassador");
            }
        }
        return traits;
    }

    addTrait(trait: string) {
        this.traits.push(trait);
    }

    getAllTraits() {
        let traits = this.baseTraits;
        if (this.additionalTraits) {
            traits.push(this.additionalTraits);
        }

        let result = "";
        for (let i = 0; i < traits.length; i++) {
            result += `${traits[i]}${i < traits.length-1 ? ", " : ""}`;
        }
        return result;
    }

    addTalent(talentModel: TalentViewModel) {
        var found = false;

        for (let talent in this.talents) {
            let t = this.talents[talent];
            if (talent === talentModel.name) {
                t.rank++;
                found = true;
                break;
            }
        }

        if (!found) {
            this.talents[talentModel.name] = new CharacterTalent(1);
        }
    }

    hasTalent(name: string) {
        let found = false;

        for (let talent in this.talents) {
            if (talent === name) {
                found = true;
                break;
            }
        }

        return found;
    }

    addFocus(focus: string) {
        this.focuses.push(focus);
    }

    isSecurityOrSeniorOfficer() {
        return (this.rank &&
                (this.rank.toLowerCase() === "captain" ||
                 this.rank.toLowerCase() === "commander" ||
                 this.rank.toLowerCase() === "lieutenant commander" ||
                 (this.role !== undefined && this.role!.toLowerCase() === "chief of security")));
    }

    isYoung() {
        return this.hasTalent("Untapped Potential");
    }

    isCivilian() {
        return this.type === CharacterType.AmbassadorDiplomat || this.type === CharacterType.Civilian;
    }

    isKlingon() {
        return this.type === CharacterType.KlingonWarrior ||
            (this.type === CharacterType.AlliedMilitary && this.typeDetails
                && (this.typeDetails as AlliedMilitaryDetails).alliedMilitary.type === AlliedMilitaryType.KLINGON_DEFENCE_FORCE);
    }

    hasMaxedAttribute() {
        const max = Character.ABSOLUTE_MAX_ATTRIBUTE;
        return this.attributes.some(a => a.value === max);
    }

    hasMaxedSkill() {
        const max = 5;
        return this.skills.some(s => s.expertise === max);
    }

    update() {
        let maxAttribute = Character.ABSOLUTE_MAX_ATTRIBUTE;
        let maxDiscipline = Character.maxDiscipline(this);

        if (this.isYoung() || this.type === CharacterType.Cadet) {
            maxAttribute = 11;
        }

        this.attributes.forEach(a => {
            if (a.value > maxAttribute) {
                a.value = maxAttribute;
            }
        });

        this.skills.forEach(s => {
            if (s.expertise > maxDiscipline) {
                s.expertise = maxDiscipline;
            }
        });
    }

    private copy(): Character {
        var character = new Character();

        character.type = this.type;
        character.typeDetails = this.typeDetails;
        this._steps.forEach(s => {
            character.steps.push(new Step(s.page, s.character));
        });
        this.attributes.forEach(a => {
            character.attributes[a.attribute].attribute = a.attribute;
            character.attributes[a.attribute].value = a.value;
        });
        this.skills.forEach(s => {
            character.skills[s.skill].skill = s.skill;
            character.skills[s.skill].expertise = s.expertise;
            character.skills[s.skill].focus = s.focus;
        });
        for (var talent in this.talents) {
            const t = this.talents[talent];
            character.talents[talent] = new CharacterTalent(t.rank);
        }
        this.traits.forEach(t => {
            character.traits.push(t);
        });
        character.age = this.age;
        character.implants = this.implants;
        character.career = this.career;
        this.careerEvents.forEach(e => {
            character.careerEvents.push(e);
        });
        character.jobAssignment = this.jobAssignment;
        character.assignedShip = this.assignedShip;
        character.environment = this.environment;
        character.otherSpeciesWorld = this.otherSpeciesWorld;
        character.rank = this.rank;
        character.role = this.role;
        character.species = this.species;
        character.mixedSpecies = this.mixedSpecies;
        character.originalSpecies = this.originalSpecies;
        character.track = this.track;
        character.upbringing = this.upbringing;
        character.acceptedUpbringing = this.acceptedUpbringing;
        character.enlisted = this.enlisted;
        character.environmentValue = this.environmentValue;
        character.trackValue = this.trackValue;
        character.careerValue = this.careerValue;
        character.finishValue = this.finishValue;
        this.focuses.forEach(f => {
            character.focuses.push(f);
        });
        if (this.workflow) {
            character.workflow = this.workflow.copy();
        }

        return character;
    }

    public static maxAttribute(character) {
        if (character.age.isChild()) {
            return 10;
        } else if (character.isYoung() || character.type === CharacterType.Cadet) {
            return 11;
        } else {
            return Character.ABSOLUTE_MAX_ATTRIBUTE;
        }
    }

    public static maxDiscipline(character) {
        if (character.age.isChild()) {
            return 3;
        } else if (character.isYoung() || character.type === CharacterType.Cadet) {
            return 4;
        } else {
            return 5;
        }
    }

    public static isSpeciesListLimited(character) {
        return character.type === CharacterType.KlingonWarrior || (character.type === CharacterType.AlliedMilitary
            && character.typeDetails != null && character.typeDetails instanceof AlliedMilitaryDetails
            && (character.typeDetails as AlliedMilitaryDetails).alliedMilitary.species.length > 0);
    }
}

export let character = new Character();
