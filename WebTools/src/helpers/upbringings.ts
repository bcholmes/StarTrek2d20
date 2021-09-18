import {character, CharacterType} from '../common/character';
import {Attribute, AttributesHelper} from './attributes';
import {SkillsHelper, Skill} from './skills';
import {SpeciesHelper} from './species';

export enum Upbringing {
    // Core
    Starfleet,
    BusinessOrTrade,
    AgricultureOrRural,
    ScienceAndTechnology,
    ArtisticAndCreative,
    DiplomacyAndPolitics,

    // Klingon Core : castes
    Warrior,
    Merchant,
    Scientific,
    Agriculture,
    Artistic,
    Academic,
}

class UpbringingModel {
    name: string;
    description: string;
    attributeAcceptPlus2: Attribute;
    attributeAcceptPlus1: Attribute;
    attributeRebelPlus2: Attribute;
    attributeRebelPlus1: Attribute;
    disciplines: Skill[];
    focusDescription: string;
    focusSuggestions: string[];

    constructor(name: string, description: string, attributesAcceptPlus2: Attribute, attributesAcceptPlus1: Attribute, attributesRebelPlus2: Attribute, attributesRebelPlus1: Attribute, disciplines: Skill[], focusDescription: string, focusSuggestions: string[]) {
        this.name = name;
        this.description = description;
        this.attributeAcceptPlus2 = attributesAcceptPlus2;
        this.attributeAcceptPlus1 = attributesAcceptPlus1;
        this.attributeRebelPlus2 = attributesRebelPlus2;
        this.attributeRebelPlus1 = attributesRebelPlus1;
        this.disciplines = disciplines;
        this.focusDescription = focusDescription;
        this.focusSuggestions = focusSuggestions;
    }
}

class UpbringingViewModel extends UpbringingModel {
    id: Upbringing;

    constructor(id: Upbringing, base: UpbringingModel) {
        super(base.name, base.description, base.attributeAcceptPlus2, base.attributeAcceptPlus1, base.attributeRebelPlus2, base.attributeRebelPlus1, base.disciplines, base.focusDescription, base.focusSuggestions);
        this.id = id;
    }
}

class Upbringings {
    private _upbringings: { [id: number]: UpbringingModel } = {
        [Upbringing.Starfleet]: new UpbringingModel(
            "Starfleet",
            "The character’s family may have a strong tradition of Starfleet service, with at least one member of the family in every generation serving the Federation in this way. Perhaps both the character’s parents were Starfleet officers, who met in service. Either way, the character’s formative years were influenced by Starfleet.",
            Attribute.Control,
            Attribute.Fitness,
            Attribute.Daring,
            Attribute.Insight,
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security],
            "The character’s Focus should relate to their connection to Starfleet, covering skills learned during the character’s formative years.",
            ["Astronavigation","Composure", "Extra-Vehicular Activity", "Hand-to-Hand Combat","Hand Phasers","Small Craft", "Starfleet Protocol", "Starship Recognition", "History"]
        ),
        [Upbringing.BusinessOrTrade]: new UpbringingModel(
            "Business or Trade",
            "The character’s family may have connections on countless worlds, overseeing and directing some grand business endeavor. They might have been traders or involved in interplanetary freight. Either way, the character has grown up encountering people from all walks of life, including those from outside the Federation, and their outlook on life has been shaped accordingly.",
            Attribute.Presence,
            Attribute.Daring,
            Attribute.Insight,
            Attribute.Reason,
            [Skill.Command, Skill.Engineering, Skill.Science],
            "The character’s Focus should relate to the nature of their family’s business, covering skills that are valuable during trade, or which were useful to the family business in other ways.",
            ["Finances", "Geology", "Linguistics", "Manufacturing", "Metallurgy", "Negotiation", "Survey"]
        ),
        [Upbringing.AgricultureOrRural]: new UpbringingModel(
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
        [Upbringing.ScienceAndTechnology]: new UpbringingModel(
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
        [Upbringing.ArtisticAndCreative]: new UpbringingModel(
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
        [Upbringing.DiplomacyAndPolitics]: new UpbringingModel(
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
    };

    private _castes: { [id: number]: UpbringingModel } = {
        [Upbringing.Warrior]: new UpbringingModel(
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
        [Upbringing.Merchant]: new UpbringingModel(
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
        [Upbringing.Scientific]: new UpbringingModel(
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
        [Upbringing.Agriculture]: new UpbringingModel(
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
        [Upbringing.Artistic]: new UpbringingModel(
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
        [Upbringing.Academic]: new UpbringingModel(
            "Academic",
            "You’ve been surrounded by the complexities of political thought, the nuances of diplomacy, and intense study of a range of subjects and fields for your entire life. Your family is one of lawyers, civil servants, historians, diplomats, and more besides, maintaining the fabric of Empire just as the farmers feed it, the merchants keep it supplied, and the warriors protect it. The Klingon Empire is a nation often led by warriors, but it is the learned who govern it and keep it running, often without the respect such endeavors deserve.",
            Attribute.Presence,
            Attribute.Control,
            Attribute.Reason,
            Attribute.Fitness,
            [Skill.Command, Skill.Conn, Skill.Security],
            "Your focus should relate to your upbringing, covering skills learned during your formative years.",
            ["Composure", "Debate", "Diplomacy", "Espionage", "Etiquette", "Interrogation", "Law", "Philosophy"]
        ),
    };

    getUpbringings() {
        var upbringings: UpbringingViewModel[] = [];
        var n = character.type === CharacterType.KlingonWarrior ? Upbringing.Warrior : 0;
        var list = character.type === CharacterType.KlingonWarrior ? this._castes : this._upbringings;
        for (var upbringing in list) {
            var upb = list[upbringing];
            upbringings.push(new UpbringingViewModel(n, upb));
            n++;
        }

        return upbringings.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    public getUpbringing(upbringing: Upbringing) {
        if (upbringing == null) {
            return undefined;
        } else if (character.type === CharacterType.KlingonWarrior) {
            return this._castes[upbringing];
        } else {
            return this._upbringings[upbringing];
        }
    }

    generateUpbringing() {
        var roll = Math.floor(Math.random() * 6);
        return roll + (character.type === CharacterType.KlingonWarrior ? 6 : 0);
    }

    applyUpbringing(upbringing: Upbringing, accepted: boolean) {
        const upb = this.getUpbringing(upbringing);

        if (accepted) {
            character.attributes[upb.attributeAcceptPlus2].value += 2;
            character.attributes[upb.attributeAcceptPlus1].value += 1;
        } else {
            character.attributes[upb.attributeRebelPlus2].value += 2;
            character.attributes[upb.attributeRebelPlus1].value += 1;
        }
    }
}

export const UpbringingsHelper = new Upbringings();
