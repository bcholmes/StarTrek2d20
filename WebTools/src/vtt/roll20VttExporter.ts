import { Character } from "../common/character";
import { CharacterSerializer } from "../common/characterSerializer";
import { Attribute, AttributesHelper } from "../helpers/attributes";
import { BorgImplants, Implant } from "../helpers/borgImplant";
import { EquipmentModel } from "../helpers/equipment";
import { Skill, SkillsHelper } from "../helpers/skills";
import { SpeciesHelper } from "../helpers/species";
import { Species } from "../helpers/speciesEnum";
import { TalentsHelper } from "../helpers/talents";
import { Weapon, WeaponType } from "../helpers/weapons";

class IdHelper {

    static readonly ID_PARTS: String = "abcdefghijklmnopqrstuvwxyz0123456789";
    currentId: string;

    constructor() {
        this.currentId = this.createId();
    }

    private createId() {
        let id = "-N";
        for (let i = 0; i < 18; i++) {
            id += IdHelper.ID_PARTS[Math.floor(Math.random() * IdHelper.ID_PARTS.length)];
        }
        return id;
    }

    nextId() {
        this.currentId = this.incrementId(this.currentId);
        return this.currentId;
    }

    private incrementId(id: string) {
        let base = id.substring(0, id.length-1);
        let lastDigit = id.substring(id.length-1).toLocaleLowerCase();

        let index = IdHelper.ID_PARTS.indexOf(lastDigit);
        if (index >= (IdHelper.ID_PARTS.length-1)) {
            return this.incrementId(base) + IdHelper.ID_PARTS[0];
        } else {
            return base + IdHelper.ID_PARTS[index+1];
        }
    }
}

export class Roll20VttExporter {

    private static _instance: Roll20VttExporter;

    static get instance() {
        if (Roll20VttExporter._instance == null) {
            Roll20VttExporter._instance = new Roll20VttExporter();
        }
        return Roll20VttExporter._instance;
    }

    exportCharacter(character: Character) {
        let id = new IdHelper();
        let name = character.name || "Unnamed Character";
        if (character.pronouns) {
            name += " (" + character.pronouns + ")";
        }
        let result = {
            "schema_version": 3,
            "type": "character",
            "character": {
                "oldId": id.currentId,
                "name": name,
                "avatar": "",
                "bio": "",
                "gmnotes": "",
                "defaulttoken": "",
                "tags": "[]",
                "controlledby": "",
                "inplayerjournals": "",
                "attribs": [
                    {
                        "name": "sheet_color",
                        "current": "black",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "attributeName",
                        "current": false,
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "disciplineName",
                        "current": false,
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "systemName",
                        "current": "COMMAND",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "departmentName",
                        "current": false,
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "ask_whisper",
                        "current": "Whisper to GM?",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "ask_public_roll",
                        "current": "Public Roll",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "ask_whisper_roll",
                        "current": "Whisper Roll",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "diceRoll",
                        "current": "{{dice1=[[d20<@{target}cf>@{complication}cs<@{focus}]]}}{{dice2=[[d20<@{target}cf>@{complication}cs<@{focus}]]}}",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "crew_diceRoll",
                        "current": "{{dice1=[[d20<@{crew_target}cf>@{ship_complication}cs<@{crew_discipline}]]}}{{dice2=[[d20<@{crew_target}cf>@{ship_complication}cs<@{crew_discipline}]]}}",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "ship_diceRoll",
                        "current": "{{dice1=[[d20<@{ship_target}cf>@{ship_complication}cs<@{department}]]}}{{dice2=[[d20<@{ship_target}cf>@{ship_complication}cs<@{department}]]}}",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "focus",
                        "current": "1",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "complication",
                        "current": "20",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "version",
                        "current": 1.6,
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "settings_toggle",
                        "current": "0",
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "privilege",
                        "current": 4,
                        "max": "",
                        "id": id.nextId()
                    },
                    {
                        "name": "responsibility",
                        "current": 17,
                        "max": "",
                        "id": id.nextId()
                    },
                ],
                "abilities": []
            }
        }

        result.character.attribs.push(this.convertSpecies(character, id));
        result.character.attribs.push(this.convertRank(character, id));
        result.character.attribs.push(this.convertUpbringing(character, id));
        result.character.attribs.push(this.convertEnvironment(character, id));
        result.character.attribs.push(this.convertAssignment(character, id));
        result.character.attribs.push(this.convertRankSelect(character, id));
        SkillsHelper.getSkills().forEach(d =>
            result.character.attribs.push(this.convertDiscipline(character, d, id))
        );
        AttributesHelper.getAllAttributes().forEach(a =>
            result.character.attribs.push(this.convertAttribute(character, a, id))
        );
        result.character.attribs.push(this.convertStress(character, id));
        result.character.attribs.push(this.convertReputation(character, id));
        result.character.attribs.push(this.convertResistance(character, id));
        result.character.attribs.push(this.convertValues(character, id));
        character.focuses.forEach(f =>
            Array.prototype.push.apply(result.character.attribs, this.convertFocus(character, f, id))
        );
        character.equipmentModels.forEach(e =>
            Array.prototype.push.apply(result.character.attribs, this.convertEquipment(character, e, id))
        );
        character.implants.forEach(e => {
            let implant = BorgImplants.instance.getImplantByType(e);
            Array.prototype.push.apply(result.character.attribs, this.convertEquipment(character, implant, id));
        });

        character.getDistinctTalentNameList().forEach(t =>
            Array.prototype.push.apply(result.character.attribs, this.convertTalent(character, t, id))
        );

        let traits = [...character.baseTraits];
        character.additionalTraits.split(",").map(t => t.trim()).filter(t => t?.length).forEach(t => traits.push(t));

        traits.forEach((t,i) => {
            let description = undefined;
            if (i === 0) {
                // species trait
                if (character.speciesStep?.species !== Species.Custom) {
                    let species = SpeciesHelper.getSpeciesByType(character?.speciesStep?.species);
                    description = species.localizedTraitDescription;
                }
            }
            Array.prototype.push.apply(result.character.attribs, this.convertTrait(character, t, id, description))
        });
        character.determineWeapons().forEach(w =>
            Array.prototype.push.apply(result.character.attribs, this.convertWeapon(character, w, id))
        );

        return result;
    }

    convertSpecies(character: Character, id: IdHelper) {
        return {
            "name": "species",
            "current": character.speciesName,
            "max": "",
            "id": id.nextId()
        };
    }

    convertAssignment(character: Character, id: IdHelper) {
        return {
            "name": "assignment",
            "current": character.assignment,
            "max": "",
            "id": id.nextId()
        };
    }

    convertRank(character: Character, id: IdHelper) {
        return {
            "name": "rank",
            "current": character.rank?.name ?? "",
            "max": "",
            "id": id.nextId()
        };
    }

    convertRankSelect(character: Character, id: IdHelper) {
        return {
            "name": "rankSelect",
            "current": character.rank?.name ?? "",
            "max": "",
            "id": id.nextId()
        };
    }

    convertUpbringing(character: Character, id: IdHelper) {
        return {
            "name": "upbringing",
            "current": character.upbringingStep?.description ?? "",
            "max": "",
            "id": id.nextId()
        };
    }

    convertReputation(character: Character, id: IdHelper) {
        return {
            "name": "reputation",
            "current": character.reputation ?? "",
            "max": "",
            "id": id.nextId()
        };
    }

    convertResistance(character: Character, id: IdHelper) {
        return {
            "name": "resistance",
            "current": character.resistance ?? "0",
            "max": "",
            "id": id.nextId()
        };
    }

    convertStress(character: Character, id: IdHelper) {
        return {
            "name": "stress",
            "current": "",
            "max": character.stress,
            "id": id.nextId()
        };
    }

    convertDiscipline(character: Character, s: Skill, id: IdHelper) {
        return {
            "name": Skill[s].toLocaleLowerCase(),
            "current": character.skills[s].expertise,
            "max": "",
            "id": id.nextId()
        };
    }

    convertAttribute(character: Character, a: Attribute, id: IdHelper) {
        return {
            "name": Attribute[a].toLocaleLowerCase(),
            "current": character.attributes[a].value,
            "max": "",
            "id": id.nextId()
        };
    }

    convertEnvironment(character: Character, id: IdHelper) {
        return {
            "name": "environment",
            "current": CharacterSerializer.serializeEnvironment(character.environmentStep?.environment,
                character.environmentStep?.otherSpecies, character.type) ?? "",
            "max": "",
            "id": id.nextId()
        };
    }

    convertValues(character: Character, id: IdHelper) {
        return {
            "name": "values",
            "current": character.values.join("\n"),
            "max": "",
            "id": id.nextId()
        };
    }

    convertFocus(character: Character, focus: string, id: IdHelper) {
        const rowId = id.nextId();
        return [{
            "name": "repeating_focuses_" + rowId + "_focus_name",
            "current": focus,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_focuses_" + rowId + "_focus_settings",
            "current": "0",
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_focuses_" + rowId + "_focus_show_description",
            "current": "off",
            "max": "",
            "id": id.nextId()
        }];
    }

    convertEquipment(character: Character, equipment: EquipmentModel|Implant, id: IdHelper) {
        const rowId = id.nextId();
        let result = [{
            "name": "repeating_equipmentks_" + rowId + "_equipment_name",
            "current": equipment.name,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_equipmentks_" + rowId + "_equipment_settings",
            "current": "0",
            "max": "",
            "id": id.nextId()
        }];
        if (equipment.description) {
            result.push({
                "name": "repeating_equipmentks_" + rowId + "_equipment_description",
                "current": equipment.description,
                "max": "",
                "id": id.nextId()
            });
        }
        return result;
    }

    convertTalent(character: Character, talentName: string, id: IdHelper) {
        const rowId = id.nextId();

        let talent = TalentsHelper.getTalent(talentName);
        let category = talent.category;
        if (category === "") {
            category = "General";
        }

        let name = talent.maxRank > 1 ? (talent.displayName + character.getRankForTalent(talentName)) : talent.displayName;

        return [{
            "name": "repeating_talents_" + rowId + "_talent_name",
            "current": name,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_talents_" + rowId + "_talent_description",
            "current": talent.description,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_talents_" + rowId + "_talent_requirements",
            "current": talent.requirement ?? "",
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_talents_" + rowId + "_talent_category",
            "current": category,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_talents_" + rowId + "_talent_settings",
            "current": "0",
            "max": "",
            "id": id.nextId()
        }];
    }

    convertWeapon(character: Character, weapon: Weapon, id: IdHelper) {
        let damage = "";
        for (let i = 0; i < weapon.dice + character.skills[Skill.Security].expertise; i++) {
            damage += "{{cdice" + (i+1) + "=[[1d6]]}}";
        }
        const rowId = id.nextId();
        return [{
            "name": "repeating_weapons_" + rowId + "_weapon_name",
            "current": weapon.name,
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_weapons_" + rowId + "_weapon_quality",
            "current": weapon.qualities.map(q => q.description).join(", "),
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_weapons_" + rowId + "_weapon_effects",
            "current": weapon.effects.map(q => q.description).join(", "),
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_weapons_" + rowId + "_weapon_damage",
            "current": weapon.dice,
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_weapons_" + rowId + "_damageRoll",
            "current": damage,
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_weapons_" + rowId + "_weapon_type",
            "current": weapon.type === WeaponType.MELEE ? "Melee" : "Ranged",
            "max": "",
            "id": id.nextId()
        }];
    }

    convertTrait(character: Character, trait: string, id: IdHelper, description?: string) {
        const rowId = id.nextId();
        let result = [{
            "name": "repeating_traits_" + rowId + "_trait_name",
            "current": trait,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_traits_" + rowId + "_trait_settings",
            "current": "0",
            "max": "",
            "id": id.nextId()
        }];
        if (description) {
            result.push({
                "name": "repeating_traits_" + rowId + "_trait_description",
                "current": description ?? "",
                "max": "",
                "id": id.nextId()
            });
        }
        return result;
    }
}