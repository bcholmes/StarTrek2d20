import {SkillsHelper, Skill} from './skills';
import {character} from '../common/character';
import {Source} from './sources';

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
}

class TrackModel {
    name: string;
    source: Source;
    description: string;
    majorDisciplines: Skill[];
    otherDisciplines: Skill[];
    focusSuggestions: string[];

    constructor(name: string, source: Source, description: string, majorDisciplines: Skill[], otherDisciplines: Skill[], focusSuggestions: string[]) {
        this.name = name;
        this.source = source;
        this.description = description;
        this.majorDisciplines = majorDisciplines;
        this.otherDisciplines = otherDisciplines;
        this.focusSuggestions = focusSuggestions;
    }
}

export class TrackViewModel extends TrackModel {
    id: Track;

    constructor(id: Track, base: TrackModel) {
        super(base.name, base.source, base.description, base.majorDisciplines, base.otherDisciplines, base.focusSuggestions);
        this.id = id;
    }
}

class Tracks {
    private _tracks: { [id: number]: TrackModel } = {
        [Track.Command]: new TrackModel(
            "Command Track",
            Source.Core,
            "The Command track is for those cadets who aspire to command their own starship someday. It focuses on leadership and interpersonal skills, diplomacy, decisionmaking in crisis situations, an understanding of protocol and procedure, and starship operations, which includes flight control. Many command track cadets begin their careers as flight control officers and pilots, where their training can be put to the test on a smaller scale while they gain the experience necessary for more authority and responsibility. Command track cadets customarily undertake the infamous Kobayashi Maru test during their final year.",
            [Skill.Command, Skill.Conn],
            [Skill.Engineering, Skill.Medicine, Skill.Science, Skill.Security],
            ["Astronavigation", "Composure", "Diplomacy", "Extra-Vehicular Activity", "Evasive Action", "Helm Operations", "Inspiration", "Persuasion", "Small Craft", "Starship Recognition", "Starfleet Protocols", "Team Dynamics"]
        ),
        [Track.Operations]: new TrackModel(
            "Operations Track",
            Source.Core,
            "The Operations track is practical and hands-on, dealing with many of the realities of Starfleet’s mission. Divided broadly into engineering and security divisions, operations track cadets are defined by a sense of pragmatism, whether that applies to the technical or the tactical.",
            [Skill.Engineering, Skill.Security],
            [Skill.Command, Skill.Conn, Skill.Medicine, Skill.Science],
            ["Computers", "Cybernetics", "Electro-Plasma Power Systems", "Espionage", "Hand Phasers", "Hand-to-Hand Combat", "Infiltration", "Interrogation", "Shipboard Tactical Systems", "Survival", "Transporters & Replicators", "Warp Field Dynamics"]
        ),
        [Track.Sciences]: new TrackModel(
            "Sciences Track",
            Source.Core,
            "Somewhat isolated from the other Tracks, the Sciences track is primarily academic, with Starfleet Academy producing many accomplished scientists. Included within the sciences track, but separated by a distinct curriculum, is Starfleet Medical, training doctors, nurses, and counselors to serve aboard Starfleet vessels and facilities across the Federation.",
            [Skill.Medicine, Skill.Science],
            [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Security],
            ["Anthropology", "Astrophysics", "Botany", "Computers", "Cybernetics", "Emergency Medicine", "Exo-tectonics", "Genetics", "Geology", "Infectious Diseases", "Linguistics", "Physics", "Psychiatry", "Quantum Mechanics", "Trauma Surgery", "Virology", "Warp Field Dynamics", "Xenobiology"]
        ),
        [Track.EnlistedSecurityTraining]: new TrackModel(
            "Enlisted Security Training",
            Source.OperationsDivision,
            "",
            [Skill.Security],
            [Skill.Conn, Skill.Engineering],
            ["Espionage", "Hand Phasers", "Hand-to-Hand Combat", "Infiltration", "Interrogation", "Shipboard Tactical Systems", "Survival"]
        ),
        [Track.ShipOperations]: new TrackModel(
            "Ship Operations",
            Source.OperationsDivision,
            "",
            [Skill.Conn],
            [Skill.Engineering, Skill.Science],
            ["Computers", "Electro-Plasma Power Systems", "Flight Control Systems", "Interrogation", "Interstellar Navigation", "Sensor Imaging", "Transporters & Replicators"]
        ),
        [Track.UniversityAlumni]: new TrackModel(
            "University Alumni",
            Source.SciencesDivision,
            "Instead of attending Starfleet Academy for four years, you choose to have been educated at one of the major universities throughout Federation space and commissioned as an officer upon graduation.",
            [Skill.Science],
            [Skill.Command, Skill.Engineering],
            ["Anthropology", "Astrophysics", "Botany", "Computers", "Cybernetics", "Emergency Medicine", "Exo-tectonics", "Genetics", "Geology", "Infectious Diseases", "Linguistics", "Physics", "Psychiatry", "Quantum Mechanics", "Trauma Surgery", "Virology", "Warp Field Dynamics", "Xenobiology"]
        ),
        [Track.ResearchInternship]: new TrackModel(
            "Research Internship",
            Source.SciencesDivision,
            "You have pursued a working internship at a major research station and obtained a commission in Starfleet following exceptional work in your field.",
            [Skill.Science],
            [Skill.Medicine, Skill.Engineering],
            ["Anthropology", "Astrophysics", "Botany", "Computers", "Cybernetics", "Emergency Medicine", "Exo-tectonics", "Genetics", "Geology", "Infectious Diseases", "Linguistics", "Physics", "Psychiatry", "Quantum Mechanics", "Trauma Surgery", "Virology", "Warp Field Dynamics", "Xenobiology"]
        ),
    };

    getTracks() {
        var tracks: TrackViewModel[] = [];
        var n = 0;
        for (var track in this._tracks) {
            var trk = this._tracks[track];

            if (character.hasSource(trk.source)) {
                if (n === Track.EnlistedSecurityTraining && !character.enlisted) {
                    n++
                    continue;
                }

                tracks.push(new TrackViewModel(n, trk));
            }

            n++;
        }

        return tracks.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    getTrack(track: Track) {
        return this._tracks[track];
    }

    generateTrack(): Track {
        var roll = Math.floor(Math.random() * 3);
        return roll;
    }

    applyTrack(track: Track) {
        switch (track) {
            case Track.EnlistedSecurityTraining:
                character.skills[Skill.Conn].expertise++;
                character.skills[Skill.Security].expertise += 2;
                character.skills[Skill.Engineering].expertise++;
                character.addFocus("Chain of Command");
                character.addTrait("Enlisted Crewman");
                character.enlisted = true;
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
    }
}

export const TracksHelper = new Tracks();