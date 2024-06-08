import i18next from "i18next";
import { Character } from "../common/character";
import { CharacterSerializer } from "../common/characterSerializer";
import { Starship } from "../common/starship";
import { Attribute, AttributesHelper } from "../helpers/attributes";
import { BorgImplants, Implant } from "../helpers/borgImplant";
import { EquipmentModel } from "../helpers/equipment";
import { Skill, SkillsHelper } from "../helpers/skills";
import { SpeciesHelper } from "../helpers/species";
import { Species } from "../helpers/speciesEnum";
import { TalentsHelper } from "../helpers/talents";
import { Weapon, WeaponRange, WeaponType, WeaponTypeModel } from "../helpers/weapons";
import { System, allSystems } from "../helpers/systems";
import { makeKey } from "../common/translationKey";
import { Department, allDepartments } from "../helpers/departments";

interface IRoll20Attribute {
    name: string,
    current: string|boolean|number,
    max: string|number,
    id: string
}

interface IRoll20Character {
    oldId: string,
    name: string,
    avatar: string,
    bio: string,
    gmnotes: string,
    defaulttoken: string,
    tags: string,
    controlledby: string,
    inplayerjournals: string,
    attribs: IRoll20Attribute[],
    abilities: any[]
}

interface IRoll20Json {
    schema_version: number,
    type: string,
    character: IRoll20Character
}

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

    exportStarship(starship: Starship) {
        let id = new IdHelper();
        let name = starship.name || "Unnamed Starship";
        let result: IRoll20Json = {
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
                        "name": "sheet_type",
                        "current": "starship",
                        "max": "",
                        "id": "-Nz_YFXyrBCoNytnAbXI"
                    },
                ],
                "abilities": []
            }
        }

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

        allDepartments().forEach(d =>
            result.character.attribs.push(this.convertDepartment(starship, d, id))
        );
        allSystems().forEach(s =>
            result.character.attribs.push(this.convertSystem(starship, s, id))
        );

        starship.getDistinctTalentNameList().forEach(t =>
            Array.prototype.push.apply(result.character.attribs, this.convertStarshipTalent(starship, t, id))
        );

        starship.allTraitsAsArray.forEach((t,i) => {
            Array.prototype.push.apply(result.character.attribs, this.convertStarshipTrait(starship, t, id))
        });

        starship.determineWeapons().forEach(w =>
            Array.prototype.push.apply(result.character.attribs, this.convertStarshipWeapon(starship, w, id))
        );

        return result;
    }

    exportStarshipAsHandout(starship: Starship) {

        let starshipClass = starship.className ?? "";
        let name = starship.name?.length > 0
            ? starship.name
            :  "Unnamed " + (starshipClass.length ? starshipClass + " " : "")  + " Starship";

        if (starship.registry) {
            name += ", " + starship.registry;
        }

        let result = {
            "schema_version": 3,
            "type": "handout",
            "handout": {
                "archived": false,
                "avatar": "",
                "controlledby": "",
                "inplayerjournals": "",
                "name": name,
                "tags": "[]",
                "gmnotes": "",
                "notes": this.createStarshipNotes(starship)
            }
        }

        return result;
    }


    createStarshipNotes(starship: Starship) {

        let result = "";

        let description = starship.spaceframeModel?.localizedDescription;
        if (description) {
            description.split("\n").filter(p => p.length > 0).forEach(p => result += "<p>" + p + "</p>\n");
        }

        if (starship.getAllTraits()?.length) {
            result += "<p><strong>Traits:</strong> " + starship.getAllTraits() + "</p>\n"
        }

        result += "<h2>" + i18next.t("Construct.other.systems") + "</h2>\n"
        result += "<table>\n<thead>\n<tr>\n";
        allSystems().forEach(s => result += "<th>" + i18next.t(makeKey("Construct.system.", System[s])) + "</th>\n");
        result += "</tr>\n</thead>\n<tbody><tr>\n";
        allSystems().forEach(s => result += "<td>" + starship.getSystemValue(s) + "</td>\n");
        result += "</tr>\n</tbody>\n</table>\n";

        result += "<h2>" + i18next.t("Construct.other.departments") + "</h2>\n"
        result += "<table>\n<thead>\n<tr>\n";
        allDepartments().forEach(d => result += "<th>" + i18next.t(makeKey("Construct.department.", Department[d])) + "</th>\n");
        result += "</tr>\n</thead>\n<tbody><tr>\n";
        allDepartments().forEach(d => result += "<td>" + starship.departments[d] + "</td>\n");
        result += "</tr>\n</tbody>\n</table>\n";

        result += "<p><strong>" + i18next.t("Construct.other.power") + ":</strong> " + starship.power + "<br />";
        result += "<strong>" + i18next.t("Construct.other.scale") + ":</strong> " + starship.scale + "<br />";
        result += "<strong>" + i18next.t("Construct.other.shields") + ":</strong> " + starship.shields + "<br />";
        result += "<strong>" + i18next.t("Construct.other.crewSupport") + ":</strong> " + starship.crewSupport + "</p>";


        const delta = "<img src=\"https://s3.amazonaws.com/files.d20.io/images/239862759/6uRVM0G3z6g119ymlL1VLg/med.png?1628984150\" height=\"18\" width=\"13\">";
        const weapons = starship.determineWeapons();
        if (weapons?.length) {
            result += "<p><strong>" + i18next.t("Construct.other.attacks") + "</strong></p>\n<ul>\n";

            weapons.forEach(w => {
                result += "<li><p>" + w.description + " ("
                    + (w.isTractorOrGrappler ? "" : (WeaponTypeModel.TYPES[w.type].description + ", "))
                    + (w.range != null ? "Range " + WeaponRange[w.range] + ", " : "")
                    + (w.isTractorOrGrappler ? "Strength " + starship.getDiceForWeapon(w) : (starship.getDiceForWeapon(w) + delta)) + " "
                    + w.effectsAndQualities + ")"
                    + "</p></li>";
            });

            result += "</ul>\n";
        }
        let talents = starship.getDistinctTalentNameList()
            .map(t => TalentsHelper.getTalent(t))
            .filter(t => t != null && !t.specialRule);
        if (talents?.length) {
            result += "<p><strong>" + i18next.t("Construct.other.talents") + "</strong></p>\n<ul>\n";

            talents.forEach(t => {
                let qualifier = starship.getQualifierForTalent(t.name);
                result += "<li><p><b>" + t.localizedName
                    + (t.maxRank > 1 ? (" [x" + starship.getRankForTalent(t.name) + "]") :"")
                    + (qualifier?.length ? ": " + qualifier : "")
                    + ":</b> "
                    + t.localizedDescription
                    + "</p></li>\n"
            });

            result += "</ul>\n";
        }

        let specialRules = starship.getDistinctTalentNameList()
            .map(t => TalentsHelper.getTalent(t))
            .filter(t => t != null && t.specialRule);
        if (specialRules?.length) {
            result += "<p><strong>" + i18next.t("Construct.other.specialRules") + "</strong></p>\n<ul>\n";

            specialRules.forEach(t => {
                let qualifier = starship.getQualifierForTalent(t.name);
                result += "<li><p><b>" + t.localizedName
                    + (t.maxRank > 1 ? "[x" + starship.getRankForTalent(t.name) + "]" :"")
                    + (qualifier?.length ? ": " + qualifier : "")
                    + ":</b> "
                    + t.localizedDescription
                    + "</p></li>\n"
            });

            result += "</ul>\n";
        }
        return result;
    }


    exportCharacter(character: Character) {
        let id = new IdHelper();
        let name = character.name || "Unnamed Character";
        if (character.pronouns) {
            name += " (" + character.pronouns + ")";
        }
        let result: IRoll20Json = {
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

    convertShields(starship: Starship, id: IdHelper) {
        return {
            "name": "shields",
            "current": "",
            "max": starship.shields ?? 0,
            "id": id.nextId()
        };
    }

    convertServiceDate(starship: Starship, id: IdHelper) {
        return {
            "name": "ship-rank",
            "current": "" + (starship.serviceYear ?? ""),
            "max": "",
            "id": id.nextId()
        };
    }

    convertSpaceframe(starship: Starship, id: IdHelper) {
        return {
            "name": "ship-environment",
            "current": starship.className ?? "",
            "max": "",
            "id": id.nextId()
        };
    }


    convertDesignation(starship: Starship, id: IdHelper) {
        return {
            "name": "ship-designation",
            "current": starship.registry ?? "",
            "max": "",
            "id": id.nextId()
        };
    }

    convertRefit(starship: Starship, id: IdHelper) {
        return {
            "name": "ship-refit",
            "current": starship.refitsAsString() ?? "",
            "max": "",
            "id": id.nextId()
        };
    }

    convertMissionProfile(starship: Starship, id: IdHelper) {
        return {
            "name": "ship_ship-mission-profile",
            "current": starship.missionProfileModel?.localizedName ?? "",
            "max": "",
            "id": id.nextId()
        };
    }

    convertScale(starship: Starship, id: IdHelper) {
        return {
            "name": "ship_scale",
            "current": "" + (starship.scale ?? ""),
            "max": "",
            "id": id.nextId()
        };
    }

    convertCrew(starship: Starship, id: IdHelper) {
        return {
            "name": "crew",
            "current": "0",
            "max": starship.crewSupport ?? 0,
            "id": id.nextId()
        };
    }

    convertPower(starship: Starship, id: IdHelper) {
        return {
            "name": "power",
            "current": "0",
            "max": starship.power ?? 0,
            "id": id.nextId()
        };
    }

    convertShipResistance(starship: Starship, id: IdHelper) {
        return {
            "name": "ship_resistance",
            "current": "" + (starship.resistance ?? ""),
            "max": "",
            "id": id.nextId()
        };
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

    convertDepartment(starship: Starship, d: Department, id: IdHelper) {
        return {
            "name": "ship_" + Department[d].toLocaleLowerCase(),
            "current": starship.departments[d],
            "max": "",
            "id": id.nextId()
        };
    }

    convertSystem(starship: Starship, s: System, id: IdHelper) {
        let name = System[s];
        if (s === System.Comms) {
            name = "communcation";
        } else if (s === System.Computer) {
            name = "computers";
        }
        return {
            "name": "ship_" + name.toLocaleLowerCase(),
            "current": starship.getSystemValue(s),
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

    convertStarshipTalent(starship: Starship, talentName: string, id: IdHelper) {
        const rowId = id.nextId();

        let talent = TalentsHelper.getTalent(talentName);
        let category = talent.category;
        if (category === "") {
            category = "General";
        }

        let name = talent.maxRank > 1 ? (talent.localizedDisplayName + " [x" + starship.getRankForTalent(talentName) + "]") : talent.localizedDisplayName;

        let qualifier = starship.getQualifierForTalent(talent.name);
        if (qualifier?.length) {
            name += ": " + qualifier;
        }

        return [{
            "name": "repeating_stalents_" + rowId + "_stalent_name",
            "current": name,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_stalents_" + rowId + "_stalent_description",
            "current": talent.localizedDescription,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_stalents_" + rowId + "_stalent_requirements",
            "current": (talent.requirement?.length ? talent.requirement : "None"),
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_stalents_" + rowId + "_stalent_category",
            "current": category,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_stalents_" + rowId + "_stalent_settings",
            "current": "0",
            "max": "",
            "id": id.nextId()
        }];
    }


    convertTalent(character: Character, talentName: string, id: IdHelper) {
        const rowId = id.nextId();

        let talent = TalentsHelper.getTalent(talentName);
        let category = talent.category;
        if (category === "") {
            category = "General";
        }

        let name = talent.maxRank > 1 ? (talent.localizedDisplayName + character.getRankForTalent(talentName)) : talent.localizedDisplayName;

        return [{
            "name": "repeating_talents_" + rowId + "_talent_name",
            "current": name,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_talents_" + rowId + "_talent_description",
            "current": talent.localizedDescription,
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
            "current": weapon.qualities?.map(q => q.localizedDescription)?.join(", ") ?? "",
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_weapons_" + rowId + "_weapon_effects",
            "current": weapon.effects?.map(q => q.localizedDescription)?.join(", ") ?? "",
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

    convertStarshipWeapon(starship: Starship, weapon: Weapon, id: IdHelper) {
        let damage = "";
        for (let i = 0; i < weapon.dice + starship.getDiceForWeapon(weapon); i++) {
            damage += "{{cdice" + (i+1) + "=[[1d6]]}}";
        }
        const rowId = id.nextId();
        return [{
            "name": "repeating_ship_" + rowId + "_weapon_name",
            "current": weapon.description,
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_ship_" + rowId + "_weapon_quality",
            "current": weapon.qualities?.map(q => q.localizedDescription)?.join(", ") ?? "",
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_ship_" + rowId + "_weapon_effect",
            "current": weapon.effects?.map(q => q.localizedDescription)?.join(", ") ?? "",
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_ship_" + rowId + "_weapon_damage",
            "current": weapon.dice,
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_ship_" + rowId + "_damageRoll",
            "current": damage,
            "max": "",
            "id": id.nextId()
        },{
            "name": "repeating_ship_" + rowId + "_weapon_type",
            "current": weapon.type === WeaponType.TORPEDO ? "Torpedo" : "Energy",
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

    convertStarshipTrait(starship: Starship, trait: string, id: IdHelper) {
        const rowId = id.nextId();
        let result = [{
            "name": "repeating_straits_" + rowId + "_strait_name",
            "current": trait,
            "max": "",
            "id": id.nextId()
        },
        {
            "name": "repeating_straits_" + rowId + "_strait_settings",
            "current": "0",
            "max": "",
            "id": id.nextId()
        }];
        return result;
    }
}