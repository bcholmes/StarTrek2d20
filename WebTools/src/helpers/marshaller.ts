import { Base64 } from 'js-base64';
import pako from 'pako';
import { AlliedMilitaryDetails, CareerEventStep, CareerStep, Character, CharacterAttribute, CharacterRank, CharacterSkill, EducationStep, EnvironmentStep, FinishingStep, NpcGenerationStep, SelectedTalent, SpeciesAbilityOptions, SpeciesStep, SupportingStep, UpbringingStep } from '../common/character';
import { CharacterType, CharacterTypeModel } from '../common/characterType';
import { Stereotype } from '../common/construct';
import { MissionProfileStep, ServiceRecordStep, ShipBuildType, ShipBuildTypeModel, ShipTalentDetailSelection, SimpleStats, Starship } from '../common/starship';
import AgeHelper from './age';
import { Attribute, AttributesHelper } from './attributes';
import { Career } from './careerEnum';
import { CareersHelper } from './careers';
import { allDepartments, Department } from './departments';
import { Environment, EnvironmentsHelper } from './environments';
import { MissionPod, MissionPodHelper } from './missionPods';
import { MissionProfile, MissionProfileHelper } from './missionProfiles';
import { RanksHelper } from './ranks';
import { Skill, SkillsHelper } from './skills';
import { Spaceframe } from './spaceframeEnum';
import { SpaceframeModel } from './spaceframeModel';
import { SpaceframeHelper } from './spaceframes';
import { SpeciesHelper } from './species';
import { Species } from './speciesEnum';
import { allSystems, System, systemByName } from './systems';
import { TALENT_NAME_BORG_IMPLANTS, TalentsHelper } from './talents';
import { TalentSelection } from './talentSelection';
import { getAllTracks, Track } from './trackEnum';
import { EarlyOutlook, UpbringingsHelper } from './upbringings';
import { CaptureType, CaptureTypeModel, DeliverySystem, DeliverySystemModel, EnergyLoadType, EnergyLoadTypeModel, MineType, MineTypeModel, TorpedoLoadType, TorpedoLoadTypeModel, UsageCategory, Weapon, WeaponType } from './weapons';
import { Role, RolesHelper } from './roles';
import { BorgImplantType, BorgImplants } from './borgImplant';
import { Specialization, allSpecializations } from '../common/specializationEnum';
import { Era, ErasHelper } from './eras';
import { Asset, AssetStat } from '../asset/asset';
import { AssetType } from '../asset/assetType';
import { AssetStatType, allAssetStatTypes } from '../asset/assetStat';
import { SpeciesAbilityList } from './speciesAbility';
import { allServiceRecords, ServiceRecord, ServiceRecordList } from '../starship/model/serviceRecord';
import AllyHelper, { AlliedMilitary, AlliedMilitaryType } from './alliedMilitary';

class Marshaller {

    encodeSupportingCharacter(character: Character) {
        return this.encode(this.encodeSimpleCharacterAsJson("supportingCharacter", character));
    }

    encodeNpc(character: Character) {
        return this.encode(this.encodeSimpleCharacterAsJson("npc", character));
    }

    encodeAsset(asset: Asset) {
        let sheet = {
            "stereotype": "asset",
            "type": AssetType[asset.type],
            "name": asset.name,
            "stats": {}
        }

        allAssetStatTypes().forEach(t => sheet.stats[AssetStatType[t]] = "" + asset.stats[t].base + "/" + asset.stats[t].critical);
        return this.encode(sheet);
    }

    private encodeSimpleCharacterAsJson(stereotype: string, character: Character) {
        let sheet = {
            "stereotype": stereotype,
            "type": CharacterType[character.type],
            "era": Era[character.era],
            "age": character.age ? character.age.name : undefined,
            "name": character.name,
            "version": character.version,
            "focuses": [...character.focuses]
        };

        if (character.careerStep?.career != null) {
            sheet["career"] = {
                "length" : Career[character.careerStep.career]
            }
        }

        sheet["typeDetails"] = this.encodeTypeDetails(character);

        if (character.stereotype === Stereotype.Npc || character.legacyMode) {
            sheet["attributes"] = this.toAttributeObject(character.attributes);
            sheet["disciplines"] = this.toSkillObject(character.skills);
        }

        if (character.supportingStep) {
            sheet["supporting"] = {
                "focuses": [...character.supportingStep.focuses.filter(f => f.trim().length)],
                "attributes": [...character.supportingStep.attributes.map(a => Attribute[a])],
                "disciplines": [...character.supportingStep.disciplines.map(d => Skill[d])],
                "supervisory": character.supportingStep.supervisory
            }
            if (character.supportingStep.value?.length) {
                sheet["supporting"]["value"] = character.supportingStep.value;
            }
        }

        if (character.speciesStep) {
            sheet["species"] = this.toSpeciesJson(character);
        }

        if (character.role != null) {
            sheet["role"] = { "id": Role[character.role] };
            if (character.secondaryRole != null) {
                sheet["role"]["secondaryId"] = Role[character.secondaryRole];
            }
        }
        if (character.jobAssignment != null) {
            sheet["jobAssignment"] = character.jobAssignment;
        }

        if (character.rank) {
            sheet["rank"] = {
                name: character.rank?.name,
                id: character.rank?.id
            }
        }

        let additionalTraits = this.parseTraits(character.additionalTraits);
        if (additionalTraits?.length) {
            sheet["traits"] = additionalTraits;
        }
        if (character.pronouns) {
            sheet["pronouns"] = character.pronouns;
        }

        if (character.stereotype === Stereotype.Npc) {
            if (character.npcGenerationStep) {
                let block = {};
                if (character.npcGenerationStep.values.length) {
                    block["values"] = character.values
                }

                let talents = this.toTalentList(character.npcGenerationStep.talents);
                if (talents?.length) {
                    block["talents"] = talents;
                }

                if (character.npcGenerationStep?.specialization != null) {
                    block["specialization"] = Specialization[character.npcGenerationStep.specialization];
                }
                sheet["npc"] = block;
            }
        }
        return sheet;
    }

    encodeMainCharacter(character: Character) {
        return this.encode(this.encodeFullCharacterAsJson(character, "mainCharacter"));
    }

    encodeSoloCharacter(character: Character) {
        return this.encode(this.encodeFullCharacterAsJson(character, "soloCharacter"));
    }

    encodeTypeDetails(character: Character) {
        if (character.type === CharacterType.AlliedMilitary && character.typeDetails != null
            && character.typeDetails instanceof AlliedMilitaryDetails) {
            let typeDetails = character.typeDetails as AlliedMilitaryDetails;
            let details = {
                type: AlliedMilitaryType[typeDetails.alliedMilitary.type],
                typeName: typeDetails.alliedMilitary.name,
                name: typeDetails.name
            }
            return details;
        } else {
            return undefined;
        }
    }

    private encodeFullCharacterAsJson(character: Character, stereotype: string) {
        let sheet = {
            "stereotype": stereotype,
            "type": CharacterType[character.type],
            "era": Era[character.era],
            "name": character.name,
            "version": character.version,
        };

        if (character.upbringingStep) {
            let upbringing = {
                "id": EarlyOutlook[character.upbringingStep.upbringing?.id],
                "accepted": character.upbringingStep.acceptedUpbringing
            };
            if (character.upbringingStep.focus) {
                upbringing["focus"] = character.upbringingStep.focus;
            }
            if (character.upbringingStep.discipline != null) {
                upbringing["discipline"] = Skill[character.upbringingStep.discipline];
            }
            if (character.upbringingStep.talent != null) {
                upbringing["talent"] = this.talentToJson(character.upbringingStep.talent);
            }
            sheet["upbringing"] = upbringing;
        }

        sheet["typeDetails"] = this.encodeTypeDetails(character);

        if ((character.stereotype !== Stereotype.MainCharacter && character.stereotype !== Stereotype.SoloCharacter) || character.legacyMode) {
            sheet["focuses"] = [...character.focuses];
            sheet["attributes"] = this.toAttributeObject(character.attributes);
            sheet["disciplines"] = this.toSkillObject(character.skills);
        }

        if (character.careerStep != null) {
            if (character.careerStep.career != null) {
                sheet["career"] = {
                    "length": Career[character.careerStep.career]
                }
            }
            if (character.careerStep.value) {
                if (sheet["career"] == null) {
                    sheet["career"] = {};
                }
                sheet["career"]["value"] = character.careerStep.value;
            }
            if (character.careerStep.talent != null) {
                if (sheet["career"] == null) {
                    sheet["career"] = {};
                }
                sheet["career"]["talent"] = this.talentToJson(character.careerStep.talent);
            }
        }

        if (character.pastime?.length) {
            sheet["pastime"] = [...character.pastime];
        }

        if (character.careerEvents) {
            sheet["careerEvents"] = character.careerEvents.map(c => {
                let e = { "id": c.id };
                if (c.focus) {
                    e["focus"] = c.focus;
                }
                if (c.attribute != null) {
                    e["attribute"] = Attribute[c.attribute];
                }
                if (c.discipline != null) {
                    e["discipline"] = Skill[c.discipline];
                }
                if (c.trait != null) {
                    e["trait"] = c.trait;
                }
                return e;
            });
        }

        if (character.rank) {
            sheet["rank"] = {
                name: character.rank?.name,
                id: character.rank?.id
            }
        }

        if (character.reputation != null && character.reputation !== 10) {
            sheet["reputation"] = character.reputation;
        }

        if (character.speciesStep) {
            sheet["species"] = this.toSpeciesJson(character);
        }

        if (character.educationStep != null) {
            let education = {}
            if (character.educationStep?.track != null) {
                education["track"] = Track[character.educationStep.track];
            }
            if (character.educationStep?.enlisted) {
                education["enlisted"] = character.educationStep.enlisted;
            }
            if (character.educationStep?.focuses.length) {
                education["focuses"] = [...character.educationStep.focuses];
            }
            if (character.educationStep?.primaryDiscipline != null) {
                education["primaryDiscipline"] = Skill[character.educationStep.primaryDiscipline];
            }
            if (character.educationStep?.attributes != null) {
                education["attributes"] = character.educationStep.attributes?.filter(a => a != null).map(a => Attribute[a]);
            }
            if (character.educationStep?.disciplines != null) {
                education["disciplines"] = character.educationStep.disciplines?.filter(d => d != null).map(d => Skill[d]);
            }
            if (character.educationStep?.decrementDisciplines?.length) {
                education["decrementDisciplines"] = character.educationStep.decrementDisciplines?.filter(d => d != null).map(d => Skill[d]);
            }
            if (character.educationStep?.decrementAttributes?.length) {
                education["decrementAttributes"] = character.educationStep.decrementAttributes?.filter(d => d != null).map(a => Attribute[a]);
            }
            if (character.educationStep?.value != null) {
                education["value"] = character.educationStep.value;
            }
            if (character.educationStep?.talent != null) {
                education["talent"] = this.talentToJson(character.educationStep.talent);
            }

            sheet["training"] = education;
        }

        let additionalTraits = this.parseTraits(character.additionalTraits);
        if (additionalTraits?.length) {
            sheet["traits"] = additionalTraits;
        }

        if (character.environmentStep != null) {
            let environment = {
                "id": Environment[character.environmentStep.environment]
            };
            if (character.environmentStep.otherSpecies != null) {
                environment["otherSpecies"] = Species[character.environmentStep.otherSpecies];
            }
            if (character.environmentStep.attribute != null) {
                environment["attribute"] = Attribute[character.environmentStep.attribute];
            }
            if (character.environmentStep.discipline != null) {
                environment["discipline"] = Skill[character.environmentStep.discipline];
            }
            if (character.environmentStep.value != null) {
                environment["value"] = character.environmentStep.value;
            }
            sheet["environment"] = environment;
        }

        if (character.finishingStep != null) {
            sheet["finish"] = {
                "attributes": character.finishingStep.attributes.map(a => Attribute[a]),
                "disciplines": character.finishingStep.disciplines.map(d => Skill[d])
            }
            if (character.finishingStep.value != null) {
                sheet["finish"]["value"] = character.finishingStep.value;
            }
            if (character.finishingStep.talent != null) {
                sheet["finish"]["talent"] = this.talentToJson(character.finishingStep.talent);
            }
        }

        if (character.age != null) {
            sheet["age"] = character.age.name;
        }
        if (character.assignedShip) {
            sheet["assignedShip"] = character.assignedShip;
        }
        if (character.jobAssignment) {
            sheet["jobAssignment"] = character.jobAssignment;
        }
        if (character.pronouns) {
            sheet["pronouns"] = character.pronouns;
        }
        if (character.lineage) {
            sheet["lineage"] = character.lineage;
        }
        if (character.house) {
            sheet["house"] = character.house;
        }
        if (character.role != null) {
            let role = { "id": Role[character.role] };
            if (character.secondaryRole != null) {
                role["secondaryId"] = Role[character.secondaryRole];
            }

            sheet["role"] = role;
        }

        return sheet;
    }

    toSpeciesJson(character: Character) {
        let json = { "primary": Species[character.speciesStep.species]};

        if (character.speciesStep.customSpeciesName && character.speciesStep.species === Species.Custom) {
            json["customName"] = character.speciesStep.customSpeciesName;
        }

        if (character.speciesStep.mixedSpecies != null) {
            json["mixed"] = Species[character.speciesStep.mixedSpecies];
        }
        if (character.speciesStep.originalSpecies != null) {
            json["original"] = Species[character.speciesStep.originalSpecies];
        }

        if (character.speciesStep.attributes?.length) {
            json["stats"] = character.speciesStep.attributes.map(a => Attribute[a]);
        }

        if (character.speciesStep.talent) {
            json["talent"] = this.talentToJson(character.speciesStep.talent);
        }

        if (character.speciesStep.abilityOptions) {
            json["abilityOptions"] = {
                focuses: [...character.speciesStep.abilityOptions.focuses]
            };
        }

        if (character.speciesStep.decrementAttributes?.length) {
            json["decrementStats"] = character.speciesStep.decrementAttributes.map(a => Attribute[a]);
        }

        return json;
    }

    toTalentList(talents: SelectedTalent[] ) {
        let result = talents.map(t => this.talentToJson(t));
        return result;
    }

    talentToJson(t: SelectedTalent) {
        let talent = { "name": t.talent };
        if (t.implants?.length > 0) {
            talent["implants"] = t.implants.map(i => BorgImplantType[i]);
        }
        if (t.focuses?.length > 0) {
            talent["focuses"] = [...t.focuses];
        }
        if (t.value) {
            talent["value"] = t.value;
        }
        if (t.attribute != null) {
            talent["attribute"] = Attribute[t.attribute];
        }
        return talent;
    }

    toAttributeObject(attributes: CharacterAttribute[]) {
        let result = {};
        attributes.forEach(a => {
            result[Attribute[a.attribute]] = a.value;
        });
        return result;
    }

    toSkillObject(skills: CharacterSkill[]) {
        let result = {};
        skills.forEach(a => result[Skill[a.skill]] = a.expertise);
        return result;
    }

    toDepartmentObject(departments: number[]) {
        let result = {};
        allDepartments().forEach(d => result[Department[d]] = departments[d]);
        return result;
    }

    toSystemsObject(systems: number[]) {
        let result = {};
        allSystems().forEach(s => result[System[s]] = systems[s]);
        return result;
    }

    parseTraits(traits: string) {
        return traits ? traits.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];
    }

    private encodeStarshipStereoType(stereotype: Stereotype) {
        if (stereotype === Stereotype.SimpleStarship) {
            return "simple";
        } else if (stereotype === Stereotype.SoloStarship) {
            return "soloStarship";
        } else {
            return "starship";
        }
    }

    encodeStarship(starship: Starship) {
        let sheet = {
            "stereotype": this.encodeStarshipStereoType(starship.stereotype),
            "type": CharacterType[starship.type],
            "era": Era[starship.era],
            "buildType": ShipBuildType[starship.buildType],
            "year": starship.serviceYear,
            "name": starship.name,
            "registry": starship.registry,
            "version": starship.version,
            "refits": [],
            "talents": [],
            "traits": this.parseTraits(starship.traits)
        };

        starship.additionalTalents.forEach(t =>  {
            sheet.talents.push({ "name": t.name });
        });
        if (starship.spaceframeModel) {
            if (starship.spaceframeModel.isCustom) {
                sheet['spaceframe'] = {
                    "custom": {
                        "name": starship.spaceframeModel.name,
                        "serviceYear": starship.spaceframeModel.serviceYear,
                        "systems": this.toSystemsObject(starship.spaceframeModel.systems),
                        "departments": this.toDepartmentObject(starship.spaceframeModel.departments),
                        "attacks": starship.spaceframeModel.attacks,
                        "scale": starship.spaceframeModel.scale,
                        "talents": starship.spaceframeModel.talents ? starship.spaceframeModel.talents.map(t => t.description) : []
                    }
                }
            } else {
                sheet['spaceframe'] = {
                    "name": Spaceframe[starship.spaceframeModel.id]
                }
            }
        }
        if (starship.missionProfileStep?.type) {
            let temp = {
                "name": MissionProfile[starship.missionProfileStep?.type?.id]
            }
            if (starship.missionProfileStep.system != null) {
                temp["system"] = System[starship.missionProfileStep.system];
            }
            if (starship.missionProfileStep?.talent) {
                temp['talent'] = { "name": starship.missionProfileStep.talent.name }
            }
            sheet['missionProfile'] = temp;
        }
        if (starship.missionPodModel) {
            sheet['missionPod'] = {
                "name": MissionPod[starship.missionPodModel.id]
            }
        }
        if (starship.serviceRecordStep) {
            sheet["serviceRecord"] = {
                "type": ServiceRecord[starship.serviceRecordStep.type.type]
            }
            if (starship.serviceRecordStep.selection?.length) {
                sheet["serviceRecord"]["selection"] = starship.serviceRecordStep.selection;
            }
        }
        if (starship.refits != null) {
            starship.refits.forEach(s => sheet.refits.push(System[s]));
        }
        if (starship.simpleStats != null) {
            sheet['simpleStats'] = {
                "systems": [...starship.simpleStats.systems],
                "departments": [...starship.simpleStats.departments],
                "className": starship.simpleStats.className,
                "scale": starship.simpleStats.scale
            }
        }
        if (starship.additionalWeapons.length > 0) {
            sheet['additionalWeapons'] = starship.additionalWeapons.map(w => this.encodeWeapon(w));
        }
        if (starship.talentDetailSelections) {
            sheet['talentDetails'] = starship.talentDetailSelections.map(s => ({
                weapon: this.encodeWeapon(s.weapon)
            }));
        }
        return this.encode(sheet);
    }

    private encodeWeapon(w: Weapon) {
        return {
            "usageCategory": w.usageCategory == null ? null : UsageCategory[w.usageCategory],
            "type": w.type == null ? null : WeaponType[w.type],
            "name": w.name,
            "baseDice": w.baseDice,
            "loadType": this.convertLoadType(w.loadType),
            "deliverySystem": w.deliveryType == null ? null : DeliverySystem[w.deliveryType.type]
        };
    }

    private convertLoadType(loadType: EnergyLoadTypeModel|TorpedoLoadTypeModel|CaptureTypeModel|MineTypeModel) {
        if (loadType == null) {
            return null;
        } else if (loadType instanceof EnergyLoadTypeModel) {
            let temp = loadType as EnergyLoadTypeModel;
            return EnergyLoadType[temp.type];
        } else if (loadType instanceof TorpedoLoadTypeModel) {
            let temp = loadType as TorpedoLoadTypeModel;
            return TorpedoLoadType[temp.type];
        } else if (loadType instanceof CaptureTypeModel) {
            let temp = loadType as CaptureTypeModel;
            return CaptureType[temp.type];
        } else if (loadType instanceof MineTypeModel) {
            let temp = loadType as MineTypeModel;
            return MineType[temp.type];
        } else {
            return null;
        }
    }

    encode(json: any) {
        let text = JSON.stringify(json);
        let encoded = pako.deflate(new TextEncoder().encode(text));
        let result = Base64.fromUint8Array(encoded, true);
        return result;
    }

    decode(s: string) {
        if (s) {
            try {
                let encoded = Base64.toUint8Array(s);
                let text = new TextDecoder().decode(pako.inflate(encoded));
                return JSON.parse(text);
            } catch (e) {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    decodeAsset(s: string): Asset {
        let json = this.decode(s);
        let type = null;
        [AssetType.Character, AssetType.Ship, AssetType.Resource].forEach(a => {
            if (AssetType[a] === json.type) {
                type = a;
            }
        });
        let name = json.name;
        let stats = [null, null, null, null, null];
        if (json.stats) {
            allAssetStatTypes().forEach(a => {
                let statName = AssetStatType[a];
                let s = json.stats[statName];
                if (s?.length && s?.indexOf('/') >= 0) {
                    let base = parseInt(s.substring(0, s.indexOf('/')));
                    let critical = parseInt(s.substring(s.indexOf('/') + 1));

                    stats[a] = new AssetStat(base, critical);
                }
            });
        }

        return new Asset(type, name, stats);
    }


    decodeStarship(s: string) {
        let json = this.decode(s);
        let result = new Starship();
        if (json.version) {
            result.version = json.version;
        }
        result.name = json.name;
        if (json.stereotype === "soloStarship") {
            result.stereotype = Stereotype.SoloStarship;
        } else if (json.stereotype === "simple") {
            result.stereotype = Stereotype.SimpleStarship;
        }
        if (json.era) {
            let era = ErasHelper.getEraByName(json.era);
            if (era != null) {
                result.era = era;
            }
        }
        result.registry = json.registry;
        result.traits = json.traits;
        result.serviceYear = json.year;
        CharacterTypeModel.getAllTypes().forEach(t => {
            if (CharacterType[t.type] === json.type) {
                result.type = t.type;
            }
        });
        ShipBuildTypeModel.allTypes().forEach(t => {
            if (ShipBuildType[t.type] === json.buildType) {
                result.buildType = t.type;
            }
        });
        if (json.spaceframe) {
            if (json.spaceframe.custom) {
                let frame = SpaceframeModel.createCustomSpaceframe(result.type, json.spaceframe.custom.serviceYear);
                frame.name = json.spaceframe.custom.name;
                frame.scale = json.spaceframe.custom.scale;
                frame.attacks = json.spaceframe.custom.attacks;
                allDepartments().forEach(d => frame.departments[d] = json.spaceframe.custom.departments[Department[d]]);
                allSystems().forEach(s => frame.systems[s] = json.spaceframe.custom.systems[System[s]]);
                frame.talents = [];

                if (json.spaceframe.custom.talents) {
                    json.spaceframe.custom.talents.forEach(t => {
                        let model = TalentSelection.selectTalent(t);
                        if (model) {
                            frame.talents.push(model);
                        }
                    })
                }
                result.spaceframeModel = frame;
            } else {
                result.spaceframeModel = SpaceframeHelper.instance().getSpaceframeByName(json.spaceframe.name);
            }
        }
        if (json.missionProfile && result.type != null) {
            const missionProfileModel = MissionProfileHelper.getMissionProfileByName(json.missionProfile.name, result.type, result.version);
            if (missionProfileModel != null) {
                result.missionProfileStep = new MissionProfileStep(missionProfileModel);
                if (json.missionProfile.system != null) {
                    result.missionProfileStep.system = systemByName(json.missionProfile.system);
                }
            }

            if (json.missionProfile.talent) {
                let talent = TalentsHelper.getTalent(json.missionProfile.talent.name);
                if (talent) {
                    result.missionProfileStep.talent = talent;
                }
            }
        }
        if (json.missionPod) {
            result.missionPodModel = MissionPodHelper.instance().getMissionPodByName(json.missionPod.name, result.version);
        }
        if (json.serviceRecord) {
            let types = allServiceRecords().filter(t => ServiceRecord[t] === json.serviceRecord.type);
            if (types.length === 1) {
                const serviceRecord = ServiceRecordList.instance.getByType(types[0]);
                result.serviceRecordStep = new ServiceRecordStep(serviceRecord);
                result.serviceRecordStep.specialRule = TalentsHelper.getTalent(serviceRecord.specialRule);
                if (json.serviceRecord.selection) {
                    result.serviceRecordStep.selection = json.serviceRecord.selection;
                }
            }
        }
        if (json.traits) {
            result.traits = json.traits.join(", ");
        }
        if (json.refits) {
            json.refits.forEach((r) => {
                allSystems().forEach(s => {
                    if (System[s] === r) {
                        result.refits.push(s);
                    }
                });
            });
        }

        if (json.talents) {
            json.talents.forEach(t => {
                let talent = TalentsHelper.getTalentViewModel(t.name);
                if (talent) {
                    result.additionalTalents.push(talent);
                }
            });
        }

        if (json.simpleStats) {
            result.simpleStats = new SimpleStats();
            result.simpleStats.scale = json.simpleStats.scale;
            result.simpleStats.className = json.simpleStats.className;
            result.simpleStats.systems = [...json.simpleStats.systems];
            result.simpleStats.departments = [...json.simpleStats.departments];
        }

        if (json.additionalWeapons) {
            result.additionalWeapons = json.additionalWeapons.map(j => this.decodeWeapon(j, result.version));
        }

        if (json.talentDetails) {
            result.talentDetailSelections = json.talentDetails.map(detail => {
                let w = detail.weapon;
                return new ShipTalentDetailSelection(this.decodeWeapon(w, result.version));
            });
        }

        return result;
    }

    private decodeWeapon(json, version: number) {

        let usageCategory = null;
        [UsageCategory.Character, UsageCategory.Starship].forEach(c => { if (UsageCategory[c] === json["usageCategory"]) usageCategory = c; });

        let name = json["name"];
        let baseDice = json["baseDice"];

        let weaponType = null;
        [WeaponType.MELEE, WeaponType.ENERGY, WeaponType.TORPEDO, WeaponType.MINE, WeaponType.CAPTURE].forEach(t => {
            if (WeaponType[t] === json["type"]) {
                weaponType = t;
            }
        });

        let deliverySystem = null;
        DeliverySystemModel.allTypes().forEach(d => {
            if (DeliverySystem[d.type] === json["deliverySystem"]) {
                deliverySystem = d;
            }
        });

        let loadType = null;
        if (weaponType === WeaponType.ENERGY) {
            EnergyLoadTypeModel.allTypes(version).forEach(l => {
                if (EnergyLoadType[l.type] === json["loadType"]) {
                    loadType = l;
                }
            });
        } else if (weaponType === WeaponType.TORPEDO) {
            TorpedoLoadTypeModel.allTypes(version).forEach(l => {
                if (TorpedoLoadType[l.type] === json["loadType"]) {
                    loadType = l;
                }
            });
        } else if (weaponType === WeaponType.CAPTURE) {
            CaptureTypeModel.allTypes().forEach(l => {
                if (CaptureType[l.type] === json["loadType"]) {
                    loadType = l;
                }
            });
        } else if (weaponType === WeaponType.MINE) {
            MineTypeModel.allTypes().forEach(l => {
                if (MineType[l.type] === json["loadType"]) {
                    loadType = l;
                }
            });
        }

        return new Weapon(usageCategory, name, baseDice, weaponType, loadType, deliverySystem);
    }

    decodeCharacter(json: any) {
        let result = new Character();
        if (json["stereotype"] === "npc") {
            result.stereotype = Stereotype.Npc;
        } else if (json["stereotype"] === "supportingCharacter") {
            result.stereotype = Stereotype.SupportingCharacter;
        } else if (json["stereotype"] === "soloCharacter") {
            result.stereotype = Stereotype.SoloCharacter;
        }
        let type = CharacterTypeModel.getCharacterTypeByTypeName(json.type);
        if (type) {
            result.type = type.type;
        }
        if (json.era) {
            let era = ErasHelper.getEraByName(json.era);
            if (era != null) {
                result.era = era;
            }
        }
        result.name = json.name;
        result.additionalTraits = json.traits ? json.traits.join(", ") : "";
        let rank = json.rank;
        if (rank) {
            if (typeof rank === "string") {
                result.rank = new CharacterRank(rank as string);
            } else if (rank.name) {
                result.rank = new CharacterRank(rank.name, rank.id);
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
            }
        }

        if (json.role != null) {
            let role = json.role;
            if (typeof role === 'string') {
                let roleType = RolesHelper.instance.getRoleByName(role);
                if (roleType != null) {
                    result.role = roleType;
                } else {
                    result.jobAssignment = role;
                }
            } else {
                let roleId = role["id"];
                if (roleId != null) {
                    let r = RolesHelper.instance.getRoleByTypeName(roleId, result.type);
                    if (r != null) {
                        result.role = r;
                    }
                }
                if (role["secondaryId"] != null) {
                    let secondaryId = role["secondaryId"]
                    let r = RolesHelper.instance.getRoleByTypeName(secondaryId, result.type);
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
            result.careerEvents = json.careerEvents.map(e => {
                if (typeof e === "number") {
                    return new CareerEventStep(e);
                } else {
                    let step = new CareerEventStep(e["id"]);
                    if (e["attribute"]) {
                        step.attribute = AttributesHelper.getAttributeByName(e["attribute"]);
                    }
                    if (e["discipline"]) {
                        step.discipline = SkillsHelper.toSkill(e["discipline"]);
                    }
                    if (e["focus"]) {
                        step.focus = e["focus"];
                    }
                    if (e["trait"]) {
                        step.trait = e["trait"];
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
            let age = AgeHelper.getAge(json.age);
            if (age) {
                result.age = age;
            }
        }
        if (json.species != null) {
            if (typeof json.species === 'string') { // backward compatibility
                let speciesCode = SpeciesHelper.getSpeciesTypeByName(json.species);

                let species = SpeciesHelper.getSpeciesByType(speciesCode);
                if (species != null) {
                    result.speciesStep = new SpeciesStep(speciesCode);

                    if (result.version > 1) {
                        result.speciesStep.ability = SpeciesAbilityList.instance.getBySpecies(speciesCode);
                    }

                    if (json.mixedSpecies != null) {
                        let speciesCode = SpeciesHelper.getSpeciesTypeByName(json.mixedSpecies);
                        if (speciesCode != null) {
                            result.speciesStep.mixedSpecies = speciesCode;
                        }
                    }
                    if (json.originalSpecies != null) {
                        let speciesCode = SpeciesHelper.getSpeciesTypeByName(json.originalSpecies);
                        if (speciesCode != null) {
                            result.speciesStep.originalSpecies = speciesCode;
                        }
                    }
                }
            } else {
                let speciesBlock = json.species;
                if (speciesBlock.primary != null) {
                    let speciesCode = SpeciesHelper.getSpeciesTypeByName(speciesBlock.primary);

                    if (speciesCode === Species.Custom) {
                        result.speciesStep = new SpeciesStep(speciesCode);
                        if (speciesBlock.customName) {
                            result.speciesStep.customSpeciesName = speciesBlock.customName;
                        }
                    } else {
                        let species = SpeciesHelper.getSpeciesByType(speciesCode);

                        if (species != null) {
                            result.speciesStep = new SpeciesStep(speciesCode);
                            result.addTrait(species.trait);

                            if (result.version > 1) {
                                result.speciesStep.ability = SpeciesAbilityList.instance.getBySpecies(speciesCode);
                            }
                        }
                    }

                    if (speciesBlock.mixed != null) {
                        let speciesCode = SpeciesHelper.getSpeciesTypeByName(speciesBlock.mixed);
                        if (speciesCode != null) {
                            result.speciesStep.mixedSpecies = speciesCode;
                        }
                    }
                    if (speciesBlock.original != null) {
                        let speciesCode = SpeciesHelper.getSpeciesTypeByName(speciesBlock.original);
                        if (speciesCode != null) {
                            result.speciesStep.originalSpecies = speciesCode;
                        }
                    }
                    if (speciesBlock.stats != null) {
                        result.speciesStep.attributes = speciesBlock.stats.map(s => AttributesHelper.getAttributeByName(s));
                    }
                    if (speciesBlock.decrementStats != null) {
                        result.speciesStep.decrementAttributes = speciesBlock.decrementStats.map(s => AttributesHelper.getAttributeByName(s));
                    }
                    if (speciesBlock.talent != null) {
                        result.speciesStep.talent = this.hydrateTalent(speciesBlock.talent);
                    }

                    if (speciesBlock.abilityOptions != null) {
                        result.speciesStep.abilityOptions = new SpeciesAbilityOptions();
                        if (speciesBlock.abilityOptions.focuses) {
                            result.speciesStep.abilityOptions.focuses = [...speciesBlock.abilityOptions.focuses];
                        }
                    }
                }

            }
        }
        if (json.career) {
            let temp = json.career;
            if (typeof temp === 'string') {
                let career = CareersHelper.instance.getCareerByTypeName(temp, result.type, result.version);
                if (result.careerStep != null) {
                    result.careerStep.career = career?.id;
                } else {
                    result.careerStep = new CareerStep(career?.id);
                }
            } else {
                let length = temp.length;
                if (length != null) {
                    let career = CareersHelper.instance.getCareerByTypeName(length, result.type, result.version);
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
                    result.careerStep.talent = this.hydrateTalent(temp.talent);
                }
            }

        }
        if (json.reputation != null) {
            result.reputation = json.reputation;
        }
        if (json.training != null) {
            let trackAsString = json.training.track;
            let tracks = getAllTracks().filter(t => Track[t] === trackAsString);

            result.educationStep = new EducationStep(tracks.length ? tracks[0] : undefined, json.training.enlisted || false);
            if (json.training.focuses != null) {
                result.educationStep.focuses = [...json.training.focuses];
            }
            if (json.training.attributes) {
                result.educationStep.attributes = json.training.attributes.map(a => AttributesHelper.getAttributeByName(a));
            }
            if (json.training.disciplines) {
                result.educationStep.disciplines = json.training.disciplines.map(d => SkillsHelper.toSkill(d));
            }
            if (json.training.decrementDisciplines) {
                result.educationStep.decrementDisciplines = json.training.decrementDisciplines.map(d => SkillsHelper.toSkill(d));
            }
            if (json.training.decrementAttributes) {
                result.educationStep.decrementAttributes = json.training.decrementAttributes.map(a => AttributesHelper.getAttributeByName(a));
            }
            if (json.training.primaryDiscipline != null) {
                result.educationStep.primaryDiscipline = SkillsHelper.toSkill(json.training.primaryDiscipline);
            }
            if (json.training.value != null) {
                result.educationStep.value = json.training.value;
            }
            if (json.training.talent != null) {
                let talent = this.hydrateTalent(json.training.talent);
                if (talent != null) {
                    result.educationStep.talent = talent;
                }
            }
        } else {
            let rank = result.rank == null ? null : RanksHelper.instance().getRankByName(result.rank?.name);
            if (rank && result.stereotype === Stereotype.Npc) {
                if (result.npcGenerationStep == null) {
                    result.npcGenerationStep = new NpcGenerationStep();
                }
                result.npcGenerationStep.enlisted = rank.isEnlisted;
            }
        }
        if (json.focuses) {
            result._focuses = [...json.focuses];
            if (result.stereotype === Stereotype.MainCharacter) {
                result.legacyMode = true;
            }
        }
        if (json.attributes) {
            result.attributes.forEach(a => {
                let value = json.attributes[Attribute[a.attribute]];
                if (value != null) {
                    a.value = value;
                }
            });
        }
        if (json.disciplines) {
            SkillsHelper.getSkills().forEach(s =>
                result._skills[s] = json.disciplines[Skill[s]]
            );
        }
        if (json.environment) {
            let environment = EnvironmentsHelper.getEnvironmentByTypeName(json.environment.id, result.type);
            if (environment) {
                if (environment.id === Environment.AnotherSpeciesWorld) {
                    if (json.environment.otherSpeciesWorld) {
                        result.environmentStep = new EnvironmentStep(environment.id, SpeciesHelper.getSpeciesByName(json.environment.otherSpeciesWorld));
                    } else if (json.environment.otherSpecies) {
                        result.environmentStep = new EnvironmentStep(environment.id,  SpeciesHelper.getSpeciesTypeByName(json.environment.otherSpecies));
                    } else {
                        result.environmentStep = new EnvironmentStep(environment.id);
                    }
                } else {
                    result.environmentStep = new EnvironmentStep(environment.id);
                }
                if (json.environment.attribute) {
                    result.environmentStep.attribute = AttributesHelper.getAttributeByName(json.environment.attribute);
                }
                if (json.environment.discipline) {
                    result.environmentStep.discipline = SkillsHelper.toSkill(json.environment.discipline);
                }
                if (json.environment.value) {
                    result.environmentStep.value = json.environment.value;
                }
            }
        }

        if (json.upbringing) {
            let upbringing = UpbringingsHelper.getUpbringingByTypeName(json.upbringing.id, result.type);
            let step = new UpbringingStep(upbringing, json.upbringing.accepted);
            if (json.upbringing.focus) {
                step.focus = json.upbringing.focus;
            }
            result.upbringingStep = step;

            if (json.upbringing.focus) {
                result.upbringingStep.focus = json.upbringing.focus;
            }
            if (json.upbringing.discipline != null) {
                result.upbringingStep.discipline = SkillsHelper.toSkill(json.upbringing.discipline);
            }
            if (json.upbringing.talent != null) {
                result.upbringingStep.talent = this.hydrateTalent(json.upbringing.talent);
            }
        }

        if (json.finish) {
            result.finishingStep = new FinishingStep();
            if (json.finish.attributes) {
                result.finishingStep.attributes = json.finish.attributes.map(a => AttributesHelper.getAttributeByName(a));
            }
            if (json.finish.disciplines) {
                result.finishingStep.disciplines = json.finish.disciplines.map(d => SkillsHelper.toSkill(d));
            }
            if (json.finish.value) {
                result.finishingStep.value = json.finish.value;
            }
            if (json.finish.talent != null) {
                result.finishingStep.talent = this.hydrateTalent(json.finish.talent);
            }
        }

        if (json.talents) {
            json.talents.forEach(t => {
                let talent = this.hydrateTalent(t);
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
                result.npcGenerationStep.talents = json.npc.talents.map(t => this.hydrateTalent(t));
            }
            if (json.npc.specialization) {
                allSpecializations().forEach(s => { if (Specialization[s] === json.npc.specialization) {result.npcGenerationStep.specialization = s;}})
            }
        }
        if (json.supporting && result.stereotype === Stereotype.SupportingCharacter) {
            result.supportingStep = new SupportingStep();
            if (json.supporting.focuses) {
                result.supportingStep.focuses = [...json.supporting.focuses];
            }
            if (json.supporting.attributes) {
                result.supportingStep.attributes = [...json.supporting.attributes.map(a => AttributesHelper.getAttributeByName(a))];
            }
            if (json.supporting.disciplines) {
                result.supportingStep.disciplines = [...json.supporting.disciplines.map(d => SkillsHelper.findSkill(d))];
            }
            if (json.supporting.value?.length) {
                result.supportingStep.value = json.supporting.value;
            }
            if (json.supporting.supervisory) {
                result.supportingStep.supervisory = json.supporting.supervistory === true;
            }
        }

        // backward compatibility
        if (json.implants) {
            let talent = result.getTalentByName(TALENT_NAME_BORG_IMPLANTS);
            talent.implants = json.implants.map(i => BorgImplants.instance.getImplantByTypeName(i)?.type).filter(i => i != null);
        }

        if (json.values) {
            json.values.forEach(v => {
                result.addValue(v);
            });
        }

        return result;
    }

    hydrateTalent(t) {
        let talent = TalentsHelper.getTalentViewModel(t.name);
        if (talent) {
            let selectedTalent = new SelectedTalent(talent.name);
            if (t["focuses"]) {
                selectedTalent.focuses = [...t["focuses"]];
            }
            if (t["implants"]) {
                selectedTalent.implants = t["implants"].map(i => BorgImplants.instance.getImplantByTypeName(i)?.type).filter(i => i != null);
            }
            if (t["value"]) {
                selectedTalent.value = t["value"];
            }
            if (t["attribute"] != null) {
                selectedTalent.attribute = AttributesHelper.getAttributeByName(t["attribute"]);
            }
            return selectedTalent;
        } else {
            return undefined;
        }
    }
}

export const marshaller = new Marshaller();
