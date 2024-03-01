import {SkillsHelper, Skill} from './skills';
import {Attribute, AttributesHelper} from './attributes';
import {Character, character } from '../common/character';
import { CharacterType } from '../common/characterType';
import i18next from 'i18next';
import { hasSource } from '../state/contextFunctions';
import { Source } from './sources';

export class CareerEventModel {
    name: string;
    description: string;
    attributes: Attribute[];
    disciplines: Skill[];
    focusSuggestions: string;
    traitDescription: string;
    onApply: () => void;
    roll: number;
    special?: string;
    prefix: string;
    focuses: string[];

    constructor(name: string, description: string, attributes: Attribute[], disciplines: Skill[], focusSuggestions: string,
        traitDescription: string, roll: number, onApply: () => void, special: string = undefined, prefix: string = "common.",
        focuses: string[] = []) {
        this.name = name;
        this.description = description;
        this.attributes = attributes;
        this.disciplines = disciplines;
        this.focusSuggestions = focusSuggestions;
        this.traitDescription = traitDescription;
        this.onApply = onApply;
        this.roll = roll;
        this.special = special;
        this.prefix = prefix;
        this.focuses = focuses;
    }

    get localizedName() {
        const key = 'CareerEvent.' + this.prefix + this.roll + '.name';
        let result = i18next.t(key);
        return result === key ? this.name : result;
    }

    get localizedDescription() {
        const key = 'CareerEvent.' + this.prefix + this.roll + '.description';
        let result = i18next.t(key);
        return result === key ? this.description : result;
    }

    get localizedFocusSuggestion() {
        const key = 'CareerEvent.' + this.prefix + this.roll + '.focusSuggestion';
        let result = i18next.t(key);
        return result === key ? this.focusSuggestions : result;
    }

    get localizedTraitDescription() {
        const key = 'CareerEvent.' + this.prefix + this.roll + '.traitDescription';
        let result = i18next.t(key);
        return result === key ? this.traitDescription : result;
    }
}

class CareerEvents {
    private _events: CareerEventModel[] = [
        new CareerEventModel(
            "Ship Destroyed",
            "The ship the character was serving on was lost, destroyed during a mission, and the character was one of the few who survived.\n\n- What was the ship’s mission? Was it something routine that went horribly wrong, or was it something perilous? What destroyed the ship?\n- How many survivors were there? How long did it take before they were recovered?",
            [Attribute.Daring],
            [Skill.Security],
            "The character gains a Focus, which should reflect the character’s experiences. Examples include: Extra Vehicular Operations, Small Craft, or Survival.",
            null,
            1,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "common.",
            ["Extra Vehicular Operations", "Small Craft", "Survival"]
        ),
        new CareerEventModel(
            "Death of a Friend",
            "During an important mission, one of the character’s friends was killed in action.\n\n- Who was the friend? How did the character know them?\n- What was the mission? How did the friend die? Who was to blame?",
            [Attribute.Insight],
            [Skill.Medicine],
            "The character gains a Focus, which should reflect the character’s experiences. Examples include: Counselling, but it may also represent a skill or pursuit the character takes up in their fallen friend’s memory or to prevent the same thing happening in the future.",
            null,
            2,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Medicine);
            },
            undefined,
            "common.",
            ["Counselling", "Cultural Grief Practices"]
        ),
        new CareerEventModel(
            "Lauded by Another Culture",
            "The character was involved in a mission that earned the official praise of a non-Federation culture; they are now considered to be a friend to that people.\n\n- What culture was aided by this mission? What was the mission? Why was it particularly praiseworthy?\n- Does the character have any friends or contacts in that culture who can be contacted for help?",
            [Attribute.Presence],
            [Skill.Science],
            "The character gains a Focus, which should reflect the character’s experience with that culture. A Focus of X Culture, replacing the X with the name of that culture, is a good example, as would any that represent skills or techniques specific to that culture.",
            "The character may gain a Trait, which should reflect this event. A good example might be Friend to the X, replacing the X with the name of the culture. This reflects the character’s renown amongst that culture, and the benefits and problems such status brings.",
            3,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "common.",
            ["X Culture"]
        ),
        new CareerEventModel(
            "Negotiate a Treaty",
            "The character was part of a delegation that helped negotiate a treaty, agreement, or alliance with a culture outside the Federation. What culture was the treaty with? What was it for?",
            [Attribute.Control],
            [Skill.Command],
            "The character gains a Focus, which should reflect the character’s experience with the negotiations. Examples include: Diplomacy, Negotiation, or Galactic Politics.",
            null,
            4,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "common.",
            ["Diplomacy", "Negotiation", "Galactic Politics"]
        ),
        new CareerEventModel(
            "Required to Take Command",
            "During a mission, a crisis left the mission’s leader unable to lead. This required the character to take command, something they may not have been prepared for.\n\n- What was the mission? What went wrong?\n- Was the mission successful despite the loss of the leader?",
            [Attribute.Daring],
            [Skill.Command],
            "The character gains a Focus, which should reflect the character’s experiences during the crisis. Examples include: Lead by Example, Inspiration, or Composure.",
            null,
            5,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "common.",
            ["Lead by Example", "Inspiration", "Composure"]
        ),
        new CareerEventModel(
            "Encounter with a Truly Alien Being",
            "The character encountered a life-form which is truly alien, something barely within the comprehension of humanoid life. It might have been some godlike entity, or a creature that swims through space, but whatever it was, it was not life as we know it.\n\n- What kind of creature was it? What did the character learn from the experience?\n- What happened to the creature afterwards? Has it been seen again?",
            [Attribute.Reason],
            [Skill.Science],
            "The character gains a Focus, which should reflect the character’s experiences with the entity. Examples include: Empathy, Philosophy, Xenobiology.",
            null,
            6,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "common.",
            ["Empathy", "Philosophy", "Xenobiology"]
        ),
        new CareerEventModel(
            "Serious Injury",
            "The character was seriously hurt, and needed to spend a considerable amount of time recovering.\n\n- What was happening when the character was injured? Who was responsible?\n- What did the recovery entail? Did the character need a prosthesis or cybernetic afterwards?",
            [Attribute.Fitness],
            [Skill.Medicine],
            "The character gains a Focus, which should reflect the circumstances of the character’s injury, something that helped them through recovery, or something they took up after recovering. Examples include: Athletics, Art, or Philosophy.",
            "The character may gain a Trait, which should reflect some lasting effect of the character’s injury or the way they recovered. Examples include: Prosthetic Implant, or some form of disability.",
            7,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Medicine);
            },
            undefined,
            "common.",
            ["Athletics", "Art", "Philosophy"]
        ),
        new CareerEventModel(
            "Conflict with a Hostile Culture",
            "The character was involved in a major battle with a hostile force, and is unlikely to forget the experience.\n\n- Who was the enemy in this battle? Why did the battle occur? Was it fought in space, on the ground, or both?\n- What did the character have to do to survive? Was the battle won or lost?",
            [Attribute.Fitness],
            [Skill.Security],
            "The character gains a Focus, which should reflect skills they honed during the fighting. Examples include: Hand Phasers, Hand-to-Hand Combat, or Shipboard Tactical Systems.",
            null,
            8,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "common.",
            ["Hand Phasers", "Hand-to-Hand Combat", "Shipboard Tactical Systems"]
        ),
        new CareerEventModel(
            "Mentored",
            "A highly-respected officer took notice of the character’s career. For a time, the character served as the officer’s pilot and aide, gaining the benefit of the officer’s experiences and lessons. Who was the officer? Does the officer remain a contact or even friend of the character?",
            [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason],
            [Skill.Conn],
            "The character gains a Focus, reflecting the lessons learned. Examples include: Composure or Etiquette, though any Focus reflecting the officer’s specialities would be fitting.",
            null,
            9,
            () => {
                this.improveDiscipline(Skill.Conn);
            },
            undefined,
            "common.",
            ["Composure", "Etiquette"]
        ),
        new CareerEventModel(
            "Transporter Accident",
            "The character suffered some manner of strange accident while using a Transporter.\n\n- What happened to the character during the accident? Were there any lasting repercussions?\n- How does the character feel about Transporters now?",
            [Attribute.Control],
            [Skill.Conn],
            "The character gains a Focus, which should reflect something they learned either because of the accident, or in the aftermath. Examples include: Transporters & Replicators, Small Craft, or Quantum Mechanics.",
            null,
            10,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Conn);
            },
            undefined,
            "common.",
            ["Transporters & Replicators", "Small Craft", "Quantum Mechanics"]
        ),
        new CareerEventModel(
            "Dealing with a Plague",
            "The character’s starship was assigned to provide aid to a world deal with an epidemic.\n\n- What was the disease that was running rampant? What planet it was affecting?\n- Did the character deal directly with the sick? How was the character involved?",
            [Attribute.Insight],
            [Skill.Medicine],
            "The character gains a Focus, which should reflect how they helped during the crisis. Examples include: Infectious Diseases, Emergency Medicine, or Triage.",
            null,
            11,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Medicine);
            },
            undefined,
            "common.",
            ["Infectious Diseases", "Emergency Medicine", "Triage"]
        ),
        new CareerEventModel(
            "Betrayed Ideals for a Superior",
            "The character was placed in a situation where they had to choose between a trusted superior and their own ideals, and chose to follow the superior.\n\n- Who was the superior? What did they ask the character to do? How does the character feel now?\n- What were the repercussions of this? Are the details of this event on record? Was the character right?",
            [Attribute.Presence],
            [Skill.Command],
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Persuasion, Inspiration, Investigation.",
            null,
            12,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "common.",
            ["Persuasion", "Inspiration", "Investigation"]
        ),
        new CareerEventModel(
            "Called Out a Superior",
            "The character was placed in a situation where they had to choose between a trusted superior and their own ideals, and chose to follow their ideals.\n\n- Who was the superior? What did they ask the character to do? How does the character feel now?\n- What were the repercussions of this? Are the details of this event on record? Was the character right?",
            [Attribute.Reason],
            [Skill.Conn],
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Uniform Code of Justice, History, or Starfleet Protocol.",
            null,
            13,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Conn);
            },
            undefined,
            "common.",
            ["Uniform Code of Justice", "History", "Starfleet Protocol"]
        ),
        new CareerEventModel(
            "New Battle Strategy",
            "In combat with a hostile force, the character devised a new strategy or tactic.\n\n- Who was the battle against?\n- Was it in space or on the ground? What was the strategy devised?",
            [Attribute.Daring],
            [Skill.Security],
            "The character gains a Focus, reflecting their decisive battlefield leadership. Examples include: Combat Tactics, Hazard Awareness, or Lead by Example.",
            null,
            14,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "common.",
            ["Combat Tactics", "Hazard Awareness", "Lead by Example"]
        ),
        new CareerEventModel(
            "Learns Unique Language",
            "The character encounters a species with an unusual form of communication, and learns to communicate with them.\n\n- Who were the aliens the character encountered? Was the encounter tense, or peaceful?\n- What method of communication do the aliens use? How did the character learn it?",
            [Attribute.Insight],
            [Skill.Science],
            "The character gains a Focus, reflecting what the character learned from the event. Examples include: Linguistics, Cultural Studies, or Negotiations.",
            null,
            15,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "common.",
            ["Linguistics", "Cultural Studies", "Negotiation"]
        ),
        new CareerEventModel(
            "Discovers an Artifact",
            "During a survey mission, the character discovered a device or fragment of technology from a now-extinct civilization.\n\n- What did this piece of technology do? Does it still function now?\n- What is known about the civilization that made it?",
            [Attribute.Reason],
            [Skill.Engineering],
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Ancient Technology, Computers, Reverse Engineering.",
            null,
            16,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "common.",
            ["Ancient Technology", "Computers", "Reverse Engineering"]
        ),
        new CareerEventModel(
            "Special Commendation",
            "During a crisis, the character saved the lives of several colleagues, helping them to safety.This earned the character a special commendation.\n\n- What was the crisis? Why was the mission in danger?\n- What were the repercussions of this? Are the details of this event on record?",
            [Attribute.Fitness],
            SkillsHelper.getSkills(),
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Athletics, Survival, or Emergency Medicine.",
            null,
            17,
            () => {
                this.improveAttribute(Attribute.Fitness);
            },
            undefined,
            "common.",
            ["Athletics", "Survival", "Emergency Medicine"]
        ),
        new CareerEventModel(
            "Solved an Engineering Crisis",
            "The character was instrumental in ending a crisis caused by malfunctioning technology, and saved many lives in the process. What technology had malfunctioned, and why was it dangerous? How did the character solve the problem?",
            [Attribute.Control],
            [Skill.Engineering],
            "The character gains a Focus, reflecting the technology involved in the event. Examples include: Electro-Plasma Power Systems, Fusion Reactors, or Warp Engines.",
            null,
            18,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "common.",
            ["Electro-Plasma Power Systems", "Fusion Reactors", "Warp Engines"]
        ),
        new CareerEventModel(
            "Breakthrough or Invention",
            "The character made an important technological discovery, devised a new way of using a particular technology, or invented some new technology that will be invaluable in the future. What was the discovery, breakthrough, or invention? How will it be useful?",
            [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason],
            [Skill.Engineering],
            "The character gains a Focus, reflecting the character’s achievement. Examples include: Experimental Technology, Invention, or Improvisation.",
            null,
            19,
            () => {
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "common.",
            ["Experimental Technology", "Invention", "Improvisation"]
        ),
        new CareerEventModel(
            "First Contact",
            "The character was chosen to be involved in one of the most important of Starfleet’s missions: first contact with another culture. What culture did the character make first contact with? Did the mission go well?",
            [Attribute.Presence],
            SkillsHelper.getSkills(),
            "The character gains a Focus, reflecting the nature of the mission. Examples include: Cultural Studies, Diplomacy, or Infiltration.",
            null,
            20,
            () => {
                this.improveAttribute(Attribute.Presence);
            },
            undefined,
            "common.",
            ["Cultural Studies", "Diplomacy", "Infiltration"]
        ),

        // Operations
        new CareerEventModel(
            "Recruited to Starfleet Intelligence",
            "On a quiet day while you were on shore leave, you were approached by a member of Starfleet Intelligence and offered a position as a covert agent. It seems they had been watching you for some time and decided you had the right skills and attitude they required. You were assigned a small mission as a test, and if you passed they promised to take you on as an agent, but one that maintained your Starfleet career.  Did you pass the test and accept their offer?  What did you have to do on the mission? Did you have to make any moral choices? If you did decide to join, what convinced you? Was it the excitement, the desire to learn more secrets, or just because you were frightened of what might happen if you refused?",
            [Attribute.Daring],
            [Skill.Security],
            "Depending on the mission the character might have learned covert skills. Examples include: Composure, Infiltration  or Persuasion.",
            null,
            99,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "common.",
            ["Composure", "Infiltration", "Persuasion"]
        )
    ];

    private _klingonEvents: CareerEventModel[] = [
        new CareerEventModel(
            "Ship Destroyed",
            "The ship you were serving on was lost, destroyed during a mission, and you were one of the few who survived. What was the ship’s mission? Was it something routine that went horribly wrong, or was it something perilous? What destroyed the ship? How many survivors were there? How long did it take before they were recovered?",
            [Attribute.Daring],
            [Skill.Security],
            "The character gains a Focus, which should reflect the character’s experiences. Examples include: Extra Vehicular Operations, Small Craft, or Survival.",
            null,
            1,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Death of a Friend",
            "During an important mission, one your friends was killed in action. Who was the friend? How did you know them? How did the friend die? Was it an honorable death? If not, who is responsible?",
            [Attribute.Insight],
            [Skill.Medicine],
            "The character gains a focus, which should reflect the character’s experiences. Examples include: Counselling, but it may also represent a skill or pursuit the character takes up in their fallen friend’s memory or to prevent the same thing happening in the future.",
            null,
            2,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Medicine);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Lauded by Another Culture",
            "You were involved in a mission or action that earned the official praise of a foreign nation, such as a world within the Federation; you’re now considered to be a friend to that people. What culture was aided by this mission? What was the mission? Why was it particularly praiseworthy? Does the character have any friends or contacts in that culture who can be contacted for help?",
            [Attribute.Presence],
            [Skill.Science],
            "The character gains a focus, which should reflect the character’s experience with that culture. A focus of X Culture, replacing the X with the name of that culture, is a good example (e.g., Pakled Culture)",
            "The character may gain a Trait, which should reflect this event. A good example might be Friend to the X, replacing the X with the name of the culture. This reflects the character’s renown amongst that culture, and the benefits and problems such status brings.",
            3,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Negotiate a Treaty",
            "You were part of a delegation that helped negotiate a treaty, agreement, or alliance with a culture outside the Empire. What culture was the treaty with? What was it for? Why was the culture not simply conquered by the Empire?",
            [Attribute.Control],
            [Skill.Command],
            "The character gains a Focus, which should reflect the character’s experience with the negotiations. Examples include: Diplomacy, Negotiation, or Galactic Politics.",
            null,
            4,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Required to Take Command",
            "During a mission, a crisis left the mission’s leader unable to lead. This required you to take command, something you may not have been prepared for. What was the mission? What went wrong? Were you forced to assassinate your leader to take command? Was the mission successful despite the loss of the leader",
            [Attribute.Daring],
            [Skill.Command],
            "The character gains a Focus, which should reflect the character’s experiences during the crisis. Examples include: Lead by Example, Inspiration, or Composure.",
            null,
            5,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Encounter with a Truly Alien Being",
            "You encountered a lifeform which is truly alien, something barely within the comprehension of humanoid life. It might have been some godlike entity, or a creature that swims through space, but whatever it was, it was not life as we know it. What kind of creature was it? What did the character learn from the experience? What happened to the creature afterwards? Did you kill it? If not, has it been seen again?",
            [Attribute.Reason],
            [Skill.Science],
            // I'm pretty sure that this part is incorrect, and has been inaccurately copied over from the event, above.
            "The character gains a Focus, which should reflect the character’s experiences during the crisis. Examples include: Lead by Example, Inspiration, or Composure.",
            null,
            6,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Serious Injury",
            "You were seriously hurt and needed to spend a considerable amount of time recovering. What was happening when you were injured? Who was responsible? Why did you not die? What did the recovery entail? Do you need a prosthesis or cybernetic as a result?",
            [Attribute.Fitness],
            [Skill.Medicine],
            "The character gains a Focus, which should reflect the circumstances of the character’s injury, something that helped them through recovery, or something they took up after recovering. Examples include: Athletics, Art, or Philosophy.",
            "The character may gain a Trait, which should reflect some lasting effect of the character’s injury or the way they recovered. Examples include: Prosthetic Implant, or some form of disability.",
            7,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Medicine);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Glorious Battle!",
            "You fought in a major battle with a hostile force and spilled much blood. Who was the enemy in this battle? Why did the battle occur? Was it fought in space, on the ground, or both? What did you have to do to survive? Was the battle won or lost?",
            [Attribute.Fitness],
            [Skill.Security],
            "The character gains a Focus, which should reflect skills they honed during the fighting. Examples include: Hand Phasers, Hand-to-Hand Combat, or Shipboard Tactical Systems.",
            null,
            8,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Mentored",
            "A highly-respected officer took notice of your career. For a time, you served as the officer’s aide-de-camp or as third officer on their ship, gaining the benefit of the officer’s experiences and lessons. Who was the officer? Does the officer remain a contact or even friend of the character?",
            [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason],
            [Skill.Conn],
            // again, I think this is wrong...
            "TThe character gains a focus, reflecting the event and its aftermath. Examples include: Persuasion, Inspiration, or Investigation.",
            null,
            9,
            () => {
                this.improveDiscipline(Skill.Conn);
                this.fieldCommission();
            },
            "If your character was an Enlisted Warrior or Laborer, you gain a field commission and become an officer."
        ),
        new CareerEventModel(
            "Transporter Accident",
            "You suffered some manner of strange accident while using a transporter. What happened to you during the accident? Were there any lasting repercussions? How do you feel about transporters now?",
            [Attribute.Control],
            [Skill.Conn],
            "The character gains a Focus, which should reflect something they learned either because of the accident, or in the aftermath. Examples include: Transporters & Replicators, Small Craft, or Quantum Mechanics.",
            null,
            10,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Conn);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Dealing with a Plague",
            "Your ship was assigned to provide aid a world dealing with an epidemic. What was the disease that was running rampant? What planet it was affecting? Did the character deal directly with the sick? How was the character involved?",
            [Attribute.Insight],
            [Skill.Medicine],
            "The character gains a Focus, which should reflect how they helped during the crisis. Examples include: Infectious Diseases, Emergency Medicine, or Triage.",
            null,
            11,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Medicine);
            }
        ),
        new CareerEventModel(
            "Dishonored Self for a Superior",
            "You were placed in a situation where you had to choose between a superior officer and your own honor, and you chose to follow the superior. You dishonored yourself in the process. Who was the superior? What did they order you to do? How do you feel now? What were the repercussions of this? Are the details of this event on record? Were you right to do this?",
            [Attribute.Presence],
            [Skill.Command],
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Persuasion, Inspiration, Investigation.",
            null,
            12,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Challenged a Superior",
            "You were placed in a situation where you had to choose between a trusted superior and your own honor, and you chose to disobey their superior, challenging them to a duel for the affront. Who was the superior? What did they order you to do? How do you feel now? What were the repercussions of this? Did you slay your superior? If not, how did you survive?",
            [Attribute.Reason],
            [Skill.Conn],
            "The character gains a focus, reflecting the event and its aftermath. Examples include: Law and Justice, Hand-to-Hand Combat, or Blades.",
            null,
            13,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Conn);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "New Battle Strategy",
            "In combat with a hostile force, you devised a new strategy or tactic. Who was the battle against? Was it in space or on the ground? What strategy did you devise?",
            [Attribute.Daring],
            [Skill.Security],
            "The character gains a Focus, reflecting their decisive battlefield leadership. Examples include: Combat Tactics, Hazard Awareness, or Lead by Example.",
            null,
            14,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Employed Dishonorable Means to Triumph",
            "Desperate to achieve victory and gain glory at any cost, you resorted to shameful methods. Who did you defeat? What method did you employ to defeat them? Have you managed to keep your shameful tactics secret? If not, what consequences did you face? Would you do it again?",
            [Attribute.Insight],
            [Skill.Science],
            "The character gains a focus, reflecting what the character learned from the event. Examples include: Toxicology, Stealth, or Deception.",
            null,
            15,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Discovers an Artifact",
            "During a survey mission, the character discovered a device or fragment of technology from a now-extinct civilization. What did this piece of technology do? Does it still function now? What is known about the civilization that made it?",
            [Attribute.Reason],
            [Skill.Engineering],
            "The character gains a focus, reflecting the event and its aftermath. Examples include: Ancient Technology, Reverse Engineering, Computers.",
            null,
            16,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Honor and Glory",
            "You have been commended by your superiors, and even by those higher up in the Empire, or the House you fight for, for your deeds during a crisis. What was the crisis? Why was the mission in danger? What were the repercussions of this? Are the details of this event on record?",
            [Attribute.Fitness],
            SkillsHelper.getSkills(),
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Athletics, Survival, or Emergency Medicine.",
            null,
            17,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.fieldCommission();
            },
            "If your character was an Enlisted Warrior or Laborer, you gain a field commission and become an officer.",
            "klingon."
        ),
        new CareerEventModel(
            "Solved an Engineering Crisis",
            "You were instrumental in ending a crisis caused by malfunctioning technology and achieved a great victory in the process. What technology had malfunctioned, and why was it dangerous? How did you solve the problem? What victory did you achieve because of this?",
            [Attribute.Control],
            [Skill.Engineering],
            "The character gains a focus, reflecting the technology involved in the event. Examples include: Electro-Plasma Power Systems, Cloaking Devices, or Warp Engines.",
            null,
            18,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Breakthrough or Invention",
            "You made an important technological discovery, devised a new way of using a particular technology, or invented some new technology that will be invaluable in the future. What was the discovery, breakthrough, or invention? How will it be useful?",
            [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason],
            [Skill.Engineering],
            "The character gains a Focus, reflecting the character’s achievement. Examples include: Experimental Technology, Invention, or Improvisation.",
            null,
            19,
            () => {
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "klingon."
        ),
        new CareerEventModel(
            "Conquest",
            "You were chosen to be involved in conquering another world to bring it under the rule of the Klingon Empire. What culture did you help conquer? Did the conquest go well?",
            [Attribute.Presence],
            SkillsHelper.getSkills(),
            "The character gains a focus, reflecting the nature of the mission. Examples include: Strategy, Tactics, or Infiltration.",
            null,
            20,
            () => {
                this.improveAttribute(Attribute.Presence);
            },
            undefined,
            "klingon."
        ),
    ];

    private _unofficialEvents: CareerEventModel[] = [
        new CareerEventModel(
            "Advanced Tactical Training",
            "The character took a specialized course in advanced tactical and intelligence techniques.\n\n- Where was the course taught? Who recommended the character for the course?\n- Did the character pass the course? How did the character rank in the various subjects?",
            [Attribute.Control],
            [Skill.Security],
            "The character gains a focus, which should reflect the special training they received. Examples include: Guerilla Tactics, Strategic Defense, or Combat Maneuvers.",
            null,
            21,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Protoype Testing",
            "",
            [Attribute.Control],
            [Skill.Science],
            "",
            null,
            22,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Colonization Effort",
            "",
            [Attribute.Control],
            [Skill.Science],
            "",
            null,
            23,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Exchange Program",
            "",
            [Attribute.Control],
            SkillsHelper.getSkills(),
            "",
            null,
            24,
            () => {
                this.improveAttribute(Attribute.Control);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Lucky Streak",
            "",
            [Attribute.Daring],
            [Skill.Conn],
            "",
            null,
            25,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Conn);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Learned from Significant Blunder",
            "",
            [Attribute.Daring],
            [Skill.Engineering],
            "",
            null,
            26,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Cultural Observation Post",
            "",
            [Attribute.Daring],
            [Skill.Science],
            "",
            null,
            27,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Struggle with Addiction",
            "",
            [Attribute.Daring],
            [Skill.Medicine],
            "",
            null,
            28,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Medicine);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Rivalry",
            "",
            [Attribute.Daring],
            SkillsHelper.getSkills(),
            "",
            null,
            29,
            () => {
                this.improveAttribute(Attribute.Daring);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Off-Duty Endeavour",
            "",
            [Attribute.Fitness],
            [Skill.Command],
            "",
            null,
            30,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Starbase Posting",
            "",
            [Attribute.Fitness],
            [Skill.Conn],
            "",
            null,
            31,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Conn);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Planetary Posting",
            "",
            [Attribute.Fitness],
            [Skill.Engineering],
            "",
            null,
            32,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Left Behind",
            "",
            [Attribute.Fitness],
            [Skill.Science],
            "",
            null,
            33,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Science);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Family Crisis",
            "",
            [Attribute.Insight],
            [Skill.Command],
            "",
            null,
            34,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Satisfactory Performance",
            "",
            [Attribute.Insight],
            [Skill.Conn],
            "",
            null,
            35,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Conn);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Confinement",
            "",
            [Attribute.Insight],
            [Skill.Security],
            "",
            null,
            36,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Terraforming Mission",
            "",
            [Attribute.Insight],
            [Skill.Engineering],
            "",
            null,
            37,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Leave of Absence",
            "",
            [Attribute.Insight],
            SkillsHelper.getSkills(),
            "",
            null,
            38,
            () => {
                this.improveAttribute(Attribute.Insight);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Media Exposure",
            "",
            [Attribute.Presence],
            [Skill.Conn],
            "",
            null,
            39,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Conn);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Clandestine Operation",
            "",
            [Attribute.Presence],
            [Skill.Security],
            "",
            null,
            40,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Fleet Yard Posting",
            "",
            [Attribute.Presence],
            [Skill.Engineering],
            "",
            null,
            41,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Engineering);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Missing Memories",
            "",
            [Attribute.Presence],
            [Skill.Medicine],
            "",
            null,
            42,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Medicine);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Teaching Opportunity",
            "",
            [Attribute.Reason],
            [Skill.Command],
            "",
            null,
            43,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Legal Entanglement",
            "",
            [Attribute.Reason],
            [Skill.Security],
            "",
            null,
            44,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Victim of Mind Control",
            "",
            [Attribute.Reason],
            [Skill.Medicine],
            "",
            null,
            45,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Medicine);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Not Fitting In",
            "",
            [Attribute.Reason],
            SkillsHelper.getSkills(),
            "",
            null,
            46,
            () => {
                this.improveAttribute(Attribute.Reason);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Meaningful Memento",
            "",
            AttributesHelper.getAllAttributes(),
            [Skill.Command],
            "",
            null,
            47,
            () => {
                this.improveDiscipline(Skill.Command);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Deep Space Assignment",
            "",
            AttributesHelper.getAllAttributes(),
            [Skill.Security],
            "",
            null,
            48,
            () => {
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Brush with Temporal Anomaly",
            "",
            AttributesHelper.getAllAttributes(),
            [Skill.Science],
            "",
            null,
            49,
            () => {
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "unofficial."
        ),
        new CareerEventModel(
            "Medical Facility Posting",
            "",
            AttributesHelper.getAllAttributes(),
            [Skill.Medicine],
            "",
            null,
            50,
            () => {
                this.improveDiscipline(Skill.Security);
            },
            undefined,
            "unofficial."
        ),
    ];


    getSoloCareerEvents() {
        let result = [];
        for (let i = 0; i < 20; i++) {
            result.push(this._events[i]);
        }
        return result;
    }

    getCareerEvents(type: CharacterType) {
        let list = type === CharacterType.KlingonWarrior ? this._klingonEvents : this._events;
        if (!hasSource(Source.OperationsDivision)) {
            list = list.filter(e => e.roll !== 99);
        }
        return [...list].sort((e1, e2) => {
            return e1.localizedName.localeCompare(e2.localizedName);
        })
    }

    getCareerEventsIncludingUnofficial(type: CharacterType) {
        let list = this.getCareerEvents(type);
        this._unofficialEvents.forEach(e => list.push(e));
        return list.sort((e1, e2) => {
            return e1.localizedName.localeCompare(e2.localizedName);
        })
    }

    getCareerEvent(id: number, type: CharacterType): CareerEventModel {
        let event = undefined;

        let list = type === CharacterType.KlingonWarrior ? this._klingonEvents : this._events;
        list.forEach(ev => {
            if (ev.roll === id) {
                event = ev;
            }
        });

        if (event == null) {
            const items = this._unofficialEvents.filter(e => e.roll === id);
            if (items.length === 1) {
                event = items[0];
            }
        }

        return event;
    }

    generateEvent(type: CharacterType): CareerEventModel {
        var roll = Math.floor(Math.random() * 20) + 1;
        let event = undefined;

        let list = type === CharacterType.KlingonWarrior ? this._klingonEvents : this._events;
        list.forEach(ev => {
            if (ev.roll === roll) {
                event = ev;
                return;
            }
        });

        return event;
    }

    applyCareerEvent(id: number, type: CharacterType) {
        let event = this.getCareerEvent(id, type);
        event.onApply();
    }

    private improveAttribute(attribute: Attribute) {
        const max = Character.maxAttribute(character);
        if (character.hasMaxedAttribute() && character.attributes[attribute].value + 1 === max) {
            return;
        }

        character.attributes[attribute].value++;
    }

    private improveDiscipline(discipline: Skill) {
        const max = Character.maxDiscipline(character);
        if (character.hasMaxedSkill() && character.skills[discipline].expertise + 1 === max) {
            return;
        }

        character.skills[discipline].expertise++;
    }

    private fieldCommission() {
        if (character.enlisted && character.educationStep) {
            character.educationStep.enlisted = false;
        }
    }

}

export const CareerEventsHelper = new CareerEvents();
