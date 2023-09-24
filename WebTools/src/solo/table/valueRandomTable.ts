import { D20 } from "../../common/die";
import { Skill } from "../../helpers/skills";
import { Source } from "../../helpers/sources";
import { Species } from "../../helpers/speciesEnum";
import { hasSource } from "../../state/contextFunctions";

export const ValueRandomTable = (species?: Species, skill?: Skill) => {

    let roll = D20.roll();
    if (roll <= 10 && hasSource(Source.ContinuingMissions)) {
        if (species === Species.Vulcan) {
            return VulcanValuesTable();
        } else if (species === Species.Klingon) {
            return KlingonValuesTable();
        } else {
            return GeneralValuesTable();
        }
    } else {
        return StandardValuesTable();
    }
}

const StandardValuesTable = () => {
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

const VulcanValuesTable = () => {
    let roll = D20.roll();
    switch (roll) {
        case 1:
            return "A logical mind is a focused mind";
        case 2:
            return "A Vulcan does not exaggerate";
        case 3:
            return "An analytical approach solves all";
        case 4:
            return "Attain Kolinahr, the pinnnacle of logic";
        case 5:
            return "Be just and sincere";
        case 6:
            return "Believe in infinite diversity in infinite combinations";
        case 7:
            return "Choose logic over emotion";
        case 8:
            return "Cultivate inner peace";
        case 9:
            return "Curiosity is the engine of growth";
        case 10:
            return "Emotion is the enemy of logic";
        case 11:
            return "Seek logic and reason above all";
        case 12:
            return "Seek the knowledge of the ages";
        case 13:
            return "Explore the depths of the mind";
        case 14:
            return "The power of logic is unstoppable";
        case 15:
            return "The pursuit of knowledge is the pursuit of truth";
        case 16:
            return "There are always possibilities";
        case 17:
            return "Keep the body in good health to keep the mind strong and clear";
        case 18:
            return "Logic and knowledge are the true wealth";
        case 19:
            return "Knowledge is the true power";
        case 20:
        default:
            return "Live long and prosper";
    }
}

const KlingonValuesTable = () => {
    let roll = D20.roll();
    switch (roll) {
        case 1:
            return "Warriors are judged by their deeds";
        case 2:
            return "Act with honour";
        case 3:
            return "All battles are fought by warriors, not weapons";
        case 4:
            return "Always be prepared for battle";
        case 5:
            return "A true warrior fights with honour";
        case 6:
            return "Battle is the most glorious adventure";
        case 7:
            return "Choose the expected path only when it leads to victory";
        case 8:
            return "The battle is not over until the last warrior falls";
        case 9:
            return "The heart of a warrior is filled with courage";
        case 10:
            return "The hunt is a sacred ritual";
        case 11:
            return "There is always a way to victory";
        case 12:
            return "To die in battle is the greatest glory";
        case 13:
            return "A good death is its own reward";
        case 14:
            return "Every blow must be struck with conviction";
        case 15:
            return "Glory to the empire!";
        case 16:
            return "Honour above life";
        case 17:
            return "Honour in all things";
        case 18:
            return "Honour is more important than life";
        case 19:
            return "Honour your ancestors";
        case 20:
        default:
            return "In battle, there is redemption";
    }
}

const GeneralValuesTable = () => {
    let roll = D20.roll() + D20.roll() + D20.roll();
    switch (roll) {
        case 3:
            return "Infinite diversity in infinite combinations";
        case 4:
            return "Service to the Federation above self";
        case 5:
            return "Non-interference is the Prime Directive";
        case 6:
            return "Risk is part of the game if you want to sit in that chair";
        case 7:
            return "Logic is the beginning of wisdom, not the end";
        case 8:
            return "Emotions are alien to me. I'm a scientist";
        case 9:
            return "Do not underestimate the power of human intuition";
        case 10:
            return "All life is precious";
        case 11:
            return "Change is the essential process of all existence";
        case 12:
            return "Knowledge for the sake of knowledge";
        case 13:
            return "Science is built on the shoulders of giants";
        case 14:
            return "In space, all warriors are cold warriors";
        case 15:
            return "Treat her like a lady, and she'll always bring you home";
        case 16:
            return "The line must be drawn here!";
        case 17:
            return "Living in fear isn't living at all";
        case 18:
            return "Seeking out new life, protecting is when found";
        case 19:
            return "The universe is full of wonderous complexity";
        case 20:
            return "Survival of the fittest";
        case 21:
            return "Boldy going where no one has gone before";
        case 22:
            return "A life without risk is no life at all";
        case 23:
            return "Nothing that exists is unnatural";
        case 24:
            return "Diplomacy, the first and last line of defense";
        case 25:
            return "Always expect the unexpected";
        case 26:
            return "Every puzzle has a solution";
        case 27:
            return "A starship is nothing without its crew";
        case 28:
            return "The past can be as unknowable as the future";
        case 29:
            return "To go forward, we must look back";
        case 30:
            return "Conflict should always be the last resort";
        case 31:
            return "Victory at all costs";
        case 32:
            return "Every culture has its unique wisdom to share";
        case 33:
            return "Strength in unity";
        case 34:
            return "Compassion is the heart of enlightenment";
        case 35:
            return "Knowledge is a weapon, use it wisely";
        case 36:
            return "There's more to life than molecules";
        case 37:
            return "The unknown is our playground";
        case 38:
            return "Humanity is a work in progress";
        case 39:
            return "Sometimes, the end justify the means";
        case 40:
            return "Evolution is nature's experiement";
        case 41:
            return "In all things, balance";
        case 42:
            return "Trust, but verify";
        case 43:
            return "Faith in the unknown";
        case 44:
            return "Curiosity is the mother of invention";
        case 45:
            return "The only failure is not trying";
        case 46:
            return "Everything is relative";
        case 47:
            return "Peace through superior firepower";
        case 48:
            return "Nothing is impossible, only improbable";
        case 49:
            return "Only Nixon can go to China";
        case 50:
            return "Every person is the architect of their own future";
        case 51:
            return "The best defence is a good offence";
        case 52:
            return "Time is a companion that reminds us to cherish every moment";
        case 53:
            return "One person can make a difference";
        case 54:
            return "With great power comes great responsibility";
        case 55:
            return "Live long and prosper";
        case 56:
            return "Love is a force more formidable than any other";
        case 57:
            return "A single mantra can fill a universe";
        case 58:
            return "One must always have faith in oneself";
        case 59:
            return "Self-knowledge is the beginnin of all wisdom";
        case 60:
        default:
            return "Imagination is more important than knowledge";
    }
}

