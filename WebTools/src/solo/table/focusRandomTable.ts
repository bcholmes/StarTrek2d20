import { D20 } from "../../common/die"
import { Skill } from "../../helpers/skills";

const FocusCommandRandomTable = () => {
    const tableRoll = D20.roll();
    let roll = D20.roll();

    if (tableRoll <= 10) {
        switch (roll) {
            case 1:
                return "Art";
            case 2:
                return "Bargain";
            case 3:
                return "Call to Action";
            case 4:
                return "Cold Reading";
            case 5:
                return "Composure";
            case 6:
                return "Coordinated Efforts";
            case 7:
                return "Courting Rituals";
            case 8:
                return "Cultural Expert";
            case 9:
                return "Debate";
            case 10:
                return "Deception";
            case 11:
                return "Decisive Leadership";
            case 12:
                return "Diplomacy";
            case 13:
                return "Emotional Intelligence";
            case 14:
                return "Etiquette";
            case 15:
                return "Fleet Commander";
            case 16:
                return "Gambling";
            case 17:
                return "History";
            case 18:
                return "Inspiration";
            case 19:
                return "Intimidation";
            case 20:
            default:
                return "Journalism";
        }
    } else {
        switch (roll) {
            case 1:
                return "Law";
            case 2:
                return "Lead by Example";
            case 3:
                return "Linguistics";
            case 4:
                return "Mental Discipline";
            case 5:
                return "Multi-Discipline";
            case 6:
                return "Negotiation";
            case 7:
                return "Oratory";
            case 8:
                return "Performer";
            case 9:
                return "Persuasion";
            case 10:
                return "Philosophy";
            case 11:
                return "Politics";
            case 12:
                return "Prime Directive";
            case 13:
                return "Reporting Procedures";
            case 14:
                return "Rhetoric";
            case 15:
                return "Starfleet Protocol";
            case 16:
                return "Station Operations";
            case 17:
                return "Strategy/Tactics";
            case 18:
                return "Teaching";
            case 19:
                return "Team Dynamics";
            case 20:
            default:
                return "Time Management";
        }
    }
}

const FocusConnRandomTable = () => {
    const tableRoll = D20.roll();
    let roll = D20.roll();

    if (tableRoll <= 10) {
        switch (roll) {
            case 1:
                return "Astronavigation";
            case 2:
                return "Astronomy";
            case 3:
                return "Astrophysics";
            case 4:
                return "Atmospheric Flight";
            case 5:
                return "Attack Run";
            case 6:
                return "Boat Pilot / Submersibles";
            case 7:
                return "Climbing";
            case 8:
                return "Combat Maneuvers";
            case 9:
                return "Communications Systems";
            case 10:
                return "Covering Advance";
            case 11:
                return "Efficient Evasion";
            case 12:
                return "Evacuation Procedures";
            case 13:
                return "Evasive Action";
            case 14:
                return "Extra-Vehicular Activity";
            case 15:
                return "Flight Controller";
            case 16:
                return "Glancing Impact";
            case 17:
                return "Ground Vehicles";
            case 18:
                return "Guidance Systems";
            case 19:
                return "Helm Operation";
            case 20:
            default:
                return "Impulse Engines";
        }
    } else {
        switch (roll) {
            case 1:
                return "Multi-Tasking";
            case 2:
                return "Pathfinder";
            case 3:
                return "Power Management";
            case 4:
                return "Precision Maneuvering";
            case 5:
                return "Repairs and Maintenance";
            case 6:
                return "Ship Design and Construction";
            case 7:
                return "Shuttlebay Management";
            case 8:
                return "Small Craft";
            case 9:
                return "Space Station Operations";
            case 10:
                return "Spacewalk";
            case 11:
                return "Starfleet Protocols";
            case 12:
                return "Starship Expert (pick one)";
            case 13:
                return "Starship Recognition";
            case 14:
                return "Stellar Cartography";
            case 15:
                return "Strafing Run";
            case 16:
                return "Subspace Theory";
            case 17:
                return "Survival";
            case 18:
                return "Tracking";
            case 19:
                return "Warp Drive";
            case 20:
            default:
                return "Zero-G Combat";
        }
    }
}

const FocusSecurityRandomTable = () => {
    const tableRoll = D20.roll();
    let roll = D20.roll();

    if (tableRoll <= 10) {
        switch (roll) {
            case 1:
                return "Ambush Tactics";
            case 2:
                return "Blade Weapons";
            case 3:
                return "Camouflage";
            case 4:
                return "Chemical and Biological Weapons";
            case 5:
                return "Combat Medic";
            case 6:
                return "Computer Security Systems";
            case 7:
                return "Criminal Minds";
            case 8:
                return "Criminal Organizations";
            case 9:
                return "Crisis Management";
            case 10:
                return "Deadeye Marksman";
            case 11:
                return "Deflector Operations";
            case 12:
                return "Demolitions";
            case 13:
                return "Espionage";
            case 14:
                return "Evacuation Procedures";
            case 15:
                return "Fleet Formations";
            case 16:
                return "Forensics";
            case 17:
                return "Forgery";
            case 18:
                return "Hand Phasers";
            case 19:
                return "Hazardous Environments";
            case 20:
            default:
                return "Heavy Cover";
        }
    } else {
        switch (roll) {
            case 1:
                return "Interrogation";
            case 2:
                return "Intimidation";
            case 3:
                return "Klingon Weapons";
            case 4:
                return "Law Enforcements";
            case 5:
                return "Lead Investigator";
            case 6:
                return "Martial Arts";
            case 7:
                return "Mental Resistance Techniques";
            case 8:
                return "Organizational Psychology";
            case 9:
                return "Patrol";
            case 10:
                return "Phasers";
            case 11:
                return "Pickpocketing";
            case 12:
                return "Planetary Surveys";
            case 13:
                return "Precision Targeting";
            case 14:
                return "Security Systems";
            case 15:
                return "Ship Engagement Tactics";
            case 16:
                return "Ship Lockdown Procedures";
            case 17:
                return "Small Unit Tactics";
            case 18:
                return "Strategy";
            case 19:
                return "Targeting Systems";
            case 20:
            default:
                return "Torpedoes";
        }
    }
}

const FocusEngineeringRandomTable = () => {
    const tableRoll = D20.roll();
    let roll = D20.roll();

    if (tableRoll <= 10) {
        switch (roll) {
            case 1:
                return "Advanced Holograms";
            case 2:
                return "Artificial Intelligence Systems";
            case 3:
                return "Cybernetics";
            case 4:
                return "Deflector Systems";
            case 5:
                return "Diagnostics";
            case 6:
                return "Electro-Plasma Systems";
            case 7:
                return "Emergency Repairs";
            case 8:
                return "Energy Weapons";
            case 9:
                return "EVA Suits";
            case 10:
                return "Experimental Device (specify type)";
            case 11:
                return "Exploit Engineering Flaw";
            case 12:
                return "Flight Control Systems";
            case 13:
                return "Force Fields";
            case 14:
                return "Holodeck Programming";
            case 15:
                return "Imaging Equipment";
            case 16:
                return "Impulse Fundamentals";
            case 17:
                return "Jury-Rigging";
            case 18:
                return "Locksmith";
            case 19:
                return "Maintenance Specialist";
            case 20:
            default:
                return "Manufacturing";
        }
    } else {
        switch (roll) {
            case 1:
                return "Meticulous";
            case 2:
                return "Mining Operations";
            case 3:
                return "Modelling & Design";
            case 4:
                return "Percussive Maintenance";
            case 5:
                return "Procedural Compliance";
            case 6:
                return "Propulsion";
            case 7:
                return "Repair Team Leader";
            case 8:
                return "Reverse Engineering";
            case 9:
                return "Saboteur";
            case 10:
                return "Salvage";
            case 11:
                return "Sensor Calibration";
            case 12:
                return "Shuttlecraft Maintenance";
            case 13:
                return "Space Stations";
            case 14:
                return "Structural Engineering";
            case 15:
                return "Subspace Mechanics";
            case 16:
                return "System Maintenance";
            case 17:
                return "Transporters/Replicators";
            case 18:
                return "Toubleshooting";
            case 19:
                return "Warp Core Mechanics";
            case 20:
            default:
                return "Weapons Engineering";
        }
    }
}

const FocusScienceRandomTable = () => {
    const tableRoll = D20.roll();
    let roll = D20.roll();

    if (tableRoll <= 10) {
        switch (roll) {
            case 1:
                return "Animal Behavior";
            case 2:
                return "Antropology";
            case 3:
                return "Archaeology";
            case 4:
                return "Astrometrics";
            case 5:
                return "Biochemistry";
            case 6:
                return "Biology/Xenobiology";
            case 7:
                return "Botany/Xenobotany";
            case 8:
                return "Catastrophism";
            case 9:
                return "Chemistry";
            case 10:
                return "Computer Science";
            case 11:
                return "Deflector Operations";
            case 12:
                return "Ecology";
            case 13:
                return "Expedition Expert";
            case 14:
                return "Galactic History";
            case 15:
                return "Geology";
            case 16:
                return "Laboratory Maintenance";
            case 17:
                return "Marine Biology";
            case 18:
                return "Matter/Antimatter";
            case 19:
                return "Meteorology";
            case 20:
            default:
                return "Microbiology";
        }
    } else {
        switch (roll) {
            case 1:
                return "Nanotechnology";
            case 2:
                return "Photonic Applications";
            case 3:
                return "Physics";
            case 4:
                return "Prototyping";
            case 5:
                return "Quantum Consciousness";
            case 6:
                return "Quantum Mechanics";
            case 7:
                return "Rapid Analysis";
            case 8:
                return "Research";
            case 9:
                return "Sensor Operations";
            case 10:
                return "Sociology";
            case 11:
                return "Specific Historical Time Period";
            case 12:
                return "Starfleet Programming";
            case 13:
                return "Subspace Theory";
            case 14:
                return "Temporal Mechanics";
            case 15:
                return "Terraforming";
            case 16:
                return "Unconventional Thinking";
            case 17:
                return "Unified Field Theory";
            case 18:
                return "Unorthodox Mathematics";
            case 19:
                return "Walking Encyclopedia";
            case 20:
            default:
                return "Warp Theory";
        }
    }
}


const FocusMedicineRandomTable = () => {
    const tableRoll = D20.roll();
    let roll = D20.roll();

    if (tableRoll <= 10) {
        switch (roll) {
            case 1:
                return "Alternative Medicine";
            case 2:
                return "Anesthesia/Pain Management";
            case 3:
                return "Bedside Manner";
            case 4:
                return "Biochemistry";
            case 5:
                return "Biology/Xenobiology";
            case 6:
                return "Biotechnology";
            case 7:
                return "Chemistry";
            case 8:
                return "Counseling";
            case 9:
                return "Cutting-Edge Medicine";
            case 10:
                return "Cybernetics";
            case 11:
                return "Dentistry";
            case 12:
                return "Diagnostic Expertise";
            case 13:
                return "Emergency Medicine";
            case 14:
                return "Ethics";
            case 15:
                return "Field Medic";
            case 16:
                return "First Aid";
            case 17:
                return "Genetics";
            case 18:
                return "Guided Therapy";
            case 19:
                return "Imaging Systems";
            case 20:
            default:
                return "Immunology";
        }
    } else {
        switch (roll) {
            case 1:
                return "Internal Medicine";
            case 2:
                return "Kinesiology";
            case 3:
                return "Medical Toxicology";
            case 4:
                return "Microbiology";
            case 5:
                return "Neuropsychology/Psychiatry";
            case 6:
                return "Parapsychology";
            case 7:
                return "Pathology";
            case 8:
                return "Patient Care";
            case 9:
                return "Pediatrics";
            case 10:
                return "Pharmacology";
            case 11:
                return "Positive Reinforcement";
            case 12:
                return "Psychiatry";
            case 13:
                return "Psychoanalysis";
            case 14:
                return "Psychosomatic Disorders";
            case 15:
                return "Rheumatology";
            case 16:
                return "Stress Disorders";
            case 17:
                return "Surgery";
            case 18:
                return "Triage";
            case 19:
                return "Veterinary Medicine";
            case 20:
            default:
                return "Virology";
        }
    }
}

export const FocusRandomTable = (skill?: Skill) => {
    if (skill == null) {
        skill = FocusDivisionRandomTable();
    }

    if (skill === Skill.Command) {
        return FocusCommandRandomTable();
    } else if (skill === Skill.Conn) {
        return FocusConnRandomTable();
    } else if (skill === Skill.Security) {
        return FocusSecurityRandomTable();
    } else if (skill === Skill.Engineering) {
        return FocusEngineeringRandomTable();
    } else if (skill === Skill.Science) {
        return FocusScienceRandomTable();
    } else { // Medicine
        return FocusMedicineRandomTable();
    }
}

export const FocusDivisionRandomTable = () => {
    let roll = D20.roll();

    while (true) {
        switch (roll) {
            case 1:
            case 2:
            case 3:
                return Skill.Command;
            case 4:
            case 5:
            case 6:
                return Skill.Conn;
            case 7:
            case 8:
            case 9:
                return Skill.Security;
            case 10:
            case 11:
            case 12:
                return Skill.Engineering;
            case 13:
            case 14:
            case 15:
                return Skill.Science;
            case 16:
            case 17:
            case 18:
                return Skill.Medicine;
            default:
                roll = D20.roll();
        }
    }
}