import { AlliedMilitaryDetails, CareerStep, Character, NpcGenerationStep, Specialization, SpeciesStep } from "../../common/character";
import { CharacterType } from "../../common/characterType";
import { Stereotype } from "../../common/construct";
import { D20 } from "../../common/die";
import { AttributesHelper } from "../../helpers/attributes";
import { Career } from "../../helpers/careerEnum";
import { RanksHelper, Rank } from "../../helpers/ranks";
import { Skill, SkillsHelper } from "../../helpers/skills";
import { Species } from "../../helpers/speciesEnum";
import { SpeciesHelper, SpeciesModel } from "../../helpers/species";
import { TalentsHelper, ToViewModel } from "../../helpers/talents";
import { NameGenerator } from "../nameGenerator";
import { NpcType, NpcTypes } from "./npcType";
import { SpecializationModel, Specializations } from "./specializations";
import { NpcCharacterType } from "./npcCharacterType";
import { hasAnySource } from "../../state/contextFunctions";
import { Source } from "../../helpers/sources";
import { AlliedMilitaryType } from "../../helpers/alliedMilitary";
import AllyHelper from "../../helpers/alliedMilitary";

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

const recreationSkills: { [type: number ]: string[] } = {

    [ NpcCharacterType.Starfleet] : [
        "Holodeck Simulations", "Dixie Hill Adventures",
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
        "Trashy Romance Novels", "Parrises squares", "Neo-Sevrin Philosophy",
        "Protocols of the Orion Syndicate", "V'tosh ka'tur Ideology"
    ],
    [NpcCharacterType.KlingonDefenseForces] : ["The teachings of Kahless", "The accomplishments of Kahless",
        "Klingon Chancellors and Emperors", "The various locales of Q'onos", "Mok'bara",
        "B'aht Qul", "Bat'leth Tournament Rules", "Klingon Opera", "The Rituals and Stories of the Klingon Afterlife",
        "The Hur'Q", "Targ raising and training", "The legends of Sarpek the Fearless", "Gourmet gagh", "The demands of honour",
        "Bloodwine making", "Klingon Spirituality", "Culinary arts", "Famous honourable deaths",
        "Organians and their meddlesome ways"
    ],
    [NpcCharacterType.Ferengi] : [
        "Tongo",
        "Global Tongo Championship betting",
        "Dabo",
        "Oo-mox",
        "Holosuite adventures",
        "Sexy holosuite adventures",
        "Lokar bean preparation",
        "Gourmet slug liver",
        "Oyster toad",
        "Puree of beetle",
        "Tube grub farming",
        "Slug-o-cola",
        "Stardrifter afficionado",
        "Schmoozing",
        "Bars and Diners"
    ]
}


const careerSkills: { [type: number ]: string[] } = {

    [ NpcCharacterType.Starfleet] : ["Starfleet Protocols", "Worlds of the Federation", "Starship Emergency Protocols",
        "Tricoders", "History of the Federation", "The Missions of Adm. Archer and the NX-01",
        "Early Starfleet History", "Starfleet General Orders", "The Missions of Commodore Decker",
        "Starship Identification", "Androids and Synthetic Life", "Holodeck Programming", "Federation Wars",
        "Battle Tactics of Captain Garth", "Federation Species", "Tactical Use of Logic Puzzles for Defeating AIs",
        "First Contact Protocols", "The Prime Directive", "Abandon Ship Procedures", "Space Suits",
        "Zero-G Operations"
    ],
    [NpcCharacterType.KlingonDefenseForces] : [
        "KDF Protocols", "Worlds of the Klingon Empire", "Starship Emergency Protocols",
        "Tricorders", "History of the Empire", "The Accomplishments of Koloth", "Early Klingon History",
        "The Missions of Captain Kor", "Protocols for Challenging a Superior", "Starship Identification",
        "Battle Tactics of General Korrd", "Conquered species", "Weaknesses of the Federation", "Enemies of the Empire",
        "Abandon Ship Procedures", "Space suits", "Zero-G Operations", "The strategies of famous Starfleet captains"
    ],
    [NpcCharacterType.Ferengi] : [
        "Valuation",
        "Business Opportunities",
        "Merchant Trade Routes",
        "The Rules of Acquisition",
        "The Protocols of the Ferengi Trade Authority",
        "Unionization Threat Analysis",
        "Subtle Billing Surcharges",
        "Trade Authority Bureaucracy",
        "Energy Whips"
    ],
    [NpcCharacterType.RomulanMilitary] : [
        "Scheming",
        "Sneak Attacks",
        "Military Tactics",
        "The Federation/Romulan War",
        "Political Jockeying",
        "Plots and Intrigue",
        "Tal Shiar Conspiracy Theories",
        "Tests of Loyalty"
    ]
}

const typeSpecificValues: { [type : number ]: string[]} = {
    [ NpcCharacterType.Starfleet ] : [
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
        "My team has my back",
        "Work the problem",
        "I've got faith of the heart"
    ],
    [ NpcCharacterType.KlingonDefenseForces ] : [
        "My honour is in protecting the Empire",
        "If I must choose between personal dishonour and failing the Empire, I choose the former.",
        "If my crew dies, it will be honourably!",
        "A Klingon without honour is as good as dead",
        "Klingons do not take prisoners. But I offer you a blade, so that you may take your own life.",
        "It is foolish to give my word to a foe with no honour.",
        "I do not seek to lead, but will take that role if honour demands it.",
        "I see you have forgotten the first time we met. I assure you that I have not forgotten."
    ],
    [ NpcCharacterType.Ferengi ] : [
    ],
    [ NpcCharacterType.RomulanMilitary ] : [
    ]
}

const typeSpecificGeneralValues: { [type : number ]: string[]} = {
    [ NpcCharacterType.Starfleet ] : [
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
    ],
    [ NpcCharacterType.KlingonDefenseForces ] : [
        "Overflowing with bravado",
        "Blowhard",
        "I don't need to be sober to defeat you.",
        "Test me and you'll taste my d'k tahg",
        "Victory is life",
        "The enemy of my enemy is my friend",
        "The enemy of my enemy is my friend. For now.",
        "Great deeds require great risks",
        "Duty and loyalty are sacred",
        "They will sing songs of glory for my accomplishments",
        "I'm tired of all this peace. A warrior needs a good war every now and then.",
        "Always it is the brave ones who die. The soldiers.",
        "Today we conquer! Oh, if someday we are defeated... well... war has its fortunes. Good and bad.",
        "It would have been glorious."
    ],
    [ NpcCharacterType.RomulanMilitary ] : [
        "Secrecy is Strength",
        "Vigilance is Virtue",
        "Ambition Knows No Bounds",
        "Unity in Deception",
        "Adapt or Be Conquered",
        "Strength in Isolation",
        "The Ends Justify the Means",
        "Intrigue is the Spice of Life",
        "Patience in Pursuit",
        "Honor in Victory, Disgrace in Defeat"
    ],
    [ NpcCharacterType.Ferengi ] : [
    ],
    [ NpcCharacterType.Cardassian] : [
        "Order Above All",
        "Duty Defines Honour",
        "Strength Through Unity",
        "Information is Power",
        "Adaptation is Survival",
        "Discipline Breeds Excellence",
        "Sacrifice for the Greater Good",
        "Loyalty Commands Respect",
        "Patriotism as Virtue",
        "Legacy Endures Through Contribution",
        "Hierarchy is Inviolate",
        "Education is the Key to Progress",
        "Security Breeds Prosperity",
        "Faith in the Central Command",
        "Cultural Preservation is Paramount",
        "Pragmatism Over Idealism",
        "Artistic Expression in Service of the State",
        "Resilience in the Face of Adversity",
        "The State Knows Best",
        "Atonement Through Service"
    ]
}

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
    ],
    [ Species.Klingon ] : [
        "My family carries a great shame; it is my burden to redeem them",
        "Back-stabbing is for cowards. I will stab you in the chest, while you watch!",
        "Glory to you. And to your House.",
        "Honor is more important than life itself",
        "The strong survive and the weak perish",
        "Death is not to be feared, but embraced",
        "The path to enlightenment is through struggle",
        "Revenge is a dish best served cold",
        "Respect is earned, not given",
        "Family is everything",
        "A Klingon's word is their bond",
        "My targ is my trusty companion, but I will kill it if it bites me.",
        "Wisdom comes from experience",
        "Suffering is a test of character",
        "Klingons do not procrastinate",
        "What is that furry thing, and why does it make that noise? Get it away from me.",
        "I don't trust people who smile too much."
    ],
    [ Species.Bolian ] : [
        "Cleanliness is next to godliness",
        "Unity through diversity",
        "Honesty is the best policy",
        "Family comes first",
        "A sound mind in a sound body",
        "Respect for authority",
        "Service to others",
        "Hard work pays off",
        "Peace through negotiation",
        "A well-rounded education is a boon",
        "It's not just warp cores, any engine makes for a cheerful baby"
    ],
    [ Species.Ferengi ] : [
        "Once you have their money, you never give it back.",
        "Never spend more for an acquisition than you have to.",
        "Never allow family to stand in the way of opportunity.",
        "Keep your ears open.",
        "Opportunity plus instinct equals profit.",
        "Greed is eternal.",
        "A deal is a deal.",
        "A contract is a contract is a contract... but only between Ferengi.",
        "A Ferengi without profit is no Ferengi at all.",
        "Never place friendship above profit.",
        "A wise person can hear profit in the wind.",
        "Nothing is more important than your health... except for your money.",
        "Never make fun of a Ferengi's mother.",
        "It never hurts to suck up to the boss.",
        "War is good for business.",
        "Peace is good for business.",
        "Expand or die.",
        "Don't trust a man wearing a better suit than your own.",
        "The bigger the smile, the sharper the knife.",
        "Good customers are as rare as latinum. Treasure them.",
        "Free advice is seldom cheap."
    ],
    [Species.Romulan] : [
        "I Will Not Fail in My Duty to the Empire",
        "The Ends Justify the Means",
        "Everything I Do, I Do for Romulus"
    ],
    [Species.Reman] : [
        "You think darkness is your ally? You merely adopted the dark. I was born in it, molded by it.",
        "One Day the Reman People Will Rise, and Take the Throne of Romulus Itself!"
    ],
    [Species.Cardassian] : [
        "Family is all"
    ]
}


export class NpcGenerator {

    static createNpc(npcType: NpcType, characterType: NpcCharacterType, species: SpeciesModel, specialization: SpecializationModel) {
        let character = new Character();
        character.stereotype = Stereotype.Npc;
        if (specialization == null) {
            let specializations = Specializations.instance.getSpecializations(characterType);
            specialization = specializations[Math.floor(Math.random() * specializations.length)];
        }
        NpcGenerator.assignCharacterType(character, characterType, specialization);

        let {name, pronouns} = NameGenerator.instance.createName(species.id === Species.KlingonQuchHa ? SpeciesHelper.getSpeciesByType(Species.Klingon) : species);
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
        if (specialization.id === Specialization.Admiral) {
            careers = [ Career.Veteran ];
        } else if (specialization.id === Specialization.FerengiDaiMon || specialization.id === Specialization.KlingonShipCaptain) {
            careers = [ Career.Experienced, Career.Experienced, Career.Experienced, Career.Veteran ];
        }

        character.careerStep = new CareerStep(careers[Math.floor(Math.random() * careers.length)]);
        character.npcGenerationStep = new NpcGenerationStep();
        character.npcGenerationStep.specialization = specialization.id;
        character.npcGenerationStep.enlisted = (Math.random() < specialization.officerProbability) ? false : true;

        if (!character.isCivilian()) {
            NpcGenerator.assignRank(character, specialization);
        }
        NpcGenerator.assignFocuses(npcType, character, specialization);
        NpcGenerator.assignValues(npcType, character, specialization);
        NpcGenerator.assignTalents(npcType, character, species, specialization);

        return character;
    }

    private static assignCharacterType(character: Character, characterType: NpcCharacterType, specialization: SpecializationModel) {
        switch (characterType) {
            case NpcCharacterType.Starfleet:
                character.type = CharacterType.Starfleet;
                break;
            case NpcCharacterType.Cardassian:
                character.type = CharacterType.AlliedMilitary;
                character.typeDetails = new AlliedMilitaryDetails(AllyHelper.findOption(AlliedMilitaryType.CardassianUnion), "Cardassian Union");
                break;
            case NpcCharacterType.KlingonDefenseForces:
                character.type = CharacterType.KlingonWarrior;
                break;
            case NpcCharacterType.RomulanMilitary:
                character.type = CharacterType.AlliedMilitary;
                character.typeDetails = new AlliedMilitaryDetails(AllyHelper.findOption(AlliedMilitaryType.RomulanStarEmpire), "Romulan");
                break;
            case NpcCharacterType.Ferengi:
                if (specialization.id === Specialization.FerengiMerchant) {
                    character.type = CharacterType.Civilian;
                } else {
                    character.type = CharacterType.AlliedMilitary;
                    character.typeDetails = new AlliedMilitaryDetails(AllyHelper.findOption(AlliedMilitaryType.Other), "Ferengi");
                }
                break;
            default:
        }
    }

    static assignTalents(npcType: NpcType, character: Character, species: SpeciesModel, specialization: SpecializationModel) {
        let numberOfTalents = NpcTypes.numberOfTalents(npcType);

        for (let i = 0; i < numberOfTalents; i++) {
            let done = false;
            let n = 0;

            if (i === 0 && species.id === Species.Klingon && hasAnySource([Source.KlingonCore, Source.BetaQuadrant])) {
                character.addTalent(ToViewModel(TalentsHelper.getTalent("Brak'lul"), 1, character.type));
            } else {
                while (!done) {
                    let talentList = TalentsHelper.getAllAvailableTalentsForCharacter(character);
                    let specializationSkill = Skill[specialization.primaryDiscipline];
                    let roll = D20.roll();
                    if (roll < 7) {
                        // go for species talents
                        let talentName = species.talents.map(t => t.name);
                        talentList = talentList.filter(t => talentName.indexOf(t.name) >= 0 || t.specialRule);
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
                        if (talent.name === "Free Advice Is Seldom Cheap") {
                            console.log("****** FOUND IT ******")
                        }
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
        let valueOptions = [];
        valueOptions.push.apply(valueOptions, specialization.values ?? []);
        valueOptions.push.apply(valueOptions, typeSpecificGeneralValues[specialization.type] ?? []);
        valueOptions.push.apply(valueOptions, typeSpecificValues[specialization.type] ?? []);
        valueOptions.push.apply(valueOptions, speciesSpecificValues[(character.speciesStep.species === Species.KlingonQuchHa
            ? Species.Klingon
            : character.speciesStep.species)] ?? []);

        for (let i = 0; i < count; i++) {
            let done = false;
            while (!done) {
                if (valueOptions?.length) {
                    let value = valueOptions[Math.floor(Math.random() * valueOptions.length)];
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
            let done = false;
            while (!done) {
                let focuses = (D20.roll() > 10)
                    ? careerSkills[specialization.type]
                    : recreationSkills[specialization.type];
                if (D20.roll() <= primaryChances[i]) {
                    focuses = specialization.primaryFocuses;
                } else if (D20.roll() <= secondaryChances[i]) {
                    focuses = specialization.secondaryFocuses;
                }

                if (focuses?.length) {
                    let focus = focuses[Math.floor(Math.random() * focuses.length)];
                    if (character.focuses.indexOf(focus) < 0) {
                        character.addFocus(focus);
                        done = true;
                    }
                }
            }
        }
    }

    static assignRank(character: Character, specialization: SpecializationModel) {
        let ranks = RanksHelper.instance().getSortedRanks(character);
        if (specialization.id === Specialization.Admiral) {
            ranks = RanksHelper.instance().getAdmiralRanks(character);
        } else if (specialization.id === Specialization.FerengiDaiMon) {
            ranks = [ RanksHelper.instance().getRank(Rank.DaiMon) ];
        } else if (specialization.id === Specialization.KlingonShipCaptain) {
            ranks = [ RanksHelper.instance().getRank(Rank.Captain) ];
        }

        ranks = ranks.filter(r => r.id !== Rank.Yeoman1stClass
            && r.id !== Rank.Yeoman2ndClass
            && r.id !== Rank.Yeoman3rdClass
            && r.id !== Rank.Specialist1stClass
            && r.id !== Rank.Specialist2ndClass
            && r.id !== Rank.Specialist3rdClass
            && r.id !== Rank.ChiefSpecialist
            && r.id !== Rank.MasterChiefSpecialist
            && r.id !== Rank.SeniorChiefSpecialist);

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
