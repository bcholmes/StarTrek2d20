import i18next from 'i18next';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import { makeKey } from '../common/translationKey';
import {Attribute} from './attributes';
import {Skill} from './skills';

export enum Upbringing {
    // Core
    MilitaryOrExploration,
    BusinessOrTrade,
    AgricultureOrRural,
    ScienceAndTechnology,
    ArtisticAndCreative,
    DiplomacyAndPolitics,

    // Klingon Core : castes
    Academic,

    // Player's Guide : alternate upbringings
    ToExplore,
    ToFly,
    ToCreate,
    ToDiscover,
    ToProtect,
    ToProsper,
}

export class UpbringingModel {
    id: Upbringing;
    name: string;
    description: string;
    attributeAcceptPlus2: Attribute;
    attributeAcceptPlus1: Attribute;
    attributeRebelPlus2: Attribute;
    attributeRebelPlus1: Attribute;
    disciplines: Skill[];
    focusDescription: string;
    focusSuggestions: string[];
    keyPrefix: string

    constructor(id: Upbringing, name: string, description: string, attributesAcceptPlus2: Attribute, attributesAcceptPlus1: Attribute, attributesRebelPlus2: Attribute, attributesRebelPlus1: Attribute, disciplines: Skill[], focusDescription: string, focusSuggestions: string[], keyPrefix?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.attributeAcceptPlus2 = attributesAcceptPlus2;
        this.attributeAcceptPlus1 = attributesAcceptPlus1;
        this.attributeRebelPlus2 = attributesRebelPlus2;
        this.attributeRebelPlus1 = attributesRebelPlus1;
        this.disciplines = disciplines;
        this.focusDescription = focusDescription;
        this.focusSuggestions = focusSuggestions;
        this.keyPrefix = keyPrefix;
    }

    get localizedName() {
        let key = makeKey(this.keyPrefix, Upbringing[this.id], ".name");
        let result = i18next.t(key);
        return result === key ? this.name : result;
    }
}

class Upbringings {
    private _upbringings: UpbringingModel[] = [
        new UpbringingModel(
            Upbringing.MilitaryOrExploration,
            "Starfleet",
            "The character’s family may have a strong tradition of Starfleet service, with at least one member of the family in every generation serving the Federation in this way. Perhaps both the character’s parents were Starfleet officers, who met in service. Either way, the character’s formative years were influenced by Starfleet.",
            Attribute.Control,
            Attribute.Fitness,
            Attribute.Daring,
            Attribute.Insight,
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security],
            "The character’s Focus should relate to their connection to Starfleet, covering skills learned during the character’s formative years.",
            ["Astronavigation","Composure", "Extra-Vehicular Activity", "Hand-to-Hand Combat","Hand Phasers","Small Craft", "Starfleet Protocol", "Starship Recognition", "History"],
            "Upbringing.starfleet."
        ),
        new UpbringingModel(
            Upbringing.BusinessOrTrade,
            "Business or Trade",
            "The character’s family may have connections on countless worlds, overseeing and directing some grand business endeavor. They might have been traders or involved in interplanetary freight. Either way, the character has grown up encountering people from all walks of life, including those from outside the Federation, and their outlook on life has been shaped accordingly.",
            Attribute.Presence,
            Attribute.Daring,
            Attribute.Insight,
            Attribute.Reason,
            [Skill.Command, Skill.Engineering, Skill.Science],
            "The character’s Focus should relate to the nature of their family’s business, covering skills that are valuable during trade, or which were useful to the family business in other ways.",
            ["Finances", "Geology", "Linguistics", "Manufacturing", "Metallurgy", "Negotiation", "Survey"],
            "Upbringing.starfleet."
        ),
        new UpbringingModel(
            Upbringing.AgricultureOrRural,
            "Agriculture or Rural",
            "The character grew up surrounded more by nature than by people, in rural communities, on the frontier, or somewhere else distanced from the bustle of cities. They might be heavily involved in agriculture, growing real food to supplement synthesized or replicated meals.",
            Attribute.Fitness,
            Attribute.Control,
            Attribute.Reason,
            Attribute.Presence,
            [Skill.Conn, Skill.Medicine, Skill.Security],
            "The character’s Focus should relate to the character’s rural lifestyle, and the skills they learned there.",
            ["Animal Handling", "Athletics", "Emergency Medicine", "Endurance", "Ground Vehicles", "Infectious Diseases", "Navigation", "Toxicology"],
            "Upbringing.starfleet."
        ),
        new UpbringingModel(
            Upbringing.ScienceAndTechnology,
            "Science and Technology",
            "The character’s home was one filled with the potential of science, and cutting edge developments were familiar ground. Perhaps the character was raised by scientists or engineers, or had mentors and teachers who encouraged a talent for the technical.",
            Attribute.Control,
            Attribute.Reason,
            Attribute.Insight,
            Attribute.Daring,
            [Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science],
            "The character’s Focus should relate to the character’s favoured fields of study and inquiry.",
            ["Astrophysics", "Astronavigation", "Computers", "Cybernetics", "Power Systems", "Genetics", "Physics", "Subspace Communications", "Surgery", "Quantum Mechanics", "Warp Field Dynamics", "Xenobiology"]
        ),
        new UpbringingModel(
            Upbringing.ArtisticAndCreative,
            "Artistic and Creative",
            "The character’s life was filled with arts and creativity of all kinds, and no matter what pursuits the character favors, they are exposed to the great works of many cultures, and given every opportunity to express themselves.",
            Attribute.Presence,
            Attribute.Insight,
            Attribute.Fitness,
            Attribute.Daring,
            [Skill.Command, Skill.Engineering, Skill.Science],
            "The character’s Focus should relate to the character’s preferred way of applying their skills.",
            ["Botany", "Cultural Studies", "Holoprogramming", "Linguistics", "Music", "Observation", "Persuasion", "Psychology"]
        ),
        new UpbringingModel(
            Upbringing.DiplomacyAndPolitics,
            "Diplomacy and Politics",
            "The character has been exposed to the complexities of political thought and the nuances of diplomacy since they were young, perhaps because a family member was involved in those fields.",
            Attribute.Presence,
            Attribute.Control,
            Attribute.Reason,
            Attribute.Fitness,
            [Skill.Command, Skill.Conn, Skill.Security],
            "The character’s Focus should relate to the character’s preferred way of applying their skills.",
            ["Composure", "Debate", "Diplomacy", "Espionage", "Interrogation", "Law", "Philosophy", "Starfleet Protocol"]
        ),
    ];

    private _alternateUpbringings: UpbringingModel[] = [
        new UpbringingModel(
            Upbringing.ToExplore,
            "To Explore",
            "You dreamed of exploring strange new worlds, seeking out new life and new civilizations, and boldly going where no one had gone before. You read everything you could about the bold explorers of the past and dreamed of one day sitting in the captain’s chair of your own starship.",
            Attribute.Presence,
            Attribute.Fitness,
            Attribute.Reason,
            Attribute.Control,
            [Skill.Command, Skill.Science],
            "Your focus should relate to your dreams, covering skills learned because they were the kinds of things that explorers needed to know.",
            ["Astronavigation", "Composure", "Diplomacy", "Linguistics", "Starship Recognition", "Team Dynamics", "Wilderness Survival"]
        ),
        new UpbringingModel(
            Upbringing.ToFly,
            "To Fly",
            "You saw shuttles and transports soar overhead, and wanted to be up there with them, in the skies and among the stars. You took pilot’s lessons as soon as you were able and may have gotten in trouble a few times as a child for pushing your craft a little too far.",
            Attribute.Control,
            Attribute.Daring,
            Attribute.Insight,
            Attribute.Reason,
            [Skill.Conn, Skill.Engineering],
            "Your focus should relate to your dreams, covering skills learned because they would help you fly.",
            ["Astronavigation", "Helm Operations", "Small Craft", "Starship Recognition", "Propulsion Systems"]
        ),
        new UpbringingModel(
            Upbringing.ToCreate,
            "To Create",
            "Locked away within your mind have always been things that didn’t exist. Your imagination has always been filled with ideas for things that might be, or could be, rather than simply things that already were. And you wanted to show people the worlds you saw. Whether your creations would take the form of works of fiction or new inventions to change the world, your creativity is boundless.",
            Attribute.Insight,
            Attribute.Presence,
            Attribute.Daring,
            Attribute.Control,
            [Skill.Command, Skill.Engineering],
            "Your focus should relate to your creativity, which is likely to relate to art or engineering.",
            ["Literature", "Theatre", "Art", "Holoprogramming", "Computers", "Cybernetics", "Structural Engineering", "Transporters & Replicators", "Warp Field Dynamics"]
        ),
        new UpbringingModel(
            Upbringing.ToDiscover,
            "To Discover",
            "You want to know what’s out there. “Out there” might be the furthest reaches of unexplored space, or it might be the tiniest subatomic realms, or the depths of the mind, or the myriad complexities of the body, or some other field. Your drive is to find that which is unknown and to make it known.",
            Attribute.Reason,
            Attribute.Presence,
            Attribute.Fitness,
            Attribute.Insight,
            [Skill.Medicine, Skill.Science],
            "Your focus should relate to your dreams, representing the field you were most curious about growing up.",
            ["Anthropology", "Astrophysics", "Botany", "Genetics", "Linguistics", "Psychology", "Quantum Mechanics", "Xenobiology"]
        ),
        new UpbringingModel(
            Upbringing.ToProtect,
            "To Protect",
            "Your first concern is helping others. You have a deep disdain for anyone who would bring harm to the people you care about, or you have a deep compassion for those who have come to harm and seek to give them aid and comfort. Or both.",
            Attribute.Daring,
            Attribute.Fitness,
            Attribute.Control,
            Attribute.Reason,
            [Skill.Security, Skill.Medicine],
            "Your focus should relate to the skills you honed protecting and caring for others.",
            ["Hand-to-Hand Combat (may rename as a specific Martial Art)", "Hand Phasers", "Survival", "Threat Awareness", "Emergency Medicine", "Triage"]
        ),
        new UpbringingModel(
            Upbringing.ToProsper,
            "To Prosper",
            "Success is your goal. This might mean fame or recognition in a particular field, or it might mean wealth, or influence, or power. There may be some noble agenda behind this – a desire to overcome being powerless or to escape hardship, or to be able to provide for family – or it may just be pure ambition, even greed. In whatever ways you seek to prosper, you have the drive to seize the chances you get, and, as the Ferengi say, the lobes to hear the opportunities coming your way.",
            Attribute.Presence,
            Attribute.Daring,
            Attribute.Fitness,
            Attribute.Insight,
            [Skill.Command, Skill.Conn, Skill.Security, Skill.Engineering, Skill.Medicine, Skill.Science],
            "Your focus should relate to the ways you intend to make your way in the galaxy.",
            ["Computers", "Genetics", "Holoprogramming", "Music (may rename as a particular genre or instrument)", "Persuasion", "Philosophy", "Politics", "Trade & Finance"]
        ),
    ];

    private _genericUpbringings: UpbringingModel[] = [
        new UpbringingModel(
            Upbringing.MilitaryOrExploration,
            "Military or Exploration",
            "The character’s family may have a strong tradition of military/exploration service, with at least one member of the family in every generation serving in this way. Perhaps both the character’s parents were military officers/explorers, who met in service. Either way, the character’s formative years were influenced by the service.",
            Attribute.Control,
            Attribute.Fitness,
            Attribute.Daring,
            Attribute.Insight,
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security],
            "The character’s Focus should relate to their connection to the service, covering skills learned during the character’s formative years.",
            ["Astronavigation","Composure", "Extra-Vehicular Activity", "Hand-to-Hand Combat","Hand Phasers","Small Craft", "Military Protocol", "Starship Recognition", "History"]
        ),
        new UpbringingModel(
            Upbringing.BusinessOrTrade,
            "Business or Trade",
            "The character’s family may have connections on countless worlds, overseeing and directing some grand business endeavor. They might have been traders or involved in interplanetary freight. Either way, the character has grown up encountering people from all walks of life, including those from outside their government's borders, and their outlook on life has been shaped accordingly.",
            Attribute.Presence,
            Attribute.Daring,
            Attribute.Insight,
            Attribute.Reason,
            [Skill.Command, Skill.Engineering, Skill.Science],
            "The character’s Focus should relate to the nature of their family’s business, covering skills that are valuable during trade, or which were useful to the family business in other ways.",
            ["Finances", "Geology", "Linguistics", "Manufacturing", "Metallurgy", "Negotiation", "Survey"]
        ),
        new UpbringingModel(
            Upbringing.AgricultureOrRural,
            "Agriculture or Rural",
            "The character grew up surrounded more by nature than by people, in rural communities, on the frontier, or somewhere else distanced from the bustle of cities. They might be heavily involved in agriculture, growing real food to supplement synthesized or replicated meals.",
            Attribute.Fitness,
            Attribute.Control,
            Attribute.Reason,
            Attribute.Presence,
            [Skill.Conn, Skill.Medicine, Skill.Security],
            "The character’s Focus should relate to the character’s rural lifestyle, and the skills they learned there.",
            ["Animal Handling", "Athletics", "Emergency Medicine", "Endurance", "Ground Vehicles", "Infectious Diseases", "Navigation", "Toxicology"]
        ),
        new UpbringingModel(
            Upbringing.ScienceAndTechnology,
            "Science and Technology",
            "The character’s home was one filled with the potential of science, and cutting edge developments were familiar ground. Perhaps the character was raised by scientists or engineers, or had mentors and teachers who encouraged a talent for the technical.",
            Attribute.Control,
            Attribute.Reason,
            Attribute.Insight,
            Attribute.Daring,
            [Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science],
            "The character’s Focus should relate to the character’s favoured fields of study and inquiry.",
            ["Astrophysics", "Astronavigation", "Computers", "Cybernetics", "Power Systems", "Genetics", "Physics", "Subspace Communications", "Surgery", "Quantum Mechanics", "Warp Field Dynamics", "Xenobiology"]
        ),
        new UpbringingModel(
            Upbringing.ArtisticAndCreative,
            "Artistic and Creative",
            "The character’s life was filled with arts and creativity of all kinds, and no matter what pursuits the character favors, they are exposed to the great works of many cultures, and given every opportunity to express themselves.",
            Attribute.Presence,
            Attribute.Insight,
            Attribute.Fitness,
            Attribute.Daring,
            [Skill.Command, Skill.Engineering, Skill.Science],
            "The character’s Focus should relate to the character’s preferred way of applying their skills.",
            ["Botany", "Cultural Studies", "Holoprogramming", "Linguistics", "Music", "Observation", "Persuasion", "Psychology"]
        ),
        new UpbringingModel(
            Upbringing.DiplomacyAndPolitics,
            "Diplomacy and Politics",
            "The character has been exposed to the complexities of political thought and the nuances of diplomacy since they were young, perhaps because a family member was involved in those fields.",
            Attribute.Presence,
            Attribute.Control,
            Attribute.Reason,
            Attribute.Fitness,
            [Skill.Command, Skill.Conn, Skill.Security],
            "The character’s Focus should relate to the character’s preferred way of applying their skills.",
            ["Composure", "Debate", "Diplomacy", "Espionage", "Interrogation", "Law", "Philosophy", "Starfleet Protocol"]
        ),
    ];

    private _castes: UpbringingModel[] = [
        new UpbringingModel(
            Upbringing.MilitaryOrExploration,
            "Warrior",
            "Yours is a family of warriors, who have served the Empire with honor for generations. At least one member of your family in each generation will have gone to war for the Empire, and you were raised to tales of glorious battle.",
            Attribute.Control,
            Attribute.Fitness,
            Attribute.Daring,
            Attribute.Insight,
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security],
            "Your focus should relate to your upbringing, covering skills learned during your formative years.",
            ["Composure", "Hand-to-Hand Combat (may be renamed to a particular style or weapon)", "Disruptors", "Intimidation", "Military History", "Small Craft", "Starship Recognition", "Survival."]
        ),
        new UpbringingModel(
            Upbringing.BusinessOrTrade,
            "Merchant",
            "Your family members are traders, with connections on countless worlds, buying, moving, and selling goods across the Empire and to distant trading partners. You may have been raised into the world of commerce and trade or grown up on an interstellar freighter carrying vital cargo. Regardless, you’ve grown up encountering people from all walks of life, including those from outside the Empire, and your outlook on life has been shaped accordingly.",
            Attribute.Presence,
            Attribute.Daring,
            Attribute.Insight,
            Attribute.Reason,
            [Skill.Command, Skill.Engineering, Skill.Science],
            "Your focus should relate to your upbringing, covering skills learned during your formative years.",
            ["Finances", "Geology", "Linguistics", "Manufacturing", "Metallurgy", "Negotiation", "Survey"]
        ),
        new UpbringingModel(
            Upbringing.ScienceAndTechnology,
            "Scientific",
            "Your family home was one filled with the potential of science, and cutting-edge developments were familiar ground, even if those pursuits are not well-appreciated by other Klingons. Where would the Empire be without warp drive, disruptors, cloaking devices, or even the alloys which make a warrior’s blades? Your family has always been one of those studying and providing these advances, for all that the outside Galaxy thinks that ‘Klingon scientist’ is a contradiction.",
            Attribute.Control,
            Attribute.Reason,
            Attribute.Insight,
            Attribute.Daring,
            [Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science],
            "Your focus should relate to your upbringing, covering skills learned during your formative years.",
            ["Astrophysics", "Astronavigation", "Computers", "Cybernetics", "Power Systems", "Genetics", "Physics", "Subspace Communications", "Temporal Mechanics", "Surgery", "Quantum Mechanics", "Warp Field Dynamics", "Xenobiology"]
        ),
        new UpbringingModel(
            Upbringing.AgricultureOrRural,
            "Agriculture",
            "You grew up surrounded more by nature than by people, in rural communities, on the frontier, or somewhere else distant from the bustle of cities. Your family might be heavily involved in agriculture, growing real food, maintaining hunting grounds, or rearing livestock. Unlike the Federation, you do not rely on replicated food, inert and synthetic: a Klingon requires fresh, living food to sustain them, and your family has provided this for generations.",
            Attribute.Fitness,
            Attribute.Control,
            Attribute.Reason,
            Attribute.Presence,
            [Skill.Conn, Skill.Medicine, Skill.Security],
            "Your focus should relate to your upbringing, covering skills learned during your formative years.",
            ["Animal Handling", "Athletics", "Emergency Medicine", "Endurance", "Ground Vehicles", "Infectious Diseases", "Navigation", "Toxicology", "Survival Training"]
        ),
        new UpbringingModel(
            Upbringing.ArtisticAndCreative,
            "Artistic",
            "Your life was filled with arts and creativity of all kinds, and no matter the pursuits you favor, you’ve been exposed to the great works not only of the Empire’s storied history but also that of other cultures and given every opportunity to express yourself. Different forms of art are appreciated to different degrees amongst Klingons, but the performing arts are especially beloved: many warriors fancy themselves as poets or playwrights in the manner of WIlyam SeQpIr when recounting a glorious victory, and Klingon opera is known and studied across the Alpha and Beta Quadrants.",
            Attribute.Presence,
            Attribute.Insight,
            Attribute.Fitness,
            Attribute.Daring,
            [Skill.Command, Skill.Engineering, Skill.Science],
            "The character’s Focus should relate to the character’s preferred way of applying their skills.",
            ["Botany", "Cultural Studies", "Holoprogramming", "Linguistics", "Music", "Observation", "Persuasion", "Psychology"]
        ),
        new UpbringingModel(
            Upbringing.Academic,
            "Academic",
            "You’ve been surrounded by the complexities of political thought, the nuances of diplomacy, and intense study of a range of subjects and fields for your entire life. Your family is one of lawyers, civil servants, historians, diplomats, and more besides, maintaining the fabric of Empire just as the farmers feed it, the merchants keep it supplied, and the warriors protect it. The Klingon Empire is a nation often led by warriors, but it is the learned who govern it and keep it running, often without the respect such endeavors deserve.",
            Attribute.Control,
            Attribute.Reason,
            Attribute.Fitness,
            Attribute.Insight,
            [Skill.Command, Skill.Security, Skill.Science],
            "Your focus should relate to your upbringing, covering skills learned during your formative years.",
            ["Composure", "Debate", "Diplomacy", "Espionage", "Etiquette", "Interrogation", "Law", "Philosophy"]
        ),
    ];

    private getUpbringingList(type: CharacterType, alternate: boolean) {
        if (alternate) {
            return this._alternateUpbringings;
        } else if (type === CharacterType.Starfleet) {
            return this._upbringings;
        } else if (type === CharacterType.KlingonWarrior) {
            return this._castes;
        } else {
            return this._genericUpbringings;
        }
    }

    getUpbringings(alternate: boolean) {
        var upbringings: UpbringingModel[] = [];
        var list = this.getUpbringingList(character.type, alternate);
        for (let upbringing of list) {
            upbringings.push(upbringing);
        }

        return upbringings.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    generateUpbringing(alternate: boolean) {
        let list = this.getUpbringingList(character.type, alternate);
        var roll = Math.floor(Math.random() * list.length);
        return list[roll];
    }

    applyUpbringing(upbringing: UpbringingModel, accepted: boolean) {

        if (accepted) {
            character.attributes[upbringing.attributeAcceptPlus2].value += 2;
            character.attributes[upbringing.attributeAcceptPlus1].value += 1;
        } else {
            character.attributes[upbringing.attributeRebelPlus2].value += 2;
            character.attributes[upbringing.attributeRebelPlus1].value += 1;
        }
    }

    getUpbringingByTypeName(typeName: string, type: CharacterType) {
        let list = this.getUpbringingList(type, false);
        let filteredList = list.filter(u => Upbringing[u.id] === typeName);
        if (filteredList.length === 0) {
            list = this.getUpbringingList(type, true);
            filteredList = list.filter(u => Upbringing[u.id] === typeName);
        }
        return filteredList.length === 0 ? undefined : filteredList[0];
    }
}

export const UpbringingsHelper = new Upbringings();
