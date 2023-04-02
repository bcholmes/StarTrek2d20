import { Character } from "../common/character";
import { CharacterSerializer } from "../common/characterSerializer";
import { Attribute, AttributesHelper } from "../helpers/attributes";
import { RolesHelper } from "../helpers/roles";
import { SkillsHelper, Skill } from "../helpers/skills";
import { CHALLENGE_DICE_NOTATION, TalentModel, TalentsHelper } from "../helpers/talents";
import { Quality, WeaponType } from "../helpers/weapons";

export class FoundryVttExporter {

    private static _instance: FoundryVttExporter;

    static get instance() {
        if (FoundryVttExporter._instance == null) {
            FoundryVttExporter._instance = new FoundryVttExporter();
        }
        return FoundryVttExporter._instance;
    }

    exportCharacter(character: Character) {
        let now = Date.now();
        let result = {
            "name": character.name ?? "Unnamed Character",
            "type": "character",
            "img": "icons/svg/mystery-man.svg",
            "system": {
                "notes": "",
                "assignment": character.assignment,
                "attributes": {
                },
                "determination": {
                    "value": 1,
                    "max": 3
                },
                "disciplines": {
                },
                "milestones": "",
                "rank": character.rank ?? "",
                "reputation": character.reputation,
                "stress": {
                    "value": character.stress,
                    "max": character.stress
                },
                "traits": character.getAllTraits()
            },
            "items": [],
            "effects": [],
            "flags": {
              "exportSource": {
                "world": "sta-bcholmes-org",
                "system": "sta",
                "coreVersion": "10.291",
                "systemVersion": "1.1.9"
              }
            },
            "_stats": {
              "systemId": "sta",
              "systemVersion": "1.1.9",
              "coreVersion": "10.291",
              "createdTime": now,
              "modifiedTime": now,
              "lastModifiedBy": "xuN9JpdcyRd60ZEJ"
            }
        }

        SkillsHelper.getSkills().forEach(s => {
            let name = Skill[s].toLowerCase();
            result.system.disciplines[name] = {
                "label": "sta.actor.character.discipline." + name,
                "value": ("" + character.skills[s].expertise),
                "selected": false
            };
        });

        AttributesHelper.getAllAttributes().forEach(a => {
            let name = Attribute[a].toLowerCase();
            result.system.attributes[name] = {
                "label": "sta.actor.character.attribute." + name,
                "value": ("" + character.attributes[a].value),
                "selected": false
            };
        });

        if (character.environmentStep) {
            result.system["environment"] = CharacterSerializer.serializeEnvironment(character.environmentStep?.environment, character.environmentStep?.otherSpeciesWorld, character.type);
        } else {
            result.system["environment"] = "";
        }
        result.system["species"] = character.speciesName;

        if (character.upbringingStep) {
            result.system["upbringing"] = character.upbringingStep?.description;
        } else {
            result.system["upbringing"] = "";
        }

        character.values?.forEach(v => {
            result.items.push({
                "name": v,
                "type": "value",
                "img": "systems/sta/assets/icons/voyagercombadgeicon.svg",
                "system": {
                  "description": "",
                  "used": false
                },
                "effects": [],
                "folder": null,
                "sort": 0,
                "ownership": {
                  "default": 0,
                  "xuN9JpdcyRd60ZEJ": 3
                },
                "flags": {},
                "_stats": {
                  "systemId": "sta",
                  "systemVersion": "1.1.9",
                  "coreVersion": "10.291",
                  "createdTime": now,
                  "modifiedTime": now,
                  "lastModifiedBy": "xuN9JpdcyRd60ZEJ"
                }
              },)
        });

        character.focuses?.forEach(f => {
            result.items.push({
                "name": f,
                "type": "focus",
                "img": "systems/sta/assets/icons/voyagercombadgeicon.svg",
                "system": {
                  "description": ""
                },
                "effects": [],
                "folder": null,
                "sort": 0,
                "ownership": {
                  "default": 0,
                  "xuN9JpdcyRd60ZEJ": 3
                },
                "flags": {},
                "_stats": {
                  "systemId": "sta",
                  "systemVersion": "1.1.9",
                  "coreVersion": "10.291",
                  "createdTime": now,
                  "modifiedTime": now,
                  "lastModifiedBy": "xuN9JpdcyRd60ZEJ"
                }
              },)
        });

        character.equipment?.forEach(e => {
            result.items.push({
                "name": e,
                "type": "item",
                "img": "systems/sta/assets/icons/voyagercombadgeicon.svg",
                "system": {
                  "description": "",
                  "quantity": 1,
                  "opportunity": 0,
                  "escalation": 0
                },
                "effects": [],
                "folder": null,
                "sort": 0,
                "ownership": {
                  "default": 0,
                  "xuN9JpdcyRd60ZEJ": 3
                },
                "flags": {},
                "_stats": {
                  "systemId": "sta",
                  "systemVersion": "1.1.9",
                  "coreVersion": "10.291",
                  "createdTime": now,
                  "modifiedTime": now,
                  "lastModifiedBy": "xuN9JpdcyRd60ZEJ"
                }
            })
        });

        if (character.role != null) {
            let role = RolesHelper.getRoleModelByName(character.role, character.type);
            if (role) {
                result.items.push({
                    "name": role.name,
                    "type": "talent",
                    "img": "systems/sta/assets/icons/voyagercombadgeicon.svg",
                    "system": {
                      "description": "<p>" + role.description + "</p>",
                      "talenttype": {
                        "typeenum": "general",
                        "description": "",
                        "minimum": 0
                      }
                    },
                    "effects": [],
                    "flags": {},
                    "_stats": {
                      "systemId": "sta",
                      "systemVersion": "1.1.9",
                      "coreVersion": "10.291",
                      "createdTime": now,
                      "modifiedTime": now,
                      "lastModifiedBy": "xuN9JpdcyRd60ZEJ"
                    },
                    "folder": null,
                    "sort": 0,
                    "ownership": {
                      "default": 0,
                      "xuN9JpdcyRd60ZEJ": 3
                    }
                });
            }
        }

        Object.keys(character.talents).forEach(key => {
            let characterTalent = character.talents[key];
            let talent = TalentsHelper.getTalent(key);
            if (talent) {
                result.items.push({
                    "name": talent.displayName + (talent.maxRank > 1 ? " [x" + characterTalent.rank + "]" : ""),
                    "type": "talent",
                    "img": "systems/sta/assets/icons/voyagercombadgeicon.svg",
                    "system": {
                        "description": this.convertDescription(talent),
                        "talenttype": {
                            "typeenum": this.determineTalentType(talent),
                            "description": this.determineTalentRequirement(talent),
                            "minimum": 0
                        }
                    },
                    "effects": [],
                    "flags": {},
                    "_stats": {
                        "systemId": "sta",
                        "systemVersion": "1.1.9",
                        "coreVersion": "10.291",
                        "createdTime": now,
                        "modifiedTime": now,
                        "lastModifiedBy": "xuN9JpdcyRd60ZEJ"
                    },
                    "folder": null,
                    "sort": 0,
                    "ownership": {
                        "default": 0,
                        "xuN9JpdcyRd60ZEJ": 3
                    }
                });
            }

        });

        character.determineWeapons().forEach(w => {
            result.items.push({
                "name": w.name,
                "type": "characterweapon",
                "img": "systems/sta/assets/icons/voyagercombadgeicon.svg",
                "effects": [],
                "folder": null,
                "sort": 0,
                "system": {
                  "description": "",
                  "damage": w.baseDice,
                  "range": w.type === WeaponType.ENERGY ? "Ranged" : "Melee",
                  "hands": 1,
                  "qualities": {
                    "area": false,
                    "intense": false,
                    "knockdown": w.isQualityPresent(Quality.Knockdown),
                    "accurate": false,
                    "charge": w.isQualityPresent(Quality.Charges),
                    "cumbersome": false,
                    "deadly": w.isQualityPresent(Quality.Deadly),
                    "debilitating": false,
                    "grenade": false,
                    "inaccurate": false,
                    "nonlethal": w.isQualityPresent(Quality.NonLethal),
                    "hiddenx": w.getRankForQuality(Quality.Hidden),
                    "piercingx": 0,
                    "viciousx": w.getRankForQuality(Quality.Vicious),
                    "opportunity": 0,
                    "escalation": 0
                  },
                  "opportunity": null,
                  "escalation": null
                },
                "ownership": {
                  "default": 0,
                  "xuN9JpdcyRd60ZEJ": 3
                },
                "_stats": {
                  "systemId": "sta",
                  "systemVersion": "1.1.9",
                  "coreVersion": "10.291",
                  "createdTime": now,
                  "modifiedTime": now,
                  "lastModifiedBy": "xuN9JpdcyRd60ZEJ"
                }
            });
        });

        return result;
    }

    determineTalentRequirement(talent: TalentModel) {
        if (this.determineTalentType(talent) === "general") {
            return "";
        } else if (this.determineTalentType(talent) === "discipline") {
            return talent.category.toLowerCase();
        } else {
            return talent.category;
        }
    }

    determineTalentType(talent: TalentModel) {
        if (talent.category == null || talent.category === "Esoteric" || talent.category === "General"
                || talent.category === "Career" || talent.category === "Starship" || talent.category === "Starbase" || talent.category === "") {
            return "general";
        } else if (SkillsHelper.toSkill(talent.category) !== Skill.None) {
            return "discipline";
        } else {
            return "species";
        }
    }

    convertDescription(talent: TalentModel) {
        let description = talent.description.replace(CHALLENGE_DICE_NOTATION, "CD");

        let prerequisites = undefined;
        talent.prerequisites.forEach((p) => {
            let desc = p.describe();
            if (desc) {
                if (prerequisites == null) {
                    prerequisites = desc;
                } else {
                    prerequisites += (", " + desc);
                }
            }
        });

        return description.split("\n").map(d => "<p>" + d + "</p>") + (prerequisites ? "<p><strong>" + prerequisites + "</strong></p>" : "");
    }
}