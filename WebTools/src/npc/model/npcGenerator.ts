import { Character, SpeciesStep } from "../../common/character";
import { CharacterType } from "../../common/characterType";
import { Stereotype } from "../../common/construct";
import { D20 } from "../../common/die";
import { AttributesHelper } from "../../helpers/attributes";
import { Career } from "../../helpers/careerEnum";
import { RanksHelper, Rank } from "../../helpers/ranks";
import { Skill, SkillsHelper } from "../../helpers/skills";
import { Species } from "../../helpers/speciesEnum";
import { SpeciesModel } from "../../helpers/species";
import { TalentsHelper, ToViewModel } from "../../helpers/talents";
import { NameGenerator } from "../nameGenerator";
import { NpcType, NpcTypes } from "./npcType";
import { Specialization, SpecializationModel, Specializations } from "./specializations";

class RankWithTier {
    readonly name: string;
    readonly rank: Rank;
    readonly tier?: number;

    constructor(name: string, rank: Rank, tier?: number) {
        this.name = name;
        this.rank = rank;
        this.tier = tier;
    }
}

const recreationSkills = [ "Holodeck Simulations", "Dixie Hill Adventures",
    "Model Ship Building", "Bolian Neo-Metal Bands", "Early Human Spaceflight",
    "Oil Painting", "Camping", "Survival", "Gourmet Cooking", "Bajoran Spirituality",
    "Klingon Chancellors", "Ice Fishing", "Musical Instrument", "Barbeque Grilling",
    "History of the Human Civil Rights Movement", "Classical Jazz", "The Sacred Texts of Betazed",
    "Games of Chance", "Spy Holonovels", "White Water Rafting", "The Human Beatnik Era",
    "Borg Threat Assessment", "The History of Romulan Coups", "The Bajoran Age of Sail",
    "Water Vessels", "Historical Re-enactment", "Whiskey Tasting", "Wine Making", "Darts",
    "Meditation", "Kal-toh", "Taoism", "Target Practice", "Airboating", "Dog Training",
    "Horseback Riding", "Bolian Comedy", "Sushi Preparation", "Theology and Alien Superbeings",
    "Mining", "Animal Husbandry", "Flirting", "Antiques", "Hiking", "The Teachings of Surak",
    "Skydiving", "Pastry Chef", "Anbo-jyutsu", "Flotter Stories", "Cocktails", "Merchant Ships",
    "Appraisal", "The Ferengi Rules of Acquisition", "Interpretive Dance",
    "The Plays of Anton Chekhov", "Pre-Raphaelite Painters", "Andorian Electronic Dance Music",
    "Gourmet Raktajino Barista", "Karaoke", "Tongo", "Galeo-Manado Wrestling",
    "Andorian Clans of the Pre-Industrial Period", "Risan Vacation Activities",
    "Trashy Romance Novels", "Parrises squares", "Neo-Sevrin Philosophy" ];

const starfleetSkills = ["Starfleet Protocols", "Worlds of the Federation", "Starship Emergency Protocols",
    "Tricoders", "History of the Federation", "The Missions of Adm. Archer and the NX-01",
    "Early Starfleet History", "Starfleet General Orders", "The Missions of Commodore Decker",
    "Starship Identification", "Androids and Synthetic Life", "Holodeck Programming", "Federation Wars",
    "Battle Tactics of Captain Garth", "Federation Species", "Tactical Use of Logic Puzzles for Defeating AIs",
    "First Contact Protocols", "The Prime Directive", "Abandon Ship Procedures", "Space Suits",
    "Zero-G Operations"];



const starfleetValues = [
    "I am so close to promotion, I can taste it.",
    "Risk is our business!",
    "The Prime Directive is our highest law.",
    "I saw things in the war... horrible, horrible things",
    "The crew is my family.",
    "Loyal to my commanding officer",
    "I have my orders.",
    "The chain of command is essential",
    "Starfleet rules are rigid, but necessary",
    "Seek out new life and new civilizations",
    "Infinite Diversity in Infinite Combinations",
    "It's the Prime Directive, not the Only Directive",
    "Please. Let us help you.",
    "Starfleet is the only family I've ever needed.",
    "My team has my back"
];

const generalValues = [
    "Mentally, I'm already on leave to Risa!",
    "I have a special someone back home.",
    "Looking for love in all the wrong places",
    "I can't wait to get back to my holonovel",
    "That which does not kill me makes me stranger!",
    "I'm not doing the non-corporeal body-stealing alien thing again!",
    "My word is my bond",
    "Show-off",
    "Braggart",
    "Teller of Tall-Tales",
    "A Vulcan, a Romulan, and a Klingon walk into a bar...",
    "Exceptionally dedicated",
    "Everyone deserves a shot at a second chance",
    "Violence is the last refuge of the incompetent."
];

const speciesSpecificValues: { [species : number ]: string[]} = {
    [ Species.Vulcan ] : [
        "Logic is the beginning of wisdom",
        "One can start with irrational premises and still use logical processes",
        "There are always possibilities",
        "Greater precision can't hurt",
        "You must control your passions; they will be your undoing",
        "May we together become greater than the sum of both of us",
        "Vulcans believe that peace should not depend on force.",
        "I wish to spend this time in contemplative meditation.",
        "Music has fascinating mathematical properties",
        "Fascinating",
        "Live long and prosper"
    ],
    [ Species.Andorian ] : [
        "My blood flows with ice like my Andorian ancestors!",
        "My people are a very violent people",
        "The Vulcans say that the desert teaches one the meaning of endurance, but it's the ice that forges real strength",
        "The honour of my clan demands it!",
        "I'll take your blood to Andoria... to the Wall of Heroes!",
        "I come from one of the great clans of Andoria!",
        "My grandmother in her dotage was a greater warrior than you!",
        "Passion! Exhilaration! Excellence! These are the vital components of life!"
    ],
    [ Species.Human ] : [
        "You only live once!",
        "Live fast and die hard!",
        "Life of the party!",
        "Humanity has had its ugly chapters. We try to learn, to make amends, and to grow.",
        "To strive, to seek, to find, and not to yield.",
        "To err is human...",
        "sic itur ad astra",
        "The potential to make yourself a better person... that is what it is to be Human... to make yourself more than you are."
    ],
    [ Species.Tellarite ] : [
        "If it cannot stand up to scrutiny, it should be torn down",
        "Enough with the flowery words; say what you really mean!",
        "Speak plainly!",
        "We're not a patient people.",
        "I'm told this ship is the pride of Starfleet. I find it small and unimpressive.",
        "Let's consider all sides of this argument",
        "I listened to your point of view, now you should listen to mine!",
        "You're being seduced by wishful thinking! Practicality, not hope, is what we need!"
    ],
    [ Species.Bajoran ] : [
        "Walk with the Prophets",
        "The Prophets teach patience",
        "You have a strong pagh",
        "I was a soldier, trying to free my world!",
        "That's the thing about faith. If you don't have it, you can't understand it. And if you do, no explanation is necessary.",
        "I'll probably never fully forgive the Cardassians",
        "The Bajorans were a peaceful people before the Cardassians came.",
        "I did things. Things that had to be done. I'm not going to beat myself up over that."
    ],
    [ Species.Denobulan ] : [
        "I think it all sounds rather exciting, don't you?",
        "I'm excited to tell you that my significant other finds you very attractive",
        "Family relations can be extremely complicated",
        "If you're going to try to embrace new worlds, you must try to embrace new ideas",
        "Ah. A new species. Delightful music and wonderful food.",
        "Are you going to finish eating that...?",
        "Communication is the foundation of understanding",
        "Infinite patience yields immediate results",
        "The health of the individual is the health of the community",
        "Curiosity is the spark of progress"
    ],
    [ Species.Trill ] : [
        "The protection of the symbionts is essential to the protection of Trill culture",
        "Those who join with the symbionts are performing our society's most sacred duty",
        "Even if we aren't joined, we should embody the highest standards of behaviour",
        "If you want to know who you are, it's important to know who you've been",
        "The past is never truly gone",
        "Individuality is strengthened by unity",
        "The pursuit of knowledge is a lifelong journey",
        "Balance is key",
        "Trust is earned, not given"
    ],
    [ Species.Betazoid ] : [
        "To know oneself is to know others",
        "Honesty is the highest form of respect",
        "Thoughts have power",
        "Peace begins within",
        "All life is precious",
        "Compassion is the highest form of wisdom",
        "We are all one",
        "Seek to understand before seeking to be understood",
        "The heart is the truest compass"
    ]
}


export class NpcGenerator {

    static createNpc(npcType: NpcType, characterType: CharacterType, species: SpeciesModel, specialization: SpecializationModel) {
        let character = new Character();
        character.stereotype = Stereotype.Npc;
        character.type = characterType;
        if (specialization == null) {
            let specializations = Specializations.instance.getSpecializations();
            specialization = specializations[Math.floor(Math.random() * specializations.length)];
        }

        let {name, pronouns} = NameGenerator.instance.createName(species);
        character.name = name;
        character.pronouns = pronouns;
        character.speciesStep = new SpeciesStep(species.id);
        character.jobAssignment = specialization.name;

        NpcGenerator.assignAttributes(npcType, character, species, specialization);

        let disciplines = SkillsHelper.getSkills();
        let disciplinePoints = NpcTypes.disciplinePoints(npcType);

        for (let i = 0; i < disciplinePoints.length; i++) {
            let a = disciplines[Math.floor(Math.random() * disciplines.length)];
            if (i === 0 && specialization.primaryDiscipline != null) {
                a = specialization.primaryDiscipline;
            }
            character.skills[a].expertise = disciplinePoints[i];
            disciplines.splice(disciplines.indexOf(a), 1);
        }

        let careers = [Career.Young, Career.Young, Career.Young, Career.Young, Career.Young, Career.Young, Career.Young,
            Career.Experienced, Career.Experienced, Career.Experienced, Career.Experienced, Career.Experienced, Career.Experienced,
            Career.Experienced, Career.Veteran, Career.Veteran];

        character.career = specialization.id === Specialization.Admiral ? Career.Veteran : careers[Math.floor(Math.random() * careers.length)];
        character.enlisted = (Math.random() < specialization.officerProbability) ? false : true;

        NpcGenerator.assignRank(character, specialization);
        NpcGenerator.assignFocuses(npcType, character, specialization);
        NpcGenerator.assignValues(npcType, character, specialization);
        NpcGenerator.assignTalents(npcType, character, species, specialization);

        return character;
    }

    static assignTalents(npcType: NpcType, character: Character, species: SpeciesModel, specialization: SpecializationModel) {
        let numberOfTalents = NpcTypes.numberOfTalents(npcType);

        for (let i = 0; i < numberOfTalents; i++) {
            let done = false;
            let n = 0;
            while (!done) {
                let talentList = TalentsHelper.getAllAvailableTalentsForCharacter(character);
                let specializationSkill = Skill[specialization.primaryDiscipline];
                let roll = D20.roll();
                if (roll < 7) {
                    // go for species talents
                    talentList = species.talents.map(t => ToViewModel(t, 1, character.type));
                } else if (roll < 14) {
                    talentList = talentList.filter(t => t.category === specializationSkill);
                } else {
                    talentList = talentList.filter(t => {
                        if (t.name.indexOf("Bold:") === 0 || t.name.indexOf("Cautious:") === 0
                            || t.name.indexOf("Collaboration:") === 0) {
                            return t.name.indexOf(specializationSkill) >= 0;
                        } else {
                            return t.category === "" || t.category === "General";
                        }
                    });
                }

                if (talentList.length) {
                    let talent = talentList[Math.floor(Math.random() * talentList.length)];
                    if (!character.hasTalent(talent.name) || talent.hasRank) {
                        character.addTalent(talent);
                        done = true;
                    }
                }

                if (n++ > 100) {
                    break;
                }
            }
        }
    }

    static assignAttributes(npcType: NpcType, character: Character, species: SpeciesModel, specialization: SpecializationModel) {
        let attributes = AttributesHelper.getAllAttributes();
        let attributePoints = NpcTypes.attributePoints(npcType);
        let chances = [20, 14, 8];

        for (let i = 0; i < attributePoints.length; i++) {
            let a = attributes[Math.floor(Math.random() * attributes.length)];
            if (i < specialization.primaryAttributes.length && i < chances.length && D20.roll() <= chances[i]) {
                let temp = specialization.primaryAttributes[Math.floor(Math.random() * specialization.primaryAttributes.length)];
                if (attributes.indexOf(temp) >= 0) {
                    a = temp;
                }
            }
            character.attributes[a].value = attributePoints[i];
            attributes.splice(attributes.indexOf(a), 1);
        }

        let hasMax = character.hasMaxedAttribute();
        let speciesAttributes = [];
        if (species.attributes.length <= 3) {
            for (let i = 0; i < species.attributes.length; i++) {
                let attr = species.attributes[i];
                if (character.attributes[attr].value < 12 &&
                    (!hasMax || character.attributes[attr].value < 11)) {

                    speciesAttributes.push(attr);
                }
            }
        }

        // when adding species attributes, we need to worry about
        // major NPCs who can have a lot of points already allocated;
        // if a species attribute would raise an attribute above the
        // maximums, treat it as if one of the original point
        // spend was in another attribute and the species point
        // can be applied.
        let allAttributes = AttributesHelper.getAllAttributes();
        while (speciesAttributes.length < 3) {

            let attr = allAttributes[Math.floor(Math.random() * allAttributes.length)];
            if (speciesAttributes.indexOf(attr) >= 0) {
                // already have this one. skip it.
            } else if (character.attributes[attr].value < 12 &&
                (!hasMax || character.attributes[attr].value < 11)) {

                speciesAttributes.push(attr);
            }
        }

        for (let i = 0; i < speciesAttributes.length; i++) {
            character.attributes[speciesAttributes[i]].value += 1;
        }
    }

    static assignValues(npcType: NpcType, character: Character, specialization: SpecializationModel) {
        let count = NpcTypes.numberOfValues(npcType);
        for (let i = 0; i < count; i++) {
            let done = false;
            while (!done) {
                let roll = D20.roll();
                let values = specialization.values;
                if (roll < 6) {
                    values = generalValues;
                } else if (roll < 11) {
                    values = starfleetValues;
                } else if (roll < 16) {
                    values = speciesSpecificValues[character.speciesStep.species];
                }

                if (values?.length) {
                    let value = values[Math.floor(Math.random() * values.length)];
                    if (character.values.indexOf(value) < 0) {
                        character.addValue(value);
                        done = true;
                    }
                }
            }
        }
    }

    static assignFocuses(npcType: NpcType, character: Character, specialization: SpecializationModel) {
        let numberOfFocuses = NpcTypes.numberOfFocuses(npcType);
        let primaryChances = [20, 12, 8, 6, 4, 2];
        let secondaryChances = [17, 15, 11, 9, 6, 3];

        for (let i = 0; i < numberOfFocuses; i++) {
            let focuses = (D20.roll() > 10) ? starfleetSkills : recreationSkills;
            if (D20.roll() <= primaryChances[i]) {
                focuses = specialization.primaryFocuses;
            } else if (D20.roll() <= secondaryChances[i]) {
                focuses = specialization.secondaryFocuses;
            }

            let done = false;
            while (!done) {
                let focus = focuses[Math.floor(Math.random() * focuses.length)];
                if (character.focuses.indexOf(focus) < 0) {
                    character.addFocus(focus);
                    done = true;
                }
            }
        }
    }

    static assignRank(character: Character, specialization: SpecializationModel) {
        let ranks = specialization.id === Specialization.Admiral
            ? RanksHelper.instance().getAdmiralRanks(character)
            : RanksHelper.instance().getRanks(character);
        ranks = ranks.filter(r => r.id !== Rank.Yeoman);

        let rankList = [];
        for (const rank of ranks) {
            if (rank.tiers > 1) {
                for (let i = 1; i <= rank.tiers; i++) {
                    rankList.push(new RankWithTier(rank.name, rank.id, i));
                }
            } else {
                rankList.push(new RankWithTier(rank.name, rank.id));
            }
        }

        if (rankList.length > 0) {
            // by using a logarithmic scale, I'm biasing the random values in favour
            // of the ranks at the higher end of the list (which are the more junior ranks)
            let maxValue = Math.pow(Math.E, rankList.length + 1);
            let random = Math.log1p(Math.random() * maxValue);
            let index = Math.min(rankList.length - 1, Math.max(0, Math.floor(random)));
            let rank = rankList[index];

            if (specialization.id === Specialization.MedicalDoctor && rank.rank === Rank.Ensign) {
                character.jobAssignment = specialization.name + " (Resident)";
            }
            RanksHelper.instance().applyRank(character, rank.rank, rank.tier == null ? 1 : rank.tier);
        }
    }

}