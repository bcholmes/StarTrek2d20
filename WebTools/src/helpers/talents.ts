import {character, CharacterType} from '../common/character';
import {AliasModel} from './aliases';
import {Attribute} from './attributes';
import {Skill, SkillsHelper} from './skills';
import {DiceRoller} from './diceRoller';
import {Department} from './departments';
import {Source} from './sources';
import {Rank, RanksHelper} from './ranks';
import {Era} from './eras';
import { Species } from './species';

interface ITalentPrerequisite {
    isPrerequisiteFulfilled(): boolean;
}

class AttributePrerequisite implements ITalentPrerequisite {
    private attribute: Attribute;
    private value: number;

    constructor(attribute: Attribute, minValue: number) {
        this.attribute = attribute;
        this.value = minValue;
    }

    isPrerequisiteFulfilled() {
        return character.attributes[this.attribute].value >= this.value;
    }
};

class DisciplinePrerequisite implements ITalentPrerequisite {
    private discipline: Skill;
    private value: number;

    constructor(discipline: Skill, minValue: number) {
        this.discipline = discipline;
        this.value = minValue;
    }

    isPrerequisiteFulfilled() {
        return character.skills[this.discipline].expertise >= this.value;
    }
};

class UntrainedDisciplinePrerequisite implements ITalentPrerequisite {
    private discipline: Skill;

    constructor(discipline: Skill) {
        this.discipline = discipline;
    }

    isPrerequisiteFulfilled() {
        return character.skills[this.discipline].expertise === 1;
    }
};

class VariableDisciplinePrerequisite implements ITalentPrerequisite {
    private discipline1: Skill;
    private discipline2: Skill;
    private value: number;

    constructor(discipline1: Skill, discipline2: Skill, minValue: number) {
        this.discipline1 = discipline1;
        this.discipline2 = discipline2;
        this.value = minValue;
    }

    isPrerequisiteFulfilled() {
        return character.skills[this.discipline1].expertise >= this.value ||
               character.skills[this.discipline2].expertise >= this.value;
    }
};

class SpeciesPrerequisite implements ITalentPrerequisite {
    private species: number;
    private allowCrossSelection: boolean;

    constructor(species: number, allowCrossSelection: boolean) {
        this.species = species;
        this.allowCrossSelection = allowCrossSelection;
    }

    isPrerequisiteFulfilled() {
        return character.species === this.species ||
               character.mixedSpecies === this.species ||
               (this.allowCrossSelection && character.allowCrossSpeciesTalents);
    }
}

class AnySpeciesPrerequisite implements ITalentPrerequisite {
    private species1: number;
    private species2: number;
    private allowCrossSelection: boolean;

    constructor(species1: number, species2: number, allowCrossSelection: boolean) {
        this.species1 = species1;
        this.species2 = species2;
        this.allowCrossSelection = allowCrossSelection;
    }

    isPrerequisiteFulfilled() {
        return character.species === this.species1 ||
               character.species === this.species2 ||
               character.mixedSpecies === this.species1 ||
               character.mixedSpecies === this.species2 ||
               (this.allowCrossSelection && character.allowCrossSpeciesTalents);
    }
}

class PureSpeciesPrerequisite implements ITalentPrerequisite {
    private species: number;
    private allowCrossSelection: boolean;

    constructor(species: number, allowCrossSelection: boolean) {
        this.species = species;
        this.allowCrossSelection = allowCrossSelection;
    }

    isPrerequisiteFulfilled() {
        return (character.species === this.species && character.mixedSpecies == null) ||
               (this.allowCrossSelection && character.allowCrossSpeciesTalents);
    }
}

class CareerPrerequisite implements ITalentPrerequisite {
    private career: number;

    constructor(species: number) {
        this.career = species;
    }

    isPrerequisiteFulfilled() {
        return character.career === this.career;
    }
}

class CharacterTypePrerequisite implements ITalentPrerequisite {
    private type: CharacterType;

    constructor(type: CharacterType) {
        this.type = type;
    }

    isPrerequisiteFulfilled() {
        return character.type === this.type;
    }
}

class AnyOfPrerequisite implements ITalentPrerequisite {
    private prerequisites: ITalentPrerequisite[];

    constructor(...prerequisites: ITalentPrerequisite[]) {
        this.prerequisites = prerequisites;
    }

    isPrerequisiteFulfilled() {
        var result = false;
        for (var p of this.prerequisites) {
            result = result || p.isPrerequisiteFulfilled();
            if (result) {
                break;
            }
        }
        return result;
    }
}


class TalentPrerequisite implements ITalentPrerequisite {
    private talent: string;

    constructor(talent: string) {
        this.talent = talent;
    }

    isPrerequisiteFulfilled() {
        return character.hasTalent(this.talent);
    }
}

class FocusPrerequisite implements ITalentPrerequisite {
    private focus: string;

    constructor(focus: string) {
        this.focus = focus;
    }

    isPrerequisiteFulfilled() {
        return character.focuses.indexOf(this.focus) > -1;
    }
}

class NotTalentPrerequisite implements ITalentPrerequisite {
    private talent: string;

    constructor(talent: string) {
        this.talent = talent;
    }

    isPrerequisiteFulfilled() {
        return !character.hasTalent(this.talent);
    }
}

class SourcePrerequisite implements ITalentPrerequisite {
    private sources: Source[];

    constructor(...sources: Source[]) {
        this.sources = sources;
    }

    isPrerequisiteFulfilled() {
        var result = false
        this.sources.forEach((s) => { result = result || character.hasSource(s) })
        return result;
    }

    getSources() {
        return this.sources;
    }
}

class EraPrerequisite implements ITalentPrerequisite {
    private era: Era;

    constructor(era: Era) {
        this.era = era;
    }

    isPrerequisiteFulfilled() {
        return character.era >= this.era;
    }
}

class NotEraPrerequisite implements ITalentPrerequisite {
    private eras: Era[];

    constructor(...eras: Era[]) {
        this.eras = eras;
    }

    isPrerequisiteFulfilled() {
        var result = true;
        this.eras.forEach((e) => { result = result && character.era != e })
        return result;
    }
}

class StarshipPrerequisite implements ITalentPrerequisite {
    isPrerequisiteFulfilled() {
        return character.starship != null;
    }
}

class ServiceYearPrerequisite implements ITalentPrerequisite {
    private year: number;

    constructor(year: number) {
        this.year = year;
    }

    isPrerequisiteFulfilled() {
        return character.starship != null && character.starship.serviceYear >= this.year;
    }
}

class MaxServiceYearPrerequisite implements ITalentPrerequisite {
    private year: number;

    constructor(year: number) {
        this.year = year;
    }

    isPrerequisiteFulfilled() {
        return character.starship != null && character.starship.serviceYear <= this.year;
    }
}

class SpaceframePrerequisite implements ITalentPrerequisite {
    private frame: number;

    constructor(frame: number) {
        this.frame = frame;
    }

    isPrerequisiteFulfilled() {
        return character.starship != null && character.starship.spaceframe === this.frame;
    }
}

class SpaceframesPrerequisite implements ITalentPrerequisite {
    private frames: number[];

    constructor(frames: number[]) {
        this.frames = frames;
    }

    isPrerequisiteFulfilled() {
        return character.starship != null &&
               this.frames.indexOf(character.starship.spaceframe) > -1;
    }
}

class DepartmentPrerequisite implements ITalentPrerequisite {
    private department: Department;
    private value: number;

    constructor(department: Department, value: number) {
        this.department = department;
        this.value = value;
    }

    isPrerequisiteFulfilled() {
        return character.starship != null && character.starship.departments[this.department] >= this.value;
    }
}

export class TalentModel {
    name: string;
    description: string;
    prerequisites: ITalentPrerequisite[];
    maxRank: number;
    category: string;
    aliases: AliasModel[];

    constructor(name: string, desc: string, prerequisites: ITalentPrerequisite[], maxRank: number, category?: string, ...aliases: AliasModel[]) {
        this.name = name;
        this.description = desc;
        this.prerequisites = prerequisites;
        this.maxRank = maxRank;
        this.category = category || "";
        this.aliases = aliases || AliasModel[0];
    }

    isAvailableExcludingSpecies() {
        var available = true;
        this.prerequisites.forEach((p, i) => {
            if (!(p instanceof SpeciesPrerequisite) && !(p instanceof AnySpeciesPrerequisite) && !p.isPrerequisiteFulfilled()) {
                available = false;
            }
        });
        return available;
    }

    nameForSource(source: Source) {
        var result = this.name;
        for (var a of this.aliases) {
            if (a.source === source) {
                result = a.name;
                break;
            }
        }
        return result;
    }
}

export class TalentViewModel {
    id: string;
    name: string;
    rank: number;
    description: string;
    category: string;

    constructor(name: string, rank: number, showRank: boolean, description: string, skill: Skill, category: string) {
        this.id = name;
        this.description = description;
        this.name = this.constructDisplayName(name, rank, showRank, skill, category);
    }


    private constructDisplayName(name: string, rank: number, showRank: boolean, skill: Skill, category: string) {
        let displayName = name + (showRank ? " [Rank: " + rank + "]" : "");
        displayName += skill !== undefined && skill !== Skill.None
            ? ` (${SkillsHelper.getSkillName(skill)})`
            : category.length > 0 ? ` (${category})` : "";

        return displayName;
    }
}

export function ToViewModel(talent: TalentModel): TalentViewModel {
    return new TalentViewModel(talent.name, 1, talent.maxRank > 1, talent.description, undefined, talent.category);
}

export class Talents {
    private _talents: { [skill: number]: TalentModel[] } = {
        [Skill.Command]: [
            new TalentModel(
                "Advisor",
                "Whenever you assist another character using your Command Discipline, the character being assisted may re-roll one d20.",
                [new DisciplinePrerequisite(Skill.Command, 2)],
                1),
            new TalentModel(
                "Defuse the Tension",
                "Whenever you attempt a Task to persuade someone not to resort to violence, you may add a bonus d20 to your dice pool.",
                [new DisciplinePrerequisite(Skill.Command, 3)],
                1),
            new TalentModel(
                "Follow My Lead",
                "Once per scene, when you succeed at a Task during combat or another perilous situation, you may spend one Determination. If you do, choose a single ally. The next Task that ally attempts counts as having assistance from you, using your Presence + Command.",
                [new DisciplinePrerequisite(Skill.Command, 3)],
                1),
            new TalentModel(
                "Supervisor",
                "The ship’s Crew Support increases by one. This increase is cumulative if multiple Main Characters in the group select it.",
                [],
                1, null, new AliasModel("War Leader", Source.KlingonCore)),
            new TalentModel(
                "Bargain",
                "When negotiating an offer with someone during Social Conflict, you may re-roll a d20 on your next Persuade Task to convince that person. If the Social Conflict involves an Extended Task, you gain the Progression 1 benefit when you roll your Challenge Dice.",
                [new DisciplinePrerequisite(Skill.Command, 3), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Call Out Targets",
                "Upon assisting a character making an attack (using either the Assist Task, the Direct Task, or some other means), the helped character generates one point of bonus Momentum if they succeed; bonus Momentum cannot be saved to the group pool.",
                [new DisciplinePrerequisite(Skill.Command, 3), new DisciplinePrerequisite(Skill.Security, 3), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Call to Action",
                "In a Conflict, a character may use the Prepare Minor Action to grant one ally a Minor Action of their choice (performed immediately) if they can communicate with that ally.",
                [new DisciplinePrerequisite(Skill.Command, 3), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Cold Reading",
                "Succeeding at a Task during Social Conflict generates one bonus Momentum which must be used for the Obtain Information Momentum Spend to gain knowledge about an individual on the other side of the interaction. If the Social Conflict involves an Extended Task, the character gains the Scrutinize 1 benefit when rolling Challenge Dice.",
                [new DisciplinePrerequisite(Skill.Command, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Coordinated Efforts",
                "During an Extended Task, an assisted character may gain either the Scrutinize 2 or Progression 1 benefits when they roll their Challenge Dice.",
                [new DisciplinePrerequisite(Skill.Command, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Decisive Leadership",
                "In a Conflict, whenever the character performs the Assist Task and would then pay two Momentum to keep the initiative, the cost to keep the initiative is reduced to 0.",
                [new DisciplinePrerequisite(Skill.Command, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Fleet Commander",
                "Commanding a vessel during a fleet action reduces the Difficulty of a Task to grant a bonus to your vessel or group by 1, to a minimum of 1. Aboard a vessel during a fleet action, the character may treat the vessel as having a Command Department of 4+, regardless of the actual value.",
                [new DisciplinePrerequisite(Skill.Command, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Multi-Discipline",
                "The character may select one additional Role, but not Commanding Officer or Admiral.",
                [new DisciplinePrerequisite(Skill.Command, 3), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Plan of Action",
                "When an ally succeeds at a Task that was made possible or had reduced Difficulty because of an Advantage created by the character, if that Advantage represented a plan or strategy, they generate two bonus Momentum. Bonus Momentum cannot be saved into the group pool.",
                [new DisciplinePrerequisite(Skill.Command, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Time Management",
                "During any Challenge, Extended Task or other activity under time pressure, the character may attempt a Control + Command Task with a Difficulty 3. If this Task succeeds, reduce the total number of intervals the Players have taken by 1; for every 2 Momentum spent (Repeatable) reduce by a further 1. The character has managed to minimize lost time. If the Task fails, add one additional interval as the character’s efforts actually waste time.",
                [new DisciplinePrerequisite(Skill.Command, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
        ],
        [Skill.Conn]: [
            new TalentModel(
                "Fly-By",
                "Whenever you use the Swift Task Momentum Spend, you do not increase the Difficulty of the second Task if one of the Tasks you attempt is to pilot a vessel or vehicle.",
                [new DisciplinePrerequisite(Skill.Conn, 2)],
                1),
            new TalentModel(
                "Precise Evasion",
                "Whenever you succeed at the Evasive Action Task, you may spend two Momentum. If you do, the ship does not suffer the increased Difficulty for attacks normally caused by Evasive Action.",
                [new DisciplinePrerequisite(Skill.Conn, 4)],
                1),
            new TalentModel(
                "Push the Limits",
                "When you attempt a Conn Task that has increased in Difficulty due to environmental conditions or damage to the engines, reduce the Difficulty by 1, to a minimum of 1.",
                [new DisciplinePrerequisite(Skill.Conn, 4)],
                1),
            new TalentModel(
                "Starship Expert",
                "Whenever you succeed at a Conn Task to identify a type of starship, or to try and understand an unknown form of Starship, you gain one bonus Momentum, which may only be used on the Obtain Information Momentum Spend, or to pay part of the cost of the Create Advantage Momentum Spend (where the Advantage must represent some form of known or observed weakness in the ship being studied).",
                [new DisciplinePrerequisite(Skill.Conn, 3)],
                1),
            new TalentModel(
                "Attack Run",
                "A success in the Attack Pattern Task lets a character spend two Momentum. Enemy Attacks against the character’s ship do not reduce in Difficulty due to the Attack Pattern Task.",
                [new DisciplinePrerequisite(Skill.Conn, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Covering Advance",
                "A success at any Helm Task means two Momentum can be spent to block a single enemy vessel within Medium range, plus one additional enemy vessel for each additional Momentum spent beyond that (Repeatable). When a blocked vessel makes its next attack, before the beginning of the character’s next Turn, the Difficulty of any Attack that does not target your vessel has a base Difficulty equal to the character ship’s Scale, instead of normal Difficulty.",
                [new DisciplinePrerequisite(Skill.Conn, 3), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Efficient Evasion",
                "Attempting an Evasive Action Task for the second or subsequent time in a row during a scene reduces the Power Requirement for Evasive Action to 0.",
                [new DisciplinePrerequisite(Skill.Conn, 3), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Glancing Impact",
                "Succeeding at the Evasive Action Task increases the Resistance of the ship being piloted by +2. This bonus lasts until the start of the character’s next Turn.",
                [new DisciplinePrerequisite(Skill.Conn, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Inertia",
                "When the character succeeds at a Maneuver Task, 1 Momentum may be spent to move one additional zone so long as the previous Turn included an Impulse or Warp Task.",
                [new DisciplinePrerequisite(Skill.Conn, 3), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Multi-Tasking",
                "Attempting the Override Task while at a bridge station including Helm and/or Navigator positions utilizes the character’s Conn Discipline instead of the Discipline normally required for the Task.",
                [new DisciplinePrerequisite(Skill.Conn, 3), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Pathfinder",
                "When a character attempts a Task to plot a course through unknown territory, reduce the Difficulty of the Task by 1, 2, or 3, to a minimum of 1. Each point that reduces Difficulty increases the Complication Range of the Task.",
                [new DisciplinePrerequisite(Skill.Conn, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Precision Maneuvering",
                "Reduces the Difficulty of the Task by 1, to a minimum of 0, when attempting a Task that requires precise maneuvering, or where there is a collision risk.",
                [new DisciplinePrerequisite(Skill.Conn, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Spacewalk",
                "Whenever the Difficulty of a Task is increased thanks to low- or zero-gravity, ignore the increase. A Task that is normally possible but isn’t because of low- or zero-gravity, may be attempted at +1 Difficulty to the Task.",
                [new DisciplinePrerequisite(Skill.Conn, 3), new SourcePrerequisite(Source.CommandDivision)],
                1),
            new TalentModel(
                "Strafing Run",
                "When a character succeeds at the Attack Pattern Task and spends Momentum to keep the initiative, the cost to keep the initiative is 0.",
                [new DisciplinePrerequisite(Skill.Conn, 4), new SourcePrerequisite(Source.CommandDivision)],
                1),
        ],
        [Skill.Security]: [
            new TalentModel(
                "Close Protection",
                "When you make a successful Attack, you may spend one Momentum to protect a single ally within Close range. The next Attack against that ally before the start of your next turn increases in Difficulty by 1.",
                [new DisciplinePrerequisite(Skill.Security, 4)],
                1),
            new TalentModel(
                "Interrogation",
                "When you succeed at a Task to coerce someone to reveal information in a social conflict, you will gain one bonus Momentum, which may only be spent on the Obtain Information Momentum Spend.",
                [new DisciplinePrerequisite(Skill.Security, 3)],
                1),
            new TalentModel(
                "Mean Right Hook",
                "Your Unarmed Strike Attack has the Vicious 1 Damage Effect.",
                [],
                1, null, new AliasModel("Warrior's Strike", Source.KlingonCore)),
            new TalentModel(
                "Pack Tactics",
                "Whenever you assist another character during combat, the character you assisted gains one bonus Momentum if they succeed.",
                [],
                1),
            new TalentModel(
                "Quick to Action",
                "During the first round of any combat, you and your allies may ignore the normal cost to Retain the Initiative.",
                [new DisciplinePrerequisite(Skill.Security, 3)],
                1),
            new TalentModel(
                "Combat Medic",
                "The character’s abilities in field medicine and battle triage are exceptional and their presence inspires allies to continue any fight. Whenever the character attempts the First Aid Task, they may spend one Momentum to cause the recipient to regain points of Stress equal to the numaber of the character's Medicine Discipline. A character may only regain Stress in this way once per scene.",
                [new DisciplinePrerequisite(Skill.Security, 2), new DisciplinePrerequisite(Skill.Medicine, 2), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Criminal Minds",
                "By imagining they are a suspect, and thinking in the same way, the character gains insight into a criminal’s thought processes or actions. Whenever a character succeeds at a Task to interpret information about a suspect using Reason, a character generates 1 bonus Momentum which may only be used for the Obtain Information Momentum Spend.",
                [new DisciplinePrerequisite(Skill.Security, 3), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Crisis Management",
                "Small squad tactics can mean the difference between life and death in a dangerous, hostile situation, and the character excels at coordinating action in battle. The character may make use of the Direct Task (Star Trek Adventures core rulebook p. 173). If they already have access to the Direct Task, they may do so twice per scene instead of once.",
                [new VariableDisciplinePrerequisite(Skill.Security, Skill.Command, 3), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Deadeye Marksman",
                "The character has spent time at the target range every day, working on their aim. When the character takes the Aim Minor Action, they reduce the Difficulty of their next Attack by 1, in addition to the normal effects of the Aim Minor Action.",
                [new DisciplinePrerequisite(Skill.Security, 3), new AttributePrerequisite(Attribute.Control, 10), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Fire at Will",
                "The character is capable of tracking multiple targets and making attacks against them with great effect. Whenever the character makes a ranged weapon attack, and then uses the Swift Task Momentum spend to make a second ranged attack, they ignore the normal Difficulty increase from Swift Task.",
                [new DisciplinePrerequisite(Skill.Security, 2), new AttributePrerequisite(Attribute.Daring, 9), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Full Spread - Maximum Yield!",
                "The character is skilled in setting up torpedo attacks. In addition to the normal benefits of a Salvo, the attack also gains the benefit of the Devastating Attack Momentum Spend as though 2 Momentum had been spent. The Devastating Attack Momentum Spend may not be selected again for this attack.",
                [new DisciplinePrerequisite(Skill.Security, 3), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Hunker Down",
                "Making good use of the surroundings for protection is one of the hallmarks of a skilled soldier. Whenever the character rolls Cover Dice,  they may add +1 Resistance to the total for each Effect rolled.",
                [new DisciplinePrerequisite(Skill.Security, 2), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Lead Investigator",
                "The character has a mind intrigued by mystery and investigation, and is often called upon to review and coordinate response to lawbreaking. The character generates two bonus Momentum after a successful Task to investigate a crime.",
                [new DisciplinePrerequisite(Skill.Security, 3), new DisciplinePrerequisite(Skill.Conn, 2), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Martial Artist",
                "There are countless forms and styles of hand-to-hand combat, and the character has mastered several of them. The character’s Unarmed Strike attacks gain the Intense Damage Effect. If the character also has the Mean Right Hook Talent, then both Damage Effect apply when Effects are rolled.",
                [new DisciplinePrerequisite(Skill.Security, 4), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Precision Targeting",
                "Having extensive knowledge of ship systems and operations, the character can easily target specific systems when attacking an enemy vessel. When the character makes an attack that targets a specific System they may  reroll 1d20 in their dice pool, and the attack gains the Piercing 1 damage effect.",
                [new DisciplinePrerequisite(Skill.Security, 4), new DisciplinePrerequisite(Skill.Conn, 3), new SourcePrerequisite(Source.OperationsDivision)],
                1),
        ],
        [Skill.Engineering]: [
            new TalentModel(
                "A Little More Power",
                "Whenever you succeed at an Engineering Task aboard your own ship, you may spend one Momentum to regain one spent Power.",
                [new DisciplinePrerequisite(Skill.Engineering, 3)],
                1, null, new AliasModel("More Power", Source.KlingonCore)),
            new TalentModel(
                "I Know My Ship",
                "Whenever you attempt a Task to determine the source of a technical problem with your ship, add one bonus d20.",
                [new DisciplinePrerequisite(Skill.Engineering, 4)],
                1),
            new TalentModel(
                "In the Nick of Time",
                "Whenever you succeed at an Engineering or Science Task as part of an Extended Task, you score 1 additional Work for every Effect rolled.",
                [new VariableDisciplinePrerequisite(Skill.Engineering, Skill.Science, 3)],
                1),
            new TalentModel(
                "Intense Scrutiny",
                "Whenever you succeed at a Task using Reason or Control as part of an Extended Task, you may ignore up to two Resistance for every Effect rolled.",
                [new VariableDisciplinePrerequisite(Skill.Engineering, Skill.Science, 3)],
                1),
            new TalentModel(
                "Jury-Rig",
                "Whenever you attempt an Engineering Task to perform repairs, you may reduce the Difficulty by two, to a minimum of 0. If you do this, however, then the repairs are only temporary and will last only a single scene, plus one additional scene per Momentum spent (Repeatable) before they fail again. Jury-rigged repairs can only be applied once, and the Difficulty to repair a device that has been Jury-rigged increases by 1.",
                [new DisciplinePrerequisite(Skill.Engineering, 4)],
                1),
            new TalentModel(
                "Experimental Device",
                "You have designed and constructed a new piece of equipment that is either a brand new invention or is heavily modified from its original to the point of being barely recognizable. In either case, the device performs a function that you determine when you select this Talent. When used appropriately, it automatically provides you an Advantage. However, its experimental nature means there are lingering design bugs that sometimes plagues its function. Increase the Complication Range of any Task by 2 when using this device. This Talent may be selected multiple times with a different device for each selection.",
                [new DisciplinePrerequisite(Skill.Engineering, 4), new SourcePrerequisite(Source.OperationsDivision)],
                10),
            new TalentModel(
                "Exploit Engineering Flaw",
                "Following an ally’s successful Scan for Weakness Task,  you may highlight an identified engineering flaw in the opponent’s ship. In addition to the bonus granted by the Scan for Weakness Task, you may assist anyone making an Attack against the target ship, which does not count against the normal limit for providing assistance. If the Attack is successful, it generates 1 bonus Momentum. You must be able to communicate with the ally making the Attack to offer this assistance.",
                [new DisciplinePrerequisite(Skill.Engineering, 3), new DisciplinePrerequisite(Skill.Conn, 3), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Maintenance Specialist",
                "You are an expert in conducting and directing normal, dayto-day, maintenance and repairs on Starfleet equipment. Whenever they are required to perform maintenance, reduce the Difficulty by 1, to a minimum of 1, and halve the time required to complete the Task.",
                [new DisciplinePrerequisite(Skill.Engineering, 3), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Meticulous",
                "You are patient, methodical, and check for errors before considering Tasks complete. Whenever they use Engineering to complete a Task, you may negate one Complication generated from the roll. However, during timed Tasks or Challenges, you take 1 more interval to complete the Task.",
                [new DisciplinePrerequisite(Skill.Engineering, 3), new AttributePrerequisite(Attribute.Control, 10), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Miracle Worker",
                "You have a reputation of doing the impossible: repairs or modifications well in advance of expectations; getting offline systems up and running when most needed and so on. Whenever you use Engineering on an Extended Task, if you achieve a Breakthrough and roll at least one Effect on a Challenge Die, you achieve a second Breakthrough.",
                [new DisciplinePrerequisite(Skill.Engineering, 5), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Procedural Compliance",
                "You are well versed in established Starfleet engineering practices and guidelines. By spending 2 Momentum to Create an Advantage (obtaining the proper technical manuals and documentation prior to attempting a Task to work on a ship’s system), you may reroll 1d20 during the next Engineering Task.",
                [new DisciplinePrerequisite(Skill.Engineering, 3), new DisciplinePrerequisite(Skill.Conn, 2), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Past the Redline",
                "Engineers understand that safety tolerances and operating margins are always designed into the acceptable performance range of equipment. While not recommended the equipment is usually capable of higher performance, if the consequences are risky. This Talent provides bonus Momentum for using a ship’s System until the end of the scene. Select the System you wish to enhance, and the number of bonus Momentum to be provided. Attempt a Daring + Engineering Task with a Difficulty equal to the bonus Momentum selected. If the you succeed, subsequent Tasks using that System automatically generate that amount of bonus Momentum. However, to represent the risks involved, the Task also increases its Complication Range by the same number as the Bonus Momentum provided. If a Complication is rolled, the System no longer provides bonus Momentum and the System suffers a number of Breaches equal to half the ship's Scale.",
                [new DisciplinePrerequisite(Skill.Engineering, 4), new AttributePrerequisite(Attribute.Daring, 10), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Repair Team Leader",
                "You are trained to direct and lead damage repair parties during emergencies, giving them guidance and expert knowledge of the ships systems. If you succeed at the Damage Control Task you may spend 3 Momentum (Repeatable) to also repair one Breach.",
                [new DisciplinePrerequisite(Skill.Engineering, 3), new DisciplinePrerequisite(Skill.Command, 2), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Right Tool for the Right Job",
                "Engineers are trained to identify and use appropriate tools whenever they are working on the delicate components that make up complex ship systems. Whenever you acquire an engineering tool with an Opportunity Cost, the tool grants an Advantage if it did not do so originally, or increases the Advantage it provides by one step.",
                [new DisciplinePrerequisite(Skill.Engineering, 3), new SourcePrerequisite(Source.OperationsDivision)],
                1),
            new TalentModel(
                "Rocks Into Replicators",
                "Starfleet engineers are famed for being able to build or create nearly anything needed from the most basic of available components. Once per session, you may destroy any single piece of equipment to create any other piece of equipment of an equal or lower Opportunity Cost. This new piece of equipment has a Complication range increase of 2, with the Complication being a malfunction that renders it useless. You should provide a reasonable explanation as to how a repurposed or cannibalized device could function and the Gamemaster has final say if there is any question about the “reasonableness” of the new device.",
                [new DisciplinePrerequisite(Skill.Engineering, 4), new DisciplinePrerequisite(Skill.Science, 2), new SourcePrerequisite(Source.OperationsDivision)],
                1),
        ],
        [Skill.Science]: [
            new TalentModel(
                "Computer Expertise",
                "Whenever you attempt a Task that involves the programming or study of a computer system, you may add a bonus d20 to your pool.",
                [new DisciplinePrerequisite(Skill.Science, 2)],
                1),
            new TalentModel(
                "Testing a Theory",
                "When you attempt a Task using Engineering or Science, you may roll one additional d20, so long as you succeeded at a previous Task covering the same scientific or technological field earlier in the same adventure.",
                [new VariableDisciplinePrerequisite(Skill.Science, Skill.Engineering, 2)],
                1),
            new TalentModel(
                "Baffling Briefing",
                "When the character engages in a Social Conflict using deception, the character may use Science in place of Command so long as their technical knowledge is used to mislead their opponent. ",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 3), new AttributePrerequisite(Attribute.Presence, 9)],
                1),
            new TalentModel(
                "Dedicated Focus X",
                "Choose a Focus your character has. When attempting a Task where that Focus applies, each d20 that generates 2 successes also generates  1 bonus Momentum. This Talent only applies to d20s in the character’s dice pool, and does not apply to d20s added due to equipment, starship assistance, or character assistance.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 4)],
                1),
            new TalentModel(
                "Expedition Expert",
                "Prior to participating in an away team mission, the character may prepare by conducting a research Task. If they succeed, Momentum may be spent to allow the character to substitute their Science Discipline in place of any other, during any Task to navigate or transverse difficult terrain during the mission. Each point of Momentum spent from the research Task in this way allows for one such substitution.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 3), new AttributePrerequisite(Attribute.Fitness, 9)],
                1),
            new TalentModel(
                "Lab Rat",
                "The character prefers to spend most of their free time engaged in various side projects and experiments. Because of this, they are extremely familiar with the equipment and capabilities of the labs on board their ship. When attempting an Extended Task while using a laboratory, the character gains the Progression 1 Effect.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 3), new DisciplinePrerequisite(Skill.Engineering, 3)],
                1),
            new TalentModel(
                "Mental Repository",
                "Using extensive mental conditioning, the character has access to memories with unprecedented clarity and accuracy. So long as the character takes time to focus their mind prior to attempting a Task – which takes 2 Intervals during a Timed Challenge – they reduce the Difficulty of the Task by 1 to a minimum of 1. In addition, if they succeed they gain a bonus Momentum which may only be spent on the Obtain Information Momentum spend.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 3), new AttributePrerequisite(Attribute.Reason, 10)],
                1),
            new TalentModel(
                "Rapid Analysis",
                "Tasks attempted as part of a Timed Challenge using the Science Discipline takes the character 1 Time Interval instead of 2. The amount of time taken for any Task may not be reduced to less than 1 Interval.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 3), new AttributePrerequisite(Attribute.Daring, 9)],
                1),
            new TalentModel(
                "Student of War",
                "The character has conducted extensive research into numerous kinds of conflict and has devoted their academic career to the study of war. While this knowledge may be purely theoretical, such information, when placed into the hands of more capable combatants, can be truly devastating. When the character provides assistance to a Combat Task, they may reroll their die.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 4), new DisciplinePrerequisite(Skill.Security, 3)],
                1),
            new TalentModel(
                "Temporal Mechanic",
                "Long study into the facets of temporal mechanics has given the character an intuitive understanding of the space-time continuum and the various phenomena that can distort it. Once per scene, when confronted with an anomaly that affects the flow of time and space, the character rolls 1 CD when attempting a Task relating to the phenomenon. The character generates bonus Momentum equal to the result, in addition to any Momentum generated from the Task result. If an Effect is rolled, the Gamemaster gains 1 Threat instead.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 3), new FocusPrerequisite("Temporal Mechanics")],
                1),
            new TalentModel(
                "Theory Into Practice",
                "When you attempt a Task using Engineering or Science where you gain the additional d20 from the Testing a  Theory Talent, reduce the Difficulty of the Task by 1, to a minimum of 0.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 3), new TalentPrerequisite("Testing a Theory")],
                1),
            new TalentModel(
                "Unconventional Thinking",
                "During any Challenge or Extended Task that uses the Scientific Method to adapt technology in which the character is participating, if the hypothesis being pursued is considered “Outside the Box” – the Difficulty of the Tasks are reduced by 1. It should be noted that Players are not aware of the fact they are pursuing an “Outside the Box” hypothesis under normal circumstances – it is up to the Gamemaster to ensure they receive the proper Difficulty reduction.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 3), new AttributePrerequisite(Attribute.Insight, 9)],
                1),
            new TalentModel(
                "Walking Encyclopedia",
                "Once per session, when you attempt a Task, you may spend 2 Momentum (Immediate) in order to gain an additional Focus for the remainder of the session, due to your breadth of knowledge. However, any Task using that Focus increases in Complication range by 1, as you are not a true expert on that subject.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Science, 2), new AttributePrerequisite(Attribute.Reason, 9)],
                1),
        ],
        [Skill.Medicine]: [
            new TalentModel(
                "Doctor's Orders",
                "When you attempt a Task to coordinate others, or to coerce someone into taking or refraining from a specific course of action, you may use your Medicine Discipline instead of Command.",
                [new DisciplinePrerequisite(Skill.Medicine, 4)],
                1),
            new TalentModel(
                "Field Medicine",
                "When attempting a Medicine Task, you may ignore any increase in Difficulty for working without the proper tools or equipment.",
                [],
                1),
            new TalentModel(
                "First Response",
                "Whenever you attempt the First Aid Task during combat, you gain a bonus d20. Further, you may always Succeed at a Cost, with each Complication you suffer adding +1 to the Difficulty of healing the patient’s Injury subsequently.",
                [new DisciplinePrerequisite(Skill.Medicine, 3)],
                1),
            new TalentModel(
                "Quick Study",
                "When attempting a Task that will involve an unfamiliar medical procedure, or which is to treat an unfamiliar species, ignore any Difficulty increase stemming from your unfamiliarity.",
                [new DisciplinePrerequisite(Skill.Medicine, 3)],
                1),
            new TalentModel(
                "Triage",
                "When you attempt a Task to identify specific injuries or illnesses, or to determine the severity of a patient’s condition, you may spend one Momentum (Repeatable) to diagnose one additional patient.",
                [new DisciplinePrerequisite(Skill.Medicine, 3)],
                1),
            new TalentModel(
                "Bedside Manner",
                "When the character succeeds at a Medicine Task to heal another’s Injury, the character may immediately remove a personal Complication from the patient, even if that Complication was unrelated to the treated Injury. In addition, whenever this character attempts a Reputation Check, they are considered to have one additional positive influence.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new DisciplinePrerequisite(Skill.Command, 3)],
                1),
            new TalentModel(
                "Chief of Staff",
                "When using the Medicine Discipline to provide  assistance to another character attempting a Medicine Task, all characters providing assistance may reroll one d20 in their dice pool.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new DisciplinePrerequisite(Skill.Command, 3)],
                1),
            new TalentModel(
                "Cyberneticist",
                "Whenever the character attempts a Task to work on, install, or remove a cybernetic device from a patient, they add a d20 to their dice pool. ",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new DisciplinePrerequisite(Skill.Engineering, 3)],
                1),
            new TalentModel(
                "Fellowship Specialty",
                "Select a Focus. When you succeed at a Medicine Task where that Focus applies, the cost of the Create Advantage Momentum spend is reduced by 1, to a minimum of 1.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 4)],
                1),
            new TalentModel(
                "Field Medic",
                "Through experience and training, the stress of battle fades when there’s a patient in need. When attempting a Medicine Task while in the midst of combat, you may ignore the first Complication that would increase the Difficulty of this Task.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new DisciplinePrerequisite(Skill.Security, 2)],
                1),
            new TalentModel(
                "Healing Hands",
                "When attempting the Control + Medicine Task to heal  Injury-related Complications, reduce the Difficulty by 1, to a minimum of 1.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new AttributePrerequisite(Attribute.Control, 9)],
                1),
            new TalentModel(
                "Heart, Body and Mind",
                "Whenever you Assist a character with the Recover Combat Task, you gain 1 bonus Momentum that can only be spent on the active character to recover Stress.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new DisciplinePrerequisite(Skill.Command, 2)],
                1),
            new TalentModel(
                "I'm a Doctor, Not a Starship Captain!",
                "Once per scene, before attempting a Task using Command, a point of Determination may be spent to substitute the character’s Medicine Score in place of Command. This does not have to be linked to a Value.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new UntrainedDisciplinePrerequisite(Skill.Command)],
                1),
            new TalentModel(
                "I'm a Doctor, Not a Damn Pilot!",
                "Once per scene, before attempting a Task using Conn, a point of Determination may be spent to substitute the character’s Medicine Score in place of Conn. This does not have to be linked to a Value.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new UntrainedDisciplinePrerequisite(Skill.Conn)],
                1),
            new TalentModel(
                "I'm a Doctor, Not an Engineer!",
                "Once per scene, before attempting a Task using Engineering, a point of Determination may be spent to substitute the character’s Medicine Score in place of Engineering. This does not have to be linked to a Value.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new UntrainedDisciplinePrerequisite(Skill.Engineering)],
                1),
            new TalentModel(
                "I'm a Doctor, Not a Scientist!",
                "Once per scene, before attempting a Task using Science, a point of Determination may be spent to substitute the character’s Medicine Score in place of Science. This does not have to be linked to a Value.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new UntrainedDisciplinePrerequisite(Skill.Science)],
                1),
            new TalentModel(
                "I'm a Doctor, Not the Chief of Security!",
                "Once per scene, before attempting a Task using Security, a point of Determination may be spent to substitute the character’s Medicine Score in place of Security. This does not have to be linked to a Value.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new UntrainedDisciplinePrerequisite(Skill.Security)],
                1),
            new TalentModel(
                "Insightful Guidance",
                "Whenever you Assist a character, who is in a Social Conflict, using your knowledge of psychology or emotional states, that character is considered to have an Advantage in addition to the normal benefits provided by your Assist. ",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new DisciplinePrerequisite(Skill.Command, 2)],
                1),
            new TalentModel(
                "Practice Makes Perfect",
                "Once per scene, after the character has succeeded on a Medicine Task relating to the treatment of a patient, reduce the Difficulty of the next Medicine Task relating to that patient by 1.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3), new AttributePrerequisite(Attribute.Reason, 8)],
                1),
            new TalentModel(
                "Psychoanalyst",
                "When you use the Medicine Discipline during a Social Conflict you may increase the Complication range of your Task by a number of steps. For each step you may ask a single question as if you’d spent Momentum on Obtain Information. Any Complications generated from this Task results in the individual you are interacting with becoming offended or upset with being “analyzed.”",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 3)],
                1),
            new TalentModel(
                "Surgery Savant",
                "When attempting a Medicine Task during an Extended Task relating to surgery, the character gains the Triumphant Effect.",
                [new SourcePrerequisite(Source.SciencesDivision), new DisciplinePrerequisite(Skill.Medicine, 4)],
                1),
        ],
        [Skill.None]: [
            // Species
            new TalentModel(
                "Proud and Honorable",
                "Your personal integrity is unimpeachable, and you will not willingly break a promise made. Whenever you attempt a Task to resist being coerced into breaking a promise, betraying your allies, or otherwise acting dishonorably, you reduce the Difficulty by 1.",
                [new SpeciesPrerequisite(0, true), new EraPrerequisite(Era.Enterprise)],
                1,
                "Andorian"),
            new TalentModel(
                "The Ushaan",
                "You are experienced in the tradition of honor-dueling known as the Ushaan, having spilt much blood upon the ice. When you make a melee Attack, or are targeted by a melee Attack, and buy one or more d20s by adding to Threat, you may re-roll the dice pool for the Task. Further, you own an Ushaan-tor, a razor-sharp ice-miner’s tool used in these duels.",
                [new SpeciesPrerequisite(0, true), new EraPrerequisite(Era.Enterprise)],
                1,
                "Andorian"),
            new TalentModel(
                "Orb Experience",
                "You have received a vision from the Bajoran Prophets, through one of the Orbs. This rare experience, though confusing at first, has shaped your life and outlook. You have one additional Value, reflecting the insights you received from the experience. The first time this Value is Challenged, roll 1[D]; if an Effect is rolled, then some foretold element of the Orb Experience has come to pass, and the Value is not crossed out as it would normally be.",
                [new SpeciesPrerequisite(1, true), new EraPrerequisite(Era.NextGeneration)],
                1,
                "Bajoran"),
            new TalentModel(
                "Strong Pagh",
                "You believe profoundly in the Prophets, and rely heavily upon that faith to see you through hardship. Whenever you attempt a Task to resist being coerced or threatened, you reduce the Difficulty of that Task by 1.",
                [new SpeciesPrerequisite(1, true), new EraPrerequisite(Era.NextGeneration)],
                1,
                "Bajoran"),
            new TalentModel(
                "Empath",
                "You can sense the emotions of most living beings nearby, and can communicate telepathically with other empaths and telepaths, as well as those with whom you are extremely familiar. You cannot choose not to sense the emotions of those nearby, except for those who are resistant to telepathy. It may require effort and a Task to pick out the emotions of a specific individual in a crowd, or to block out the emotions of those nearby. Increase the Difficulty of this Task if the situation is stressful, if there are a lot of beings present, if the target has resistance to telepathy, and other relevant factors.",
                [new SpeciesPrerequisite(2, true), new EraPrerequisite(Era.NextGeneration)],
                1,
                "Betazoid"),
            new TalentModel(
                "Telepath",
                "You can sense the surface thoughts and emotions of most living beings nearby, and can communicate telepathically with other empaths and telepaths, as well as those with whom you are extremely familiar. Surface thoughts are whatever a creature is thinking about at that precise moment. The character cannot choose not to sense the emotions or read the surface thoughts of those nearby, except for those who are resistant to telepathy. It will require effort and a Task to pick out the emotions or thoughts of a specific individual in a crowd, to search a creature’s mind for specific thoughts or memories, or to block out the minds of those nearby. Unwilling targets may resist with an Opposed Task.",
                [new PureSpeciesPrerequisite(2, true), new EraPrerequisite(Era.NextGeneration)],
                1,
                "Betazoid"),
            new TalentModel(
                "Cultural Flexibility",
                "Your people are friendly, patient, and inquisitive, and you exemplify these traits. You are at ease when meeting new cultures, and adapt to unfamiliar social structures easily. When you attempt a Task to learn about an unfamiliar culture, or to act in an appropriate manner when interacting with members of such a culture, you reduce the Difficulty by 1.",
                [new SpeciesPrerequisite(3, true), new EraPrerequisite(Era.Enterprise)],
                1,
                "Denobulan"),
            new TalentModel(
                "Parent Figure",
                "You have a large family, with many children, nieces, and nephews, and you’ve learned how to coordinate even the most unruly and fractious of groups when necessary. When attempting or assisting a Task, and two or more other characters are involved in the Task, the first Complication generated on the Task — either by the character attempting the Task, or one of the assistants — may be ignored.",
                [new SpeciesPrerequisite(3, true), new EraPrerequisite(Era.Enterprise)],
                1,
                "Denobulan"),
            new TalentModel(
                "Resolute",
                "You are indomitable, and unwilling to succumb to adversity. You increase your maximum Stress by 3.",
                [new SpeciesPrerequisite(4, true), new EraPrerequisite(Era.Enterprise)],
                1,
                "Human"),
            new TalentModel(
                "Spirit of Discovery",
                "You have the drive, spirit, and courage to voyage into the unknown. You may spend one Determination to add three points to the group Momentum pool. The normal conditions for spending Determination still apply.",
                [new SpeciesPrerequisite(4, true), new EraPrerequisite(Era.Enterprise)],
                1,
                "Human"),
            new TalentModel(
                "Incisive Scrutiny",
                "You have a knack for finding weak spots in arguments, theories, and machines alike to glean information from them, learning about things by how they respond to pressure against vulnerable points. When you succeed at a Task using Control or Insight, you gain one bonus Momentum, which may only be used for the Obtain Information Momentum Spend.",
                [new SpeciesPrerequisite(5, true), new EraPrerequisite(Era.Enterprise)],
                1,
                "Tellarite"),
            new TalentModel(
                "Sturdy",
                "You have a blend of physical resilience and mental fortitude such that you’re difficult to subdue. You reduce the cost to resist being knocked prone by the Knockdown damage effect by one, to a minimum of 0, and gain +1 Resistance against all non-lethal attacks.",
                [new SpeciesPrerequisite(5, false), new EraPrerequisite(Era.Enterprise)],
                1,
                "Tellarite"),
            new TalentModel(
                "Former Initiate",
                "You joined the Initiate Program, hoping to be chosen by the Symbiosis Commission to become Joined. As there are far more Initiates than there are Symbionts, you were one of the many who failed, but the quality of even a failed initiate is enough for Starfleet to recruit you. When you attempt a Task using Control or Reason, and spend Determination to buy a bonus d20 for that Task, you may re-roll your dice pool. Former Initiate cannot be taken if the character has the Joined Talent — they are mutually exclusive.",
                [new SpeciesPrerequisite(6, false), new NotTalentPrerequisite("Joined"), new EraPrerequisite(Era.OriginalSeries)],
                1,
                "Trill"),
            new TalentModel(
                "Joined",
                "You have a symbiont, with lifetimes of memories to draw upon. Once per mission, you may declare that a former host had expertise in a relevant skill or field of study; you gain a single Focus for the remainder of the scene, as you draw upon those memories. Additionally, you gain a Trait with the name of the Symbiont; this reflects potential advantages of the Joining, the ability to perform rites and rituals to awaken past hosts’ memories, and the vulnerabilities inherent in the connection. Former Initiate cannot be taken if the character has the Joined Talent — they are mutually exclusive.",
                [new SpeciesPrerequisite(6, false), new NotTalentPrerequisite("Former Initiate"), new EraPrerequisite(Era.OriginalSeries)],
                1,
                "Trill"),
            new TalentModel(
                "Kolinahr",
                "You have undergone the ritual journey to purge all emotion. You reduce the Difficulty of all Tasks to resist coercion, mental intrusion, pain, and other mental attacks by two.",
                [new SpeciesPrerequisite(7, true), new EraPrerequisite(Era.Enterprise)],
                1,
                "Vulcan"),
            new TalentModel(
                "Mind-Meld",
                "You have undergone training in telepathic techniques that allow the melding of minds through physical contact. This will always require a Task with a Difficulty of at least 1, which can be opposed by an unwilling participant. If successful, you link minds with the participant, sharing thoughts and memories; Momentum may be spent to gain more information, or perform deeper telepathic exchanges. This link goes both ways, and it is a tiring and potentially hazardous process for you. Complications can result in pain, disorientation, or lingering emotional or behavioral difficulties.",
                [new SpeciesPrerequisite(7, false), new EraPrerequisite(Era.Enterprise)],
                1,
                "Vulcan"),
            new TalentModel(
                "Nerve Pinch",
                "You have learned numerous techniques for the stimulation and control of nerve impulses — collectively called neuropressure. Some applications of neuropressure can be used to swiftly and non-lethally incapacitate assailants. The nerve pinch counts as a melee weapon with 1[D], Size 1H, and the Intense and Non-lethal qualities. You may use Science or Medicine instead of Security when attempting a nerve pinch Attack, and may increase damage by your Science or Medicine Discipline instead of Security.",
                [new SpeciesPrerequisite(7, true), new EraPrerequisite(Era.Enterprise)],
                1,
                "Vulcan"),
            new TalentModel(
                "Above the Clouds",
                "While engaged in Social conflict in a lavish environment (or one of excess), you reduce the Difficulty of any Persuade Tasks by 1 to a minimum of 1.",
                [new SpeciesPrerequisite(15, true), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Ardanan"),
            new TalentModel(
                "Zenite in the Soul",
                "Your ancestry is steeped in toil in the mines on Ardana’s surface and, you roll one additional d20 whenever using Engineering or Science in relation to geology, mining or  mine equipment.",
                [new SpeciesPrerequisite(15, true), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Ardanan"),
            new TalentModel(
                "Meticulous Analysis",
                "When you encounter unidentified phenomena through sensors, you may immediately make a Swift Task, without the need to spend Momentum or an increase in Difficulty. This Task may only be used to attempt to analyze the preliminary data you have received using Reason + Science and a relevant Focus.",
                [new SpeciesPrerequisite(16, true), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Benzite"),
            new TalentModel(
                "All Fingers and Thumbs",
                "When you succeed at a Task using a computer console (including a bridge station), you gain one bonus Momentum. This bonus Momentum cannot be saved into the group pool.",
                [new SpeciesPrerequisite(16, false), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Benzite"),
            new TalentModel(
                "Warm Welcome",
                "A cheerful, outgoing personality is the perfect thing to put diplomatic guests at ease. Whenever assisting another character the Bolian may use their Presence Attribute instead of their own. Further, both the Bolian and the character being assisted may ignore any increases in Complication Range for the Task.",
                [new SpeciesPrerequisite(17, true), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Bolian"),
            new TalentModel(
                "Born Near a Warp Core",
                "Bolian traditions say that a child born near an active Warp Core has an improved, more positive, disposition. Optimism and an upbeat attitude certainly lends credence to this tradition, allowing the Bolian to weather misfortune. When they suffer a Complication from a Task, roll 1[CD]; if the result is an Effect, the Complication is ignored. Once a Complication has been ignored in this way, the Bolian may not ignore another Complication for the remainder of the scene.",
                [new SpeciesPrerequisite(17, true), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Bolian"),
            new TalentModel(
                "Deltan Pheromones",
                "The character excretes a natural aphrodisiac pheromone. Whenever they attempt a Task using Presence to influence an attracted creature, they gain one bonus d20. However, they also increase their Complication Range  by 2, as the effect can be distracting or lead to unwanted consequences. This talent can be switched off, losing both the bonus and the drawback, by applying chemical suppressants.",
                [new SpeciesPrerequisite(18, false), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Deltan"),
            new TalentModel(
                "Empath",
                "The Deltan can sense the emotions of most nearby living beings, and can communicate telepathically with other empaths and telepaths, as well as those with whom they are extremely familiar. Not sensing the nearby emotions is impossible, except for those who are resistant to telepathy. It may require serious effort and a Task to pick out the emotions of a specific individual in a crowd, or to block out the emotions of those nearby. Increase the Difficulty of this Task if the situation is stressful, if there are a lot of beings present, if the target has resistance to telepathy, or if the Gamemaster decides there are other relevant factors.",
                [new SpeciesPrerequisite(18, true), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Deltan"),
            new TalentModel(
                "Visual Spectrum",
                "An Efrosian can see beyond what others think of as the visual spectrum, from some infra-red to ultra-violet light. Any Tasks in which detecting those parts of the spectrum is useful reduce in Difficulty by 1. Circumstances, such as low light levels, do not affect the Difficulty of Tasks, as long as those Tasks do not relate to perceiving minutiae of a subject.",
                [new SpeciesPrerequisite(19, false), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Efrosian"),
            new TalentModel(
                "Oral Scholar",
                "Efrosians are taught and learn through oral practices or ‘by rote’.  Any Obtain Information Momentum spends that relate to their own knowledge using Reason or Insight may ask one additional question, for free, in addition to those bought with Momentum.",
                [new SpeciesPrerequisite(19, true), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Efrosian"),
            new TalentModel(
                "To Battle!",
                "Whenever a Klingon buys additional dice for a melee attack using Threat, for each Threat added to the pool, you gain 1 bonus Momentum that can only be spent on Bonus Damage, increasing the damage of the attack by 1 per Momentum spent.",
                [new AnySpeciesPrerequisite(20, 71, true), new AnyOfPrerequisite(new CharacterTypePrerequisite(CharacterType.KlingonWarrior), new EraPrerequisite(Era.NextGeneration)), new SourcePrerequisite(Source.BetaQuadrant, Source.KlingonCore)],
                1,
                "Klingon"),
            new TalentModel(
                "Brak'lul",
                "Various physiological redundancies mean that wounds that would kill other humanoid species don’t affect Klingons as badly. The character gains +2 Resistance against all Non-lethal attacks. In addition, whenever the Klingon is target of a First Aid Task, reduce the Difficulty of that Task by 1, to a minimum of 1.",
                [new SpeciesPrerequisite(20, false), new AnyOfPrerequisite(new CharacterTypePrerequisite(CharacterType.KlingonWarrior), new EraPrerequisite(Era.NextGeneration)), new SourcePrerequisite(Source.BetaQuadrant, Source.KlingonCore)],
                1,
                "Klingon"),
            new TalentModel(
                "R'uustai",
                "This Klingon has lit candles, spoken words to honor their parents, and given their house’s sash to another, joining in a fellowship with another person, and becoming members of the same house (the original house of either party). The R’uustai Talent grants a Klingon an additional Value, which must reflect their relationship with the ritual sibling. In addition, whenever the Klingon assists, or is assisted by another, the character offering assistance may re-roll their die.",
                [new AnySpeciesPrerequisite(20, 71, true), new AnyOfPrerequisite(new CharacterTypePrerequisite(CharacterType.KlingonWarrior), new EraPrerequisite(Era.NextGeneration)), new SourcePrerequisite(Source.BetaQuadrant, Source.KlingonCore)],
                1,
                "Klingon"),
            new TalentModel(
                "Killer's Instinct",
                "You have shed blood, and will not hesitate to do so again. So familiar are you with the intent to kill that you can even see it in others when you look them in the eyes. When you choose to make a lethal attack, you do not add to Threat for doing so. In addition, whenever an enemy you can see attempts to make a lethal attack against you, you may add 1 to Threat to increase the Difficulty of their attack by 1, as you react to their intent.",
                [new AnySpeciesPrerequisite(20, 71, true), new AnyOfPrerequisite(new CharacterTypePrerequisite(CharacterType.KlingonWarrior), new EraPrerequisite(Era.NextGeneration)), new SourcePrerequisite(Source.KlingonCore)],
                1,
                "Klingon"),
            new TalentModel(
                "Warrior's Spirit",
                "You are an exemplar of what it means to be a Klingon warrior, and you will not hesitate to demonstrate your prowess to any who challenge you. When you make a melee attack, or are targeted by a melee attack, and you buy one or more d20s by adding to Threat, you may re-roll the dice pool for the task. Further, you own either a mek'leth or a bat'leth, at your discretion, and do not have to pay an Opportunity Cost to acquire it.",
                [new AnySpeciesPrerequisite(20, 71, true), new AnyOfPrerequisite(new CharacterTypePrerequisite(CharacterType.KlingonWarrior), new EraPrerequisite(Era.NextGeneration)), new SourcePrerequisite(Source.KlingonCore)],
                1,
                "Klingon"),
            new TalentModel(
                "Chelon Shell",
                "The hard shell extending over a Chelon’s body provides added protection from physical and radioactive threats. This natural armor gives the character a Resistance of 1. They may also ignore any Complications from radiation sources.",
                [new SpeciesPrerequisite(21, false), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Rigellian Chelon"),
            new TalentModel(
                "Toxic Claws",
                "In times of danger Chelons excrete a contact toxin onto their claws that can be used to debilitate foes. Their Unarmed Strike is replaced with a melee attack Claw Strike (Melee, 1[CD], Piercing 1, Debilitating, Non-lethal).",
                [new SpeciesPrerequisite(21, false), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Rigellian Chelon"),
            new TalentModel(
                "Exosex",
                "The character possess a Z chromosome that strengthens their physical and survival instincts and abilities. Whenever attempting a Task using Fitness or Daring, roll 1 additional d20 and gain one bonus Momentum on such Tasks.",
                [new SpeciesPrerequisite(22, false), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Rigellian Jelna"),
            new TalentModel(
                "Industrious Mind",
                "The Jelna are naturally enterprising and industrious, and have an affinity for technological developments and industrial engineering. When succeeding an Engineering or Science Task relating to fixing or adapting technology, and spending 2 or more Momentum, a Jelna may add an Advantage related to that technology for free.",
                [new SpeciesPrerequisite(22, true), new EraPrerequisite(Era.OriginalSeries), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Rigellian Jelna"),
            new TalentModel(
                "Peaceful Existence",
                "Your upbringing in a peaceful society, one that promotes harmony and has an outright ban on weapons, has developed the Risian ability for peaceful resolutions. Whenever a Risian attempts a Task to dissuade another individual or group from resorting to conflict, they reduce the Difficulty of that Task by 1.",
                [new SpeciesPrerequisite(23, true), new EraPrerequisite(Era.Enterprise), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Risian"),
            new TalentModel(
                "Open and Insightful",
                "Risian open, and often frank, discussion of problems and personal opinion enables conversation and understanding when working in a team. Whenever a Risian assists another character using Insight or Reason they may re-roll a single d20 in their dice pool. In addition, if the lead character succeeds in the Task using Insight or Reason, they gain 1 bonus Momentum.",
                [new SpeciesPrerequisite(23, true), new EraPrerequisite(Era.Enterprise), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Risian"),
            new TalentModel(
                "Calm Under Pressure",
                "Arboreals possess an unwaveringly calm nature, allowing them to ignore the stress of a crisis. When attempting Tasks with Control to resist stress or mental affliction they may reroll one die in your pool.",
                [new SpeciesPrerequisite(24, true), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Xindi-Arboreal"),
            new TalentModel(
                "A Mind for Design",
                "Xindi-Primates are natural engineers and scientists, pushing at the frontiers of design and construction. When following the Scientific Method, they may suggest an additional Focus, which they do not have to possess, as ‘The Good Way’. Every Task they attempt in an Extended Task related to the Scientific Method automatically gains the Piercing 1 effect.",
                [new SpeciesPrerequisite(25, true), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Xindi-Primate"),
            new TalentModel(
                "Stun Resistance",
                "Reptillians are naturally resistant to energy weapons stun settings. They gain +1 Resistance against Non-lethal attacks from energy weapons. They may always Avoid an Injury from a Non-lethal attack with a cost of 1 Momentum (Immediate), even if they have already Avoided an Injury during the scene.",
                [new SpeciesPrerequisite(26, false), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Xindi-Reptilian"),
            new TalentModel(
                "Protective Instinct",
                "Insectoids have a profound instinct to defend your eggs and their off-spring, and this transfers onto teams or groups with which they develop a close bond. Whenever an Insectoid attempts a Guard Task in combat, and confers the benefits to another Main Character, ignore the increase in Difficulty when attempting the Task.",
                [new SpeciesPrerequisite(27, false), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Xindi-Insectoid"),
            new TalentModel(
                "Tactical Voice",
                "In command positions, the speed of Zakdorn tactical calculations enables them to give concise orders to their crew. During combat, a Zakdorn leader may use the Direct Task one additional time per scene (so, twice per scene overall). Further, when they use the Swift Task Momentum Spend for an extra Task, the cost is reduced to 1 Momentum, so long as the second Task is the Assist or Direct Task.",
                [new SpeciesPrerequisite(28, true), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Zakdorn"),
            new TalentModel(
                "Master Strategist",
                "Zakdorn strategic sense is unparalleled in contemporary military theory. Whenever a Zakdorn attempts a Task to Create an Advantage related to strategy or tactics (as opposed to spending Momentum), reduce the Difficulty by 1.",
                [new SpeciesPrerequisite(28, true), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.BetaQuadrant)],
                1,
                "Zakdorn"),
            new TalentModel(
                "Morphogenic Matrix",
                " The character may spend 1 Momentum as a Minor Action once per Turn to assume a different form, gaining an additional Trait to reflect whatever form they have chosen, though they cannot yet mimic an individual, and they must return to a liquid state for a few hours of rest every sixteen hours. While in an alternate form, it is next to impossible (Difficulty 5) to discern the Changeling’s true nature, without separating some part of the Changeling’s substance. The character also has a Resistance of 4.",
                [new AnySpeciesPrerequisite(32, 47, false), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.DS9)],
                1,
                "Changeling"),
            new TalentModel(
                "Morphogenic Mastery",
                "The Changeling may, when assuming an alternate form, assume the form of a specific individual, mimicking their appearance and personality sufficiently that even close friends may be unable to discern the truth. Further, the Changeling no longer needs to revert to a liquid state in order to rest.",
                [new AnySpeciesPrerequisite(32, 47, false), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.DS9)],
                1,
                "Changeling"),
            new TalentModel(
                "Greed Is Eternal",
                "As guided by the Rules of Acquisition, a proper Ferengi seeks profit in every endeavor. When engaged in negotiations – including Social Conflict – that have the potential for the Ferengi to profit financially, they may add 1 point to Threat in order to re-roll their dice pool.",
                [new SpeciesPrerequisite(33, true), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.DS9)],
                1,
                "Ferengi"),
            new TalentModel(
                "Never Place Friendship Above Profit",
                "Ferengi accept and tolerate self-serving behavior as a natural part of business. When the character assists someone else – including using the Direct Task or other methods of assistance – and one or more Complications occurs, the character may add 1 to Threat to avoid suffering any effect from those Complications personally.",
                [new SpeciesPrerequisite(33, true), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.DS9)],
                1,
                "Ferengi"),
            new TalentModel(
                "Polyalloy Construction",
                "While appearing extremely lifelike – even simulating breathing, blinking, and other autonomic processes – a Soong-type android is not organic life. They are highly resistant to environmental conditions, reducing the Difficulty of Tasks to resist extremes of heat and cold by 2, and they are immune to the effects of suffocation, hard vacuum, starvation, and thirst. Further, their sturdy construction grants them Resistance 1. Further, while they can detect damage and dangerous conditions, they do not experience real pain, gaining +3 Resistance against non-lethal attacks, and being entirely immune to any penalties or hindrances caused by pain.",
                [new SpeciesPrerequisite(34, false), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.TNG)],
                1,
                "Soong-type Android"),
            new TalentModel(
                "Positronic Brain",
                "A Soong –type android is normally created with a positronic brain that allows it to process information made available to them considerably quicker than a Human. The character gains one automatic success on all Tasks using Reason, in addition to any generated by rolling.",
                [new SpeciesPrerequisite(34, false), new EraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.TNG)],
                1,
                "Soong-type Android"),
            new TalentModel(
                "Cold Shoulder",
                "Strong self-discipline and conservative cultural values prevent Arbazan from being susceptible to their baser desires. Any character attempting to use their physical attractiveness or seductive nature against an Arbazan during a Social Conflict increases their Difficulty by 1.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(35, true)],
                1,
                "Arbazan"),
            new TalentModel(
                "The Protocol of Politics",
                "Arbazan are naturally adept at the subtleties of social protocol, and often come to rely on it heavily during social interactions. To many other species, the Arbazan’s focus on such rules and guidelines is often viewed as obsessive, but to the Arbazan, it is simply the natural way to engage in interactions. Whenever a character with this Talent attempts a test during Social Conflict, they may re-roll a d20 so long as they succeeded at an earlier Test relating to the recollection or research of appropriate social graces, protocols, or faux pas.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(35, true)],
                1,
                "Arbazan"),
            new TalentModel(
                "Cool Under Pressure",
                "Demands of Arkarian society place strict requirements on social interactions. You are able to keep your outward expressions neutral, revealing as little as possible. Whenever you are engaged in a Social Conflict, you are considered to have an Advantage until you fail a Composure Test.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(36, true)],
                1,
                "Arkarian"),
            new TalentModel(
                "Quick Recovery",
                "The increased bone density of the brow and nasal areas are also found throughout the rest of their physical frame and provide Arkarians with superior protection from blunt trauma. They gain 2 additional Resistance against any attack made with blunt weapons.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(36, true)],
                1,
                "Arkarian"),
            new TalentModel(
                "Aerial Combat",
                "While most Aurelians avoid confrontation, they understand that sometimes it is necessary for survival. Some Aurelians have learned to take advantage of their natural flying ability. Characters with this Talent may use a Minor Action to move to any Zone within Long Range instead of Medium, and ignore any Difficulty increases associated with terrestrial terrain – however, they increase the Difficulty of any weather-related hazards by 1. Characters with this Talent are also considered to have the Advantage when making an attack against ground-based Targets.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(37, false)],
                1,
                "Aurelian"),
            new TalentModel(
                "Keen Senses",
                "Aurelians are known for their keen vision, hearing, and directional sense. Characters with this Talent reduce the Difficulty due to Distance of Perception Tasks by 1.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(37, true)],
                1,
                "Aurelian"),
            new TalentModel(
                "Disarming Nature",
                "Despite their reputation for being fierce warriors, Caitians are extremely sociable and adept at putting others at ease. Whenever you are engaged in a Social Conflict, you reduce the Difficulty of any Test to make your target relax or to trust you by 1.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(38, true)],
                1,
                "Caitian"),
            new TalentModel(
                "Prehensile Tail",
                "While most Caitians have some functional control over their tail, characters with this Talent have worked to increase their control over the appendage to the point of it becoming fully functional. This provides the character with the ability to hold and operate an additional piece of equipment, like an additional hand. In addition, the character gains a bonus d20 to any Fitness Test to maintain balance or to climb.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(38, false)],
                1,
                "Caitian"),
            new TalentModel(
                "Duty and Discipline",
                "When the character assists a superior, the superior gains a bonus Momentum.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(39, true)],
                1,
                "Cardassian"),
            new TalentModel(
                "Suspicious by Nature",
                "When attempting to detect hidden enemies, traps or other forms of danger, the character may re-roll a die.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(39, true)],
                1,
                "Cardassian"),
            new TalentModel(
                "Regimented Mind",
                "Whenever this character spends Momentum to Obtain Information, they reduce the Difficulty of their next Task by 1 so long as that Task in some way relates to the information gained.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(39, true)],
                1,
                "Cardassian"),
            new TalentModel(
                "The Ends Justify the Means",
                "When the character challenges a Directive, they gain a bonus die – in addition to any other benefits.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(39, true)],
                1,
                "Cardassian"),
            new TalentModel(
                "Multi-Tasking",
                "Edosians are capable, with extensive training and great effort, of compartmentalizing their thoughts and operating each arm completely independent of the others. Characters with this Talent may spend 3 Momentum to gain the benefit of an additional Senior Officer Role until the end of the current scene. This Talent may only be used once per episode.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(40, true)],
                1,
                "Edosian"),
            new TalentModel(
                "The Long View",
                "Due to their extremely long lifespans, Edosians come to understand and gain knowledge more extensively than most other individuals. When a character with this Talent uses a Milestone to exchange a Focus, they may do so twice instead of once.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(40, true)],
                1,
                "Edosian"),
            new TalentModel(
                "Every Man Has His Price",
                "The character gains a bonus die whenever engaged in Social Conflict where the opponent can be bribed, bought, or otherwise enticed by monetary gain.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(41, true)],
                1,
                "Ferengi"),
            new TalentModel(
                "Hear All, Trust Nothing",
                "Increase the Difficulty of any Social Conflict to deceive the character by 1.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(41, true)],
                1,
                "Ferengi"),
            new TalentModel(
                "Knowledge Equals Profit",
                "When the character spends Momentum to Obtain Information, an additional Momentum is added to the group’s Momentum Pool after all other Momentum spends are resolved.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(41, true)],
                1,
                "Ferengi"),
            new TalentModel(
                "Communal",
                "Grazerites are deeply communal and work well in coordination with others. Whenever a character with this Talent is providing assistance to another, they increase the Focus range to generate 2 successes by 1.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(42, true)],
                1,
                "Grazerite"),
            new TalentModel(
                "Horn-Sense",
                "A small minority of Grazerites are born with a genetic variance that causes their horns to be hollow. This gives them a highly sensitive organ that can detect subtle changes in air pressure, sound, and all manner of vibrations. When a character with this Talent attempts a Task that involves the detection or analysis of sound or vibrations of any kind, they may re-roll a d20.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(42, false)],
                1,
                "Grazerite"),
            new TalentModel(
                "Contact Empathy",
                "Haliians possess minor empathic abilities which, without the canar focusing crystal, is limited to touch. Once you make contact with another character, you can sense the emotions of that individual – as well as communicate telepathically with other empaths or telepaths. You cannot choose to not sense the emotions of those you make contact with. It may require effort and a Task to gain information from beings that are resistant to forms of telepathy. Such information can most often be used as an Advantage during Social Conflicts.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(43, true)],
                1,
                "Haliian"),
            new TalentModel(
                "Faceted Attention",
                "Characters with this Talent can suddenly divert their attention to other Tasks, leaving their current Task in whatever state it was in, and immediately begin work on the second. To many this may seem undisciplined and unfocused, but to characters with this Talent it is simply an effective way of completing several Tasks at once. Whenever this character is participating in a Challenge, they may choose to use this Talent and attempt two Tasks simultaneously. The attempt is made against the Task with the highest Difficulty, which is then attempted using the appropriate pool. Successes are then divided between the two Tasks. When attempting Tasks using this Talent – the Complication range is increased by one and any Complications rolled can be from either Task – as thematically appropriate.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(43, true)],
                1,
                "Haliian"),
            new TalentModel(
                "Deep Determination",
                "Ktarians have a well-earned reputation for becoming deeply committed to a particular goal – a single-minded determination to achieve success. When a character with this Talent succeeds at a Task where they could have spent a point of Determination, but choose not to, they may spend 3 Momentum to gain a point of Determination. This Talent may only be used once per Episode.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(44, true)],
                1,
                "Ktarian"),
            new TalentModel(
                "Negotiate from Strength",
                "Ktarians are loath to enter into negotiations unless they feel they are at an advantage. When a Character with this Talent enters into a Social Conflict and attempts to use negotiation, they may gain the benefit of an Advantage twice – however, the Advantage must be used differently each time. This Talent may only be used once per scene.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(44, true)],
                1,
                "Ktarian"),
            new TalentModel(
                "Hardened Hide",
                "Zaranite skin is extremely tough and capable of withstanding pressures, temperatures, and acidity levels that would prove lethal to other species. Characters with this Talent gain 2 natural Resistance.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(45, false)],
                1,
                "Zaranite"),
            new TalentModel(
                "Multispectrum Vision",
                "Zaranites can see a broader spectrum of light than most humanoid species. Characters with this Talent gain a bonus Momentum on a Perception Task based on vision. This bonus Momentum may only be used on the Gain Information Momentum spend.",
                [new SourcePrerequisite(Source.AlphaQuadrant), new SpeciesPrerequisite(45, false)],
                1,
                "Zaranite"),
            new TalentModel(
                "Absolute Conviction",
                "The Argrathi come from a culture where crime has been systematically eliminated and therefore they view themselves as the true arbiters of justice across the Gamma Quadrant. They view criminals with disdain, and they live to show others the true greatness of their beliefs. An Argrathi gains +1 to all rolls when dealing with someone they know to be a criminal or who engages in criminal behavior. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(46, true)],
                1,
                "Argrathi"),
            new TalentModel(
                "Mind Games",
                "The Argrathi’s memory technology is used in more ways than just their penal system. From education to entertainment, the average Argrathi is exposed to the effects of this technology at a very young age and learns how to tell when their memory has been altered or when they are under the effect of mindaltering abilities or powers. An Argrathi receives a +1 bonus to all rolls when attempting to resist these effects or uncover whether they have been affected at all. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(46, false)],
                1,
                "Argrathi"),
            new TalentModel(
                "Strength and Cunning",
                "While they are a warrior culture, the Dosi do not teach their children to solve every matter with only one aspect of their being. In order to thrive in Dosi culture, they must utilize every skill and asset they possess and must combine them in ways they never thought possible. A Dosi may use their Fitness Attribute in situations where they must use Insight, and their Presence Attribute when they need to use their Reason. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(48, true)],
                1,
                "Dosi"),
            new TalentModel(
                "Glorious Notoriety",
                "The Dosi’s culture has adapted itself to being able to look at an individual Dosi’s skin and being able to read their accomplishments before the other Dosi has even had a chance to open their mouth. The Dosi know other races are not as civilized as theirs and therefore they know how to radiate a sense of intimidation and respect to those who are around them, whether by flexing their muscles or by adding implied threats as they attempt to negotiate their deals. The Dosi reduces the Difficulty of all checks involving negotiations or diplomacy by 1. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(48, true)],
                1,
                "Dosi"),
            new TalentModel(
                "Genetic Mastery",
                "Research into the field of genetics has become the cornerstone of the Drai’s technology. Some families have begun experimenting on their own children in order to produce the most powerful heirs and offspring possible. The character must choose one attribute to be the focus of Genetic Mastery. Once an attribute is assigned to Genetic Mastery, the character reduces the Difficulty of all Tasks that involve that attribute by 1. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(49, true)],
                1,
                "Drai"),
            new TalentModel(
                "Born Stalker",
                "The Drai consider the Hunt to be the most important thing they will ever do in their lives, and their entire culture revolves around it. Whether it is pursuing the Tosk or other prey, the Drai have structured the very way they teach their children to view the world to be from the mind-set of a hunter stalking their prey. This helps the Drai in every walk of life as they are able to approach each task with precision and careful attention rather than blindly rushing into things. Once per scene the Drai may ignore their Complications when determining the Difficulty for a Task. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(49, false)],
                1,
                "Drai"),
            new TalentModel(
                "My Honor Is My Shield",
                "While it can be difficult to maintain a sterling reputation and in doing so lead to hardship and loss, there are times when pursuing a higher path can reap great benefits for the individual. It is the difficult road, but one that will ultimately lead towards fulfilling the needs of the many rather than the selfish desires of the one. As long as the character has behaved honourably throughout the scene, they may use their Presence Attribute for any declared Attacks. The character is also assumed to pass any challenges involving impugning their character in front of witnesses. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(50, true)],
                1,
                "Karemma"),
            new TalentModel(
                "Instant Appraisal",
                "A tricorder can tell someone what an object is composed of in only a few seconds but it is rumoured that the Karemma can do it in only one. Drawing upon past experience, the Karemma is able to instinctively identify the materials that make up an object that they interact with physically. In the event of dealing with unknown or exotic substances, they are able to identify familiar patterns within the material that can point the characters in the right direction while performing the Scientific Method and reduce the difficulty by 1. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(50, false)],
                1,
                "Karemma"),
            new TalentModel(
                "Into the Breach",
                "Life is not worth living to a Lurian if there is not some risk involved. Always willing to dare greater than others, the Lurian finds that the real thrill lurks just beyond the edge of danger and that is what they should strive for even if their comrades do not. The character gains an additional point of Momentum if they succeed at a task that requires extreme acts of bravery to overcome. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(51, true)],
                1,
                "Lurian"),
            new TalentModel(
                "Resistant Anatomy",
                "The Lurians are known for having one of the hardiest constitutions in the quadrant. Capable of taking a knife to one of their hearts and keep on fighting, the Lurians have evolved a musculature and cardiovascular system that rivals that of the Klingons. When mortally wounded or suffering under a Condition that affects their physiology, a Lurian can choose to ignore the effect for the remainder of the scene, after which they collapse from exhaustion and are incapacitated for a scene. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(51, true)],
                1,
                "Lurian"),
            new TalentModel(
                "Replicating Past Success",
                "When encountering scientific tasks that they have already successfully completed for this scene, the character may spend a point of Momentum to replicate the dice result from the previous challenge. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(52, true)],
                1,
                "Paradan"),
            new TalentModel(
                "Distracting Senses",
                "Paradans are infamous throughout the Gamma Quadrant for their pervasive odors, but some of them have been able to channel this portion of their physiology and use it as a weapon. A Paradan may spend their turn focusing on emitting obnoxious pheromones around them and increase the Difficulty towards attacking them in hand to hand combat by 1. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(52, false)],
                1,
                "Paradan"),
            new TalentModel(
                "The Truth of the Matter",
                "The Rakhari culture is peppered with thousands of stories and legends that are shared by the Rakhari with their children as they grow up. This has led to the Rakhari being capable storytellers, and a skilled Rakhari knows how to incorporate small snippets of the truth into any web of lies he starts to weave. The Rakhari gains a free point of Momentum when they successfully convince another sentient being of a lie. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(53, true)],
                1,
                "Rakhari"),
            new TalentModel(
                "Disciplined Mind",
                "The brutal laws that the Rakhari government has passed over the years has kept the population under control but led to most Rakhari being too afraid to share their intimate thoughts in public. This has led to several Rakhari becoming particularly adept at not only shielding their emotions while around others but also being able to discern the true feelings of those they communicate with. The Rakhari is able to reduce any psychic damage they may suffer by 1 and they gain a free reroll on one die in their pool when attempting to determine lies. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(53, true)],
                1,
                "Rakhari"),
            new TalentModel(
                "Agricultural Specialist",
                "When tasked with dealing with matters that relate to a planet’s biosphere or agriculture, a Skreeaan may always use their Insight or Control attributes, depending on which is higher. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(54, true)],
                1,
                "Skreeaa"),
            new TalentModel(
                "Strength Through Struggle",
                "Though some believe it is the Skreeaan’s history of being conquered that has made them expert laborers the truth is they are a tough and hardy people eager to throw off the reins of oppression. The fact that they are physically gifted when it comes to labor only means they are able to succeed easily where others struggle. When they succeed at performing a physically arduous Task they gain one bonus Momentum. This bonus Momentum cannot be saved into the group pool. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(54, true)],
                1,
                "Skreeaa"),
            new TalentModel(
                "At All Costs",
                "Though a small power in the Alpha Quadrant, the Son’a have not become one of the dominant powers in the Briar Patch by engaging only in half measures or pulling their punches. When a Son’a declares their attack action, they may add an additional point of Momentum as long as they are not dealing Non-lethal damage. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(55, true)],
                1,
                "Son'a"),
            new TalentModel(
                "Particle Engineering",
                "The Son’a are hedonists who embrace all the pleasures that life has to offer but that does not mean they are not well educated. A large portion of the Son’a’s scientific research is dedicated towards understanding the unique particles that cling to the atmosphere of their former homeworld. When dealing with subatomic particles and the effects of radiation, the Son’a may ignore the effects of any Condition for the scene and may roll an additional d20 when attempting to understand the nature of these effects. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(55, false)],
                1,
                "Son'a"),
            new TalentModel(
                "Survivor's Luck",
                "For the Drai, the greatest hunts always come when their prey manages to continually outwit them and the Tosk are cunning adversaries. Some are given extra stores of information when they are created while others are able to pick up survival techniques as they try to escape from the Hunters. The Tosk adds 1 bonus Momentum to the pool for each adversary they are trying to escape in the scene to a maximum of 3. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(56, true)],
                1,
                "Tosk"),
            new TalentModel(
                "Last Breath",
                "The Tosk are designed to keep running no matter what, and refuse to allow themselves to be captured because they start to feel the effects of fatigue or exhaustion. A Tosk with this talent gains a free point of Momentum to their next action when attempting to escape while they are under the effects of a Complication. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(56, true)],
                1,
                "Tosk"),
            new TalentModel(
                "Come With Me",
                "Life can be difficult if you are competitive, and sometimes people can get angry over perceived slights very quickly. By staying jovial and attempting to lighten the mood, you are better able to reduce sources of conflict and bring people over to your side. You can reroll one die when attempting to use social skills to alter someone’s feelings regarding something you have done this scene. ",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(57, true)],
                1,
                "Wadi"),
            new TalentModel(
                "Life is a Game",
                "Life is meant to be enjoyed, and the more risk one puts into their life the sweeter the victory. A Wadi has a distinct ability to sense patterns when it comes to solving tasks, and the more involved they are with something the more competitive they get and the quicker they are at solving puzzles. When attempting to solve a task or a riddle that involves them becoming competitive they gain an additional point of Momentum.",
                [new SourcePrerequisite(Source.GammaQuadrant), new SpeciesPrerequisite(57, false)],
                1,
                "Wadi"),
            new TalentModel(
                "Favored by Fortune",
                "If the character is successful on a Task, the next Task performed during that scene gains one bonus Momentum if successful.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(58, true)],
                1,
                "Ankari"),
            new TalentModel(
                "Vibration Senses",
                "The character has learned to use their unique physiology to allow them to detect vibrations, enhancing their ability to see and hear, even in darkness. Characters with this Talent reduce the Difficulty of perception-related Tasks by 1.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(58, true)],
                1,
                "Ankari"),
            new TalentModel(
                "Maximized Efficiency",
                "When assisting another character, the Jye may re-roll their assist die. In addition, if the assist die generated one or more successes, the lead character gains a bonus Momentum if the Task is successful.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(59, true)],
                1,
                "Jye"),
            new TalentModel(
                "Natural Coordinator",
                "When assisting, or being assisted, the character is always considered to have an applicable Focus for that Task.In addition, the character counts as having a Command of 4 for the purposes of learning Talents.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(59, true)],
                1,
                "Jye"),
            new TalentModel(
                "Borg Implants",
                "A Liberated Borg character must select this Talent during character creation. When this Talent is chosen, pick one, two, or three Borg Implants. The character gains the benefits of those implants, but the Difficulty of Medicine Tasks performed on them increases by the number of implants they have. The character also increases the Complication range of all social interaction Tasks by the number of implants they have. An ordinary milestone may be used to remove one implant at a time, not the whole Talent; once all implants have been removed, this Talent can be swapped for another.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(60, true)],
                1,
                "Liberated Borg"),
            new TalentModel(
                "Direct Neural Interface",
                "Having existed as an extension of one of the largest and most complex computer networks in the known Galaxy, Liberated Borg possess a natural affinity for computers and data processing equipment of all kinds, and are almost organic computers themselves. When the character attempts a Task that involves, or is assisted by, a computer (including the ship’s Computers system), the character gains a bonus d20 for their dice pool.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(60, true)],
                1,
                "Liberated Borg"),
            new TalentModel(
                "Hologram Taskmaster",
                "In decades past, the Lokirrim designed and utilized holograms to perform countless tasks. The character’s ship’s Crew Support is increased by 1. In addition, the character’s ship gains the Photonic Crew Trait. This increase can only be applied to a ship once, regardless of the number of Main Characters who possess this Talent.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(61, true)],
                1,
                "Lokirrim"),
            new TalentModel(
                "Photonic Prosecutor",
                "The Lokirrim have a long history of interrogating rogue photonic individuals. When engaged in a Social Conflict with a hologram or other photonic character, this character is considered to have an Advantage.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(61, true)],
                1,
                "Lokirrim"),
            new TalentModel(
                "Empath",
                "The character can sense the emotions of most nearby living beings, and can communicate telepathically with other empaths and telepaths, as well as those with whom they are extremely familiar. Not sensing nearby emotions is impossible, except for those who are resistant to telepathy. It may require serious effort and a Task to pick out the emotions of a specific individual in a crowd, or to block out the emotions of those nearby. Increase the Difficulty of this Task if the situation is stressful, if there are a lot of beings present, if the target has resistance to telepathy, or if the Gamemaster decides there are other relevant factors.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(62, true)],
                1,
                "Mari"),
            new TalentModel(
                "Passive Persuader",
                "During Social Conflict, the character reduces the Difficulty of all evidence and negotiation based Tasks but increases the Difficulty of intimidation Tasks by 1.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(62, true)],
                1,
                "Mari"),
            new TalentModel(
                "Nomadic Heritage",
                "Generations of traversing the stars ingrained a natural affinity for navigation and positioning. The character may reroll a d20 during any Task associated with positioning, course determination, and other forms of navigation.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(63, true)],
                1,
                "Monean"),
            new TalentModel(
                "Submariner",
                "Having lived underwater for centuries, the Moneans have long since developed a keen understanding of navigating underwater environments. The character reduces any Difficulty penalties to Conn Tasks while navigating or piloting underwater by 1.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(63, true)],
                1,
                "Monean"),
            new TalentModel(
                "Quick Learner",
                "Ocampa possess keen minds and enjoy near-perfect memories, and they take to new situations and new challenges quickly. When a character with this talent attempts a Task which they have seen at least one ally perform during this mission, you may add an additional d20 to that Task. ",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(64, true)],
                1,
                "Ocampa"),
            new TalentModel(
                "Empath",
                "The character can sense the surface thoughts and emotions of most living beings nearby, and can communicate telepathically with other empaths and telepaths, as well as those with whom they are extremely familiar. Surface thoughts are whatever a creature is thinking about at that precise moment. The character cannot choose not to sense the emotions or read the surface thoughts of those nearby, except for those who are resistant to telepathy. It will require effort and a Task to pick out the emotions or thoughts of a specific individual in a crowd, to search a creature’s mind for specific thoughts or memories, or to block out the minds of those nearby. Unwilling targets may resist with an Opposed Task.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(64, true)],
                1,
                "Ocampa"),
            new TalentModel(
                "Born to Fight",
                "The character may reroll one d20 when making an attack. In addition, if an attack is successful, the character generates one point of bonus Momentum which may only be spent to re-roll the damage roll or to increase the total damage. Bonus Momentum may not be saved.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(65, true)],
                1,
                "Pendari"),
            new TalentModel(
                "Robust Physiology",
                "Various physiological redundancies mean that wounds that would kill other humanoid species don’t affect Pendari as much. The character gains +2 Resistance against all nonlethal attacks. In addition, whenever the Pendari is the target of a First Aid Task, reduce the Difficulty of that Task by 1, to a minimum of 1.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(65, true)],
                1,
                "Pendari"),
            new TalentModel(
                "Canonic Law",
                "A deep respect for and adherence to established laws provides the character with emotional assuredness. When spending Determination to bring one of their Values into play, the character may select two benefits instead of one. The circumstances of this Task and the Value being used must relate to the character’s belief and adherence to the laws of their people. This Talent may only be used once per mission, and it cannot be used when challenging the selected Value.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(66, true)],
                1,
                "Sikarian"),
            new TalentModel(
                "Riveting Storyteller",
                "When engaged in a Social Conflict, if the character can tell a story as part of their interaction, they may reroll a d20.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(66, true)],
                1,
                "Sikarian"),
            new TalentModel(
                "Well Regarded",
                "When engaged in a Social Conflict, the character increases the Difficulty of Tasks that target them by 1.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(66, true)],
                1,
                "Sikarian"),
            new TalentModel(
                "Being of Many Talents",
                "The character has developed a degree of ability across a broad range of disciplines. When attempting a Task where more than one of the character’s Focuses apply, the character may reroll a d20.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(67, true)],
                1,
                "Talaxian"),
            new TalentModel(
                "Infectous Nature",
                "The character comes from a race of social beings that are outgoing, good-natured, and enjoy the company of others. This exuberance has the pleasant side effect of improving the attitude and outlooks of the people around them – regardless of whether those beings like it or not. When engaged in a Social Conflict, the character may spend 2 Momentum to improve the outlook and attitude of those around them. This provides one of two effects. The character is considered to have an Advantage in subsequent social interactions with the individual affected by this Talent. In addition, the character may choose to allow the individual to recover Stress equal to the character’s Command score.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(67, true)],
                1,
                "Talaxian"),
            new TalentModel(
                "Widely Traveled",
                "Having traveled space for more of their adult life, the character has seen much and has picked up bits of knowledge and unusual skills along the way. Once per mission, the character may add 1 to Threat to gain an additional Focus for the remainder of that mission, representing a specific skill or field of knowledge the character possesses which is useful in the current situation.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(67, true)],
                1,
                "Talaxian"),
            new TalentModel(
                "Deep Determination",
                "Turei have a well-earned reputation for becoming deeply committed to a particular goal – a singleminded determination to achieve success. When a Character with this Talent succeeds at a Task where they could have spent a point of Determination, but chose not to, they may spend 3 Momentum to gain a point of Determination. This Talent may only be used once per mission.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(68, true)],
                1,
                "Turei"),
            new TalentModel(
                "Underdweller",
                "When attempting any Task involving navigating subspace realms, such as Underspace corridors, the character reduces the Difficulty of that Task by 1, to a minimum of 1.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(68, true)],
                1,
                "Turei"),
            new TalentModel(
                "Thermal Regulation",
                "This species is capable of regulating their body temperatures such that they can survive in hostile environments with ease. Reduce the severity of any negative Trait dealing with temperature by 1. This can eliminate any ongoing damage the character would normally be required to suffer due to these Traits.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(69, true)],
                1,
                "Zahl"),
            new TalentModel(
                "Warm Welcome",
                "A cheerful, outgoing personality is the perfect thing to put diplomatic guests at ease. Whenever assisting another character, the Zahl may use the active character’s Presence Attribute instead of their own. Further, both the Zahl and the character being assisted may ignore any increases in Complication Range for the Task.",
                [new SourcePrerequisite(Source.DeltaQuadrant), new SpeciesPrerequisite(69, true)],
                1,
                "Zahl"),
            new TalentModel(
                "Expanded Program",
                "Your programming has been expanded considerably, with subroutines and databases covering a wide range of additional subjects and fields of expertise. You may select up to two additional Focuses.",
                [new SourcePrerequisite(Source.Voyager), new SpeciesPrerequisite(70, false)],
                1,
                "Hologram"),
            new TalentModel(
                "Mobile Emitter",
                "You have a device that allows you a degree of autonomy from fixed holoemitters. Most of these mobile emitters are bulky, awkward pieces of equipment with a limited amount of power, making them useful only for short periods and emergencies, but the technology is improving. While you have your mobile emitter, you can move freely in places that lack holo-emitters. However, Complications may reflect damage to or problems with the emitter.",
                [new SourcePrerequisite(Source.Voyager), new SpeciesPrerequisite(70, false)],
                1,
                "Hologram"),
            new TalentModel(
                "Cruel",
                "You have a tendency towards ruthlessness and cruelty, and the reputation to match, always seeking to undermine those you wish to destroy before you deal the final blow. When you attempt a Task to identify the weaknesses or flaws of an enemy, or matters they are particularly sensitive or protective about, you may reduce the Difficulty by 1. If the enemy has a trait which reflects this weakness (such as an advantage you've created, or a complication they're suffering from), you may re-roll a single d20 on the next attack or persuasion Task you attempt against them.",
                [new SpeciesPrerequisite(71, true), new NotEraPrerequisite(Era.NextGeneration), new SourcePrerequisite(Source.KlingonCore)],
                1,
                "Klingon (QuchHa')"),
            new TalentModel(
                "Superior Ambition",
                "You believe that your cunning and insight give you an advantage over other Klingons, and your ambition is greater than theirs. When you spend Determination, you may add three to Threat in order to gain two benefits from spending Determination, instead of one.",
                [new SourcePrerequisite(Source.KlingonCore), new NotEraPrerequisite(Era.NextGeneration), new SpeciesPrerequisite(71, true)],
                1,
                "Klingon (QuchHa')"),
            // Careers
            new TalentModel(
                "Untapped Potential",
                "The character is inexperienced, but talented and with a bright future in Starfleet. The character may not have or increase any Attribute above 11, or any Discipline above 4 while they have this Talent (and may have to adjust Attributes and Disciplines accordingly at the end of character creation). Whenever the character succeeds at a Task for which they bought one or more additional dice with either Momentum or Threat, they may roll 1[D]. The character receives bonus Momentum equal to the roll, and adds one point to Threat if an Effect is rolled. The character cannot gain any higher rank than lieutenant (junior grade) while they possess this Talent.",
                [new CareerPrerequisite(0)],
                1,
                "Career"),
            new TalentModel(
                "Veteran",
                "The character is wise and experienced, and draws upon inner reserves of willpower and determination in a more measured and considered way. Whenever the character spends a point of Determination, roll 1[D]. If an Effect is rolled, immediately regain that spent point of Determination. The character has a rank of at least Lieutenant Commander.",
                [new CareerPrerequisite(2)],
                1,
                "Career"),
            // Other
            new TalentModel(
                "Bold: Command",
                "Whenever you attempt a Task with Command, and you buy one or more d20s by adding to Threat, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Cautious: Command")],
                1,
                "General"),
            new TalentModel(
                "Bold: Conn",
                "Whenever you attempt a Task with Conn, and you buy one or more d20s by adding to Threat, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Cautious: Conn")],
                1,
                "General"),
            new TalentModel(
                "Bold: Engineering",
                "Whenever you attempt a Task with Engineering, and you buy one or more d20s by adding to Threat, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Cautious: Engineering")],
                1,
                "General"),
            new TalentModel(
                "Bold: Security",
                "Whenever you attempt a Task with Security, and you buy one or more d20s by adding to Threat, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Cautious: Security")],
                1,
                "General"),
            new TalentModel(
                "Bold: Science",
                "Whenever you attempt a Task with Science, and you buy one or more d20s by adding to Threat, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Cautious: Science")],
                1,
                "General"),
            new TalentModel(
                "Bold: Medicine",
                "Whenever you attempt a Task with Medicine, and you buy one or more d20s by adding to Threat, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Cautious: Medicine")],
                1,
                "General"),
            new TalentModel(
                "Cautious: Command",
                "Whenever you attempt a Task with Command, and you buy one or more d20s by spending Momentum, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Bold: Command")],
                1,
                "General"),
            new TalentModel(
                "Cautious: Conn",
                "Whenever you attempt a Task with Conn, and you buy one or more d20s by spending Momentum, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Bold: Conn")],
                1,
                "General"),
            new TalentModel(
                "Cautious: Engineering",
                "Whenever you attempt a Task with Engineering, and you buy one or more d20s by spending Momentum, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Bold: Engineering")],
                1,
                "General"),
            new TalentModel(
                "Cautious: Security",
                "Whenever you attempt a Task with Security, and you buy one or more d20s by spending Momentum, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Bold: Security")],
                1,
                "General"),
            new TalentModel(
                "Cautious: Science",
                "Whenever you attempt a Task with Science, and you buy one or more d20s by spending Momentum, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Bold: Science")],
                1,
                "General"),
            new TalentModel(
                "Cautious: Medicine",
                "Whenever you attempt a Task with Medicine, and you buy one or more d20s by spending Momentum, you may re-roll a single d20.",
                [new NotTalentPrerequisite("Bold: Medicine")],
                1,
                "General"),
            new TalentModel(
                "Collaboration: Command",
                "Whenever an ally attempts a Task using Command, you may spend one Momentum (Immediate) to allow them to use your score for that Discipline, and one of your Focuses.",
                [],
                1,
                "General"),
            new TalentModel(
                "Collaboration: Conn",
                "Whenever an ally attempts a Task using Conn, you may spend one Momentum (Immediate) to allow them to use your score for that Discipline, and one of your Focuses.",
                [],
                1,
                "General"),
            new TalentModel(
                "Collaboration: Engineering",
                "Whenever an ally attempts a Task using Engineering, you may spend one Momentum (Immediate) to allow them to use your score for that Discipline, and one of your Focuses.",
                [],
                1,
                "General"),
            new TalentModel(
                "Collaboration: Security",
                "Whenever an ally attempts a Task using Security, you may spend one Momentum (Immediate) to allow them to use your score for that Discipline, and one of your Focuses.",
                [],
                1,
                "General"),
            new TalentModel(
                "Collaboration: Science",
                "Whenever an ally attempts a Task using Science, you may spend one Momentum (Immediate) to allow them to use your score for that Discipline, and one of your Focuses.",
                [],
                1,
                "General"),
            new TalentModel(
                "Collaboration: Medicine",
                "Whenever an ally attempts a Task using Medicine, you may spend one Momentum (Immediate) to allow them to use your score for that Discipline, and one of your Focuses.",
                [],
                1,
                "General"),
            new TalentModel(
                "Constantly Watching",
                "When you attempt a Task to detect danger or hidden enemies, reduce the Difficulty by 1.",
                [],
                1,
                "General"),
            new TalentModel(
                "Dauntless",
                "Whenever you attempt a Task to resist being intimidated or threatened, you may add a bonus d20 to your dice pool.",
                [],
                1,
                "General"),
            new TalentModel(
                "Personal Effects",
                "The character possesses some significant and uncommon item or device which is not part of Starfleet’s standard issue, but which is nevertheless useful for missions. The character may select one item with an Opportunity Cost of 2, or two items with an Opportunity Cost of 1 each. Neither items may have an Escalation Cost greater than 1.",
                [],
                10,
                "General"),
            new TalentModel(
                "Studious",
                "Whenever you spend one or more Momentum to Obtain Information, you may ask one additional question (in total, not per Momentum spent on Obtain Information).",
                [],
                1,
                "General"),
            new TalentModel(
                "Technical Expertise",
                "Whenever you attempt a Task assisted by the ship’s Computers or Sensors, you may re-roll one d20 (which may be the ship’s die).",
                [],
                1,
                "General"),
            new TalentModel(
                "Tough",
                "Whenever you Avoid an Injury, the cost is reduced by 1, to a minimum of 1.",
                [],
                1,
                "General"),
            new TalentModel(
                "Augmented Ability (Control)",
                "You gain the Extraordinary Attribute 1 special rule for the Control Attribute. When the character uses this ability, they increase their Complication Range by 2 for that Task.",
                [new SourcePrerequisite(Source.SciencesDivision)],
                1,
                "Enhancement"),
            new TalentModel(
                "Augmented Ability (Daring)",
                "You gain the Extraordinary Attribute 1 special rule for the Daring Attribute. When the character uses this ability, they increase their Complication Range by 2 for that Task.",
                [new SourcePrerequisite(Source.SciencesDivision)],
                1,
                "Enhancement"),
            new TalentModel(
                "Augmented Ability (Fitness)",
                "You gain the Extraordinary Attribute 1 special rule for the Fitness Attribute. When the character uses this ability, they increase their Complication Range by 2 for that Task.",
                [new SourcePrerequisite(Source.SciencesDivision)],
                1,
                "Enhancement"),
            new TalentModel(
                "Augmented Ability (Insight)",
                "You gain the Extraordinary Attribute 1 special rule for the Insight Attribute. When the character uses this ability, they increase their Complication Range by 2 for that Task.",
                [new SourcePrerequisite(Source.SciencesDivision)],
                1,
                "Enhancement"),
            new TalentModel(
                "Augmented Ability (Presence)",
                "You gain the Extraordinary Attribute 1 special rule for the Presence Attribute. When the character uses this ability, they increase their Complication Range by 2 for that Task.",
                [new SourcePrerequisite(Source.SciencesDivision)],
                1,
                "Enhancement"),
            new TalentModel(
                "Augmented Ability (Reason)",
                "You gain the Extraordinary Attribute 1 special rule for the Reason Attribute. When the character uses this ability, they increase their Complication Range by 2 for that Task.",
                [new SourcePrerequisite(Source.SciencesDivision)],
                1,
                "Enhancement"),
            new TalentModel(
                "Neural Interface",
                "The character has had a cybernetic device implanted directly into their brain, allowing them to interface with computers and similar technologies with their thoughts. Initiating or breaking the link between their minds and a computer system takes a Minor Action, and while they are connected they may reroll the d20 gained from using ship's Systems. However, any time the ship suffers a Breach the character also suffers 3 CD of Stress.",
                [new SourcePrerequisite(Source.SciencesDivision)],
                1,
                "Enhancement"),
            new TalentModel(
                "Physical Enhancement",
                "The character has some portion of their body replaced by an advanced piece of bio-mechanical hardware. This device functions exactly like its organic counterpart; however, before attempting a Task, the Character may choose to take 3 CD Stress to add a single additional d20 to their dice pool. Any Injuries caused by this damage is resolved after the effects of the Task. Multiple dice may be bought in this way, but the damage is added together (so, buying two dice inflicts 6 CD damage, and buying 3 dice inflicts 9 CD damage). These dice count towards the normal limit of bonus d20s purchased.",
                [new SourcePrerequisite(Source.SciencesDivision)],
                1,
                "Enhancement"),
            new TalentModel(
                "Sensory Replacement",
                "Due to physical injury or irreparable birth defect, the character has been forced to adopt a cybernetic device that replaces one of their sensory functions – most commonly sight or hearing. The character gains the Artificial Sense Trait, which can be used normally. In addition, when the character is using the Obtain Information Momentum spend, they may ask questions or be given information not normally available with organic senses.",
                [new SourcePrerequisite(Source.SciencesDivision)],
                1,
                "Enhancement"),

            // Starships
            new TalentModel(
                "Ablative Armor",
                "The vessel’s hull plating has an additional ablative layer that disintegrates slowly under extreme temperatures, such as those caused by energy weapons and torpedo blasts, dissipating the energy, and protecting the ship. This plating is replaced periodically. The ship’s Resistance is increased by 2.",
                [new StarshipPrerequisite(), new ServiceYearPrerequisite(2371)],
                1,
                "Starship"),
            new TalentModel(
                "Advanced Research Facilities",
                "The vessel is equipped with additional laboratories and long-term research facilities, which allow the crew to study phenomena over a protracted period, and thus generate a wealth of useful information. Whenever a character on board the ship attempts a Task to perform research, and they are assisted by the ship’s Computers + Science, the character gains one bonus Momentum, which must be used for the Obtain Information Momentum Spend.",
                [new StarshipPrerequisite(), new DepartmentPrerequisite(Department.Science, 3)],
                1,
                "Starship"),
            new TalentModel(
                "Advanced Sensor Suites",
                "The vessel’s sensors are amongst the most sophisticated and advanced available in the fleet. Unless the ship’s Sensors have suffered one or more Breaches, whenever a character performs a Task assisted by the ship’s Sensors, they may reduce the Difficulty of the Task by one, to a minimum of 0.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Advanced Shields",
                "The vessel’s shields are state of the art, using developments that other cultures have not yet learned to overcome, or which simply provide greater protection for the same power expenditure. The ship’s maximum Shields are increased by 5.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Advanced Sickbay",
                "The ship’s sickbay is extremely well-equipped, and larger than is normal for a ship of this size. The ship gains the Advanced Sickbay Advantage, which applies to all Tasks related to medicine and biology performed within the sickbay itself. This Advantage is lost if the ship’s Computers System is Disabled.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Backup EPS Conduits",
                "The ship’s power conduits have additional redundancies, which can be activated to reroute power more easily in case of an emergency, keeping it from being lost when the ship is damaged. Whenever the ship would lose one or more Power because of suffering damage, roll [CD] for each Power lost. Each Effect rolled prevents the loss of that point of Power.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Command Ship",
                "The ship has command and control systems allowing it to coordinate easily with allies during a crisis. When a character on the ship succeeds at a Direct Task to create an Advantage, they may always be assisted by the ship’s Communications + Command, and they may confer the Advantage to allied ships or away teams with whom the ship maintains a communications link.",
                [new StarshipPrerequisite(), new DepartmentPrerequisite(Department.Command, 3)],
                1,
                "Starship"),
            new TalentModel(
                "Diplomatic Suites",
                "The ship has numerous high-quality staterooms for hosting VIPs, as well as briefing rooms and other facilities that allow the ship to serve as a neutral ground for diplomatic summits, trade negotiations, and similar functions. When hosting negotiations, members of the crew may be assisted by the ship’s Computers + Command or Structure + Command.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Electronic Warfare Systems",
                "The ship’s communications systems have been speciallydesigned to intercept and disrupt enemy communications in battle. Whenever a character on the ship succeeds at the Intercept or Signals Jamming Tasks, they may spend 2 Momentum to select one additional ship to target.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Emergency Medical Hologram",
                "The ship’s sickbay is equipped with holoemitters and a stateof-the-art holographic doctor, able to assist medical personnel during emergencies. The ship has one additional Supporting Character, an Emergency Medical Hologram, using the Attributes, Disciplines, and so forth as shown in the sidebar, which does not cost any Crew Support to introduce, and which does not automatically improve when introduced. This character cannot go into any location not equipped with holoemitters.",
                [new StarshipPrerequisite(), new ServiceYearPrerequisite(2371)],
                1,
                "Starship"),
            new TalentModel(
                "Extensive Shuttlebays",
                "The vessel’s shuttlebays are large, well-supplied, and able to support a larger number of active shuttle missions simultaneously. The ship may have twice as many small craft active at any one time as it would normally allow, and it may carry up to two Scale 2 small craft.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Fast Targeting Systems",
                "The ship’s targeting systems can lock weapons on target much faster and more accurately than other ships of its class, giving it an edge in battle. The ship does not suffer the normal Difficulty increase for targeting a specific System on the enemy ship.",
                [new StarshipPrerequisite(), new DepartmentPrerequisite(Department.Security, 3)],
                1,
                "Starship"),
            new TalentModel(
                "High Resolution Sensors",
                "The vessel’s sensors can gain large amounts of accurate data, though they are extremely sensitive. While the vessel is not in combat, any successful Task that is assisted by the ship’s Sensors gains one bonus Momentum.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Improved Damage Control",
                "The ship has more efficient damage reporting systems, and better-trained teams of technicians, allowing the crew to respond more quickly to damage during a crisis. When a character takes the Damage Control Task aboard this ship, they may re-roll a single d20. If the repairs require an Extended Task, then the characters also gain Progression 1, adding +1 to Work done for each Effect rolled.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Improved Hull Integrity",
                "The ship’s hull has been reinforced to hold together better under stress and damage. The ship’s Resistance is increased by 1.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Improved Impulse Drive",
                "The ship’s Impulse drives are more powerful than on most ships, allowing the ship to accelerate much more quickly. When the flight controller succeeds at the Impulse, Attack Pattern, Evasive Action, or Ramming Speed Tasks, they may spend 2 Momentum to increase the Difficulty of attacks against the ship by 1 until the start of the flight controller’s next Turn, due to the ship’s rapid acceleration.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Improved Power Systems",
                "The ship’s power systems are extremely efficient, allowing power to be redirected and rerouted from different systems very quickly. Whenever a character succeeds at a Power Management Task, the ship gains 2 Power per Momentum spent (Repeatable) instead of 1.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Improved Reaction Control System",
                "The ship’s maneuvering thrusters operate with greater precision, allowing the ship to adjust its course more carefully. Whenever a Task to move or maneuver the ship would increase in Difficulty because of obstacles or hazards, reduce the Difficulty by 1 (to a minimum of the Task’s normal Difficulty).",
                [new StarshipPrerequisite(), new DepartmentPrerequisite(Department.Conn, 3)],
                1,
                "Starship"),
            new TalentModel(
                "Improved Shield Recharge",
                "The ship’s deflector shields have redundant capacitors and emitter arrays that allow the shields to be recharged and replenished much more efficiently. Whenever the Regenerate Shields Task is successful, the ship regains 3 points of Shields, plus 3 more for each Momentum spent (Repeatable), instead of the normal amount.",
                [new StarshipPrerequisite(), new DepartmentPrerequisite(Department.Security, 3)],
                1,
                "Starship"),
            new TalentModel(
                "Improved Warp Drive",
                "The ship’s warp drive is more efficient, capitalizing on improved field dynamics, better control of antimatter flow rates, or some other advancement that allows the ship to expend less energy when travelling at warp. Whenever the ship spends power to go to warp, roll 1 for each Power spent; for each Effect rolled, that point of Power is not spent.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Modular Laboratories",
                "The ship has considerable numbers of empty, multi-purpose compartments that can be converted to laboratories as and when required. At the start of an adventure, the crew may decide how the modular laboratories are configured; this configuration counts as an Advantage which applies to work performed within the laboratories.",
                [new StarshipPrerequisite(), new DepartmentPrerequisite(Department.Science, 2)],
                1,
                "Starship"),
            new TalentModel(
                "Quantum Torpedoes",
                "The vessel has been equipped with the latest in ship-to-ship munitions: the quantum torpedoes. The ship has quantum torpedoes in addition to any other form of torpedo it carries.",
                [new StarshipPrerequisite(), new ServiceYearPrerequisite(2371)],
                1,
                "Starship"),
            new TalentModel(
                "Rapid-Fire Torpedo Launcher",
                "The vessel’s torpedo launchers have been redesigned to allow the ship to fire multiple torpedoes much more quickly and accurately. Whenever the crew add 3 to Threat to fire a torpedo salvo, they may re-roll a single d20 on the attack, and any number of CD on the damage roll.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Redundant Systems",
                "The ship has multiple additional redundancies that allow it to withstand severe damage more easily. Nominate a single System. When that system becomes Damaged or Disabled, the crew may choose to activate the backups as a Minor Action; if the System was Damaged, it is no longer Damaged. If it was Disabled, it becomes Damaged instead. A System’s backups may only be activated once per adventure, so subsequent damage will have the normal effect.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Rugged Design",
                "The ship is designed with the frontier in mind, with a durable construction and easy access to critical systems that allow repairs to be made easily. Reduce the Difficulty of all Tasks to repair the ship by 1, to a minimum of 1.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Saucer Separation",
                "The ship is designed so that the saucer section can be separated from the engineering section, to operate as two distinct ships. Each section has the same Systems, Departments, Talents, and weapons, but their Scale is one lower than the whole ship (recalculate anything derived from Scale), and each section only has half the Power (round down) that the ship had before separation. Further, if the ship has suffered any damage, ongoing effects of that damage apply equally to both sections. The saucer section, which contains the crew quarters and recreational areas, does not have the capacity to go to warp.",
                [new StarshipPrerequisite(), new SpaceframePrerequisite(8)],
                1,
                "Starship"),
            new TalentModel(
                "Secondary Reactors",
                "The ship has additional impulse and fusion reactors, that allow the ship to generate far greater quantities of energy. Increase the ship’s normal Power capacity by 5.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Captain's Yacht",
                "The vessel has a single additional support craft, normally mounted in a dedicated port under the saucer section of the ship. These craft, larger than most shuttles, are often used for diplomatic missions and special excursions by the commanding officer, and are often known as the Captain’s Yacht (though not always; some Intrepid-class vessels have a similar craft called an aeroshuttle). The ship has one additional Small Craft, which does not count against the number which may be active at any one time.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Dedicated Personnel (Command)",
                "The ship gains two additional Crew Support, which may only be used to establish Supporting Characters who are part of the Command department.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Dedicated Personnel (Conn)",
                "The ship gains two additional Crew Support, which may only be used to establish Supporting Characters who are part of the Conn department.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Dedicated Personnel (Security)",
                "The ship gains two additional Crew Support, which may only be used to establish Supporting Characters who are part of the Security department.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Dedicated Personnel (Engineering)",
                "The ship gains two additional Crew Support, which may only be used to establish Supporting Characters who are part of the Engineering department.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Dedicated Personnel (Science)",
                "The ship gains two additional Crew Support, which may only be used to establish Supporting Characters who are part of the Science department.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Dedicated Personnel (Medicine)",
                "The ship gains two additional Crew Support, which may only be used to establish Supporting Characters who are part of the Medicine department.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "High-Power Tractor Beam",
                "The ship’s tractor beam systems channel far greater quantities of power and exert much more force on the target. The ship’s tractor beam has a strength two higher than normal. Further, the ship may spend Power whenever a target attempts to escape the tractor beam to increase its strength for that attempt; the strength increases by 1 for every two Power spent.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Independent Phaser Supply",
                "The ship’s phasers use an independent power supply, rather than drawing directly from the ship’s other power sources. Attacking with the ship’s phasers no longer has a Power Requirement. However, the ship may not spend additional Power to boost the effectiveness of an attack with the phasers.",
                [new StarshipPrerequisite()],
                1,
                "Starship"),
            new TalentModel(
                "Polarized Hull Plating",
                "The ship does not have deflector shielding, but rather is equipped with layers of hull plating that can be polarized to resist attack. This functions in the same way as Shields do, with one difference: the ship suffers a Breach if four or more damage is suffered after deductions for Resistance.",
                [new StarshipPrerequisite(), new MaxServiceYearPrerequisite(2199)],
                1,
                "Starship"),
            new TalentModel(
                "Grappler Cables",
                "This precursor to tractor beams uses sturdy cables and magnetic grapplers to grab on to objects and ships. This functions as a tractor beam, but if the target breaks free, roll 1[CD] — on an Effect, the cables have been Damaged and cannot be used again until repaired.",
                [new StarshipPrerequisite(), new MaxServiceYearPrerequisite(2199)],
                1,
                "Starship"),
            new TalentModel(
                "Photonic Torpedoes",
                "The vessel is equipped with photonic torpedoes instead of spatial torpedoes.",
                [new StarshipPrerequisite(), new MaxServiceYearPrerequisite(2199)],
                1,
                "Starship"),
            new TalentModel(
                "Nuclear Warheads",
                "The vessel is equipped with nuclear warheads in addition to its spatial torpedoes.",
                [new StarshipPrerequisite(), new MaxServiceYearPrerequisite(2199), new SpaceframesPrerequisite([5,17])],
                1,
                "Starship"),
        ],
    };

    getTalents() {
        return this._talents;
    }

    getTalent(name: string) {
        var talent: TalentModel = null;

        for (var i = 0; i < this._talents[Skill.None].length; i++) {
            var t = this._talents[Skill.None][i];
            if (t.name === name) {
                talent = t;
                break;
            }
        }

        if (talent === null) {
            var found = false;
            for (var tal in this._talents) {
                if (found) {
                    break;
                }

                for (var i = 0; i < this._talents[tal].length; i++) {
                    var t = this._talents[tal][i];
                    if (t.name === name) {
                        talent = t;
                        break;
                    }
                }
            }
        }

        if (talent === null) {
            console.log("Failed to find talent " + name);
        }

        return talent;
    }

    getTalentsForSkills(skills: Skill[]) {
        var talents: TalentViewModel[] = [];

        skills.forEach((s, i) => {
            for (var i = 0; i < this._talents[s].length; i++) {
                var include = true;
                var talent = this._talents[s][i];

                talent.prerequisites.forEach((p, i) => {
                    if (!p.isPrerequisiteFulfilled()) {
                        include = false;
                    }
                });

                if (include) {
                    if (talent.maxRank > 1) {
                        if (character.hasTalent(talent.name) && character.talents[talent.name].rank === talent.maxRank) {
                            include = false;
                        }
                    }
                    else {
                        if (character.hasTalent(talent.name)) {
                            include = false;
                        }
                    }

                    if (include) {
                        var rank = character.hasTalent(talent.name)
                            ? character.talents[talent.name].rank + 1
                            : 1;
                        var name = talent.name;
                        if (character.type == CharacterType.KlingonWarrior) {
                            name = talent.nameForSource(Source.KlingonCore);
                        }
                        talents.push(new TalentViewModel(name, rank, talent.maxRank > 1, talent.description, s, talent.category));
                    }
                }
            }
        });

        talents.sort((a, b) => a.name.localeCompare(b.name));

        return talents;
    }

    getStarshipTalents() {
        var talents: TalentViewModel[] = [];

        for (var i = 0; i < this._talents[Skill.None].length; i++) {
            var talent = this._talents[Skill.None][i];
            var include = talent.category === "Starship";

            talent.prerequisites.forEach((p, i) => {
                if (!p.isPrerequisiteFulfilled()) {
                    include = false;
                }
            });

            if (include) {
                if (talent.maxRank > 1) {
                    if (character.hasTalent(talent.name) && character.talents[talent.name].rank === talent.maxRank) {
                        include = false;
                    }
                }
                else {
                    if (character.hasTalent(talent.name)) {
                        include = false;
                    }
                }

                if (include) {
                    var rank = character.hasTalent(talent.name)
                        ? character.talents[talent.name].rank + 1
                        : 1;

                    talents.push(
                        new TalentViewModel(
                            talent.name,
                            rank,
                            talent.maxRank > 1,
                            talent.description,
                            Skill.None,
                            ""));
                }
            }
        }

        talents.sort((a, b) => a.name.localeCompare(b.name));

        return talents;
    }

    getSkillForTalent(talent: string) {
        var n = 0;
        for (var skill in this._talents) {
            for (var i = 0; i < this._talents[skill].length; i++) {
                var t = this._talents[skill][i];
                if (t.name === talent) {
                    return n;
                }
            }

            n++;
        }

        return n;
    }

    getSourceForTalent(name: string) {
        const talent = this.getTalent(name);
        return this.getSourceForTalentModel(talent);
    }

    getSourceForTalentModel(talent: TalentModel) {

        let src = [ Source.Core ];

        if (talent.prerequisites.some(p => p instanceof SourcePrerequisite)) {
            src = (talent.prerequisites.filter(p => p instanceof SourcePrerequisite)[0] as SourcePrerequisite).getSources();
        }

        return src;
    }

    applyTalent(talent: string) {
    }
}

export const TalentsHelper = new Talents();
