import { Character } from "../common/character";
import { CharacterSerializer } from "../common/characterSerializer";
import { ShipBuildType, Starship } from "../common/starship";
import { Attribute, AttributesHelper } from "../helpers/attributes";
import { RolesHelper } from "../helpers/roles";
import { SkillsHelper, Skill } from "../helpers/skills";
import { Department, allDepartments } from "../helpers/departments";
import { CHALLENGE_DICE_NOTATION, TalentModel, TalentsHelper } from "../helpers/talents";
import { PersonalWeapons, Quality, Weapon, WeaponRange, WeaponType } from "../helpers/weapons";
import { allSystems, System } from "../helpers/systems";
import { Spaceframe } from "../helpers/spaceframeEnum";

const DEFAULT_STARSHIP_ICON = "systems/sta/assets/icons/ship_icon.png";
const DEFAULT_EQUIPMENT_ICON = "systems/sta/assets/icons/voyagercombadgeicon.svg";

export class FoundryVttExporterOptions {
    isStaCompendiumUsed: boolean;

    constructor(isStaCompendiumUsed: boolean = false) {
        this.isStaCompendiumUsed = isStaCompendiumUsed;
    }
}

export class FoundryVttExporter {

    private static _instance: FoundryVttExporter;

    static get instance() {
        if (FoundryVttExporter._instance == null) {
            FoundryVttExporter._instance = new FoundryVttExporter();
        }
        return FoundryVttExporter._instance;
    }

    exportStarship(starship: Starship, options: FoundryVttExporterOptions) {
        let now = Date.now();

        let result = {
            "name": starship.name || "Unnamed Starship",
            "type": "starship",
            "img": this.determineStarshipIcon(starship, options),
            "system": {
                "notes": "",
                "crew": {
                    "value": starship.crewSupport,
                    "max": starship.crewSupport
                },
                "departments": {
                },
                "designation": starship.registry ?? "",
                "missionprofile": starship.missionProfileModel?.name ?? "",
                "power": {
                  "value": starship.power,
                  "max": starship.power
                },
                "refit": starship.refitsAsString(),
                "resistance": starship.resistance,
                "scale": starship.scale,
                "shields": {
                  "value": starship.shields,
                  "max": starship.shields
                },
                "servicedate": starship.serviceYear ?? "",
                "spaceframe": starship.className ?? "",
                "systems": {
                },
                "traits": starship.getAllTraits()
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

        allDepartments().forEach(d => {
            let name = Department[d].toLowerCase();
            result.system.departments[name] = {
                "label": "sta.actor.starship.department." + name,
                "value": ("" + starship.departments[d]),
                "selected": false
            };
        });

        allSystems().forEach(s => {
            let name = System[s].toLowerCase();
            if (s === System.Comms) {
                name = "communications";
            } else if (s === System.Computer) {
                name = "computers";
            }
            result.system.systems[name] = {
                "label": "sta.actor.starship.system." + name,
                "value": ("" + starship.systems[s]),
                "selected": false
            };
        });

        Object.values(starship.getTalentSelectionList()).forEach(t => {
            result.items.push({
                "name": t.talent.displayName + ((t.talent.maxRank > 1 && t.rank > 1) ? " [x" + t.rank + "]" : ""),
                "type": "talent",
                "img": DEFAULT_EQUIPMENT_ICON,
                "system": {
                    "description": this.convertDescription(t.talent),
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
        });

        starship.determineWeapons().forEach(w => {
            if (w.type !== WeaponType.CAPTURE) {
                result.items.push({
                    "name": w.name,
                    "type": "starshipweapon",
                    "img": DEFAULT_EQUIPMENT_ICON,
                    "effects": [],
                    "folder": null,
                    "sort": 0,
                    "system": {
                        "description": "",
                        "damage": w.dice,
                        "range": w.range != null ? WeaponRange[w.range].toLowerCase() : null,
                        "qualities": {
                        "area": w.isQualityPresent(Quality.Area),
                        "spread": false,
                        "dampening": w.isQualityPresent(Quality.Dampening),
                        "calibration": w.isQualityPresent(Quality.Calibration),
                        "devastating": w.isQualityPresent(Quality.Devastating),
                        "highyield": w.isQualityPresent(Quality.HighYield),
                        "persistentx": w.isQualityPresent(Quality.PersistentX) ? starship.scale : 0,
                        "piercingx": w.getRankForQuality(Quality.Piercing),
                        "viciousx": w.getRankForQuality(Quality.Vicious),
                        "hiddenx": w.getRankForQuality(Quality.Hidden),
                        "versatilex": w.getRankForQuality(Quality.Versatile)
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
            }
        });

        return result;
    }


    determineStarshipIcon(starship: Starship, options: FoundryVttExporterOptions) {
        if (options.isStaCompendiumUsed) {
            if (starship.buildType === ShipBuildType.Runabout) {
                return "modules/sta-compendia/assets/ships/starfleet/danube-runabout-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Intrepid ||
                starship.spaceframeModel?.id === Spaceframe.Intrepid_UP) {
                return "modules/sta-compendia/assets/ships/starfleet/intrepid-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Constitution ||
                starship.spaceframeModel?.id === Spaceframe.Constitution_UP) {
                return "modules/sta-compendia/assets/ships/starfleet/constitution-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Constellation ||
                starship.spaceframeModel?.id === Spaceframe.Constellation_UP) {
                return "modules/sta-compendia/assets/ships/starfleet/constellation-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Galaxy) {
                return "modules/sta-compendia/assets/ships/starfleet/galaxy-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Akira ||
                starship.spaceframeModel?.id === Spaceframe.Akira_UP) {
                return "modules/sta-compendia/assets/ships/starfleet/akira-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Defiant ||
                starship.spaceframeModel?.id === Spaceframe.Defiant_UP) {
                return "modules/sta-compendia/assets/ships/starfleet/defiant-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Excelsior ||
                starship.spaceframeModel?.id === Spaceframe.Excelsior_UP) {
                return "modules/sta-compendia/assets/ships/starfleet/excelsior-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Miranda ||
                starship.spaceframeModel?.id === Spaceframe.Miranda_UP) {
                return "modules/sta-compendia/assets/ships/starfleet/miranda-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Nova) {
                return "modules/sta-compendia/assets/ships/starfleet/nova-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.Brel) {
                return "modules/sta-compendia/assets/ships/klingon/b-rel-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.D7) {
                return "modules/sta-compendia/assets/ships/klingon/d7-battle-cruiser-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.KVort) {
                return "modules/sta-compendia/assets/ships/klingon/k-vort-token.webp";
            } else if (starship.spaceframeModel?.id === Spaceframe.VorCha) {
                return "modules/sta-compendia/assets/ships/klingon/vor-cha-token.webp";
            } else {
                return DEFAULT_STARSHIP_ICON;
            }
        } else {
            return DEFAULT_STARSHIP_ICON;
        }
    }


    exportCharacter(character: Character, options: FoundryVttExporterOptions) {
        let now = Date.now();
        let result = {
            "name": character.name || "Unnamed Character",
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
                "rank": character.rank?.name ?? "",
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
                "img": DEFAULT_EQUIPMENT_ICON,
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
                "img": DEFAULT_EQUIPMENT_ICON,
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
            let item = {
                "name": e,
                "type": e === "Armor" ? "armor" : "item",
                "img": this.determineItemIcon(e, options),
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
            };

            if (item.type === "armor") {
                item.system["protection"] = 1;
            }
            result.items.push(item);
        });

        if (character.role != null) {
            let role = RolesHelper.getRoleModelByName(character.role, character.type);
            if (role) {
                result.items.push({
                    "name": role.name,
                    "type": "talent",
                    "img": DEFAULT_EQUIPMENT_ICON,
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
                    "img": DEFAULT_EQUIPMENT_ICON,
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
                  "damage": w.dice,
                  "range": w.type === WeaponType.ENERGY ? "Ranged" : "Melee",
                  "hands": w.hands ?? 1,
                  "qualities": {
                    "area": false,
                    "intense": false,
                    "knockdown": w.isQualityPresent(Quality.Knockdown),
                    "accurate": false,
                    "charge": w.isQualityPresent(Quality.Charge),
                    "cumbersome": false,
                    "deadly": w.isQualityPresent(Quality.Deadly),
                    "debilitating": false,
                    "grenade": false,
                    "inaccurate": false,
                    "nonlethal": w.isQualityPresent(Quality.NonLethal),
                    "hiddenx": w.getRankForQuality(Quality.Hidden),
                    "piercingx": w.getRankForQuality(Quality.Piercing),
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

    determineItemIcon(item: string, options: FoundryVttExporterOptions) {
        if (options.isStaCompendiumUsed) {
            if (item === "Tricorder") {
                return "modules/sta-compendia/assets/icons/items-core/tricorder.webp";
            } else if (item === "MedKit") {
                return "modules/sta-compendia/assets/icons/items-core/medkit.webp";
            } else if (item === "Engineering Kit") {
                return "modules/sta-compendia/assets/icons/items-core/engineering_kit.webp";
            } else {
                return DEFAULT_EQUIPMENT_ICON;
            }
        } else {
            return DEFAULT_EQUIPMENT_ICON;
        }
    }

    determineWeaponIcon(weapon: Weapon, options: FoundryVttExporterOptions, character: Character) {
        if (options.isStaCompendiumUsed) {
            if (weapon.name === PersonalWeapons.instance.unarmedStrike.name) {
                return "modules/sta-compendia/assets/icons/weapons-core/unarmed-strike.webp";
            } else if (weapon.name === PersonalWeapons.instance.phaser1.name) {
                return "modules/sta-compendia/assets/icons/weapons-core/phaser-type-1.webp";
            } else if (weapon.name === PersonalWeapons.instance.phaser2.name) {
                return "modules/sta-compendia/assets/icons/weapons-core/phaser-type-2.webp";
            } else if (weapon.name === PersonalWeapons.instance.batLeth.name) {
                return "modules/sta-compendia/assets/icons/weapons-core/bat-leth.webp";
            } else {
                return DEFAULT_EQUIPMENT_ICON;
            }
        } else {
            return DEFAULT_EQUIPMENT_ICON;
        }
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

        let prerequisites = talent.requirement;
        return description.split("\n").map(d => "<p>" + d + "</p>") + (prerequisites ? "<p><strong>" + prerequisites + "</strong></p>" : "");
    }
}