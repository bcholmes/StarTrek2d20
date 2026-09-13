import { Base64 } from 'js-base64';
import pako from 'pako';
import {
  AlliedMilitaryDetails,
  CareerEventStep,
  CareerStep,
  Character,
  CharacterRank,
  EducationStep,
  EnvironmentStep,
  FinishingStep,
  GovernmentDetails,
  NpcGenerationStep,
  Promotion,
  SpeciesAbilityOptions,
  SpeciesStep,
  CharacterAdvancementStep,
  SupportingStep,
  UpbringingStep,
  OtherDetails,
  ReputationChangeStep,
  TokenConfig,
} from '../common/character';
import { CharacterType, CharacterTypeModel } from '../common/characterType';
import type { Construct } from '../common/construct';
import { Stereotype } from '../common/construct';
import {
  MissionProfileStep,
  ServiceRecordStep,
  ShipBuildTypeModel,
  SimpleStats,
  SpaceframeStep,
  Starship,
  StarshipAdvancementStep,
} from '../common/starship';
import { AgeHelper } from './age';
import { Attribute, AttributesHelper } from './attributes';
import { Career } from './careerEnum';
import { CareersHelper } from './careers';
import { Environment, EnvironmentsHelper } from './environments';
import { MissionPod, MissionPodHelper } from './missionPods';
import { MissionProfiles, MissionProfile } from './missionProfiles';
import { Rank, RanksHelper } from './ranks';
import { DepartmentsHelper, Department } from './department';
import { Spaceframe } from './spaceframeEnum';
import { SpaceframeModel } from './spaceframeModel';
import { SpaceframeHelper } from './spaceframes';
import { SpeciesHelper } from './species';
import { Species } from './speciesEnum';
import { allSystems, System, systemByName } from './systems';
import {
  TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_BOLD,
  TALENT_NAME_BORG_IMPLANTS,
  TALENT_NAME_CAUTIOUS,
  TALENT_NAME_COLLABORATION,
  TALENT_NAME_DEFENSIVE_TRAINING,
  TALENT_NAME_DEFENSIVE_TRAINING_FED_KLINGON_WAR,
  TALENT_NAME_EXPANDED_MUNITIONS,
  TALENT_NAME_IM_A_DOCTOR_NOT_A,
  TALENT_NAME_WARRIORS_SPIRIT,
  TalentsHelper,
} from './talents';
import { getAllTracks, Track } from './trackEnum';
import { EarlyOutlook, UpbringingsHelper } from './upbringings';
import {
  CaptureType,
  CaptureTypeModel,
  DeliverySystem,
  DeliverySystemModel,
  EnergyLoadType,
  EnergyLoadTypeModel,
  MineType,
  MineTypeModel,
  PersonalWeapons,
  PersonalWeaponType,
  TorpedoLoadType,
  TorpedoLoadTypeModel,
  UsageCategory,
  Weapon,
  WeaponType,
} from './weapons';
import { Role, RolesHelper } from './roles';
import { BorgImplantType, BorgImplants } from './borgImplant';
import {
  Specialization,
  allSpecializations,
} from '../common/specializationEnum';
import { Era } from './erasEnum';
import { Eras } from './eras';
import { Asset, AssetAbility, AssetStat } from '../asset/asset';
import { AssetType } from '../asset/assetType';
import { AssetStatType, allAssetStatTypes } from '../asset/assetStat';
import { SpeciesAbilityChoice, SpeciesAbilityList } from './speciesAbility';
import {
  allServiceRecords,
  ServiceRecord,
  ServiceRecordList,
} from '../starship/model/serviceRecord';
import {
  AllyHelper,
  AlliedMilitary,
  AlliedMilitaryType,
} from './alliedMilitary';
import { Governments, Government, Polity } from './governments';
import { NpcType, NpcTypes } from '../npc/model/npcType';
import { Creature } from '../creature/model/creature';
import { Habitat, HabitatHelper } from '../creature/model/habitat';
import {
  CreatureType,
  CreatureTypeHelper,
} from '../creature/model/creatureType';
import { DietType, DietTypeHelper } from '../creature/model/diet';
import {
  CreatureSize,
  CreatureSizeHelper,
} from '../creature/model/creatureSize';
import {
  NaturalAttacks,
  NaturalAttacksHelper,
} from '../creature/model/naturalAttacks';
import { OtherSelection, SelectedTalent } from '../common/selectedTalent';
import {
  LocomotionModel,
  LocomotionType,
  LocomotionTypeHelper,
} from '../creature/model/locomotion';
import {
  allCharacterAdvancementChoices,
  CharacterAdvancementChoice,
} from '../modify/model/characterAdvancementChoice';
import { SpecialWeapon } from '../common/specialWeapon';
import { AttackType } from '../common/attackType';
import { ModificationType } from '../modify/model/modificationType';
import { EquipmentHelper, EquipmentModel, EquipmentType } from './equipment';
import {
  PropulsionSystemModel,
  PropulsionSystemType,
} from './propulsionSystem';
import {
  allStarshipAdvancementChoices,
  StarshipAdvancementChoice,
} from '../common/starshipAdvancementChoice';
import {
  LogEntry,
  LogValueEntry,
  ValueUseType,
  ValueUseTypeModel,
} from '../common/logEntry';
import { SpaceframeVariant, SpaceframeVariantModel } from './spaceframeVariant';
import {
  CustomStationSpaceframeStep,
  StandardStationSpaceframeStep,
  Station,
  StationMissionProfileStep,
} from '../common/station';
import { StationFrameModel } from './stationFrameModel';
import { StationFrame, StationFrameAppearance } from './stationFrame';
import { StationFrameAppearanceModel } from './stationFrameAppearanceModel';
import { SpaceframeAppearance } from './spaceframeAppearance';
import { SpaceframeAppearanceModel } from './spaceframeAppearanceModel';
import { ShipBuildType } from '../common/shipBuildType';
import { allUniformEras, UniformEra } from '../token/model/uniformEra';
import {
  allSpeciesOptions,
  SpeciesOption,
} from '../token/model/speciesOptionEnum';
import {
  allUniformVariantTypes,
  UniformVariantType,
} from '../token/model/uniformVariantTypeEnum';
import { allHeadTypes, HeadType } from '../token/model/headTypeEnum';
import { allHairTypes, HairType } from '../token/model/hairTypeEnum';
import { allNoseTypes, NoseType } from '../token/model/noseTypeEnum';
import { allBodyTypes, BodyType } from '../token/model/bodyTypeEnum';
import { allMouthTypes, MouthType } from '../token/model/mouthTypeEnum';
import { allEyeTypes, EyeType } from '../token/model/eyeTypeEnum';
import {
  allNasoLabialFoldTypes,
  NasoLabialFoldType,
} from '../token/model/nasoLabialFoldTypeEnum';
import {
  allFacialHairTypes,
  FacialHairType,
} from '../token/model/facialHairEnum';
import { allExtraTypes, ExtraType } from '../token/model/extrasTypeEnum';
import { TokenModel } from '../token/model/tokenModel';

class Marshaller {
  encodeConstruct(construct: Construct) {
    if (construct instanceof Station) {
      return this.encodeStation(construct);
    } else if (construct instanceof Starship) {
      return this.encodeStarship(construct);
    } else if (construct instanceof Creature) {
      return this.encodeCreature(construct);
    } else {
      return this.encodeCharacter(construct as Character);
    }
  }

  encodeStation(station: Station) {
    const sheet = {
      stereotype: 'station',
      type: CharacterType[station.type],
      era: Era[station.era],
      name: station.name,
      version: station.version,
    };

    if (station.missionProfileStep?.type) {
      const temp = {
        name: MissionProfile[station.missionProfileStep?.type],
      };

      if (station.missionProfileStep.talent) {
        temp['talent'] = this.talentToJson(station.missionProfileStep.talent);
      }
      sheet['missionProfile'] = temp;
    }

    if (station.traits) {
      sheet['traits'] = [...station.traits];
    }

    if (station.stationFrameStep) {
      if (station.stationFrameStep instanceof CustomStationSpaceframeStep) {
        sheet['frame'] = {
          type: 'Custom',
          departments: this.toDepartmentObject(
            station.stationFrameStep.departments,
          ),
          systems: this.toSystemsObject(station.stationFrameStep.systems),
          scale: station.stationFrameStep.scale,
        };
        if (station.stationFrameStep.appearance != null) {
          sheet['frame']['appearance'] =
            StationFrameAppearance[station.stationFrameStep.appearance];
        }
      } else {
        sheet['frame'] = {
          type: StationFrame[station.stationFrameStep.type],
        };
      }
    }

    if (station.weapons?.length) {
      sheet['weapons'] = station.weapons.map((w) => this.encodeWeapon(w));
    }

    if (station.additionalTalents?.length) {
      sheet['talents'] = station.additionalTalents.map((t) =>
        this.talentToJson(t),
      );
    }

    return this.encode(sheet);
  }

  encodeCreature(creature: Creature) {
    const sheet = {
      stereotype: 'creature',
      type: CharacterType[creature.type],
      era: Era[creature.era],
      name: creature.name,
      version: creature.version,
      departments: this.toDepartmentObject(creature.departments),
      attributes: this.toAttributeObject(creature.attributes),
    };

    if (creature.description?.length) {
      sheet['description'] = creature.description;
    }

    if (creature.habitat) {
      sheet['habitat'] = Habitat[creature.habitat?.id];
    }

    if (creature.creatureType) {
      sheet['creatureType'] = CreatureType[creature.creatureType?.id];
    }

    if (creature.diet) {
      sheet['diet'] = DietType[creature.diet?.id];
    }

    if (creature.size) {
      sheet['size'] = CreatureSize[creature.size?.id];
    }

    if (creature.naturalAttacks != null) {
      sheet['naturalAttack'] = NaturalAttacks[creature.naturalAttacks];
    }

    if (creature.additionalTalents?.length) {
      sheet['talents'] = this.toTalentList(creature.additionalTalents);
    }

    if (creature.additionalTraits?.length) {
      sheet['traits'] = [...creature.additionalTraits];
    }

    if (creature.locomotion?.length) {
      sheet['locomotion'] = creature.locomotion.map((l) => {
        const result = {
          type: LocomotionType[l.type.id],
        };
        if (l.count != null) {
          result['count'] = l.count;
        }
        return result;
      });
    }

    if (creature.form?.length) {
      sheet['form'] = creature.form;
    }

    return this.encode(sheet);
  }

  encodeCharacter(character: Character) {
    if (character.stereotype === Stereotype.MainCharacter) {
      return this.encodeMainCharacter(character);
    } else if (character.stereotype === Stereotype.Npc) {
      return this.encodeNpc(character);
    } else if (character.stereotype === Stereotype.SoloCharacter) {
      return this.encodeSoloCharacter(character);
    } else if (character.stereotype === Stereotype.SupportingCharacter) {
      return this.encodeSupportingCharacter(character);
    } else {
      return undefined;
    }
  }

  encodeSupportingCharacter(character: Character) {
    return this.encode(
      this.encodeSimpleCharacterAsJson('supportingCharacter', character),
    );
  }

  encodeNpc(character: Character) {
    return this.encode(this.encodeSimpleCharacterAsJson('npc', character));
  }

  encodeAsset(asset: Asset) {
    const sheet = {
      stereotype: 'asset',
      type: AssetType[asset.type],
      name: asset.name,
      stats: {},
    };

    if (asset.additionalInformation != null) {
      if (asset.type === AssetType.Ship) {
        sheet['additionalInformation'] =
          Spaceframe[asset.additionalInformation];
      } else if (asset.type === AssetType.Character) {
        sheet['additionalInformation'] = Rank[asset.additionalInformation];
      }
    }

    if (asset.specialAbility) {
      sheet['ability'] = {
        title: asset.specialAbility.title,
        description: asset.specialAbility.description,
      };
    }

    allAssetStatTypes().forEach(
      (t) => (sheet.stats[AssetStatType[t]] = '' + asset.stats[t].asString),
    );
    return this.encode(sheet);
  }

  private encodeSimpleCharacterAsJson(
    stereotype: string,
    character: Character,
  ) {
    const sheet = {
      stereotype: stereotype,
      type: CharacterType[character.type],
      era: Era[character.era],
      age: character.age ? character.age.name : undefined,
      name: character.name,
      version: character.version,
      focuses: [...character.focuses],
    };

    if (character.careerStep?.career != null) {
      sheet['career'] = {
        length: Career[character.careerStep.career],
      };
    }

    if (character.description?.length) {
      sheet['description'] = character.description;
    }

    sheet['typeDetails'] = this.encodeTypeDetails(character);

    if (character.legacyMode) {
      sheet['attributes'] = this.toAttributeObject(character.attributeValues);
    }

    if (character.legacyMode) {
      sheet['disciplines'] = this.getDepartmentByNameObject(
        character.departments,
      );
    }

    if (character.supportingStep) {
      sheet['supporting'] = {
        focuses: [
          ...character.supportingStep.focuses.filter((f) => f.trim().length),
        ],
        attributes: [
          ...character.supportingStep.attributes.map((a) => Attribute[a]),
        ],
        disciplines: [
          ...character.supportingStep.disciplines.map((d) => Department[d]),
        ],
        supervisory: character.supportingStep.supervisory,
      };
      if (character.supportingStep.value?.length) {
        sheet['supporting']['value'] = character.supportingStep.value;
      }
    }

    if (character.speciesStep) {
      sheet['species'] = this.toSpeciesJson(character);
    }

    if (character.role != null) {
      sheet['role'] = { id: Role[character.role] };
      if (character.secondaryRole != null) {
        sheet['role']['secondaryId'] = Role[character.secondaryRole];
      }
    }
    if (character.jobAssignment != null) {
      sheet['jobAssignment'] = character.jobAssignment;
    }

    if (character.rankValue) {
      sheet['rank'] = {
        name: character.rankValue?.name,
        id: character.rankValue?.id,
      };
    }

    const additionalTraits = this.parseTraits(character.additionalTraits);
    if (additionalTraits?.length) {
      sheet['traits'] = additionalTraits;
    }
    if (character.pronouns) {
      sheet['pronouns'] = character.pronouns;
    }

    if (character.stereotype === Stereotype.Npc) {
      if (character.npcGenerationStep) {
        const block = {};
        if (character.npcGenerationStep.values.length) {
          block['values'] = character.values;
        }

        const talents = this.toTalentList(character.npcGenerationStep.talents);
        if (talents?.length) {
          block['talents'] = talents;
        }

        if (character.npcGenerationStep?.specialization != null) {
          block['specialization'] =
            Specialization[character.npcGenerationStep.specialization];
        }

        if (character.npcGenerationStep?.type != null) {
          block['type'] = NpcType[character.npcGenerationStep.type];
        }

        if (
          character.npcGenerationStep?.attributes != null &&
          character.npcGenerationStep?.attributes.length > 0
        ) {
          block['attributes'] = this.toAttributeObject(
            character.npcGenerationStep?.attributes,
          );
        }

        if (character.npcGenerationStep.focuses.length) {
          block['focuses'] = character.focuses;
        }

        if (character.npcGenerationStep.departments?.length) {
          block['departments'] = this.getDepartmentByNameObject(
            character.npcGenerationStep?.departments,
          );
        }

        if (character.npcGenerationStep.equipment?.length) {
          block['equipment'] = character.npcGenerationStep.equipment.map(
            (e) => {
              if (e instanceof EquipmentModel) {
                return {
                  type: EquipmentType[e.type],
                  name: e.name,
                };
              } else {
                return EquipmentType[e as EquipmentType];
              }
            },
          );
        }
        if (character.npcGenerationStep.weapons?.length) {
          block['weapons'] = character.npcGenerationStep.weapons.map(
            (w) => PersonalWeaponType[w],
          );
        }
        sheet['npc'] = block;
      }
    }

    sheet['improvements'] = this.encodeImprovements(character);

    if (character.token) {
      sheet['token'] = this.encodeToken(character.token);
    }
    return sheet;
  }

  encodeToken(tokenConfig: TokenConfig) {
    if (tokenConfig?.token) {
      const token = {
        primarySpecies: Species[tokenConfig.token.primarySpecies],
        speciesOption: SpeciesOption[tokenConfig.token.speciesOption],
        uniformEra: UniformEra[tokenConfig.token.uniformEra],
        uniformVariant: UniformVariantType[tokenConfig.token.variant],
        skinColor: tokenConfig.token.skinColor,
        headType: HeadType[tokenConfig.token.headType],
        hairType: HairType[tokenConfig.token.hairType],
        hairColor: tokenConfig.token.hairColor,
        noseType: NoseType[tokenConfig.token.noseType],
        nasoLabialFold: NasoLabialFoldType[tokenConfig.token.nasoLabialFold],
        bodyType: BodyType[tokenConfig.token.bodyType],
        eyeType: EyeType[tokenConfig.token.eyeType],
        eyeColor: tokenConfig.token.eyeColor,
        mouthType: MouthType[tokenConfig.token.mouthType],
        lipstickColor: tokenConfig.token.lipstickColor,
      };
      if (tokenConfig.token.secondarySpecies != null) {
        token['secondarySpecies'] = Species[tokenConfig.token.secondarySpecies];
      }
      if (tokenConfig.token.divisionColor?.length) {
        token['divisionColor'] = tokenConfig.token.divisionColor;
      }
      if (tokenConfig.token.rankIndicator != null) {
        token['rankIndicator'] = Rank[tokenConfig.token.rankIndicator];
      }
      if (tokenConfig.token.facialHairType?.length) {
        token['facialHairType'] = tokenConfig.token.facialHairType.map(
          (t) => FacialHairType[t],
        );
      }
      if (tokenConfig.token.extras?.length) {
        token['extras'] = tokenConfig.token.extras.map((e) => ExtraType[e]);
      }

      return {
        token: token,
        rounded: tokenConfig.rounded ?? false,
        bordered: tokenConfig.bordered ?? false,
      };
    } else {
      return undefined;
    }
  }

  decodeToken(json: any) {
    const tokenJson = json['token'];
    const token = TokenModel.createDefault();
    token.primarySpecies = SpeciesHelper.getSpeciesTypeByName(
      tokenJson['primarySpecies'],
    );
    if (json['secondarySpecies'] != null) {
      token.secondarySpecies = SpeciesHelper.getSpeciesTypeByName(
        tokenJson['secondarySpecies'],
      );
    }
    token.speciesOption = allSpeciesOptions().filter(
      (s) => SpeciesOption[s] === tokenJson['speciesOption'],
    )[0];
    token.skinColor = tokenJson['skinColor'];
    token.headType = allHeadTypes().filter(
      (t) => HeadType[t] === tokenJson['headType'],
    )[0];
    token.hairType = allHairTypes().filter(
      (t) => HairType[t] === tokenJson['hairType'],
    )[0];
    token.hairColor = tokenJson['hairColor'];
    token.noseType = allNoseTypes().filter(
      (t) => NoseType[t] === tokenJson['noseType'],
    )[0];
    token.nasoLabialFold = allNasoLabialFoldTypes().filter(
      (t) => NasoLabialFoldType[t] === tokenJson['nasoLabialFold'],
    )[0];
    token.bodyType = allBodyTypes().filter(
      (t) => BodyType[t] === tokenJson['bodyType'],
    )[0];

    token.eyeType = allEyeTypes().filter(
      (t) => EyeType[t] === tokenJson['eyeType'],
    )[0];
    token.eyeColor = tokenJson['eyeColor'];

    token.mouthType = allMouthTypes().filter(
      (t) => MouthType[t] === tokenJson['mouthType'],
    )[0];
    token.lipstickColor = tokenJson['lipstickColor'];

    token.uniformEra = allUniformEras().filter(
      (u) => UniformEra[u] === tokenJson['uniformEra'],
    )[0];
    token.variant = allUniformVariantTypes().filter(
      (u) => UniformVariantType[u] === tokenJson['uniformVariant'],
    )[0];
    if (tokenJson['divisionColor'] != null) {
      token.divisionColor = tokenJson['divisionColor'];
    }
    if (tokenJson['rankIndicator'] != null) {
      token.rankIndicator = RanksHelper.instance().getRankByRankName(
        tokenJson['rankIndicator'],
      );
    }
    if (tokenJson['facialHairType']?.length) {
      token.facialHairType = allFacialHairTypes().filter((t) =>
        tokenJson['facialHairType'].includes(FacialHairType[t]),
      );
    }
    if (tokenJson['extras']?.length) {
      token.extras = allExtraTypes().filter((t) =>
        tokenJson['extras'].includes(ExtraType[t]),
      );
    }

    return new TokenConfig(
      token,
      json['rounded'] === true,
      json['bordered'] === true,
    );
  }

  encodeStarshipImprovements(starship: Starship) {
    if (starship.advancementSteps?.length) {
      const json = starship.advancementSteps?.map((i) => {
        const result = { type: 'advancement' };
        result['choice'] = StarshipAdvancementChoice[i.choice];
        if (i.choice === StarshipAdvancementChoice.Department) {
          result['value'] = Department[i.value as Department];
          if (i.removeValue != null) {
            result['remove'] = Department[i.removeValue as Department];
          }
        } else if (i.choice === StarshipAdvancementChoice.System) {
          result['value'] = System[i.value as System];
          if (i.removeValue != null) {
            result['remove'] = System[i.removeValue as System];
          }
        } else if (i.choice === StarshipAdvancementChoice.Talent) {
          result['value'] = this.talentToJson(i.value as SelectedTalent);
          if (i.removeValue != null) {
            result['remove'] = this.talentToJson(
              i.removeValue as SelectedTalent,
            );
          }
        }

        return result;
      });
      return json;
    } else {
      return undefined;
    }
  }

  decodeLogEntry(j: any): LogEntry {
    const id = j.id;

    const entry = new LogEntry(id);
    entry.adventureTitle = j.adventureTitle;
    entry.missionDescription = j.missionDescription;
    entry.notes = j.notes;

    if (j.directivesUsed) {
      entry.directivesUsed = [...j.directivesUsed];
    }
    if (j.valuesUsed) {
      entry.valuesUsed = j.valuesUsed.map((json) => {
        const value = json.value;
        const newValue = json.newValue;
        const type = ValueUseTypeModel.findTypeByTypeName(json.useType);
        return new LogValueEntry(value, type, newValue);
      });
    }

    return entry;
  }

  encodeLogEntry(logEntry: LogEntry) {
    return {
      type: 'logEntry',
      id: logEntry.id,
      adventureTitle: logEntry.adventureTitle,
      missionDescription: logEntry.missionDescription,
      notes: logEntry.notes,
      valuesUsed:
        logEntry.valuesUsed?.map((l) => {
          return {
            value: l.value,
            useType: ValueUseType[l.useType],
            newValue: l.newValue,
          };
        }) ?? [],
      directivesUsed: logEntry.directivesUsed?.length
        ? [...logEntry.directivesUsed]
        : [],
    };
  }

  encodeImprovements(character: Character) {
    if (character.improvements?.length) {
      const json = character.improvements?.map((i) => {
        if (i instanceof CharacterAdvancementStep) {
          const result = { type: 'advancement' };
          result['choice'] = CharacterAdvancementChoice[i.choice];
          if (
            i.choice === CharacterAdvancementChoice.Focus ||
            i.choice === CharacterAdvancementChoice.Value
          ) {
            result['value'] = i.value as string;
            if (i.removeValue != null) {
              result['remove'] = i.removeValue as string;
            }
          } else if (i.choice === CharacterAdvancementChoice.Attribute) {
            result['value'] = Attribute[i.value as Attribute];
            if (i.removeValue != null) {
              result['remove'] = Attribute[i.removeValue as Attribute];
            }
          } else if (i.choice === CharacterAdvancementChoice.Department) {
            result['value'] = Department[i.value as Department];
            if (i.removeValue != null) {
              result['remove'] = Department[i.removeValue as Department];
            }
          } else if (i.choice === CharacterAdvancementChoice.Talent) {
            result['value'] = this.talentToJson(i.value as SelectedTalent);
            if (i.removeValue != null) {
              result['remove'] = this.talentToJson(
                i.removeValue as SelectedTalent,
              );
            }
          }
          if (i.log != null) {
            result['log'] = i.log;
          }
          if (i.logCallback != null) {
            result['logCallback'] = i.logCallback;
          }
          return result;
        } else if (i instanceof Promotion) {
          const result = { type: 'promotion' };
          result['rank'] = {
            name: i.rank.name,
            id: i.rank.id,
          };
          result['modificationType'] = ModificationType[i.type];
          return result;
        } else if (i instanceof ReputationChangeStep) {
          const result = { type: 'reputation' };
          result['reputation'] = i.reputation;
          return result;
        } else if (i instanceof LogEntry) {
          return this.encodeLogEntry(i);
        } else {
          return undefined;
        }
      });
      return json;
    } else {
      return undefined;
    }
  }

  encodeMainCharacter(character: Character) {
    return this.encode(
      this.encodeFullCharacterAsJson(character, 'mainCharacter'),
    );
  }

  encodeSoloCharacter(character: Character) {
    return this.encode(
      this.encodeFullCharacterAsJson(character, 'soloCharacter'),
    );
  }

  encodeTypeDetails(character: Character) {
    if (
      character.type === CharacterType.AlliedMilitary &&
      character.typeDetails != null &&
      character.typeDetails instanceof AlliedMilitaryDetails
    ) {
      const typeDetails = character.typeDetails as AlliedMilitaryDetails;
      const details = {
        type: AlliedMilitaryType[typeDetails.alliedMilitary.type],
        typeName: typeDetails.alliedMilitary.name,
        name: typeDetails.name,
      };
      return details;
    } else if (
      character.type === CharacterType.AmbassadorDiplomat &&
      character.typeDetails != null &&
      character.typeDetails instanceof GovernmentDetails
    ) {
      const typeDetails = character.typeDetails as GovernmentDetails;
      const details = {
        type: Polity[typeDetails.government.type],
        typeName: typeDetails.government.name,
        name: typeDetails.name,
      };
      return details;
    } else if (
      character.type === CharacterType.Other &&
      character.typeDetails != null &&
      character.typeDetails instanceof OtherDetails
    ) {
      const typeDetails = character.typeDetails as OtherDetails;
      const details = {
        name: typeDetails.name,
      };
      return details;
    } else {
      return undefined;
    }
  }

  private encodeFullCharacterAsJson(character: Character, stereotype: string) {
    const sheet = {
      stereotype: stereotype,
      type: CharacterType[character.type],
      era: Era[character.era],
      name: character.name,
      version: character.version,
    };

    if (character.description?.length) {
      sheet['description'] = character.description;
    }

    if (character.upbringingStep) {
      const upbringing = {
        id: EarlyOutlook[character.upbringingStep.upbringing?.id],
        accepted: character.upbringingStep.acceptedUpbringing,
      };
      if (character.upbringingStep.focus) {
        upbringing['focus'] = character.upbringingStep.focus;
      }
      if (character.upbringingStep.discipline != null) {
        upbringing['discipline'] =
          Department[character.upbringingStep.discipline];
      }
      if (character.upbringingStep.talent != null) {
        upbringing['talent'] = this.talentToJson(
          character.upbringingStep.talent,
        );
      }
      sheet['upbringing'] = upbringing;
    }

    sheet['typeDetails'] = this.encodeTypeDetails(character);

    if (
      (character.stereotype !== Stereotype.MainCharacter &&
        character.stereotype !== Stereotype.SoloCharacter) ||
      character.legacyMode
    ) {
      sheet['focuses'] = [...character.focuses];
      sheet['attributes'] = this.toAttributeObject(character.attributeValues);
      sheet['disciplines'] = this.getDepartmentByNameObject(
        character.departments,
      );
    }

    if (character.careerStep != null) {
      if (character.careerStep.career != null) {
        sheet['career'] = {
          length: Career[character.careerStep.career],
        };
      }
      if (character.careerStep.value) {
        if (sheet['career'] == null) {
          sheet['career'] = {};
        }
        sheet['career']['value'] = character.careerStep.value;
      }
      if (character.careerStep.talent != null) {
        if (sheet['career'] == null) {
          sheet['career'] = {};
        }
        sheet['career']['talent'] = this.talentToJson(
          character.careerStep.talent,
        );
      }
    }

    if (character.pastime?.length) {
      sheet['pastime'] = [...character.pastime];
    }

    if (character.careerEvents) {
      sheet['careerEvents'] = character.careerEvents.map((c) => {
        const e = { id: c.id };
        if (c.focus) {
          e['focus'] = c.focus;
        }
        if (c.attribute != null) {
          e['attribute'] = Attribute[c.attribute];
        }
        if (c.discipline != null) {
          e['discipline'] = Department[c.discipline];
        }
        if (c.trait != null) {
          e['trait'] = c.trait;
        }
        return e;
      });
    }

    if (character.rankValue) {
      sheet['rank'] = {
        name: character.rankValue?.name,
        id: character.rankValue?.id,
      };
    }

    if (character.speciesStep) {
      sheet['species'] = this.toSpeciesJson(character);
    }

    if (character.educationStep != null) {
      const education = {};
      if (character.educationStep?.track != null) {
        education['track'] = Track[character.educationStep.track];
      }
      if (character.educationStep?.enlisted) {
        education['enlisted'] = character.educationStep.enlisted;
      }
      if (character.educationStep?.focuses.length) {
        education['focuses'] = [...character.educationStep.focuses];
      }
      if (character.educationStep?.primaryDiscipline != null) {
        education['primaryDiscipline'] =
          Department[character.educationStep.primaryDiscipline];
      }
      if (character.educationStep?.attributes != null) {
        education['attributes'] = character.educationStep.attributes
          ?.filter((a) => a != null)
          .map((a) => Attribute[a]);
      }
      if (character.educationStep?.disciplines != null) {
        education['disciplines'] = character.educationStep.disciplines
          ?.filter((d) => d != null)
          .map((d) => Department[d]);
      }
      if (character.educationStep?.decrementDisciplines?.length) {
        education['decrementDisciplines'] =
          character.educationStep.decrementDisciplines
            ?.filter((d) => d != null)
            .map((d) => Department[d]);
      }
      if (character.educationStep?.decrementAttributes?.length) {
        education['decrementAttributes'] =
          character.educationStep.decrementAttributes
            ?.filter((d) => d != null)
            .map((a) => Attribute[a]);
      }
      if (character.educationStep?.value != null) {
        education['value'] = character.educationStep.value;
      }
      if (character.educationStep?.talent != null) {
        education['talent'] = this.talentToJson(character.educationStep.talent);
      }

      sheet['training'] = education;
    }

    const additionalTraits = this.parseTraits(character.additionalTraits);
    if (additionalTraits?.length) {
      sheet['traits'] = additionalTraits;
    }

    if (character.environmentStep != null) {
      const environment = {
        id: Environment[character.environmentStep.environment],
      };
      if (character.environmentStep.otherSpecies != null) {
        environment['otherSpecies'] =
          Species[character.environmentStep.otherSpecies];
      }
      if (character.environmentStep.attribute != null) {
        environment['attribute'] =
          Attribute[character.environmentStep.attribute];
      }
      if (character.environmentStep.discipline != null) {
        environment['discipline'] =
          Department[character.environmentStep.discipline];
      }
      if (character.environmentStep.value != null) {
        environment['value'] = character.environmentStep.value;
      }
      sheet['environment'] = environment;
    }

    if (character.finishingStep != null) {
      sheet['finish'] = {
        attributes: character.finishingStep.attributes.map((a) => Attribute[a]),
        disciplines: character.finishingStep.disciplines.map(
          (d) => Department[d],
        ),
      };
      if (character.finishingStep.value != null) {
        sheet['finish']['value'] = character.finishingStep.value;
      }
      if (character.finishingStep.talent != null) {
        sheet['finish']['talent'] = this.talentToJson(
          character.finishingStep.talent,
        );
      }
    }

    if (character.age != null) {
      sheet['age'] = character.age.name;
    }
    if (character.assignedShip) {
      sheet['assignedShip'] = character.assignedShip;
    }
    if (character.jobAssignment) {
      sheet['jobAssignment'] = character.jobAssignment;
    }
    if (character.pronouns) {
      sheet['pronouns'] = character.pronouns;
    }
    if (character.lineage) {
      sheet['lineage'] = character.lineage;
    }
    if (character.house) {
      sheet['house'] = character.house;
    }
    if (character.role != null) {
      const role = { id: Role[character.role] };
      if (character.secondaryRole != null) {
        role['secondaryId'] = Role[character.secondaryRole];
      }

      sheet['role'] = role;
    }

    sheet['improvements'] = this.encodeImprovements(character);
    sheet['token'] = this.encodeToken(character.token);

    return sheet;
  }

  toSpeciesJson(character: Character) {
    const json = { primary: Species[character.speciesStep.species] };

    if (
      character.speciesStep.customSpeciesName &&
      character.speciesStep.species === Species.Custom
    ) {
      json['customName'] = character.speciesStep.customSpeciesName;
    }

    if (character.speciesStep.mixedSpecies != null) {
      json['mixed'] = Species[character.speciesStep.mixedSpecies];
    }
    if (character.speciesStep.originalSpecies != null) {
      json['original'] = Species[character.speciesStep.originalSpecies];
    }

    if (character.speciesStep.attributes?.length) {
      json['stats'] = character.speciesStep.attributes.map((a) => Attribute[a]);
    }

    if (character.speciesStep.talent) {
      json['talent'] = this.talentToJson(character.speciesStep.talent);
    }

    if (character.speciesStep.abilityOptions) {
      const options = {};
      if (character.speciesStep.abilityOptions.focuses?.length) {
        options['focuses'] = [...character.speciesStep.abilityOptions.focuses];
      }
      if (character.speciesStep.abilityOptions.implants?.length) {
        options['implants'] =
          character.speciesStep.abilityOptions.implants?.map(
            (i) => BorgImplantType[i],
          ) ?? [];
      }
      if (character.speciesStep.abilityOptions.choice != null) {
        options['choice'] =
          SpeciesAbilityChoice[character.speciesStep.abilityOptions.choice];
      }
      json['abilityOptions'] = options;
    }

    if (character.speciesStep.decrementAttributes?.length) {
      json['decrementStats'] = character.speciesStep.decrementAttributes.map(
        (a) => Attribute[a],
      );
    }

    return json;
  }

  toTalentList(talents: SelectedTalent[]) {
    const result = talents.map((t) => this.talentToJson(t));
    return result;
  }

  talentToJson(t: SelectedTalent) {
    const talent = { name: t.talent };

    if (t.isCustom) {
      talent['customTalentName'] = t.customTalentName;
      talent['customTalentDescription'] = t.customTalentDescription;
    }

    if (t.implants?.length > 0) {
      talent['implants'] = t.implants.map((i) => BorgImplantType[i]);
    }
    if (t.focuses?.length > 0) {
      talent['focuses'] = [...t.focuses];
    }
    if (t.value) {
      talent['value'] = t.value;
    }
    if (t.attribute != null) {
      talent['attribute'] = Attribute[t.attribute];
    }
    if (t.department != null) {
      talent['department'] = Department[t.department];
    }
    if (t.system != null) {
      talent['system'] = System[t.system];
    }
    if (t.x != null) {
      talent['x'] = t.x;
    }
    if (t.selection != null) {
      if (t.talent === TALENT_NAME_WARRIORS_SPIRIT) {
        talent['selection'] = SpecialWeapon[t.selection as SpecialWeapon];
      } else if (
        t.talent === TALENT_NAME_DEFENSIVE_TRAINING ||
        t.talent === TALENT_NAME_DEFENSIVE_TRAINING_FED_KLINGON_WAR
      ) {
        talent['selection'] = AttackType[t.selection as AttackType];
      } else if (t.talent === TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM) {
        if (t.selection instanceof OtherSelection) {
          talent['selection'] = {
            type: 'Other',
            name: t.selection?.name,
          };
        } else {
          talent['selection'] =
            PropulsionSystemType[t.selection as PropulsionSystemType];
        }
      }
    }
    if (t.additionalInformation != null) {
      talent['additionalInformation'] = t.additionalInformation;
    }
    if (t.weapon != null) {
      if (t.weapon instanceof Weapon) {
        talent['weapon'] = this.encodeWeapon(t.weapon as Weapon);
      } else {
        talent['weapon'] = t.weapon;
      }
    }
    if (t.multiple != null) {
      talent['multiple'] = t.multiple;
    }
    return talent;
  }

  toAttributeObject(attributes: number[]) {
    const result = {};
    AttributesHelper.getAllAttributes().forEach((a) => {
      result[Attribute[a]] = attributes[a];
    });
    return result;
  }

  getDepartmentByNameObject(departments: number[]) {
    const result = {};
    DepartmentsHelper.instance
      .getDepartments()
      .forEach((d) => (result[Department[d]] = departments[d]));
    return result;
  }

  toDepartmentObject(departments: number[]) {
    const result = {};
    DepartmentsHelper.instance
      .getDepartments()
      .forEach((d) => (result[Department[d]] = departments[d]));
    return result;
  }

  toSystemsObject(systems: number[]) {
    const result = {};
    allSystems().forEach((s) => (result[System[s]] = systems[s]));
    return result;
  }

  parseTraits(traits: string) {
    return traits
      ? traits
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];
  }

  private encodeStarshipStereoType(stereotype: Stereotype) {
    if (stereotype === Stereotype.SimpleStarship) {
      return 'simple';
    } else if (stereotype === Stereotype.SoloStarship) {
      return 'soloStarship';
    } else {
      return 'starship';
    }
  }

  encodeStarship(starship: Starship) {
    const sheet = {
      stereotype: this.encodeStarshipStereoType(starship.stereotype),
      type: CharacterType[starship.type],
      era: Era[starship.era],
      buildType: ShipBuildType[starship.buildType],
      year: starship.serviceYear,
      name: starship.name,
      registry: starship.registry,
      version: starship.version,
      refits: [],
      talents: [],
      traits: this.parseTraits(starship.traits),
    };

    if (starship.additionalTalents?.length) {
      sheet.talents = this.toTalentList(starship.additionalTalents);
    }
    if (starship.spaceframeModel) {
      if (starship.spaceframeModel.isCustom) {
        sheet['spaceframe'] = {
          custom: {
            name: starship.spaceframeModel.name,
            serviceYear: starship.spaceframeModel.serviceYear,
            systems: this.toSystemsObject(starship.spaceframeModel.systems),
            departments: this.toDepartmentObject(
              starship.spaceframeModel.departments,
            ),
            attacks: starship.spaceframeModel.attacks,
            scale: starship.spaceframeModel.scale,
            talents: starship.spaceframeModel.talents
              ? starship.spaceframeModel.talents.map((t) => t.name)
              : [],
          },
        };
        if (starship.spaceframeStep.appearance != null) {
          sheet['spaceframe']['appearance'] =
            SpaceframeAppearance[starship.spaceframeStep.appearance];
        }
      } else {
        sheet['spaceframe'] = {
          name: Spaceframe[starship.spaceframeModel.id],
        };
        if (starship.spaceframeStep.talents?.length) {
          sheet['spaceframe']['talents'] = this.toTalentList(
            starship.spaceframeStep.talents,
          );
        }
        if (starship.spaceframeStep.variant !== undefined) {
          sheet['spaceframe']['variant'] =
            SpaceframeVariant[starship.spaceframeStep.variant];
        }
      }
    }
    if (starship.missionProfileStep?.type) {
      const temp = {
        name: MissionProfile[starship.missionProfileStep?.type?.id],
      };
      if (starship.missionProfileStep.system != null) {
        temp['system'] = System[starship.missionProfileStep.system];
      }
      if (starship.missionProfileStep?.talent) {
        temp['talent'] = this.talentToJson(starship.missionProfileStep.talent);
      }
      sheet['missionProfile'] = temp;
    }
    if (starship.missionPodModel) {
      sheet['missionPod'] = {
        name: MissionPod[starship.missionPodModel.id],
      };
      if (starship.missionPodReplacements?.length) {
        sheet['missionPod']['replacements'] =
          starship.missionPodReplacements.map((r) =>
            r == null ? null : this.talentToJson(r),
          );
      }
    }
    if (starship.serviceRecordStep) {
      sheet['serviceRecord'] = {
        type: ServiceRecord[starship.serviceRecordStep.type.type],
      };
      if (starship.serviceRecordStep.selection?.length) {
        sheet['serviceRecord']['selection'] =
          starship.serviceRecordStep.selection;
      }
      if (starship.serviceRecordStep.system != null) {
        sheet['serviceRecord']['system'] =
          System[starship.serviceRecordStep.system];
      }
      if (starship.serviceRecordStep.removedTalent != null) {
        sheet['serviceRecord']['removedTalent'] =
          starship.serviceRecordStep.removedTalent;
      }
      if (starship.serviceRecordStep.selectedTalent != null) {
        sheet['serviceRecord']['selectedTalent'] = this.talentToJson(
          starship.serviceRecordStep.selectedTalent,
        );
      }
    }
    if (starship.refits != null) {
      starship.refits.forEach((s) => sheet.refits.push(System[s]));
    }
    if (starship.simpleStats != null) {
      sheet['simpleStats'] = {
        systems: [...starship.simpleStats.systems],
        departments: [...starship.simpleStats.departments],
        className: starship.simpleStats.className,
        scale: starship.simpleStats.scale,
      };
      if (starship.simpleStats.appearance != null) {
        sheet['simpleStats']['appearance'] =
          SpaceframeAppearance[starship.simpleStats.appearance];
      }
    }
    if (starship.additionalWeapons.length > 0) {
      sheet['additionalWeapons'] = starship.additionalWeapons.map((w) =>
        this.encodeWeapon(w),
      );
    }

    sheet['improvements'] = this.encodeStarshipImprovements(starship);
    return this.encode(sheet);
  }

  private encodeWeapon(w: Weapon) {
    if (w.usageCategory === UsageCategory.Character) {
      return {
        usageCategory:
          w.usageCategory == null ? null : UsageCategory[w.usageCategory],
        type: w.type == null ? null : WeaponType[w.type],
        name: w.name,
        baseDice: w.baseDice,
        loadType: this.convertLoadType(w.loadType),
        deliverySystem:
          w.deliveryType == null ? null : DeliverySystem[w.deliveryType.type],
      };
    } else {
      return {
        usageCategory:
          w.usageCategory == null ? null : UsageCategory[w.usageCategory],
        type: w.type == null ? null : WeaponType[w.type],
        baseDice: w.baseDice,
        loadType: this.convertLoadType(w.loadType),
        deliverySystem:
          w.deliveryType == null ? null : DeliverySystem[w.deliveryType.type],
      };
    }
  }

  private convertLoadType(
    loadType:
      | EnergyLoadTypeModel
      | TorpedoLoadTypeModel
      | CaptureTypeModel
      | MineTypeModel,
  ) {
    if (loadType == null) {
      return null;
    } else if (loadType instanceof EnergyLoadTypeModel) {
      const temp = loadType as EnergyLoadTypeModel;
      return EnergyLoadType[temp.type];
    } else if (loadType instanceof TorpedoLoadTypeModel) {
      const temp = loadType as TorpedoLoadTypeModel;
      return TorpedoLoadType[temp.type];
    } else if (loadType instanceof CaptureTypeModel) {
      const temp = loadType as CaptureTypeModel;
      return CaptureType[temp.type];
    } else if (loadType instanceof MineTypeModel) {
      const temp = loadType as MineTypeModel;
      return MineType[temp.type];
    } else {
      return null;
    }
  }

  encode(json: unknown) {
    const text = JSON.stringify(json);
    const encoded = pako.deflate(new TextEncoder().encode(text));
    const result = Base64.fromUint8Array(encoded, true);
    return result;
  }

  decode(s: string) {
    if (s) {
      try {
        const encoded = Base64.toUint8Array(s);
        const text = new TextDecoder().decode(pako.inflate(encoded));
        return JSON.parse(text);
      } catch (e) {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  decodeAsset(s: string): Asset {
    const json = this.decode(s);
    let type = null;
    [AssetType.Character, AssetType.Ship, AssetType.Resource].forEach((a) => {
      if (AssetType[a] === json.type) {
        type = a;
      }
    });
    const name = json.name;
    const stats = [null, null, null, null, null];
    if (json.stats) {
      allAssetStatTypes().forEach((a) => {
        const statName = AssetStatType[a];
        const s = json.stats[statName];
        if (s === '-') {
          stats[a] = new AssetStat();
        } else if (s?.length && s?.indexOf('/') >= 0) {
          const base = Number(s.substring(0, s.indexOf('/')));
          const critical = Number(s.substring(s.indexOf('/') + 1));

          stats[a] = new AssetStat(base, critical);
        }
      });
    }

    let additionalInformation: Spaceframe | Rank | undefined = undefined;
    let ability = undefined;
    if (json['additionalInformation']) {
      if (type === AssetType.Ship) {
        additionalInformation = SpaceframeHelper.instance().getSpaceframeByName(
          json['additionalInformation'],
        )?.id;
      } else if (type === AssetType.Character) {
        additionalInformation = RanksHelper.instance().getRankByRankName(
          json['additionalInformation'],
        );
      }
    }

    if (json['ability']) {
      const temp = json['ability'];
      ability = new AssetAbility(temp['title'], temp['description']);
    }

    return new Asset(type, name, stats, additionalInformation, ability);
  }

  decodeStation(json: any): Station {
    const result = new Station();
    if (json.version) {
      result.version = json.version;
    }
    if (json.type) {
      result.type = CharacterTypeModel.getCharacterTypeByTypeName(
        json.type,
      )?.type;
    }
    result.name = json.name;

    if (json['missionProfile']) {
      const profile = MissionProfiles.instance.getStationMissionProfileByName(
        json['missionProfile']['name'],
      );
      if (profile != null) {
        result.missionProfileStep = new StationMissionProfileStep(profile.id);

        if (json['missionProfile']['talent']) {
          result.missionProfileStep.talent = this.hydrateTalent(
            json['missionProfile']['talent'],
            result.version,
          );
        }
      }
    }

    if (json['frame']) {
      const frame: any = json['frame'];
      if (frame['type'] === 'Custom') {
        const step = new CustomStationSpaceframeStep();
        allSystems().forEach(
          (s) => (step.systems[s] = frame.systems[System[s]]),
        );
        DepartmentsHelper.instance
          .getDepartments()
          .forEach(
            (d) => (step.departments[d] = frame.departments[Department[d]]),
          );
        step.scale = frame.scale;
        if (frame['appearance'] != null) {
          StationFrameAppearanceModel.getAllAppearanceModels().forEach((m) => {
            if (StationFrameAppearance[m.id] === frame['appearance']) {
              step.appearance = m.id;
            }
          });
        }
        result.stationFrameStep = step;
      } else {
        const type = frame['type'];
        const profile = StationFrameModel.getByIdName(type);
        if (profile) {
          result.stationFrameStep = new StandardStationSpaceframeStep(
            profile.id,
          );
        }
      }
    }

    if (json['traits']) {
      result.traits = [...json['traits']];
    }

    if (json.weapons) {
      result.weapons = json.weapons.map((j) =>
        this.decodeWeapon(j, result.version),
      );
    }

    if (json['talents']) {
      result.additionalTalents = json.talents.map((t) =>
        this.hydrateTalent(t, result.version),
      );
    }

    return result;
  }

  decodeStarship(s: string) {
    const json = this.decode(s);
    const result = new Starship();
    if (json.version) {
      result.version = json.version;
    }
    result.name = json.name;
    if (json.stereotype === 'soloStarship') {
      result.stereotype = Stereotype.SoloStarship;
    } else if (json.stereotype === 'simple') {
      result.stereotype = Stereotype.SimpleStarship;
    }
    if (json.era) {
      const era = Eras.instance.getEraByName(json.era);
      if (era != null) {
        result.era = era;
      }
    }
    result.registry = json.registry;
    result.traits = json.traits;
    result.serviceYear = json.year;
    CharacterTypeModel.getAllTypes().forEach((t) => {
      if (CharacterType[t.type] === json.type) {
        result.type = t.type;
      }
    });
    ShipBuildTypeModel.allTypes().forEach((t) => {
      if (ShipBuildType[t.type] === json.buildType) {
        result.buildType = t.type;
      }
    });
    if (json.spaceframe) {
      if (json.spaceframe.custom) {
        const frame = SpaceframeModel.createCustomSpaceframe(
          result.type,
          json.spaceframe.custom.serviceYear,
        );
        frame.name = json.spaceframe.custom.name;
        frame.scale = json.spaceframe.custom.scale;
        frame.attacks = json.spaceframe.custom.attacks;
        DepartmentsHelper.instance
          .getDepartments()
          .forEach(
            (d) =>
              (frame.departments[d] =
                json.spaceframe.custom.departments[Department[d]]),
          );
        allSystems().forEach(
          (s) => (frame.systems[s] = json.spaceframe.custom.systems[System[s]]),
        );
        frame.talents = [];

        if (json.spaceframe.custom.talents) {
          json.spaceframe.custom.talents.forEach((t) => {
            const model = new SelectedTalent(t);
            if (model) {
              frame.talents.push(model);
            }
          });
        }
        result.spaceframeStep = new SpaceframeStep(frame);
        if (json.spaceframe.appearance != null) {
          result.spaceframeStep.appearance =
            SpaceframeAppearanceModel.appearanceCodeByName(
              json.spaceframe.appearance,
            );
        }
      } else {
        result.spaceframeStep = new SpaceframeStep(
          SpaceframeHelper.instance().getSpaceframeByName(json.spaceframe.name),
        );
        if (json.spaceframe.talents) {
          json.spaceframe.talents.forEach((t) => {
            const talent = this.hydrateTalent(t, result.version);
            if (talent != null) {
              result.spaceframeStep.talents.push(talent);
            }
          });
        }
        if (json.spaceframe.variant) {
          result.spaceframeStep.variant =
            SpaceframeVariantModel.variantCodeByName(json.spaceframe.variant);
        }
      }
    }
    if (json.missionProfile && result.type != null) {
      const missionProfileModel =
        MissionProfiles.instance.getMissionProfileByName(
          json.missionProfile.name,
          result.type,
          result.version,
        );
      if (missionProfileModel != null) {
        result.missionProfileStep = new MissionProfileStep(missionProfileModel);
        if (json.missionProfile.system != null) {
          result.missionProfileStep.system = systemByName(
            json.missionProfile.system,
          );
        }
      }

      if (json.missionProfile.talent) {
        const talent = this.hydrateTalent(
          json.missionProfile.talent,
          result.version,
        );
        if (talent) {
          result.missionProfileStep.talent = talent;
        }
      }
    }
    if (json.missionPod) {
      result.missionPodModel = MissionPodHelper.instance().getMissionPodByName(
        json.missionPod.name,
        result.version,
      );
      if (json.missionPod.replacements?.length) {
        result.missionPodReplacements = json.missionPod.replacements.map((t) =>
          t == null ? undefined : this.hydrateTalent(t, result.version),
        );
      }
    }
    if (json.serviceRecord) {
      const types = allServiceRecords().filter(
        (t) => ServiceRecord[t] === json.serviceRecord.type,
      );
      if (types.length === 1) {
        const serviceRecord = ServiceRecordList.instance.getByType(types[0]);
        result.serviceRecordStep = new ServiceRecordStep(serviceRecord);
        result.serviceRecordStep.specialRule = TalentsHelper.getTalent(
          serviceRecord.specialRule,
        );
        if (json.serviceRecord.selection) {
          result.serviceRecordStep.selection = json.serviceRecord.selection;
        }
        if (json.serviceRecord.system) {
          result.serviceRecordStep.system = systemByName(
            json.serviceRecord.system,
          );
        }
        if (json.serviceRecord.removedTalent) {
          result.serviceRecordStep.removedTalent =
            json.serviceRecord.removedTalent;
        }
        if (json.serviceRecord.selectedTalent) {
          result.serviceRecordStep.selectedTalent = this.hydrateTalent(
            json.serviceRecord.selectedTalent,
            result.version,
          );
        }
      }
    }
    if (json.traits) {
      result.traits = json.traits.join(', ');
    }
    if (json.refits) {
      json.refits.forEach((r) => {
        allSystems().forEach((s) => {
          if (System[s] === r) {
            result.refits.push(s);
          }
        });
      });
    }

    if (json.talents) {
      json.talents.forEach((t) => {
        result.additionalTalents.push(this.hydrateTalent(t, result.version));
      });
    }

    if (json.simpleStats) {
      result.simpleStats = new SimpleStats();
      result.simpleStats.scale = json.simpleStats.scale;
      result.simpleStats.className = json.simpleStats.className;
      result.simpleStats.systems = [...json.simpleStats.systems];
      result.simpleStats.departments = [...json.simpleStats.departments];
      if (json.simpleStats.appearance != null) {
        result.simpleStats.appearance =
          SpaceframeAppearanceModel.appearanceCodeByName(
            json.simpleStats.appearance,
          );
      }
    }

    if (json.additionalWeapons) {
      result.additionalWeapons = json.additionalWeapons.map((j) =>
        this.decodeWeapon(j, result.version),
      );
    }

    if (json.talentDetails) {
      json.talentDetails.forEach((detail) => {
        const w = detail.weapon;
        const weapon = this.decodeWeapon(w, result.version);

        const talent = result.additionalTalents.filter(
          (t) => t.name === TALENT_NAME_EXPANDED_MUNITIONS && t.weapon == null,
        );
        if (talent?.length) {
          talent[0].weapon = weapon;
        }
      });
    }
    if (json.improvements?.length) {
      result.advancementSteps =
        this.decodeStarshipImprovement(json.improvements, result.version) ?? [];
    }
    return result;
  }

  private decodeWeapon(json, version: number) {
    let usageCategory = null;
    [UsageCategory.Character, UsageCategory.Starship].forEach((c) => {
      if (UsageCategory[c] === json['usageCategory']) usageCategory = c;
    });

    const name = json['name'];
    const baseDice = json['baseDice'];

    let weaponType = null;
    [
      WeaponType.MELEE,
      WeaponType.ENERGY,
      WeaponType.TORPEDO,
      WeaponType.MINE,
      WeaponType.CAPTURE,
    ].forEach((t) => {
      if (WeaponType[t] === json['type']) {
        weaponType = t;
      }
    });

    let deliverySystem = null;
    DeliverySystemModel.allTypes().forEach((d) => {
      if (DeliverySystem[d.type] === json['deliverySystem']) {
        deliverySystem = d;
      }
    });

    let loadType = null;
    if (weaponType === WeaponType.ENERGY) {
      EnergyLoadTypeModel.allTypes(version).forEach((l) => {
        if (EnergyLoadType[l.type] === json['loadType']) {
          loadType = l;
        }
      });
    } else if (weaponType === WeaponType.TORPEDO) {
      TorpedoLoadTypeModel.allTypes(version).forEach((l) => {
        if (TorpedoLoadType[l.type] === json['loadType']) {
          loadType = l;
        }
      });
    } else if (weaponType === WeaponType.CAPTURE) {
      CaptureTypeModel.allTypes().forEach((l) => {
        if (CaptureType[l.type] === json['loadType']) {
          loadType = l;
        }
      });
    } else if (weaponType === WeaponType.MINE) {
      MineTypeModel.allTypes(version).forEach((l) => {
        if (MineType[l.type] === json['loadType']) {
          loadType = l;
        }
      });
    }

    return new Weapon(
      usageCategory,
      name,
      baseDice,
      weaponType,
      loadType,
      deliverySystem,
    );
  }

  decodeCreature(json: any) {
    const result = new Creature();
    result.stereotype = Stereotype.Creature;
    if (json.name?.length) {
      result.name = json.name;
    }

    if (json.description?.length) {
      result.description = json.description;
    }

    if (json.era) {
      const era = Eras.instance.getEraByName(json.era);
      if (era != null) {
        result.era = era;
      }
    }
    if (json.version) {
      result.version = json.version;
    }

    if (json.habitat) {
      result.habitat = HabitatHelper.instance.getTypeByIdName(json.habitat);
    }

    if (json.creatureType) {
      result.creatureType = CreatureTypeHelper.instance.getTypeByIdName(
        json.creatureType,
      );
    }

    if (json.diet) {
      result.diet = DietTypeHelper.instance.getTypeByIdName(json.diet);
    }

    if (json.size) {
      result.size = CreatureSizeHelper.instance.getTypeByIdName(json.size);
    }

    if (json.naturalAttack) {
      result.naturalAttacks = NaturalAttacksHelper.instance.getTypeByIdName(
        json.naturalAttack,
      );
    }

    if (json.locomotion) {
      result.locomotion = json.locomotion.map((l) => {
        const type = LocomotionTypeHelper.instance.getTypeByIdName(l.type);
        let count = undefined;
        if (l.count != null) {
          count = l.count;
        }
        return new LocomotionModel(type, count);
      });
    }

    if (json.talents) {
      json.talents.forEach((t) => {
        const talent = this.hydrateTalent(t, result.version);
        if (talent != null) {
          result.additionalTalents.push(talent);
        }
      });
    }

    if (json.form) {
      result.form = json.form;
    }

    if (json.departments) {
      DepartmentsHelper.instance
        .getDepartments()
        .forEach(
          (s) => (result.departments[s] = json.departments[Department[s]]),
        );
    }

    if (json.attributes) {
      AttributesHelper.getAllAttributes().forEach(
        (s) => (result.attributes[s] = json.attributes[Attribute[s]]),
      );
    }

    if (json.traits?.length) {
      result.additionalTraits = [...json.traits];
    }

    return result;
  }

  decodeCharacter(json: any) {
    const result = new Character();
    if (json['stereotype'] === 'npc') {
      result.stereotype = Stereotype.Npc;
    } else if (json['stereotype'] === 'supportingCharacter') {
      result.stereotype = Stereotype.SupportingCharacter;
    } else if (json['stereotype'] === 'soloCharacter') {
      result.stereotype = Stereotype.SoloCharacter;
    }
    const type = CharacterTypeModel.getCharacterTypeByTypeName(json.type);
    if (type) {
      result.type = type.type;
    }
    if (json.era) {
      const era = Eras.instance.getEraByName(json.era);
      if (era != null) {
        result.era = era;
      }
    }
    result.name = json.name;
    result.additionalTraits = json.traits ? json.traits.join(', ') : '';
    const rank = json.rank;
    if (rank) {
      if (typeof rank === 'string') {
        result.rankValue = new CharacterRank(rank as string);
      } else if (rank.name) {
        result.rankValue = new CharacterRank(rank.name, rank.id);
      }
    }
    if (json.version) {
      result.version = json.version;
    }
    if (json.typeDetails) {
      if (result.type === CharacterType.AlliedMilitary) {
        const name = json.typeDetails.name;
        const typeName = json.typeDetails.typeName;
        const type = AllyHelper.instance.findTypeByName(json.typeDetails.type);

        let alliedMilitary = AllyHelper.instance.findOption(type);
        if (alliedMilitary == null) {
          alliedMilitary = new AlliedMilitary(typeName, type, []);
        }
        result.typeDetails = new AlliedMilitaryDetails(alliedMilitary, name);
      } else if (result.type === CharacterType.AmbassadorDiplomat) {
        const name = json.typeDetails.name;
        const typeName = json.typeDetails.typeName;
        const type = Governments.findTypeByName(json.typeDetails.type);

        let government = Governments.findOption(type);
        if (government == null) {
          government = new Government(typeName, type);
        }
        result.typeDetails = new GovernmentDetails(government, name);
      } else if (result.type === CharacterType.Other) {
        const name = json.typeDetails.name;
        result.typeDetails = new OtherDetails(name);
      }
    }

    if (json.role != null) {
      const role = json.role;
      if (typeof role === 'string') {
        const roleType = RolesHelper.instance.getRoleByName(role);
        if (roleType != null) {
          result.role = roleType;
        } else {
          result.jobAssignment = role;
        }
      } else {
        const roleId = role['id'];
        if (roleId != null) {
          const r = RolesHelper.instance.getRoleByTypeName(roleId, result.type);
          if (r != null) {
            result.role = r;
          }
        }
        if (role['secondaryId'] != null) {
          const secondaryId = role['secondaryId'];
          const r = RolesHelper.instance.getRoleByTypeName(
            secondaryId,
            result.type,
          );
          if (r) {
            result.secondaryRole = r;
          }
        }
      }
    }
    result.jobAssignment = json.jobAssignment;
    result.assignedShip = json.assignedShip;
    result.pronouns = json.pronouns;
    if (json.careerEvents) {
      result.careerEvents = json.careerEvents.map((e) => {
        if (typeof e === 'number') {
          return new CareerEventStep(e);
        } else {
          const step = new CareerEventStep(e['id']);
          if (e['attribute']) {
            step.attribute = AttributesHelper.getAttributeByName(
              e['attribute'],
            );
          }
          if (e['discipline']) {
            step.discipline = DepartmentsHelper.instance.getDepartmentByName(
              e['discipline'],
            );
          }
          if (e['focus']) {
            step.focus = e['focus'];
          }
          if (e['trait']) {
            step.trait = e['trait'];
          }

          return step;
        }
      });
    }
    if (json.lineage) {
      result.lineage = json.lineage;
    }
    if (json.house) {
      result.house = json.house;
    }
    if (json.pastime) {
      result.pastime = [...json.pastime];
    }
    if (json.age) {
      const age = AgeHelper.getAge(json.age);
      if (age) {
        result.age = age;
      }
    }
    if (json.species != null) {
      if (typeof json.species === 'string') {
        // backward compatibility
        const speciesCode = SpeciesHelper.getSpeciesTypeByName(json.species);

        const species = SpeciesHelper.getSpeciesByType(speciesCode);
        if (species != null) {
          result.speciesStep = new SpeciesStep(speciesCode);

          if (result.version > 1) {
            result.speciesStep.ability =
              SpeciesAbilityList.instance.getBySpecies(speciesCode);
          }

          if (json.mixedSpecies != null) {
            const speciesCode = SpeciesHelper.getSpeciesTypeByName(
              json.mixedSpecies,
            );
            if (speciesCode != null) {
              result.speciesStep.mixedSpecies = speciesCode;
            }
          }
          if (json.originalSpecies != null) {
            const speciesCode = SpeciesHelper.getSpeciesTypeByName(
              json.originalSpecies,
            );
            if (speciesCode != null) {
              result.speciesStep.originalSpecies = speciesCode;
            }
          }
        }
      } else {
        const speciesBlock = json.species;
        if (speciesBlock.primary != null) {
          const speciesCode = SpeciesHelper.getSpeciesTypeByName(
            speciesBlock.primary,
          );

          if (speciesCode === Species.Custom) {
            result.speciesStep = new SpeciesStep(speciesCode);
            if (speciesBlock.customName) {
              result.speciesStep.customSpeciesName = speciesBlock.customName;
            }
          } else {
            const species = SpeciesHelper.getSpeciesByType(speciesCode);

            if (species != null) {
              result.speciesStep = new SpeciesStep(speciesCode);
              result.addTrait(species.trait);

              if (result.version > 1) {
                const ability =
                  SpeciesAbilityList.instance.getBySpecies(speciesCode);
                // if the character has a talent, it might have been created before the
                // new species abilities were available
                if (
                  speciesBlock.talent == null ||
                  ability?.isValidTalentSelection(speciesBlock.talent)
                ) {
                  result.speciesStep.ability = ability;
                }
              }
            }
          }

          if (speciesBlock.mixed != null) {
            const speciesCode = SpeciesHelper.getSpeciesTypeByName(
              speciesBlock.mixed,
            );
            if (speciesCode != null) {
              result.speciesStep.mixedSpecies = speciesCode;
            }
          }
          if (speciesBlock.original != null) {
            const speciesCode = SpeciesHelper.getSpeciesTypeByName(
              speciesBlock.original,
            );
            if (speciesCode != null) {
              result.speciesStep.originalSpecies = speciesCode;
            }
          }
          if (speciesBlock.stats != null) {
            result.speciesStep.attributes = speciesBlock.stats.map((s) =>
              AttributesHelper.getAttributeByName(s),
            );
          }
          if (speciesBlock.decrementStats != null) {
            result.speciesStep.decrementAttributes =
              speciesBlock.decrementStats.map((s) =>
                AttributesHelper.getAttributeByName(s),
              );
          }
          if (speciesBlock.talent != null) {
            result.speciesStep.talent = this.hydrateTalent(
              speciesBlock.talent,
              result.version,
            );
          }

          if (speciesBlock.abilityOptions != null) {
            result.speciesStep.abilityOptions = new SpeciesAbilityOptions();
            if (speciesBlock.abilityOptions.focuses) {
              result.speciesStep.abilityOptions.focuses = [
                ...speciesBlock.abilityOptions.focuses,
              ];
            }
            if (speciesBlock.abilityOptions.implants) {
              result.speciesStep.abilityOptions.implants =
                speciesBlock.abilityOptions.implants
                  .map(
                    (i) => BorgImplants.instance.getImplantByTypeName(i)?.type,
                  )
                  .filter((i) => i != null);
            }
            if (speciesBlock.abilityOptions.choice != null) {
              const choices = Object.keys(SpeciesAbilityChoice)
                .filter((item) => {
                  return !isNaN(Number(item));
                })
                .map((item) => Number(item));
              choices.forEach((c) => {
                if (
                  SpeciesAbilityChoice[c] === speciesBlock.abilityOptions.choice
                ) {
                  result.speciesStep.abilityOptions.choice = c;
                }
              });
            }
          }
        }
      }
    }
    if (json.career) {
      const temp = json.career;
      if (typeof temp === 'string') {
        const career = CareersHelper.instance.getCareerByTypeName(
          temp,
          result.type,
          result.version,
        );
        if (result.careerStep != null) {
          result.careerStep.career = career?.id;
        } else {
          result.careerStep = new CareerStep(career?.id);
        }
      } else {
        const length = temp.length;
        if (length != null) {
          const career = CareersHelper.instance.getCareerByTypeName(
            length,
            result.type,
            result.version,
          );
          if (result.careerStep != null) {
            result.careerStep.career = career?.id;
          } else {
            result.careerStep = new CareerStep(career?.id);
          }
        } else if (result.careerStep == null) {
          result.careerStep = new CareerStep();
        }

        if (temp.value != null) {
          result.careerStep.value = temp.value;
        }
        if (temp.talent != null) {
          result.careerStep.talent = this.hydrateTalent(
            temp.talent,
            result.version,
          );
        }
      }
    }
    if (json.training != null) {
      const trackAsString = json.training.track;
      const tracks = getAllTracks().filter((t) => Track[t] === trackAsString);

      result.educationStep = new EducationStep(
        tracks.length ? tracks[0] : undefined,
        json.training.enlisted || false,
      );
      if (json.training.focuses != null) {
        result.educationStep.focuses = [...json.training.focuses];
      }
      if (json.training.attributes) {
        result.educationStep.attributes = json.training.attributes.map((a) =>
          AttributesHelper.getAttributeByName(a),
        );
      }
      if (json.training.disciplines) {
        result.educationStep.disciplines = json.training.disciplines.map((d) =>
          DepartmentsHelper.instance.getDepartmentByName(d),
        );
      }
      if (json.training.decrementDisciplines) {
        result.educationStep.decrementDisciplines =
          json.training.decrementDisciplines.map((d) =>
            DepartmentsHelper.instance.getDepartmentByName(d),
          );
      }
      if (json.training.decrementAttributes) {
        result.educationStep.decrementAttributes =
          json.training.decrementAttributes.map((a) =>
            AttributesHelper.getAttributeByName(a),
          );
      }
      if (json.training.primaryDiscipline != null) {
        result.educationStep.primaryDiscipline =
          DepartmentsHelper.instance.getDepartmentByName(
            json.training.primaryDiscipline,
          );
      }
      if (json.training.value != null) {
        result.educationStep.value = json.training.value;
      }
      if (json.training.talent != null) {
        const talent = this.hydrateTalent(json.training.talent, result.version);
        if (talent != null) {
          result.educationStep.talent = talent;
        }
      }
    } else {
      const rank =
        result.rankValue == null
          ? null
          : RanksHelper.instance().getRankByName(result.rankValue?.name);
      if (rank && result.stereotype === Stereotype.Npc) {
        if (result.npcGenerationStep == null) {
          result.npcGenerationStep = new NpcGenerationStep();
        }
        result.npcGenerationStep.enlisted = rank.isEnlisted;
      }
    }
    if (json.focuses) {
      const focuses = [...json.focuses];
      if (result.stereotype === Stereotype.MainCharacter) {
        result.legacyMode = true;
        result.focusValues = focuses;
      } else if (result.stereotype === Stereotype.SupportingCharacter) {
        if (result.supportingStep == null) {
          result.supportingStep = new SupportingStep();
        }
        result.supportingStep.focuses = focuses;
      } else if (result.stereotype === Stereotype.Npc) {
        if (result.npcGenerationStep == null) {
          result.npcGenerationStep = new NpcGenerationStep();
        }
        result.npcGenerationStep.focuses = focuses;
      }
    }
    if (json.attributes) {
      AttributesHelper.getAllAttributes().forEach((a) => {
        const value = json.attributes[Attribute[a]];
        if (value != null) {
          result.attributeValues[a] = value;
        }
      });
    }
    if (json.disciplines) {
      if (result.stereotype === Stereotype.Npc) {
        if (result.npcGenerationStep == null) {
          result.npcGenerationStep = new NpcGenerationStep();
        }
        DepartmentsHelper.instance
          .getDepartments()
          .forEach(
            (d) =>
              (result.npcGenerationStep.departments[d] =
                json.disciplines[Department[d]]),
          );
      } else {
        DepartmentsHelper.instance
          .getDepartments()
          .forEach((d) => (result.skills[d] = json.disciplines[Department[d]]));
      }
    }
    if (json.environment) {
      const environment = EnvironmentsHelper.getEnvironmentByTypeName(
        json.environment.id,
        result.type,
        result.version,
      );
      if (environment) {
        if (environment.id === Environment.AnotherSpeciesWorld) {
          if (json.environment.otherSpeciesWorld) {
            result.environmentStep = new EnvironmentStep(
              environment.id,
              SpeciesHelper.getSpeciesByName(
                json.environment.otherSpeciesWorld,
              ),
            );
          } else if (json.environment.otherSpecies) {
            result.environmentStep = new EnvironmentStep(
              environment.id,
              SpeciesHelper.getSpeciesTypeByName(json.environment.otherSpecies),
            );
          } else {
            result.environmentStep = new EnvironmentStep(environment.id);
          }
        } else {
          result.environmentStep = new EnvironmentStep(environment.id);
        }
        if (json.environment.attribute) {
          result.environmentStep.attribute =
            AttributesHelper.getAttributeByName(json.environment.attribute);
        }
        if (json.environment.discipline) {
          result.environmentStep.discipline =
            DepartmentsHelper.instance.getDepartmentByName(
              json.environment.discipline,
            );
        }
        if (json.environment.value) {
          result.environmentStep.value = json.environment.value;
        }
      }
    }

    if (json.upbringing) {
      const upbringing = UpbringingsHelper.getUpbringingByTypeName(
        json.upbringing.id,
        result.type,
      );
      const step = new UpbringingStep(upbringing, json.upbringing.accepted);
      if (json.upbringing.focus) {
        step.focus = json.upbringing.focus;
      }
      result.upbringingStep = step;

      if (json.upbringing.focus) {
        result.upbringingStep.focus = json.upbringing.focus;
      }
      if (json.upbringing.discipline != null) {
        result.upbringingStep.discipline =
          DepartmentsHelper.instance.getDepartmentByName(
            json.upbringing.discipline,
          );
      }
      if (json.upbringing.talent != null) {
        result.upbringingStep.talent = this.hydrateTalent(
          json.upbringing.talent,
          result.version,
        );
      }
    }

    if (json.finish) {
      result.finishingStep = new FinishingStep();
      if (json.finish.attributes) {
        result.finishingStep.attributes = json.finish.attributes.map((a) =>
          AttributesHelper.getAttributeByName(a),
        );
      }
      if (json.finish.disciplines) {
        result.finishingStep.disciplines = json.finish.disciplines.map((d) =>
          DepartmentsHelper.instance.getDepartmentByName(d),
        );
      }
      if (json.finish.value) {
        result.finishingStep.value = json.finish.value;
      }
      if (json.finish.talent != null) {
        result.finishingStep.talent = this.hydrateTalent(
          json.finish.talent,
          result.version,
        );
      }
    }

    if (json.talents) {
      json.talents.forEach((t) => {
        const talent = this.hydrateTalent(t, result.version);
        if (talent != null) {
          result.addTalent(talent);
        }
      });
    }
    if (json.npc) {
      if (result.npcGenerationStep == null) {
        result.npcGenerationStep = new NpcGenerationStep();
      }
      if (json.npc.values) {
        result.npcGenerationStep.values = [...json.npc.values];
      }
      if (json.npc.talents) {
        result.npcGenerationStep.talents = json.npc.talents.map((t) =>
          this.hydrateTalent(t, result.version),
        );
      }
      if (json.npc.specialization) {
        if (json.npc.specialization === 'OrionPirate') {
          result.npcGenerationStep.specialization = Specialization.Pirate;
        } else {
          allSpecializations().forEach((s) => {
            if (Specialization[s] === json.npc.specialization) {
              result.npcGenerationStep.specialization = s;
            }
          });
        }
      }
      if (json.npc.type) {
        result.npcGenerationStep.type = NpcTypes.getNpcTypeByName(
          json.npc.type,
        );
      }
      if (json.npc.focuses) {
        result.npcGenerationStep.focuses = [...json.npc.focuses];
      }
      if (json.npc.departments) {
        DepartmentsHelper.instance
          .getDepartments()
          .forEach(
            (d) =>
              (result.npcGenerationStep.departments[d] =
                json.npc.departments[Department[d]]),
          );
      }
      if (json.npc.attributes) {
        AttributesHelper.getAllAttributes().forEach(
          (a) =>
            (result.npcGenerationStep.attributes[a] =
              json.npc.attributes[Attribute[a]]),
        );
      }
      if (json.npc.equipment) {
        result.npcGenerationStep.equipment = json.npc.equipment.map((e) => {
          if (typeof e === 'string') {
            const result = EquipmentHelper.instance.findByTypeName(e);
            return result?.type;
          } else {
            const name = e.name;
            return new EquipmentModel(EquipmentType.Other, name);
          }
        });
      }
      if (json.npc.weapons) {
        PersonalWeapons.instance(result.version)
          .allTypes()
          .forEach((w) => {
            if (json.npc.weapons.includes(PersonalWeaponType[w])) {
              result.npcGenerationStep.weapons.push(w);
            }
          });
      }
    }
    if (
      json.supporting &&
      result.stereotype === Stereotype.SupportingCharacter
    ) {
      if (result.supportingStep == null) {
        result.supportingStep = new SupportingStep();
      }
      if (json.supporting.focuses) {
        result.supportingStep.focuses = [...json.supporting.focuses];
      }
      if (json.supporting.attributes) {
        result.supportingStep.attributes = [
          ...json.supporting.attributes.map((a) =>
            AttributesHelper.getAttributeByName(a),
          ),
        ];
      }
      if (json.supporting.disciplines) {
        result.supportingStep.disciplines = [
          ...json.supporting.disciplines.map((d) =>
            DepartmentsHelper.instance.getDepartmentByName(d),
          ),
        ];
      }
      if (json.supporting.value?.length) {
        result.supportingStep.value = json.supporting.value;
      }
      if (json.supporting.supervisory) {
        result.supportingStep.supervisory =
          json.supporting.supervisory === true;
      }
    }

    // backward compatibility
    if (json.implants) {
      const talent = result.getTalentByName(TALENT_NAME_BORG_IMPLANTS);
      talent.implants = json.implants
        .map((i) => BorgImplants.instance.getImplantByTypeName(i)?.type)
        .filter((i) => i != null);
    }

    if (json.values) {
      json.values.forEach((v) => {
        result.addValue(v);
      });
    }

    if (json.improvements?.length) {
      result.improvements = this.decodeImprovements(
        json.improvements,
        result.version,
      );
    }

    if (json.description?.length) {
      result.description = json.description;
    }

    if (json.token) {
      result.token = this.decodeToken(json.token);
    }

    return result;
  }

  decodeStarshipImprovement(json: any, version: number) {
    if (json) {
      return Object.values(json)
        .map((j) => {
          if (j['type'] === 'advancement') {
            const improvement = new StarshipAdvancementStep();
            allStarshipAdvancementChoices().forEach((c) => {
              if (StarshipAdvancementChoice[c] === j['choice']) {
                improvement.choice = c;
              }
            });
            if (improvement.choice === StarshipAdvancementChoice.Department) {
              improvement.value =
                DepartmentsHelper.instance.getDepartmentByName(j['value']);
              if (j['remove'] != null) {
                improvement.removeValue =
                  DepartmentsHelper.instance.getDepartmentByName(j['remove']);
              }
            } else if (
              improvement.choice === StarshipAdvancementChoice.System
            ) {
              improvement.value = systemByName(j['value']);
              if (j['remove'] != null) {
                improvement.removeValue = systemByName(j['remove']);
              }
            } else if (
              improvement.choice === StarshipAdvancementChoice.Talent
            ) {
              improvement.value = this.hydrateTalent(j['value'], version);
              if (j['remove'] != null) {
                improvement.removeValue = this.hydrateTalent(
                  j['remove'],
                  version,
                );
              }
            }

            return improvement;
          } else {
            return undefined;
          }
        })
        .filter((i) => i != null);
    } else {
      return undefined;
    }
  }

  decodeImprovements(json: any, version: number) {
    if (json) {
      return Object.values(json)
        .map((j) => {
          if (j['type'] === 'supporting') {
            // backward compatibility
            const improvement = new CharacterAdvancementStep();
            if (j['value'] != null) {
              improvement.value = j['value'];
              improvement.choice = CharacterAdvancementChoice.Value;
            } else if (j['focus'] != null) {
              improvement.value = j['focus'];
              improvement.choice = CharacterAdvancementChoice.Focus;
            } else if (j['attribute'] != null) {
              improvement.value = AttributesHelper.getAttributeByName(
                j['attribute'],
              );
              improvement.choice = CharacterAdvancementChoice.Attribute;
            } else if (j['discipline'] != null) {
              improvement.value =
                DepartmentsHelper.instance.getDepartmentByName(j['discipline']);
              improvement.choice = CharacterAdvancementChoice.Department;
            } else if (j['talent'] != null) {
              improvement.value = this.hydrateTalent(j['talent'], version);
              improvement.choice = CharacterAdvancementChoice.Talent;
            }
            return improvement;
          } else if (j['type'] === 'advancement') {
            const improvement = new CharacterAdvancementStep();
            allCharacterAdvancementChoices().forEach((c) => {
              if (CharacterAdvancementChoice[c] === j['choice']) {
                improvement.choice = c;
              }
            });
            if (improvement.choice === CharacterAdvancementChoice.Value) {
              improvement.value = j['value'];
              if (j['remove'] != null) {
                improvement.removeValue = j['remove'];
              }
            } else if (
              improvement.choice === CharacterAdvancementChoice.Focus
            ) {
              improvement.value = j['value'];
              if (j['remove'] != null) {
                improvement.removeValue = j['remove'];
              }
            } else if (
              improvement.choice === CharacterAdvancementChoice.Attribute
            ) {
              improvement.value = AttributesHelper.getAttributeByName(
                j['value'],
              );
              if (j['remove'] != null) {
                improvement.removeValue = AttributesHelper.getAttributeByName(
                  j['remove'],
                );
              }
            } else if (
              improvement.choice === CharacterAdvancementChoice.Department
            ) {
              improvement.value =
                DepartmentsHelper.instance.getDepartmentByName(j['value']);
              if (j['remove'] != null) {
                improvement.removeValue =
                  DepartmentsHelper.instance.getDepartmentByName(j['remove']);
              }
            } else if (
              improvement.choice === CharacterAdvancementChoice.Talent
            ) {
              improvement.value = this.hydrateTalent(j['value'], version);
              if (j['remove'] != null) {
                improvement.removeValue = this.hydrateTalent(
                  j['remove'],
                  version,
                );
              }
            }

            if (j['log'] != null) {
              improvement.log = j['log'];
            }
            if (j['logCallback'] != null) {
              improvement.logCallback = j['logCallback'];
            }
            return improvement;
          } else if (j['type'] === 'promotion') {
            const jsonRank = j['rank'];
            const rank = new CharacterRank(jsonRank['name'], jsonRank['id']);
            const type =
              j['modificationType'] ===
              ModificationType[ModificationType.Demotion]
                ? ModificationType.Demotion
                : ModificationType.Promotion;

            return new Promotion(rank, type);
          } else if (j['type'] === 'reputation') {
            const reputation = j['reputation'];
            return new ReputationChangeStep(reputation);
          } else if (j['type'] === 'logEntry') {
            return this.decodeLogEntry(j);
          } else {
            return undefined;
          }
        })
        .filter((i) => i != null);
    } else {
      return undefined;
    }
  }

  hydrateTalent(t, version: number) {
    let talentName = t.name;
    if (
      talentName === 'Augmented Ability (Control)' ||
      talentName === 'Augmented Ability (Daring)' ||
      talentName === 'Augmented Ability (Fitness)' ||
      talentName === 'Augmented Ability (Insight)' ||
      talentName === 'Augmented Ability (Presence)' ||
      talentName === 'Augmented Ability (Reason)'
    ) {
      talentName = TALENT_NAME_AUGMENTED_ABILITY;
    } else if (
      talentName === 'Collaboration: Command' ||
      talentName === 'Collaboration: Conn' ||
      talentName === 'Collaboration: Engineering' ||
      talentName === 'Collaboration: Security' ||
      talentName === 'Collaboration: Medicine' ||
      talentName === 'Collaboration: Science'
    ) {
      talentName = TALENT_NAME_COLLABORATION;
    } else if (
      talentName === 'Bold: Command' ||
      talentName === 'Bold: Conn' ||
      talentName === 'Bold: Engineering' ||
      talentName === 'Bold: Security' ||
      talentName === 'Bold: Medicine' ||
      talentName === 'Bold: Science'
    ) {
      talentName = TALENT_NAME_BOLD;
    } else if (
      talentName === 'Cautious: Command' ||
      talentName === 'Cautious: Conn' ||
      talentName === 'Cautious: Engineering' ||
      talentName === 'Cautious: Security' ||
      talentName === 'Cautious: Medicine' ||
      talentName === 'Cautious: Science'
    ) {
      talentName = TALENT_NAME_CAUTIOUS;
    } else if (
      talentName === 'I’m a Doctor, Not a Starship Captain!' ||
      talentName === 'I’m a Doctor, Not a Damn Pilot!' ||
      talentName === 'I’m a Doctor, Not an Engineer!' ||
      talentName === 'I’m a Doctor, Not a Scientist!' ||
      talentName === 'I’m a Doctor, Not the Chief of Security!'
    ) {
      talentName = TALENT_NAME_IM_A_DOCTOR_NOT_A;
    } else if (
      talentName === 'Defensive Training: Melee' ||
      talentName === 'Defensive Training: Ranged'
    ) {
      talentName = TALENT_NAME_DEFENSIVE_TRAINING_FED_KLINGON_WAR;
    } else if (
      talentName === 'Dedicated Personnel (Command)' ||
      talentName === 'Dedicated Personnel (Conn)' ||
      talentName === 'Dedicated Personnel (Engineering)' ||
      talentName === 'Dedicated Personnel (Security)' ||
      talentName === 'Dedicated Personnel (Medicine)' ||
      talentName === 'Dedicated Personnel (Science)'
    ) {
      talentName = 'Dedicated Personnel';
    }
    const talent = TalentsHelper.getTalent(talentName);
    if (talent) {
      const selectedTalent = new SelectedTalent(talent.name);

      if (t.name === 'Augmented Ability (Control)') {
        selectedTalent.attribute = Attribute.Control;
      } else if (t.name === 'Augmented Ability (Daring)') {
        selectedTalent.attribute = Attribute.Daring;
      } else if (t.name === 'Augmented Ability (Fitness)') {
        selectedTalent.attribute = Attribute.Fitness;
      } else if (t.name === 'Augmented Ability (Insight)') {
        selectedTalent.attribute = Attribute.Insight;
      } else if (t.name === 'Augmented Ability (Presence)') {
        selectedTalent.attribute = Attribute.Presence;
      } else if (t.name === 'Augmented Ability (Reason)') {
        selectedTalent.attribute = Attribute.Reason;
      } else if (
        [
          'Collaboration: Command',
          'Bold: Command',
          'Cautious: Command',
          'Dedicated Personnel (Command)',
          'I’m a Doctor, Not a Starship Captain!',
        ].includes(t.name)
      ) {
        selectedTalent.department = Department.Command;
      } else if (
        [
          'Collaboration: Conn',
          'Bold: Conn',
          'Cautious: Conn',
          'Dedicated Personnel (Conn)',
          'I’m a Doctor, Not a Damn Pilot!',
        ].includes(t.name)
      ) {
        selectedTalent.department = Department.Conn;
      } else if (
        [
          'Collaboration: Engineering',
          'Bold: Engineering',
          'Cautious: Engineering',
          'Dedicated Personnel (Engineering)',
          'I’m a Doctor, Not an Engineer!',
        ].includes(t.name)
      ) {
        selectedTalent.department = Department.Engineering;
      } else if (
        [
          'Collaboration: Security',
          'Bold: Security',
          'Cautious: Security',
          'Dedicated Personnel (Security)',
          'I’m a Doctor, Not the Chief of Security!',
        ].includes(t.name)
      ) {
        selectedTalent.department = Department.Security;
      } else if (
        [
          'Collaboration: Medicine',
          'Bold: Medicine',
          'Cautious: Medicine',
          'Dedicated Personnel (Medicine)',
        ].includes(t.name)
      ) {
        selectedTalent.department = Department.Medicine;
      } else if (
        [
          'Collaboration: Science',
          'Bold: Science',
          'Cautious: Science',
          'Dedicated Personnel (Science)',
          'I’m a Doctor, Not a Scientist!',
        ].includes(t.name)
      ) {
        selectedTalent.department = Department.Science;
      } else if (t.name === 'Defensive Training: Melee') {
        selectedTalent.selection = AttackType.Melee;
      } else if (t.name === 'Defensive Training: Ranged') {
        selectedTalent.selection = AttackType.Ranged;
      }

      if (t['focuses']) {
        selectedTalent.focuses = [...t['focuses']];
      }
      if (t['implants']) {
        selectedTalent.implants = t['implants']
          .map((i) => BorgImplants.instance.getImplantByTypeName(i)?.type)
          .filter((i) => i != null);
      }
      if (t['value']) {
        selectedTalent.value = t['value'];
      }
      if (t['attribute'] != null) {
        selectedTalent.attribute = AttributesHelper.getAttributeByName(
          t['attribute'],
        );
      }
      if (t['department'] != null) {
        selectedTalent.department =
          DepartmentsHelper.instance.getDepartmentByName(t['department']);
      }
      if (t['system'] != null) {
        selectedTalent.system = systemByName(t['system']);
      }
      if (t['x'] != null) {
        selectedTalent.x = t['x'];
      }
      if (t['customTalentName'] != null) {
        selectedTalent.customTalentName = t['customTalentName'];
      }
      if (t['customTalentDescription'] != null) {
        selectedTalent.customTalentDescription = t['customTalentDescription'];
      }

      if (t['selection'] != null) {
        if (talent.name === TALENT_NAME_WARRIORS_SPIRIT) {
          const selection = t['selection'];
          selectedTalent.selection =
            selection === SpecialWeapon[SpecialWeapon.MekLeth]
              ? SpecialWeapon.MekLeth
              : SpecialWeapon.BatLeth;
        } else if (talent.name === TALENT_NAME_DEFENSIVE_TRAINING) {
          const selection = t['selection'];
          selectedTalent.selection =
            selection === AttackType[AttackType.Melee]
              ? AttackType.Melee
              : AttackType.Ranged;
        } else if (talent.name === TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM) {
          selectedTalent.selection = PropulsionSystemModel.getByTypeName(
            t['selection'],
          )?.type;
        } else {
          selectedTalent.selection = t['selection'];
        }
      }

      if (t['additionalInformation'] != null) {
        selectedTalent.additionalInformation = t['additionalInformation'];
      }

      if (t['weapon'] != null) {
        if (typeof t['weapon'] === 'string') {
          selectedTalent.weapon = t['weapon'] as string;
        } else {
          selectedTalent.weapon = this.decodeWeapon(t['weapon'], version);
        }
      }

      return selectedTalent;
    } else {
      return undefined;
    }
  }
}

export const marshaller = new Marshaller();
