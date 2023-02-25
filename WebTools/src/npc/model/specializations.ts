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
    values: string[];
    officerProbability: number;

    constructor(id: Specialization, name: string, primaryAttributes: Attribute[], primaryDiscipline: Skill,
        primaryFocuses: string[], secondaryFocuses: string[], values: string[],
        officerProbability: number = 0) {
        this.id = id;
        this.name = name;
        this.primaryAttributes = primaryAttributes;
        this.primaryDiscipline = primaryDiscipline;
        this.primaryFocuses = primaryFocuses;
        this.secondaryFocuses = secondaryFocuses;
        this.officerProbability = officerProbability;
        this.values = values;
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
                "EVA Protocols", "Lifeboat Protocols"],
                ["I'm most alive when I'm going fast.",
                "The Conn station is my orchestra, and I'm the conductor!",
                "Yeah... but can you do THIS!?!?",
                "Starships... are meant to FLYYYYYYYY!!!!",
                "When I fly, I'm free.",
                "Did I tell you about the time I did a flyby of Starfleet Academy in a Peregrine Fighter?",
                "I did Titan's Turn every day for six months, back on the Jovian Run. I know control!",
                "I'm not in this to be second best!",
                "Regulations specify thrusters only while in spacedock.",
                "'Almost' kicked out of the Academy essentially means 'not kicked out'."],
                0.7),
            new SpecializationModel(Specialization.Counselor, "Counselor",
                [Attribute.Insight, Attribute.Reason, Attribute.Control],
                Skill.Medicine,
                ["Psychology", "Grief Counseling", "Group Therapy", "Conversation and Listening", "Negotiation", "Psychiatry",
                "Psychoanalysis"],
                ["Psychopathology", "Crisis Counseling", "Reflection", "Interpretation", "Jungian Psychology", "Psychotherapy",
                "Coping Skills", "Cognitive-Behavioural Therapy", "Listening Techniques", "Ethics", "Research Skills", "Observation",
                "Intuition", "Relaxation Techniques", "Neurochemistry", "Psychopharmacology", "Hypnosis", "Post-Traumatic Stress Treatment",
                "Phobias and Treatment", "Xenopsychology", "Addiction Issues", "Lacanian Psychoanalysis", "Conflict Resolution" ],
                [],
                0.95),
            new SpecializationModel(Specialization.HangarDeck, "Hangar Deck",
                [Attribute.Daring, Attribute.Control],
                Skill.Conn,
                ["Shuttle Maintenance", "Shuttle Piloting", "Work Bee Specialist", "Stevedore", "Shuttle Docking Procedures", "Call Signals",
                "Shuttle Approach Protocols", "Small Craft Engines"],
                ["Shuttle Stacking", "Small Craft Identification", "Shuttle Parts and Supply", "Cargo Identification and Storage",
                "Small Craft Preparation"],
                ["When I assigned you this shuttle, it was pristine. Now look at it.",
                "People always underestimate the importance of the hanger deck.",
                "Unauthorized launches aren't gonna happen on my deck."
                ],
                0.15),
            new SpecializationModel(Specialization.Engineer, "Engineer",
                [Attribute.Reason, Attribute.Control, Attribute.Insight],
                Skill.Engineering,
                ["Warp Drive Maintenance", "Damage Control", "Anti-matter Containment", "Shield Maintenance", "Weapon System Repair",
                "Structural Engineering", "Materials Fabrication", "Electronics", "Computer Core Repair", "Impulse Drive Systems",
                "Power Systems", "Sensor Technician", "Transporters and Replicators", "Life Support Systems", "Warp Theory",
                "Subspace Communications Technology", "Electro-Plasma Systems", "Modeling and Design", "Emergency Repairs"],
                ["Dilithium Inspection", "Specialized Engineering Equipment", "Emergency Protocols", "Holodeck Repair",
                "Communciations Systems", "Equipment Diagnostics", "Away Team Equipment Repair", "EVA Operations",
                "Leading-Edge Engineering Advances", "Subspace Theory", "Alternative Propulsion Theory", "Fusion Reactors",
                "Sensor Calibration", "Jury-Rigging", "Imaging Equipment", "Flight Control Systems", "Reverse Engineering"],
                ["I live to hear those engines purr.",
                "Some people have dogs; I have warp engines",
                "The ship designers don't live in the real world. Sometimes you have to throw out the book.",
                "The engines cannot take it!",
                "I practically grew up in a Jeffries Tube.",
                "Patience. Doing it right takes time."],
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
                ["First Contact is Starfleet's highest mission",
                "If you ask us to leave, we'll leave. But we hope for a different outcome."
                ],
                0.3),
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
                ["Everyone deserves a fair defense",
                "Sometimes some very good people do some very bad things.",
                "If you wear the uniform, you agree to abide by the highest standards.",
                "An officer's first duty is to the truth",
                "Better to let 100 guilty people walk free than to convict 1 innocent person.",
                "Justice is more important than the letter of the law."],
                0.5),
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
                "Degenerative Diseases", "Veterinarian Medicine", "Medical Ethics", "Denobulan Consent Model"],
                ["Consent of the patient is the bedrock of medicine",
                "I can't let another member of this crew die!",
                "Sit down and let me finish this examination",
                "When conventional treatments aren't working, it's time to try the unconventional.",
                "Because I'm a doctor, and I said so!"],
                1),
            new SpecializationModel(Specialization.Nurse, "Nurse",
                [Attribute.Presence, Attribute.Insight, Attribute.Control],
                Skill.Medicine,
                ["Post-operative Treatment", "Surgical Nursing", "Patient Aftercare",
                "Triage", "First Aid", "Medication Administration", "Medical Safety Protocols", "Medical Tricorders and Sensors"],
                ["Wound Management", "Infectious Disease Control", "Vitals and Measurement", "Personal Safety Equipment",
                "Medical Risk Management"],
                [],
                0.15),
            new SpecializationModel(Specialization.ScienceTech, "Science Technician",
                [Attribute.Reason, Attribute.Insight, Attribute.Control],
                Skill.Science,
                ["Astrophysics", "Sensors", "Biology", "History", "Sociology", "Library Science", "Xenobiology", "Chemistry", "Terraforming",
                "Archaeology", "Anthropology", "Geology", "Particle Physics", "Botony", "Fauna", "Hydrology", "Entomology", "Warp Theory"],
                ["Lab Set-up", "Experiemental Method", "Research Techniques", "Equipment Diagnostics", "Equipment Resupply",
                "Isolation Fields", "Emergency Procedures", "Measurement and Recording", "Scheduling"],
                []),
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
                "The Works of Kazanga"],
                ["Nobody remembers the one who confirmed someone else's work.",
                "They'll remember me alongside Einstein, Kazanga, Sitar!",
                "'They laughed at Columbus, they laughed at Fulton, they laughed at the Wright Brothers. But they also laughed at Bozo the Clown.'",
                "Isn't the opportunity for greatness worth a little risk?",
                "Science is measured in decades; slow and steady wins the race.",
                "Measure twice; cut once.",
                "You don't understand! They were going to shut us down!",
                "What do you mean it's already morning?!? Have I been in the lab all night?",
                "Everything's an experiment, really.",
                "My work is at a crucial phase! Can't I deal with that tomorrow?",
                "That's not right! It should be... wait. What was I saying?",
                "Well, now I know one more way in which this isn't going to work. That's progress.",
                "It's math. Beautiful, beautiful math.",
                "Yes, this advance could be abused or weaponized. But I can't let that stop me."],
                0.9),
            new SpecializationModel(Specialization.Security, "Security",
                [Attribute.Fitness, Attribute.Daring, Attribute.Control],
                Skill.Security,
                ["Hand Phasers", "Ground Combat Tactics", "Martial Arts", "Hand-to-Hand Combat", "Shipboard Weapons", "Starship Combat Tactics",
                "Tactical Analysis", "Special Operations Training", "Infiltration", "Electronic Countermeasures", "Cybersecurity"],
                ["Investigation", "Evidence Gathering", "Security Protocols", "Brig Guard Duty", "Bodyguard", "Interrogation",
                "Security Weakness Analysis", "Explosives", "Undercover Operations", "Computer Hacking", "Codes and Cyphers", "First Aid",
                "Survival", "Forensics", "Sniper Training", "Hostage Negotiation", "Stealth Tactics", "Undercover Operations",
                "Armor and Protective Gear", "Crowd Control"],
                ["Isn't the end result more important than the rules?",
                "My job is to put my body on the line to protect others.",
                "I come alive when the action's hot!",
                "I don't want to shoot you, but I'm willing to shoot you.",
                "Do I not defeat my enemies when I make them my friend?",
                "Yippee Ki-Yay, tlhInganpu'!",
                "I'm prepared to defend myself and my team.",
                "I cannot accept that conclusion without real evidence.",
                "An eye for an eye; a tooth for a tooth",
                "Why, you little...",
                "I didn't see nuthin'",
                "Don't start none; won't be none.",
                "Give me a moment; I can practically see how it all went down.",
                "Have phaser; will travel.",
                "By the book. It exists for a good reason.",
                "We should not dismiss the possibility of hostile intent."],
                0.1),
            new SpecializationModel(Specialization.Admin, "Yeoman",
                [Attribute.Reason, Attribute.Insight, Attribute.Control],
                Skill.Command,
                ["Administrative Procedures", "Starfleet Reports", "Equipment Ordering Procedures", "Planning", "PADD Operation"],
                ["Starfleet Protocols", "Quartermaster", "Personnel Assignments", "Records Keeping", "Log Submissions", "Creative Coffee Making",
                "Promotion Paperwork", "General Paperwork", "Cargo Records"],
                ["I have the power to make an officer's day easier.",
                "Details matter.",
                "My skills complement the captain's; we make a good team.",
                "This ship would fall apart without me",
                "Missions fail when we don't have the right stuff.",
                "It sounds silly, but I just think the universe is better when organized."]),
        ];
    }

    getSpecializations() {
        return this.specializations;
    }
}