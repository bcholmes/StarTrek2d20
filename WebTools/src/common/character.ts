import { Attribute, AttributesHelper } from '../helpers/attributes';
import { Department, DepartmentsHelper } from '../helpers/department';
import type { Career } from '../helpers/careerEnum';
import type { Environment } from '../helpers/environments';
import { Species } from '../helpers/speciesEnum';
import { Track } from '../helpers/trackEnum';
import type { EarlyOutlookModel } from '../helpers/upbringings';
import type { ITalent } from '../helpers/italent';
import { CharacterType } from './characterType';
import type { AlliedMilitary } from '../helpers/alliedMilitary';
import { AlliedMilitaryType } from '../helpers/alliedMilitary';
import type { Government } from '../helpers/governments';
import { Polity } from '../helpers/governments';
import type { Age } from '../helpers/age';
import { AgeHelper } from '../helpers/age';
import type { Weapon, PersonalWeaponType } from '../helpers/weapons';
import { PersonalWeapons } from '../helpers/weapons';
import { Construct, Stereotype } from './construct';
import { SpeciesHelper } from '../helpers/species';
import { Rank, RanksHelper } from '../helpers/ranks';
import { makeKey } from './translationKey';
import i18next from 'i18next';
import { Role, RolesHelper } from '../helpers/roles';
import type { Implant } from '../helpers/borgImplant';
import { BorgImplantType, BorgImplants } from '../helpers/borgImplant';
import { Specialization } from './specializationEnum';
import {
  EquipmentHelper,
  EquipmentModel,
  EquipmentType,
} from '../helpers/equipment';
import { Era } from '../helpers/erasEnum';
import type { SpeciesAbility } from '../helpers/speciesAbility';
import {
  SpeciesAbilityChoice,
  SpeciesAbilityList,
} from '../helpers/speciesAbility';
import type { IWeaponDiceProvider } from './iWeaponDiceProvider';
import { NpcType } from '../npc/model/npcType';
import { SelectedTalent } from './selectedTalent';
import { CharacterAdvancementChoice } from '../modify/model/characterAdvancementChoice';
import {
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_NATURAL_PROTECTION_X,
  TALENT_NAME_WARRIORS_SPIRIT,
} from '../helpers/talents';
import { SpecialWeapon } from './specialWeapon';
import { ModificationType } from '../modify/model/modificationType';
import { LogEntry, ValueUseType } from './logEntry';
import {
  AssemblyContext,
  FocusAssembly,
  TalentAssembly,
  ValueAssembly,
} from './characterAssembly';
import type { TokenModel } from '../token/model/tokenModel';
import { isKlingonWarriorType } from '../helpers/klingonWarrior';

export enum Division {
  Command,
  Science,
  Operations,
}

export class OtherDetails {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  get type() {
    return undefined;
  }
}

export class AlliedMilitaryDetails {
  readonly alliedMilitary: AlliedMilitary;
  readonly nameValue: string;

  constructor(alliedMilitary: AlliedMilitary, name: string) {
    this.alliedMilitary = alliedMilitary;
    this.nameValue = name;
  }

  get type() {
    return this.alliedMilitary.type;
  }

  get name() {
    if (
      this.alliedMilitary &&
      this.alliedMilitary.type === AlliedMilitaryType.Other &&
      this.nameValue
    ) {
      return this.nameValue;
    } else if (this.alliedMilitary) {
      return this.alliedMilitary.name;
    } else {
      return '';
    }
  }
}

export class GovernmentDetails {
  readonly government: Government;
  readonly nameValue: string;

  constructor(government: Government, name: string) {
    this.government = government;
    this.nameValue = name;
  }

  get name() {
    if (
      this.government &&
      this.government.type === Polity.Other &&
      this.nameValue
    ) {
      return this.nameValue;
    } else if (this.government) {
      return this.government.name;
    } else {
      return '';
    }
  }

  get type() {
    return this.government.type;
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
      const key = makeKey('Rank.', Rank[this.id], '.name');
      const result = i18next.t(key);
      return key === result ? this.name : result;
    } else {
      return this.name;
    }
  }

  get localizedAbbreviation() {
    if (this.id != null) {
      const key = makeKey('Rank.', Rank[this.id], '.abbrev');
      const result = i18next.t(key);
      return key === result ? this.name : result;
    } else {
      return this.localizedName;
    }
  }
}

export class Promotion {
  readonly rank: CharacterRank;
  readonly type: ModificationType.Promotion | ModificationType.Demotion;

  constructor(
    rank: CharacterRank,
    type:
      | ModificationType.Promotion
      | ModificationType.Demotion = ModificationType.Promotion,
  ) {
    this.rank = rank;
    this.type = type;
  }

  copy() {
    return new Promotion(this.rank, this.type);
  }
}

export class SupportingStep {
  focuses: string[];
  attributes: Attribute[];
  disciplines: Department[];
  value: string;
  supervisory: boolean = false;

  constructor() {
    this.focuses = ['', '', ''];
    this.attributes = [...AttributesHelper.getAllAttributes()];
    this.disciplines = [...DepartmentsHelper.instance.getDepartments()];
  }

  copy() {
    const result = new SupportingStep();
    result.focuses = [...this.focuses];
    result.attributes = [...this.attributes];
    result.disciplines = [...this.disciplines];
    result.supervisory = this.supervisory;
    result.value = this.value;
    return result;
  }
}

export class ReputationChangeStep {
  readonly reputation: number;

  constructor(reputation: number) {
    this.reputation = reputation;
  }

  copy() {
    return new ReputationChangeStep(this.reputation);
  }
}

export class CharacterAdvancementStep {
  choice: CharacterAdvancementChoice;
  value: string | Attribute | Department | SelectedTalent;
  removeValue: string | Attribute | Department | SelectedTalent;
  log?: number;
  logCallback?: number;

  copy() {
    const result = new CharacterAdvancementStep();
    result.choice = this.choice;
    if (this.value instanceof SelectedTalent) {
      result.value = (this.value as SelectedTalent).copy();
    } else {
      result.value = this.value;
    }
    if (this.removeValue instanceof SelectedTalent) {
      result.removeValue = (this.removeValue as SelectedTalent).copy();
    } else {
      result.removeValue = this.removeValue;
    }
    result.log = this.log;
    result.logCallback = this.logCallback;
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

export class SpeciesAbilityOptions {
  focuses: string[] = [];
  choice?: SpeciesAbilityChoice;
  implants?: BorgImplantType[] = [];

  copy() {
    const result = new SpeciesAbilityOptions();
    result.focuses = [...this.focuses];
    result.implants = [...this.implants];
    result.choice = this.choice;
    return result;
  }
}

export class SpeciesStep {
  public readonly species: Species;
  public mixedSpecies: Species;
  public originalSpecies: Species;
  public customSpeciesName: string;
  public attributes: Attribute[];
  public decrementAttributes: Attribute[] = [];
  public talent?: SelectedTalent;
  public ability?: SpeciesAbility;
  public abilityOptions: SpeciesAbilityOptions;

  constructor(species: Species) {
    this.species = species;
    this.attributes = [];
  }

  get isAttributeSelectionComplete() {
    return (
      (this.attributes?.length ?? 0) -
        (this.decrementAttributes?.length ?? 0) ===
      3
    );
  }

  get localizedName() {
    if (this.species === Species.Custom) {
      return this.customSpeciesName || '';
    } else {
      const species = SpeciesHelper.getSpeciesByType(this.species);
      let result = species.name;
      if (this.mixedSpecies != null) {
        const mixedSpecies = SpeciesHelper.getSpeciesByType(this.mixedSpecies);
        result += ' / ' + mixedSpecies.name;
      }
      if (this.originalSpecies != null) {
        if (this.originalSpecies === Species.Custom) {
          result += '(originally) ' + this.customSpeciesName + ')';
        } else {
          const orginalSpecies = SpeciesHelper.getSpeciesByType(
            this.originalSpecies,
          );
          result += ' (originally ' + orginalSpecies.name + ')';
        }
      }
      return result;
    }
  }

  get abilityDisplayName() {
    if (this.ability == null) {
      return undefined;
    } else if (this.abilityOptions?.choice == null) {
      return this.ability.name;
    } else {
      return (
        this.ability.name +
        ' (' +
        this.ability.getChoiceName(this.abilityOptions.choice) +
        ')'
      );
    }
  }

  copy() {
    const result = new SpeciesStep(this.species);
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

    result.decrementAttributes = [...this.decrementAttributes];
    result.abilityOptions = this.abilityOptions?.copy();
    return result;
  }
}

export class UpbringingStep {
  public readonly upbringing: EarlyOutlookModel;
  public acceptedUpbringing: boolean;
  public discipline: Department;
  public focus?: string;
  public talent?: SelectedTalent;

  constructor(upbringing: EarlyOutlookModel, accepted: boolean = true) {
    this.upbringing = upbringing;
    this.acceptedUpbringing = accepted;
  }

  get attributes() {
    return this.acceptedUpbringing
      ? [
          this.upbringing.attributeAcceptPlus2,
          this.upbringing.attributeAcceptPlus1,
        ]
      : [
          this.upbringing.attributeRebelPlus2,
          this.upbringing.attributeRebelPlus1,
        ];
  }

  get description() {
    return this.upbringing.name + (this.acceptedUpbringing ? ' (A)' : ' (R)');
  }

  get localizedDescription() {
    return (
      this.upbringing.localizedName +
      (this.acceptedUpbringing ? ' (A)' : ' (R)')
    );
  }
}

export class EnvironmentStep {
  public readonly environment: Environment;
  public readonly otherSpecies?: Species;
  public attribute?: Attribute;
  public discipline?: Department;
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
  public primaryDiscipline: Department;
  public disciplines: Department[];
  public decrementDisciplines: Department[];
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
    this.focuses = ['', '', ''];
  }
}

export class FinishingStep {
  public attributes: Attribute[];
  public disciplines: Department[];
  public value?: string;
  public talent?: SelectedTalent;

  constructor() {
    this.attributes = [];
    this.disciplines = [];
  }

  copy() {
    const result = new FinishingStep();
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
  discipline?: Department;
  focus?: string;
  trait?: string;
  notes?: string;

  constructor(id: number) {
    this.id = id;
  }

  copy() {
    const result = new CareerEventStep(this.id);
    result.attribute = this.attribute;
    result.discipline = this.discipline;
    result.focus = this.focus;
    result.trait = this.trait;
    result.notes = this.notes;
    return result;
  }
}

export class NpcGenerationStep {
  public type?: NpcType;
  public specialization?: Specialization;
  public enlisted: boolean = false;
  public values: string[] = [];
  public talents: SelectedTalent[] = [];
  public attributes: number[] = [];
  public departments: number[] = [];
  public focuses: string[] = [];
  public equipment: (EquipmentType | EquipmentModel)[] = [];
  public weapons: PersonalWeaponType[] = [];

  constructor(type?: NpcType) {
    this.type = type;
  }

  copy() {
    const result = new NpcGenerationStep();
    result.type = this.type;
    result.specialization = this.specialization;
    result.values = [...this.values];
    result.talents = this.talents.map((t) => t.copy());
    result.enlisted = this.enlisted;
    result.attributes = [...this.attributes];
    result.departments = [...this.departments];
    result.focuses = [...this.focuses];
    result.equipment = [...this.equipment];
    result.weapons = [...this.weapons];
    return result;
  }
}

export class TokenConfig {
  readonly token: TokenModel;
  readonly rounded: boolean;
  readonly bordered: boolean;

  constructor(
    token: TokenModel,
    rounded: boolean = false,
    bordered: boolean = false,
  ) {
    this.token = token;
    this.rounded = rounded;
    this.bordered = bordered;
  }

  copy() {
    return new TokenConfig(this.token.copy(), this.rounded, this.bordered);
  }
}

export class Character extends Construct implements IWeaponDiceProvider {
  public static ABSOLUTE_MAX_ATTRIBUTE = 12;
  public static ABSOLUTE_MAX_DEPARTMENT = 5;

  private attributeInitialValue: number = 7;

  public reprimands = 0;
  public attributeValues: number[] = [];
  public skills: number[] = [];
  public traits: string[];
  public additionalTraits: string;
  public age: Age;
  public lineage?: string;
  public house?: string;
  public careerEvents: CareerEventStep[];
  public rankValue?: CharacterRank;
  public role?: Role;
  public jobAssignment?: string;
  public assignedShip?: string;
  public secondaryRole?: Role;
  public focusValues: string[];
  public typeDetails: AlliedMilitaryDetails | GovernmentDetails | OtherDetails;
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

  public improvements: (
    CharacterAdvancementStep | Promotion | ReputationChangeStep | LogEntry
  )[];

  public description?: string;
  public legacyMode: boolean;
  public token?: TokenConfig;

  constructor() {
    super(Stereotype.MainCharacter);
    this.attributeValues = [
      this.attributeInitialValue,
      this.attributeInitialValue,
      this.attributeInitialValue,
      this.attributeInitialValue,
      this.attributeInitialValue,
      this.attributeInitialValue,
    ];

    for (let i = 0; i <= Department.Medicine; i++) {
      this.skills.push(0);
    }

    this.traits = [];
    this.focusValues = [];
    this.careerEvents = [];
    this.age = AgeHelper.getAdultAge();
  }

  get reputation() {
    if (this.version === 1) {
      return 10;
    } else {
      let reputation = 3;
      if (this.hasTalent('Presitgious Career')) {
        reputation += 1;
      }

      this.improvements
        ?.filter((i) => i instanceof ReputationChangeStep)
        ?.map((i) => i as ReputationChangeStep)
        ?.forEach((r) => (reputation += r.reputation));
      return reputation;
    }
  }

  get enlisted() {
    if (this.stereotype === Stereotype.Npc && this.npcGenerationStep) {
      return this.npcGenerationStep.enlisted;
    } else {
      return this.educationStep?.enlisted || false;
    }
  }

  get assignmentWithoutShip() {
    let result = '';
    if (this.role != null) {
      result = RolesHelper.instance.getRole(this.role, this.type)?.name ?? '';
      if (this.secondaryRole != null) {
        const secondary =
          RolesHelper.instance.getRole(this.secondaryRole, this.type)?.name ??
          '';
        result = result + ' / ' + secondary;
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
        result += ', ';
      }
      result += this.assignedShip;
    }
    return result;
  }

  get localizedAssignment() {
    let result = this.localizedAssignmentWithoutShip;

    if (this.assignedShip) {
      if (result) {
        result += ', ';
      }
      result += this.assignedShip;
    }
    return result;
  }

  get localizedAssignmentWithoutShip() {
    let result = '';
    if (this.role != null) {
      result =
        RolesHelper.instance.getRole(this.role, this.type)?.localizedName ?? '';
      if (this.secondaryRole != null) {
        const secondary =
          RolesHelper.instance.getRole(this.secondaryRole, this.type)
            ?.localizedName ?? '';
        result = result + ' / ' + secondary;
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
    return this.talentAssemblies.map((a) => a.talent);
  }

  get talentAssemblies() {
    const result: TalentAssembly[] = [];
    if (this.stereotype === Stereotype.Npc) {
      return this.npcGenerationStep
        ? this.npcGenerationStep.talents.map(
            (t, i) => new TalentAssembly(t, AssemblyContext.Npc, i),
          )
        : [];
    } else if (this.stereotype === Stereotype.MainCharacter) {
      if (this.speciesStep?.talent != null) {
        result.push(
          new TalentAssembly(this.speciesStep.talent, AssemblyContext.Species),
        );
      }
      if (this.upbringingStep?.talent != null) {
        result.push(
          new TalentAssembly(
            this.upbringingStep.talent,
            AssemblyContext.EarlyOutlook,
          ),
        );
      }
      if (this.educationStep?.talent != null) {
        result.push(
          new TalentAssembly(
            this.educationStep.talent,
            AssemblyContext.Education,
          ),
        );
      }
      if (this.careerStep?.talent != null) {
        result.push(
          new TalentAssembly(this.careerStep.talent, AssemblyContext.Career),
        );
      }
      if (this.finishingStep?.talent != null) {
        result.push(
          new TalentAssembly(
            this.finishingStep.talent,
            AssemblyContext.FinishingTouches,
          ),
        );
      }
    }

    this.improvements?.forEach((s, si) => {
      if (
        s instanceof CharacterAdvancementStep &&
        s.choice === CharacterAdvancementChoice.Talent
      ) {
        const step = s as CharacterAdvancementStep;
        if (step.removeValue != null) {
          let index = -1;
          result.forEach((t, i) => {
            const removeTalent = step.removeValue as SelectedTalent;
            if (t.talent.name === TALENT_NAME_AUGMENTED_ABILITY) {
              if (
                t.talent.name === removeTalent.talent &&
                t.talent.attribute === removeTalent.attribute &&
                index === -1
              ) {
                index = i;
              }
            } else {
              if (t.talent.name === removeTalent.talent && index === -1) {
                index = i;
              }
            }
          });
          if (index >= 0) {
            result.splice(index, 1);
          }
        }
        result.push(
          new TalentAssembly(
            step.value as SelectedTalent,
            AssemblyContext.Improvement,
            si,
          ),
        );
      }
    });
    return result;
  }

  get rankedTalents(): SelectedTalent[] {
    const talents = this.talents;
    const duplicates = [];
    const result = [];
    talents.forEach((t) => {
      if (t.talentModel.maxRank > 1 && !duplicates.includes(t.name)) {
        const temp = t.copy();
        temp.multiple = this.getRankForTalent(t.name);
        duplicates.push(t.name);
        result.push(temp);
      } else if (t.talentModel.maxRank === 1) {
        result.push(t);
      }
    });
    return result;
  }

  get attributes(): number[] {
    let result = [];
    if (this.isSoloOrNonLegacyMainCharacter) {
      result = [7, 7, 7, 7, 7, 7];
      this.speciesStep?.attributes?.forEach((a) => (result[a] = result[a] + 1));
      this.speciesStep?.decrementAttributes?.forEach(
        (a) => (result[a] = result[a] - 1),
      );
      if (this.environmentStep?.attribute != null) {
        result[this.environmentStep.attribute] =
          result[this.environmentStep.attribute] + 1;
      }
      if (this.upbringingStep != null) {
        const earlyOutlook = this.upbringingStep.upbringing;
        if (this.upbringingStep.acceptedUpbringing) {
          result[earlyOutlook.attributeAcceptPlus2] =
            result[earlyOutlook.attributeAcceptPlus2] + 2;
          result[earlyOutlook.attributeAcceptPlus1] =
            result[earlyOutlook.attributeAcceptPlus1] + 1;
        } else {
          result[earlyOutlook.attributeRebelPlus2] =
            result[earlyOutlook.attributeRebelPlus2] + 2;
          result[earlyOutlook.attributeRebelPlus1] =
            result[earlyOutlook.attributeRebelPlus1] + 1;
        }
      }
      this.educationStep?.decrementAttributes?.forEach(
        (a) => (result[a] = result[a] - 1),
      );
      this.educationStep?.attributes?.forEach(
        (a) => (result[a] = result[a] + 1),
      );
      this.careerEvents
        .filter((e) => e.attribute != null)
        .forEach((e) => (result[e.attribute] = result[e.attribute] + 1));

      this.finishingStep?.attributes?.forEach(
        (a) => (result[a] = result[a] + 1),
      );

      AttributesHelper.getAllAttributes().forEach(
        (a) => (result[a] = Math.min(Character.maxAttribute(this), result[a])),
      );
    } else if (this.stereotype === Stereotype.Npc && !this.legacyMode) {
      result = [7, 7, 7, 7, 7, 7];
      this.speciesStep?.attributes?.forEach((a) => (result[a] = result[a] + 1));
      this.npcGenerationStep?.attributes?.forEach((v, a) => (result[a] += v));
    } else if (
      this.stereotype === Stereotype.SupportingCharacter &&
      !this.legacyMode
    ) {
      let values = this.age.attributes;
      if (this.isSupervisorySupportingCharacter) {
        values = [10, 10, 9, 9, 8, 8];
      }
      result = AttributesHelper.getAllAttributes().map((a) => {
        const index = this.supportingStep?.attributes?.indexOf(a);
        const speciesBonus = this.speciesStep?.attributes?.filter(
          (att) => att === a,
        ).length;
        const speciesminuses = this.speciesStep?.decrementAttributes?.filter(
          (att) => att === a,
        ).length;
        return values[index] + speciesBonus - speciesminuses;
      });
      return result;
    } else {
      result = [...this.attributeValues];
    }

    this.improvements?.forEach((i) => {
      if (
        i instanceof CharacterAdvancementStep &&
        i.choice === CharacterAdvancementChoice.Attribute
      ) {
        if (i.removeValue != null) {
          result[i.removeValue as Attribute] -= 1;
        }
        result[i.value as Attribute] += 1;
      }
    });

    return result;
  }

  get attributeTotal() {
    let attributeTotal = 0;
    this.attributes.forEach((a) => (attributeTotal += a));
    return attributeTotal;
  }

  get departments(): number[] {
    let result = [];
    if (this.isSoloOrNonLegacyMainCharacter) {
      result = [1, 1, 1, 1, 1, 1];
      if (this.environmentStep?.discipline != null) {
        result[this.environmentStep.discipline] += 1;
      }
      if (this.upbringingStep?.discipline != null) {
        result[this.upbringingStep.discipline] += 1;
      }
      if (this.educationStep?.primaryDiscipline != null) {
        result[this.educationStep.primaryDiscipline] += 2;
      }
      this.educationStep?.decrementDisciplines?.forEach(
        (d) => (result[d] -= 1),
      );
      this.educationStep?.disciplines?.forEach((d) => (result[d] += 1));
      this.careerEvents
        .filter((e) => e.discipline != null)
        .forEach((e) => (result[e.discipline] += 1));

      this.finishingStep?.disciplines?.forEach((d) => (result[d] += 1));

      DepartmentsHelper.instance
        .getDepartments()
        .forEach(
          (s) =>
            (result[s] = Math.min(Character.maxDepartment(this), result[s])),
        );
    } else if (
      this.stereotype === Stereotype.SupportingCharacter &&
      !this.legacyMode
    ) {
      let values = [...this.age.disciplines];
      if (this.isSupervisorySupportingCharacter) {
        values = [4, 4, 3, 2, 2, 1];
      }
      result = DepartmentsHelper.instance.getDepartments().map((s) => {
        const index = this.supportingStep?.disciplines?.indexOf(s);
        return values[index];
      });
    } else {
      result =
        this.stereotype === Stereotype.Npc
          ? [...this.npcGenerationStep?.departments]
          : [...this.skills];
      if (this.hasTalent('Intensive Training (Special Rule)')) {
        result = result.map((d) => (d === 0 ? 1 : d));
      }
      return result;
    }

    this.improvements?.forEach((i) => {
      if (
        i instanceof CharacterAdvancementStep &&
        i.choice === CharacterAdvancementChoice.Department
      ) {
        if (i.removeValue != null) {
          result[i.removeValue as Department] -= 1;
        }
        result[i.value as Department] += 1;
      }
    });

    return result;
  }

  get skillTotal() {
    let total = 0;
    this.departments.forEach((s) => (total += s));
    return total;
  }

  get isPersonalThreatTrackPresent() {
    return (
      this.version !== 1 &&
      this.stereotype === Stereotype.Npc &&
      this.npcGenerationStep?.type !== NpcType.Minor
    );
  }

  get personalThreat() {
    if (this.isPersonalThreatTrackPresent) {
      if (this.npcGenerationStep?.type === NpcType.Major) {
        return 6 + this.values.length;
      } else if (this.npcGenerationStep?.type === NpcType.Notable) {
        return 3;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  get isStressTrackPresent() {
    if (this.version === 1) {
      return true;
    } else if (this.stereotype === Stereotype.MainCharacter) {
      return true;
    } else if (this.stereotype === Stereotype.SupportingCharacter) {
      return this.values?.length;
    } else if (this.stereotype === Stereotype.Npc) {
      return false;
    } else {
      return false;
    }
  }

  get logEntries(): LogEntry[] {
    return (
      this.improvements
        ?.filter((i) => i instanceof LogEntry)
        ?.map((i) => i as LogEntry) ?? []
    );
  }

  get stress() {
    let stress = this.attributes[Attribute.Fitness];
    if (
      this.version !== 1 &&
      this.stereotype === Stereotype.SupportingCharacter
    ) {
      if (this.values.length === 1) {
        stress = Math.ceil(stress / 2);
      } else if (this.values.length === 0) {
        stress = 0;
      }
    } else {
      if (this.version === 1) {
        stress += +this.departments[Department.Security];
      } else if (this.speciesStep?.species === Species.Vulcan) {
        // species ability makes stress based on Control
        stress = this.attributes[Attribute.Control];
      } else if (
        this.speciesStep?.species === Species.Pakled &&
        this.speciesStep?.ability != null
      ) {
        stress += 3;
      }
    }
    if (this.hasTalent('Resolute')) {
      if (this.version === 1) {
        stress += 3;
      } else {
        stress += this.departments[Department.Command];
      }
    }

    if (this.hasTalent('Tough') && this.version > 1) {
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
          case Specialization.Jag:
          case Specialization.StationCommander:
          case Specialization.Admiral:
            return Division.Command;

          case Specialization.Engineer:
          case Specialization.Security:
          case Specialization.IntelligenceOfficer:
            return Division.Operations;

          case Specialization.StarfleetScientist:
          case Specialization.ScienceTech:
          case Specialization.Counselor:
          case Specialization.Nurse:
          case Specialization.MedicalDoctor:
            return Division.Science;

          default:
        }
      }

      if (this.isEngineer) {
        return Division.Operations;
      }

      if (this.educationStep?.track != null) {
        if (this.educationStep?.track === Track.Command) {
          return Division.Command;
        } else if (this.educationStep?.track === Track.Operations) {
          return Division.Operations;
        } else if (this.educationStep?.track === Track.Sciences) {
          return Division.Science;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }

  get equipmentModels(): EquipmentModel[] {
    const base = this.baseEquipmentModels;
    this.npcGenerationStep?.equipment?.forEach((e) => {
      if (e instanceof EquipmentModel) {
        base.push(e);
      } else {
        base.push(EquipmentHelper.instance.findByType(e as EquipmentType));
      }
    });
    return base;
  }

  get baseEquipmentModels(): EquipmentModel[] {
    const result = [];
    if (this.age.isChild) {
      result.push(EquipmentHelper.instance.findByType(EquipmentType.Clothing));
    } else if (this.isCivilian()) {
      result.push(EquipmentHelper.instance.findByType(EquipmentType.Clothing));
    } else if (isKlingonWarriorType(this.type)) {
      result.push(
        EquipmentHelper.instance.findByType(EquipmentType.ArmouredVest),
      );
      result.push(
        EquipmentHelper.instance.findByType(EquipmentType.Communicator),
      );
      result.push(EquipmentHelper.instance.findByType(EquipmentType.Tricorder));
    } else {
      result.push(EquipmentHelper.instance.findByType(EquipmentType.Uniform));
      result.push(
        EquipmentHelper.instance.findByType(EquipmentType.Communicator),
      );
      result.push(EquipmentHelper.instance.findByType(EquipmentType.Tricorder));
    }

    if (
      this.role === Role.ChiefMedicalOfficer ||
      this.role === Role.HeadNurse ||
      this.role === Role.ChiefSurgeon ||
      this.role === Role.PhysiciansAssistant ||
      this.role === Role.Anesthesiologist ||
      this.role === Role.ShipsDoctor ||
      this.jobAssignment === 'Medical Doctor' ||
      this.jobAssignment === 'Medical Doctor (Resident)' ||
      this.jobAssignment === 'Nurse' ||
      this.jobAssignment === 'Medic'
    ) {
      result.push(EquipmentHelper.instance.findByType(EquipmentType.MedKit));
    }

    if (this.isEngineer()) {
      result.push(
        EquipmentHelper.instance.findByType(EquipmentType.EngineeringKit),
      );
    }

    if (this.hasTalent('The Ushaan')) {
      result.push(EquipmentHelper.instance.findByType(EquipmentType.UshaanTor));
    }

    if (
      this.npcGenerationStep?.specialization === Specialization.Pirate &&
      this.speciesStep?.species === Species.Orion
    ) {
      result.push(
        EquipmentHelper.instance.findByType(EquipmentType.OrionMultiKey),
      );
    }

    return result;
  }

  get equipment() {
    return this.equipmentModels.map((e) => e.name);
  }

  get equipmentAndImplants(): (EquipmentModel | Implant)[] {
    const result: (EquipmentModel | Implant)[] = [...this.equipmentModels];
    if (this.implants?.length) {
      this.implants.forEach((i) =>
        result.push(BorgImplants.instance.getImplantByType(i)),
      );
    }
    return result.filter((i) => i != null);
  }

  get values(): string[] {
    if (this.stereotype === Stereotype.Npc) {
      return this.npcGenerationStep?.values ?? [];
    } else {
      return this.valueAssemblies.map((a) => a.value);
    }
  }

  get valueAssemblies() {
    const result = [];
    if (this.stereotype === Stereotype.SupportingCharacter) {
      if (this.supportingStep?.value) {
        result.push(
          new ValueAssembly(
            this.supportingStep.value,
            AssemblyContext.Supporting,
          ),
        );
      }
    } else if (this.stereotype !== Stereotype.Npc) {
      if (this.environmentStep?.value) {
        result.push(
          new ValueAssembly(
            this.environmentStep.value,
            AssemblyContext.Environment,
          ),
        );
      }
      if (this.educationStep?.value) {
        result.push(
          new ValueAssembly(
            this.educationStep.value,
            AssemblyContext.Education,
          ),
        );
      }
      if (this.careerStep?.value) {
        result.push(
          new ValueAssembly(this.careerStep.value, AssemblyContext.Career),
        );
      }
      if (this.finishingStep?.value) {
        result.push(
          new ValueAssembly(
            this.finishingStep.value,
            AssemblyContext.FinishingTouches,
          ),
        );
      }

      this.talents.forEach((t, i) => {
        if (t.value) {
          result.push(new ValueAssembly(t.value, AssemblyContext.Talent, i));
        }
      });
    }

    this.improvements?.forEach((imp, i) => {
      if (
        imp instanceof CharacterAdvancementStep &&
        imp.choice === CharacterAdvancementChoice.Value
      ) {
        if (imp.removeValue != null) {
          let index = -1;
          result.forEach((v, l) => {
            if (v.value === imp.removeValue) {
              index = l;
            }
          });
          if (index >= 0) {
            result.splice(index, 1);
          }
        }
        result.push(
          new ValueAssembly(
            imp.value as string,
            AssemblyContext.Improvement,
            i,
          ),
        );
      } else if (imp instanceof LogEntry) {
        imp.valuesUsed?.forEach((v, l) => {
          if (v.useType === ValueUseType.Challenged && v.newValue?.length) {
            let index = -1;
            result.forEach((r, l) => {
              if (r.value === v.value) {
                index = l;
              }
            });
            if (index >= 0) {
              result.splice(index, 1);
            }
            result.push(
              new ValueAssembly(
                v.newValue as string,
                AssemblyContext.Improvement,
                i,
                l,
              ),
            );
          }
        });
      }
    });

    return result;
  }

  get nameAndFullRank() {
    if (this.rank?.localizedName) {
      return this.rank.localizedName + ' ' + this.name;
    } else {
      return this.name;
    }
  }

  get nameAndAbbreviatedRank() {
    if (this.name?.length) {
      if (this.rank) {
        return this.rank.localizedAbbreviation + ' ' + this.name;
      } else {
        return this.name;
      }
    } else {
      return i18next.t('Construct.other.unnamedCharacter');
    }
  }

  get implants(): BorgImplantType[] {
    const result = [];
    this.speciesStep?.abilityOptions?.implants?.forEach((i) => result.push(i));
    this.talents.forEach((t) => result.push(...t.implants));
    return result;
  }

  getDiceForWeapon(weapon: Weapon) {
    if (this.version === 1) {
      return weapon.dice + this.departments[Department.Security];
    } else {
      return weapon.dice;
    }
  }

  getRankForTalent(talentName: string) {
    return this.talents.filter((t) => t.talent === talentName).length;
  }

  getTalentNameList() {
    const consolidatedTalents = {};
    this.talents.forEach((t) => {
      const rank = consolidatedTalents[t.talent] ?? 0;
      consolidatedTalents[t.talent] = rank + 1;
    });

    const result = [];
    for (const name in consolidatedTalents) {
      const rank = consolidatedTalents[name];
      result.push(rank === 1 ? name : name + ' [Rank ' + rank + ']');
    }
    return result;
  }

  /* returns the "official" name of the talent */
  getDistinctTalentNameList(): string[] {
    const result = [];
    this.talents.forEach((t) => {
      if (result.indexOf(t.talent) < 0) {
        result.push(t.talent);
      }
    });

    return result;
  }

  determineWeapons() {
    const result: Weapon[] = [];

    if (this.hasTalent('Mean Right Hook')) {
      result.push(PersonalWeapons.instance(this.version).unarmedStrikeMean);
    } else if (this.hasTalent('Martial Artist')) {
      result.push(
        PersonalWeapons.instance(this.version).unarmedStrikeMartialArtist,
      );
    } else if (this.hasTalent('Brute Force') || this.hasTalent('Extra Arms')) {
      result.push(
        PersonalWeapons.instance(this.version).unarmedStrikeBruteForce,
      );
    } else {
      result.push(PersonalWeapons.instance(this.version).unarmedStrike);
    }

    if (this.hasTalent('The Ushaan')) {
      result.push(PersonalWeapons.instance(this.version).ushaanTor);
    }

    if (this.hasTalent(TALENT_NAME_WARRIORS_SPIRIT)) {
      const talent = this.talents.filter(
        (t) => t.talent === TALENT_NAME_WARRIORS_SPIRIT,
      )[0];
      if (talent.selection === SpecialWeapon.MekLeth) {
        result.push(PersonalWeapons.instance(this.version).mekLeth);
      } else {
        result.push(PersonalWeapons.instance(this.version).batLeth);
      }
    }

    if (this.type === CharacterType.Starfleet) {
      if (this.era === Era.Enterprise && this.version > 1) {
        result.push(PersonalWeapons.instance(this.version).phasePistol);
      } else if (this.isSecurityOrSeniorOfficer()) {
        result.push(PersonalWeapons.instance(this.version).phaser2);
      } else {
        result.push(PersonalWeapons.instance(this.version).phaser1);
      }
    } else if (this.type === CharacterType.Cadet) {
      result.push(PersonalWeapons.instance(this.version).phaser1);
    } else if (this.isBajoranMilitia() || this.isCardassianUnion()) {
      result.push(PersonalWeapons.instance(this.version).phaser2);
    } else if (this.isBreenSoldier()) {
      result.push(
        PersonalWeapons.instance(this.version).polaronDisruptorPistol,
      );
      result.push(PersonalWeapons.instance(this.version).polaronDisruptorRifle);
      result.push(PersonalWeapons.instance(this.version).cryogenicGrenade);
      if (this.departments[Department.Security] >= 3) {
        result.push(PersonalWeapons.instance(this.version).neuralTruncheon);
      }
    } else if (this.age.isAdult) {
      if (this.isKlingonImperialCitizen) {
        result.push(PersonalWeapons.instance(this.version).dkTagh);
      } else if (
        this.npcGenerationStep?.specialization === Specialization.FerengiDaiMon
      ) {
        result.push(PersonalWeapons.instance(this.version).phaser1);
        result.push(PersonalWeapons.instance(this.version).energyWhip);
      } else if (
        this.npcGenerationStep?.specialization === Specialization.QowatMilat
      ) {
        result.push(PersonalWeapons.instance(this.version).tanQalanqSword);
      } else if (
        this.npcGenerationStep?.specialization ===
          Specialization.RomulanCenturion ||
        this.npcGenerationStep?.specialization ===
          Specialization.RomulanTalShiar
      ) {
        result.push(PersonalWeapons.instance(this.version).disruptorPistol);
      } else if (
        this.npcGenerationStep?.specialization ===
        Specialization.TzenkethiSoldier
      ) {
        if (this.rank.id === Rank.LorAA) {
          result.push(
            PersonalWeapons.instance(this.version).tzenkethiHeavyBlade,
          );
        } else {
          result.push(PersonalWeapons.instance(this.version).dagger);
        }
        result.push(PersonalWeapons.instance(this.version).particleRifle);
      } else if (
        this.npcGenerationStep?.specialization ===
        Specialization.SonaCommandOfficer
      ) {
        result.push(
          PersonalWeapons.instance(this.version).sonaPlasmaDisruptorShotgun,
        );
      } else if (
        this.npcGenerationStep?.specialization === Specialization.Pirate
      ) {
        result.push(PersonalWeapons.instance(this.version).disruptorPistol);
        result.push(PersonalWeapons.instance(this.version).dagger);
      } else if (
        this.type !== CharacterType.Child &&
        this.type !== CharacterType.Civilian &&
        this.type !== CharacterType.AmbassadorDiplomat &&
        (this.stereotype !== Stereotype.Npc ||
          this.npcGenerationStep?.specialization !== null)
      ) {
        result.push(PersonalWeapons.instance(this.version).disruptorPistol);
      }
    }

    this.npcGenerationStep?.weapons?.forEach((t) => {
      const weapon = PersonalWeapons.instance(this.version).getWeaponByType(t);
      if (weapon) {
        result.push(weapon);
      }
    });

    if (
      this.speciesStep?.species === Species.Kelpien &&
      this.speciesStep?.ability != null &&
      this.speciesStep?.abilityOptions?.choice === SpeciesAbilityChoice.Choice2
    ) {
      result.push(PersonalWeapons.instance(this.version).keratinDart);
    }

    return result;
  }

  isBreenSoldier() {
    return (
      (this.speciesStep?.species === Species.Breen &&
        this.type !== CharacterType.Starfleet) ||
      [Specialization.BreenThot, Specialization.BreenWarrior].includes(
        this.npcGenerationStep?.specialization,
      )
    );
  }

  isBajoranMilitia() {
    if (
      this.type === CharacterType.AlliedMilitary &&
      this.typeDetails != null &&
      this.typeDetails instanceof AlliedMilitaryDetails
    ) {
      return (
        (this.typeDetails as AlliedMilitaryDetails).alliedMilitary?.type ===
        AlliedMilitaryType.BajoranMilitia
      );
    } else {
      return false;
    }
  }

  isCardassianUnion() {
    if (
      this.type === CharacterType.AlliedMilitary &&
      this.typeDetails != null &&
      this.typeDetails instanceof AlliedMilitaryDetails
    ) {
      return (
        (this.typeDetails as AlliedMilitaryDetails).alliedMilitary?.type ===
        AlliedMilitaryType.CardassianUnion
      );
    } else {
      return false;
    }
  }

  get resistance() {
    return this.calculateProtection();
  }

  private calculateProtection() {
    let result = 0;
    this.equipmentModels
      .filter((e) => e.isArmour)
      .forEach((e) => (result += e.protection));
    if (this.version !== 1) {
      if (this.speciesStep?.species === Species.Klingon) {
        result += 1; // Brak'lul species ability
      }
      if (
        this.speciesStep?.species === Species.Zaranite &&
        this.speciesStep?.ability != null
      ) {
        result += 1; // Hardeneed Hide species ability
      }
      if (
        this.speciesStep?.species === Species.Brikar &&
        this.speciesStep?.ability != null
      ) {
        result += 2; // Rock Hard species ability
      }
      if (
        this.speciesStep?.species === Species.JemHadar &&
        this.speciesStep?.ability != null
      ) {
        result += 1; // Perfect Soldier species ability
      }
      if (
        this.speciesStep?.species === Species.Lurian &&
        this.speciesStep?.ability != null
      ) {
        result += 1; // Resistant Anatomy species ability
      }
      if (
        this.speciesStep?.species === Species.Chelon &&
        this.speciesStep?.ability != null
      ) {
        result += 1; // Atavistic Defenses species ability
      }
      if (
        this.speciesStep?.species === Species.XindiReptilian &&
        this.speciesStep?.ability != null
      ) {
        result += 1; // Durable Physiology species ability
      }
    }
    if (this.hasTalent('Ablative Hide')) {
      result += 1;
    }
    if (this.hasTalent('Chelon Shell')) {
      result += 1;
    }
    if (this.hasTalent('Exoplating (Special Rule)')) {
      result += 2;
    }
    if (this.hasTalent('Morphogenic Matrix')) {
      result += 4;
    }
    if (this.hasTalent('Polyalloy Construction')) {
      result += 1;
    }
    if (this.hasTalent('Hardened Hide')) {
      result += 2;
    }
    if (this.hasTalent('Thickened Carapace')) {
      result += 2;
    }
    if (this.hasTalent('Carnivorous Reptilian Physiology')) {
      result += 2;
    }
    if (this.hasTalent(TALENT_NAME_NATURAL_PROTECTION_X)) {
      this.talents
        .filter((t) => TALENT_NAME_NATURAL_PROTECTION_X === t.name)
        .forEach((t) => (result += t.x));
    }
    if (this.implants.indexOf(BorgImplantType.ExoPlating) >= 0) {
      result += 2;
    }
    return result;
  }

  get speciesName() {
    return this.speciesStep?.localizedName ?? '';
  }

  get localizedSpeciesName() {
    if (this.speciesStep == null) {
      return '';
    } else if (this.speciesStep.species === Species.Custom) {
      return this.speciesStep.customSpeciesName || '';
    } else {
      const species = SpeciesHelper.getSpeciesByType(this.speciesStep.species);
      if (this.speciesStep.mixedSpecies != null) {
        const mixedSpecies = SpeciesHelper.getSpeciesByType(
          this.speciesStep.mixedSpecies,
        );
        return i18next.t('Species.mixedSpecies.text', {
          primarySpecies: species.localizedName,
          secondarySpecies: mixedSpecies.localizedName,
        });
      }
      if (this.speciesStep.originalSpecies === Species.Custom) {
        return i18next.t('Species.formerSpecies.text', {
          primarySpecies: species.localizedName,
          otherSpecies: this.speciesStep.customSpeciesName,
        });
      } else if (this.speciesStep.originalSpecies != null) {
        const originalSpecies = SpeciesHelper.getSpeciesByType(
          this.speciesStep.originalSpecies,
        );
        return i18next.t('Species.formerSpecies.text', {
          primarySpecies: species.localizedName,
          otherSpecies: originalSpecies.localizedName,
        });
      } else {
        return species.localizedName;
      }
    }
  }

  get baseTraits() {
    const traits = [...this.traits];
    if (this.speciesStep != null) {
      const species = SpeciesHelper.getSpeciesByType(this.speciesStep?.species);
      if (species != null && traits.indexOf(species.name) >= 0) {
        traits.splice(traits.indexOf(species.name), 1);
      }
      traits.push(this.localizedSpeciesName);

      if (
        species?.id === Species.Benzite &&
        this.speciesStep?.ability != null
      ) {
        traits.push('Breathing Apparatus');
      }
    }
    if (this.enlisted) {
      traits.push('Enlisted Crewman');
    }
    this.careerEvents?.forEach((e) => {
      if (e.trait) {
        traits.push(e.trait);
      }
    });
    if (
      this.speciesStep?.species === Species.Illyrian_2E ||
      this.speciesStep?.species === Species.HumanAugment
    ) {
      traits.push('Augment');
    } else if (
      this.hasTalent('Augmented Ability (Control)') ||
      this.hasTalent('Augmented Ability (Daring)') ||
      this.hasTalent('Augmented Ability (Fitness)') ||
      this.hasTalent('Augmented Ability (Insight)') ||
      this.hasTalent('Augmented Ability (Presence)') ||
      this.hasTalent('Augmented Ability (Reason)') ||
      this.hasTalent('Augmented Ability')
    ) {
      traits.push('Augment');
    }
    if (
      [Species.Bynar, Species.LiberatedBorg].includes(this.speciesStep?.species)
    ) {
      traits.push('Cyborg');
    } else if (
      this.hasTalent('Synthetic Physiology') &&
      this.speciesStep?.species !== Species.CyberneticallyEnhanced
    ) {
      traits.push('Cyborg');
    }
    if (
      this.hasTalent('Analytical Recall') &&
      !(traits.includes('Augment') || traits.includes('Cyborg'))
    ) {
      if (
        this.speciesStep?.species !== Species.CyberneticallyEnhanced &&
        this.speciesStep?.species !== Species.Bynar
      ) {
        traits.push('Augment');
      } else {
        traits.push('Cyborg');
      }
    }
    if (this.hasTalent('Joined')) {
      traits.push('Symbiont');
    }
    if (this.hasTalent('Sensory Replacement')) {
      traits.push('Artificial Sense');
    }
    if (this.role === Role.Ambassador) {
      if (this.type === CharacterType.AmbassadorDiplomat && this.typeDetails) {
        const details = this.typeDetails as GovernmentDetails;
        traits.push(details.name ? details.name + ' Ambassador' : 'Ambassador');
      } else {
        traits.push('Ambassador');
      }
    } else if (
      this.stereotype === Stereotype.Npc &&
      this.assignmentWithoutShip?.length
    ) {
      traits.push(this.assignmentWithoutShip);
    }
    return traits.filter((t) => t?.length);
  }

  addTrait(trait: string) {
    this.traits.push(trait);
  }

  getAllTraits() {
    const traits = this.baseTraits;
    if (this.additionalTraits) {
      traits.push(this.additionalTraits);
    }

    let result = '';
    for (let i = 0; i < traits.length; i++) {
      result += `${traits[i]}${i < traits.length - 1 ? ', ' : ''}`;
    }
    return result;
  }

  getTalentByName(talentName: string): SelectedTalent | undefined {
    const result = this.talents.filter((t) => t.talent === talentName);
    return result.length > 0 ? result[0] : undefined;
  }

  addTalent(talentModel: ITalent | SelectedTalent) {
    const selectedTalent =
      talentModel instanceof SelectedTalent
        ? (talentModel as SelectedTalent)
        : new SelectedTalent(talentModel.name);
    if (this.stereotype === Stereotype.Npc) {
      if (this.npcGenerationStep == null) {
        this.npcGenerationStep = new NpcGenerationStep();
      }
      this.npcGenerationStep.talents.push(selectedTalent);
    } else {
      if (
        this.speciesStep != null &&
        this.speciesStep.talent == null &&
        !isKlingonWarriorType(this.type)
      ) {
        this.speciesStep.talent = selectedTalent;
      } else if (
        this.upbringingStep != null &&
        this.upbringingStep.talent == null
      ) {
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
      } else if (
        this.finishingStep?.talent == null &&
        isKlingonWarriorType(this.type)
      ) {
        if (this.finishingStep == null) {
          this.finishingStep = new FinishingStep();
        }
        this.finishingStep.talent = selectedTalent;
      }
    }
  }

  hasTalent(name: string) {
    const found = this.talents.filter((t) => t.talent === name);
    return found.length > 0;
  }

  addFocus(focus: string) {
    this.focusValues.push(focus);
  }

  get focuses() {
    return this.focusAssemblies.map((f) => f.focus);
  }

  get focusAssemblies() {
    let result: FocusAssembly[] = [];
    if (
      this.stereotype === Stereotype.SoloCharacter ||
      this.stereotype === Stereotype.MainCharacter
    ) {
      if (this.speciesStep?.abilityOptions?.focuses?.length) {
        this.speciesStep?.abilityOptions?.focuses
          ?.filter((f) => f?.length)
          .forEach((f, i) =>
            result.push(
              new FocusAssembly(f, AssemblyContext.SpeciesAbility, 0, i),
            ),
          );
      }
      if (this.upbringingStep?.focus) {
        result.push(
          new FocusAssembly(
            this.upbringingStep.focus,
            AssemblyContext.EarlyOutlook,
          ),
        );
      }
      if (this.educationStep) {
        this.educationStep.focuses.forEach((f, i) => {
          if (f?.length) {
            result.push(new FocusAssembly(f, AssemblyContext.Education, 0, i));
          }
        });
      }
      this.careerEvents.forEach((e, i) => {
        if (e.focus?.length) {
          result.push(
            new FocusAssembly(e.focus, AssemblyContext.CareerEvent, i),
          );
        }
      });

      if (this.legacyMode) {
        result = this.focusValues.map(
          (f, i) => new FocusAssembly(f, AssemblyContext.Legacy, i),
        );
      } else {
        this.talents.forEach((t, i) =>
          t.focuses.forEach((f, l) => {
            if (f?.trim()?.length) {
              result.push(new FocusAssembly(f, AssemblyContext.Talent, i, l));
            }
          }),
        );
      }
    } else if (this.stereotype === Stereotype.SupportingCharacter) {
      if (this.speciesStep?.abilityOptions?.focuses?.length) {
        this.speciesStep?.abilityOptions?.focuses
          ?.filter((f) => f?.length)
          .forEach((f, i) =>
            result.push(
              new FocusAssembly(f, AssemblyContext.SpeciesAbility, 0, i),
            ),
          );
      }
      if (this.supportingStep?.focuses?.length) {
        this.supportingStep?.focuses?.forEach((f, i) => {
          if (f?.trim()?.length) {
            result.push(new FocusAssembly(f, AssemblyContext.Supporting, i));
          }
        });
      }
    } else if (this.stereotype === Stereotype.Npc) {
      if (this.speciesStep?.abilityOptions?.focuses?.length) {
        this.speciesStep?.abilityOptions?.focuses
          ?.filter((f) => f?.length)
          .forEach((f, i) =>
            result.push(
              new FocusAssembly(f, AssemblyContext.SpeciesAbility, 0, i),
            ),
          );
      }
      this.npcGenerationStep?.focuses?.forEach((f, i) => {
        if (f?.trim().length) {
          result.push(new FocusAssembly(f, AssemblyContext.Npc, i));
        }
      });
    } else {
      result = this.focusValues.map(
        (f, i) => new FocusAssembly(f, AssemblyContext.Legacy, i),
      );
    }

    this.improvements?.forEach((imp, i) => {
      if (
        imp instanceof CharacterAdvancementStep &&
        imp.choice === CharacterAdvancementChoice.Focus
      ) {
        if (imp.removeValue != null) {
          let index = -1;
          result.forEach((v, l) => {
            if (v.focus === imp.removeValue) {
              index = l;
            }
          });
          if (index >= 0) {
            result.splice(index, 1);
          }
        }
        result.push(
          new FocusAssembly(
            imp.value as string,
            AssemblyContext.Improvement,
            i,
          ),
        );
      }
    });

    return result;
  }

  isEngineer() {
    return (
      this.role === Role.ChiefEngineer ||
      this.jobAssignment?.toLowerCase()?.includes('engineer')
    );
  }

  isSecurityOrSeniorOfficer() {
    return (
      (this.rank &&
        (this.rank?.id === Rank.Captain ||
          this.rank?.id === Rank.Commander ||
          this.rank?.id === Rank.LtCommander ||
          RanksHelper.instance().isAdmiralty(this.rank?.id) ||
          (this.role !== undefined && this.role === Role.ChiefOfSecurity))) ||
      this.jobAssignment?.toLowerCase() === 'security' ||
      (this.stereotype === Stereotype.SupportingCharacter &&
        this.supportingStep?.disciplines[0] === Department.Security)
    );
  }

  isYoung() {
    return this.hasTalent('Untapped Potential');
  }

  isCivilian() {
    return (
      this.type === CharacterType.AmbassadorDiplomat ||
      this.type === CharacterType.Civilian ||
      this.type === CharacterType.Child
    );
  }

  isKlingonWarrior() {
    return (
      isKlingonWarriorType(this.type) ||
      (this.type === CharacterType.AlliedMilitary &&
        (this.typeDetails as AlliedMilitaryDetails)?.alliedMilitary.type ===
          AlliedMilitaryType.KlingonDefenceForce)
    );
  }

  get isSoloOrNonLegacyMainCharacter() {
    return (
      this.stereotype === Stereotype.SoloCharacter ||
      (this.stereotype === Stereotype.MainCharacter && !this.legacyMode)
    );
  }

  get isSupervisorySupportingCharacter() {
    return (
      this.version > 1 &&
      this.type !== CharacterType.Child &&
      this.supportingStep?.supervisory
    );
  }

  get isEducationDisciplinesIncomplete() {
    return (
      this.educationStep?.disciplines?.length < 2 ||
      this.educationStep?.primaryDiscipline == null ||
      (this.educationStep?.decrementDisciplines?.length > 0 &&
        this.educationStep?.disciplines?.length < 3)
    );
  }

  get rank() {
    const promotions = this.improvements?.filter((i) => i instanceof Promotion);
    if (promotions?.length) {
      const promotion = promotions[promotions.length - 1] as Promotion;
      return promotion.rank;
    } else {
      return this.rankValue;
    }
  }

  get isKlingonImperialCitizen() {
    return (
      this.isKlingonWarrior() ||
      (this.type === CharacterType.AmbassadorDiplomat &&
        this.typeDetails?.type === Polity.Klingon)
    );
  }

  get isRomulanStarEmpire() {
    return (
      this.type === CharacterType.Romulan ||
      (this.type === CharacterType.AlliedMilitary &&
        this.typeDetails?.type === AlliedMilitaryType.RomulanStarEmpire) ||
      (this.type === CharacterType.AmbassadorDiplomat &&
        this.typeDetails?.type === Polity.Romulan)
    );
  }

  get isCardassian() {
    return (
      this.type === CharacterType.Cardassian ||
      (this.type === CharacterType.AlliedMilitary &&
        this.typeDetails?.type === AlliedMilitaryType.CardassianUnion) ||
      (this.type === CharacterType.AmbassadorDiplomat &&
        this.typeDetails?.type === Polity.Cardassian)
    );
  }

  get isFerengi() {
    return (
      this.type === CharacterType.Ferengi ||
      (this.type === CharacterType.AlliedMilitary &&
        this.typeDetails?.type === AlliedMilitaryType.FerengiMilitary) ||
      (this.speciesStep?.species === Species.Ferengi &&
        [
          Specialization.SketchyTraderCaptain,
          Specialization.IndependentTraderCaptain,
          Specialization.FerengiBartender,
          Specialization.FerengiMerchant,
          Specialization.FerengiDaiMon,
          Specialization.FerengiEliminator,
          Specialization.FerengiLiquidator,
        ].indexOf(this.npcGenerationStep?.specialization) >= 0)
    );
  }

  get isOrion() {
    return (
      this.type === CharacterType.Orion ||
      (this.stereotype === Stereotype.Npc &&
        this.speciesStep?.species === Species.Orion &&
        [
          Specialization.Pirate,
          Specialization.SketchyTraderCaptain,
          Specialization.IndependentTraderCaptain,
        ].indexOf(this.npcGenerationStep?.specialization) >= 0)
    );
  }

  get isSona() {
    return (
      this.stereotype === Stereotype.Npc &&
      this.npcGenerationStep?.specialization ===
        Specialization.SonaCommandOfficer
    );
  }

  get isTalarian() {
    return (
      this.stereotype === Stereotype.Npc &&
      [Specialization.TalarianOfficer, Specialization.TalarianWarrior].includes(
        this.npcGenerationStep?.specialization,
      )
    );
  }

  get isTzenkethi() {
    return (
      this.stereotype === Stereotype.Npc &&
      [Specialization.TzenkethiSoldier].includes(
        this.npcGenerationStep?.specialization,
      )
    );
  }

  get isTholian() {
    return (
      this.stereotype === Stereotype.Npc &&
      [Specialization.TholianWarrior].includes(
        this.npcGenerationStep?.specialization,
      )
    );
  }

  hasMaxedAttribute() {
    const max = Character.ABSOLUTE_MAX_ATTRIBUTE;
    return this.attributes.some((a) => a === max);
  }

  hasMaxedDepartment() {
    const max = Character.ABSOLUTE_MAX_DEPARTMENT;
    return this.departments.some((s) => s === max);
  }

  canRaiseAttributeValue(value: number) {
    const max = Character.maxAttribute(this);
    return value < max && (value < max - 1 || !this.hasMaxedAttribute());
  }

  canRaiseDepartmentValue(value: number) {
    const max = Character.maxDepartment(this);
    return value < max && (value < max - 1 || !this.hasMaxedDepartment());
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
    return this.type === CharacterType.Cadet && this.hasCareerEvents;
  }

  get hasCareerEvents() {
    return (this.careerEvents?.length ?? 0) > 0;
  }

  public copy(): Character {
    const character = new Character();

    character.type = this.type;
    character.stereotype = this.stereotype;
    character.typeDetails = this.typeDetails;
    character.version = this.version;
    character.attributeValues = [...this.attributeValues];
    character.skills = [...this.skills];
    this.traits.forEach((t) => {
      character.traits.push(t);
    });
    character.age = this.age;
    character.careerEvents = this.careerEvents?.map((e) => e.copy()) ?? [];
    character.jobAssignment = this.jobAssignment;
    character.assignedShip = this.assignedShip;
    character.rankValue = this.rankValue;
    character.role = this.role;
    character.secondaryRole = this.secondaryRole;
    if (this.speciesStep) {
      character.speciesStep = this.speciesStep.copy();
    }
    if (this.environmentStep) {
      character.environmentStep = new EnvironmentStep(
        this.environmentStep.environment,
        this.environmentStep.otherSpecies,
      );
      character.environmentStep.attribute = this.environmentStep.attribute;
      character.environmentStep.discipline = this.environmentStep.discipline;
      character.environmentStep.value = this.environmentStep.value;
    }
    if (this.upbringingStep) {
      character.upbringingStep = new UpbringingStep(
        this.upbringingStep.upbringing,
      );
      character.upbringingStep.acceptedUpbringing =
        this.upbringingStep.acceptedUpbringing;
      character.upbringingStep.discipline = this.upbringingStep.discipline;
      character.upbringingStep.focus = this.upbringingStep.focus;
      if (this.upbringingStep.talent) {
        character.upbringingStep.talent = this.upbringingStep.talent.copy();
      }
    }
    if (this.educationStep) {
      character.educationStep = new EducationStep(
        this.educationStep.track,
        this.educationStep.enlisted,
      );
      character.educationStep.attributes = [...this.educationStep.attributes];
      character.educationStep.disciplines = [...this.educationStep.disciplines];
      character.educationStep.primaryDiscipline =
        this.educationStep.primaryDiscipline;
      character.educationStep.decrementDisciplines = [
        ...this.educationStep.decrementDisciplines,
      ];
      character.educationStep.decrementAttributes = [
        ...this.educationStep.decrementAttributes,
      ];
      character.educationStep.focuses = [...this.educationStep.focuses];
      character.educationStep.talent = this.educationStep.talent
        ? this.educationStep.talent.copy()
        : undefined;
      character.educationStep.value = this.educationStep.value;
    }
    character.careerStep = this.careerStep?.copy();
    character.finishingStep = this.finishingStep?.copy();
    character.npcGenerationStep = this.npcGenerationStep?.copy();
    character.supportingStep = this.supportingStep?.copy();
    this.focusValues.forEach((f) => {
      character.focusValues.push(f);
    });
    character.improvements = this.improvements?.map((i) => i.copy());
    character.pronouns = this.pronouns;
    character.name = this.name;
    character.additionalTraits = this.additionalTraits;
    character.lineage = this.lineage;
    character.house = this.house;
    character.era = this.era;
    character.pastime = this.pastime == null ? [] : [...this.pastime];
    character.description = this.description;
    character.token = this.token?.copy();
    return character;
  }

  public static maxAttribute(character: Character) {
    if (character.age.isChild) {
      return 10;
    } else if (character.isYoung() || character.type === CharacterType.Cadet) {
      return 11;
    } else {
      return Character.ABSOLUTE_MAX_ATTRIBUTE;
    }
  }

  public static maxDepartment(character: Character) {
    if (character.age.isChild) {
      return 3;
    } else if (character.isYoung() || character.type === CharacterType.Cadet) {
      return 4;
    } else {
      return 5;
    }
  }

  public static isSpeciesListLimited(character) {
    return (
      isKlingonWarriorType(character.type) ||
      (character.type === CharacterType.AlliedMilitary &&
        character.typeDetails != null &&
        character.typeDetails instanceof AlliedMilitaryDetails &&
        (character.typeDetails as AlliedMilitaryDetails).alliedMilitary?.species
          ?.length > 0)
    );
  }

  public static createSoloCharacter(era: Era) {
    const result = new Character();
    result.stereotype = Stereotype.SoloCharacter;
    result.era = era;
    return result;
  }

  public static createNpcCharacter(
    era: Era,
    version: 1 | 2 = 1,
    npcType?: NpcType,
    type: CharacterType = CharacterType.Starfleet,
  ) {
    const result = new Character();
    result.stereotype = Stereotype.Npc;
    result.era = era;
    result.type = type;
    result.version = version;
    if (npcType !== undefined) {
      result.npcGenerationStep = new NpcGenerationStep(npcType);
    }
    return result;
  }

  public static createMainCharacter(
    type: CharacterType,
    era: Era,
    version: 1 | 2 = 1,
  ) {
    const result = new Character();
    result.type = type;
    result.version = version;
    result.era = era;
    result.stereotype = Stereotype.MainCharacter;
    return result;
  }

  public static createSupportingCharacter(era: Era, version: 1 | 2 = 1) {
    const result = new Character();
    result.version = version;
    result.stereotype = Stereotype.SupportingCharacter;
    result.era = era;
    result.speciesStep = new SpeciesStep(Species.Human);
    if (version > 1) {
      result.speciesStep.ability = SpeciesAbilityList.instance.getBySpecies(
        Species.Human,
      );
    }

    result.supportingStep = new SupportingStep();
    const rank = RanksHelper.instance().getRank(Rank.Ensign);
    result.rankValue = new CharacterRank(rank.localizedName, rank.id);
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

  public static totalDepartmentSum(character: Character) {
    if (character.type === CharacterType.Cadet) {
      let reduction = 2;
      if (character.careerEvents?.length) {
        reduction -= character.careerEvents.length;
      }
      return character.age.departmentSum - reduction;
    } else {
      return character.age.departmentSum;
    }
  }
}
