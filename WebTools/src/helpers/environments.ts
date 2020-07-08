import {Attribute, AttributesHelper} from './attributes';
import {SkillsHelper, Skill} from './skills';
import {SpeciesHelper} from './species';
import {character} from '../common/character';

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
            [Skill.Command, Skill.Science, Skill.Security]
        ),
        [Environment.BusyColony]: new EnvironmentModel(
            "Busy Colony",
            "The character comes from one of their culture’s oldest or most prosperous colonies, which may be another world within their home system — such as Luna or Mars for Humans — or one of the first worlds colonized after the culture achieved interstellar flight. These colonies often develop a fiercely independent outlook, often having developed with little direct aid from their homeworld, and a sense of pride that accompanies being amongst the first of their kind to tame another world.",
            [Attribute.Daring, Attribute.Presence],
            [Skill.Command, Skill.Science, Skill.Security]
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

    getEnvironments() {
        var environments: EnvironmentViewModel[] = [];
        var n = 0;
        for (var environment in this._environments) {
            var env = this._environments[environment];
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
                    this._environments[Environment.AnotherSpeciesWorld].description,
                    s.attributes,
                    this._environments[Environment.AnotherSpeciesWorld].disciplines)));
        });

        return environments;
    }

    getEnvironment(env: Environment) {
        return this._environments[env];
    }

    generateEnvironment() {
        var roll = Math.floor(Math.random() * 6);
        return roll;
    }

    applyEnvironment(env: Environment) {
    }
}

export const EnvironmentsHelper = new Environments();
