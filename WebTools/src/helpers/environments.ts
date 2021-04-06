import {Attribute, AttributesHelper} from './attributes';
import {SkillsHelper, Skill} from './skills';
import {SpeciesHelper} from './species';
import {character, CharacterType} from '../common/character';

export enum Environment {
    // Core
    Homeworld,
    BusyColony,
    IsolatedColony,
    FrontierColony,
    StarshipOrStarbase,
    AnotherSpeciesWorld,
}

class EnvironmentModel {
    name: string;
    description: string;
    attributes: Attribute[];
    disciplines: Skill[];

    constructor(name: string, description: string, attributes: Attribute[], disciplines: Skill[]) {
        this.name = name;
        this.description = description;
        this.attributes = attributes;
        this.disciplines = disciplines;
    }
}

class EnvironmentViewModel extends EnvironmentModel {
    id: Environment;

    constructor(id: Environment, base: EnvironmentModel) {
        super(base.name, base.description, base.attributes, base.disciplines);
        this.id = id;

        if (id === Environment.Homeworld) {
            const speciesAttributes = SpeciesHelper.getSpeciesByType(character.species).attributes;
            this.attributes = speciesAttributes;
        }
    }
}

class Environments {
    private _environments: { [id: number]: EnvironmentModel } = {
        [Environment.Homeworld]: new EnvironmentModel(
            "Homeworld",
            "The character comes from the world that birthed their civilization, and has been surrounded by cultural and spiritual legacies their entire life. Species homeworlds are often utopian and idyllic, serving as the platonic ideal of that species’ culture. They also exemplify aspects of a culture’s most revered traditions, and serve as the heart of that civilization’s legal and political landscape.",
            [],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.BusyColony]: new EnvironmentModel(
            "Busy Colony",
            "The character comes from one of their culture’s oldest or most prosperous colonies, which may be another world within their home system — such as Luna or Mars for Humans — or one of the first worlds colonized after the culture achieved interstellar flight. These colonies often develop a fiercely independent outlook, often having developed with little direct aid from their homeworld, and a sense of pride that accompanies being amongst the first of their kind to tame another world.",
            [Attribute.Daring, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.IsolatedColony]: new EnvironmentModel(
            "Isolated Colony",
            "The character comes from a colony that is isolated from broader galactic society. Worlds like the Vulcan monastery on P’Jem use the vast distances between star systems as an opportunity for contemplative isolation, while others are settled because they present unique research opportunities. The cultures of these colonies tend to focus on learning and introspection.",
            [Attribute.Insight, Attribute.Reason],
            [Skill.Engineering, Skill.Medicine, Skill.Science]
        ),
        [Environment.FrontierColony]: new EnvironmentModel(
            "Frontier Colony",
            "The character comes from a colony located on the fringes of known space, either on the edge of uncharted space or on the border with another civilization. Frontier colonists tend to be hardy and determined, even stubborn, and well- prepared for the dangers that their home may pose.",
            [Attribute.Control, Attribute.Fitness],
            [Skill.Conn, Skill.Medicine, Skill.Security]
        ),
        [Environment.StarshipOrStarbase]: new EnvironmentModel(
            "Starship or Starbase",
            "The character grew up in space, travelling aboard a starship or living aboard a space station or starbase. While they’re unlikely to have lived aboard a Starfleet vessel — only some of them carry families — many freighters, transports, and other civilian vessels have a tradition of family or generational crews, and many officers with families take postings to starbases rather than ships. Those raised in space learn the ins-and-outs of shipboard life as children, and many are groomed for leadership, or learn to fly a shuttle in their formative years.",
            [Attribute.Control, Attribute.Insight],
            [Skill.Command, Skill.Conn, Skill.Engineering]
        ),
        [Environment.AnotherSpeciesWorld]: new EnvironmentModel(
            "Another Species' World",
            "The character grew up amongst another species. They might have lived amongst a small enclave of their own kind, or they may have been orphaned by some manner of disaster and raised by aliens. Whatever the situation, the character has unique perspectives on their own species and on those they were raised alongside.",
            [], // Another Species
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security]
        ),
    };

    private _klingonEnvironments: { [id: number]: EnvironmentModel } = {
        [Environment.Homeworld]: new EnvironmentModel(
            "Qo'noS",
            "You hail from the Klingon homeworld of Qo’noS, often called Kronos by outsiders, and you’ve been surrounded by the cultural and spiritual legacies of Kahless and the Empire for your entire life. The oldest and most revered of Klingon traditions came from your homeworld, and they are a defining part of your upbringing.",
            [Attribute.Daring, Attribute.Fitness, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.BusyColony]: new EnvironmentModel(
            "Core Worlds",
            "You come from one of the Empire’s oldest or most prosperous colonies. These colonies often have a fiercely independent outlook, having developed with little aid from the Empire in their earliest days, and the pride that accompanies being amongst the first of their kind to tame an alien world still remains in the descendants of those first settlers.",
            [Attribute.Daring, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security],
        ),
        [Environment.IsolatedColony]: new EnvironmentModel(
            "Isolated Colony",
            "You come from a colony isolated from the rest of the Empire, and from the wider Galaxy. Worlds like Boreth use this isolation as an opportunity for spirituality and contemplation, while others are settled because they present unique opportunities to perform research far from the scrutiny and politicking of the core worlds. Even in the Empire, these worlds emphasize learning and introspection.",
            [Attribute.Insight, Attribute.Reason],
            [Skill.Engineering, Skill.Medicine, Skill.Science]
        ),
        [Environment.FrontierColony]: new EnvironmentModel(
            "Frontier Colony",
            "You come from a colony located on the fringes of the Empire, either on the edge of explored space or on the border with the Federation or the Romulan Empire. Your world may even have been claimed from one of those rival powers during a conflict in previous generations. Frontier colonies tend to produce determined people, stubborn and well-prepared for the dangers their home may present, and entirely willing to fight to keep what they have settled.",
            [Attribute.Control, Attribute.Daring],
            [Skill.Conn, Skill.Medicine, Skill.Security]
        ),
        [Environment.StarshipOrStarbase]: new EnvironmentModel(
            "Starship or Starbase",
            "You grew up in space, travelling aboard a starship or living aboard a space station. You won’t have been raised aboard a warship, but many freighters, transports, and other civilian vessels have a tradition of family or generational crews. Those raised in space learn the ways of shipboard life as children, and many take to a spacefaring life easily as a result.",
            [Attribute.Control, Attribute.Insight],
            [Skill.Command, Skill.Conn, Skill.Engineering]
        ),
        [Environment.AnotherSpeciesWorld]: new EnvironmentModel(
            "Another Species' World",
            "You grew up amongst non-Klingons. Perhaps you were part of a Klingon enclave overseeing a conquered world, or you were raised amongst exiles, or orphaned during a battle or disaster and raised by aliens. You might have been raised in the Empire, or you may be an outsider to it. Whatever the situation, you have chosen to serve the Empire and prove that you are as Klingon as anyone born on Qo’noS, even if you may have different perspectives on Klingon culture and tradition.",
            [], // Another Species
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security]
        ),
    };

    getEnvironments() {
        var environments: EnvironmentViewModel[] = [];
        var n = 0;
        var environmentList = character.type == CharacterType.KlingonWarrior ? this._klingonEnvironments : this._environments;
        for (var environment in environmentList) {
            var env = environmentList[environment];
            if (n !== Environment.AnotherSpeciesWorld) {
                environments.push(new EnvironmentViewModel(n, env));
            }
            n++;
        }

        environments = environments.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        SpeciesHelper.getSpecies().forEach(s => {
            environments.push(new EnvironmentViewModel(
                Environment.AnotherSpeciesWorld,
                new EnvironmentModel(
                    `Another Species' World (${s.name})`,
                    environmentList[Environment.AnotherSpeciesWorld].description,
                    s.attributes,
                    environmentList[Environment.AnotherSpeciesWorld].disciplines)));
        });

        return environments;
    }

    getEnvironment(env: Environment) {
        var environmentList = character.type == CharacterType.KlingonWarrior ? this._klingonEnvironments : this._environments;
        return environmentList[env];
    }

    generateEnvironment() {
        var roll = Math.floor(Math.random() * 6);
        return roll;
    }

    applyEnvironment(env: Environment) {
    }
}

export const EnvironmentsHelper = new Environments();
