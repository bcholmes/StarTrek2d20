import {Attribute, AttributesHelper} from './attributes';
import {Skill} from './skills';
import {SpeciesHelper} from './species';
import {Character, character } from '../common/character';
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

class EnvironmentModel {
    id: Environment;
    key: string;
    name: string;
    description: string;
    attributes: Attribute[];
    disciplines: Skill[];

    constructor(id: Environment, key: string, name: string, description: string, attributes: Attribute[], disciplines: Skill[]) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.description = description;
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
            "The character comes from the world that birthed their civilization, and has been surrounded by cultural and spiritual legacies their entire life. Species homeworlds are often utopian and idyllic, serving as the platonic ideal of that species’ culture. They also exemplify aspects of a culture’s most revered traditions, and serve as the heart of that civilization’s legal and political landscape.",
            [],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.BusyColony]: new EnvironmentModel(
            Environment.BusyColony,
            "common",
            "Busy Colony",
            "The character comes from one of their culture’s oldest or most prosperous colonies, which may be another world within their home system — such as Luna or Mars for Humans — or one of the first worlds colonized after the culture achieved interstellar flight. These colonies often develop a fiercely independent outlook, often having developed with little direct aid from their homeworld, and a sense of pride that accompanies being amongst the first of their kind to tame another world.",
            [Attribute.Daring, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.IsolatedColony]: new EnvironmentModel(
            Environment.IsolatedColony,
            "common",
            "Isolated Colony",
            "The character comes from a colony that is isolated from broader galactic society. Worlds like the Vulcan monastery on P’Jem use the vast distances between star systems as an opportunity for contemplative isolation, while others are settled because they present unique research opportunities. The cultures of these colonies tend to focus on learning and introspection.",
            [Attribute.Insight, Attribute.Reason],
            [Skill.Engineering, Skill.Medicine, Skill.Science]
        ),
        [Environment.FrontierColony]: new EnvironmentModel(
            Environment.FrontierColony,
            "common",
            "Frontier Colony",
            "The character comes from a colony located on the fringes of known space, either on the edge of uncharted space or on the border with another civilization. Frontier colonists tend to be hardy and determined, even stubborn, and well-prepared for the dangers that their home may pose.",
            [Attribute.Control, Attribute.Fitness],
            [Skill.Conn, Skill.Medicine, Skill.Security]
        ),
        [Environment.StarshipOrStarbase]: new EnvironmentModel(
            Environment.StarshipOrStarbase,
            "common",
            "Starship or Starbase",
            "The character grew up in space, travelling aboard a starship or living aboard a space station or starbase. While they’re unlikely to have lived aboard a Starfleet vessel — only some of them carry families — many freighters, transports, and other civilian vessels have a tradition of family or generational crews, and many officers with families take postings to starbases rather than ships. Those raised in space learn the ins-and-outs of shipboard life as children, and many are groomed for leadership, or learn to fly a shuttle in their formative years.",
            [Attribute.Control, Attribute.Insight],
            [Skill.Command, Skill.Conn, Skill.Engineering]
        ),
        [Environment.AnotherSpeciesWorld]: new EnvironmentModel(
            Environment.AnotherSpeciesWorld,
            "common",
            "Another Species' World",
            "The character grew up amongst another species. They might have lived amongst a small enclave of their own kind, or they may have been orphaned by some manner of disaster and raised by aliens. Whatever the situation, the character has unique perspectives on their own species and on those they were raised alongside.",
            [], // Another Species
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security]
        ),
    };

    private _alternateEnvironments: { [id: number]: EnvironmentModel } = {
        [Environment.UtopianParadise]: new EnvironmentModel(
            Environment.UtopianParadise,
            "alternate",
            "Utopian Paradise",
            "You were raised in an environment of peace, prosperity, and abundance. There was no war on your world, nor any poverty, homelessness, hunger, or crime. You knew of those things only from studies of history and you have never really been able to understand how a society could produce such destructive inequality. You have always had access to the resources to not merely survive, but to thrive in whatever endeavors you chose to pursue.",
            [Attribute.Control, Attribute.Reason, Attribute.Presence],
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security],
        ),
        [Environment.Cosmopolitan]: new EnvironmentModel(
            Environment.Cosmopolitan,
            "alternate",
            "Cosmopolitan",
            "You were raised in environments of trade or diplomacy, and the intermingling of different communities and cultures. The unfamiliar has always been familiar to you, and you had become familiar with dozens of cultures from distant worlds long before you were an adult. The frenetic pace of life and the basic need to revel in differences between groups and individuals have stayed with you as simple facts of existence in this big Galaxy.",
            [Attribute.Daring, Attribute.Insight, Attribute.Presence],
            [Skill.Command, Skill.Conn, Skill.Science],
        ),
        [Environment.RigorousDiscipline]: new EnvironmentModel(
            Environment.RigorousDiscipline,
            "alternate",
            "Rigorous Discipline",
            "You have always been surrounded by notions of duty and purpose, and your childhood was a strict one, aimed at preparing you to take on a specific role or to achieve a specific goal. This meant relatively little personal freedom, but it instilled within you a powerful sense of what you were capable of when pushed to succeed.",
            [Attribute.Control, Attribute.Fitness, Attribute.Reason],
            [Skill.Command, Skill.Security, Skill.Medicine]
        ),
        [Environment.AscetismAndIntrospection]: new EnvironmentModel(
            Environment.AscetismAndIntrospection,
            "alternate",
            "Ascetism and Introspection",
            "Your life was a simple one, lacking in many of the luxuries that prosperous worlds take for granted. This was not because of a lack, but rather a choice – a belief amongst those you grew up with that external and material abundance can distract from self-knowledge and personal growth.",
            [Attribute.Control, Attribute.Insight, Attribute.Reason],
            [Skill.Science, Skill.Engineering, Skill.Medicine]
        ),
        [Environment.StruggleAndHardship]: new EnvironmentModel(
            Environment.StruggleAndHardship,
            "alternate",
            "Struggle and Hardship",
            "For one reason or another, your world was one with few available resources. Worlds on the frontier, as well as isolated outposts, are often places of hardship where continued survival is difficult, while other worlds struggle in the wake of natural or ecological disasters, the aftermath of war, or societal collapse that leaves basic infrastructure in ruins. Some seek out worlds such as this, where “honest toil” is held as a virtue, while others find themselves in lives of daily struggle through no choice of their own and seek to either better their world or escape it.",
            [Attribute.Control, Attribute.Daring, Attribute.Insight],
            [Skill.Conn, Skill.Engineering, Skill.Science]
        ),
        [Environment.OccupationOrWar]: new EnvironmentModel(
            Environment.OccupationOrWar,
            "alternate",
            "Occupation or War",
            "Though the Federation’s members no longer war amongst themselves, warfare is still a part of the Galaxy. Local or planetary conflicts afflict many independent worlds, and interstellar conflicts ranging from border skirmishes to sector-spanning wars are something which all civilizations must prepare to face. Worlds ravaged by war, or even occupied by a hostile nation, are difficult places to live, often forcing people to adapt to horrific conditions and life-or-death decisions.",
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            [Skill.Command, Skill.Security, Skill.Medicine]
        ),
    };

    private _klingonEnvironments: { [id: number]: EnvironmentModel } = {
        [Environment.Homeworld]: new EnvironmentModel(
            Environment.Homeworld,
            "klingon",
            "Qo'noS",
            "You hail from the Klingon homeworld of Qo’noS, often called Kronos by outsiders, and you’ve been surrounded by the cultural and spiritual legacies of Kahless and the Empire for your entire life. The oldest and most revered of Klingon traditions came from your homeworld, and they are a defining part of your upbringing.",
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.BusyColony]: new EnvironmentModel(
            Environment.BusyColony,
            "klingon",
            "Core Worlds",
            "You come from one of the Empire’s oldest or most prosperous colonies. These colonies often have a fiercely independent outlook, having developed with little aid from the Empire in their earliest days, and the pride that accompanies being amongst the first of their kind to tame an alien world still remains in the descendants of those first settlers.",
            [Attribute.Daring, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.IsolatedColony]: new EnvironmentModel(
            Environment.IsolatedColony,
            "klingon",
            "Isolated Colony",
            "You come from a colony isolated from the rest of the Empire, and from the wider Galaxy. Worlds like Boreth use this isolation as an opportunity for spirituality and contemplation, while others are settled because they present unique opportunities to perform research far from the scrutiny and politicking of the core worlds. Even in the Empire, these worlds emphasize learning and introspection.",
            [Attribute.Insight, Attribute.Reason],
            [Skill.Engineering, Skill.Medicine, Skill.Science]
        ),
        [Environment.FrontierColony]: new EnvironmentModel(
            Environment.FrontierColony,
            "klingon",
            "Frontier Colony",
            "You come from a colony located on the fringes of the Empire, either on the edge of explored space or on the border with the Federation or the Romulan Empire. Your world may even have been claimed from one of those rival powers during a conflict in previous generations. Frontier colonies tend to produce determined people, stubborn and well-prepared for the dangers their home may present, and entirely willing to fight to keep what they have settled.",
            [Attribute.Control, Attribute.Daring],
            [Skill.Conn, Skill.Medicine, Skill.Security]
        ),
        [Environment.StarshipOrStarbase]: new EnvironmentModel(
            Environment.StarshipOrStarbase,
            "klingon",
            "Starship or Starbase",
            "You grew up in space, travelling aboard a starship or living aboard a space station. You won’t have been raised aboard a warship, but many freighters, transports, and other civilian vessels have a tradition of family or generational crews. Those raised in space learn the ways of shipboard life as children, and many take to a spacefaring life easily as a result.",
            [Attribute.Control, Attribute.Insight],
            [Skill.Command, Skill.Conn, Skill.Engineering]
        ),
        [Environment.AnotherSpeciesWorld]: new EnvironmentModel(
            Environment.AnotherSpeciesWorld,
            "klingon",
            "Another Species' World",
            "You grew up amongst non-Klingons. Perhaps you were part of a Klingon enclave overseeing a conquered world, or you were raised amongst exiles, or orphaned during a battle or disaster and raised by aliens. You might have been raised in the Empire, or you may be an outsider to it. Whatever the situation, you have chosen to serve the Empire and prove that you are as Klingon as anyone born on Qo’noS, even if you may have different perspectives on Klingon culture and tradition.",
            [], // Another Species
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security]
        ),
    };

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

        SpeciesHelper.getSpecies().forEach(s => {
            environments.push(
                new EnvironmentModel(
                    Environment.AnotherSpeciesWorld,
                    "special",
                    i18next.t('Environment.special.name', { name: environmentList[Environment.AnotherSpeciesWorld].localizedName, species: s.name, interpolation: { escapeValue: false } }),
                    environmentList[Environment.AnotherSpeciesWorld].description,
                    s.attributes,
                    environmentList[Environment.AnotherSpeciesWorld].disciplines));
        });

        return environments;
    }

    getAlternateEnvironments() {
        let environments: EnvironmentModel[] = [];
        let environmentList = this._alternateEnvironments;
        for (var environment in environmentList) {
            var env = environmentList[environment];
            environments.push(env);
        }

        environments = environments.sort((a, b) => {
            return a.name.localeCompare(b.name);
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

    generateEnvironment() {
        return Math.floor(Math.random() * 6);
    }

    generateAlternateEnvironment() {
        let roll = Math.floor(Math.random() * 6);
        return roll + 6;
    }
}

export const EnvironmentsHelper = new Environments();
