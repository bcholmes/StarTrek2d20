import {Attribute, AttributesHelper} from './attributes';
import {Skill} from './skills';
import {SpeciesHelper} from './species';
import {Character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Species } from './speciesEnum';
import i18next from 'i18next';
import { makeKey } from '../common/translationKey';

export enum Environment {
    // Core
    Homeworld,
    BusyColony,
    IsolatedColony,
    FrontierColony,
    StarshipOrStarbase,
    AnotherSpeciesWorld,

    UtopianParadise,
    Cosmopolitan,
    RigorousDiscipline,
    AscetismAndIntrospection,
    StruggleAndHardship,
    OccupationOrWar,
}

export class EnvironmentModel {
    id: Environment;
    key: string;
    name: string;
    attributes: Attribute[];
    disciplines: Skill[];

    constructor(id: Environment, key: string, name: string, attributes: Attribute[], disciplines: Skill[]) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.attributes = attributes;
        this.disciplines = disciplines;
    }

    getAttributesForCharacter(character: Character) {
        if (this.id === Environment.Homeworld) {
            const speciesAttributes = (character.speciesStep?.species == null || character.speciesStep?.species === Species.Custom) ? AttributesHelper.getAllAttributes() : SpeciesHelper.getSpeciesByType(character.speciesStep?.species).attributes;
            return speciesAttributes;
        } else {
            return this.attributes;
        }
    }

    get localizedName() {
        if (this.key === "special") {
            return this.name;
        } else {
            return i18next.t(makeKey('Environment.' + this.key + ".", Environment[this.id], ".name"));
        }
    }

    get localizedDescription() {
        return i18next.t(makeKey('Environment.' + this.key + ".", Environment[this.id], ".description"));
    }
}

class Environments {
    private _environments: { [id: number]: EnvironmentModel } = {
        [Environment.Homeworld]: new EnvironmentModel(
            Environment.Homeworld,
            "common",
            "Homeworld",
            [],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.BusyColony]: new EnvironmentModel(
            Environment.BusyColony,
            "common",
            "Busy Colony",
            [Attribute.Daring, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.IsolatedColony]: new EnvironmentModel(
            Environment.IsolatedColony,
            "common",
            "Isolated Colony",
            [Attribute.Insight, Attribute.Reason],
            [Skill.Engineering, Skill.Medicine, Skill.Science]
        ),
        [Environment.FrontierColony]: new EnvironmentModel(
            Environment.FrontierColony,
            "common",
            "Frontier Colony",
            [Attribute.Control, Attribute.Fitness],
            [Skill.Conn, Skill.Medicine, Skill.Security]
        ),
        [Environment.StarshipOrStarbase]: new EnvironmentModel(
            Environment.StarshipOrStarbase,
            "common",
            "Starship or Starbase",
            [Attribute.Control, Attribute.Insight],
            [Skill.Command, Skill.Conn, Skill.Engineering]
        ),
        [Environment.AnotherSpeciesWorld]: new EnvironmentModel(
            Environment.AnotherSpeciesWorld,
            "common",
            "Another Species' World",
            [], // Another Species
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security]
        ),
    };

    private _alternateEnvironments: { [id: number]: EnvironmentModel } = {
        [Environment.UtopianParadise]: new EnvironmentModel(
            Environment.UtopianParadise,
            "alternate",
            "Utopian Paradise",
            [Attribute.Control, Attribute.Reason, Attribute.Presence],
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security],
        ),
        [Environment.Cosmopolitan]: new EnvironmentModel(
            Environment.Cosmopolitan,
            "alternate",
            "Cosmopolitan",
            [Attribute.Daring, Attribute.Insight, Attribute.Presence],
            [Skill.Command, Skill.Conn, Skill.Science],
        ),
        [Environment.RigorousDiscipline]: new EnvironmentModel(
            Environment.RigorousDiscipline,
            "alternate",
            "Rigorous Discipline",
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            [Skill.Command, Skill.Security, Skill.Medicine]
        ),
        [Environment.AscetismAndIntrospection]: new EnvironmentModel(
            Environment.AscetismAndIntrospection,
            "alternate",
            "Ascetism and Introspection",
            [Attribute.Control, Attribute.Insight, Attribute.Reason],
            [Skill.Science, Skill.Engineering, Skill.Medicine]
        ),
        [Environment.StruggleAndHardship]: new EnvironmentModel(
            Environment.StruggleAndHardship,
            "alternate",
            "Struggle and Hardship",
            [Attribute.Control, Attribute.Daring, Attribute.Insight],
            [Skill.Conn, Skill.Engineering, Skill.Science]
        ),
        [Environment.OccupationOrWar]: new EnvironmentModel(
            Environment.OccupationOrWar,
            "alternate",
            "Occupation or War",
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            [Skill.Command, Skill.Security, Skill.Medicine]
        ),
    };

    private _klingonEnvironments: { [id: number]: EnvironmentModel } = {
        [Environment.Homeworld]: new EnvironmentModel(
            Environment.Homeworld,
            "klingon",
            "Qo'noS",
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.BusyColony]: new EnvironmentModel(
            Environment.BusyColony,
            "klingon",
            "Core Worlds",
            [Attribute.Daring, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.IsolatedColony]: new EnvironmentModel(
            Environment.IsolatedColony,
            "klingon",
            "Isolated Colony",
            [Attribute.Insight, Attribute.Reason],
            [Skill.Engineering, Skill.Medicine, Skill.Science]
        ),
        [Environment.FrontierColony]: new EnvironmentModel(
            Environment.FrontierColony,
            "klingon",
            "Frontier Colony",
            [Attribute.Control, Attribute.Daring],
            [Skill.Conn, Skill.Medicine, Skill.Security]
        ),
        [Environment.StarshipOrStarbase]: new EnvironmentModel(
            Environment.StarshipOrStarbase,
            "klingon",
            "Starship or Starbase",
            [Attribute.Control, Attribute.Insight],
            [Skill.Command, Skill.Conn, Skill.Engineering]
        ),
        [Environment.AnotherSpeciesWorld]: new EnvironmentModel(
            Environment.AnotherSpeciesWorld,
            "klingon",
            "Another Species' World",
            [], // Another Species
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security]
        ),
    };

    getEnvironmentSettings(type: CharacterType = CharacterType.Starfleet) {
        let result = [];
        for (let environment in this._environments) {
            result.push(this._environments[environment]);
        }

        return result;
    }

    getEnvironmentSettingByType(environment: Environment) {
        return this._environments[environment];
    }

    getEnvironmentConditionByType(environment: Environment) {
        return this._alternateEnvironments[environment];
    }

    getEnvironments(type: CharacterType) {
        let environments: EnvironmentModel[] = [];
        let environmentList = type === CharacterType.KlingonWarrior ? this._klingonEnvironments : this._environments;
        for (let environment in environmentList) {
            let env = environmentList[environment];
            if (env.id !== Environment.AnotherSpeciesWorld) {
                environments.push(env);
            }
        }

        environments = environments.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        SpeciesHelper.getSpecies(CharacterType.Starfleet).forEach(s => {
            environments.push(
                new EnvironmentModel(
                    Environment.AnotherSpeciesWorld,
                    "special",
                    i18next.t('Environment.special.name', { name: environmentList[Environment.AnotherSpeciesWorld].localizedName, species: s.name, interpolation: { escapeValue: false } }),
                    s.attributes,
                    environmentList[Environment.AnotherSpeciesWorld].disciplines));
        });

        return environments;
    }

    getEnvironmentConditions() {
        let environments: EnvironmentModel[] = [];
        let environmentList = this._alternateEnvironments;
        for (var environment in environmentList) {
            var env = environmentList[environment];
            environments.push(env);
        }

        environments = environments.sort((a, b) => {
            return a.localizedName.localeCompare(b.localizedName);
        });
        return environments;
    }

    getEnvironment(env: Environment, type: CharacterType) {
        if (env >= Environment.UtopianParadise) {
            return this._alternateEnvironments[env];
        } else {
            let environmentList = type === CharacterType.KlingonWarrior ? this._klingonEnvironments : this._environments;
            return environmentList[env];
        }
    }

    getEnvironmentByTypeName(typeName: string, type: CharacterType) {
        let list = type === CharacterType.KlingonWarrior ? Object.values(this._klingonEnvironments) : Object.values(this._environments);
        let filtered = list.filter(e => Environment[e.id] === typeName);
        if (filtered.length === 0) {
            filtered = Object.values(this._alternateEnvironments).filter(e => Environment[e.id] === typeName);
        }
        return filtered.length === 0 ? undefined : filtered[0];
    }

    isSetting(environment: Environment) {
        return [Environment.Homeworld,
            Environment.BusyColony,
            Environment.IsolatedColony,
            Environment.FrontierColony,
            Environment.StarshipOrStarbase,
            Environment.AnotherSpeciesWorld].indexOf(environment) >= 0
    }

    isCondition(environment: Environment) {
        return [Environment.UtopianParadise,
            Environment.Cosmopolitan,
            Environment.RigorousDiscipline,
            Environment.AscetismAndIntrospection,
            Environment.StruggleAndHardship,
            Environment.OccupationOrWar].indexOf(environment) >= 0
    }

    generateEnvironment() {
        return Math.floor(Math.random() * 6);
    }

    generateAlternateEnvironment() {
        let roll = Math.floor(Math.random() * 6);
        return roll + 6;
    }
}

export const EnvironmentsHelper = new Environments();
