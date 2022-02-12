import {Skill} from './skills';
import {character } from '../common/character';
import {CharacterType } from '../common/characterType';
import {Source} from './sources';
import { Attribute } from './attributes';

export enum Track {
    // Core
    Command,
    Operations,
    Sciences,

    // Operations
    EnlistedSecurityTraining,
    ShipOperations,

    // Sciences
    UniversityAlumni,
    ResearchInternship,

    // Klingon Core
    Technical,
    EnlistedWarrior,
    Laborer,

    // Player's Guide - Allied Militaries
    RankAndFile,
    Officer,
    IntelligenceTraining,
    MilitiaAndGuerillas
}

export enum ImprovementRuleType {
    AT_LEAST_ONE, MUST_INCLUDE_ALL
}

export class AttributeImprovementRule {
    attributes: Attribute[];
    type: ImprovementRuleType;

    constructor(type: ImprovementRuleType, ...attributes: Attribute[]) {
        this.attributes = attributes;
        this.type = type;
    }

    describe() {
        return "At least one point must be spent on " + this.describeAttributes() + ".";
    }

    describeAttributes() {
        let result = this.attributes.length > 1 ? "either " : "";
        this.attributes.forEach((a, i) => { result += (i === 0) ? Attribute[a] : (" or " + Attribute[a])});
        return result;
    }
}

export class SkillImprovementRule {
    skills: Skill[];
    type: ImprovementRuleType;

    constructor(type: ImprovementRuleType, ...skills: Skill[]) {
        this.type = type;
        this.skills = skills;
    }

    describe() {
        return "Points must be distributed to " + this.describeSkills() + ".";
    }

    describeSkills() {
        let result = this.skills.length > 1 ? "each of " : "";
        this.skills.forEach((s, i) => { result += (i === 0) ? Skill[s] : (" and " + Skill[s])});
        return result;
    }
}


export class TrackModel {
    id: Track;
    name: string;
    source: Source;
    description: string;
    majorDisciplines: Skill[];
    otherDisciplines: Skill[];
    focusSuggestions: string[];
    attributesRule?: AttributeImprovementRule;
    skillsRule?: SkillImprovementRule;
    enlisted: boolean;

    constructor(id: Track, name: string, source: Source, description: string, majorDisciplines: Skill[], otherDisciplines: Skill[], focusSuggestions: string[], attributes?: AttributeImprovementRule, skillsRule?: SkillImprovementRule, enlisted: boolean = false) {
        this.id = id;
        this.name = name;
        this.source = source;
        this.description = description;
        this.majorDisciplines = majorDisciplines;
        this.otherDisciplines = otherDisciplines;
        this.focusSuggestions = focusSuggestions;
        this.attributesRule = attributes;
        this.skillsRule = skillsRule;
        this.enlisted = enlisted;
    }
}

class Tracks {
    private _tracks: TrackModel[] = [
        new TrackModel(
            Track.Command,
            "Command Track",
            Source.Core,
            "The Command track is for those cadets who aspire to command their own starship someday. It focuses on leadership and interpersonal skills, diplomacy, decisionmaking in crisis situations, an understanding of protocol and procedure, and starship operations, which includes flight control. Many command track cadets begin their careers as flight control officers and pilots, where their training can be put to the test on a smaller scale while they gain the experience necessary for more authority and responsibility. Command track cadets customarily undertake the infamous Kobayashi Maru test during their final year.",
            [Skill.Command, Skill.Conn],
            [Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security],
            ["Astronavigation", "Composure", "Diplomacy", "Extra-Vehicular Activity", "Evasive Action", "Helm Operations", "Inspiration", "Persuasion", "Small Craft", "Starship Recognition", "Starfleet Protocols", "Team Dynamics"]
        ),
        new TrackModel(
            Track.Operations,
            "Operations Track",
            Source.Core,
            "The Operations track is practical and hands-on, dealing with many of the realities of Starfleet’s mission. Divided broadly into engineering and security divisions, operations track cadets are defined by a sense of pragmatism, whether that applies to the technical or the tactical.",
            [Skill.Engineering, Skill.Security],
            [Skill.Command, Skill.Conn, Skill.Medicine, Skill.Science],
            ["Computers", "Cybernetics", "Electro-Plasma Power Systems", "Espionage", "Hand Phasers", "Hand-to-Hand Combat", "Infiltration", "Interrogation", "Shipboard Tactical Systems", "Survival", "Transporters & Replicators", "Warp Field Dynamics"]
        ),
        new TrackModel(
            Track.Sciences,
            "Sciences Track",
            Source.Core,
            "Somewhat isolated from the other Tracks, the Sciences track is primarily academic, with Starfleet Academy producing many accomplished scientists. Included within the sciences track, but separated by a distinct curriculum, is Starfleet Medical, training doctors, nurses, and counselors to serve aboard Starfleet vessels and facilities across the Federation.",
            [Skill.Medicine, Skill.Science],
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Security],
            ["Anthropology", "Astrophysics", "Botany", "Computers", "Cybernetics", "Emergency Medicine", "Exo-tectonics", "Genetics", "Geology", "Infectious Diseases", "Linguistics", "Physics", "Psychiatry", "Quantum Mechanics", "Trauma Surgery", "Virology", "Warp Field Dynamics", "Xenobiology"]
        ),
        new TrackModel(
            Track.EnlistedSecurityTraining,
            "Enlisted Security Training",
            Source.OperationsDivision,
            "",
            [Skill.Security],
            [Skill.Conn, Skill.Engineering],
            ["Espionage", "Hand Phasers", "Hand-to-Hand Combat", "Infiltration", "Interrogation", "Shipboard Tactical Systems", "Survival"],
            undefined,
            undefined,
            true
        ),
        new TrackModel(
            Track.ShipOperations,
            "Ship Operations",
            Source.OperationsDivision,
            "",
            [Skill.Conn],
            [Skill.Engineering, Skill.Science],
            ["Computers", "Electro-Plasma Power Systems", "Flight Control Systems", "Interrogation", "Interstellar Navigation", "Sensor Imaging", "Transporters & Replicators"]
        ),
        new TrackModel(
            Track.UniversityAlumni,
            "University Alumni",
            Source.SciencesDivision,
            "Instead of attending Starfleet Academy for four years, you choose to have been educated at one of the major universities throughout Federation space and commissioned as an officer upon graduation.",
            [Skill.Science],
            [Skill.Command, Skill.Engineering],
            ["Anthropology", "Astrophysics", "Botany", "Computers", "Cybernetics", "Emergency Medicine", "Exo-tectonics", "Genetics", "Geology", "Infectious Diseases", "Linguistics", "Physics", "Psychiatry", "Quantum Mechanics", "Trauma Surgery", "Virology", "Warp Field Dynamics", "Xenobiology"]
        ),
        new TrackModel(
            Track.ResearchInternship,
            "Research Internship",
            Source.SciencesDivision,
            "You have pursued a working internship at a major research station and obtained a commission in Starfleet following exceptional work in your field.",
            [Skill.Science],
            [Skill.Medicine, Skill.Engineering],
            ["Anthropology", "Astrophysics", "Botany", "Computers", "Cybernetics", "Emergency Medicine", "Exo-tectonics", "Genetics", "Geology", "Infectious Diseases", "Linguistics", "Physics", "Psychiatry", "Quantum Mechanics", "Trauma Surgery", "Virology", "Warp Field Dynamics", "Xenobiology"]
        ),
    ];

    private _klingonTracks: TrackModel[] = [
        new TrackModel(
            Track.Command,
            "Command Officer",
            Source.KlingonCore,
            "Your training was in leadership, but you have honed your martial prowess too, for any leader who cannot defend themselves is not worthy of their rank...and you may find you have to put this to the test if an underling challenges you for position. You are required to serve as a representative of your ship, your crew, and the Empire (and possibly a particular House as well), to varying degrees depending on your posting, and this may involve a degree of diplomacy as well as strength at arms.",
            [Skill.Command, Skill.Security],
            [Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science],
            ["Astronavigation", "Composure", "Diplomacy", "Extra-Vehicular Activity", "Evasive Action", "Helm Operations", "Inspiration", "Persuasion", "Small Craft", "Starship Recognition", "Starfleet Protocols", "Team Dynamics"]
        ),
        new TrackModel(
            Track.Technical,
            "Technical Officer",
            Source.KlingonCore,
            "Your role in the Klingon Defense Force means that you require both technical skill and considerable authority. You are amongst those responsible for operating and maintaining the advanced systems of a bird-of-prey or other starship, such as the warp drive, the cloaking device, and similar, and for overseeing the warriors and laborers who support your efforts.",
            [Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science],
            [Skill.Command, Skill.Security],
            ["Astrophysics", "Astronavigation", "Computers", "Cybernetics", "Electro-Plasma Power Systems", "Emergency Medicine", "Extra-Vehicular Activity", "Genetics", "Helm Operations", "Infectious Diseases", "Physics", "Quantum Mechanics", "Sensor Operations", "Shipboard Tactical Systems", "Transporters", "Trauma Surgery", "Warp Field Dynamics"]
        ),
        new TrackModel(
            Track.EnlistedWarrior,
            "Enlisted Warrior",
            Source.KlingonCore,
            "or could not gain admission to one of the prestigious military academies to become an officer, you joined the Klingon Defense Force as one of the rank-and-file. You may yet attain some important position aboard the ship, or achieve glory sufficient to earn a battlefield commission, but for now, you fight where the officers command, and do so without complaint.",
            [Skill.Conn, Skill.Security],
            [Skill.Command, Skill.Engineering, Skill.Medicine, Skill.Science],
            ["Blades", "Composure", "Disruptors", "Hand-to-Hand Combat", "Intimidation", "Sensor Operations", "Shipboard Tactical Systems", "Survival"],
            undefined,
            undefined,
            true
        ),
        new TrackModel(
            Track.Laborer,
            "Laborer",
            Source.KlingonCore,
            "The Klingon Defense Force has need of more than merely warriors. Numerous practical and technical aspects of military life require workers to perform routine, mundane labors, assisting with the maintenance and upkeep of the ship, overseeing cargo, preparing meals for the crew and officers, providing basic first aid, and a variety of other tasks. This is vital work, but not especially glorious, though a few of the civilian laborers working on KDF vessels catch the attentions of their superiors and receive the opportunity to better themselves, being permitted to enlist or even being offered a battlefield commission if they have proven themselves worthy.",
            [Skill.Engineering, Skill.Science],
            [Skill.Command, Skill.Conn, Skill.Medicine, Skill.Security],
            ["Animal Handling", "Computers", "Electro-Plasma Power Systems", "Emergency Medicine", "Starship Maintenance", "Survival", "Transporter Systems"],
            undefined,
            undefined,
            true
        ),
    ];
        
    private _alliedMilitaryTracks: TrackModel[] = [
        new TrackModel(
            Track.RankAndFile,
            "Rank and File",
            Source.PlayersGuide,
            "You represent the common mass of professional military personnel, who will serve as a mixture of ground troops and naval personnel. Most powerful civilizations operate a voluntary and highly selective armed service, preferring to cultivate quality rather than rely on the dubious advantages of raw quantity. When considering the need to transport and supply warriors across an interstellar nation, the drawbacks of massed ranks of conscripts far outweigh the benefits.",
            [Skill.Security],
            [Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Command],
            ["Composure", "Extra-Vehicular Activity", "Small Craft", "Military Protocol", "Hand Phasers", "Disruptors", "Hand-to-Hand Combat", "Infiltration", "Survival", "Demolitions"],
            new AttributeImprovementRule(ImprovementRuleType.AT_LEAST_ONE, Attribute.Daring),
            undefined,
            true
        ),
        new TrackModel(
            Track.Officer,
            "Officer Training",
            Source.PlayersGuide,
            "You spent years of study to become an officer in your nation’s military. This encompassed both training in leadership and command, but also combat skills, technical and scientific studies, and a variety of other disciplines. Most military officers in the Alpha and Beta Quadrants have a breadth and depth of training akin to that of a Starfleet officer, though generally with more focus on military applications rather than exploration.",
            [Skill.Command, Skill.Security],
            [Skill.Conn, Skill.Engineering, Skill.Medicine, Skill.Science],
            ["Diplomacy", "Inspiration", "Strategy & Tactics", "Military Protocol", "History", "Politics", "Hand Phasers", "Disruptors", "Hand-to-Hand Combat", "Shipboard Tactical Systems"],
            undefined, 
            new SkillImprovementRule(ImprovementRuleType.MUST_INCLUDE_ALL, Skill.Command, Skill.Security)
        ),
        new TrackModel(
            Track.IntelligenceTraining,
            "Intelligence Training",
            Source.PlayersGuide,
            "You applied to join your nation’s military or some other civil service, and they found that your talents could be put to good use in intelligence. While you might have an official posting as ordinary personnel aboard a ship or a starbase, or an office in some government bureau, your true duties are both loftier and more clandestine.",
            [Skill.Conn, Skill.Security, Skill.Command, Skill.Engineering, Skill.Medicine, Skill.Science],
            [],
            ["Persuasion", "Computers", "Espionage", "Infiltration", "Interrogation", "Linguistics", "Threat Analysis"],
            new AttributeImprovementRule(ImprovementRuleType.AT_LEAST_ONE, Attribute.Insight, Attribute.Reason),
            new SkillImprovementRule(ImprovementRuleType.MUST_INCLUDE_ALL, Skill.Security)
        ),
        new TrackModel(
            Track.MilitiaAndGuerillas,
            "Militias and Guerillas",
            Source.PlayersGuide,
            "You didn’t have any formal training. Rather, you learned to fight out of necessity, to defend your home from aggressors and invaders, or to try and liberate it from those who were oppressing your people. Frontier colonies, worlds where society has collapsed into feuding factions, and conquered planets often produce these kinds of fighters.",
            [Skill.Security],
            [Skill.Command, Skill.Conn,Skill.Engineering, Skill.Medicine, Skill.Science],
            ["Composure, Inspiration", "Psychological Warfare", "Hand Phasers", "Disruptors", "Hand-to-Hand Combat", "Infiltration", "Disguise", "Interrogation", "Demolition"],
            new AttributeImprovementRule(ImprovementRuleType.AT_LEAST_ONE, Attribute.Daring, Attribute.Fitness)
        ),
    ];

    private chooseList(type: CharacterType) {
        if (type === CharacterType.AlliedMilitary) {
            return this._alliedMilitaryTracks;
        } else if (type === CharacterType.KlingonWarrior) {
            return this._klingonTracks;
        } else {
            return this._tracks;
        }
    }

    getTracks() {
        var tracks: TrackModel[] = [];
        var list = this.chooseList(character.type);
        for (let model of list) {
            if (character.hasSource(model.source)) {
                if (model.id === Track.EnlistedSecurityTraining && !character.enlisted && character.type !== CharacterType.KlingonWarrior) {
                    continue;
                }

                tracks.push(model);
            }
        }

        return tracks.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    getTrack(track: Track) {
        let list = this.chooseList(character.type);
        let result = null;
        for (let t of list) {
            if (t.id === track) {
                result = t;
                break;
            }
        }
        return result;
    }

    generateTrack(): Track {
        if (character.type === CharacterType.Starfleet) {
            let tracks = [ Track.Command, Track.Operations, Track.Sciences ];
            let roll = Math.floor(Math.random() * tracks.length);
            return tracks[roll];
        } else {
            let list = this.chooseList(character.type);
            let roll = Math.floor(Math.random() * list.length);
            return list[roll].id;
        }
    }

    applyTrack(track: Track) {
        const model = this.getTrack(track);
        switch (track) {
            case Track.EnlistedSecurityTraining:
                character.skills[Skill.Conn].expertise++;
                character.skills[Skill.Security].expertise += 2;
                character.skills[Skill.Engineering].expertise++;
                character.addFocus("Chain of Command");
                character.addTrait("Enlisted Crewman");
                break;
            case Track.ShipOperations:
                character.skills[Skill.Conn].expertise += 2;
                character.skills[Skill.Engineering].expertise++;
                character.skills[Skill.Science].expertise++;
                break;
            case Track.UniversityAlumni:
                character.skills[Skill.Science].expertise += 2;
                character.skills[Skill.Engineering].expertise++;
                character.skills[Skill.Command].expertise++;
                break;
            case Track.ResearchInternship:
                character.skills[Skill.Science].expertise += 2;
                character.skills[Skill.Engineering].expertise++;
                character.skills[Skill.Medicine].expertise++;
                break;
            default:
                break;
        }
        if (model.enlisted) {
            character.enlisted = true;
        }
    }
}

export const TracksHelper = new Tracks();
