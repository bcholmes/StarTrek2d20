import { Specialization } from "../../common/specializationEnum";
import { Attribute } from "../../helpers/attributes";
import { Skill } from "../../helpers/skills";
import { Species } from "../../helpers/speciesEnum";
import { NpcCharacterType } from "./npcCharacterType";

export class SpecializationModel {

    id: Specialization;
    type: NpcCharacterType;
    name: string;
    primaryAttributes: Attribute[];
    primaryDiscipline: Skill;
    primaryFocuses: string[];
    secondaryFocuses: string[];
    values: string[];
    officerProbability: number;
    species: Species[];

    constructor(id: Specialization, type: NpcCharacterType, name: string, primaryAttributes: Attribute[], primaryDiscipline: Skill,
        primaryFocuses: string[], secondaryFocuses: string[], values: string[],
        officerProbability: number = 0, species: Species[] = []) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.primaryAttributes = primaryAttributes;
        this.primaryDiscipline = primaryDiscipline;
        this.primaryFocuses = primaryFocuses;
        this.secondaryFocuses = secondaryFocuses;
        this.officerProbability = officerProbability;
        this.values = values;
        this.species = species;
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
            new SpecializationModel(Specialization.Admiral, NpcCharacterType.Starfleet, "Admiralty",
                [Attribute.Control, Attribute.Presence, Attribute.Reason],
                Skill.Command,
                ["Fleet Tactics", "Mission Assignment", "Personnel Allocation", "Ship Capabilities", "Starship Assignment", "Starfleet Protocols",
                "Tactical Analysis", "Federation Allies and Enemies", "Fleet Deployment Logistics", "Diplomatic Priorities"],
                ["Risk Assessment", "Mission Parameters", "Diplomacy", "Starfleet Command Structure", "Starfleet Ships and their Captains",
                "Outside-of-the-box Tactics", "Current Border Readiness", "External Polity Intelligence", "Negotiation", "Military Intelligence",
                "Current Exploration Priorities", "Recent Treaties", "Sheliak Disputes", "Operational Efficiency", "Tzenkethi Treaties",
                "Klingon Military Deployments", "Romulan Battle Strategies", "Romulan Coups", "Cardassian Governmental Policy",
                "The Strategies of Adm. Nogura", "Interstellar Law"],
                ["You call that a salute?",
                "You have to see the whole board",
                "Sometimes I have to withhold information for tactical reasons",
                "Nothing is more important than the chain of command",
                "I gave you an order, officer.",
                "I've sent a lot of good officers to their deaths",
                "Seeking out new civilizations is the fleet's highest mission",
                "We are as much an organization of science and exploration as we are of defence",
                "Do not underestimate our enemy",
                "Sometimes you gotta roll the hard six",
                "A diplomatic solution is strongly preferred",
                "A declaration of war is a sign of failure",
                "Ensure the successful completion of the mission. All other considerations are secondary. Your crew is expendable."],
                1),
            new SpecializationModel(Specialization.Conn, NpcCharacterType.Starfleet, "Conn",
                [Attribute.Daring, Attribute.Control],
                Skill.Conn,
                ["Helm Operations", "Small Craft Operations", "Evasive Maneuvers", "Precision Flying", "Shuttle Maintenance", "Warp Field Theory",
                "Test Pilot", "Dogfighting", "Astrogation", "Attack Maneuvers"],
                ["High Warp Maneuvers", "Warp Trail Identification", "High Gravity Maneuvers", "Starship Landing Procedures", "Stellar Systems",
                "Spacecraft Identification", "Emergency Landing Procedures", "Spacedock Protocols", "Racing", "Watercraft", "Zero-G Operations",
                "EVA Protocols", "Lifeboat Protocols"],
                [
                    "I'm most alive when I'm going fast.",
                    "The Conn station is my orchestra, and I'm the conductor!",
                    "Yeah... but can you do THIS!?!?",
                    "Starships... are meant to FLYYYYYYYY!!!!",
                    "When I fly, I'm free.",
                    "Did I tell you about the time I did a flyby of Starfleet Academy in a Peregrine Fighter?",
                    "I did Titan's Turn every day for six months, back on the Jovian Run. I know control!",
                    "I'm not in this to be second best!",
                    "Regulations specify thrusters only while in spacedock.",
                    "'Almost' kicked out of the Academy is the same as 'not kicked out'."
                ],
                0.7),
            new SpecializationModel(Specialization.Counselor, NpcCharacterType.Starfleet, "Counselor",
                [Attribute.Insight, Attribute.Reason, Attribute.Control],
                Skill.Medicine,
                ["Psychology", "Grief Counseling", "Group Therapy", "Conversation and Listening", "Negotiation", "Psychiatry",
                "Psychoanalysis"],
                ["Psychopathology", "Crisis Counseling", "Reflection", "Interpretation", "Jungian Psychology", "Psychotherapy",
                "Coping Skills", "Cognitive-Behavioural Therapy", "Listening Techniques", "Ethics", "Research Skills", "Observation",
                "Intuition", "Relaxation Techniques", "Neurochemistry", "Psychopharmacology", "Hypnosis", "Post-Traumatic Stress Treatment",
                "Phobias and Treatment", "Xenopsychology", "Addiction Issues", "Lacanian Psychoanalysis", "Conflict Resolution" ],
                [
                    "I think you need to forgive yourself.",
                    "A comfort zone is a beautiful place, but nothing ever grows there.",
                    "It's going to take time. But this was a good first step",
                    "Our wounds are often the openings into the best and most beautiful parts of us.",
                    "Life doesn't make any sense without interdependence. We need each other.",
                    "A failure is not a mistake, it may simply be the best one can do under the circumstances. The real mistake is to stop trying.",
                    "We chose to risk our lives in this dangerous career. Our peers also chose. That doesn't always comfort us when we lose them.",
                    "It's okay to feel what you're feeling.",
                    "I can see you're in a great deal of pain",
                    "A pint cannot hold a quart; if it's holding a pint, it's doing the best it can."
                ],
                0.95),
            new SpecializationModel(Specialization.HangarDeck, NpcCharacterType.Starfleet, "Hangar Deck",
                [Attribute.Daring, Attribute.Control],
                Skill.Conn,
                ["Shuttle Maintenance", "Shuttle Piloting", "Work Bee Specialist", "Stevedore", "Shuttle Docking Procedures", "Call Signals",
                "Shuttle Approach Protocols", "Small Craft Engines"],
                ["Shuttle Stacking", "Small Craft Identification", "Shuttle Parts and Supply", "Cargo Identification and Storage",
                "Small Craft Preparation"],
                ["When I assigned you this shuttle, it was pristine. Now look at it.",
                "People always underestimate the importance of the hanger deck.",
                "Unauthorized launches aren't gonna happen on my deck.",
                "I hate it when Away Teams crash our shuttles.",
                "I'm sure that'll buff out.",
                "The shuttles exist to serve the mission; if the mission succeeds but the shuttle is lost... that's still success."],
                0.15),
            new SpecializationModel(Specialization.Engineer, NpcCharacterType.Starfleet, "Engineer",
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
                "Patience. Doing it right takes time.",
                "Measure twice; cut once.",
                "I cannot abide shoddy work!",
                "The right tool for the right job",
                "It's a poor worker who blames their tools",
                "I think I can squeeze a little bit more performance out of this system.",
                "It doesn't have to be perfect; it has to be ready on time.",
                "Perfect is the enemy of good."],
                0.1),
            new SpecializationModel(Specialization.FirstContactSpecialist, NpcCharacterType.Starfleet, "First Contact Specialist",
                [Attribute.Presence, Attribute.Control, Attribute.Insight],
                Skill.Command,
                ["Cultural Studies", "Negotiation", "Diplomacy", "Psychology", "Xenopsycholody", "Governance",
                "Cultural Politics", "Linguistics", "Comparative Religion", "Politics", "Political Science", "History",
                "Anthropology"],
                ["Rituals and Performance", "Laws and Lawmaking", "Putting People at Ease", "Research", "Media Research", "Schmoozing",
                "Social Events", "Organization and Planning", "Federation History", "Federation Culture", "Conflict Resolution",
                "First Contact Protocols", "The Prime Directive", "Standard Technology Progression Models", "Cultural Maturity Markers"],
                ["First Contact is Starfleet's highest mission",
                "If you ask us to leave, we'll leave. But we hope for a different outcome.",
                "We have great things to learn from our differences.",
                "We wish to create an open channel for communication.",
                "Every once in a while we meet a truly alien species; it's a profound learning experience.",
                "I envy you, taking these first steps into a new frontier."
                ],
                0.3),
            new SpecializationModel(Specialization.IntelligenceOfficer, NpcCharacterType.Starfleet, "Intelligence Operative",
                [Attribute.Daring, Attribute.Presence, Attribute.Insight],
                Skill.Security,
                ["Infiltration", "Intelligence Analysis", "Building Underground Networks", "Undercover Ops", "Signals Intelligence",
                "Interrogation", "Data Analysis", "Underworld Environments", "Extra-Legal Operations", "Spycraft"],
                ["Hand-to-Hand Combat", "Hand Phasers", "Terrorist Networks", "Covert Ops", "Electronic Surveillance", "Computer System Penetration",
                "Hacker Culture", "Asset Development Techniques", "Underworld Contacts", "Ex-filtration", "Security Systems",
                "Political Analysis", "Coercion", "Charm and Affability", "Foreign Intelligence Agencies", "Survival", "Sniper Training"],
                ["We have to prioritize the greater good",
                "We're not breaking the law. Bending it a lot, sure, but not breaking it.",
                "This job requires a certain... moral flexibility",
                "Sometimes the job requires that you go to the person who tried to kill you and say, \"Let's work together.\"",
                "Sorry. The winds have shifted, my friend. And you're no longer in fashion.",
                "We leave no one behind",
                "My contact risked everything to get us this data. I can't abandon them.",
                "If you're blown, you walk away. Doesn't matter if the job isn't done.",
                "What do you do when an operation goes bad? Not much to do, but smile and try to stay alive.",
                "Spies go to bars for the same reason people go to libraries: full of information if you know where to ask.",
                "We all have things we have to leave behind.",
                "Leaving someone behind should never be an option.",
                "For a covert operative, there's often a fine line between hunter and hunted. Letting someone hunt you is just another way of finding out more about them.",
                "The ironic thing about infiltrating a group of criminals is that the only way to successfully be accepted is to actually be helpful.",
                "There's nothing quite like the feeling that you get in the pit of your stomach when you begin to suspect your intelligence on an operation may have been wrong.",
                "Officially, I was never here.",
                "I'll spare you the 'ends justify the means' speech and you spare me the 'we must do what's right' speech. You and I are not going to see eye to eye on this subject, so I suggest we stop discussing it."],
                0.6),
            new SpecializationModel(Specialization.Jag, NpcCharacterType.Starfleet, "Judge Advocate General's Office",
                [Attribute.Presence, Attribute.Control, Attribute.Insight],
                Skill.Command,
                ["Starfleet Protocols", "Federation Laws", "Legal Procedures", "Starfleet Rules and Regulations", "Legal Arguments", "Case Law",
                "Witness Preparation", "Assessing Evidence", "Standards of Evidence", "Courtmartial Defenses", "Defense Preparation",
                "Prosecution", "Commercial Law", "Tribunals", "Truth and Reconciliation Processes", "Restorative Justice",
                "Legal Differences of Federation Worlds"],
                ["Guaging Reactions", "Jury Selection", "Performance", "Famous Cases", "History of Federation Law", "Legal Jurisdictions",
                "Sneaky Legal Maneuvers", "The Writings of Sam Cogley", "Evaluating Testimony", "Argument Weakness Detection", "Forensics",
                "Investigative Methods", "The Prime Directive in Depth", "Klingon Law", "Cardassian Law", "Romulan Law", "Sheliak Law",
                "Expert Testimony Preparation", "Rulings of the Tribunal of Alpha III"],
                ["Everyone deserves a fair defense",
                "Sometimes some very good people do some very bad things.",
                "If you wear the uniform, you agree to abide by the highest standards.",
                "An officer's first duty is to the truth",
                "Better to let 100 guilty people walk free than to convict 1 innocent person.",
                "Justice is more important than the letter of the law.",
                "A courtroom is a crucible; in it we burn away irrelevancies until we are left with a pure product: the truth, for all time.",
                "With the first link, the chain is forged. The first speech censored... the first thought forbidden... the first freedom denied — chains us all irrevocably.'",
                "We think we've come so far. Torture of heretics, burning of witches, it's all ancient history. And then, before you can blink an eye, suddenly, it threatens to start all over again."],
                0.5),
            new SpecializationModel(Specialization.MedicalDoctor, NpcCharacterType.Starfleet, "Medical Doctor",
                [Attribute.Presence, Attribute.Insight, Attribute.Control],
                Skill.Medicine,
                ["Surgery", "Immunology", "Pharmacology", "Orthopedics", "Reconstructive Surgery", "Medical Equipment Specialist",
                "First Aid", "Diagnosis", "Medical Safety Protocols", "Medical Tricorders and Sensors",
                "Infectious Diseases", "Xenobiology", "Esoteric Medicine", "Neurology", "Anesthesiology",
                "Obstetrics and Gynaecology"],
                ["Triage and Prioritization", "Treatment Plans", "Infectious Disease Control", "Parasites", "Personal Safety Equipment", "Physiology",
                "Medical Risk Management", "The Nervous System", "Cardiothoracics", "Pediatrics", "Trauma Medicine", "Prosthetics",
                "Quarantine Procedures", "Silicon-based Life Forms", "Yonadan Medical Database", "Medical Experimentation",
                "Medical Research", "Outbreak Protocols", "History of Medicine", "Pathology", "Autopsy", "Medical Administration",
                "Cryogenics", "Cosmetic Disguise", "Medical Biofilters", "Genetics", "Cloning", "Genetic Augmentation",
                "Degenerative Diseases", "Veterinarian Medicine", "Medical Ethics", "Denobulan Consent Model"],
                ["Consent of the patient is the bedrock of medicine",
                "I can't let another member of this crew die!",
                "Sit down and let me finish this examination",
                "When conventional treatments aren't working, it's time to try the unconventional.",
                "Because I'm a doctor, and I said so!",
                "Haunted by a past medical mistake",
                "Medicines cure diseases but only doctors can cure patients.",
                "Drugs are not always necessary. Belief in recovery always is.",
                "Wherever the art of Medicine is loved, there is also a love of Humanity.",
                "Observation, Reason, Understanding, Courage; these make the physician.",
                "Damn. Where are the calluses we doctors are supposed to grow over our feelings?",
                "You put your research ahead of your patients' lives. And as far as I'm concerned, that's a violation of our most sacred trust.",
                "I'm just an old country doctor."],
                1),
            new SpecializationModel(Specialization.Nurse, NpcCharacterType.Starfleet, "Nurse",
                [Attribute.Presence, Attribute.Insight, Attribute.Control],
                Skill.Medicine,
                ["Post-operative Treatment", "Surgical Nursing", "Patient Aftercare",
                "Triage and Prioritization", "First Aid", "Medication Administration", "Medical Safety Protocols", "Medical Tricorders and Sensors",
                "Medical Rehab", "Emergency Nursing"],
                ["Wound Management", "Infectious Disease Control", "Vitals and Measurement", "Personal Safety Equipment",
                "Medical Risk Management", "Tests and Charts", "Performing Medical Tests", "Burn Treatment", "Skin Regrafters",
                "Specialized Medical Equipment", "Cortical Stimulators", "Sanitation Filters", "Quarantine Protocols", "Pediatrics",
                "Palliative Care"],
                ["Yes, it hurts. That's how you know you're still alive.",
                "Don't make me call the doctor on you.",
                "You'll take this medication, and you'll like it.",
                "It doesn't matter who the patient is; everyone deserves the best possible treatment.",
                "Sometimes nurses are the last defence against medical errors.",
                "It's time you got up on your feet, or you'll never recover properly!",
                "The Doctor isn't going to hold your hand; that's us. Nurses.",
                "Save one life, you're a hero. Save 100 lives, you're a nurse.",
                "Constant attention by a good nurse may be just as important as a major operation by a surgeon.",
                "Caring is the essence of nursing.",
                "Nurses dispense comfort, compassion, and caring without even a prescription.",
                "You treat a disease: you win, you lose. You treat a person, I guarantee you win — no matter the outcome.",
                "Sometimes I inspire my patients; more often, they inspire me.",
                "Be kind, for everyone you meet is fighting a battle.",
                "We are here on earth to do good to others. What the others are here for, I do not know.",
                "As a nurse we have the opportunity to heal the mind, soul, heart, and body of our patients. They may forget your name, but they will never forget how you made them feel.",
                "Have a heart that never hardens, a temper that never tires, a touch that never hurts.",
                "I'm a nurse. What's your superpower?",
                "Remember, I'm a nurse. You're going to have to say a lot to gross me out."],
                0.15),
            new SpecializationModel(Specialization.ScienceTech, NpcCharacterType.Starfleet, "Science Technician",
                [Attribute.Reason, Attribute.Insight, Attribute.Control],
                Skill.Science,
                ["Astrophysics", "Sensors", "Biology", "History", "Sociology", "Library Science", "Xenobiology", "Chemistry", "Terraforming",
                "Archaeology", "Anthropology", "Geology", "Particle Physics", "Botony", "Fauna", "Hydrology", "Entomology", "Warp Theory"],
                ["Lab Set-up", "Experiemental Method", "Research Techniques", "Equipment Diagnostics", "Equipment Resupply",
                "Isolation Fields", "Emergency Procedures", "Measurement and Recording", "Scheduling", "Cleaning and Sanitization"],
                ["I just got this lab set up.",
                "Technicians! 90% of the work, and none of the glory!",
                "Precision is key.",
                "The impossible just takes longer",
                "Ethics and safety are non-negotiable",
                "Data is king",
                "Experimentation is the foundation of progress.",
                "80% of my job is herding the scientists and keeping them on track.",
                "Sometimes scientific breakthrough is about doing the repetitive stuff over and over again."]),
            new SpecializationModel(Specialization.Scientist, NpcCharacterType.Starfleet, "Scientist",
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
            new SpecializationModel(Specialization.Security, NpcCharacterType.Starfleet, "Security",
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
            new SpecializationModel(Specialization.Admin, NpcCharacterType.Starfleet, "Yeoman",
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
            new SpecializationModel(Specialization.KlingonWarrior, NpcCharacterType.KlingonDefenseForces, "Klingon Warrior",
                [Attribute.Fitness, Attribute.Daring, Attribute.Presence],
                Skill.Security,
                ["Hand-to-Hand Combat", "Melee Weapons", "Disruptors", "Ground Combat Tactics", "Starship Weapons"],
                ["Rousing speech-making", "Explosives", "Survival", "Armor and Protective Gear", "Tales of Glorious Battle!",
                "Tactical Analysis", "Special Operations Training"],
                [
                    "It will be glorious!",
                    "Glorious battle!",
                    "Today is a good day to die",
                    "Qapla' (Success)",
                    "Hab SoSlI' Quch! (Your mother has a smooth forehead)",
                    "nuqDaq 'oH tach'e' (Where's the bar?)",
                    "wo’ batlhvaD (For the honour of the Empire!)",
                    "The Empire used to choke the quadrant with fear, power, but now?! We've lost our way.",
                    "Peace was never an option!"
                ], 0.6),
            new SpecializationModel(Specialization.KlingonShipCaptain, NpcCharacterType.KlingonDefenseForces, "Klingon Ship Captain",
                [Attribute.Reason, Attribute.Control, Attribute.Presence],
                Skill.Command,
                ["Starship Battle Tactics", "Rousing speech-making", "Ship Recognition", "Crew Duties", "Evasive Maneuvers", "Intimidating Speeches"],
                ["Hand-to-Hand Combat", "Melee Weapons", "Disruptors", "Tales of Glorious Battle!", "Weaknesses of Starfleet"],
                [
                    "It will be glorious!",
                    "Glorious battle!",
                    "Today is a good day to die",
                    "Qapla' (Success)",
                    "Hab SoSlI' Quch! (Your mother has a smooth forehead)",
                    "wo’ batlhvaD (For the honour of the Empire!)",
                    "The Empire used to choke the quadrant with fear, power, but now?! We've lost our way.",
                    "Peace was never an option!"
                ], 1.0),
            new SpecializationModel(Specialization.KlingonWeaponsOfficer, NpcCharacterType.KlingonDefenseForces, "Klingon Weapons Officer",
                [Attribute.Control, Attribute.Daring, Attribute.Presence],
                Skill.Security,
                ["Starship Weapons", "Tactical Analysis", "Starship Shields", "Starship Combat Tactics"],
                ["Torpedo Spread Patterns", "Defensive Tactics", "Emergency Weapon Repair", "Security Scans", "Situational Analysis"],
                [
                    "Qapla' (Success)",
                    "Peace was never an option!",
                    "Press on! We have the tactical advantage!",
                    "Shooting space garbage is no test of a warrior's mettle. I need a target that fights back.",
                    "A clear suicide mission with no advantage offers no glory",
                    "It was a lucky shot!",
                    "Mines are not an honourable weapon",
                    "Bravery and a tactical plan works better than bravery alone",
                    "jagh yIbuStaH (Concentrate on the Enemy)"
                ], 0.5),
            new SpecializationModel(Specialization.KlingonMedic, NpcCharacterType.KlingonDefenseForces, "Klingon Medic",
                [Attribute.Control, Attribute.Insight, Attribute.Reason],
                Skill.Medicine,
                [
                    "Surgery", "Immunology", "Pharmacology", "Orthopedics", "Reconstructive Surgery", "Medical Equipment Specialist",
                    "First Aid", "Diagnosis", "Medical Safety Protocols", "Medical Tricorders and Sensors",
                    "Infectious Diseases", "Xenobiology", "Esoteric Medicine", "Neurology"
                ],
                [
                    "Triage and Prioritization", "Treatment Plans", "Infectious Disease Control", "Parasites",
                    "Personal Safety Equipment", "Physiology", "Medical Risk Management", "The Nervous System",
                    "Cardiothoracics", "Pediatrics", "Trauma Medicine", "Prosthetics", "Quarantine Procedures",
                    "Medical Experimentation", "Medical Research", "Outbreak Protocols", "History of Medicine",
                    "Pathology", "Autopsy", "Cryogenics", "Medical Biofilters", "Genetics", "Cloning",
                    "Genetic Augmentation", "Degenerative Diseases", "Veterinarian Medicine"
                ],
                [
                    "Good news! It will leave a glorious scar!",
                    "Embrace the pain! It means you're not dead yet!",
                    "Stop whimpering like a wounded animal!",
                    "Healthy body, healthy heart, honourable living",
                    "There's no glory in dying in a hospital bed",
                    "When conventional treatments aren't working, it's time to try the unconventional.",
                    "If I need to drug you to get you to sit still, I will",
                    "I cannot help you further. But Kahless awaits you Sto-vo-kor, my friend.",
                    "Take your medicine as ordered or wake up on the barge to Gre'thor.",
                    "I've seen too many young warriors die before their time"
                ], 0.95),
            new SpecializationModel(Specialization.FerengiMerchant, NpcCharacterType.Ferengi, "Ferengi Merchant",
                [Attribute.Control, Attribute.Insight, Attribute.Presence],
                Skill.Command,
                [
                    "Business", "Appraisal", "Negotiation", "Bargaining", "Finance", "Opportunistic Insight"
                ],
                [
                    "Warehousing", "Schmoozing", "Listening", "Information Gathering", "Gambling Businesses"
                ],
                [
                    "The lobes don't lie.",
                    "Trust the lobes",
                    "I can smell profit",
                    "Believe in the Great Material Continuum",
                    "You drive a hard bargain... but I'll raise my price by two percent.",
                    "The Rules of Acquisition aren't a casual playbook.",
                    "My greed has to be a shining light to everyone, a testament to the rewards of avarice.",
                    "It's never too early to suck up to the boss!",
                    "That's the problem with your species: you don't know how to negotiate!",
                    "In a year, I'll have my own moon"
                ], 0.0),
            new SpecializationModel(Specialization.FerengiDaiMon, NpcCharacterType.Ferengi, "Ferengi DaiMon",
                [Attribute.Control, Attribute.Daring, Attribute.Presence],
                Skill.Command,
                [
                    "Trade Agreements", "Negotiation", "Bargaining", "Opportunistic Insight", "Intergalactic Trade Law",
                    "Starship Tactics", "Aggressive Stances"
                ],
                [
                    "Starship Combat Tactics", "Defensive Strategies", "Astrogation", "Capitalistic Diplomacy",
                    "Prospecting"
                ],
                [
                    "We are prepared to leave this world to you, for the standard finder's fee.",
                    "Ferengi interests must be protected",
                    "We are willing to destroy your ship at a net loss, because the example of our strength is profitable.",
                    "To seek out new markets, and new opportunities. To boldly go where no merchant has gone before!",
                    "The Ferengi Trade By-Laws do not recognize your jurisdiction, here.",
                    "There is no profit for you to interfere with our mission",
                    "Ferengi values don't just sound good: they actually work. That's the secret of our success",
                    "Taxes go against the very foundation of free enterprise! That's why it's called 'free'!",
                    "I won't preside over the demise of Ferengi civilization! The line has to be drawn here! This far, and no further!",
                    "There's nothing beyond greed! Greed is the purest and most noble of emotions!"
                ], 1.0),
            new SpecializationModel(Specialization.RomulanCenturion, NpcCharacterType.RomulanMilitary, "Romulan Centurion",
                [Attribute.Control, Attribute.Reason, Attribute.Fitness],
                Skill.Security,
                [
                    "Using the Fog of War", "Disruptors", "Starship Weapons", "Advanced Ground Tactics",
                    "Aggressive Stances"
                ],
                [
                    "Cloaking Device", "Defensive Strategies", "Shield Modulation",
                    "Conspiracy", "Political Jockeying", "Military Chest-Puffing"
                ],
                [
                    "You and I are of a kind. In a different reality, I could have called you friend.",
                    "He's a sorcerer, that one! He reads the thoughts in my brain!",
                    "We are creatures of duty. I have lived my life by it.",
                    "Danger and I are old companions.",
                    "There's great hostility behind this smile.",
                    "You have one chance to escape destruction.",
                    "You can be sarcastic now, but in a few millennia, when your species is extinct and the Romulan Empire spans the galaxy..."
                ], 0.5),
            new SpecializationModel(Specialization.RomulanTalShiar, NpcCharacterType.RomulanMilitary, "Tal Shiar Operative",
                [Attribute.Daring, Attribute.Presence, Attribute.Insight],
                Skill.Security,
                [
                    "Infiltration", "Intelligence Analysis", "Building Underground Networks", "Undercover Ops", "Signals Intelligence",
                    "Interrogation", "Data Analysis", "Underworld Environments", "Extra-Legal Operations", "Spycraft", "Torture", "Disinformation Campaigns"
                ],[
                    "Hand-to-Hand Combat", "Hand Phasers", "Terrorist Networks", "Covert Ops", "Electronic Surveillance", "Computer System Penetration",
                    "Hacker Culture", "Asset Development Techniques", "Underworld Contacts", "Ex-filtration", "Security Systems",
                    "Political Analysis", "Coercion", "Charm and Affability", "Foreign Intelligence Agencies", "Survival", "Sniper Training",
                    "Weaknesses of the Federation", "Conspiracies and Plots"
                ], [
                    "We have to prioritize the good of the Empire",
                    "Shadows Illuminate Truth",
                    "Whispers Carry Authority",
                    "Fear is a Weapon",
                    "Knowledge is Power, Silence is Control",
                    "Trust No One, Question Everything",
                    "Deception Breeds Loyalty",
                    "Subtlety Prevails Over Force",
                    "The End Justifies the Subterfuge",
                    "Silent Minds, Vocal Actions",
                    "Pawns in the Game of Secrets",
                    "Silence! I've been stabbing commanders in the back since before your mother killed her first traitor."
                ],
                0.7),
            new SpecializationModel(Specialization.CardassianSoldier, NpcCharacterType.Cardassian, "Cardassian Soldier",
                [Attribute.Control, Attribute.Reason, Attribute.Fitness],
                Skill.Security,
                [
                    "Hand Phasers", "Starship Weapons", "Advanced Ground Tactics",
                    "Aggressive Stances"
                ],
                [
                    "Orbital Bombardment", "Defensive Strategies", "Shield Modulation",
                    "Conspiracy", "Political Jockeying", "Military Chest-Puffing"
                ],
                [
                ], 0.5),
            new SpecializationModel(Specialization.CardassianGul, NpcCharacterType.Cardassian, "Cardassian Gul",
                [Attribute.Control, Attribute.Reason, Attribute.Presence],
                Skill.Command,
                [
                    "Starship Battle Tactics", "Persuasion", "Advanced Ground Tactics",
                    "Border Agreements", "Leadership", "Diplomacy", "Rules of Engagement"
                ],
                [
                    "Weaknesses of Starfleet", "Famous Cardassian Battles", "The Occupation of Bajor",
                    "Political Jockeying", "Military Chest-Puffing", "Starship Protocols"
                ],
                [
                    "One man's villain is another man's hero, Captain.",
                    "Cardassia will be made whole. All that we have lost will be ours again. And anyone who stands in our way will be destroyed.",
                    "They thought I was their enemy. They don't know what it is to be my enemy, but they will.",
                    "Everything I have lost I will regain. It's only a matter of time.",
                    "There was a time when the mere mention of my race inspired fear. And now… we're a beaten people. Afraid to fight back because we're afraid to lose what little is left.",
                    "In this room you do not ask questions. I ask them, you answer. If I am not satisfied with your answers, you will die.",
                    "This Bajoran obsession with alleged Cardassian improprieties during the occupation is really quite distasteful.",
                    "What you call genocide, I call a day's work."
                ], 0.5),

            new SpecializationModel(Specialization.OrionPirate, NpcCharacterType.RogueRuffianMercenary, "Orion Pirate",
                [Attribute.Daring, Attribute.Presence, Attribute.Control],
                Skill.Security,
                [
                    "Starship Breach Tactics", "Tractor Beams", "Starship Disarming Techniques",
                    "Valuation", "Ambushes and Traps", "Starship Detection Prevention"
                ],
                [
                    "Generating Fear", "Slavery", "Hostage-Taking", "Negotiation", "Starship Cannibalization"
                ],
                [
                    "Shh, I'm pirating. Let's go!",
                    "I will destroy my enemies",
                    "Opportunity Knows No Borders",
                    "Adaptability is the Key to Survival",
                    "Profit is the Great Equalizer",
                    "Negotiation is an Art Form",
                    "Connections Forge Destiny",
                    "Independence is a Birthright",
                    "Cunning Trumps Strength",
                    "Cultural Richness in Diversity",
                    "Freedom in Enterprise",
                    "Resilience in the Face of Scrutiny"
                ], 0.5, [Species.Orion]),
        ]
    }

    getSpecializations(type: NpcCharacterType) {
        return this.specializations.filter(s => s.type === type);
    }

    getSpecialization(specialization: Specialization) {
        let specializations = this.specializations.filter(s => s.id === specialization);
        return specializations?.length === 1 ? specializations[0] : null;
    }

}