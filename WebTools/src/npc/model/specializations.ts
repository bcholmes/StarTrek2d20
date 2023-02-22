import { Attribute } from "../../helpers/attributes";
import { Skill } from "../../helpers/skills";

export enum Specialization {
    Admin,
    Security,
    MedicalDoctor,
    Nurse,
    HangarDeck,
    Conn,
    ScienceTech,
    Scientist,
    Engineer
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
        this.officerProbability = officerProbability;
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
            new SpecializationModel(Specialization.Conn, "Conn",
                [Attribute.Daring, Attribute.Control],
                Skill.Conn,
                ["Helm Operations", "Small Craft Operations", "Evasive Maneuvers", "Precision Flying", "Shuttle Maintenance", "Warp Field Theory",
                "Test Pilot", "Dogfighting", "Astrogation", "Attack Maneuvers"],
                ["High Warp Maneuvers", "Warp Trail Identification", "High Gravity Maneuvers", "Starship Landing Procedures", "Stellar Systems",
                "Spacecraft Identification", "Emergency Landing Procedures", "Spacedock Protocols", "Racing", "Watercraft", "Zero-G Operations",
                "EVA Protocols", "Lifeboat Protocols"], 0.7),
            new SpecializationModel(Specialization.HangarDeck, "Hangar Deck",
                [Attribute.Daring, Attribute.Control],
                Skill.Conn,
                ["Shuttle Maintenance", "Shuttle Piloting", "Work Bee Specialist", "Stevedore", "Shuttle Docking Procedures", "Call Signals",
                "Shuttle Approach Protocols", "Small Craft Engines"],
                ["Shuttle Stacking", "Small Craft Identification", "Shuttle Parts and Supply", "Cargo Identification and Storage",
                "Small Craft Preparation"],
                0.15),
            new SpecializationModel(Specialization.Engineer, "Engineer",
                [Attribute.Reason, Attribute.Control, Attribute.Insight],
                Skill.Engineering,
                ["Warp Drive Maintenance", "Damage Control", "Anti-matter Containment", "Shield Maintenance", "Weapon System Repair",
                "Structural Engineering", "Materials Fabrication", "Electronics", "Computer Core Repair", "Impulse Drive Systems",
                "Power Systems", "Sensor Technician", "Transporters and Replicators", "Life Support Systems", "Warp Theory",
                "Subspace Communications Technology"],
                ["Dilithium Inspection", "Specialized Engineering Equipment", "Emergency Protocols", "Holodeck Repair",
                "Communciations Systems", "Equipment Diagnostics", "Away Team Equipment Repair", "EVA Operations",
                "Leading-Edge Engineering Advances", "Subspace Theory", "Alternative Propulsion Theory"],
                0.1),
            new SpecializationModel(Specialization.MedicalDoctor, "Medical Doctor",
                [Attribute.Presence, Attribute.Insight, Attribute.Control],
                Skill.Medicine,
                ["Surgery", "Immunology", "Pharmacology", "Orthopedics", "Reconstructive Surgery", "Medical Equipment Specialist",
                "First Aid", "Diagnosis", "Medical Safety Protocols", "Medical Tricorders and Sensors",
                "Infectious Diseases", "Xenobiology", "Esoteric Medicine", "Neurology", "Anesthesiology"],
                ["Triage", "Treatment Plans", "Infectious Disease Control", "Parasites", "Personal Safety Equipment", "Physiology",
                "Medical Risk Management", "The Nervous System", "Cardiothoracics", "Pediatrics", "Trauma", "Prosthetics",
                "Quarantine Procedures", "Silicon-based Life Forms", "Yonadan Medical Database", "Medical Experimentation",
                "Medical Research", "Outbreak Protocols", "History of Medicine", "Pathology", "Autopsy", "Medical Administration"], 1),
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
                "Tactical Analysis", "Special Operations Training", "Infiltration", "Electronic Countermeasures", "Cybersecurity"],
                ["Investigation", "Evidence Gathering", "Security Protocols", "Brig Guard Duty", "Bodyguard", "Interrogation",
                "Security Weakness Analysis", "Explosives", "Undercover Operations", "Computer Hacking", "Codes and Cyphers", "First Aid",
                "Survival", "Forensics", "Sniper Training", "Hostage Negotiation", "Stealth Tactics", "Undercover Operations"],
                0.1),
            new SpecializationModel(Specialization.Admin, "Yeoman",
                [Attribute.Reason, Attribute.Insight, Attribute.Control],
                Skill.Command,
                ["Administrative Procedures", "Starfleet Reports", "Equipment Ordering Procedures", "Planning", "PADD Operation"],
                ["Starfleet Protocols", "Quartermaster", "Personnel Assignments", "Records Keeping", "Log Submissions", "Creative Coffee Making",
                "Promotion Paperwork", "General Paperwork", "Cargo Records"]),
        ];
    }

    getSpecializations() {
        return this.specializations;
    }
}