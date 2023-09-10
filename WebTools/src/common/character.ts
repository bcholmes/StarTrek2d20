import {Attribute, AttributesHelper} from '../helpers/attributes';
import {Skill, SkillsHelper} from '../helpers/skills';
import {Career} from '../helpers/careerEnum';
import {Environment} from '../helpers/environments';
import {Species} from '../helpers/speciesEnum';
import {Track} from '../helpers/trackEnum';
import {EarlyOutlookModel} from '../helpers/upbringings';
import {Workflow} from '../helpers/workflows';
import {TalentViewModel} from '../helpers/talents';
import {CharacterType} from './characterType';
import { AlliedMilitary, AlliedMilitaryType } from '../helpers/alliedMilitary';
import { Government, GovernmentType } from '../helpers/governments';
import AgeHelper, { Age } from '../helpers/age';
import { Weapon, PersonalWeapons } from '../helpers/weapons';
import { Construct, Stereotype } from './construct';
import { SpeciesHelper } from '../helpers/species';
import { Rank } from '../helpers/ranks';
import { makeKey } from './translationKey';
import i18next from 'i18next';

export abstract class CharacterTypeDetails {
}

export enum Division {
    Command,
    Science,
    Operations
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
        if (this.government && this.government.type === GovernmentType.Other && this.name) {
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

    constructor(skill: Skill, expertise: number) {
        this.skill = skill;
        this.expertise = expertise;
    }
}

export class CharacterRank {
    readonly name: string;
    readonly id?: Rank;

    constructor(name: string, id?: Rank) {
        this.name = name;
        this.id = id;
    }

    get localizedName() {
        if (this.id != null) {
            let key = makeKey("Rank.", Rank[this.id], ".name");
            let result = i18next.t(key);
            return key === result ? this.name : result;
        } else {
            return this.name;
        }
    }
}

export class CharacterTalent {
    rank: number;

    constructor(rank: number) {
        this.rank = rank;
    }
}

class Memento {
    page: number;
    character: Character;

    constructor(page: number, character: Character) {
        this.page = page;
        this.character = character;
    }
}

export class SpeciesStep {
    public readonly species: Species;
    public mixedSpecies: Species;
    public originalSpecies: Species;
    public customSpeciesName: string;
    public attributes: Attribute[];

    constructor(species: Species) {
        this.species = species;
        this.attributes = [];
    }
}

export class UpbringingStep {
    public readonly upbringing: EarlyOutlookModel;
    public acceptedUpbringing: boolean;
    public discipline: Skill;
    public focus: string;

    constructor(upbringing: EarlyOutlookModel, accepted: boolean = true) {
        this.upbringing = upbringing;
        this.acceptedUpbringing = accepted;
    }

    get attributes() {
        return this.acceptedUpbringing
                ? [ this.upbringing.attributeAcceptPlus2, this.upbringing.attributeAcceptPlus1 ]
                : [ this.upbringing.attributeRebelPlus2, this.upbringing.attributeRebelPlus1 ];
    }

    get description() {
        return this.upbringing.name + (this.acceptedUpbringing ? " (A)" : " (R)");
    }
}

export class EnvironmentStep {
    public readonly environment: Environment;
    public readonly otherSpecies?: Species;
    public attribute?: Attribute;
    public discipline?: Skill;

    constructor(environment: Environment, otherSpecies?: Species) {
        this.environment = environment;
        this.otherSpecies = otherSpecies;
    }
}

export class EducationStep {
    public readonly track: Track;
    public enlisted: boolean;
    public attributes: Attribute[];
    public primaryDiscipline: Skill;
    public disciplines: Skill[];
    public decrementDiscipline: Skill;
    public focuses: string[];

    constructor(track: Track, enlisted: boolean = false) {
        this.track = track;
        this.enlisted = enlisted;
        this.attributes = [];
        this.disciplines = [];
        this.focuses = ["", "", ""];
    }
}

export class FinishingStep {
    public attributes: Attribute[];
    public disciplines: Skill[];

    constructor() {
        this.attributes = [];
        this.disciplines = [];
    }
}

export class CareerEventStep {
    public readonly id: number;
    attribute?: Attribute;
    discipline?: Skill;
    focus?: string;

    constructor(id: number) {
        this.id = id;
    }
}

export class NpcGenerationStep {
    public enlisted: boolean;
}

export class Character extends Construct {

    public static ABSOLUTE_MAX_ATTRIBUTE = 12;

    private _attributeInitialValue: number = 7;
    private _mementos: Memento[];

    public reputation = 10;
    public reprimands = 0;
    public _attributes: CharacterAttribute[] = [];
    public _skills: CharacterSkill[] = [];
    public traits: string[];
    public additionalTraits: string;
    public talents: { [name: string]: CharacterTalent };
    public age: Age;
    public lineage?: string;
    public house?: string;
    public career?: Career;
    public careerEvents: CareerEventStep[];
    public rank?: CharacterRank;
    public role?: string;
    public jobAssignment?: string;
    public assignedShip?: string;
    public secondaryRole?: string;
    public environmentValue?: string;
    public trackValue?: string;
    public careerValue?: string;
    public finishValue?: string;
    public _focuses: string[];
    public typeDetails: CharacterTypeDetails;
    public workflow?: Workflow;
    public pronouns: string = '';
    public implants: string[];

    // steps
    public educationStep?: EducationStep;
    public speciesStep?: SpeciesStep;
    public environmentStep?: EnvironmentStep;
    public upbringingStep?: UpbringingStep;
    public finishingStep?: FinishingStep;
    public npcGenerationStep?: NpcGenerationStep;

    constructor() {
        super(Stereotype.MainCharacter);
        this._attributes.push(new CharacterAttribute(Attribute.Control, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Daring, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Fitness, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Insight, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Presence, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Reason, this._attributeInitialValue));

        for (var i = 0; i <= Skill.Medicine; i++) {
            this._skills.push(new CharacterSkill(i, 1));
        }

        this._mementos = [];
        this.traits = [];
        this._focuses = [];
        this.talents = {};
        this.implants = [];
        this.careerEvents = [];
        this.age = AgeHelper.getAdultAge();
    }

    get enlisted() {
        if (this.stereotype === Stereotype.Npc && this.npcGenerationStep) {
            return this.npcGenerationStep.enlisted;
        } else {
            return this.educationStep?.enlisted || false;
        }
    }

    get assignmentWithoutShip() {
        let result = "";
        if (this.role) {
            result = this.role;
            if (this.secondaryRole) {
                result = result + " / " + this.secondaryRole;
            }
        } else if (this.jobAssignment) {
            result = this.jobAssignment;
        }
        return result;
    }

    get assignment() {
        let result = this.assignmentWithoutShip;

        if (this.assignedShip) {
            if (result) {
                result += ", ";
            }
            result += this.assignedShip;
        }
        return result;
    }

    get mementos() {
        return this._mementos;
    }

    get attributes() {
        if (this.stereotype === Stereotype.SoloCharacter) {
            let result = [];
            AttributesHelper.getAllAttributes().forEach(a => result.push(new CharacterAttribute(a, 7)));
            this.speciesStep?.attributes?.forEach(a => result[a].value = result[a].value + 1);
            if (this.environmentStep?.attribute != null) {
                result[this.environmentStep.attribute].value = result[this.environmentStep.attribute].value + 1;
            }
            if (this.upbringingStep != null) {
                let earlyOutlook = this.upbringingStep.upbringing;
                if (this.upbringingStep.acceptedUpbringing) {
                    result[earlyOutlook.attributeAcceptPlus2].value = result[earlyOutlook.attributeAcceptPlus2].value + 2;
                    result[earlyOutlook.attributeAcceptPlus1].value = result[earlyOutlook.attributeAcceptPlus1].value + 1;
                } else {
                    result[earlyOutlook.attributeRebelPlus2].value = result[earlyOutlook.attributeRebelPlus2].value + 2;
                    result[earlyOutlook.attributeRebelPlus1].value = result[earlyOutlook.attributeRebelPlus1].value + 1;
                }
            }
            this.educationStep?.attributes?.forEach(a => result[a].value = result[a].value + 1);
            this.careerEvents.filter(e => e.attribute != null).forEach(e => result[e.attribute].value = result[e.attribute].value + 1);

            this.finishingStep?.attributes?.forEach(a => result[a].value = result[a].value + 1)

            AttributesHelper.getAllAttributes().forEach(a => result[a].value = Math.min(Character.maxAttribute(this), result[a].value));

            return result;
        } else {
            return this._attributes;
        }
    }

    get skills(): CharacterSkill[] {
        if (this.stereotype === Stereotype.SoloCharacter) {
            let result = [];
            SkillsHelper.getSkills().forEach(s => result.push(new CharacterSkill(s, 1)));
            if (this.environmentStep?.discipline != null) {
                result[this.environmentStep.discipline].expertise = result[this.environmentStep.discipline].expertise + 1;
            }
            if (this.upbringingStep?.discipline != null) {
                result[this.upbringingStep.discipline].expertise = result[this.upbringingStep.discipline].expertise + 1;
            }
            if (this.educationStep?.primaryDiscipline != null) {
                result[this.educationStep.primaryDiscipline].expertise = result[this.educationStep.primaryDiscipline].expertise + 2;
            }
            if (this.educationStep?.decrementDiscipline != null) {
                result[this.educationStep.decrementDiscipline].expertise = result[this.educationStep.decrementDiscipline].expertise - 1;
            }
            this.educationStep?.disciplines?.forEach(d => result[d].expertise = result[d].expertise + 1);
            this.careerEvents.filter(e => e.discipline != null).forEach(e => result[e.discipline].expertise = result[e.discipline].expertise + 1);

            this.finishingStep?.disciplines?.forEach(d => result[d].expertise = result[d].expertise + 1)

            SkillsHelper.getSkills().forEach(s => result[s].expertise = Math.min(Character.maxDiscipline(this), result[s].expertise));

            return result;
        } else {
            return this._skills;
        }
    }

    get stress() {
        let stress = this.attributes[Attribute.Fitness].value + this.skills[Skill.Security].expertise;

        if (this.hasTalent("Resolute")) {
            stress += 3;
        }
        return stress;
    }

    get division() {
        if (this.type !== CharacterType.Starfleet) {
            return null;
        } else if (this.educationStep?.track != null) {
            if (this.educationStep?.track === Track.Command) {
                return Division.Command;
            } else if (this.educationStep?.track === Track.Operations) {
                return Division.Operations
            } else if (this.educationStep?.track === Track.Sciences) {
                return Division.Science;
            } else {
                return null;
            }
        } else {
            return null; // figure out from specialization?
        }
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

        if (this.role === "Chief Medical Officer" ||
            this.role === "Head Nurse" ||
            this.role === "Chief Surgeon" ||
            this.role === "Physician's Assistant" ||
            this.role === "Anesthesiologist" ||
            this.role === "Ship's Doctor" ||
            this.role === "Surgeon (HaqwI’)" ||
            this.jobAssignment === "Medical Doctor" ||
            this.jobAssignment === "Nurse" ||
            this.jobAssignment === "Medic") {

            result.push("MedKit");
        }

        if (this.isEngineer()) {
            result.push("Engineering Kit");
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

    get nameAndFullRank() {
        if (this.rank) {
            return this.rank + " " + this.name;
        } else {
            return this.name;
        }
    }

    getTalentNameList() {
        let result = []
        for (let name in this.talents) {
            let t = this.talents[name];
            result.push(t.rank === 1 ? name : (name + " [Rank " + t.rank + "]"));
        }
        return result;
    }

    determineWeapons() {
        let result: Weapon[] = [];

        if (this.hasTalent("Mean Right Hook")) {
            result.push(PersonalWeapons.instance.unarmedStrikeMean);
        } else {
            result.push(PersonalWeapons.instance.unarmedStrike);
        }

        if (this.hasTalent("The Ushaan")) {
            result.push(PersonalWeapons.instance.ushaanTor);
        }

        if (this.hasTalent("Warrior's Spirit")) {
            result.push(PersonalWeapons.instance.batLeth);
        }

        if (this.type === CharacterType.Starfleet) {
            if (this.isSecurityOrSeniorOfficer()) {
                result.push(PersonalWeapons.instance.phaser2);
            } else {
                result.push(PersonalWeapons.instance.phaser1);
            }
        } else if (this.type === CharacterType.Cadet) {
            result.push(PersonalWeapons.instance.phaser1);
        } else if (this.isBajoranMilitia() || this.isCardassianUnion()) {
            result.push(PersonalWeapons.instance.phaser2);
        } else if (this.age.isAdult()) {
            if (this.isKlingon()) {
                result.push(PersonalWeapons.instance.dkTagh);
            }
            if (this.type !== CharacterType.Child && this.type !== CharacterType.Civilian) {
                result.push(PersonalWeapons.instance.disruptorPistol);
            }
        }
        return result;
    }

    isBajoranMilitia() {
        if (this.type === CharacterType.AlliedMilitary && this.typeDetails != null && this.typeDetails instanceof AlliedMilitaryDetails) {
            return (this.typeDetails as AlliedMilitaryDetails).alliedMilitary?.type === AlliedMilitaryType.BajoranMilitia;
        } else {
            return false;
        }
    }

    isCardassianUnion() {
        if (this.type === CharacterType.AlliedMilitary && this.typeDetails != null && this.typeDetails instanceof AlliedMilitaryDetails) {
            return (this.typeDetails as AlliedMilitaryDetails).alliedMilitary?.type === AlliedMilitaryType.CardassianUnion;
        } else {
            return false;
        }
    }

    get resistance() {
        return this.calculateResistance();
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
        if (this.hasTalent("Thickened Carapace")) {
            result += 2;
        }
        if (this.hasTalent("Carnivorous Reptilian Physiology")) {
            result += 2;
        }
        return result;
    }

    saveMemento(page: number) {
        if (!this._mementos.some(s => s.page === page)) {
            const copy = this.copy();
            this._mementos.push(new Memento(page, copy));
        }
    }

    goToStep(page: number) {
        for (let i = this._mementos.length - 1; i >= 0; i--) {
            if (this._mementos[i].page === page) {
                character = this._mementos[i].character;
                character.saveMemento(page);
                break;
            }
        }
    }

    get speciesName() {
        if (this.speciesStep == null) {
            return "";
        } else if (this.speciesStep.species === Species.Custom) {
            return this.speciesStep.customSpeciesName || "";
        } else {
            let species = SpeciesHelper.getSpeciesByType(this.speciesStep.species);
            let result = species.name;
            if (this.speciesStep.mixedSpecies != null) {
                let mixedSpecies = SpeciesHelper.getSpeciesByType(this.speciesStep.mixedSpecies);
                result += (" / " + mixedSpecies.name);
            }
            if (this.speciesStep.originalSpecies != null) {
                let orginalSpecies = SpeciesHelper.getSpeciesByType(this.speciesStep.originalSpecies);
                result += (" (originally " + orginalSpecies.name + ")");
            }
            return result;
        }
    }

    get localizedSpeciesName() {
        if (this.speciesStep == null) {
            return "";
        } else if (this.speciesStep.species === Species.Custom) {
            return this.speciesStep.customSpeciesName || "";
        } else {
            let species = SpeciesHelper.getSpeciesByType(this.speciesStep.species);
            if (this.speciesStep.mixedSpecies != null) {
                let mixedSpecies = SpeciesHelper.getSpeciesByType(this.speciesStep.mixedSpecies);
                return i18next.t('Species.mixedSpecies.text', {"primarySpecies": species.localizedName, "secondarySpecies": mixedSpecies.localizedName});
            }
            if (this.speciesStep.originalSpecies != null) {
                let originalSpecies = SpeciesHelper.getSpeciesByType(this.speciesStep.originalSpecies);
                return i18next.t('Species.formerSpecies.text', {"primarySpecies": species.localizedName, "otherSpecies": originalSpecies.localizedName});
            } else {
                return species.localizedName;
            }
        }
    }

    get baseTraits() {
        let traits = [ ...this.traits ];
        if (this.speciesStep?.species === Species.Custom && this.speciesStep?.customSpeciesName) {
            traits.push(this.speciesStep.customSpeciesName);
        }
        if (this.hasTalent("Augmented Ability (Control)")
                || this.hasTalent("Augmented Ability (Daring)")
                || this.hasTalent("Augmented Ability (Fitness)")
                || this.hasTalent("Augmented Ability (Insight)")
                || this.hasTalent("Augmented Ability (Presence)")
                || this.hasTalent("Augmented Ability (Reason)")
                || this.hasTalent("Augmented Ability")) {
            traits.push("Augment");
        }
        if (this.hasTalent("Joined")) {
            traits.push("Symbiont");
        }
        if (this.hasTalent("Sensory Replacement")) {
            traits.push("Artificial Sense");
        }
        if (this.role === 'Ambassador') {
            if (this.type === CharacterType.AmbassadorDiplomat && this.typeDetails) {
                let details = this.typeDetails as GovernmentDetails;
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
        this._focuses.push(focus);
    }

    get focuses() {
        if (this.stereotype === Stereotype.SoloCharacter) {
            let result = [];
            if (this.upbringingStep?.focus) {
                result.push(this.upbringingStep.focus);
            }
            if (this.educationStep) {
                this.educationStep.focuses.filter(f => f?.length).forEach(f => result.push(f));
            }
            this.careerEvents.filter(e => e?.focus != null).forEach(e => result.push(e.focus));
            return result;
        } else {
            return this._focuses;
        }
    }

    isEngineer() {
        return this.role?.toLowerCase() === "chief engineer" || this.role?.toLowerCase() === "engineering officer (jonpin)"
            || (this.jobAssignment && this.jobAssignment?.toLowerCase().indexOf("engineer") >= 0);
    }

    isSecurityOrSeniorOfficer() {
        return (this.rank &&
                (this.rank?.name?.toLowerCase() === "captain" ||
                 this.rank?.name?.toLowerCase() === "commander" ||
                 this.rank?.name?.toLowerCase() === "lieutenant commander" ||
                 this.rank?.name?.toLowerCase().indexOf("admiral") >= 0 ||
                 (this.role !== undefined && this.role!.toLowerCase() === "chief of security"))) ||
                 (this.jobAssignment?.toLowerCase() === "security");
    }

    isYoung() {
        return this.hasTalent("Untapped Potential");
    }

    isCivilian() {
        return this.type === CharacterType.AmbassadorDiplomat || this.type === CharacterType.Civilian || this.type === CharacterType.Child;
    }

    isKlingon() {
        return this.type === CharacterType.KlingonWarrior ||
            (this.type === CharacterType.AlliedMilitary && this.typeDetails
                && (this.typeDetails as AlliedMilitaryDetails).alliedMilitary.type === AlliedMilitaryType.KlingonDefenceForce);
    }

    hasMaxedAttribute() {
        const max = Character.ABSOLUTE_MAX_ATTRIBUTE;
        return this.attributes.some(a => a.value === max);
    }

    hasMaxedSkill() {
        const max = 5;
        return this.skills.some(s => s.expertise === max);
    }

    addValue(value: string) {
        if (this.environmentValue == null) {
            this.environmentValue = value;
        } else if (this.trackValue == null) {
            this.trackValue = value;
        } else if (this.careerValue == null) {
            this.careerValue = value;
        } else if (this.finishValue == null) {
            this.finishValue = value;
        }
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

        this._skills.forEach(s => {
            if (s.expertise > maxDiscipline) {
                s.expertise = maxDiscipline;
            }
        });
    }

    public copy(): Character {
        var character = new Character();

        character.type = this.type;
        character.stereotype = this.stereotype;
        character.typeDetails = this.typeDetails;
        this._mementos.forEach(s => {
            character._mementos.push(new Memento(s.page, s.character));
        });
        this._attributes.forEach(a => {
            character._attributes[a.attribute].attribute = a.attribute;
            character._attributes[a.attribute].value = a.value;
        });
        this._skills.forEach(s => {
            character._skills[s.skill].skill = s.skill;
            character._skills[s.skill].expertise = s.expertise;
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
            let event = new CareerEventStep(e.id);
            event.attribute = e.attribute;
            event.discipline = e.discipline;
            event.focus = e.focus;
            character.careerEvents.push(event);
        });
        character.jobAssignment = this.jobAssignment;
        character.assignedShip = this.assignedShip;
        character.rank = this.rank;
        character.role = this.role;
        if (this.speciesStep) {
            character.speciesStep = new SpeciesStep(this.speciesStep.species);
            character.speciesStep.mixedSpecies = this.speciesStep.mixedSpecies;
            character.speciesStep.originalSpecies = this.speciesStep.originalSpecies;
            character.speciesStep.customSpeciesName = this.speciesStep.customSpeciesName;
            if (this.speciesStep.attributes?.length) {
                character.speciesStep.attributes = [...this.speciesStep.attributes];
            }
        }
        if (this.environmentStep) {
            character.environmentStep = new EnvironmentStep(this.environmentStep.environment, this.environmentStep.otherSpecies);
            character.environmentStep.attribute = this.environmentStep.attribute;
            character.environmentStep.discipline = this.environmentStep.discipline;
        }
        if (this.upbringingStep) {
            character.upbringingStep = new UpbringingStep(this.upbringingStep.upbringing);
            character.upbringingStep.acceptedUpbringing = this.upbringingStep.acceptedUpbringing;
            character.upbringingStep.discipline = this.upbringingStep.discipline;
            character.upbringingStep.focus = this.upbringingStep.focus;
        }
        if (this.educationStep) {
            character.educationStep = new EducationStep(this.educationStep.track, this.educationStep.enlisted);
            character.educationStep.attributes = [...this.educationStep.attributes];
            character.educationStep.disciplines = [...this.educationStep.disciplines];
            character.educationStep.primaryDiscipline = this.educationStep.primaryDiscipline;
            character.educationStep.decrementDiscipline = this.educationStep.decrementDiscipline;
            character.educationStep.focuses = [...this.educationStep.focuses];
        }
        if (this.finishingStep) {
            character.finishingStep = new FinishingStep();
            character.finishingStep.attributes = [...this.finishingStep.attributes];
            character.finishingStep.disciplines = [...this.finishingStep.disciplines];
        }
        character.environmentValue = this.environmentValue;
        character.trackValue = this.trackValue;
        character.careerValue = this.careerValue;
        character.finishValue = this.finishValue;
        this._focuses.forEach(f => {
            character._focuses.push(f);
        });
        if (this.workflow) {
            character.workflow = this.workflow.copy();
        }
        character.pronouns = this.pronouns;
        character.name = this.name;
        character.additionalTraits = this.additionalTraits;
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
        return character.type === CharacterType.KlingonWarrior ||
            (character.type === CharacterType.AlliedMilitary
                && character.typeDetails != null && character.typeDetails instanceof AlliedMilitaryDetails
                && (character.typeDetails as AlliedMilitaryDetails).alliedMilitary?.species?.length > 0);
    }

    public static createSoloCharacter() {
        let result = new Character();
        result.stereotype = Stereotype.SoloCharacter;
        return result;
    }
}

export let character = new Character();

export const setGlobalCharacter = (c: Character) => {
    if (c) {
        character = c;
    }
}

