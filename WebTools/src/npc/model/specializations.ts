import { Attribute } from "../../helpers/attributes";
import { Skill } from "../../helpers/skills";

export enum Specialization {
    Security,
    Nurse,
    HangarDeck,
    ScienceTech,
    Scientist
}

export class SpecializationModel {

    id: Specialization;
    name: string;
    primaryAttributes: Attribute[];
    primaryDiscipline: Skill;
    primaryFocuses: string[];
    secondaryFocuses: string[];
    officerProbability: number;

    constructor(id: Specialization, name: string, primaryAttributes: Attribute[], primaryDiscipline: Skill,
        primaryFocuses: string[], secondaryFocuses: string[], officerProbability: number = 0) {
        this.id = id;
        this.name = name;
        this.primaryAttributes = primaryAttributes;
        this.primaryDiscipline = primaryDiscipline;
        this.primaryFocuses = primaryFocuses;
        this.secondaryFocuses = secondaryFocuses;
    }

}

export class Specializations {
    private static _instance: Specializations;

    static get instance() {
        if (Specializations._instance == null) {
            Specializations._instance = new Specializations();
        }
        return Specializations._instance;
    }

    specializations: SpecializationModel[];

    constructor() {
        this.specializations = [
            new SpecializationModel(Specialization.HangarDeck, "Hangar Deck",
                [Attribute.Daring, Attribute.Control],
                Skill.Conn,
                ["Shuttle Maintenance", "Shuttle Piloting", "Work Bee Specialist", "Stevedore", "Shuttle Docking Procedures", "Call Signals",
                "Shuttle Approach Protocols", "Small Craft Engines"],
                ["Shuttle Stacking", "Small Craft Identification", "Shuttle Parts and Supply", "Cargo Identification", "Small Craft Preparation"],
                0.15),
            new SpecializationModel(Specialization.Nurse, "Nurse",
                [Attribute.Presence, Attribute.Insight, Attribute.Control],
                Skill.Medicine,
                ["Post-operative Treatment", "Surgical Nursing", "Patient Aftercare",
                "Triage", "First Aid", "Medication Administration", "Medical Safety Protocols", "Medical Tricorders and Sensors"],
                ["Wound Management", "Infectious Disease Control", "Vitals and Measurement", "Personal Safety Equipment",
                "Medical Risk Management"], 0.15),
            new SpecializationModel(Specialization.ScienceTech, "Science Technician",
                [Attribute.Reason, Attribute.Insight, Attribute.Control],
                Skill.Science,
                ["Astrophysics", "Sensors", "Biology", "History", "Sociology", "Library Science", "Xenobiology", "Chemistry", "Terraforming",
                "Archaeology", "Anthropology", "Geology", "Particle Physics", "Botony", "Fauna", "Hydrology", "Entomology", "Warp Theory"],
                ["Lab Set-up", "Experiemental Method", "Research Techniques", "Equipment Diagnostics", "Equipment Resupply",
                "Isolation Fields", "Emergency Procedures", "Measurement and Recording", "Scheduling"]),
            new SpecializationModel(Specialization.Scientist, "Scientist",
                [Attribute.Reason, Attribute.Insight, Attribute.Control],
                Skill.Science,
                ["Astrophysics", "Sensors", "Biology", "History", "Sociology", "Library Science", "Xenobiology", "Chemistry", "Terraforming",
                "Archaeology", "Anthropology", "Geology", "Particle Physics", "Botony", "Fauna", "Hydrology", "Entomology", "Warp Theory",
                "Cultural Theory", "Sociology", "Economics", "Astronomy", "Stellar Cartography", "Cybernetics", "Metallurgy", "Paleontology",
                "Tricorder Operation"],
                ["Research Publication", "Scientific Journals", "Research Methods", "Specialized Scientific Equipment", "Emergency Procedures",
                "Isolation Fields", "Gravitational Theory", "Calculus", "Computer Simulation", "Holographic Simulation", "Computer Programming",
                "Starfleet Science", "Daystrom Institute Research Priorities", "The Works of Gideon Seyetik", "The Works of Sitar",
                "The Works of Kazanga"], 0.9),
            new SpecializationModel(Specialization.Security, "Security",
                [Attribute.Fitness, Attribute.Daring, Attribute.Control],
                Skill.Security,
                ["Hand Phasers", "Ground Combat Tactics", "Martial Arts", "Hand-to-Hand Combat", "Shipboard Weapons", "Starship Combat Tactics",
                "Tactical Analysis", "Special Operations Training", "Infiltration", "Electronic Countermeasures", "Forensics", "Cyber Security"],
                ["Investigation", "Evidence Gathering", "Security Protocols", "Brig Guard Duty", "Bodyguard", "Interrogation",
                "Security Weakness Analysis", "Explosives", "Undercover Operations", "Computer Hacking", "Codes and Cyphers", "First Aid"]),
        ];
    }

    getSpecializations() {
        return this.specializations;
    }
}