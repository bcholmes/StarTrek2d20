import {Attribute} from '../helpers/attributes';
import {Skill} from '../helpers/skills';
import {Source} from '../helpers/sources';
import {Era} from '../helpers/eras';
import {Career} from '../helpers/careers';
import {Environment} from '../helpers/environments';
import {Species} from '../helpers/species';
import {Track} from '../helpers/tracks';
import {UpbringingModel} from '../helpers/upbringings';
import {Workflow} from '../helpers/workflows';
import {TalentViewModel} from '../helpers/talents';
import {MissionPod, MissionPodViewModel, SpaceframeHelper, SpaceframeViewModel} from '../helpers/spaceframes';
import {MissionProfileViewModel} from "../helpers/missionProfiles";
import {CharacterType} from './characterType';
import { System } from '../helpers/systems';
import { AlliedMilitary, AlliedMilitaryType } from '../helpers/alliedMilitary';
import { Government, GovernmentType } from '../helpers/governments';
import AgeHelper, { Age } from '../helpers/age';
import { Weapon } from '../helpers/weapons';
import { Department } from '../helpers/departments';


export abstract class Construct {
    public name?: string;
    public type: CharacterType = CharacterType.Starfleet;
    
    determineWeapons() : Weapon[] {
        return [];
    }
}

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

export class Starship extends Construct {
    registry: string = "";
    traits: string = "";
    serviceYear?: number;
    spaceframeModel?: SpaceframeViewModel = undefined;
    missionPod?: MissionPod;
    missionPodModel?: MissionPodViewModel;
    missionProfileModel?: MissionProfileViewModel;
    systems: number[];
    departments: number[];
    scale: number;
    profileTalent?: TalentViewModel;
    additionalTalents: TalentViewModel[] = [];
    refits: System[] = [];

    constructor() {
        super();
        this.systems = [];
        this.departments = [];
        this.scale = 0;
        this.name = "";
    }

    getAllTraits() {
        let trait = this.type === CharacterType.KlingonWarrior ? "Klingon Starship" : "Federation Starship";
        if (this.spaceframeModel) {
            trait = this.spaceframeModel.additionalTraits.join(', ');
        }
        if (this.traits) {
            trait += `, ${this.traits}`;
        }
        return trait;
    }

    getBaseSystem(system: System) {
        let result = 0;
        if (this.spaceframeModel) {
            result = this.spaceframeModel.systems[system];
            if (this.spaceframeModel.isMissionPodAvailable && this.missionPodModel) {
                result += this.missionPodModel.systems[system];
            }
        }
        return result;
    }
    getSystemValue(system: System) {
        let base = this.getBaseSystem(system);
        this.refits.forEach(r => { if (r === system) base++});
        return base;
    }

    getTalentNameList() {
        let talents = [];

        if (this.spaceframeModel) {
            talents = [...this.spaceframeModel.talents.map(t => { return t.name; })];
        }

        if (this.profileTalent) {
            talents.push(this.profileTalent.name);
        }
        this.additionalTalents.forEach(t => {
            talents.push(t.name);
        });
        const missionPod = SpaceframeHelper.getMissionPod(this.missionPod);
        if (missionPod) {
            missionPod.talents.forEach(t => {
                talents.push(t.name);
            });
        }
        return talents;
    }

    getShields() {
        if (this.systems && this.departments) {
            let base = this.systems[System.Structure] + this.departments[Department.Security];
            if (this.getTalentNameList().indexOf("Advanced Shields") > -1) {
                base += 5;
            }
            return base;
        } else {
            return undefined;
        }
    }

    refitsAsString() {
        let systems: System[] = [ System.Comms, System.Computer, System.Engines, System.Sensors, System.Structure, System.Weapons ];
        let refitString = "";
        if (this.refits) {
            systems.forEach(s => {
                let value = 0;
                this.refits.forEach(r => value += (r === s) ? 1 : 0);
                if (value > 0) {
                    if (refitString !== "") {
                        refitString += ", ";
                    }
                    refitString += "+" + value + " " + System[s];
                }
            });
        }
        return refitString;
    }

    determineWeapons(): Weapon[] {
        var result = [];
        var secondary = [];
        const talents = this.getTalentNameList();
        const spaceframe = this.spaceframeModel;
        if (spaceframe) {
            for (var attack of spaceframe.attacks) {

                if (attack === 'Photon Torpedoes') {
                    result.push(new Weapon(attack, 3, "High Yield"));
                } else if (attack === 'Phaser Cannons' || attack === 'Phase Cannons') {
                    result.push(new Weapon(attack, 2, "Versatile 2", true));
                } else if (attack === 'Phaser Banks') {
                    result.push(new Weapon(attack, 1, "Versatile 2", true));
                } else if (attack === 'Phaser Arrays') {
                    result.push(new Weapon(attack, 0, "Versatile 2, Area or Spread", true));
                } else if (attack === 'Disruptor Cannons') {
                    result.push(new Weapon(attack, 2, "Viscious 1", true));
                } else if (attack === 'Disruptor Banks') {
                    result.push(new Weapon(attack, 1, "Viscious 1", true));
                } else if (attack === 'Disruptor Arrays') {
                    result.push(new Weapon(attack, 0, "Viscious 1, Area or Spread", true));
                } else if (attack === 'Plasma Torpedoes') {
                    result.push(new Weapon(attack, 3, "Persistent, Calibration"));
                } else if (attack.indexOf('Tractor Beam') >= 0 || attack.indexOf('Grappler Cables') >= 0) {
                    let index = attack.indexOf("(Strength");
                    let index2 = attack.indexOf(")", index);
                    let strength = index >= 0 && index2 >= 0 ? attack.substr(index + "(Strength".length + 1, index2) : "0";
                    secondary.push(new Weapon(attack.indexOf('Tractor Beam') >= 0 ? 'Tractor Beam' : 'Grappler Cables', parseInt(strength), ""));
                }
            }

            if (spaceframe.attacks.indexOf('Quantum Torpedoes') >= 0 || talents.indexOf('Quantum Torpedoes') >= 0) {
                result.push(new Weapon('Quantum Torpedoes', 4, "Vicious 1, Calibration, High Yield"));
            }

            if (spaceframe.attacks.indexOf('Spatial Torpedoes') >= 0 && talents.indexOf('Nuclear Warheads') >= 0) {
                result.push(new Weapon('Nuclear Warheads', 3, "Vicious 1, Calibration"));
            } else if (spaceframe.attacks.indexOf('Spatial Torpedoes') >= 0) {
                result.push(new Weapon('Spatial Torpedoes', 2, ""));
            } else if (spaceframe.attacks.indexOf('Nuclear Warheads') >= 0 || talents.indexOf('Nuclear Warheads') >= 0) {
                result.push(new Weapon('Nuclear Warheads', 3, "Vicious 1, Calibration"));
            }
        }

        secondary.forEach(w => {
            result.push(w);
        });

        return result;
    }

    static updateSystemAndDepartments(starship: Starship) {
        if (starship.spaceframeModel !== undefined && starship.missionProfileModel !== undefined) {
            const frame = starship.spaceframeModel;
            const missionPod = starship.missionPodModel;
            const profile = starship.missionProfileModel;

            starship.scale = frame.scale;

            frame.systems.forEach((s, i) => {
                starship.systems[i] = s;
            });

            frame.departments.forEach((d, i) => {
                starship.departments[i] = d;
            });

            if (missionPod) {
                missionPod.systems.forEach((s, i) => {
                    starship.systems[i] += s;
                });

                missionPod.departments.forEach((d, i) => {
                    starship.departments[i] += d;
                });
            }

            profile.departments.forEach((d, i) => {
                starship.departments[i] += d;
            });

            if (starship.refits) {
                starship.refits.forEach(r => starship.systems[r] += 1);
            }
        }
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
    private _attributeInitialValue: number = 7;
    private _steps: Step[];

    public sources: Source[];
    public era: Era = Era.NextGeneration;
    public attributes: CharacterAttribute[] = [];
    public skills: CharacterSkill[] = [];
    public traits: string[];
    public additionalTraits: string;
    public talents: { [name: string]: CharacterTalent };
    public age: Age;
    public lineage?: string;
    public house?: string;
    public equipment: string[];
    public career?: Career;
    public careerEvents: number[];
    public environment?: Environment;
    public otherSpeciesWorld?: string;
    public rank?: string;
    public role?: string;
    public secondaryRole?: string;
    public roleAbility?: string;
    public species?: Species;
    public mixedSpecies?: Species;
    public track?: Track;
    public upbringing?: UpbringingModel;
    public acceptedUpbringing?: boolean;
    public enlisted?: boolean;
    public environmentValue?: string;
    public trackValue?: string;
    public careerValue?: string;
    public finishValue?: string;
    public focuses: string[];
    public stress?: number;
    public typeDetails: CharacterTypeDetails;
    public workflow?: Workflow;
    public pronouns: string = '';

    public starship?: Starship;

    // these options probably shouldn't be in the character. Fix that later
    public allowCrossSpeciesTalents: boolean = false;
    public allowEsotericTalents: boolean = false;

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
        this.sources = [];
        this.traits = [];
        this.focuses = [];
        this.talents = {};
        this.equipment = [];
        this.careerEvents = [];
        this.age = AgeHelper.getAdultAge();

        this.allowCrossSpeciesTalents = false;

        this.starship = undefined;
    }

    get steps() {
        return this._steps;
    }

    determineWeapons() {
        let result: Weapon[] = [];
            
        if (this.hasTalent("Mean Right Hook")) {
            result.push(new Weapon("Unarmed Strike", 1, "Knockdown, Non-lethal Vicious 1"));
        } else {
            result.push(new Weapon("Unarmed Strike", 1, "Knockdown"));
        }

        if (this.hasTalent("The Ushaan")) {
            result.push(new Weapon("Ushaan-tor", 1, "Vicious 1"));
        }

        if (this.hasTalent("Warrior's Spirit")) {
            result.push(new Weapon("Bat'leth", 3, "Vicious 1"));
        }

        if (this.type === CharacterType.Starfleet) {
            result.push(new Weapon("Phaser type-2", 3, "Charges"));
        } else if (this.age.isAdult()) {
            if (this.isKlingon()) {
                result.push(new Weapon("d’k tahg dagger", 1, "Vicious 1, Deadly, Hidden 1"));
            }
            result.push(new Weapon("Disruptor Pistol", 3, "Vicious 1"));
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
            traits.push(character.additionalTraits);
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

    addEquipment(name: string) {
        this.equipment.push(name);
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

    hasAnySource(sources: Source[]) {
        var result: boolean = false;
        for (var s of sources) {
            result = result || character.sources.indexOf(s) > -1 || s === Source.Core;
        }
        return result;
    }

    update() {
        let maxAttribute = 12;
        let maxDiscipline = Character.maxDiscipline(this);

        if (this.isYoung()) {
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
        if (this.workflow) {
            character.workflow = this.workflow.copy();
        }

        return character;
    }

    public static maxDiscipline(character) {
        if (character.age.isChild()) {
            return 3;
        } else if (character.isYoung()) {
            return 4;
        } else {
            return 5;
        }
    }
}

export let character = new Character();
