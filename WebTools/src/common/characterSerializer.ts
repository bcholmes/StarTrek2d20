import {Character, CharacterAttribute, CharacterSkill, CharacterTalent, CharacterType, Gender} from './character';
import {RolesHelper} from '../helpers/roles';
import {SpeciesHelper, Species} from '../helpers/species';
import {EnvironmentsHelper, Environment} from '../helpers/environments';
import {UpbringingsHelper} from '../helpers/upbringings';
import {SkillsHelper, Skill} from '../helpers/skills';
import {TalentsHelper} from '../helpers/talents';

export interface ICharacterData {
    name: string;
    value: string;
}

export class CharacterSerializer {
    static serialize(character: Character): ICharacterData[] {
        return [
            { name: "game", value: "STARTREK" },
            { name: "era", value: character.era.toString() },
            { name: "attributes", value: CharacterSerializer.serializeAttributes(character.attributes) },
            { name: "disciplines", value: CharacterSerializer.serializeSkills(character.skills) },
            { name: "talents", value: CharacterSerializer.serializeTalents(character.talents) },
            { name: "values", value: CharacterSerializer.serializeArray([character.environmentValue, character.careerValue, character.trackValue, character.finishValue]) },
            { name: "focuses", value: CharacterSerializer.serializeArray(character.focuses) },
            { name: "traits", value: CharacterSerializer.serializeTraits(character.traits) },
            { name: "species", value: CharacterSerializer.serializeSpecies(character.species, character.mixedSpecies) },
            { name: "environment", value: character.environment >= 0 ? CharacterSerializer.serializeEnvironment(character.environment, character.otherSpeciesWorld) : "" },
            { name: "rank", value: character.rank },
            { name: "upbringing", value: character.upbringing >= 0 ? UpbringingsHelper.getUpbringing(character.upbringing).name : "" },
            { name: "accepted", value: character.acceptedUpbringing === true ? "1" : "0" },
            { name: "equipment", value: CharacterSerializer.serializeEquipment(character.equipment) },
            { name: "assignment", value: CharacterSerializer.serializeAssignment(character) },
            { name: "name", value: CharacterSerializer.serializeName(character) },
        ];
    }

    private static serializeAssignment(character: Character) {
        var result = character.role;
        if (character.secondaryRole) {
            result = result + " / " + character.secondaryRole;
        }
        return result;
    }

    private static serializeName(character: Character) {
        if (character.type == CharacterType.KlingonWarrior) {
            var result = character.name;
            if (character.lineage) {
                result += (", " + character.lineage);
            }
            if (character.house) {
                if (character.house.toLowerCase().indexOf("house of ") == 0) {
                    result += (", of the " + character.house);
                } else if (character.house.toLowerCase().indexOf("house ") == 0) {
                    result += (", of " + character.house);
                } else {
                    result += (", " + character.house);
                }
            }
            return result;
        } else {
            return character.name;
        }
    }

    private static serializeAttributes(attrs: CharacterAttribute[]) {
        return `${attrs[0].value},${attrs[1].value},${attrs[2].value},${attrs[3].value},${attrs[4].value},${attrs[5].value}`;
    }

    private static serializeSkills(skills: CharacterSkill[]) {
        return `${skills[Skill.Command].expertise},${skills[Skill.Conn].expertise},${skills[Skill.Engineering].expertise},${skills[Skill.Security].expertise},${skills[Skill.Science].expertise},${skills[Skill.Medicine].expertise}`;
    }

    private static serializeTalents(talents: { [name: string]: CharacterTalent }) {
        var result = "";
        for (var talent in talents) {
            var t = talents[talent];
            result += `${talent}|`;
        }
        return result;
    }

    private static serializeSpecies(primary: Species, secondary: Species) {
        const mixed = secondary != null
            ? `/${SpeciesHelper.getSpeciesByType(secondary).name}`
            : "";

        return `${SpeciesHelper.getSpeciesByType(primary).name}${mixed}`;
    }

    private static serializeEnvironment(environment: Environment, otherSpecies: string) {
        let env = EnvironmentsHelper.getEnvironment(environment).name;

        if (environment === Environment.AnotherSpeciesWorld) {
            env += ` (${otherSpecies})`;
        }

        return env;
    }

    private static serializeTraits(traits: string[]) {
        var result = "";
        for (var i = 0; i < traits.length; i++) {
            result += `${traits[i]}${i < traits.length-1 ? "," : ""}`;
        }
        return result;
    }

    private static serializeEquipment(eq: string[]) {
        var result = "";
        eq.forEach(item => {
            result += `${item}|`;
        });
        return result;
    }

    private static serializeArray(array: string[]) {
        var result = "";
        array.forEach(item => {
            result += `${item}|`;
        });
        return result;
    }
}