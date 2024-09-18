import {Attribute, AttributesHelper} from '../helpers/attributes';
import {Skill, SkillsHelper} from '../helpers/skills';
import {Career} from '../helpers/careerEnum';
import {Environment} from '../helpers/environments';
import {Species} from '../helpers/speciesEnum';
import {Track} from '../helpers/trackEnum';
import {EarlyOutlookModel} from '../helpers/upbringings';
import {ITalent} from '../helpers/italent';
import {CharacterType} from './characterType';
import { AlliedMilitary, AlliedMilitaryType } from '../helpers/alliedMilitary';
import { Government, Polity } from '../helpers/governments';
import AgeHelper, { Age } from '../helpers/age';
import { Weapon, PersonalWeapons } from '../helpers/weapons';
import { Construct, Stereotype } from './construct';
import { SpeciesHelper } from '../helpers/species';
import { Rank, RanksHelper } from '../helpers/ranks';
import { makeKey } from './translationKey';
import i18next from 'i18next';
import { Role, RolesHelper } from '../helpers/roles';
import { BorgImplantType, BorgImplants, Implant } from '../helpers/borgImplant';
import { Specialization } from './specializationEnum';
import { MilestoneType } from '../modify/model/milestoneType';
import { EquipmentHelper, EquipmentModel, EquipmentType } from '../helpers/equipment';
import { Era } from '../helpers/eras';
import { SpeciesAbility, SpeciesAbilityList } from '../helpers/speciesAbility';
import { IWeaponDiceProvider } from './iWeaponDiceProvider';
import { TalentModel } from '../helpers/talents';

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
        if (this.government && this.government.type === Polity.Other && this.name) {
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

    get localizedAbbreviation() {
        if (this.id != null) {
            let key = makeKey("Rank.", Rank[this.id], ".abbrev");
            let result = i18next.t(key);
            return key === result ? this.name : result;
        } else {
            return this.name;
        }
    }
}

export class SupportingStep {
    focuses: string[];
    attributes: Attribute[];
    disciplines: Skill[];
    value: string;
    supervisory: boolean = false;

    constructor() {
        this.focuses = ["", "", ""];
        this.attributes = [...AttributesHelper.getAllAttributes()];
        this.disciplines = [...SkillsHelper.getSkills()];
    }

    copy() {
        let result = new SupportingStep();
        result.focuses = [...this.focuses];
        result.attributes = [...this.attributes];
        result.disciplines = [...this.disciplines];
        result.supervisory = this.supervisory;
        result.value = this.value;
        return result;
    }
}

export class SupportingImrovementStep {
    value: string;
    attribute: Attribute;
    discipline: Skill;
    focus: string;
    talent: SelectedTalent;

    copy() {
        let result = new SupportingImrovementStep();
        result.value = this.value;
        result.attribute = this.attribute;
        result.discipline = this.discipline;
        result.focus = this.focus;
        result.talent = this.talent?.copy();
        return result;
    }
}

export class SelectedTalent {

    readonly talent: string;
    implants: BorgImplantType[];
    focuses: string[];
    value: string;
    attribute?: Attribute;

    constructor(talent: string) {
        this.talent = talent;
        this.implants = [];
        this.focuses = [];
    }

    copy() {
        let result = new SelectedTalent(this.talent);
        result.implants = [...this.implants];
        result.focuses = [...this.focuses];
        result.value = this.value;
        result.attribute = this.attribute;
        return result;
    }
}


export class CareerStep {
    career?: Career;
    value?: string;
    talent?: SelectedTalent;

    constructor(career?: Career) {
        this.career = career;
    }

    public copy() {
        const careerStep = new CareerStep(this.career);
        careerStep.value = this.value;
        careerStep.talent = this.talent == null ? null : this.talent.copy();
        return careerStep;
    }
}

export class MilestoneTalentChange {
    removed: string;
    added: string;
}

export class MilestoneFocusChange {
    removed: string;
    added: string;
}

export class MilestoneAttributeChange {
    removed: Attribute;
    added: Attribute;
}

export class Milestone {
    readonly type: MilestoneType;
    change?: MilestoneTalentChange|MilestoneFocusChange|MilestoneAttributeChange;

    constructor(type: MilestoneType) {
        this.type = type;
    }
}

export class SpeciesAbilityOptions {
    focuses: string[] = [];

    copy() {
        let result = new SpeciesAbilityOptions();
        result.focuses = [...this.focuses];
        return result;
    }
}

export class SpeciesStep {
    public readonly species: Species;
    public mixedSpecies: Species;
    public originalSpecies: Species;
    public customSpeciesName: string;
    public attributes: Attribute[];
    public talent?: SelectedTalent;
    public ability?: SpeciesAbility;
    public abilityOptions: SpeciesAbilityOptions;

    constructor(species: Species) {
        this.species = species;
        this.attributes = [];
    }

    copy() {
        let result = new SpeciesStep(this.species);
        result.mixedSpecies = this.mixedSpecies;
        result.originalSpecies = this.originalSpecies;
        result.customSpeciesName = this.customSpeciesName;
        if (this.attributes?.length) {
            result.attributes = [...this.attributes];
        }
        if (this.talent != null) {
            result.talent = this.talent.copy();
        }
        if (this.ability != null) {
            result.ability = this.ability;
        }

        result.abilityOptions = this.abilityOptions?.copy();
        return result;
    }
}

export class UpbringingStep {
    public readonly upbringing: EarlyOutlookModel;
    public acceptedUpbringing: boolean;
    public discipline: Skill;
    public focus?: string;
    public talent?: SelectedTalent;

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

    get localizedDescription() {
        return this.upbringing.localizedName + (this.acceptedUpbringing ? " (A)" : " (R)");
    }
}

export class EnvironmentStep {
    public readonly environment: Environment;
    public readonly otherSpecies?: Species;
    public attribute?: Attribute;
    public discipline?: Skill;
    public value?: string;

    constructor(environment: Environment, otherSpecies?: Species) {
        this.environment = environment;
        this.otherSpecies = otherSpecies;
    }
}

export class EducationStep {
    public readonly track?: Track;
    public enlisted: boolean;
    public decrementAttributes: Attribute[];
    public attributes: Attribute[];
    public primaryDiscipline: Skill;
    public disciplines: Skill[];
    public decrementDisciplines: Skill[];
    public focuses: string[];
    public talent?: SelectedTalent;
    public value?: string;

    constructor(track?: Track, enlisted: boolean = false) {
        this.track = track;
        this.enlisted = enlisted;
        this.attributes = [];
        this.decrementAttributes = [];
        this.decrementDisciplines = [];
        this.disciplines = [];
        this.focuses = ["", "", ""];
    }
}

export class FinishingStep {
    public attributes: Attribute[];
    public disciplines: Skill[];
    public value?: string;
    public talent?: SelectedTalent;

    constructor() {
        this.attributes = [];
        this.disciplines = [];
    }

    copy() {
        let result = new FinishingStep();
        result.attributes = [...this.attributes];
        result.disciplines = [...this.disciplines];
        result.value = this.value;
        if (this.talent != null) {
            result.talent = this.talent.copy();
        }
        return result;
    }
}

export class CareerEventStep {
    public readonly id: number;
    attribute?: Attribute;
    discipline?: Skill;
    focus?: string;
    trait?: string;

    constructor(id: number) {
        this.id = id;
    }
}

export class NpcGenerationStep {
    public specialization: Specialization;
    public enlisted: boolean;
    public values: string[] = [];
    public talents: SelectedTalent[] = [];

    copy() {
        let result = new NpcGenerationStep();
        result.values = [...this.values];
        result.talents = this.talents.map(t => t.copy());
        return result;
    }
}

export class Character extends Construct implements IWeaponDiceProvider {

    public static ABSOLUTE_MAX_ATTRIBUTE = 12;

    private _attributeInitialValue: number = 7;

    public reputation = 10;
    public reprimands = 0;
    public _attributes: CharacterAttribute[] = [];
    public _skills: number[] = [];
    public traits: string[];
    public additionalTraits: string;
    public age: Age;
    public lineage?: string;
    public house?: string;
    public careerEvents: CareerEventStep[];
    public rank?: CharacterRank;
    public role?: Role;
    public jobAssignment?: string;
    public assignedShip?: string;
    public secondaryRole?: Role;
    public _focuses: string[];
    public typeDetails: CharacterTypeDetails;
    public pronouns: string = '';
    public pastime: string[];

    // steps
    public educationStep?: EducationStep;
    public speciesStep?: SpeciesStep;
    public environmentStep?: EnvironmentStep;
    public upbringingStep?: UpbringingStep;
    public careerStep?: CareerStep;
    public finishingStep?: FinishingStep;
    public npcGenerationStep?: NpcGenerationStep;
    public supportingStep?: SupportingStep;

    public improvements: SupportingImrovementStep[];

    public legacyMode: boolean;

    constructor() {
        super(Stereotype.MainCharacter);
        this._attributes.push(new CharacterAttribute(Attribute.Control, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Daring, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Fitness, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Insight, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Presence, this._attributeInitialValue));
        this._attributes.push(new CharacterAttribute(Attribute.Reason, this._attributeInitialValue));

        for (var i = 0; i <= Skill.Medicine; i++) {
            this._skills.push(0);
        }

        this.traits = [];
        this._focuses = [];
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
        if (this.role != null) {
            result = RolesHelper.instance.getRole(this.role, this.type)?.name ?? "";
            if (this.secondaryRole != null) {
                let secondary = RolesHelper.instance.getRole(this.secondaryRole, this.type)?.name ?? "";
                result = result + " / " + secondary;
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

    get localizedAssignment() {
        let result = this.localizedAssignmentWithoutShip;

        if (this.assignedShip) {
            if (result) {
                result += ", ";
            }
            result += this.assignedShip;
        }
        return result;
    }

    get localizedAssignmentWithoutShip() {
        let result = "";
        if (this.role != null) {
            result = RolesHelper.instance.getRole(this.role, this.type)?.localizedName ?? "";
            if (this.secondaryRole != null) {
                let secondary = RolesHelper.instance.getRole(this.secondaryRole, this.type)?.localizedName ?? "";
                result = result + " / " + secondary;
            }
        } else if (this.jobAssignment) {
            result = this.jobAssignment;
        }
        return result;
    }
    get mementos() {
        return [];
    }

    get talents(): SelectedTalent[] {
        if (this.stereotype === Stereotype.Npc) {
            return this.npcGenerationStep ? [...this.npcGenerationStep.talents] : [];
        } else {
            let result = [];
            if (this.speciesStep?.talent != null) {
                result.push(this.speciesStep.talent);
            }
            if (this.upbringingStep?.talent != null) {
                result.push(this.upbringingStep.talent);
            }
            if (this.educationStep?.talent != null) {
                result.push(this.educationStep.talent);
            }
            if (this.careerStep?.talent != null) {
                result.push(this.careerStep.talent);
            }
            if (this.finishingStep?.talent != null) {
                result.push(this.finishingStep.talent);
            }
            return result;
        }
    }

    get attributes() {
        if (this.stereotype === Stereotype.SoloCharacter || (this.stereotype === Stereotype.MainCharacter && !this.legacyMode)) {
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
            this.educationStep?.decrementAttributes?.forEach(a => result[a].value = result[a].value - 1);
            this.educationStep?.attributes?.forEach(a => result[a].value = result[a].value + 1);
            this.careerEvents.filter(e => e.attribute != null).forEach(e => result[e.attribute].value = result[e.attribute].value + 1);

            this.finishingStep?.attributes?.forEach(a => result[a].value = result[a].value + 1)

            AttributesHelper.getAllAttributes().forEach(a => result[a].value = Math.min(Character.maxAttribute(this), result[a].value));

            return result;
        } else if (this.stereotype === Stereotype.SupportingCharacter && !this.legacyMode) {
            let values = this.age.attributes;
            if (this.version > 1 && this.type !== CharacterType.Child && this.supportingStep?.supervisory) {
                values = [10, 10, 9, 9, 8, 8];
            }
            return AttributesHelper.getAllAttributes().map(a => {
                let index = this.supportingStep?.attributes?.indexOf(a);
                let speciesBonus = this.speciesStep?.attributes?.filter(att => att === a).length;
                return new CharacterAttribute(a, values[index] + speciesBonus);
            });
        } else {
            return this._attributes;
        }
    }

    get attributeTotal() {
        let attributeTotal = 0;
        this.attributes.forEach(a => attributeTotal += a.value);
        return attributeTotal;
    }

    get skills(): CharacterSkill[] {
        if (this.stereotype === Stereotype.SoloCharacter || (this.stereotype === Stereotype.MainCharacter && !this.legacyMode)) {
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
            this.educationStep?.decrementDisciplines?.forEach(d =>  result[d].expertise = result[d].expertise - 1);
            this.educationStep?.disciplines?.forEach(d => result[d].expertise = result[d].expertise + 1);
            this.careerEvents.filter(e => e.discipline != null).forEach(e => result[e.discipline].expertise = result[e.discipline].expertise + 1);

            this.finishingStep?.disciplines?.forEach(d => result[d].expertise = result[d].expertise + 1)

            SkillsHelper.getSkills().forEach(s => result[s].expertise = Math.min(Character.maxDiscipline(this), result[s].expertise));

            return result;
        } else if (this.stereotype === Stereotype.SupportingCharacter && !this.legacyMode) {
            let values = [...this.age.disciplines];
            if (this.version > 1 && this.type !== CharacterType.Child && this.supportingStep?.supervisory) {
                values = [4, 4, 3, 2, 2, 1];
            }
            let result = SkillsHelper.getSkills().map(s => {
                let index = this.supportingStep?.disciplines?.indexOf(s);
                return new CharacterSkill(s, values[index]);
            });
            this.improvements?.forEach(i => {
                if (i.discipline != null) {
                    result[i.discipline].expertise = result[i.discipline].expertise + 1;
                }
            })
            return result;
        } else {
            return SkillsHelper.getSkills().map(s => new CharacterSkill(s, this._skills[s]));
        }
    }

    get skillTotal() {
        let total = 0;
        this.skills.forEach(s => total += s.expertise);
        return total;
    }

    get stress() {
        let stress = this.attributes[Attribute.Fitness].value;
        if (this.version === 1) {
            stress +=  + this.skills[Skill.Security].expertise;
        } else if (this.speciesStep?.species === Species.Vulcan) {
            // species ability makes stress based on Control
            stress = this.attributes[Attribute.Control].value;
        }

        if (this.hasTalent("Resolute")) {
            if (this.version === 1) {
                stress += 3;
            } else {
                stress += this.skills[Skill.Command].expertise;
            }
        }

        if (this.hasTalent("Tough")) {
            stress += 2;
        }
        return stress;
    }

    get division() {
        if (this.type !== CharacterType.Starfleet) {
            return null;
        } else {

            if (this.role != null) {
                switch (this.role) {
                    case Role.CommandingOfficer:
                    case Role.ExecutiveOfficer:
                    case Role.FlightController:
                    case Role.Helmsman:
                    case Role.Navigator:
                        return Division.Command;

                    case Role.ChiefEngineer:
                    case Role.ChiefOfSecurity:
                    case Role.TacticalOfficer:
                    case Role.CommunicationsOfficer:
                    case Role.OperationsManager:
                        return Division.Operations;

                    case Role.ScienceOfficer:
                    case Role.ChiefMedicalOfficer:
                    case Role.HeadNurse:
                    case Role.Anesthesiologist:
                    case Role.ShipsCounselor:
                    case Role.ChiefSurgeon:
                    case Role.FieldMedic:
                        return Division.Science;

                    default:
                }
            }

            if (this.npcGenerationStep?.specialization != null) {
                switch (this.npcGenerationStep.specialization) {
                    case Specialization.Captain:
                    case Specialization.FirstContactSpecialist:
                    case Specialization.Conn:
                    case Specialization.HangarDeck:
                        return Division.Command;

                    case Specialization.Engineer:
                    case Specialization.Security:
                        return Division.Operations;

                    case Specialization.StarfleetScientist:
                    case Specialization.Counselor:
                    case Specialization.Nurse:
                    case Specialization.MedicalDoctor:
                        return Division.Science;

                    default:
                }
            }

            if (this.educationStep?.track != null) {
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
    }

    get equipmentModels(): EquipmentModel[] {
        let result = [];
        if (this.age.isChild) {
            result.push(EquipmentHelper.instance.findByType(EquipmentType.Clothing));
        } else if (this.isCivilian()) {
            result.push(EquipmentHelper.instance.findByType(EquipmentType.Clothing));
        } else if (this.type === CharacterType.KlingonWarrior) {
            result.push(EquipmentHelper.instance.findByType(EquipmentType.Armor));
            result.push(EquipmentHelper.instance.findByType(EquipmentType.Communicator));
            result.push(EquipmentHelper.instance.findByType(EquipmentType.Tricorder));
        } else {
            result.push(EquipmentHelper.instance.findByType(EquipmentType.Uniform));
            result.push(EquipmentHelper.instance.findByType(EquipmentType.Communicator));
            result.push(EquipmentHelper.instance.findByType(EquipmentType.Tricorder));
        }

        if (this.role === Role.ChiefMedicalOfficer ||
            this.role === Role.HeadNurse ||
            this.role === Role.ChiefSurgeon ||
            this.role === Role.PhysiciansAssistant ||
            this.role === Role.Anesthesiologist ||
            this.role === Role.ShipsDoctor ||
            this.jobAssignment === "Medical Doctor" ||
            this.jobAssignment === "Medical Doctor (Resident)" ||
            this.jobAssignment === "Nurse" ||
            this.jobAssignment === "Medic") {

            result.push(EquipmentHelper.instance.findByType(EquipmentType.MedKit));
        }

        if (this.isEngineer()) {
            result.push(EquipmentHelper.instance.findByType(EquipmentType.EngineeringKit));
        }

        if (this.hasTalent("The Ushaan")) {
            result.push(EquipmentHelper.instance.findByType(EquipmentType.UshaanTor));
        }

        if (this.npcGenerationStep?.specialization === Specialization.OrionPirate) {
            result.push(EquipmentHelper.instance.findByType(EquipmentType.OrionMultiKey));
        }

        return result;
    }

    get equipment() {
        return this.equipmentModels.map(e => e.name);
    }

    get equipmentAndImplants(): (EquipmentModel|Implant)[] {
        let result: (EquipmentModel|Implant)[] = [...this.equipmentModels];
        if (this.implants?.length) {
            this.implants.forEach(i => result.push(BorgImplants.instance.getImplantByType(i)));
        }
        return result.filter(i => i != null);
    }

    get values() {
        let result =[];
        if (this.stereotype === Stereotype.Npc) {
            return this.npcGenerationStep?.values ?? [];
        } else if (this.stereotype === Stereotype.SupportingCharacter) {
            if (this.supportingStep?.value) {
                result.push(this.supportingStep.value);
            }
        } else {
            if (this.environmentStep?.value) {
                result.push(this.environmentStep.value);
            }
            if (this.educationStep?.value) {
                result.push(this.educationStep.value);
            }
            if (this.careerStep?.value) {
                result.push(this.careerStep.value);
            }
            if (this.finishingStep?.value) {
                result.push(this.finishingStep.value);
            }

            if (this.speciesStep?.talent?.value) {
                result.push(this.speciesStep.talent.value);
            }
            if (this.upbringingStep?.talent?.value) {
                result.push(this.upbringingStep.talent.value);
            }
            if (this.educationStep?.talent?.value) {
                result.push(this.educationStep.talent.value);
            }
            if (this.careerStep?.talent?.value) {
                result.push(this.careerStep.talent.value);
            }
            if (this.finishingStep?.talent?.value) {
                result.push(this.finishingStep.talent?.value);
            }

        }

        this.improvements?.forEach(i => {
            if (i.value != null) {
                result.push(i.value);
            }
        })

        return result;
    }

    get nameAndFullRank() {
        if (this.rank) {
            return this.rank + " " + this.name;
        } else {
            return this.name;
        }
    }

    get implants(): BorgImplantType[] {
        let result = [];
        this.talents.forEach(t => result.push.apply(result, t.implants));
        return result;
    }

    getDiceForWeapon(weapon: Weapon) {
        if (this.version === 1) {
            return weapon.dice + this.skills[Skill.Security].expertise;
        } else {
            return weapon.dice;
        }
    }

    getRankForTalent(talentName: string) {
        return this.talents.filter(t => t.talent === talentName).length;
    }

    getTalentNameList() {
        let consolidatedTalents = {};
        this.talents.forEach(t => {
            let rank = consolidatedTalents[t.talent] ?? 0;
            consolidatedTalents[t.talent] = rank + 1;
        })

        let result = []
        for (let name in consolidatedTalents) {
            let rank = consolidatedTalents[name];
            result.push(rank === 1 ? name : (name + " [Rank " + rank + "]"));
        }
        return result;
    }

    /* returns the "official" name of the talent */
    getDistinctTalentNameList(): string[] {
        let result = [];
        this.talents.forEach(t => {
            if (result.indexOf(t.talent) < 0) {
                result.push(t.talent);
            }
        })

        return result;
    }


    determineWeapons() {
        let result: Weapon[] = [];

        if (this.hasTalent("Mean Right Hook")) {
            result.push(PersonalWeapons.instance(this.version).unarmedStrikeMean);
        } else if (this.hasTalent("Martial Artist")) {
            result.push(PersonalWeapons.instance(this.version).unarmedStrikeMartialArtist);
        } else if (this.hasTalent("Brute Force") || this.hasTalent("Extra Arms")) {
            result.push(PersonalWeapons.instance(this.version).unarmedStrikeBruteForce);
        } else {
            result.push(PersonalWeapons.instance(this.version).unarmedStrike);
        }

        if (this.hasTalent("The Ushaan")) {
            result.push(PersonalWeapons.instance(this.version).ushaanTor);
        }

        if (this.hasTalent("Warrior's Spirit")) {
            result.push(PersonalWeapons.instance(this.version).batLeth);
        }

        if (this.type === CharacterType.Starfleet) {
            if (this.isSecurityOrSeniorOfficer()) {
                result.push(PersonalWeapons.instance(this.version).phaser2);
            } else {
                result.push(PersonalWeapons.instance(this.version).phaser1);
            }
        } else if (this.type === CharacterType.Cadet) {
            result.push(PersonalWeapons.instance(this.version).phaser1);
        } else if (this.isBajoranMilitia() || this.isCardassianUnion()) {
            result.push(PersonalWeapons.instance(this.version).phaser2);
        } else if (this.age.isAdult) {
            if (this.isKlingon()) {
                result.push(PersonalWeapons.instance(this.version).dkTagh);
            } else if (this.npcGenerationStep?.specialization === Specialization.FerengiDaiMon) {
                result.push(PersonalWeapons.instance(this.version).phaser1);
                result.push(PersonalWeapons.instance(this.version).energyWhip);
            } else if (this.npcGenerationStep?.specialization === Specialization.RomulanCenturion
                || this.npcGenerationStep?.specialization === Specialization.RomulanTalShiar) {
                result.push(PersonalWeapons.instance(this.version).disruptorPistol);
            } else if (this.npcGenerationStep?.specialization === Specialization.TzenkethiSoldier) {
                if (this.rank.id === Rank.LorAA) {
                    result.push(PersonalWeapons.instance(this.version).tzenkethiHeavyBlade);
                } else {
                    result.push(PersonalWeapons.instance(this.version).dagger);
                }
                result.push(PersonalWeapons.instance(this.version).particleRifle);
            } else if (this.npcGenerationStep?.specialization === Specialization.SonaCommandOfficer) {
                result.push(PersonalWeapons.instance(this.version).sonaPlasmaDisruptorShotgun);
            } else if (this.npcGenerationStep?.specialization === Specialization.OrionPirate) {
                result.push(PersonalWeapons.instance(this.version).disruptorPistol);
                result.push(PersonalWeapons.instance(this.version).dagger);
            } else if (this.type !== CharacterType.Child && this.type !== CharacterType.Civilian
                    && this.type !== CharacterType.AmbassadorDiplomat) {
                result.push(PersonalWeapons.instance(this.version).disruptorPistol);
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
        if (this.implants.indexOf(BorgImplantType.ExoPlating) >= 0) {
            result += 2;
        }
        return result;
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
        } else if (this.speciesStep) {
            let species = SpeciesHelper.getSpeciesByType(this.speciesStep?.species);
            if (species && traits.indexOf(species.localizedName) < 0) {
                if (traits.indexOf(species.name) >= 0) {
                    traits.splice(traits.indexOf(species.name), 1);
                }
                traits.push(species.localizedName);
            }
        }
        if (this.enlisted) {
            traits.push("Enlisted Crewman");
        }
        this.careerEvents?.forEach(e => {
            if (e.trait) {
                traits.push(e.trait);
            }
        })
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
        if (this.role === Role.Ambassador) {
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

    getTalentByName(talentName: string): SelectedTalent|undefined {
        let result = this.talents.filter(t => t.talent === talentName);
        return result.length > 0 ? result[0] : undefined;
    }

    addTalent(talentModel: ITalent|SelectedTalent) {
        let selectedTalent = talentModel instanceof SelectedTalent ? talentModel as SelectedTalent : new SelectedTalent(talentModel.name);
        if (this.stereotype === Stereotype.Npc) {
            if (this.npcGenerationStep == null) {
                this.npcGenerationStep = new NpcGenerationStep();
            }
            this.npcGenerationStep.talents.push(selectedTalent);
        } else {
            if (this.speciesStep != null && this.speciesStep.talent == null && this.type !== CharacterType.KlingonWarrior) {
                this.speciesStep.talent = selectedTalent;
            } else if (this.upbringingStep != null && this.upbringingStep.talent == null) {
                this.upbringingStep.talent = selectedTalent;
            } else if (this.educationStep?.talent == null) {
                if (this.educationStep == null) {
                    this.educationStep = new EducationStep();
                }
                this.educationStep.talent = selectedTalent;
            } else if (this.careerStep?.talent == null) {
                if (this.careerStep == null) {
                    this.careerStep = new CareerStep();
                }
                this.careerStep.talent = selectedTalent;
            } else if (this.finishingStep?.talent == null && this.type === CharacterType.KlingonWarrior) {
                if (this.finishingStep == null) {
                    this.finishingStep = new FinishingStep();
                }
                this.finishingStep.talent = selectedTalent;
            }
        }
    }

    hasTalent(name: string) {
        let found = this.talents.filter(t => t.talent === name);
        return found.length > 0;
    }

    addFocus(focus: string) {
        this._focuses.push(focus);
    }

    private getFocusesFromSteps() {
        let result = [];
        if (this.speciesStep?.abilityOptions?.focuses?.length) {
            this.speciesStep?.abilityOptions?.focuses?.filter(f => f?.length).forEach(f => result.push(f));
        }
        if (this.upbringingStep?.focus) {
            result.push(this.upbringingStep.focus);
        }
        if (this.educationStep) {
            this.educationStep.focuses.filter(f => f?.length).forEach(f => result.push(f));
        }
        this.careerEvents.filter(e => e?.focus != null).forEach(e => result.push(e.focus));
        return result;
    }

    get focuses() {
        if (this.stereotype === Stereotype.SoloCharacter) {
            return this.getFocusesFromSteps();
        } else if (this.stereotype === Stereotype.MainCharacter) {
            let result = this.getFocusesFromSteps();
            if (result.length < this._focuses.length || this.legacyMode) {
                return this._focuses;
            } else {
                this.talents.forEach(t => {
                    t.focuses.filter(f => f != null && f.trim() !== "").forEach(f => result.push(f));
                });
                return result;
            }
        } else if (this.stereotype === Stereotype.SupportingCharacter) {
            let result = [];
            if (this.speciesStep?.abilityOptions?.focuses?.length) {
                result.push(...this.speciesStep.abilityOptions.focuses);
            }
            result.push(...this.supportingStep?.focuses?.filter(f => f.trim().length));
            return result;
        } else {
            return this._focuses;
        }
    }

    isEngineer() {
        return this.role === Role.ChiefEngineer
            || (this.jobAssignment && this.jobAssignment?.toLowerCase().indexOf("engineer") >= 0);
    }

    isSecurityOrSeniorOfficer() {
        return (this.rank &&
                (this.rank?.name?.toLowerCase() === "captain" ||
                 this.rank?.name?.toLowerCase() === "commander" ||
                 this.rank?.name?.toLowerCase() === "lieutenant commander" ||
                 this.rank?.name?.toLowerCase().indexOf("admiral") >= 0 ||
                 (this.role !== undefined && this.role === Role.ChiefOfSecurity))) ||
                 (this.jobAssignment?.toLowerCase() === "security") ||
                 (this.stereotype === Stereotype.SupportingCharacter && this.supportingStep?.disciplines[0] === Skill.Security);
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
        if (this.stereotype === Stereotype.Npc) {
            if (this.npcGenerationStep == null) {
                this.npcGenerationStep = new NpcGenerationStep();
            }
            this.npcGenerationStep.values.push(value);
        } else {
            if (this.environmentStep != null && this.environmentStep?.value == null) {
                this.environmentStep.value = value;
            } else if (this.educationStep?.value == null) {
                if (this.educationStep == null) {
                    this.educationStep = new EducationStep();
                }
                this.educationStep.value = value;
            } else if (this.careerStep?.value == null) {
                if (this.careerStep == null) {
                    this.careerStep = new CareerStep();
                }
                this.careerStep.value = value;
            } else if (this.finishingStep?.value == null) {
                if (this.finishingStep == null) {
                    this.finishingStep = new FinishingStep();
                }
                this.finishingStep.value = value;
            }
        }
    }

    get isJuniorCadet() {
        return this.type === CharacterType.Cadet && this.careerEvents.length === 0;
    }

    get isSeniorCadet() {
        return this.type === CharacterType.Cadet && this.careerEvents.length > 0;
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

        SkillsHelper.getSkills().forEach(s => {
            if (this._skills[s] > maxDiscipline) {
                this._skills[s] = maxDiscipline;
            }
        });
    }

    public copy(): Character {
        var character = new Character();

        character.type = this.type;
        character.stereotype = this.stereotype;
        character.typeDetails = this.typeDetails;
        character.version = this.version;
        this._attributes.forEach(a => {
            character._attributes[a.attribute].attribute = a.attribute;
            character._attributes[a.attribute].value = a.value;
        });
        character._skills = [...this._skills];
        this.traits.forEach(t => {
            character.traits.push(t);
        });
        character.age = this.age;
        this.careerEvents.forEach(e => {
            let event = new CareerEventStep(e.id);
            event.attribute = e.attribute;
            event.discipline = e.discipline;
            event.focus = e.focus;
            event.trait = e.trait;
            character.careerEvents.push(event);
        });
        character.jobAssignment = this.jobAssignment;
        character.assignedShip = this.assignedShip;
        character.rank = this.rank;
        character.role = this.role;
        if (this.speciesStep) {
            character.speciesStep = this.speciesStep.copy();
        }
        if (this.environmentStep) {
            character.environmentStep = new EnvironmentStep(this.environmentStep.environment, this.environmentStep.otherSpecies);
            character.environmentStep.attribute = this.environmentStep.attribute;
            character.environmentStep.discipline = this.environmentStep.discipline;
            character.environmentStep.value = this.environmentStep.value;
        }
        if (this.upbringingStep) {
            character.upbringingStep = new UpbringingStep(this.upbringingStep.upbringing);
            character.upbringingStep.acceptedUpbringing = this.upbringingStep.acceptedUpbringing;
            character.upbringingStep.discipline = this.upbringingStep.discipline;
            character.upbringingStep.focus = this.upbringingStep.focus;
            if (this.upbringingStep.talent) {
                character.upbringingStep.talent = this.upbringingStep.talent.copy();
            }
        }
        if (this.educationStep) {
            character.educationStep = new EducationStep(this.educationStep.track, this.educationStep.enlisted);
            character.educationStep.attributes = [...this.educationStep.attributes];
            character.educationStep.disciplines = [...this.educationStep.disciplines];
            character.educationStep.primaryDiscipline = this.educationStep.primaryDiscipline;
            character.educationStep.decrementDisciplines = [...this.educationStep.decrementDisciplines];
            character.educationStep.decrementAttributes = [...this.educationStep.decrementAttributes];
            character.educationStep.focuses = [...this.educationStep.focuses];
            character.educationStep.talent = this.educationStep.talent ? this.educationStep.talent.copy() : undefined;
            character.educationStep.value = this.educationStep.value;
        }
        character.careerStep = this.careerStep?.copy();
        character.finishingStep = this.finishingStep?.copy();
        character.npcGenerationStep = this.npcGenerationStep?.copy();
        character.supportingStep = this.supportingStep?.copy();
        this._focuses.forEach(f => {
            character._focuses.push(f);
        });
        character.pronouns = this.pronouns;
        character.name = this.name;
        character.additionalTraits = this.additionalTraits;
        character.lineage = this.lineage;
        character.house = this.house;
        character.era = this.era;
        character.pastime = this.pastime == null ? [] : [...this.pastime];
        character.improvements = this.improvements?.map(i => i.copy());
        return character;
    }

    public static maxAttribute(character) {
        if (character.age.isChild) {
            return 10;
        } else if (character.isYoung() || character.type === CharacterType.Cadet) {
            return 11;
        } else {
            return Character.ABSOLUTE_MAX_ATTRIBUTE;
        }
    }

    public static maxDiscipline(character) {
        if (character.age.isChild) {
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

    public static createSoloCharacter(era: Era) {
        let result = new Character();
        result.stereotype = Stereotype.SoloCharacter;
        result.era = era;
        return result;
    }

    public static createNpcCharacter(era: Era, version: 1|2 = 1) {
        let result = new Character();
        result.stereotype = Stereotype.Npc;
        result.era = era;
        result.version = version;
        return result;
    }

    public static createMainCharacter(type: CharacterType, version: 1|2 = 1) {
        let result = new Character();
        result.type = type;
        result.version = version;
        result.stereotype = Stereotype.MainCharacter;
        return result;
    }

    public static createSupportingCharacter(era: Era, version: 1|2 = 1) {
        let result = new Character();
        result.version = version;
        result.stereotype = Stereotype.SupportingCharacter;
        result.era = era;
        result.speciesStep = new SpeciesStep(Species.Human);
        if (version > 1) {
            result.speciesStep.ability = SpeciesAbilityList.instance.getBySpecies(Species.Human);
        }

        result.supportingStep = new SupportingStep();
        let rank = RanksHelper.instance().getRank(Rank.Lieutenant);
        result.rank = new CharacterRank(rank.localizedName, rank.id);
        return result;
    }

    public static totalAttributeSum(character: Character) {
        if (character.type === CharacterType.Cadet) {
            let reduction = 2;
            if (character.careerEvents?.length) {
                reduction -= character.careerEvents.length;
            }
            return character.age.attributeSum - reduction;
        } else {
            return character.age.attributeSum;
        }
    }

    public static totalDisciplineSum(character: Character) {
        if (character.type === CharacterType.Cadet) {
            let reduction = 2;
            if (character.careerEvents?.length) {
                reduction -= character.careerEvents.length;
            }
            return character.age.disciplineSum - reduction;
        } else {
            return character.age.disciplineSum;
        }
    }
}

