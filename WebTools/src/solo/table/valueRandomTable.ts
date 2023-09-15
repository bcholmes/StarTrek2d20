import { D20 } from "../../common/die";

export const ValueRandomTable = () => {
    let roll = D20.roll();
    switch (roll) {
        case 1:
            return "A good mystery is irresistible";
        case 2:
            return "Act with confidence, even if you don’t feel confident";
        case 3:
            return "Crew comes first";
        case 4:
            return "Diplomacy is the first and last solution to anything";
        case 5:
            return "Exploration is the blood that fills my veins";
        case 6:
            return "Good leaders get their hands dirty";
        case 7:
            return "I can make something from nothing";
        case 8:
            return "I finish what I start";
        case 9:
            return "Information is power";
        case 10:
            return "Never leave a stone unturned";
        case 11:
            return "Push me too far and you’ll see my ugly side";
        case 12:
            return "Resistance is never futile";
        case 13:
            return "Seeking to find myself far from home";
        case 14:
            return "Sensors can't tell you everything";
        case 15:
            return "Spoiling for a fight";
        case 16:
            return "The mission comes first";
        case 17:
            return "Trust, but verify";
        case 18:
            return "We are all connected despite being worlds apart";
        case 19:
            return "Willing to sacrifice myself to save my crew";
        case 20:
        default:
            return "You must walk barefoot in the dirt to really understand a world";
    }
}