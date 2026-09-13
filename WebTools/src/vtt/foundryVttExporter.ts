import type { Character } from '../common/character';
import { CharacterSerializer } from '../common/characterSerializer';
import type { Starship } from '../common/starship';
import { AttributesHelper } from '../helpers/attributes';
import type { RoleModel } from '../helpers/roles';
import { Role, RolesHelper } from '../helpers/roles';
import { DepartmentsHelper, Department } from '../helpers/department';
import { TalentModel } from '../helpers/talentModel';
import { TALENT_NAME_UNTAPPED_POTENTIAL } from '../helpers/talents';
import type { Weapon } from '../helpers/weapons';
import {
  DeliverySystem,
  EnergyLoadType,
  InjuryType,
  PersonalWeapons,
  Quality,
  TorpedoLoadType,
  WeaponRange,
  WeaponType,
} from '../helpers/weapons';
import { allSystems, System } from '../helpers/systems';
import { Spaceframe } from '../helpers/spaceframeEnum';
import { Species } from '../helpers/speciesEnum';
import { EquipmentModel } from '../helpers/equipment';
import type { Construct } from '../common/construct';
import { CareerEventsHelper } from '../helpers/careerEvents';
import { CareersHelper } from '../helpers/careers';
import { CharacterTypeModel } from '../common/characterType';
import { TracksHelper } from '../helpers/tracks';
import { SpeciesAbility } from '../helpers/speciesAbility';
import { markupToHtml } from './markupToHtml';
import { FoundryPluginType } from './foundryPluginType';
import { marshaller } from '../helpers/marshaller';
import type { SelectedTalent } from '../common/selectedTalent';
import type { Station } from '../common/station';
import {
  departmentName,
  attributeName,
  resolveTalentDescription,
  splitToParagraphs,
} from './vttShared';
import { TalentCategory } from '../helpers/talentCategory';
import { ShipBuildType } from '../common/shipBuildType';
import { isKlingonWarriorType } from '../helpers/klingonWarrior';

const DEFAULT_STARSHIP_ICON = 'systems/sta/assets/icons/ship_icon.png';
const DEFAULT_EQUIPMENT_ICON =
  'systems/sta/assets/icons/voyagercombadgeicon.svg';

const SYSTEM_VERSION = '2.4.2';

export class FoundryVttExporter {
  private static singleton: FoundryVttExporter;

  static get instance() {
    if (FoundryVttExporter.singleton == null) {
      FoundryVttExporter.singleton = new FoundryVttExporter();
    }
    return FoundryVttExporter.singleton;
  }

  exportStarship(starship: Starship, type: FoundryPluginType) {
    const now = Date.now();

    const result = {
      name: starship.name || 'Unnamed Starship',
      type:
        type === FoundryPluginType.Standard && starship.isSmallCraft
          ? 'smallcraft'
          : 'starship',
      img: this.determineStarshipIcon(starship),
      system: {
        notes: '',
        crew: {
          value: starship.crewSupport,
          max: starship.crewSupport,
        },
        departments: {},
        designation: starship.registry ?? '',
        missionprofile: starship.missionProfileStep?.type?.localizedName ?? '',
        power: {
          value: starship.power,
          max: starship.power,
        },
        refit: starship.refitsAsString(),
        resistance: starship.resistance,
        scale: starship.scale,
        shields: {
          value: starship.shields,
          max: starship.shields,
        },
        servicedate: starship.serviceYear ?? '',
        spaceframe: starship.className ?? '',
        systems: {},
        traits: starship.getAllTraits(),
      },
      items: [],
      effects: [],
      flags: {
        exportSource: {
          world: 'sta-bcholmes-org',
          system: 'sta',
          coreVersion: '10.291',
          systemVersion: SYSTEM_VERSION,
        },
      },
      _stats: {
        systemId: 'sta',
        systemVersion: SYSTEM_VERSION,
        coreVersion: '10.291',
        createdTime: now,
        modifiedTime: now,
        lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
      },
    };

    DepartmentsHelper.instance.getDepartments().forEach((d) => {
      const name = departmentName(d);
      result.system.departments[name] = {
        label: 'sta.actor.starship.department.' + name,
        value: '' + starship.departments[d],
        selected: false,
      };
    });

    allSystems().forEach((s) => {
      let name = System[s].toLowerCase();
      if (s === System.Comms) {
        name = 'communications';
      } else if (s === System.Computer) {
        name = 'computers';
      }
      result.system.systems[name] = {
        label: 'sta.actor.starship.system.' + name,
        value: '' + starship.systems[s],
        selected: false,
      };
    });

    Object.values(starship.rankedTalents).forEach((t) => {
      result.items.push({
        name: t.displayNameWithMultiple,
        type: 'talent',
        img: this.determineTalentIcon(t.talentModel),
        system: {
          description: this.convertDescription(t, starship),
          talenttype: {
            typeenum: 'general',
            description: '',
            minimum: 0,
          },
        },
        effects: [],
        flags: {},
        _stats: {
          systemId: 'sta',
          systemVersion: SYSTEM_VERSION,
          coreVersion: '10.291',
          createdTime: now,
          modifiedTime: now,
          lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
        },
        folder: null,
        sort: 0,
        ownership: {
          default: 0,
          xuN9JpdcyRd60ZEJ: 3,
        },
      });
    });

    starship.determineWeapons().forEach((w) => {
      if (w.type !== WeaponType.CAPTURE) {
        result.items.push({
          name: w.name,
          type: 'starshipweapon',
          img: this.determineStarshipWeaponIcon(w),
          effects: [],
          folder: null,
          sort: 0,
          system: {
            description: '',
            damage: w.dice,
            range: w.range != null ? WeaponRange[w.range].toLowerCase() : null,
            qualities: {
              area: w.isQualityPresent(Quality.Area),
              spread: false,
              dampening: w.isQualityPresent(Quality.Dampening),
              calibration: w.isQualityPresent(Quality.Calibration),
              devastating: w.isQualityPresent(Quality.Devastating),
              highyield: w.isQualityPresent(Quality.HighYield),
              persistentx: w.isQualityPresent(Quality.PersistentX)
                ? starship.scale
                : 0,
              piercingx: w.getRankForQuality(Quality.Piercing),
              viciousx: w.getRankForQuality(Quality.Vicious),
              hiddenx: w.getRankForQuality(Quality.Hidden),
              versatilex: w.getRankForQuality(Quality.Versatile),
            },
            opportunity: null,
            escalation: null,
          },
          ownership: {
            default: 0,
            xuN9JpdcyRd60ZEJ: 3,
          },
          _stats: {
            systemId: 'sta',
            systemVersion: SYSTEM_VERSION,
            coreVersion: '10.291',
            createdTime: now,
            modifiedTime: now,
            lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
          },
        });
        if (type === FoundryPluginType.Standard && starship.version > 1) {
          result.items.push({
            name: w.name,
            type: 'starshipweapon2e',
            sort: 1000,
            img: this.determineStarshipWeaponIcon(w),
            system: {
              damage: w.dice,
              range:
                w.range != null ? WeaponRange[w.range].toLowerCase() : null,
              includescale:
                w.type === WeaponType.TORPEDO ? 'torpedo' : 'energy',
              description: '',
              opportunity: 0,
              escalation: 0,
              qualities: {
                energy: w.type === WeaponType.ENERGY,
                torpedo: w.type === WeaponType.TORPEDO,
                area: w.isQualityPresent(Quality.Area),
                calibration: w.isQualityPresent(Quality.Calibration),
                cumbersome: w.isQualityPresent(Quality.Cumbersome),
                dampening: w.isQualityPresent(Quality.Dampening),
                depleting: w.isQualityPresent(Quality.Depleting),
                devastating: w.isQualityPresent(Quality.Devastating),
                highyield: w.isQualityPresent(Quality.HighYield),
                intense: w.isQualityPresent(Quality.Intense),
                jamming: w.isQualityPresent(Quality.Jamming),
                persistent: w.isQualityPresent(Quality.PersistentX),
                piercing: w.isQualityPresent(Quality.Piercing),
                slowing: w.isQualityPresent(Quality.Slowing),
                spread: w.isQualityPresent(Quality.Spread),
                hiddenx: 0,
                versatilex: 0,
              },
            },
            effects: [],
            folder: null,
            flags: {},
            _stats: {
              coreVersion: '13.346',
              systemId: 'sta',
              systemVersion: SYSTEM_VERSION,
              createdTime: 1775998532666,
              modifiedTime: 1775998603845,
              lastModifiedBy: 'aodUFbctO5o4nV3h',
            },
          });
        }
      }
    });

    return result;
  }

  exportStation(station: Station, type: FoundryPluginType) {
    const now = Date.now();

    const result = {
      name: station.name || 'Unnamed Station',
      type: 'starship',
      img: 'systems/sta/assets/icons/VoyagerCombadgeIcon.png',
      system: {
        notes: '',
        crew: {
          value: station.crewSupport,
          max: station.crewSupport,
        },
        departments: {},
        designation: station.name || 'Unnamed Station',
        missionprofile: station.missionProfileStep?.model?.localizedName ?? '',
        power: {
          value: station.power,
          max: station.power,
        },
        refit: '',
        resistance: station.resistance,
        scale: station.scale,
        shields: {
          value: station.shields,
          max: station.shields,
        },
        servicedate: '',
        spaceframe: '',
        systems: {},
        traits: station.allTraitsAsString ?? '',
      },
      items: [],
      effects: [],
      flags: {
        exportSource: {
          world: 'sta-bcholmes-org',
          system: 'sta',
          coreVersion: '10.291',
          systemVersion: SYSTEM_VERSION,
        },
      },
      _stats: {
        systemId: 'sta',
        systemVersion: SYSTEM_VERSION,
        coreVersion: '10.291',
        createdTime: now,
        modifiedTime: now,
        lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
      },
    };

    DepartmentsHelper.instance.getDepartments().forEach((d) => {
      const name = departmentName(d);
      result.system.departments[name] = {
        label: 'sta.actor.starship.department.' + name,
        value: '' + station.departments[d],
        selected: false,
      };
    });

    allSystems().forEach((s) => {
      let name = System[s].toLowerCase();
      if (s === System.Comms) {
        name = 'communications';
      } else if (s === System.Computer) {
        name = 'computers';
      }
      result.system.systems[name] = {
        label: 'sta.actor.starship.system.' + name,
        value: '' + station.systems[s],
        selected: false,
      };
    });

    Object.values(station.rankedTalents).forEach((t) => {
      result.items.push({
        name: t.displayNameWithMultiple,
        type: 'talent',
        img: this.determineTalentIcon(t.talentModel),
        system: {
          description: this.convertDescription(t, station),
          talenttype: {
            typeenum: 'general',
            description: '',
            minimum: 0,
          },
        },
        effects: [],
        flags: {},
        _stats: {
          systemId: 'sta',
          systemVersion: SYSTEM_VERSION,
          coreVersion: '10.291',
          createdTime: now,
          modifiedTime: now,
          lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
        },
        folder: null,
        sort: 0,
        ownership: {
          default: 0,
          xuN9JpdcyRd60ZEJ: 3,
        },
      });
    });

    station.determineWeapons().forEach((w) => {
      result.items.push({
        name: w.name,
        type: 'starshipweapon',
        img: this.determineStarshipWeaponIcon(w),
        effects: [],
        folder: null,
        sort: 0,
        system: {
          description: '',
          damage: w.dice,
          range: w.range != null ? WeaponRange[w.range].toLowerCase() : null,
          qualities: {
            area: w.isQualityPresent(Quality.Area),
            spread: false,
            dampening: w.isQualityPresent(Quality.Dampening),
            calibration: w.isQualityPresent(Quality.Calibration),
            devastating: w.isQualityPresent(Quality.Devastating),
            highyield: w.isQualityPresent(Quality.HighYield),
            persistentx: w.isQualityPresent(Quality.PersistentX)
              ? station.scale
              : 0,
            piercingx: w.getRankForQuality(Quality.Piercing),
            viciousx: w.getRankForQuality(Quality.Vicious),
            hiddenx: w.getRankForQuality(Quality.Hidden),
            versatilex: w.getRankForQuality(Quality.Versatile),
          },
          opportunity: null,
          escalation: null,
        },
        ownership: {
          default: 0,
          xuN9JpdcyRd60ZEJ: 3,
        },
        _stats: {
          systemId: 'sta',
          systemVersion: SYSTEM_VERSION,
          coreVersion: '10.291',
          createdTime: now,
          modifiedTime: now,
          lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
        },
      });
      if (type === FoundryPluginType.Standard && station.version > 1) {
        result.items.push({
          name: w.name,
          type: 'starshipweapon2e',
          sort: 1000,
          img: this.determineStarshipWeaponIcon(w),
          system: {
            damage: w.dice,
            range: w.range != null ? WeaponRange[w.range].toLowerCase() : null,
            includescale: w.type === WeaponType.TORPEDO ? 'torpedo' : 'energy',
            description: '',
            opportunity: 0,
            escalation: 0,
            qualities: {
              energy: w.type === WeaponType.ENERGY,
              torpedo: w.type === WeaponType.TORPEDO,
              area: w.isQualityPresent(Quality.Area),
              calibration: w.isQualityPresent(Quality.Calibration),
              cumbersome: w.isQualityPresent(Quality.Cumbersome),
              dampening: w.isQualityPresent(Quality.Dampening),
              depleting: w.isQualityPresent(Quality.Depleting),
              devastating: w.isQualityPresent(Quality.Devastating),
              highyield: w.isQualityPresent(Quality.HighYield),
              intense: w.isQualityPresent(Quality.Intense),
              jamming: w.isQualityPresent(Quality.Jamming),
              persistent: w.isQualityPresent(Quality.PersistentX),
              piercing: w.isQualityPresent(Quality.Piercing),
              slowing: w.isQualityPresent(Quality.Slowing),
              spread: w.isQualityPresent(Quality.Spread),
              hiddenx: 0,
              versatilex: 0,
            },
          },
          effects: [],
          folder: null,
          flags: {},
          _stats: {
            coreVersion: '13.346',
            systemId: 'sta',
            systemVersion: SYSTEM_VERSION,
            createdTime: 1775998532666,
            modifiedTime: 1775998603845,
            lastModifiedBy: 'aodUFbctO5o4nV3h',
          },
        });
      }
    });

    return result;
  }

  determineStarshipIcon(starship: Starship) {
    if (starship.buildType === ShipBuildType.Runabout) {
      return 'systems/sta/assets/compendia/ships/starfleet/danube-runabout-token.webp';
    } else if (starship.isSmallCraft) {
      return 'systems/sta/assets/compendia/ships/starfleet/type-6-shuttlepod-token.webp';
    } else if (
      starship.spaceframeModel?.id === Spaceframe.Akira ||
      starship.spaceframeModel?.id === Spaceframe.Akira_UP
    ) {
      return 'systems/sta/assets/compendia/ships/starfleet/akira-token.webp';
    } else if (
      starship.spaceframeModel?.id === Spaceframe.Constitution ||
      starship.spaceframeModel?.id === Spaceframe.Constitution_UP
    ) {
      return 'systems/sta/assets/compendia/ships/starfleet/constitution-token.webp';
    } else if (
      starship.spaceframeModel?.id === Spaceframe.Constellation ||
      starship.spaceframeModel?.id === Spaceframe.Constellation_UP
    ) {
      return 'systems/sta/assets/compendia/ships/starfleet/constellation-token.webp';
    } else if (
      starship.spaceframeModel?.id === Spaceframe.Defiant ||
      starship.spaceframeModel?.id === Spaceframe.Defiant_UP
    ) {
      return 'systems/sta/assets/compendia/ships/starfleet/defiant-token.webp';
    } else if (
      starship.spaceframeModel?.id === Spaceframe.Excelsior ||
      starship.spaceframeModel?.id === Spaceframe.Excelsior_UP
    ) {
      return 'systems/sta/assets/compendia/ships/starfleet/excelsior-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.Galaxy) {
      return 'systems/sta/assets/compendia/ships/starfleet/galaxy-token.webp';
    } else if (
      starship.spaceframeModel?.id === Spaceframe.Intrepid ||
      starship.spaceframeModel?.id === Spaceframe.Intrepid_UP
    ) {
      return 'systems/sta/assets/compendia/ships/starfleet/intrepid-token.webp';
    } else if (
      starship.spaceframeModel?.id === Spaceframe.Miranda ||
      starship.spaceframeModel?.id === Spaceframe.Miranda_UP
    ) {
      return 'systems/sta/assets/compendia/ships/starfleet/miranda-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.Nova) {
      return 'systems/sta/assets/compendia/ships/starfleet/nova-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.Brel) {
      return 'systems/sta/assets/compendia/ships/klingon/b-rel-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.D7) {
      return 'systems/sta/assets/compendia/ships/klingon/d7-battle-cruiser-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.KVort) {
      return 'systems/sta/assets/compendia/ships/klingon/k-vort-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.VorCha) {
      return 'systems/sta/assets/compendia/ships/klingon/vor-cha-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.DKora) {
      return 'systems/sta/assets/compendia/ships/ferengi/d-kora-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.Tliss) {
      return 'systems/sta/assets/compendia/ships/romulan/bird-of-prey-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.DDeridex) {
      return 'systems/sta/assets/compendia/ships/romulan/d-deridex-token.webp';
    } else if (starship.spaceframeModel?.id === Spaceframe.Galor) {
      return 'systems/sta/assets/compendia/ships/cardassian/galor-token.webp';
    } else {
      return DEFAULT_STARSHIP_ICON;
    }
  }

  determineStarshipWeaponIcon(weapon: Weapon) {
    let filename = '';
    if (weapon.type === WeaponType.ENERGY) {
      if (weapon.loadType.type === EnergyLoadType.Disruptor) {
        filename = 'weapon-disruptor';
      } else if (weapon.loadType.type === EnergyLoadType.Phaser) {
        filename = 'weapon-phaser';
      } else if (weapon.loadType.type === EnergyLoadType.PhasedPolaron) {
        filename = 'weapon-polaron';
      }
      if (filename !== '') {
        if (weapon.deliveryType.type === DeliverySystem.Arrays) {
          filename += '-array';
        } else if (weapon.deliveryType.type === DeliverySystem.Banks) {
          filename += '-bank';
        } else if (weapon.deliveryType.type === DeliverySystem.Cannons) {
          filename += '-cannon';
        }
        return (
          'systems/sta/assets/compendia/icons/starshipweapons-core/' +
          filename +
          '.svg'
        );
      } else {
        return DEFAULT_EQUIPMENT_ICON;
      }
    } else if (weapon.type === WeaponType.TORPEDO) {
      if (weapon.loadType.type === TorpedoLoadType.Photon) {
        return 'systems/sta/assets/compendia/icons/starshipweapons-core/weapon-photon-torpedo.svg';
      } else if (weapon.loadType.type === TorpedoLoadType.Plasma) {
        return 'systems/sta/assets/compendia/icons/starshipweapons-core/weapon-plasma-torpedo.svg';
      } else if (weapon.loadType.type === TorpedoLoadType.Quantum) {
        return 'systems/sta/assets/compendia/icons/starshipweapons-core/weapon-quantum-torpedo.svg';
      } else {
        return DEFAULT_EQUIPMENT_ICON;
      }
    } else if (weapon.type === WeaponType.CAPTURE) {
      return 'systems/sta/assets/compendia/icons/starshipweapons-core/weapon-tractor-beam.svg';
    } else {
      return DEFAULT_EQUIPMENT_ICON;
    }
  }

  exportCharacter(character: Character, type: FoundryPluginType) {
    const now = Date.now();
    const result = {
      name: character.name || 'Unnamed Character',
      type: 'character',
      img: 'icons/svg/mystery-man.svg',
      system: {
        notes: this.convertCharacterDescription(character),
        assignment: character.assignedShip,
        attributes: {},
        careerevents: character.careerEvents
          .map(
            (e) =>
              CareerEventsHelper.getCareerEvent(
                e.id,
                character.type,
                character.version,
              )?.localizedName,
          )
          .filter((e) => e?.length)
          .join(', '),
        characterrole: character.assignmentWithoutShip,
        careerpath: this.convertCareerPath(character),
        determination: {
          value: 1,
          max: 3,
        },
        disciplines: {},
        experience:
          character.careerStep?.career != null
            ? (CareersHelper.instance.getCareer(
                character.careerStep?.career,
                character,
              )?.localizedName ?? '')
            : '',
        milestones: '',
        pastimes: character.pastime?.length ? character.pastime.join(', ') : '',
        pronouns: character.pronouns ?? '',
        rank: character.rank?.name ?? '',
        reputation: character.reputation,
        stress: {
          value: character.stress,
          max: character.stress,
        },
        traits:
          type === FoundryPluginType.Standard ? '' : character.getAllTraits(),
      },
      items: [],
      effects: [],
      flags: {
        exportSource: {
          world: 'sta-bcholmes-org',
          system: 'sta',
          coreVersion: '10.291',
          systemVersion: SYSTEM_VERSION,
        },
      },
      _stats: {
        systemId: 'sta',
        systemVersion: SYSTEM_VERSION,
        coreVersion: '10.291',
        createdTime: now,
        modifiedTime: now,
        lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
      },
    };

    DepartmentsHelper.instance.getDepartments().forEach((d) => {
      const name = departmentName(d);
      result.system.disciplines[name] = {
        label: 'sta.actor.character.discipline.' + name,
        value: '' + character.departments[d],
        selected: false,
      };
    });

    AttributesHelper.getAllAttributes().forEach((a) => {
      const name = attributeName(a);
      result.system.attributes[name] = {
        label: 'sta.actor.character.attribute.' + name,
        value: '' + character.attributes[a],
        selected: false,
      };
    });

    if (character.environmentStep) {
      result.system['environment'] = CharacterSerializer.serializeEnvironment(
        character.environmentStep?.environment,
        character.environmentStep?.otherSpecies,
        character,
      );
    } else {
      result.system['environment'] = '';
    }
    result.system['species'] = character.speciesName;
    if (type === FoundryPluginType.Standard) {
      if (isKlingonWarriorType(character.type) && character.house?.length) {
        result.system['house'] = character.house;
      }
    }

    if (character.upbringingStep) {
      result.system['upbringing'] = character.upbringingStep?.description;
    } else {
      result.system['upbringing'] = '';
    }

    character.values?.forEach((v) => {
      result.items.push({
        name: v,
        type: 'value',
        img: this.determineValueIcon(v),
        system: {
          description: '',
          used: false,
        },
        effects: [],
        folder: null,
        sort: 0,
        ownership: {
          default: 0,
          xuN9JpdcyRd60ZEJ: 3,
        },
        flags: {},
        _stats: {
          systemId: 'sta',
          systemVersion: SYSTEM_VERSION,
          coreVersion: '10.291',
          createdTime: now,
          modifiedTime: now,
          lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
        },
      });
    });

    character.focuses?.forEach((f) => {
      result.items.push({
        name: f,
        type: 'focus',
        img: this.determineFocusIcon(f),
        system: {
          description: '',
        },
        effects: [],
        folder: null,
        sort: 0,
        ownership: {
          default: 0,
          xuN9JpdcyRd60ZEJ: 3,
        },
        flags: {},
        _stats: {
          systemId: 'sta',
          systemVersion: SYSTEM_VERSION,
          coreVersion: '10.291',
          createdTime: now,
          modifiedTime: now,
          lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
        },
      });
    });

    if (type === FoundryPluginType.Standard) {
      character.traits?.forEach((t) => {
        result.items.push({
          name: t,
          type: 'trait',
          img: 'systems/sta/assets/icons/VoyagerCombadgeIcon.png',
          system: {
            description: '',
            quantity: 1,
          },
          effects: [],
          folder: null,
          sort: 0,
          ownership: {
            default: 0,
            a6BIWTTe2ysAI7Jm: 3,
          },
          flags: {},
          _stats: {
            compendiumSource: null,
            duplicateSource: null,
            coreVersion: '13.336',
            systemId: 'sta',
            systemVersion: SYSTEM_VERSION,
            createdTime: now,
            modifiedTime: now,
            lastModifiedBy: 'a6BIWTTe2ysAI7Jm',
            exportSource: null,
          },
        });
      });
    }

    character.equipmentAndImplants?.forEach((e) => {
      const item = {
        name: e.name,
        type: e instanceof EquipmentModel && e.isArmour ? 'armor' : 'item',
        img: this.determineItemIcon(e.name),
        system: {
          description: '',
          quantity: 1,
          opportunity: 0,
          escalation: 0,
        },
        effects: [],
        folder: null,
        sort: 0,
        ownership: {
          default: 0,
          xuN9JpdcyRd60ZEJ: 3,
        },
        flags: {},
        _stats: {
          systemId: 'sta',
          systemVersion: SYSTEM_VERSION,
          coreVersion: '10.291',
          createdTime: now,
          modifiedTime: now,
          lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
        },
      };

      if (item.type === 'armor') {
        item.system['protection'] = 1;
      }
      result.items.push(item);
    });

    if (character.role != null) {
      const role = RolesHelper.instance.getRoleModelByName(
        character.role,
        character.type,
      );
      if (role) {
        result.items.push({
          name: role.name,
          type: 'talent',
          img: this.determineRoleIcon(role),
          system: {
            description: '<p>' + role.description + '</p>',
            talenttype: {
              typeenum: 'general',
              description: '',
              minimum: 0,
            },
          },
          effects: [],
          flags: {},
          _stats: {
            systemId: 'sta',
            systemVersion: SYSTEM_VERSION,
            coreVersion: '10.291',
            createdTime: now,
            modifiedTime: now,
            lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
          },
          folder: null,
          sort: 0,
          ownership: {
            default: 0,
            xuN9JpdcyRd60ZEJ: 3,
          },
        });
      }
    }

    const talents = character.rankedTalents;
    talents.forEach((s) => {
      const talent = s.talentModel;
      if (talent) {
        result.items.push({
          name: s.displayNameWithMultiple,
          type: 'talent',
          img: this.determineTalentIcon(talent),
          system: {
            description: this.convertDescription(s, character),
            talenttype: {
              typeenum: this.determineTalentType(talent),
              description: this.determineTalentRequirement(talent),
              minimum: 0,
            },
          },
          effects: [],
          flags: {},
          _stats: {
            systemId: 'sta',
            systemVersion: SYSTEM_VERSION,
            coreVersion: '10.291',
            createdTime: now,
            modifiedTime: now,
            lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
          },
          folder: null,
          sort: 0,
          ownership: {
            default: 0,
            xuN9JpdcyRd60ZEJ: 3,
          },
        });
      }
    });

    if (character.speciesStep?.ability) {
      const ability = character.speciesStep?.ability;
      result.items.push({
        name: ability.name + ' (Species Ability)',
        type: 'talent',
        img: this.determineTalentIcon(ability),
        system: {
          description: this.convertDescription(ability, character),
          talenttype: {
            typeenum: 'Species',
            description: '',
            minimum: 0,
          },
        },
        effects: [],
        flags: {},
        _stats: {
          systemId: 'sta',
          systemVersion: SYSTEM_VERSION,
          coreVersion: '10.291',
          createdTime: now,
          modifiedTime: now,
          lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
        },
        folder: null,
        sort: 0,
        ownership: {
          default: 0,
          xuN9JpdcyRd60ZEJ: 3,
        },
      });
    }

    character.determineWeapons().forEach((w) => {
      result.items.push({
        name: w.name,
        type:
          character.version === 1 || type === FoundryPluginType.ELH
            ? 'characterweapon'
            : 'characterweapon2e',
        img: this.determineWeaponIcon(w, character),
        effects: [],
        folder: null,
        sort: 0,
        system: {
          description: '',
          damage: w.dice,
          severity: w.dice,
          range: w.type === WeaponType.ENERGY ? 'Ranged' : 'Melee',
          hands: w.hands ?? 1,
          qualities: {
            area: false,
            intense: false,
            knockdown: w.isQualityPresent(Quality.Knockdown),
            accurate: false,
            charge: w.isQualityPresent(Quality.Charge),
            cumbersome: false,
            deadly:
              w.injuryType === InjuryType.Deadly ||
              w.injuryType === InjuryType.StunOrDeadly,
            debilitating: false,
            grenade: false,
            inaccurate: false,
            nonlethal: w.isQualityPresent(Quality.NonLethal),
            hiddenx: w.getRankForQuality(Quality.Hidden),
            piercingx: w.getRankForQuality(Quality.Piercing),
            viciousx: w.getRankForQuality(Quality.Vicious),
            opportunity: 0,
            escalation: 0,
            stun:
              w.injuryType === InjuryType.Stun ||
              w.injuryType === InjuryType.StunOrDeadly,
          },
          opportunity: null,
          escalation: null,
        },
        ownership: {
          default: 0,
          xuN9JpdcyRd60ZEJ: 3,
        },
        _stats: {
          systemId: 'sta',
          systemVersion: SYSTEM_VERSION,
          coreVersion: '10.291',
          createdTime: now,
          modifiedTime: now,
          lastModifiedBy: 'xuN9JpdcyRd60ZEJ',
        },
      });
    });

    return result;
  }

  convertCharacterDescription(character: Character) {
    let result = '';
    if (character.description?.length) {
      const paragraphs = splitToParagraphs(character.description);
      paragraphs.forEach((p) => {
        result += '<p>';
        result += p;
        result += '</p>';
      });
    }

    result +=
      '<p><a href="' +
      'https://sta.bcholmes.org/view?s=' +
      marshaller.encodeCharacter(character) +
      '">Original sheet.</a></p>';
    return result;
  }

  convertCareerPath(character: Character) {
    let path =
      CharacterTypeModel.getByType(character.type)?.localizedName ?? '';
    if (character.educationStep) {
      path +=
        ' / ' +
        TracksHelper.instance.getTrack(
          character.educationStep?.track,
          character.type,
          character.version,
        ).localizedName;
    }
    return path;
  }

  determineFocusIcon(focus: string) {
    return 'systems/sta/assets/compendia/icons/focuses-core/focus-core.svg';
  }

  determineItemIcon(item: string) {
    if (item === 'Communicator') {
      return 'systems/sta/assets/compendia/icons/items-core/communicator.webp';
    } else if (item === 'Tricorder') {
      return 'systems/sta/assets/compendia/icons/items-core/tricorder.webp';
    } else if (item === 'MedKit') {
      return 'systems/sta/assets/compendia/icons/items-core/medkit.webp';
    } else if (item === 'Engineering Kit') {
      return 'systems/sta/assets/compendia/icons/items-core/engineering_kit.webp';
    } else {
      return 'systems/sta/assets/compendia/icons/items-core/placeholder.webp';
    }
  }

  determineRoleIcon(role: RoleModel) {
    if (role.id === Role.ChiefEngineer) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-chief-engineer.svg';
    } else if (role.id === Role.ChiefMedicalOfficer) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-chief-medical-officer.svg';
    } else if (role.id === Role.ChiefOfSecurity) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-chief-of-security.svg';
    } else if (role.id === Role.CommandingOfficer) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-commanding-officer.svg';
    } else if (role.id === Role.CommunicationsOfficer) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-communications-officer.svg';
    } else if (role.id === Role.ExecutiveOfficer) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-executive-officer.svg';
    } else if (role.id === Role.FlightController) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-flight-controller.svg';
    } else if (role.id === Role.OperationsManager) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-operations-manager.svg';
    } else if (role.id === Role.ScienceOfficer) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-science-officer.svg';
    } else if (role.id === Role.ShipsCounselor) {
      return 'systems/sta/assets/compendia/icons/roles-core/role-ships-counsellor.svg';
    } else {
      return DEFAULT_EQUIPMENT_ICON;
    }
  }

  determineTalentIcon(talent: TalentModel | SpeciesAbility) {
    if (talent instanceof TalentModel) {
      if (
        talent.category.category === TalentCategory.Department &&
        talent.category.type[0] === Department.Command
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-command.svg';
      } else if (
        talent.category.category === TalentCategory.Department &&
        talent.category.type[0] === Department.Conn
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-conn.svg';
      } else if (
        talent.category.category === TalentCategory.Department &&
        talent.category.type[0] === Department.Security
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-security.svg';
      } else if (
        talent.category.category === TalentCategory.Department &&
        talent.category.type[0] === Department.Science
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-science.svg';
      } else if (
        talent.category.category === TalentCategory.Department &&
        talent.category.type[0] === Department.Medicine
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-medical.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Andorian
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-andorian.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Bajoran
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-bajoran.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Betazoid
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-betazoid.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Borg
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-borg.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Cardassian
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-cardassian.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Denobulan
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-denobulan.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Ferengi
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-ferengi.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Human
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-human.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Klingon
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-klingon.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Romulan
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-romulan.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Tellarite
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-tellarite.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Trill
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-trill.svg';
      } else if (
        talent.category.category === TalentCategory.Species &&
        talent.category.type[0] === Species.Vulcan
      ) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-vulcan.svg';
      } else if (talent.category.category === TalentCategory.Starship) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-ship.svg';
      } else if (talent.name === TALENT_NAME_UNTAPPED_POTENTIAL) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-career-young.svg';
      } else if (talent.name === 'Veteran') {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-veteran.svg';
      } else {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-core.svg';
      }
    } else {
      const ability = talent as SpeciesAbility;
      if (ability.species === Species.Andorian) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-andorian.svg';
      } else if (ability.species === Species.Bajoran) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-bajoran.svg';
      } else if (ability.species === Species.Betazoid) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-betazoid.svg';
      } else if (ability.species === Species.Cardassian) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-cardassian.svg';
      } else if (ability.species === Species.Denobulan) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-denobulan.svg';
      } else if (ability.species === Species.Ferengi) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-ferengi.svg';
      } else if (ability.species === Species.Human) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-human.svg';
      } else if (ability.species === Species.Klingon) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-klingon.svg';
      } else if (ability.species === Species.Romulan) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-romulan.svg';
      } else if (ability.species === Species.Tellarite) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-tellarite.svg';
      } else if (ability.species === Species.Trill) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-trill.svg';
      } else if (ability.species === Species.Vulcan) {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-vulcan.svg';
      } else {
        return 'systems/sta/assets/compendia/icons/talents-core/talent-core.svg';
      }
    }
  }

  determineValueIcon(value: string) {
    return 'systems/sta/assets/compendia/icons/values-core/value-core.svg';
  }

  determineWeaponIcon(weapon: Weapon, character: Character) {
    if (
      weapon.name ===
      PersonalWeapons.instance(character.version).unarmedStrike.name
    ) {
      return 'systems/sta/assets/compendia/icons/weapons-core/unarmed-strike.webp';
    } else if (
      weapon.name === PersonalWeapons.instance(character.version).phaser1.name
    ) {
      return 'systems/sta/assets/compendia/icons/weapons-core/phaser-type-1.webp';
    } else if (
      weapon.name === PersonalWeapons.instance(character.version).phaser2.name
    ) {
      return 'systems/sta/assets/compendia/icons/weapons-core/phaser-type-2.webp';
    } else if (
      weapon.name === PersonalWeapons.instance(character.version).batLeth.name
    ) {
      return 'systems/sta/assets/compendia/icons/weapons-core/bat-leth.webp';
    } else if (
      weapon.name ===
      PersonalWeapons.instance(character.version).disruptorPistol.name
    ) {
      if (character.speciesStep.species === Species.Romulan) {
        return 'systems/sta/assets/compendia/icons/weapons-core/romulan-disruptor-pistol.webp';
      } else if (character.speciesStep.species === Species.Klingon) {
        return 'systems/sta/assets/compendia/icons/weapons-core/klingon-disruptor-pistol.webp';
      } else {
        return 'systems/sta/assets/compendia/icons/items-core/placeholder.webp';
      }
    } else {
      return 'systems/sta/assets/compendia/icons/items-core/placeholder.webp';
    }
  }

  determineTalentRequirement(talent: TalentModel) {
    if (this.determineTalentType(talent) === 'general') {
      return '';
    } else if (this.determineTalentType(talent) === 'discipline') {
      return DepartmentsHelper.instance.getDepartmentName(
        talent.category.type[0] as Department,
      );
    } else {
      return talent.category;
    }
  }

  determineTalentType(talent: TalentModel) {
    if (talent.category.category === TalentCategory.Department) {
      return 'discipline';
    } else if (talent.category.category === TalentCategory.Species) {
      return 'species';
    } else {
      return 'general';
    }
  }

  convertDescription(
    talent: SelectedTalent | SpeciesAbility,
    construct: Construct,
  ) {
    let description = '';
    if (talent instanceof SpeciesAbility) {
      description = (talent as SpeciesAbility).description;
    } else {
      description = resolveTalentDescription(talent, construct.version, true);
    }

    const prerequisites =
      talent instanceof TalentModel ? talent.requirement : '';
    return (
      markupToHtml(description) +
      (prerequisites ? '<p><strong>' + prerequisites + '</strong></p>' : '')
    );
  }
}
