import base64url from 'base64url';
import pako from 'pako';
import { Character, CharacterAttribute, CharacterSkill } from '../common/character';
import { CharacterType, CharacterTypeModel } from '../common/characterType';
import { ShipBuildType, ShipBuildTypeModel, SimpleStats, Starship } from '../common/starship';
import { Attribute } from './attributes';
import { allDepartments, Department } from './departments';
import { MissionPod, MissionPodHelper } from './missionPods';
import { MissionProfile, MissionProfileHelper } from './missionProfiles';
import { Skill } from './skills';
import { Spaceframe } from './spaceframeEnum';
import { SpaceframeHelper, SpaceframeModel } from './spaceframes';
import { Species } from './speciesEnum';
import { allSystems, System } from './systems';
import { TalentSelection, TalentsHelper } from './talents';
import { CaptureType, CaptureTypeModel, DeliverySystem, DeliverySystemModel, EnergyLoadType, EnergyLoadTypeModel, TorpedoLoadType, TorpedoLoadTypeModel, UsageCategory, Weapon, WeaponType } from './weapons';

class Marshaller {

    encodeSupportingCharacter(character: Character) {
        let sheet = {
            "stereotype": "supportingCharacter",
            "type": CharacterType[character.type],
            "age": character.age ? character.age.name : undefined,
            "name": character.name,
            "pronouns": character.pronouns,
            "role": character.role,
            "rank": character.rank,
            "species": Species[character.species],
            "attributes": this.toAttributeObject(character.attributes),
            "disciplines": this.toSkillObject(character.skills),
            "traits": this.parseTraits(character.additionalTraits),
            "focuses": [...character.focuses]
        };
        console.log(JSON.stringify(sheet));
        return this.encode(sheet);
    }

    toAttributeObject(attributes: CharacterAttribute[]) {
        let result = {};
        attributes.forEach(a => {
            console.log("attr: " + Attribute[a.attribute]);
            result[Attribute[a.attribute]] = a.value; });
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

    encodeStarship(starship: Starship) {
        let sheet = {
            "stereotype": "starship",
            "type": CharacterType[starship.type],
            "buildType": ShipBuildType[starship.buildType],
            "year": starship.serviceYear,
            "name": starship.name,
            "registry": starship.registry,
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
        if (starship.missionProfileModel) {
            let temp = {
                "name": MissionProfile[starship.missionProfileModel.id]
            }
            if (starship.profileTalent) {
                temp['talent'] = { "name": starship.profileTalent.name }
            }
            sheet['missionProfile'] = temp;
        }
        if (starship.missionPodModel) {
            sheet['missionPod'] = {
                "name": MissionPod[starship.missionPodModel.id]
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
            sheet['additionalWeapons'] = starship.additionalWeapons.map(w => ({
                "usageCategory": w.usageCategory == null ? null : UsageCategory[w.usageCategory],
                "type": w.type == null ? null : WeaponType[w.type],
                "name": w.name,
                "baseDice": w.baseDice,
                "loadType": this.convertLoadType(w.loadType),
                "deliverySystem": w.deliveryType == null ? null : DeliverySystem[w.deliveryType.type],
                "hardCodedQualities": w.hardCodedQualities

            }));
        }
        return this.encode(sheet);
    }

    private convertLoadType(loadType: EnergyLoadTypeModel|TorpedoLoadTypeModel|CaptureTypeModel) {
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
        } else {
            return null;
        }
    }

    encode(json: any) {
        let text = JSON.stringify(json);
        let encoded = pako.deflate(new TextEncoder().encode(text));
        let result = base64url.encode(encoded);
        return result;
    }

    decode(s: string) {
        if (s) {
            try {
                let encoded = base64url.toBuffer(s);
                let text = new TextDecoder().decode(pako.inflate(encoded));
                return JSON.parse(text);
            } catch (e) {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    decodeStarship(s: string) {
        let json = this.decode(s);
        let result = new Starship();
        result.name = json.name;
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
                result.spaceframeModel = SpaceframeHelper.getSpaceframeByName(json.spaceframe.name);
            }
        }
        if (json.missionProfile && result.type != null) {
            result.missionProfileModel = MissionProfileHelper.getMissionProfileByName(json.missionProfile.name, result.type);

            if (json.missionProfile.talent) {
                let talent = TalentsHelper.getTalentViewModel(json.missionProfile.talent.name);
                if (talent) {
                    result.profileTalent = talent;
                }
            }
        }
        if (json.missionPod) {
            result.missionPodModel = MissionPodHelper.getMissionPodByName(json.missionPod.name);
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
            result.additionalWeapons = json.additionalWeapons.map(j => this.decodeAdditionalWeapon(j));
        }

        Starship.updateSystemAndDepartments(result);

        return result;
    }

    private decodeAdditionalWeapon(json) {

        let usageCategory = null;
        [UsageCategory.Character, UsageCategory.Starship].forEach(c => { if (UsageCategory[c] === json["usageCategory"]) usageCategory = c; });

        let name = json["name"];
        let baseDice = json["baseDice"];
        let hardCodedQualities = json["hardCodedQualities"];

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
            EnergyLoadTypeModel.allTypes().forEach(l => {
                if (EnergyLoadType[l.type] === json["loadType"]) {
                    loadType = l;
                }
            });
        } else if (weaponType === WeaponType.TORPEDO) {
            TorpedoLoadTypeModel.allTypes().forEach(l => {
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
        }

        return new Weapon(usageCategory, name, baseDice, hardCodedQualities, weaponType, loadType, deliverySystem);
    }
}

export const marshaller = new Marshaller();
