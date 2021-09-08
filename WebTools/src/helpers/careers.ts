import {SkillsHelper, Skill} from './skills';
import {TalentViewModel, TalentsHelper, ToViewModel} from './talents';
import {character, CharacterType} from '../common/character';

export enum Career {
    // Core
    Young,
    Experienced,
    Veteran
}

class CareerModel {
    name: string;
    description: string;
    talent: TalentViewModel[];
    valueDescription: string;

    constructor(name: string, description: string, talent: TalentViewModel[], valueDescription: string) {
        this.name = name;
        this.description = description;
        this.talent = talent;
        this.valueDescription = valueDescription;
    }
}

export class CareerViewModel extends CareerModel {
    id: Career;

    constructor(id: Career, base: CareerModel) {
        super(base.name, base.description, base.talent, base.valueDescription);
        this.id = id;
    }
}

class Careers {
    private _careers: { [id: number]: CareerModel } = {
        [Career.Young]: new CareerModel(
            "Young Officer",
            "The character is defined by their potential more than their skill. Their raw talent and their expectations of what the universe is like have not yet been tempered by reality.",
            [ToViewModel(TalentsHelper.getTalent("Untapped Potential"))],
            "The character receives a Value, which must reflect the character’s inexperience and naïveté in some way."
        ),
        [Career.Experienced]: new CareerModel(
            "Experienced Officer",
            "The character has several years of experience in service of Starfleet, and is enjoying a promising career.",
            TalentsHelper.getTalentsForSkills(SkillsHelper.getSkills()),
            "The character receives a Value, and this can be chosen freely."
        ),
        [Career.Veteran]: new CareerModel(
            "Veteran Officer",
            "The character has decades of experience in the service of Starfleet, and has served on many ships, and starbases. The character’s judgement and opinions are highly-regarded by subordinates, peers, and even superiors.",
            [ToViewModel(TalentsHelper.getTalent("Veteran"))],
            "The character receives a Value, which must reflect the character’s years of experience and the beliefs they’ve formed over their long career."
        ),
    };

    private _klingonCareers: { [id: number]: CareerModel } = {
        [Career.Young]: new CareerModel(
            "Young Warrior",
            "The character is defined by their potential more than their skill. Their raw talent and their expectations of what the universe is like have not yet been tempered by reality.",
            [ToViewModel(TalentsHelper.getTalent("Untapped Potential"))],
            "The character receives a Value, which must reflect the character’s inexperience and naïveté in some way."
        ),
        [Career.Experienced]: new CareerModel(
            "Experienced Warrior",
            "The character has several years of experience in service of the Empire and is enjoying a promising career. This is the default assumption for characters created using these rules.",
            TalentsHelper.getTalentsForSkills(SkillsHelper.getSkills()),
            "The character receives a Value, and this can be chosen freely."
        ),
        [Career.Veteran]: new CareerModel(
            "Veteran Officer",
            "The character has decades of experience in the service of the Empire, and has served on many ships and space stations. The character’s judgement and opinions are highly regarded by subordinates, peers, and even superiors.",
            [ToViewModel(TalentsHelper.getTalent("Veteran"))],
            "The character receives a Value, which must reflect the character’s years of experience and the beliefs they’ve formed over their long career."
        ),
    };

    getCareers() {
        var careers: CareerViewModel[] = [];
        var n = 0;
        var list = character.type === CharacterType.KlingonWarrior ? this._klingonCareers : this._careers;
        for (var career in list) {
            var c = list[career];
            careers.push(new CareerViewModel(n, c));
            n++;
        }

        return careers;
    }

    getCareer(career: Career) {
        var list = character.type === CharacterType.KlingonWarrior ? this._klingonCareers : this._careers;
        return list[career];
    }

    generateCareer(): Career {
        var roll = Math.floor(Math.random() * 3);
        return roll;
    }

    applyCareer(career: Career) {
    }
}

export const CareersHelper = new Careers();
