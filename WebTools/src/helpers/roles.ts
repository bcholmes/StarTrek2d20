import {Skill} from './skills';
import {Source} from './sources';
import {Character} from '../common/character';
import { CharacterType } from '../common/characterType';
import { AdultPrerequisite, AllOfPrerequisite, AnyOfPrerequisite, CadetPrerequisite, CareersPrerequisite, CharacterTypePrerequisite, ChildPrerequisite, CivilianPrerequisite, EnlistedPrerequisite, AnyEraPrerequisite, IConstructPrerequisite, KlingonPrerequisite, NotPrerequisite, SourcePrerequisite } from './prerequisite';
import { Career } from './careerEnum';
import { Era } from './eras';

export enum Role {
    // Core
    CommandingOfficer,
    ExecutiveOfficer,
    OperationsManager,
    ChiefEngineer,
    ChiefOfSecurity,
    ShipsCounselor,
    ChiefMedicalOfficer,
    ScienceOfficer,
    FlightController,
    CommunicationsOfficer,

    // Command Division
    Admiral,
    Adjutant,
    StrategicOperations,
    IntelligenceOfficer,
    FleetLiaisonOfficer,
    DiplomaticAttache,

    // Sciences Division
    ChiefSurgeon,
    HeadNurse,
    Anesthesiologist,
    PhysiciansAssistant,

    // Klingon Core
    SecondOrThirdOfficer,
    WeaponsOfficer,
    ShipsCookOrChef,

    // Player's Guide
    Administrator,
    Ambassador,
    ArmoryOfficer,
    Bartender,
    Bodyguard,
    Child,
    CivilianBureaucrat,
    Constable,
    Expert,
    IntelligenceAgent,
    Merchant,
    PoliticalLiaison,
    ShipsDoctor,
    SpiritualLeader,
    Translator,

    Navigator,

}

/**
 * We want there to be roles for Klingon characters if the Klingon Core rulebook is not
 * in play.
 */
class NotKlingonPrerequisite implements IConstructPrerequisite<Character> {
    isPrerequisiteFulfilled(character: Character): boolean {
        if (new SourcePrerequisite(Source.KlingonCore).isPrerequisiteFulfilled(character)) {
            return !(new KlingonPrerequisite().isPrerequisiteFulfilled(character));
        } else {
            return true;
        }
    }
    describe(): string {
        return "";
    }
}

class MilitaryPrerequisite implements IConstructPrerequisite<Character> {
    isPrerequisiteFulfilled(character: Character): boolean {
        return character.type === CharacterType.Starfleet ||
            character.type === CharacterType.KlingonWarrior ||
            character.type === CharacterType.AlliedMilitary ||
            character.type === CharacterType.Cadet;
    }
    describe(): string {
        return "";
    }
}

class NotTalentPrerequisite implements IConstructPrerequisite<Character> {

    private talent: string;

    constructor(talent: string) {
        this.talent = talent;
    }

    isPrerequisiteFulfilled(character: Character): boolean {
        return !character.hasTalent(this.talent);
    }
    describe(): string {
        return "";
    }
}


export class RoleModel {
    id: Role;
    name: string;
    description: string;
    department: Skill;
    ability: string;
    prerequisites: IConstructPrerequisite<Character>[];

    constructor(id: Role, name: string, description: string, department: Skill, ability: string, ...prerequisites: IConstructPrerequisite<Character>[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.department = department;
        this.ability = ability;
        this.prerequisites = prerequisites;
    }

    isPrerequisitesFilled(character: Character) {
        let valid = true;
        this.prerequisites.forEach(req => {
            if (!req.isPrerequisiteFulfilled(character)) {
                valid = false;
            }
        });
        return valid;
    }
}

class Roles {
    private _roles: RoleModel[] = [
        new RoleModel(
            Role.CommandingOfficer,
            "Commanding Officer",
            "The captain. Even if the commanding officer does not hold the rank of captain, they will be referred to as captain by their subordinates. Every ship must have a commanding officer.",
            Skill.Command,
            "The commanding officer may spend a point of Determination to grant any other character they can communicate with one point of Determination; this does not have to be linked to a Value.",
            new SourcePrerequisite(Source.Core),
            new NotPrerequisite(new CareersPrerequisite(Career.Young)),
            new NotPrerequisite(new EnlistedPrerequisite()),
            new NotKlingonPrerequisite(),
            new MilitaryPrerequisite(),
            new NotPrerequisite(new CadetPrerequisite())),
        new RoleModel(
            Role.ExecutiveOfficer,
            "Executive Officer",
            "Second-in-Command. The executive officer is the captain’s chief advisor, and takes command in situations where the captain is unable to. If a ship does not have a dedicated executive officer, an officer in another role should be noted as second-in-command, but they will not gain the benefits of this role.",
            Skill.Command,
            "When another character in communication with the executive officer spends a point of Determination, the executive officer may spend 3 Momentum (Immediate) to let that character regain the spent point of Determination.",
            new SourcePrerequisite(Source.Core),
            new NotPrerequisite(new CareersPrerequisite(Career.Young)),
            new NotPrerequisite(new EnlistedPrerequisite()),
            new NotKlingonPrerequisite(),
            new MilitaryPrerequisite(),
            new NotPrerequisite(new CadetPrerequisite())),
        new RoleModel(
            Role.OperationsManager,
            "Operations Manager",
            "The operations manager manages and oversees all technical operations aboard or involving the ship, normally from the Operations station on the Bridge, or in conjunction with the chief engineer (on smaller ships, one officer may fill both roles). This often entails taking on the duties of a science officer, if there is no dedicated science officer in the senior staff.",
            Skill.Engineering,
            "When the operations manager succeeds at a Task assisted by the ship’s Computers or Sensors, or using a tricorder, the character generates one bonus Momentum, which may only be used on the Obtain Information Momentum Spend.",
            new SourcePrerequisite(Source.Core),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.ChiefEngineer,
            "Chief Engineer",
            "The chief engineer is responsible for ensuring that the ship remains operational and functional, and commands the engineering department aboard the ship.",
            Skill.Engineering,
            "When aboard the ship, the chief engineer always has the Advantage “Engineering Department”, which represents the ship’s complement of engineers and technicians.",
            new SourcePrerequisite(Source.Core),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.ChiefOfSecurity,
            "Chief of Security",
            "The chief of security oversees the ship’s security department, and is responsible for ensuring the safety of the ship and crew during missions, for the investigation of disciplinary and criminal matters, and for overseeing the protection of important persons aboard the ship. On many ships, the chief of security operates from the Tactical station on the bridge.",
            Skill.Security,
            "When aboard the ship, the chief of security always has the Advantage “Security Detachment”, which represents the ship’s security personnel.",
            new SourcePrerequisite(Source.Core),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.ChiefMedicalOfficer,
            "Chief Medical Officer",
            "The chief medical officer, also known as ship’s surgeon, or ship’s doctor, is responsible for the health and wellbeing of the crew and other persons aboard the ship, and leads the ship’s medical department. A chief medical officer can order, and countermand the orders of, senior officers where matters of that officer’s health are concerned.",
            Skill.Medicine,
            "When aboard the ship, the chief medical officer always has the Advantage “Medical Department”, which represents the ship’s medical personnel.",
            new SourcePrerequisite(Source.Core),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.ScienceOfficer,
            "Science Officer",
            "A science officer is responsible for advising the commanding officer of all matters scientific, providing hypotheses in matters concerning the unknown. Not all ships have a dedicated science officer within the senior staff, often having the operations manager take on these duties.",
            Skill.Science,
            "When the science officer succeeds at a Task assisted by the ship’s Computers or Sensors, or using a tricorder, the character generates one bonus Momentum, which may only be used on the Obtain Information Momentum spend.",
            new SourcePrerequisite(Source.Core),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.FlightController,
            "Flight Controller",
            "Not a typical senior staff role, some captains, particularly those operating in uncharted space, choose the most senior helmsman or flight control officer to serve as senior staff as well.",
            Skill.Conn,
            "When the flight controller is required to analyze or repair technology related to flight or propulsion, they may use the Conn Discipline instead of Engineering.",
            new AnyOfPrerequisite(
                new AnyEraPrerequisite(Era.Enterprise, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32),
                new NotPrerequisite(new SourcePrerequisite(Source.TricorderSet))),
            new SourcePrerequisite(Source.Core),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.FlightController,
            "Helmsman",
            "The helmsman manages and oversees all technical operations aboard or involving  the ship, normally from the helm station on the bridge, or in conjunction with the chief engineer (on smaller ships, one officer may fill both roles). This often entails taking on the duties of a science officer, if there is no dedicated science officer in the senior staff. When the helmsman succeeds at a Task assisted by the ship’s Computers or Sensors, or using a tricorder, the character generates one bonus Momentum, which may only be used on the Obtain Information Momentum spend.",
            Skill.Conn,
            "You reduce the Difficulty of any task to translate or understand an unfamiliar language by 2, to a minimum of 0.",
            new SourcePrerequisite(Source.TricorderSet),
            new AnyEraPrerequisite(Era.OriginalSeries),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.Navigator,
            "Navigator",
            "Not a typical senior staff role, some captains, particularly those operating in uncharted space, choose the most senior navigator to serve as senior staff as well. When the navigator is required to analyze, or repair technology related to flight or propulsion, they may use the Conn Discipline instead of Engineering.",
            Skill.Conn,
            "You reduce the Difficulty of any task to translate or understand an unfamiliar language by 2, to a minimum of 0.",
            new SourcePrerequisite(Source.TricorderSet),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.ShipsCounselor,
            "Ship's Counselor",
            "On larger ships and starbases, it’s common to have personnel dedicated to the mental soak. Some captains regard them as valuable advisors, as their training covers both culture and psychology, making them exceptionally good at reading the moods and intentions of others.",
            Skill.Medicine,
            "After succeeding at a Task to determine the emotional state or intent of another living creature, the ship’s counselor gains one bonus Momentum, which may only be used on the Obtain Information Momentum Spend.",
            new SourcePrerequisite(Source.Core),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.CommunicationsOfficer,
            "Communications Officer",
            "More common in the earlier days of Starfleet, dedicated communications officers are typically skilled in linguistics and cryptography, and aided with advanced translation and decryption technologies, and thus valuable during encounters with both new cultures, and with hostile ones.",
            undefined,
            "When a Task attempted by the communications officer is increased in Difficulty because of an unfamiliar language or encryption, ignore that Difficulty increase.",
            new SourcePrerequisite(Source.Core),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.Admiral,
            "Admiral",
            "Flag Officers only.",
            Skill.Command,
            "Select three additional Focuses, reflecting areas of expertise or subjects that pertain to the admiral’s assignment. At the start of each mission, the admiral chooses one of their three Focuses, and every Main Character receives that as an additional Focus for the mission, due to additional briefings and instructional resources.",
            new SourcePrerequisite(Source.CommandDivision),
            new NotPrerequisite(new CareersPrerequisite(Career.Young)),
            new NotPrerequisite(new EnlistedPrerequisite()),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.Adjutant,
            "Adjutant",
            "The adjutant must be at least a lieutenant commander. This is the admiral’s closest advisor and assistant, providing aid and support like an executive officer supports a commanding officer. A good adjutant is always prepared with mission proposals, alternative plans, and hypothetical scenarios to allow the admiral to react to problems.",
            Skill.Command,
            "At the start of any scene, the adjutant may spend one Momentum (Immediate) in order to change the Focus chosen by the admiral for the duration of that scene only. The new Focus must be one of the others selected by the admiral.",
            new SourcePrerequisite(Source.CommandDivision),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.StrategicOperations,
            "Strategic Operations Officer",
            " This officer coordinates the movements and activities of vessels and forces in a given region or on a particular mission. Typically officers with a keen understanding of strategy, they advise the admiral and adjust plans independently when they cannot consult the admiral.",
            Skill.Command,
            "Regardless of rank, the strategic operations officer has authority over all vessels and forces linked to their region or mission. They may reduce the Difficulty of Persuade Tasks with the commanding officers of those vessels and forces by 1, to a minimum of 0.",
            new SourcePrerequisite(Source.CommandDivision),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.IntelligenceOfficer,
            "Intelligence Officer",
            "An intelligence officer receives Starfleet Intelligence, other branch and Federation ally reports on strategic and diplomatic developments in the region. These reports, and analyses, allow the officer to inform the admiral and other cleared personnel about matters that might impact decisions.",
            Skill.Security,
            "Once per mission, an intelligence officer may create an Advantage without requiring a Task or spending any resources. This Advantage reflects some detail or insight the officer learned in an intelligence report.",
            new SourcePrerequisite(Source.CommandDivision),
            new NotKlingonPrerequisite(),
            new CharacterTypePrerequisite(CharacterType.Starfleet),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.FleetLiaisonOfficer,
            "Fleet Liaison Officer",
            "A fleet liaison represents the interests of the fleet, and Starfleet as a whole, to one of the Federation’s allies. A Starfleet officer will represent the Federation, though the Gamemaster may allow other fleet liaison officers; for example, a joint KlingonFederation task force may include a Klingon Empire liaison. These officers report to superiors and allow cooperation between allies.",
            Skill.Command,
            "The fleet liaison officer gains an additional Trait (write it in the character sheet after export): Contacts Amongst X, where X is the fleet or service the liaison works with/for. For example, a Klingon Defence Force has the trait Contacts Amongst the Klingon Defence Force.",
            new SourcePrerequisite(Source.CommandDivision),
            new NotKlingonPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new MilitaryPrerequisite()),
        new RoleModel(
            Role.DiplomaticAttache,
            "Diplomatic Attaché",
            "A civilian from the Federation Diplomatic Corps and a valuable part of the staff who advises the admiral, and briefs them on culture, protocol, and other essential information during negotiations and other diplomatic activities.",
            Skill.Command,
            "At the start of any Social Conflict involving a foreign culture, the diplomatic attaché may spend two Momentum (Immediate) to create an Advantage for any Main Character present, representing a briefing provided by the attaché. This may be performed even if the attaché character is not personally present in that scene; it is prior counsel, rather than immediate assistance.",
            new SourcePrerequisite(Source.CommandDivision),
            new CivilianPrerequisite(),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new NotKlingonPrerequisite()),
        new RoleModel(
            Role.ChiefSurgeon,
            "Chief Surgeon",
            "On larger ships, the medical staff may be robust enough to support a dedicated surgery team. The head of this team is the chief surgeon. While the duties of this role may often be filled by the chief medical officer, when there is a dedicated surgeon, a character may choose to assume this role.",
            Skill.Medicine,
            "The chief surgeon gains a Bonus d20 to Control + Medicine Tasks to treat an Injury from a Lethal attack.",
            new SourcePrerequisite(Source.SciencesDivision),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new NotKlingonPrerequisite(),
            new AdultPrerequisite()),
        new RoleModel(
            Role.HeadNurse,
            "Head Nurse",
            "On almost any Federation starship, sickbay is staffed by a number of nurses, who assist the doctors on board with treating patients. There is, however, always a senior nurse – with the most experience, who works closely with the chief medical officer in managing the nursing staff.",
            Skill.Medicine,
            "The head nurse may substitute their Medicine Discipline in place of Command whenever attempting to coordinate or direct the medical staff on board the ship. Per the Direct Task, this may only be used with characters subordinate to the head nurse, and thus would not apply to doctors or surgeons.",
            new SourcePrerequisite(Source.SciencesDivision),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new NotKlingonPrerequisite(),
            new AdultPrerequisite()),
        new RoleModel(
            Role.Anesthesiologist,
            "Anesthesiologist",
            "These medical professionals are experts in treating pain and ensuring that patients do not suffer during the course of their treatments. This is of particular importance during major surgeries and other invasive treatments, as the anesthesiologist is also responsible for monitoring the patient’s vital signs and making adjustments to medications during the proceedings. This allows the surgeons and physicians to focus on the task at hand.",
            Skill.Medicine,
            "When the anesthesiologist is providing assistance during a Medicine Task, they do not count against any limit on the number of characters that may assist.",
            new SourcePrerequisite(Source.SciencesDivision),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new NotKlingonPrerequisite(),
            new AdultPrerequisite()),
        new RoleModel(
            Role.PhysiciansAssistant,
            "Physician's Assistant",
            "Filling a role between doctor and nurse, physician’s assistants are trained medical personnel that have attended medical school, but are not full doctors. Unlike nurses, however, they have sufficient training to diagnose and treat most minor to moderate conditions, and can make medical recommendations as well as prescribe medications. For more complex or life-threatening conditions, the physician’s assistant will call in a full doctor and then provide assistance.",
            Skill.Medicine,
            "When providing assistance to  another character attempting a Medicine Task on a patient that the physician’s assistant has already treated with a successful Medicine Task – the physician’s assistant provides two d20s to the Dice Pool instead of the usual one.",
            new SourcePrerequisite(Source.SciencesDivision),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new NotKlingonPrerequisite(),
            new AdultPrerequisite()),

        // Klingon Core
        new RoleModel(
            Role.CommandingOfficer,
            "Commanding Officer (ra'wl)",
            "Normally holding the rank of captain or commander, the commanding officer makes all important decisions concerning the ship and the mission, and should expect total obedience from the crew, in exchange for the responsibility to lead them to glorious victories and bring honor to ship and crew alike. The commanding officer may promote officers and may elevate enlisted personnel and even laborers to officer status, though unjustified promotions and signs of favoritism are likely to result in a challenge.",
            Skill.Command,
            "The commanding officer may spend a point of Determination to grant any other character they can communicate with one point of Determination; this does not have to be linked to a value.",
            new SourcePrerequisite(Source.KlingonCore),
            new KlingonPrerequisite()),
        new RoleModel(
            Role.ExecutiveOfficer,
            "First Officer (yaS wa’DIch)",
            "The ship’s second-in- command, the first officer “serves the captain, but stands for the crew”. In practice, this mean that the first officer represents the crew’s needs and wishes to the commanding officer, but also to ensure that the crew is functioning properly. They will assume command if the commanding officer is incapacitated and may challenge the commanding officer if they see signs of weakness or dishonor.",
            Skill.Command,
            "When another character in communication with the first officer spends a point of Determination, the first officer may spend 3 Momentum (Immediate) to let that character regain the spent point of Determination.",
            new SourcePrerequisite(Source.KlingonCore),
            new KlingonPrerequisite()),
        new RoleModel(
            Role.SecondOrThirdOfficer,
            "Second Officer/Third Officer (yaS cha’DIch/yaS wejDIch)",
            "The second and third officers are the next in line to command after the first officer, though they typically have other roles aboard ship as well, and have less direct interaction with the commanding officer, often performing their duties on other shifts. The third officer in particular is likely to be a young officer with little field experience, learning how a starship is run.",
            Skill.Command,
            "The second officer becomes first officer if the previous first officer is incapacitated or successfully challenges the  previous commanding officer. Similarly, the third officer becomes second officer if that position is vacated. Aside from this, characters of these roles should select another role to perform.",
            new SourcePrerequisite(Source.KlingonCore),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new KlingonPrerequisite()),
        new RoleModel(
            Role.FlightController,
            "Helm Officer (DeghwI’)",
            "The weapons officer has direct control of the ship’s weaponry, and is responsible for their maintenance and upkeep. Since this can vary from vessel to vessel, it is vital that a ship’s weapons officer be completely familiar with the arsenal they oversee. The weapons officer also has the duty of becoming familiar with enemy vessels, learning their strengths, weaknesses, and capabilities to advise the commanding officer during battle.",
            Skill.Conn,
            "When the weapons officer succeeds at an attack with the ship’s weapons, they may re-roll a number of challenge dice on the damage roll equal to the weapons officer’s Security score.",
            new SourcePrerequisite(Source.KlingonCore),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new KlingonPrerequisite()),
        new RoleModel(
            Role.WeaponsOfficer,
            "Weapons Officer (nuHpIn)",
            "The helm officer is responsible for laying a course and controlling the ship’s speed. For travel at warp, this is mostly automated with the helm officer overseeing and correcting for unexpected activity. A skilled helm officer is respected for their ability to manually control their ship, both in space and (in smaller ships) in atmosphere and will have learned a wide range of tactical maneuvers and be able to perform them instantly when commanded.",
            Skill.Security,
            "When the weapons officer succeeds at an attack with the ship’s weapons, they may re-roll a number of challenge dice on the damage roll equal to the weapons officer’s Security score.",
            new SourcePrerequisite(Source.KlingonCore),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new KlingonPrerequisite()),
        new RoleModel(
            Role.ScienceOfficer,
            "Science Officer (QeDpIn)",
            "The science officer is responsible for interpreting all sensor data the ship collects, as well as advising the commanding officer about any scientific phenomena encountered which could affect the ship or its mission. The science officer also assesses planetary conditions for landing parties and makes recommendations as to the best landing site. In combat, they gather data on enemy vessels and pass this to other officers to devise effective tactics.",
            Skill.Science,
            "When the science officer succeeds at a task assisted by the ship’s Computers or Sensors, or using a tricorder, the character generates one bonus Momentum, which may only be used on the Obtain Information Momentum spend.",
            new SourcePrerequisite(Source.KlingonCore),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new KlingonPrerequisite()),
        new RoleModel(
            Role.ChiefEngineer,
            "Engineering Officer (jonpIn)",
            "Overseeing the engineers who operate in the engine room, the engineering officer serves on the bridge and is responsible for monitoring and reporting on the condition of the ship, coordinating damage control, distributing power to different systems, and operating non-weapon systems such as the cloaking device and shields.",
            Skill.Engineering,
            "When the engineering officer succeeds at an Engineering task to perform repairs or re-route power, they generate one point of bonus Momentum to be used on that task. Bonus Momentum may not be saved.",
            new SourcePrerequisite(Source.KlingonCore),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new KlingonPrerequisite()),
        new RoleModel(
            Role.ChiefMedicalOfficer,
            "Surgeon (HaqwI’)",
            "Every Klingon vessel includes a physician of some kind, and though they are not customarily officers, they are nevertheless well- respected: every warrior aboard a vessel will owe life or limb to the surgeon’s care. Even outside of battle, the surgeon is kept busy tending to injuries sustained in training, brawling, or other common activities. Klingon medicine is primarily focused on getting the patient back into action as quickly as possible, commonly using stimulants and pain suppressants and quickly mending broken bones and flesh wounds to send injured crew back to their posts in minutes. Only the most severe injuries may require lengthy care, and a Klingon surgeon may perform triage with a ruthlessness that would shock a Federation doctor.",
            Skill.Medicine,
            "When a surgeon succeeds at a Medicine task to stabilize an injured character, they need only spend 1 Momentum rather than 2 to get the patient back on their feet and able to act again.",
            new SourcePrerequisite(Source.KlingonCore),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new KlingonPrerequisite()),
        new RoleModel(
            Role.ShipsCookOrChef,
            "Ship’s Cook (vutwI’)",
            "Every Klingon ship has a cook – larger ships may have several, in which case this role applies to the head cook – who is responsible for ensuring that the crew is well-fed. The whole crew customarily eats together, and most Klingons are disdainful of replicated food. The ship’s cook is thus of vital importance, as good meals ensure the crew remains in good spirits and ready for battle. Their role also includes raising and butchering animals kept aboard, such as targs.",
            undefined,
            "Once per adventure, before a new scene begins, the ship’s cook may declare a short scene of the crew eating a meal together. At the end of this scene, instead of reducing the group’s Momentum pool by 1, roll 1 challenge die, and add the total rolled to the group’s Momentum pool. If the commanding officer allows, the meal may include bloodwine; in this case, roll 3 challenge dice instead of 1, but add 1 to Threat for each effect rolled, as the crew gets a little too drunk.",
            new SourcePrerequisite(Source.KlingonCore),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new KlingonPrerequisite()),

        // Player's Guide
        new RoleModel(
            Role.Administrator,
            "Administrator",
            "Administrators are important but often unappreciated. They oversee the smooth operation of colonies and other institutions, such as spaceports, hospitals, and research centers. These positions tend to be held by civilians in many cases, but military administrators necessarily exist to oversee military facilities, such as Starfleet commanders running a starbase. Their role often ensures that they are well-connected, given the variety of people and services involved in running a colony, port, or similar.",
            Skill.Command,
            "You may, once per session, create an advantage which represents a favor owed by a connection in politics, bureaucracy, trade, or some similar position of importance. Creating this advantage has no cost, and it may be used before attempting a task.",
            new SourcePrerequisite(Source.PlayersGuide),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new CivilianPrerequisite()),
        new RoleModel(
            Role.Ambassador,
            "Ambassador",
            "Ambassadors represent the interests of their nation or other political entity to other nations. The Federation has numerous ambassadors, as do member worlds within the Federation, and other powers such as the Cardassian Union, the Ferengi Alliance, the Klingon Empire, and the Romulan Star Empire. Ambassadors are the highest rank of diplomats, and thus possess all the rights, privileges, and responsibilities afforded to diplomatic personnel under international treaties observed by all cultures, including immunity from criminal prosecution.",
            Skill.Command,
            "You possess an additional trait: X Ambassador, where X is the name of the world or civilization the character represents. This trait represents the rights and privileges of ambassadorial status.",
            new SourcePrerequisite(Source.PlayersGuide),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new CivilianPrerequisite()),
        new RoleModel(
            Role.ArmoryOfficer,
            "Armory Officer",
            "A presence on older Starfleet ships, and common in other militaries, this role is also known as tactical officer or weapons officer. The officer is responsible for the upkeep and use of the ship’s armaments and is typically an expert in ship-to-ship combat.",
            Skill.Security,
            "When you succeed at an attack with the ship’s weapons, they may re-roll a number of [D] on the Stress roll equal to the armory officer’s Security score",
            new SourcePrerequisite(Source.PlayersGuide),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new AnyOfPrerequisite(
                new AllOfPrerequisite(
                    new AnyEraPrerequisite(Era.Enterprise),
                    new CharacterTypePrerequisite(CharacterType.Starfleet)),
                new CharacterTypePrerequisite(CharacterType.AlliedMilitary))
            ),
        new RoleModel(
            Role.Bartender,
            "Bartender",
            "Found in civilian bars, casinos, and similar establishments across the Galaxy, and even aboard larger Federation starships in crew lounges. While this might seem like a minor role, bartenders interact closely with people and are in the business of helping people relax and enjoy themselves, and thus they often excel at getting people to talk about their problems and tend to know what’s going on with everyone who passes through. This may also represent other public-facing business owners, such as tailors, barbers, and spa owners.",
            undefined,
            "Each adventure, you may ask the gamemaster three questions, as per the Obtain Information Momentum spend, but without spending Momentum and without requiring a successful task first. The answers represent things you’ve overheard from patrons and passers-by, as well as other rumors circulating your establishment. You do not have to ask all these questions at once.",
            new SourcePrerequisite(Source.PlayersGuide),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new CivilianPrerequisite()),
        new RoleModel(
            Role.Bodyguard,
            "Bodyguard",
            "You specialize in personal security, protecting an individual, whether a paying client, or someone you were assigned to. Militaries tend not to employ specific bodyguards in this sense, but most will have soldiers or security personnel who will be assigned to protect VIPs – ambassadors, admirals, political figures, and similar – as needed.",
            Skill.Security,
            "As a bodyguard, you will have a single character – another PC, or an NPC – whom you are assigned to protect. When you are in the same zone as that character, you may spend 1 Momentum (Immediate) when that character is attacked to have the attack target you instead. If you do this, the attack’s Difficulty is also increased by 1.",
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new SourcePrerequisite(Source.PlayersGuide),
            new AdultPrerequisite()),
        new RoleModel(
            Role.ShipsCookOrChef,
            "Chef",
            "In addition to owning restaurants, chefs and cooks are often found on starships and starbases, particularly those which do not purely rely upon replicators to feed the crew; a ship’s cook was a common fixture on older ships before the introduction of the replicator. Larger modern Starfleet vessels, especially ones serving diplomatic roles, will often have a chef aboard to help prepare banquets for dignitaries, cooking with a mixture of stored foods, fruit and vegetables grown in hydroponics bays, and replicated ingredients to produce spectacular dishes.",
            undefined,
            "Once per adventure, you may prepare a meal for a non-combat scene set aboard ship; this may be a dinner at the captain’s table, a banquet for dignitaries or other VIPs, part of a celebration, or some other meaningful occasion. Player characters may re-roll 1d20 on all social conflict tasks they attempt during that scene. When the scene ends, do not reduce the group’s Momentum pool by 1",
            new SourcePrerequisite(Source.PlayersGuide),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new NotKlingonPrerequisite(),
            new AdultPrerequisite()),
        new RoleModel(
            Role.Child,
            "Child",
            "Child character only. You’re a child of one of the crew, and often get involved in the exploits and adventures of the crew simply by being aboard the ship, perhaps because you’re learning from them. Unless you cause trouble, you may be overlooked by the adults around you, but that and your youthful curiosity often lands you in places you shouldn’t be.",
            undefined,
            "Once per adventure, when a non-combat scene begins and does not include you, you may add 2 Threat to declare that you are either present in the scene, or somewhere nearby. In addition, if you do end up in a combat scene, enemies must spend 1 Threat to attack you directly. However, your inexperience means that you add 1 to your complication range for all tasks.",
            new SourcePrerequisite(Source.PlayersGuide),
            new ChildPrerequisite()),
        new RoleModel(
            Role.CivilianBureaucrat,
            "Civilian Bureaucrat",
            "You keep an organization functioning, ensuring that the wheels of civilization continue to turn. You’re often placed in charge of important matters within an organization, liaising with other groups to ensure that vital tasks get accomplished",
            Skill.Command,
            "When you attempt a task which relates to bureaucracy or administrative work, you may reduce the Difficulty by 2, to a minimum of 0. In addition, if you succeed at such a task and spend Momentum to Obtain Information, then the first point of Momentum spent allows you to ask two questions rather than one.",
            new SourcePrerequisite(Source.PlayersGuide),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new CivilianPrerequisite()),
        new RoleModel(
            Role.Constable,
            "Constable",
            "A somewhat old-fashioned term for an officer of the law or a keeper of the peace, you serve a community by upholding the law, maintaining order, and arbitrating disputes. This is a common role in colonies and amongst the civilian population of space stations, either in place of or along- side more conventional security forces such as Starfleet. You may be a lone peace officer, handling matters with your wits and your words, or you might oversee a collection of deputies or other subordinates.",
            Skill.Security,
            "When you succeed at a task to investigate a crime scene, or to question a witness or suspect, you generate one bonus Momentum. Bonus Momentum may not be saved. In addition, your knowledge of local criminal activity means that once per scene, you may create an advantage representing an informant’s information by adding 1 to Threat rather than spending 2 Momentum.",
            new SourcePrerequisite(Source.PlayersGuide),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new CivilianPrerequisite()),
        new RoleModel(
            Role.Expert,
            "Expert",
            "You are an expert in a particular field, working alongside the crew to consult upon a matter related to your expertise. You are highly specialized, and extremely capable in your chosen field, but this may lead you to ignore or overlook things that fall outside your knowledge, or result in an obsession that causes you to prioritize your work over other concerns.",
            Skill.Science,
            "You gain one additional value, which must reflect the importance of your work to you. In addition, select one of your focuses – this is the field you are an expert in. When you use this focus on a task and succeed, you generate one bonus Momentum. Bonus Momentum may not be saved.",
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new SourcePrerequisite(Source.PlayersGuide),
            new AdultPrerequisite()),
        new RoleModel(
            Role.IntelligenceAgent,
            "Intelligence Agent",
            "You are not a traditional part of the fleet. Instead, you are an operative of the intelligence services of your civilization. You are charged with gathering information from places and people that don’t want their information gathered, and you achieve this through a combination of your own skills and the network of informants and contacts you have cultivated.",
            Skill.Security,
            "Once per adventure, you may create an advantage without requiring a task or spending any Momentum, Threat, or Determination. This advantage must reflect information, equipment, physical resources, or access to a location (such as access codes or identification data) provided to you by a contact or by your agency.",
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new SourcePrerequisite(Source.PlayersGuide),
            new AdultPrerequisite()),
        new RoleModel(
            Role.Merchant,
            "Merchant",
            "You’re a merchant or trader, exchanging valuable goods for latinum, or for other goods. Even in the Federation, a civilization which has largely evolved beyond scarcity and the personal accumulation of wealth, merchants are necessary for ensuring that resources can easily move from place to place, and the Federation and its members maintain reserves of latinum and other precious commodities to allow them to trade with other civilizations. In a practical, day-to-day sense, merchants are well-connected and often have access to unusual items or specialized resources that might not be available normally.",
            Skill.Command,
            "Once per adventure, you can waive the Opportunity costs on up to three items of equip- ment being acquired by other player characters. You may even allow other player characters to obtain items that are not normally available to them (such as disruptors to a Starfleet crew, or items which are restricted or illegal), though you add 1 to Threat for each such item provided.",
            new SourcePrerequisite(Source.PlayersGuide),
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new CivilianPrerequisite()),
        new RoleModel(
            Role.PoliticalLiaison,
            "Political Liaison",
            "You serve as a representative of a government to the crew, representing the government’s needs and interests during the operations of the crew, and providing the crew with a means of communicating with that government in turn. This is often the case where multiple groups are required to coexist, such as a Starfleet facility operating close to an allied non-Federation world, or as part of a joint operation between Starfleet and Klingon Defense Force personnel. You represent the official government that your organization belongs to – i.e., if you are a member of the Bajoran Militia, then you represent the current Bajoran government.",
            Skill.Command,
            "You gain an additional Directive or Dictate, which only applies to you, which reflects the political stance of the government you represent. Your gamemaster will work with you to determine the wording of this Directive or Dictate. It serves to provide you with a source of complications and potential restrictions when acting against the interests of your government, as well as benefits when you are acting with the full support of your superiors.",
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new SourcePrerequisite(Source.PlayersGuide),
            new AdultPrerequisite()),
        new RoleModel(
            Role.ShipsDoctor,
            "Ship's Doctor",
            "You care for the crew of your ship, or the station you serve on (in which case, rename the role to Station Doctor), but unlike a Chief Medical Officer, you do not have an extensive medical department to manage or to aid you. This is common in smaller crews which do not require a large sickbay or infirmary and tends to mean that these smaller postings favor generalists who can adapt to a variety of circumstances, where a larger medical staff could rely on specialists.",
            Skill.Command,
            "You have two additional focuses, which must relate to fields of study within medicine. However, your ship cannot use Crew Support to introduce supporting charac- ters from the medical department.",
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new SourcePrerequisite(Source.PlayersGuide),
            new AdultPrerequisite()),
        new RoleModel(
            Role.SpiritualLeader,
            "Spritual Leader",
            "You are an important figure within your community, providing spiritual and philosophical guidance to those who are troubled. In many cases, this can overlap with the role of a counselor, but there are meaningful differences between the two. Spiritual leaders are more prominent in overtly religious or spiritual cultures, but religion is not necessary for spiritual leaders to be present in a culture, as demonstrated by the Vulcans and Klingons. The Bajoran faith is an example of one that has many spiritual leaders.",
            undefined,
            "When you are in a non-conflict scene with a character who is suffering a complication from using a value negatively, or who has challenged one of their values, you may re-roll your d20 when you assist them. If they have challenged one of their values, you may spend 2 Momentum (Immediate) during the scene to allow them to rewrite their crossed-out value in that scene rather than at the end of the adventure.",
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new SourcePrerequisite(Source.PlayersGuide),
            new CivilianPrerequisite()),
        new RoleModel(
            Role.Translator,
            "Translator",
            "You are an expert in language and communication. While the development of the universal translator has reduced the need for translators during daily life, there are still situations which call for experts in linguistics. Encounters with new cultures often require support from xenolinguistics experts to smooth over any problems that the universal translator has, particularly if a culture has an unusual style or method of communication. Similarly, archaeological research often requires piecing together extinct languages from evidence in ways that can’t easily be automated. You are a polyglot, who knows enough of most common languages spoken by your culture and its neighbors to communicate freely without a universal translator.",
            Skill.Medicine,
            "You reduce the Difficulty of any task to translate or understand an unfamiliar language by 2, to a minimum of 0.",
            new NotTalentPrerequisite("Advanced Team Dynamics"),
            new SourcePrerequisite(Source.PlayersGuide),
            new AdultPrerequisite()),




    ];

    getRoles(character: Character) {
        var departments = this.determineHighestDiscipline(character);
        var roles: RoleModel[] = [];
        var list = this._roles;
        for (var r of list) {
            if (r.isPrerequisitesFilled(character)) {
                if (character.hasTalent("Multi-Discipline") && (r.id === Role.CommandingOfficer || r.id === Role.Admiral)) {
                    continue;
                }
                roles.push(r);
            }
        }

        let temp = roles.sort((a, b) => {
            if (a.department == null && b.department == null) {
                return a.id - b.id;
            } else if (a.department != null && b.department != null && departments.indexOf(a.department) >= 0 && departments.indexOf(b.department) >= 0) {
                return a.id - b.id;
            } else if (a.department != null && departments.indexOf(a.department) >= 0 && b.department != null) {
                return -1;
            } else if (b.department != null && departments.indexOf(b.department) >= 0 && a.department != null) {
                return 1;
            } else if (a.department == null) {
                return 1;
            } else if (b.department == null) {
                return -1;
            } else {
                return a.id - b.id;
            }
        });
        return temp;
    }

    getRoleModelByName(role: string, type: CharacterType) {

        var list = this._roles;
        for (var r of list) {
            if (r.name === role) {
                return r;
            }
        }

        return undefined;
    }

    getRoleByName(role: string) {

        var list = this._roles;
        for (var r of list) {
            if (r.name === role) {
                return r.id;
            }
        }

        return undefined;
    }

    private determineHighestDiscipline(character: Character) {
        var skills = [];
        character.skills.forEach(s => {
            skills.push(s);
        });

        var disciplines = skills.sort((a, b) => { return b.expertise - a.expertise });
        var highest = [disciplines[0].skill];
        var value = disciplines[0].expertise;

        for (var i = 1; i < disciplines.length; i++) {
            if (disciplines[i].expertise === value) {
                highest.push(disciplines[i].skill);
            } else {
                break;
            }
        }

        return highest;
    }
}

export const RolesHelper = new Roles();
