import {SkillsHelper, Skill} from './skills';
import {Attribute} from './attributes';
import {character} from '../common/character';

class CareerEventModel {
    name: string;
    description: string;
    attributes: Attribute[];
    disciplines: Skill[];
    focusSuggestions: string;
    traitDescription: string;
    onApply: () => void;
    roll: number;

    constructor(name: string, description: string, attributes: Attribute[], disciplines: Skill[], focusSuggestions: string, traitDescription: string, roll: number, onApply: () => void) {
        this.name = name;
        this.description = description;
        this.attributes = attributes;
        this.disciplines = disciplines;
        this.focusSuggestions = focusSuggestions;
        this.traitDescription = traitDescription;
        this.onApply = onApply;
        this.roll = roll;
    }
}

class CareerEvents {
    private _events: CareerEventModel[] = [
        new CareerEventModel(
            "Ship Destroyed",
            "The ship the character was serving on was lost, destroyed during a mission, and the character was one of the few who survived. What was the ship’s mission? Was it something routine that went horribly wrong, or was it something perilous? What destroyed the ship? How many survivors were there? How long did it take before they were recovered?",
            [Attribute.Daring],
            [Skill.Security],
            "The character gains a Focus, which should reflect the character’s experiences. Examples include: Extra Vehicular Operations, Small Craft, or Survival.",
            null,
            1,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Security);
            }
        ),
        new CareerEventModel(
            "Death of a Friend",
            "During an important mission, one of the character’s friends was killed in action. Who was the friend? How did the character know them? What was the mission? How did the friend die? Who was to blame?",
            [Attribute.Insight],
            [Skill.Medicine],
            "The character gains a Focus, which should reflect the character’s experiences. Examples include: Counselling, but it may also represent a skill or pursuit the character takes up in their fallen friend’s memory or to prevent the same thing happening in the future.",
            null,
            2,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Medicine);
            }
        ),
        new CareerEventModel(
            "Lauded by Another Culture",
            "The character was involved in a mission that earned the official praise of a non-Federation culture; they are now considered to be a friend to that people. What culture was aided by this mission? What was the mission? Why was it particularly praiseworthy? Does the character have any friends or contacts in that culture who can be contacted for help?",
            [Attribute.Presence],
            [Skill.Science],
            "The character gains a Focus, which should reflect the character’s experience with that culture. A Focus of X Culture, replacing the X with the name of that culture, is a good example, as would any that represent skills or techniques specific to that culture.",
            "The character may gain a Trait, which should reflect this event. A good example might be Friend to the X, replacing the X with the name of the culture. This reflects the character’s renown amongst that culture, and the benefits and problems such status brings.",
            3,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Science);
            }
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
            }
        ),
        new CareerEventModel(
            "Required to Take Command",
            "During a mission, a crisis left the mission’s leader unable to lead. This required the character to take command, something they may not have been prepared for. What was the mission? What went wrong? Was the mission successful despite the loss of the leader?",
            [Attribute.Daring],
            [Skill.Command],
            "The character gains a Focus, which should reflect the character’s experiences during the crisis. Examples include: Lead by Example, Inspiration, or Composure.",
            null,
            5,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Command);
            }
        ),
        new CareerEventModel(
            "Encounter with a Truly Alien Being",
            "The character encountered a life-form which is truly alien, something barely within the comprehension of humanoid life. It might have been some godlike entity, or a creature that swims through space, but whatever it was, it was not life as we know it. What kind of creature was it? What did the character learn from the experience? What happened to the creature afterwards? Has it been seen again?",
            [Attribute.Reason],
            [Skill.Science],
            "The character gains a Focus, which should reflect the character’s experiences with the entity. Examples include: Empathy, Philosophy, Xenobiology.",
            null,
            6,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Science);
            }
        ),
        new CareerEventModel(
            "Serious Injury",
            "The character was seriously hurt, and needed to spend a considerable amount of time recovering. What was happening when the character was injured? Who was responsible? What did the recovery entail? Did the character need a prosthesis or cybernetic afterwards?",
            [Attribute.Fitness],
            [Skill.Medicine],
            "The character gains a Focus, which should reflect the circumstances of the character’s injury, something that helped them through recovery, or something they took up after recovering. Examples include: Athletics, Art, or Philosophy.",
            "The character may gain a Trait, which should reflect some lasting effect of the character’s injury or the way they recovered. Examples include: Prosthetic Implant, or some form of disability.",
            7,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Medicine);
            }
        ),
        new CareerEventModel(
            "Conflict with a Hostile Culture",
            "The character was involved in a major battle with a hostile force, and is unlikely to forget the experience. Who was the enemy in this battle? Why did the battle occur? Was it fought in space, on the ground, or both? What did the character have to do to survive? Was the battle won or lost?",
            [Attribute.Fitness],
            [Skill.Security],
            "The character gains a Focus, which should reflect skills they honed during the fighting. Examples include: Hand Phasers, Hand-to-Hand Combat, or Shipboard Tactical Systems.",
            null,
            8,
            () => {
                this.improveAttribute(Attribute.Fitness);
                this.improveDiscipline(Skill.Security);
            }
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
            }
        ),
        new CareerEventModel(
            "Transporter Accident",
            "The character suffered some manner of strange accident while using a Transporter. What happened to the character during the accident? Were there any lasting repercussions? How does the character feel about Transporters now?",
            [Attribute.Control],
            [Skill.Conn],
            "The character gains a Focus, which should reflect something they learned either because of the accident, or in the aftermath. Examples include: Transporters & Replicators, Small Craft, or Quantum Mechanics.",
            null,
            10,
            () => {
                this.improveAttribute(Attribute.Control);
                this.improveDiscipline(Skill.Conn);
            }
        ),
        new CareerEventModel(
            "Dealing with a Plague",
            "The character’s starship was assigned to provide aid to a world deal with an epidemic. What was the disease that was running rampant? What planet it was affecting? Did the character deal directly with the sick? How was the character involved?",
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
            "Betrayed Ideals for a Superior",
            "The character was placed in a situation where they had to choose between a trusted superior and their own ideals, and chose to follow the superior. Who was the superior? What did they ask the character to do? How does the character feel now? What were the repercussions of this? Are the details of this event on record? Was the character right?",
            [Attribute.Presence],
            [Skill.Command],
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Persuasion, Inspiration, Investigation.",
            null,
            12,
            () => {
                this.improveAttribute(Attribute.Presence);
                this.improveDiscipline(Skill.Command);
            }
        ),
        new CareerEventModel(
            "Called Out a Superior",
            "The character was placed in a situation where they had to choose between a trusted superior and their own ideals, and chose to follow their ideals. Who was the superior? What did they ask the character to do? How does the character feel now? What were the repercussions of this? Are the details of this event on record? Was the character right?",
            [Attribute.Reason],
            [Skill.Conn],
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Uniform Code of Justice, History, or Starfleet Protocol.",
            null,
            13,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Conn);
            }
        ),
        new CareerEventModel(
            "New Battle Strategy",
            "In combat with a hostile force, the character devised a new strategy or tactic. Who was the battle against? Was it in space or on the ground? What was the strategy devised?",
            [Attribute.Daring],
            [Skill.Security],
            "The character gains a Focus, reflecting their decisive battlefield leadership. Examples include: Combat Tactics, Hazard Awareness, or Lead by Example.",
            null,
            14,
            () => {
                this.improveAttribute(Attribute.Daring);
                this.improveDiscipline(Skill.Security);
            }
        ),
        new CareerEventModel(
            "Learns Unique Language",
            "The character encounters a species with an unusual form of communication, and learns to communicate with them. Who were the aliens the character encountered? Was the encounter tense, or peaceful? What method of communication do the aliens use? How did the character learn it?",
            [Attribute.Insight],
            [Skill.Science],
            "The character gains a Focus, reflecting what the character learned from the event. Examples include: Linguistics, Cultural Studies, or Negotiations.",
            null,
            15,
            () => {
                this.improveAttribute(Attribute.Insight);
                this.improveDiscipline(Skill.Science);
            }
        ),
        new CareerEventModel(
            "Discovers an Artifact",
            "During a survey mission, the character discovered a device or fragment of technology from a now- extinct civilization. What did this piece of technology do? Does it still function now? What is known about the civilization that made it?",
            [Attribute.Reason],
            [Skill.Engineering],
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Ancient Technology, Computers, Reverse Engineering.",
            null,
            16,
            () => {
                this.improveAttribute(Attribute.Reason);
                this.improveDiscipline(Skill.Engineering);
            }
        ),
        new CareerEventModel(
            "Special Commendation",
            "During a crisis, the character saved the lives of several colleagues, helping them to safety.This earned the character a special commendation. What was the crisis? Why was the mission in danger? What were the repercussions of this? Are the details of this event on record?",
            [Attribute.Fitness],
            SkillsHelper.getSkills(),
            "The character gains a Focus, reflecting the event and its aftermath. Examples include: Athletics, Survival, or Emergency Medicine.",
            null,
            17,
            () => {
                this.improveAttribute(Attribute.Fitness);
            }
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
            }
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
            }
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
            }
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
            }),
    ];

    getCareerEvents() {
        return this._events;
    }

    getCareerEvent(id: number): CareerEventModel {
        let event = undefined;

        this._events.forEach(ev => {
            if (ev.roll === id) {
                event = ev;
                return;
            }
        });

        return event;
    }

    generateEvent(): CareerEventModel {
        var roll = Math.floor(Math.random() * 20) + 1;
        let event = undefined;

        this._events.forEach(ev => {
            if (ev.roll === roll) {
                event = ev;
                return;
            }
        });

        return event;
    }

    applyCareerEvent(id: number) {
        let event = this.getCareerEvent(id);
        event.onApply();
    }

    private improveAttribute(attribute: Attribute) {
        const max = character.isYoung() ? 11 : 12;
        if (character.hasMaxedAttribute() && character.attributes[attribute].value + 1 === max) {
            return;
        }

        character.attributes[attribute].value++;
    }

    private improveDiscipline(discipline: Skill) {
        const max = character.isYoung() ? 4 : 5;
        if (character.hasMaxedSkill() && character.skills[discipline].expertise + 1 === max) {
            return;
        }

        character.skills[discipline].expertise++;
    }
}

export const CareerEventsHelper = new CareerEvents();