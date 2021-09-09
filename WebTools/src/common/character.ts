import {Attribute, AttributesHelper} from '../helpers/attributes';
import {Skill} from '../helpers/skills';
import {Source} from '../helpers/sources';
import {Era} from '../helpers/eras';
import {Career, CareersHelper} from '../helpers/careers';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {Environment, EnvironmentsHelper} from '../helpers/environments';
import {Rank, RanksHelper} from '../helpers/ranks';
import {Role, RolesHelper} from '../helpers/roles';
import {Species, SpeciesHelper} from '../helpers/species';
import {Track, TracksHelper} from '../helpers/tracks';
import {Upbringing, UpbringingsHelper} from '../helpers/upbringings';
import {WorkflowsHelper, Workflow} from '../helpers/workflows';
import {TalentsHelper} from '../helpers/talents';
import {Spaceframe, MissionPod} from '../helpers/spaceframes';
import {MissionProfile} from "../helpers/missionProfiles";

export enum Gender {
    Male,
    Female
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
    isLegendary: boolean;

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

export class Starship {
    serviceYear: number;
    spaceframe: Spaceframe;
    missionPod: MissionPod;
    missionProfile: MissionProfile;
    systems: number[];
    departments: number[];
    scale: number;

    constructor() {
        this.systems = [];
        this.departments = [];
        this.scale = 0;
    }
}

export const enum CharacterType {
    Starfleet = 0,
    KlingonWarrior
}

class Step {
    page: number;
    character: Character;

    constructor(page: number, character: Character) {
        this.page = page;
        this.character = character;
    }
}

export class Character {
    private _attributeInitialValue: number = 7;
    private _steps: Step[];

    public sources: Source[];
    public era: Era = Era.NextGeneration;
    public attributes: CharacterAttribute[] = [];
    public skills: CharacterSkill[] = [];
    public traits: string[];
    public talents: { [name: string]: CharacterTalent };
    public age: number;
    public name: string;
    public lineage: string;
    public house: string;
    public appearance: string;
    public personality: string;
    public gender: Gender = Gender.Male;
    public equipment: string[];
    public career: Career;
    public careerEvents: number[];
    public environment: Environment;
    public otherSpeciesWorld: string;
    public rank: string;
    public role: string;
    public secondaryRole: string;
    public roleAbility: string;
    public species: Species;
    public mixedSpecies: Species;
    public track: Track;
    public upbringing: Upbringing;
    public acceptedUpbringing: boolean;
    public enlisted: boolean;
    public environmentValue: string;
    public trackValue: string;
    public careerValue: string;
    public finishValue: string;
    public focuses: string[];
    public stress: number;
    public allowCrossSpeciesTalents: boolean;
    public type: CharacterType = CharacterType.Starfleet;
    public workflow: Workflow;

    public starship: Starship;

    constructor() {
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
        this.sources = [];
        this.traits = [];
        this.focuses = [];
        this.talents = {};
        this.age = 18;
        this.equipment = [];
        this.careerEvents = [];

        this.allowCrossSpeciesTalents = false;

        this.starship = null;
    }

    get steps() {
        return this._steps;
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

    addTrait(trait: string) {
        this.traits.push(trait);
    }

    addTalent(name: string) {
        var found = false;

        if (name.indexOf('[') > -1) {
            name = name.substr(0, name.indexOf('[') - 1);
        }

        if (name.indexOf('(') > -1) {
            name = name.substr(0, name.indexOf('(') - 1);
        }

        for (var talent in this.talents) {
            var t = this.talents[talent];
            if (talent === name) {
                t.rank++;
                found = true;
                break;
            }
        }

        if (!found) {
            this.talents[name] = new CharacterTalent(1);

            TalentsHelper.applyTalent(name);
        }
    }

    hasTalent(name: string) {
        var found = false;

        for (var talent in this.talents) {
            var t = this.talents[talent];
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

    addEquipment(name: string) {
        this.equipment.push(name);
    }

    isSecurityOrSeniorOfficer() {
        return (this.rank &&
                (this.rank.toLowerCase() === "captain" ||
                 this.rank.toLowerCase() === "commander" ||
                 this.rank.toLowerCase() === "lieutenant commander" ||
                 this.role.toLowerCase() === "chief of security"));
    }

    isYoung() {
        return this.hasTalent("Untapped Potential");
    }

    hasMaxedAttribute() {
        const max = 12;
        return this.attributes.some(a => a.value === max);
    }

    hasMaxedSkill() {
        const max = 5;
        return this.skills.some(s => s.expertise === max);
    }

    addSource(source: Source) {
        this.sources.push(source);
    }

    removeSource(source: Source) {
        if (this.hasSource(source)) {
            this.sources.splice(this.sources.indexOf(source), 1);
        }
    }

    hasSource(source: Source) {
        return character.sources.indexOf(source) > -1 || source === Source.Core;
    }

    update() {
        let maxAttribute = 12;
        let maxDiscipline = 5;

        if (this.isYoung()) {
            maxAttribute = 11;
            maxDiscipline = 4;
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

        this.sources.forEach(s => {
            character.sources.push(s);
        });
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
        character.era = this.era;
        this.traits.forEach(t => {
            character.traits.push(t);
        });
        character.age = this.age;
        this.equipment.forEach(eq => {
            character.addEquipment(eq);
        });
        character.career = this.career;
        this.careerEvents.forEach(e => {
            character.careerEvents.push(e);
        });
        character.environment = this.environment;
        character.otherSpeciesWorld = this.otherSpeciesWorld;
        character.rank = this.rank;
        character.role = this.role;
        character.roleAbility = this.roleAbility;
        character.species = this.species;
        character.mixedSpecies = this.mixedSpecies;
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
        character.stress = this.stress;
        character.allowCrossSpeciesTalents = this.allowCrossSpeciesTalents;

        return character;
    }
}

export let character = new Character();
