import i18next from 'i18next';
import type { Character } from '../common/character';
import { CharacterSerializer } from '../common/characterSerializer';
import type { Starship } from '../common/starship';
import type { Attribute } from '../helpers/attributes';
import { AttributesHelper } from '../helpers/attributes';
import type { Implant } from '../helpers/borgImplant';
import { BorgImplants } from '../helpers/borgImplant';
import type { EquipmentModel } from '../helpers/equipment';
import { DepartmentsHelper, Department } from '../helpers/department';
import { SpeciesHelper } from '../helpers/species';
import { Species } from '../helpers/speciesEnum';
import type { TalentModel } from '../helpers/talentModel';
import { TalentsHelper } from '../helpers/talents';
import type { Weapon } from '../helpers/weapons';
import { WeaponRange, WeaponType, WeaponTypeModel } from '../helpers/weapons';
import { System, allSystems } from '../helpers/systems';
import { makeKey } from '../common/translationKey';
import type { SelectedTalent } from '../common/selectedTalent';
import { TalentCategory } from '../helpers/talentCategory';
import {
  attributeName,
  departmentName,
  paragraphsToHtml,
  resolveTalentDescription,
  talentRequirement,
} from './vttShared';

interface IRoll20Attribute {
  name: string;
  current: string | boolean | number;
  max: string | number;
  id: string;
}

interface IRoll20Ability {
  name: string;
  current: string | boolean | number;
  max: string | number;
  id: string;
}

interface IRoll20Character {
  oldId: string;
  name: string;
  avatar: string;
  bio: string;
  gmnotes: string;
  defaulttoken: string;
  tags: string;
  controlledby: string;
  inplayerjournals: string;
  attribs: IRoll20Attribute[];
  abilities: IRoll20Ability[];
}

interface IRoll20Json {
  schema_version: number;
  type: string;
  character: IRoll20Character;
}

class IdHelper {
  static readonly ID_PARTS: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
  currentId: string;

  constructor() {
    this.currentId = this.createId();
  }

  private createId() {
    let id = '-N';
    for (let i = 0; i < 18; i++) {
      id +=
        IdHelper.ID_PARTS[Math.floor(Math.random() * IdHelper.ID_PARTS.length)];
    }
    return id;
  }

  nextId() {
    this.currentId = this.incrementId(this.currentId);
    return this.currentId;
  }

  private incrementId(id: string) {
    const base = id.substring(0, id.length - 1);
    const lastDigit = id.substring(id.length - 1).toLocaleLowerCase();

    const index = IdHelper.ID_PARTS.indexOf(lastDigit);
    if (index >= IdHelper.ID_PARTS.length - 1) {
      return this.incrementId(base) + IdHelper.ID_PARTS[0];
    } else {
      return base + IdHelper.ID_PARTS[index + 1];
    }
  }
}

export class Roll20VttExporter {
  private static singleton: Roll20VttExporter;

  static get instance() {
    if (Roll20VttExporter.singleton == null) {
      Roll20VttExporter.singleton = new Roll20VttExporter();
    }
    return Roll20VttExporter.singleton;
  }

  private buildRoll20Character(id: IdHelper, name: string): IRoll20Json {
    return {
      schema_version: 3,
      type: 'character',
      character: {
        oldId: id.currentId,
        name: name,
        avatar: '',
        bio: '',
        gmnotes: '',
        defaulttoken: '',
        tags: '[]',
        controlledby: '',
        inplayerjournals: '',
        attribs: this.buildCommonCharacterAttribs(id),
        abilities: [],
      },
    };
  }

  private buildCommonCharacterAttribs(id: IdHelper): IRoll20Attribute[] {
    return [
      {
        name: 'sheet_color',
        current: 'black',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'attributeName',
        current: false,
        max: '',
        id: id.nextId(),
      },
      {
        name: 'disciplineName',
        current: false,
        max: '',
        id: id.nextId(),
      },
      {
        name: 'systemName',
        current: 'COMMAND',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'departmentName',
        current: false,
        max: '',
        id: id.nextId(),
      },
      {
        name: 'ask_whisper',
        current: 'Whisper to GM?',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'ask_public_roll',
        current: 'Public Roll',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'ask_whisper_roll',
        current: 'Whisper Roll',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'diceRoll',
        current:
          '{{dice1=[[d20<@{target}cf>@{complication}cs<@{focus}]]}}{{dice2=[[d20<@{target}cf>@{complication}cs<@{focus}]]}}',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'crew_diceRoll',
        current:
          '{{dice1=[[d20<@{crew_target}cf>@{ship_complication}cs<@{crew_discipline}]]}}{{dice2=[[d20<@{crew_target}cf>@{ship_complication}cs<@{crew_discipline}]]}}',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'ship_diceRoll',
        current:
          '{{dice1=[[d20<@{ship_target}cf>@{ship_complication}cs<@{department}]]}}{{dice2=[[d20<@{ship_target}cf>@{ship_complication}cs<@{department}]]}}',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'focus',
        current: '1',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'complication',
        current: '20',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'version',
        current: 1.6,
        max: '',
        id: id.nextId(),
      },
      {
        name: 'settings_toggle',
        current: '0',
        max: '',
        id: id.nextId(),
      },
    ];
  }

  exportStarship(starship: Starship) {
    const id = new IdHelper();
    const name = starship.name || 'Unnamed Starship';
    const result: IRoll20Json = this.buildRoll20Character(id, name);
    result.character.attribs.push({
      name: 'sheet_type',
      current: 'starship',
      max: '',
      id: '-Nz_YFXyrBCoNytnAbXI',
    });

    result.character.attribs.push(this.convertSpaceframe(starship, id));
    result.character.attribs.push(this.convertMissionProfile(starship, id));
    result.character.attribs.push(this.convertDesignation(starship, id));
    result.character.attribs.push(this.convertServiceDate(starship, id));
    result.character.attribs.push(this.convertRefit(starship, id));
    result.character.attribs.push(this.convertShields(starship, id));
    result.character.attribs.push(this.convertShipResistance(starship, id));
    result.character.attribs.push(this.convertScale(starship, id));
    result.character.attribs.push(this.convertCrew(starship, id));
    result.character.attribs.push(this.convertPower(starship, id));

    DepartmentsHelper.instance
      .getDepartments()
      .forEach((d) =>
        result.character.attribs.push(
          this.convertStarshipDepartment(starship, d, id),
        ),
      );
    allSystems().forEach((s) =>
      result.character.attribs.push(this.convertSystem(starship, s, id)),
    );

    starship.rankedTalents.forEach((t) =>
      Array.prototype.push.apply(
        result.character.attribs,
        this.convertStarshipTalent(starship, t, id),
      ),
    );

    starship.allTraitsAsArray.forEach((t, i) => {
      Array.prototype.push.apply(
        result.character.attribs,
        this.convertStarshipTrait(starship, t, id),
      );
    });

    starship
      .determineWeapons()
      .forEach((w) =>
        Array.prototype.push.apply(
          result.character.attribs,
          this.convertStarshipWeapon(starship, w, id),
        ),
      );

    return result;
  }

  exportStarshipAsHandout(starship: Starship) {
    const starshipClass = starship.className ?? '';
    let name =
      starship.name?.length > 0
        ? starship.name
        : 'Unnamed ' +
          (starshipClass.length ? starshipClass + ' ' : '') +
          ' Starship';

    if (starship.registry) {
      name += ', ' + starship.registry;
    }

    const result = {
      schema_version: 3,
      type: 'handout',
      handout: {
        archived: false,
        avatar: '',
        controlledby: '',
        inplayerjournals: '',
        name: name,
        tags: '[]',
        gmnotes: '',
        notes: this.createStarshipNotes(starship),
      },
    };

    return result;
  }

  createStarshipNotes(starship: Starship) {
    let result = '';

    const description = starship.spaceframeModel?.localizedDescription;
    if (description) {
      result += paragraphsToHtml(description, '\n');
    }

    if (starship.getAllTraits()?.length) {
      result +=
        '<p><strong>Traits:</strong> ' + starship.getAllTraits() + '</p>\n';
    }

    result += '<h2>' + i18next.t('Construct.other.systems') + '</h2>\n';
    result += '<table>\n<thead>\n<tr>\n';
    allSystems().forEach(
      (s) =>
        (result +=
          '<th>' +
          i18next.t(makeKey('Construct.system.', System[s])) +
          '</th>\n'),
    );
    result += '</tr>\n</thead>\n<tbody><tr>\n';
    allSystems().forEach(
      (s) => (result += '<td>' + starship.getSystemValue(s) + '</td>\n'),
    );
    result += '</tr>\n</tbody>\n</table>\n';

    result += '<h2>' + i18next.t('Construct.other.departments') + '</h2>\n';
    result += '<table>\n<thead>\n<tr>\n';
    DepartmentsHelper.instance
      .getDepartments()
      .forEach(
        (d) =>
          (result +=
            '<th>' +
            i18next.t(makeKey('Construct.department.', Department[d])) +
            '</th>\n'),
      );
    result += '</tr>\n</thead>\n<tbody><tr>\n';
    DepartmentsHelper.instance
      .getDepartments()
      .forEach((d) => (result += '<td>' + starship.departments[d] + '</td>\n'));
    result += '</tr>\n</tbody>\n</table>\n';

    result +=
      '<p><strong>' +
      i18next.t('Construct.other.power') +
      ':</strong> ' +
      starship.power +
      '<br />';
    result +=
      '<strong>' +
      i18next.t('Construct.other.scale') +
      ':</strong> ' +
      starship.scale +
      '<br />';
    result +=
      '<strong>' +
      i18next.t('Construct.other.shields') +
      ':</strong> ' +
      starship.shields +
      '<br />';
    result +=
      '<strong>' +
      i18next.t('Construct.other.crewSupport') +
      ':</strong> ' +
      starship.crewSupport +
      '</p>';

    const delta =
      '<img src="https://s3.amazonaws.com/files.d20.io/images/239862759/6uRVM0G3z6g119ymlL1VLg/med.png?1628984150" height="18" width="13">';
    const weapons = starship.determineWeapons();
    if (weapons?.length) {
      result +=
        '<p><strong>' +
        i18next.t('Construct.other.attacks') +
        '</strong></p>\n<ul>\n';

      weapons.forEach((w) => {
        result +=
          '<li><p>' +
          w.name +
          ' (' +
          (w.isTractorOrGrappler
            ? ''
            : WeaponTypeModel.TYPES[w.type].description + ', ') +
          (w.range != null ? 'Range ' + WeaponRange[w.range] + ', ' : '') +
          (w.isTractorOrGrappler
            ? 'Strength ' + starship.getDiceForWeaponForRoll20(w)
            : starship.getDiceForWeaponForRoll20(w) + delta) +
          ' ' +
          w.effectsAndQualitiesAsString +
          ')' +
          '</p></li>';
      });

      result += '</ul>\n';
    }
    const talents = starship
      .getDistinctTalentNameList()
      .map((t) => TalentsHelper.getTalent(t))
      .filter((t) => t != null && !t.isSpecialRule(starship.version));
    if (talents?.length) {
      result +=
        '<p><strong>' +
        i18next.t('Construct.other.talents') +
        '</strong></p>\n<ul>\n';

      talents.forEach((t) => {
        const qualifier = starship.getQualifierForTalent(t.name);
        result +=
          '<li><p><b>' +
          t.localizedName +
          (t.maxRank > 1
            ? ' [x' + starship.getRankForTalent(t.name) + ']'
            : '') +
          (qualifier?.length ? ': ' + qualifier : '') +
          ':</b> ' +
          t.localizedDescription +
          '</p></li>\n';
      });

      result += '</ul>\n';
    }

    const specialRules = starship
      .getDistinctTalentNameList()
      .map((t) => TalentsHelper.getTalent(t))
      .filter((t) => t != null && t.isSpecialRule(starship.version));
    if (specialRules?.length) {
      result +=
        '<p><strong>' +
        i18next.t('Construct.other.specialRules') +
        '</strong></p>\n<ul>\n';

      specialRules.forEach((t) => {
        const qualifier = starship.getQualifierForTalent(t.name);
        result +=
          '<li><p><b>' +
          t.localizedName +
          (t.maxRank > 1
            ? '[x' + starship.getRankForTalent(t.name) + ']'
            : '') +
          (qualifier?.length ? ': ' + qualifier : '') +
          ':</b> ' +
          t.localizedDescription +
          '</p></li>\n';
      });

      result += '</ul>\n';
    }
    return result;
  }

  exportCharacter(character: Character) {
    const id = new IdHelper();
    let name = character.name || 'Unnamed Character';
    if (character.pronouns) {
      name += ' (' + character.pronouns + ')';
    }
    const result: IRoll20Json = this.buildRoll20Character(id, name);
    result.character.attribs.push(
      {
        name: 'privilege',
        current: 4,
        max: '',
        id: id.nextId(),
      },
      {
        name: 'responsibility',
        current: 17,
        max: '',
        id: id.nextId(),
      },
    );

    result.character.attribs.push(this.convertSpecies(character, id));
    result.character.attribs.push(this.convertRank(character, id));
    result.character.attribs.push(this.convertUpbringing(character, id));
    result.character.attribs.push(this.convertEnvironment(character, id));
    result.character.attribs.push(this.convertAssignment(character, id));
    result.character.attribs.push(this.convertRankSelect(character, id));
    DepartmentsHelper.instance
      .getDepartments()
      .forEach((d) =>
        result.character.attribs.push(this.convertDiscipline(character, d, id)),
      );
    AttributesHelper.getAllAttributes().forEach((a) =>
      result.character.attribs.push(this.convertAttribute(character, a, id)),
    );
    result.character.attribs.push(this.convertStress(character, id));
    result.character.attribs.push(this.convertReputation(character, id));
    result.character.attribs.push(this.convertResistance(character, id));
    result.character.attribs.push(this.convertValues(character, id));
    character.focuses.forEach((f) =>
      Array.prototype.push.apply(
        result.character.attribs,
        this.convertFocus(character, f, id),
      ),
    );
    character.equipmentModels.forEach((e) =>
      Array.prototype.push.apply(
        result.character.attribs,
        this.convertEquipment(character, e, id),
      ),
    );
    character.implants.forEach((e) => {
      const implant = BorgImplants.instance.getImplantByType(e);
      Array.prototype.push.apply(
        result.character.attribs,
        this.convertEquipment(character, implant, id),
      );
    });

    character.rankedTalents.forEach((t) => {
      result.character.attribs.push(...this.convertTalent(character, t, id));
    });

    const traits = [...character.baseTraits];
    character.additionalTraits
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t?.length)
      .forEach((t) => traits.push(t));

    traits.forEach((t, i) => {
      let description = undefined;
      if (i === 0) {
        // species trait
        if (character.speciesStep?.species !== Species.Custom) {
          const species = SpeciesHelper.getSpeciesByType(
            character?.speciesStep?.species,
          );
          description = species.localizedTraitDescription;
        }
      }
      Array.prototype.push.apply(
        result.character.attribs,
        this.convertTrait(character, t, id, description),
      );
    });
    character
      .determineWeapons()
      .forEach((w) =>
        Array.prototype.push.apply(
          result.character.attribs,
          this.convertWeapon(character, w, id),
        ),
      );

    return result;
  }

  convertShields(starship: Starship, id: IdHelper) {
    return {
      name: 'shields',
      current: '',
      max: starship.shields ?? 0,
      id: id.nextId(),
    };
  }

  convertServiceDate(starship: Starship, id: IdHelper) {
    return {
      name: 'ship-rank',
      current: '' + (starship.serviceYear ?? ''),
      max: '',
      id: id.nextId(),
    };
  }

  convertSpaceframe(starship: Starship, id: IdHelper) {
    return {
      name: 'ship-environment',
      current: starship.className ?? '',
      max: '',
      id: id.nextId(),
    };
  }

  convertDesignation(starship: Starship, id: IdHelper) {
    return {
      name: 'ship-designation',
      current: starship.registry ?? '',
      max: '',
      id: id.nextId(),
    };
  }

  convertRefit(starship: Starship, id: IdHelper) {
    return {
      name: 'ship-refit',
      current: starship.refitsAsString() ?? '',
      max: '',
      id: id.nextId(),
    };
  }

  convertMissionProfile(starship: Starship, id: IdHelper) {
    return {
      name: 'ship_ship-mission-profile',
      current: starship.missionProfileStep?.type?.localizedName ?? '',
      max: '',
      id: id.nextId(),
    };
  }

  convertScale(starship: Starship, id: IdHelper) {
    return {
      name: 'ship_scale',
      current: '' + (starship.scale ?? ''),
      max: '',
      id: id.nextId(),
    };
  }

  convertCrew(starship: Starship, id: IdHelper) {
    return {
      name: 'crew',
      current: '0',
      max: starship.crewSupport ?? 0,
      id: id.nextId(),
    };
  }

  convertPower(starship: Starship, id: IdHelper) {
    return {
      name: 'power',
      current: '0',
      max: starship.power ?? 0,
      id: id.nextId(),
    };
  }

  convertShipResistance(starship: Starship, id: IdHelper) {
    return {
      name: 'ship_resistance',
      current: '' + (starship.resistance ?? ''),
      max: '',
      id: id.nextId(),
    };
  }

  convertSpecies(character: Character, id: IdHelper) {
    return {
      name: 'species',
      current: character.speciesName,
      max: '',
      id: id.nextId(),
    };
  }

  convertAssignment(character: Character, id: IdHelper) {
    return {
      name: 'assignment',
      current: character.assignment,
      max: '',
      id: id.nextId(),
    };
  }

  convertRank(character: Character, id: IdHelper) {
    return {
      name: 'rank',
      current: character.rank?.name ?? '',
      max: '',
      id: id.nextId(),
    };
  }

  convertRankSelect(character: Character, id: IdHelper) {
    return {
      name: 'rankSelect',
      current: character.rank?.name ?? '',
      max: '',
      id: id.nextId(),
    };
  }

  convertUpbringing(character: Character, id: IdHelper) {
    return {
      name: 'upbringing',
      current: character.upbringingStep?.description ?? '',
      max: '',
      id: id.nextId(),
    };
  }

  convertReputation(character: Character, id: IdHelper) {
    return {
      name: 'reputation',
      current: character.reputation ?? '',
      max: '',
      id: id.nextId(),
    };
  }

  convertResistance(character: Character, id: IdHelper) {
    return {
      name: 'resistance',
      current: character.resistance ?? '0',
      max: '',
      id: id.nextId(),
    };
  }

  convertStress(character: Character, id: IdHelper) {
    return {
      name: 'stress',
      current: '',
      max: character.stress,
      id: id.nextId(),
    };
  }

  convertDiscipline(character: Character, d: Department, id: IdHelper) {
    return {
      name: departmentName(d),
      current: character.departments[d],
      max: '',
      id: id.nextId(),
    };
  }

  convertStarshipDepartment(starship: Starship, d: Department, id: IdHelper) {
    return {
      name: 'ship_' + departmentName(d),
      current: starship.departments[d],
      max: '',
      id: id.nextId(),
    };
  }

  convertSystem(starship: Starship, s: System, id: IdHelper) {
    let name = System[s];
    if (s === System.Comms) {
      name = 'communcation';
    } else if (s === System.Computer) {
      name = 'computers';
    }
    return {
      name: 'ship_' + name.toLocaleLowerCase(),
      current: starship.getSystemValue(s),
      max: '',
      id: id.nextId(),
    };
  }

  convertAttribute(character: Character, a: Attribute, id: IdHelper) {
    return {
      name: attributeName(a),
      current: character.attributes[a],
      max: '',
      id: id.nextId(),
    };
  }

  convertEnvironment(character: Character, id: IdHelper) {
    return {
      name: 'environment',
      current:
        CharacterSerializer.serializeEnvironment(
          character.environmentStep?.environment,
          character.environmentStep?.otherSpecies,
          character,
        ) ?? '',
      max: '',
      id: id.nextId(),
    };
  }

  convertValues(character: Character, id: IdHelper) {
    return {
      name: 'values',
      current: character.values.join('\n'),
      max: '',
      id: id.nextId(),
    };
  }

  convertFocus(character: Character, focus: string, id: IdHelper) {
    const rowId = id.nextId();
    return [
      {
        name: 'repeating_focuses_' + rowId + '_focus_name',
        current: focus,
        max: '',
        id: id.nextId(),
      },
      {
        name: 'repeating_focuses_' + rowId + '_focus_settings',
        current: '0',
        max: '',
        id: id.nextId(),
      },
      {
        name: 'repeating_focuses_' + rowId + '_focus_show_description',
        current: 'off',
        max: '',
        id: id.nextId(),
      },
    ];
  }

  convertEquipment(
    character: Character,
    equipment: EquipmentModel | Implant,
    id: IdHelper,
  ) {
    const rowId = id.nextId();
    const result = [
      {
        name: 'repeating_equipmentks_' + rowId + '_equipment_name',
        current: equipment.name,
        max: '',
        id: id.nextId(),
      },
      {
        name: 'repeating_equipmentks_' + rowId + '_equipment_settings',
        current: '0',
        max: '',
        id: id.nextId(),
      },
    ];
    if (equipment.description) {
      result.push({
        name: 'repeating_equipmentks_' + rowId + '_equipment_description',
        current: equipment.description,
        max: '',
        id: id.nextId(),
      });
    }
    return result;
  }

  determineCategoryType(talent: TalentModel) {
    let category = TalentCategory[talent.category.category];
    if (talent.category.category === TalentCategory.Species) {
      category = Species[talent.category.type[0]];
    } else if (talent.category.category === TalentCategory.Department) {
      category = Department[talent.category.type[0]];
    }
    return category;
  }

  convertStarshipTalent(
    starship: Starship,
    selectedTalent: SelectedTalent,
    id: IdHelper,
  ) {
    const talent = selectedTalent.talentModel;
    let name = selectedTalent.displayNameWithMultiple;

    const qualifier = starship.getQualifierForTalent(talent.name);
    if (qualifier?.length) {
      name += ': ' + qualifier;
    }

    return this.convertTalentRow(
      selectedTalent,
      starship.version,
      'repeating_stalents_',
      'stalent_',
      name,
      talentRequirement(talent),
      id,
    );
  }

  convertTalent(
    character: Character,
    selectedTalent: SelectedTalent,
    id: IdHelper,
  ) {
    const talent = selectedTalent.talentModel;
    return this.convertTalentRow(
      selectedTalent,
      character.version,
      'repeating_talents_',
      'talent_',
      selectedTalent.displayNameWithMultiple,
      talentRequirement(talent),
      id,
    );
  }

  private convertTalentRow(
    selectedTalent: SelectedTalent,
    version: number,
    rowPrefix: string,
    fieldPrefix: string,
    name: string,
    requirement: string,
    id: IdHelper,
  ) {
    const rowId = id.nextId();
    const talent = selectedTalent.talentModel;
    const category = this.determineCategoryType(talent);
    return [
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'name',
        current: name,
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'description',
        current: resolveTalentDescription(selectedTalent, version, true),
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'requirements',
        current: requirement,
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'category',
        current: category,
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'settings',
        current: '0',
        max: '',
        id: id.nextId(),
      },
    ];
  }

  convertWeapon(character: Character, weapon: Weapon, id: IdHelper) {
    return this.convertWeaponRow(
      weapon,
      'repeating_weapons_',
      'weapon_',
      'weapon_effects',
      weapon.dice + character.departments[Department.Security],
      weapon.type === WeaponType.MELEE ? 'Melee' : 'Ranged',
      id,
    );
  }

  convertStarshipWeapon(starship: Starship, weapon: Weapon, id: IdHelper) {
    return this.convertWeaponRow(
      weapon,
      'repeating_ship_',
      'weapon_',
      'weapon_effect',
      weapon.dice + starship.getDiceForWeaponForRoll20(weapon),
      weapon.type === WeaponType.TORPEDO ? 'Torpedo' : 'Energy',
      id,
    );
  }

  private convertWeaponRow(
    weapon: Weapon,
    rowPrefix: string,
    fieldPrefix: string,
    effectsField: string,
    damageRolls: number,
    type: string,
    id: IdHelper,
  ) {
    let damage = '';
    for (let i = 0; i < damageRolls; i++) {
      damage += '{{cdice' + (i + 1) + '=[[1d6]]}}';
    }
    const rowId = id.nextId();
    return [
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'name',
        current: weapon.name,
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'quality',
        current:
          weapon.qualities?.map((q) => q.localizedDescription)?.join(', ') ??
          '',
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_' + effectsField,
        current:
          weapon.effects?.map((q) => q.localizedDescription)?.join(', ') ?? '',
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'damage',
        current: weapon.dice,
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_damageRoll',
        current: damage,
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'type',
        current: type,
        max: '',
        id: id.nextId(),
      },
    ];
  }

  convertTrait(
    character: Character,
    trait: string,
    id: IdHelper,
    description?: string,
  ) {
    return this.convertTraitRow(
      trait,
      'repeating_traits_',
      'trait_',
      id,
      description,
    );
  }

  convertStarshipTrait(starship: Starship, trait: string, id: IdHelper) {
    return this.convertTraitRow(trait, 'repeating_straits_', 'strait_', id);
  }

  private convertTraitRow(
    trait: string,
    rowPrefix: string,
    fieldPrefix: string,
    id: IdHelper,
    description?: string,
  ) {
    const rowId = id.nextId();
    const result = [
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'name',
        current: trait,
        max: '',
        id: id.nextId(),
      },
      {
        name: rowPrefix + rowId + '_' + fieldPrefix + 'settings',
        current: '0',
        max: '',
        id: id.nextId(),
      },
    ];
    if (description) {
      result.push({
        name: rowPrefix + rowId + '_' + fieldPrefix + 'description',
        current: description ?? '',
        max: '',
        id: id.nextId(),
      });
    }
    return result;
  }
}
