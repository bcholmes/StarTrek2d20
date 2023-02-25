import { Character, SpeciesStep } from "../../common/character";
import { CharacterType } from "../../common/characterType";
import { Stereotype } from "../../common/construct";
import { D20 } from "../../common/die";
import { AttributesHelper } from "../../helpers/attributes";
import { Career } from "../../helpers/careerEnum";
import { RanksHelper, Rank } from "../../helpers/ranks";
import { Skill, SkillsHelper } from "../../helpers/skills";
import { SpeciesModel } from "../../helpers/species";
import { TalentsHelper, ToViewModel } from "../../helpers/talents";
import { NameGenerator } from "../nameGenerator";
import { NpcType, NpcTypes } from "./npcType";
import { Specialization, SpecializationModel, Specializations } from "./specializations";

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
    "Andorian Clans of the Pre-Industrial Period", "Risan Vacation Activities" ];

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
    "It's the Prime Directive, not the Only Directive"
];

const generalValues = [
    "Mentally, I'm already on leave to Risa!",
    "I have a special someone back home.",
    "Looking for love in all the wrong places",
    "I can't wait to get back to my holonovel",
    "That which does not kill me makes me stranger!",
    "I'm not doing the non-corporeal body-stealing alien thing again!",
    "My word is my bond",
    "Life of the party!",
    "Show-off",
    "Braggart",
    "Teller of Tall-Tales",
    "A Vulcan, a Romulan, and a Klingon walk into a bar...",
    "Exceptionally dedicated"
];


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

        character.career = careers[Math.floor(Math.random() * careers.length)];
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
                if (roll <= 6) {
                    values = generalValues;
                } else if (roll <= 12) {
                    values = starfleetValues;
                }

                if (values.length > 0) {
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
        let ranks = RanksHelper.instance().getRanks(character);
        if (specialization.id === Specialization.Admin) {
            ranks = ranks.filter(r => r.id !== Rank.Crewman && r.id !== Rank.Specialist);
        } else {
            ranks = ranks.filter(r => r.id !== Rank.Yeoman);
        }

        if (ranks.length > 0) {
            let rank = ranks[Math.floor(Math.random() * ranks.length)];
            if (specialization.id === Specialization.MedicalDoctor && rank.id === Rank.Ensign) {
                character.jobAssignment = specialization.name + " (Resident)";
            }
            if (rank.tiers > 1) {
                let tier = Math.ceil(Math.random() * rank.tiers);
                RanksHelper.instance().applyRank(character, rank.id, tier);
            } else {
                RanksHelper.instance().applyRank(character, rank.id, 1);
            }
        }
    }

}