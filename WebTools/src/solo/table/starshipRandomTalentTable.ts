import { D20 } from "../../common/die";
import { TableRoll } from "../../common/tableRoll";


export const StarshipRandomTalentTable: TableRoll<string> = () => {

    const roll = D20.roll();

    switch (roll) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            return StarshipRandomCommonTalentTable();
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
            return StarshipRandomUncommonTalentTable();
        default:
            return StarshipRandomRareTalentTable();
    }
}


const StarshipRandomCommonTalentTable: TableRoll<string> = () => {
    const roll = D20.roll();

    switch (roll) {
        case 1:
            return "Advanced Research Facilities";
        case 2:
            return "Advanced Sensor Suites";
        case 3:
            return "Advanced Shields";
        case 4:
            return "Advanced Transporters";
        case 5:
            return "Backup EPS Conduits";
        case 6:
            return "Diplomatic Suites";
        case 7:
            return "Fast Targeting Systems";
        case 8:
            return "High-Resolution Sensors";
        case 9:
            return "High-Power Tractor Beam";
        case 10:
            return "Improved Damage Control";
        case 11:
            return "Improved Hull Integrity";
        case 12:
            return "Improved Impulse Drive";
        case 13:
            return "Improved Power Systems";
        case 14:
            return "Improved Reaction Control System";
        case 15:
            return "Improved Shield Recharge";
        case 16:
            return "Improved Warp Drive";
        case 17:
            return "Modular Laboratories";
        case 18:
            return "Rugged Design";
        case 19:
            return "Secondary Reactors";
        case 20:
        default:
            return "Slim Sensor Silhouette";

    }
}

const StarshipRandomUncommonTalentTable: TableRoll<string> = () => {
    const roll = D20.roll();

    switch (roll) {
        case 1:
            return "Ablative Armor";
        case 2:
            return "Adaptable Energy Weapons";
        case 3:
        case 4:
            return "Advanced Medical Ward/Sickbay";
        case 5:
        case 6:
            return "Automated Defenses";
        case 7:
            return "Captain's Yacht";
        case 8:
        case 9:
            return "Command Ship";
        case 10:
            return "Dedicated Subspace Transceiver Array";
        case 11:
        case 12:
            return "Deluxe Galley";
        case 13:
            return "Dual Environment";
        case 14:
            return "Electronic Warfare Systems";
        case 15:
            return "Emergency Medical Hologram";
        case 16:
            return "Extensive Shuttlebays";
        case 17:
            return "Independent Phaser Supply";
        case 18:
            return "Rapid-Fire Torpedo Launcher";
        case 19:
            return "Variable Geometry Warp Field";
        case 20:
        default:
            return "Versatile Tractor Beam";

    }
}

const StarshipRandomRareTalentTable: TableRoll<string> = () => {
    const roll = D20.roll();

    switch (roll) {
        case 1:
        case 2:
            return "Ablative Field Projector";
        case 3:
        case 4:
            return "Advanced Emergency Crew Holograms";
        case 5:
            return "Cloaked Mines";
        case 6:
            return "Cloaking Device";
        case 7:
            return "Multi-Vector Assault Mode";
        case 8:
        case 9:
            return "Point Defense System";
        case 10:
        case 11:
        case 12:
            return "Quantum Torpedoes";
        case 13:
        case 14:
            return "Regenerative Hull";
        case 15:
        case 16:
            return "Saucer Separation";
        case 17:
            return "Self-Replicating Mines";
        case 18:
            return "Siphoning Shields";
        case 19:
            return "Tachyon Detection Field";
        case 20:
        default:
            return "Wormhole Relay System";

    }
}