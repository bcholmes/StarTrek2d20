import { TalentsHelper } from "../../helpers/talents"

export const StarshipTalentMatrix = (roll: number) => {

    switch (roll) {
    case 3:
        return TalentsHelper.getTalent("Ablative Armor");
    case 4:
        return TalentsHelper.getTalent("Ablative Field Projector");
    case 5:
        return TalentsHelper.getTalent("Adaptable Energy Weapons");
    case 6:
        return TalentsHelper.getTalent("Advanced Emergency Crew Holograms");
    case 7:
        return TalentsHelper.getTalent("Advanced Sickbay");
    case 8:
    case 9:
        return TalentsHelper.getTalent("Advanced Research Facilities");
    case 10:
    case 11:
        return TalentsHelper.getTalent("Advanced Sensor Suites");
    case 12:
    case 13:
        return TalentsHelper.getTalent("Advanced Shields");
    case 14:
    case 15:
        return TalentsHelper.getTalent("Advanced Transporters");
    case 16:
        return TalentsHelper.getTalent("Automated Defenses");
    case 17:
    case 18:
        return TalentsHelper.getTalent("Backup EPS Conduits");
    case 19:
        return TalentsHelper.getTalent("Captain's Yacht");
    case 20:
        return TalentsHelper.getTalent("Cloaked Mines");
    case 21:
        return TalentsHelper.getTalent("Cloaking Device");
    case 22:
        return TalentsHelper.getTalent("Command Ship");
    case 23:
        return TalentsHelper.getTalent("Dedicated Subspace Transceiver Array");
    case 24:
    case 25:
        return TalentsHelper.getTalent("Diplomatic Suites");
    case 26:
        return TalentsHelper.getTalent("Dual Environment");
    case 27:
        return TalentsHelper.getTalent("Electronic Warfare Systems");
    case 28:
        return TalentsHelper.getTalent("Emergency Medical Hologram");
    case 29:
        return TalentsHelper.getTalent("Extensive Shuttlebays");
    case 30:
        return TalentsHelper.getTalent("Fast Targeting Systems");
    case 31:
    case 32:
        return TalentsHelper.getTalent("High-Resolution Sensors");
    case 33:
        return TalentsHelper.getTalent("High-Power Tractor Beam");
    case 34:
        return TalentsHelper.getTalent("Improved Damage Control");
    case 35:
    case 36:
        return TalentsHelper.getTalent("Improved Hull Integrity");
    case 37:
    case 38:
        return TalentsHelper.getTalent("Improved Impulse Drive");
    case 39:
    case 40:
        return TalentsHelper.getTalent("Improved Power Systems");
    case 41:
        return TalentsHelper.getTalent("Improved Reaction Control System");
    case 42:
        return TalentsHelper.getTalent("Improved Shield Recharge");
    case 43:
        return TalentsHelper.getTalent("Improved Warp Drive");
    case 44:
        return TalentsHelper.getTalent("Independent Phaser Supply");
    case 45:
        return TalentsHelper.getTalent("Modular Laboratories");
    case 46:
        return TalentsHelper.getTalent("Multi-Vector Assault Mode");
    case 47:
        return TalentsHelper.getTalent("Point Defense System");
    case 48:
        return TalentsHelper.getTalent("Quantum Torpedoes");
    case 49:
        return TalentsHelper.getTalent("Rapid-Fire Torpedo Launcher");
    case 50:
        return TalentsHelper.getTalent("Regenerative Hull");
    case 51:
        return TalentsHelper.getTalent("Rugged Design");
    case 52:
        return TalentsHelper.getTalent("Saucer Separation");
    case 53:
        return TalentsHelper.getTalent("Secondary Reactors");
    case 54:
        return TalentsHelper.getTalent("Self-Replicating Mines");
    case 55:
        return TalentsHelper.getTalent("Siphoning Shields");
    case 56:
        return TalentsHelper.getTalent("Slim Sensor Silhouette");
    case 57:
        return TalentsHelper.getTalent("Tachyon Detection Field");
    case 58:
        return TalentsHelper.getTalent("Variable Geometry Warp Field");
    case 59:
        return TalentsHelper.getTalent("Versatile Tractor Beam");
    case 60:
        return TalentsHelper.getTalent("Wormhole Relay System");
    }


}