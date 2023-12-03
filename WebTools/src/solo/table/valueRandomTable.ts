import { D20 } from "../../common/die";
import { Skill } from "../../helpers/skills";
import { Source } from "../../helpers/sources";
import { Species } from "../../helpers/speciesEnum";
import { hasSource } from "../../state/contextFunctions";

export const ValueRandomTable = (species?: Species, skill?: Skill) => {

    let roll = D20.roll();
    if (roll <= 15 && hasSource(Source.ContinuingMissions)) {
        let subRoll = D20.roll();
        if (subRoll <= 10) {
            if (species != null && speciesRandomValues[species] != null
                && skill != null && disciplineRandomValues[skill] != null) {

                const table = D20.roll() <= 10 ? speciesRandomValues[species] : disciplineRandomValues[skill];
                return table();
            } else if (species != null && speciesRandomValues[species] != null) {
                const table = speciesRandomValues[species];
                return table();
            } else if (skill != null && disciplineRandomValues[skill] != null) {
                const table = disciplineRandomValues[skill];
                return table();
            } else {
                return GeneralValuesTable();
            }
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

const VulcanValuesTable = (): string => {
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

const KlingonValuesTable = (): string => {
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

const speciesRandomValues: {[species: number]: () => string } = {

    [Species.Vulcan]: VulcanValuesTable,
    [Species.Klingon]: KlingonValuesTable,

}
const ConnValuesTable = () => {
    let roll = D20.roll() + D20.roll() + D20.roll();
    switch (roll) {
        case 3:
            return "In space, speed is life";
        case 4:
            return "Always stay one step ahead";
        case 5:
            return "Feel the rhythm of the stars";
        case 6:
            return "Precision is the difference between success and failure";
        case 7:
            return "Fly it like you stole it";
        case 8:
            return "Every craft has a soul";
        case 9:
            return "Danger is the spice of life";
        case 10:
            return "Rules are more like guidelines";
        case 11:
            return "The sky is just the beginning";
        case 12:
            return "A smooth sea never made a skilled sailor";
        case 13:
            return "Navigate by instinct";
        case 14:
            return "Push the boundaries";
        case 15:
            return "Adventure is out there";
        case 16:
            return "The thrill of the chase";
        case 17:
            return "Know your ship like you know yourself";
        case 18:
            return "Born to fly";
        case 19:
            return "Full throttle or nothing";
        case 20:
            return "Gravity is just a suggestion";
        case 21:
            return "Always ride the lightning";
        case 22:
            return "Adapt and overcome";
        case 23:
            return "A pilot's heart beats in the skies";
        case 24:
            return "Nothing ventured; nothing gained";
        case 25:
            return "Stars are my roadmaps";
        case 26:
            return "I'd rather be flying";
        case 27:
            return "The horizon is my home";
        case 28:
            return "In the cockpit, I am free";
        case 29:
            return "Speed is a drug";
        case 30:
            return "A true pilot trusts their instincts";
        case 31:
            return "Navigate the impossible";
        case 32:
            return "To fly is to defy limits";
        case 33:
            return "There's always a way out";
        case 34:
            return "Live by the compass, not the clock";
        case 35:
            return "A second's hesitation can mean disaster";
        case 36:
            return "Plan for the worst. Hope for the best";
        case 37:
            return "The quicker, the better";
        case 38:
            return "Master of maneuvers";
        case 39:
            return "Never back down";
        case 40:
            return "Fast and furious";
        case 41:
            return "Failure is not an option";
        case 42:
            return "The wind knows the way";
        case 43:
            return "Every storm passes";
        case 44:
            return "Keep calm and fly on";
        case 45:
            return "Life in the fast lane";
        case 46:
            return "The universe is my playground";
        case 47:
            return "Respect the risks";
        case 48:
            return "No risk, no reward.";
        case 49:
            return "The sky is not the limit";
        case 50:
            return "Courage is the key to the clouds";
        case 51:
            return "Every course has its challenge";
        case 52:
            return "Always have a backup plan";
        case 53:
            return "Finesse over force";
        case 54:
            return "Dance among the stars";
        case 55:
            return "Trust your instruments";
        case 56:
            return "If you're not on the edge, you're taking up too much space";
        case 57:
            return "Life's a journey; enjoy the flight";
        case 58:
            return "A pilot's eye sees all";
        case 59:
            return "I control my own destiny";
        case 60:
        default:
            return "I was born for the skies";
    }
}

const EngineeringValuesTable = () => {
    let roll = D20.roll() + D20.roll() + D20.roll();
    switch (roll) {
        case 3:
            return "A place for everything and everything in its place";
        case 4:
            return "Adapt and overcome";
        case 5:
            return "Always look for a solution";
        case 6:
            return "Be prepared; expect the unexpected";
        case 7:
            return "Build a better tomorrow";
        case 8:
            return "Challenge the unknown";
        case 9:
            return "Change is the essence of life";
        case 10:
            return "Curiosity creates innovation";
        case 11:
            return "Design. Build. Improve.";
        case 12:
            return "Details make perfection";
        case 13:
            return "Diligence is the essence of life";
        case 14:
            return "Embrace the impossible";
        case 15:
            return "Every problem is a puzzle to solve";
        case 16:
            return "Failure is the first step to success";
        case 17:
            return "Functionality over aesthetics";
        case 18:
            return "Give me a wrench and I'll fix the universe";
        case 19:
            return "If it ain't broke, improve it anyway";
        case 20:
            return "If it can be imagined, it can be created";
        case 21:
            return "Imagination fuels invention";
        case 22:
            return "Innovate or stagnate";
        case 23:
            return "Invention is the child of necessity";
        case 24:
            return "It's not enough to understand: one must apply";
        case 25:
            return "Knowledge is power, but application is key";
        case 26:
            return "Learn from yesterday. Live for today. Hope for tomorrow.";
        case 27:
            return "Make it work. Make it right. Make it fast.";
        case 28:
            return "Never stop learning";
        case 29:
            return "Never stop questioning";
        case 30:
            return "No machine is perfect";
        case 31:
            return "Nothing is built to last forever";
        case 32:
            return "Perfection is a never-ending process";
        case 33:
            return "Progress demands sacrifice";
        case 34:
            return "Pursue new methods, not just new tools";
        case 35:
            return "Respect the machine; understand the machine";
        case 36:
            return "Rules are for those without innovation";
        case 37:
            return "Science is the key to progress";
        case 38:
            return "Simplicity is the ultimate sophistication";
        case 39:
            return "Solutions come from adaptability";
        case 40:
            return "The best way to predict the future is to create it";
        case 41:
            return "The impossible is just something waiting to be invented";
        case 42:
            return "The sky is not the limit";
        case 43:
            return "There is always a way";
        case 44:
            return "There's no such thing as over-engineering";
        case 45:
            return "Think outside the box";
        case 46:
            return "To improve is to change; to perfect is to change often";
        case 47:
            return "Tomorrow's technology today";
        case 48:
            return "True genius is in simplicity";
        case 49:
            return "Understanding is the first step to mastery";
        case 50:
            return "We are made of star-stuff";
        case 51:
            return "We build our own future";
        case 52:
            return "We can rebuild it: better, stronger, faster";
        case 53:
            return "We don't guess: we calculate";
        case 54:
            return "We stand on the shoulders of giants";
        case 55:
            return "Where there's a will, there's a way";
        case 56:
            return "Wisdom comes from experience";
        case 57:
            return "Work smart, not hard";
        case 58:
            return "You don't have to see it to believe it; you have to believe it to see it";
        case 59:
            return "Your only limit is your imagination";
        case 60:
        default:
            return "Did I break that?";
    }
}

const ScienceValuesTable = () => {
    let roll = D20.roll() + D20.roll() + D20.roll();
    switch (roll) {
        case 3:
            return "The universe is a cosmic laboratory";
        case 4:
            return "Never stop questioning";
        case 5:
            return "Science sees the world as it is";
        case 6:
            return "Through hardship, knowledge";
        case 7:
            return "The stars are our destiny";
        case 8:
            return "Imagination will take us everywhere";
        case 9:
            return "In science we trust";
        case 10:
            return "Never fear the unknown";
        case 11:
            return "Question everything. Even the answers";
        case 12:
            return "Truth is found in evidence";
        case 13:
            return "Infinity is found in evidence";
        case 14:
            return "Curiosity didn't kill the cat; ignorance did";
        case 15:
            return "Discovery requires experimentation";
        case 16:
            return "The cosmos is a symphony of physics";
        case 17:
            return "Wonder is the seed of knowledge";
        case 18:
            return "Embrace the beauty of mathematics";
        case 19:
            return "We are all made of star-stuff";
        case 20:
            return "The science of today is the technology of tomorrow";
        case 21:
            return "Order amidst chaos; beauty in randomness";
        case 22:
            return "In pursuit of the unknown";
        case 23:
            return "All mysteries can be solved";
        case 24:
            return "Life finds a way";
        case 25:
            return "Our destiny lies among the stars";
        case 26:
            return "Pushing the boundaries of understanding";
        case 27:
            return "The future belongs to the curious";
        case 28:
            return "The universe is under no obligation to make sense";
        case 29:
            return "Seek truth in all its forms";
        case 30:
            return "To be human is to explore";
        case 31:
            return "The universe is a puzzle to be solved";
        case 32:
            return "Understanding is the first step to mastery";
        case 33:
            return "All truths begin as hearsay";
        case 34:
            return "Theories are just patterns in the chaos";
        case 35:
            return "Question the status quo";
        case 36:
            return "Discovery is a process, not an event";
        case 37:
            return "Infinite variety in infinite combinations";
        case 38:
            return "The bigger the risk, the bigger the discovery";
        case 39:
            return "Every atom tells a story";
        case 40:
            return "The universe speaks in many languages";
        case 41:
            return "Through knowledge, enlightenment";
        case 42:
            return "Science is the poetry of reality";
        case 43:
            return "In every grain of sand, a universe";
        case 44:
            return "Reality is stranger than fiction";
        case 45:
            return "Logic is the language of the universe";
        case 46:
            return "Understanding the universe, one star at a time";
        case 47:
            return "The unseen is not the unknowable";
        case 48:
            return "Physics is the choreography of the cosmos";
        case 49:
            return "The universe writes its own laws";
        case 50:
            return "Embrace the absurdity of existence";
        case 51:
            return "Every experiment is a doorway to discovery";
        case 52:
            return "Chaos and order are two sides of the same coin";
        case 53:
            return "The truth is out there";
        case 54:
            return "Through the wormhole lies a universe of possibilities";
        case 55:
            return "The unknown is a canvas for discovery";
        case 56:
            return "Wisdom is the daughter of experience";
        case 57:
            return "Life is a cosmic phenomenon";
        case 58:
            return "Understanding begins at the edge of the known";
        case 59:
            return "Knowledge is the pathway to understanding";
        case 60:
        default:
            return "Eternity begins in a single moment";
    }
}

const MedicineValuesTable = () => {
    let roll = D20.roll() + D20.roll() + D20.roll();
    switch (roll) {
        case 3:
            return "A good physician treats the disease; a great physician treats the patient";
        case 4:
            return "Always do no harm";
        case 5:
            return "An ounce of prevention is worth a pound of cure";
        case 6:
            return "Be the healer you want to have";
        case 7:
            return "Benevolence above all";
        case 8:
            return "Break through the unknown";
        case 9:
            return "Cure sometimes. Treat often. Comfort always.";
        case 10:
            return "Disease is the real enemy";
        case 11:
            return "Embrace the art of healing";
        case 12:
            return "Every life has intrinsic value";
        case 13:
            return "Every patient is a door to new knowledge";
        case 14:
            return "Explore the mysteries of life";
        case 15:
            return "Good medicine requires patience";
        case 16:
            return "Heal the body. Heal the soul";
        case 17:
            return "Healing comes from the heart";
        case 18:
            return "I choose to save lives";
        case 19:
            return "In science we trust";
        case 20:
            return "Integrity in every diagnosis";
        case 21:
            return "It's not enough to treat the disease; we must treat the person";
        case 22:
            return "Knowledge is the best prescription";
        case 23:
            return "Life is a precious gift";
        case 24:
            return "Listen to the patient; they'll tell you the diagnosis";
        case 25:
            return "Medicine is a science of uncertainty and an art of probability";
        case 26:
            return "No life is too small to save";
        case 27:
            return "No patient is just a number";
        case 28:
            return "Not on my watch";
        case 29:
            return "One must care about a world on will not see";
        case 30:
            return "Patience, persistence and perspiration make an unbeatable combination for healing";
        case 31:
            return "Preserve life at all costs";
        case 32:
            return "Science serves life";
        case 33:
            return "Seek out new life and heal it";
        case 34:
            return "Service to life is the highest calling";
        case 35:
            return "The best doctor gives the least medicines";
        case 36:
            return "The health of my patients is my first consideration";
        case 37:
            return "The patient is central";
        case 38:
            return "The prime directive of medicine is to serve humanity";
        case 39:
            return "The right treatment at the right time";
        case 40:
            return "There's always hope, even in the darkest times";
        case 41:
            return "To cure someone, to relieve often, to comfort always";
        case 42:
            return "To heal is to understand";
        case 43:
            return "Trust in the power of medicine";
        case 44:
            return "Understanding is the first step to healing";
        case 45:
            return "Unseen they suffer, unheard they cry";
        case 46:
            return "We are all patients";
        case 47:
            return "We are the healers of the universe";
        case 48:
            return "We do more than mend broken bones, we mend broken spirits";
        case 49:
            return "We must live long and prosper";
        case 50:
            return "Where there is life, there is hope";
        case 51:
            return "Wherever the art of medicine is loved, there is also a love of humanity";
        case 52:
            return "Wisdom is to medicine as logic is to science";
        case 53:
            return "Without health, life is not life";
        case 54:
            return "Work for the good of all";
        case 55:
            return "Life is sacred: respect it";
        case 56:
            return "Each patient brings their own universe";
        case 57:
            return "Keep the body in good health to keep the mind strong and clear";
        case 58:
            return "Medicine is a science, healing is an art";
        case 59:
            return "Compassion is the soul of medicine";
        case 60:
        default:
            return "You learn more from \"ouch\" than anything else";
    }
}

const SecurityValuesTable = () => {
    let roll = D20.roll() + D20.roll() + D20.roll();
    switch (roll) {
        case 3:
            return "A good defense is the best offense";
        case 4:
            return "Alert and ready, always";
        case 5:
            return "An ounce of prevention is worth a pound of cure";
        case 6:
            return "Be the shield for those who cannot protect themselves";
        case 7:
            return "Brave the unknown";
        case 8:
            return "Courage under fire";
        case 9:
            return "Diligence is the mother of good fortune";
        case 10:
            return "Duty before self";
        case 11:
            return "Every life is worth protecting";
        case 12:
            return "Expect the unexpected";
        case 13:
            return "Fear is the true enemy";
        case 14:
            return "Fear no evil";
        case 15:
            return "Forge strength through adversity";
        case 16:
            return "Honour and loyalty above all";
        case 17:
            return "I am the line in the sand";
        case 18:
            return "Injustice anywhere is a threat to justice everywhere";
        case 19:
            return "It takes strength to resist the dark side";
        case 20:
            return "Justice is the backbone of the Federation";
        case 21:
            return "Knowledge is our first line of defense";
        case 22:
            return "Leave no man behind";
        case 23:
            return "Live on the front line";
        case 24:
            return "Loyalty is more than just a word";
        case 25:
            return "Never let your guard down";
        case 26:
            return "Never stand down from a fight for what's right";
        case 27:
            return "No greater friend; no worse enemy";
        case 28:
            return "No one is above the law";
        case 29:
            return "Our duty is to protect";
        case 30:
            return "Peace is worth defending";
        case 31:
            return "Preparedness is the key";
        case 32:
            return "Preserve and protect";
        case 33:
            return "Protect the weak from the evil strong";
        case 34:
            return "Responsibility comes with power";
        case 35:
            return "Safety first";
        case 36:
            return "Security is more than just a job";
        case 37:
            return "Stand strong. Stand together";
        case 38:
            return "Stand up against injustice";
        case 39:
            return "Strength is more than just physical";
        case 40:
            return "The best protection is early detection";
        case 41:
            return "The Federation's safety is my responsibility";
        case 42:
            return "The front line is a privilege";
        case 43:
            return "The Prime Directive is absolute";
        case 44:
            return "There is no substitute for vigilance";
        case 45:
            return "To serve and protect";
        case 46:
            return "Trust, but verify";
        case 47:
            return "Truth and justice above all";
        case 48:
            return "Unseen, unheard, always around";
        case 49:
            return "Valour is stability. Not of legs and arms, but of courage and soul";
        case 50:
            return "Vigilance is the price of freedom";
        case 51:
            return "Watch and listen: every detail matters";
        case 52:
            return "We are the shield that guards the realms of the Federation";
        case 53:
            return "We do not fear the darkness";
        case 54:
            return "We stand for those who cannot";
        case 55:
            return "We will not go quietly into the night";
        case 56:
            return "Wisdom is greater than strength";
        case 57:
            return "With courage comes sacrifice";
        case 58:
            return "Without fear, there can be no courage";
        case 59:
            return "Your safety is my priority";
        case 60:
        default:
            return "A well-timed Vulcan death grip solves a lot of problems";
    }
}

const CommandValuesTable = () => {
    let roll = D20.roll() + D20.roll() + D20.roll();
    switch (roll) {
        case 3:
            return "A captain's place is on the bridge";
        case 4:
            return "Service before self";
        case 5:
            return "All actions have consequences";
        case 6:
            return "Always take the initiative";
        case 7:
            return "Be prepared for the unexpected";
        case 8:
            return "Believe in your crew";
        case 9:
            return "Boldly go where no one has gone before";
        case 10:
            return "Compassion is the heart of command";
        case 11:
            return "Confidence is the key in command";
        case 12:
            return "Decisions determine destiny";
        case 13:
            return "Discipline is the bridge between goals and accomplishments";
        case 14:
            return "Every challenge is an opportunity";
        case 15:
            return "Explore to discover";
        case 16:
            return "Failure is not an option";
        case 17:
            return "Fear is the mind killer";
        case 18:
            return "Follow the Prime Directive";
        case 19:
            return "For the love of adventure";
        case 20:
            return "Honour above all";
        case 21:
            return "Hope is a powerful weapon";
        case 22:
            return "Knowledge is our first line of defense";
        case 23:
            return "I will not ask my crew to do what I wouldn't";
        case 24:
            return "In crisis, there are no small jobs";
        case 25:
            return "Innovation over tradition";
        case 26:
            return "It's our job to get into trouble";
        case 27:
            return "Knowledge is power";
        case 28:
            return "Lead by example";
        case 29:
            return "Leadership is not a rank, but a responsibility";
        case 30:
            return "My crew; my family";
        case 31:
            return "Never leave a man behind";
        case 32:
            return "No one gets left behind";
        case 33:
            return "Order is necessary for progress";
        case 34:
            return "Peace comes from strength";
        case 35:
            return "Persistence commands success";
        case 36:
            return "Respect all. Fear none";
        case 37:
            return "Responsibility comes with command";
        case 38:
            return "Sacrifice for the greater good";
        case 39:
            return "Seek out new life: learn from it";
        case 40:
            return "Stand against injustice";
        case 41:
            return "Stay calm in the storm";
        case 42:
            return "Strategy over strength";
        case 43:
            return "The chain of command is sacred";
        case 44:
            return "The Federation is worth fighting for";
        case 45:
            return "The needs of the many";
        case 46:
            return "The unknown is a chance to learn";
        case 47:
            return "There is no growth in comfort";
        case 48:
            return "To lead is to serve";
        case 49:
            return "Unity is strength";
        case 50:
            return "Victory favours the prepared";
        case 51:
            return "We are explorers, not warriors";
        case 52:
            return "We are our best when we work together";
        case 53:
            return "We must strive to be more than we are";
        case 54:
            return "We're all part of the same team";
        case 55:
            return "Where there's a will, there's a way";
        case 56:
            return "Wisdom comes from experience";
        case 57:
            return "With risk comes reward";
        case 58:
            return "Without integrity, command means nothing";
        case 59:
            return "Your word is your bond";
        case 60:
        default:
            return "Nover leave an enemy behind";
    }
}

const disciplineRandomValues: {[species: number]: () => string } = {

    [Skill.Command]: CommandValuesTable,
    [Skill.Conn]: ConnValuesTable,
    [Skill.Engineering]: EngineeringValuesTable,
    [Skill.Science]: ScienceValuesTable,
    [Skill.Security]: SecurityValuesTable,
    [Skill.Medicine]: MedicineValuesTable,

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
            return "Seeking out new life, protecting it when found";
        case 19:
            return "The universe is full of wondrous complexity";
        case 20:
            return "Survival of the fittest";
        case 21:
            return "Boldly going where no one has gone before";
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
            return "Evolution is nature's experiment";
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
            return "Self-knowledge is the beginning of all wisdom";
        case 60:
        default:
            return "Imagination is more important than knowledge";
    }
}

