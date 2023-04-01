import { Character } from "../common/character";
import { CharacterSerializer } from "../common/characterSerializer";
import { Attribute, AttributesHelper } from "../helpers/attributes";
import { SkillsHelper, Skill } from "../helpers/skills";

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
                    "value": 0,
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
        return result;
    }
}