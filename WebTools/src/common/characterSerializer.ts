import {Character} from './character';
import { CharacterType } from '../common/characterType';
import {SpeciesHelper} from '../helpers/species';
import {EnvironmentsHelper, Environment} from '../helpers/environments';
import { Species } from '../helpers/speciesEnum';
import i18next from 'i18next';

export interface ICharacterData {
    name: string;
    value: string;
}

export class CharacterSerializer {
    /*
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
    */

    public static serializeName(character: Character) {
        if (character.type === CharacterType.KlingonWarrior) {
            var result = character.name;
            if (character.lineage) {
                result += (", " + character.lineage);
            }
            if (character.house) {
                if (character.house.toLowerCase().indexOf("house of ") === 0) {
                    result += (", of the " + character.house);
                } else if (character.house.toLowerCase().indexOf("house ") === 0) {
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

    public static serializeSpecies(primary: Species, secondary: Species) {
        if (primary == null) {
            return "";
        } else {
            const mixed = secondary != null
                ? `/${SpeciesHelper.getSpeciesByType(secondary).name}`
                : "";

            return `${SpeciesHelper.getSpeciesByType(primary).name}${mixed}`;
        }
    }

    public static serializeEnvironment(environment: Environment, otherSpecies: Species, type: CharacterType) {
        let environmentModel = (environment == null /* or, implicitly, undefined */) ? undefined : EnvironmentsHelper.getEnvironment(environment, type);
        if (environmentModel) {
            let result = environmentModel.localizedName;
            if (environment === Environment.AnotherSpeciesWorld && otherSpecies != null) {
                let other = SpeciesHelper.getSpeciesByType(otherSpecies);
                result = i18next.t('Environment.special.name', { name: result, species: other.localizedName, interpolation: { escapeValue: false } })
            }
            return result;
        } else {
            return undefined;
        }

    }

}