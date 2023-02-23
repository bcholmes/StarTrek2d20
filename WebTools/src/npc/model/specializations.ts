import { Attribute } from "../../helpers/attributes";
import { Skill } from "../../helpers/skills";

export enum Specialization {
    Admin,
    Counselor,
    FirstContactSpecialist,
    Jag,
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
            new SpecializationModel(Specialization.Counselor, "Counselor",
                [Attribute.Insight, Attribute.Reason, Attribute.Control],
                Skill.Medicine,
                ["Psychology", "Grief Counseling", "Group Therapy", "Conversation and Listening", "Negotiation", "Psychiatry",
                "Psychoanalysis"],
                ["Psychopathology", "Crisis Counseling", "Reflection", "Interpretation", "Jungian Psychology", "Psychotherapy",
                "Coping Skills", "Cognitive-Behavioural Therapy", "Listening Techniques", "Ethics", "Research Skills", "Observation",
                "Intuition", "Relaxation Techniques", "Neurochemistry", "Psychopharmacology", "Hypnosis", "Post-Traumatic Stress Treatment",
                "Phobias and Treatment", "Xenopsychology", "Addiction Issues", "Lacanian Psychoanalysis", "Conflict Resolution" ], 0.95),
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
            new SpecializationModel(Specialization.FirstContactSpecialist, "First Contact Specialist",
                [Attribute.Presence, Attribute.Control, Attribute.Insight],
                Skill.Command,
                ["Cultural Studies", "Negotiation", "Diplomacy", "Psychology", "Xenopsycholody", "Governance",
                "Cultural Politics", "Linguistics", "Comparative Religion", "Politics", "Political Science", "History",
                "Anthropology"],
                ["Rituals and Performance", "Laws and Lawmaking", "Putting People at Ease", "Research", "Media Research", "Schmoozing",
                "Social Events", "Organization and Planning", "Federation History", "Federation Culture", "Conflict Resolution",
                "First Contact Protocols", "The Prime Directive", "Standard Technology Progression Models", "Cultural Maturity Markers"],
                0.1),
            new SpecializationModel(Specialization.Jag, "Judge Advocate General's Office",
                [Attribute.Presence, Attribute.Control, Attribute.Insight],
                Skill.Command,
                ["Starfleet Protocols", "Federation Laws", "Legal Procedures", "Starfleet Rules and Regulations", "Legal Arguments", "Case Law",
                "Witness Preparation", "Assessing Evidence", "Standards of Evidence", "Courtmartial Defenses", "Defense Preparation",
                "Prosecution", "Commercial Law", "Tribunals", "Truth and Reconciliation Processes", "Restorative Justice",
                "Legal Differences of Federation Worlds"],
                ["Guaging Reactions", "Jury Selection", "Performance", "Famous Cases", "History of Federation Law", "Legal Jurisdictions",
                "Sneaky Legal Maneuvers", "The Writings of Sam Cogley", "Evaluating Testimony", "Argument Weakness Detection", "Forensics",
                "Investigative Methods", "The Prime Directive in Depth", "Klingon Law", "Cardassian Law", "Romulan Law", "Sheliak Law",
                "Expert Testimony Preparation"],
                0.1),
            new SpecializationModel(Specialization.MedicalDoctor, "Medical Doctor",
                [Attribute.Presence, Attribute.Insight, Attribute.Control],
                Skill.Medicine,
                ["Surgery", "Immunology", "Pharmacology", "Orthopedics", "Reconstructive Surgery", "Medical Equipment Specialist",
                "First Aid", "Diagnosis", "Medical Safety Protocols", "Medical Tricorders and Sensors",
                "Infectious Diseases", "Xenobiology", "Esoteric Medicine", "Neurology", "Anesthesiology",
                "Obstetrics and Gynaecology"],
                ["Triage", "Treatment Plans", "Infectious Disease Control", "Parasites", "Personal Safety Equipment", "Physiology",
                "Medical Risk Management", "The Nervous System", "Cardiothoracics", "Pediatrics", "Trauma Medicine", "Prosthetics",
                "Quarantine Procedures", "Silicon-based Life Forms", "Yonadan Medical Database", "Medical Experimentation",
                "Medical Research", "Outbreak Protocols", "History of Medicine", "Pathology", "Autopsy", "Medical Administration",
                "Cryogenics", "Cosmetic Disguise", "Medical Biofilters", "Genetics", "Cloning", "Genetic Augmentation",
                "Degenerative Diseases", "Veterinarian Medicine", "Medical Ethics", "Denobulan Consent Model"], 1),
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
                "Survival", "Forensics", "Sniper Training", "Hostage Negotiation", "Stealth Tactics", "Undercover Operations",
                "Armor and Protective Gear", "Crowd Control"],
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