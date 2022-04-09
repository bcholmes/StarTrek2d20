import base64url from 'base64url';
import pako from 'pako';
import { Character, CharacterAttribute, CharacterSkill, Starship } from '../common/character';
import { CharacterType, CharacterTypeModel } from '../common/characterType';
import { Attribute } from './attributes';
import { allDepartments, Department } from './departments';
import { Era } from './eras';
import { MissionProfile, MissionProfileHelper } from './missionProfiles';
import { Skill } from './skills';
import { MissionPod, Spaceframe, SpaceframeHelper, SpaceframeViewModel } from './spaceframes';
import { Species } from './speciesEnum';
import { allSystems, System } from './systems';
import { TalentsHelper } from './talents';

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
                        "talents": starship.spaceframeModel.talents ? starship.spaceframeModel.talents.map(t => t.name) : []
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
        if (starship.missionPod) {
            sheet['missionPod'] = {
                "name": MissionPod[starship.missionPodModel.id]
            }
        }
        if (starship.refits != null) {
            starship.refits.forEach(s => sheet.refits.push(System[s]));
        }
        return this.encode(sheet);
    }

    encode(json: any) {
        let text = JSON.stringify(json);
        let encoded = pako.deflate(text);
        let result = base64url.encode(encoded);
        console.log(">>> " + text.length + " reduced to " +  result.length);
        return result;
    }

    decode(s: string) {
        if (s) {
            try {
                let encoded = base64url.toBuffer(s);
                let text = pako.inflate(encoded, {to: 'string'});
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
        CharacterTypeModel.getStarshipTypes().forEach(t => {
            if (CharacterType[t.type] === json.type) {
                result.type = t.type;
            }
        });
        if (json.spaceframe) {
            if (json.spaceframe.custom) {
                let frame = SpaceframeViewModel.createCustomSpaceframe(result.type, json.spaceframe.custom.serviceYear, [Era.Enterprise, Era.NextGeneration, Era.OriginalSeries ]);
                frame.name = json.spaceframe.custom.name;
                frame.scale = json.spaceframe.custom.scale;
                frame.attacks = json.spaceframe.custom.attacks;
                allDepartments().forEach(d => frame.departments[d] = json.spaceframe.custom.departments[Department[d]]);
                allSystems().forEach(s => frame.systems[s] = json.spaceframe.custom.systems[System[s]]);
                frame.talents = [];

                if (json.spaceframe.custom.talents) {
                    json.spaceframe.custom.talents.forEach(t => {
                        let model = TalentsHelper.getTalent(t);
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
            result.missionPodModel = SpaceframeHelper.getMissionPodByName(json.missionPod.name);
        }
        if (json.traits) {
            result.traits = json.traits.join(", ");
        }
        if (json.refits) {
            json.refits.forEach((r) => {
                let systems = [System.Comms,
                    System.Computer,
                    System.Engines,
                    System.Sensors,
                    System.Structure,
                    System.Weapons];
                systems.forEach(s => {
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

        Starship.updateSystemAndDepartments(result);

        return result;
    }
}

export const marshaller = new Marshaller();
