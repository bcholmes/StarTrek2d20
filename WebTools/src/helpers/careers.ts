import {TalentViewModel, TalentsHelper, ToViewModel, ADVANCED_TEAM_DYNAMICS} from './talents';
import {character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Career } from './careerEnum';
import i18next from 'i18next';
import { makeKey } from '../common/translationKey';


export class CareerModel {
    id: Career;
    key: string;
    name: string;
    private description: string;
    talent: TalentViewModel[];

    constructor(id: Career, key: string, name: string, description: string, talent: TalentViewModel[], valueDescription: string) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.description = description;
        this.talent = talent;
    }

    get localizedName() {
        return i18next.t(makeKey('CareerType.' + this.key + ".", Career[this.id], ".name"));
    }

    get localizedDescription() {
        return i18next.t(makeKey('CareerType.' + this.key + ".", Career[this.id], ".description"));
    }

    get localizedValueDescription() {
        return i18next.t(makeKey('CareerType.' + this.key + ".", Career[this.id], ".valueInstruction"));
    }
}

export class CareersHelper {
    private static _instance: CareersHelper;

    static get instance() {
        if (CareersHelper._instance == null) {
            CareersHelper._instance = new CareersHelper();
        }
        return CareersHelper._instance;
    }

    private _careers: CareerModel[] = [
        new CareerModel(
            Career.Young,
            "core",
            "Young Officer",
            "The character is defined by their potential more than their skill. Their raw talent and their expectations of what the universe is like have not yet been tempered by reality.",
            [ToViewModel(TalentsHelper.getTalent("Untapped Potential"))],
            "The character receives a Value, which must reflect the character’s inexperience and naïveté in some way."
        ),
        new CareerModel(
            Career.Experienced,
            "core",
            "Experienced Officer",
            "The character has several years of experience in service of Starfleet, and is enjoying a promising career.",
            [],
            "The character receives a Value, and this can be chosen freely."
        ),
        new CareerModel(
            Career.Veteran,
            "core",
            "Veteran Officer",
            "The character has decades of experience in the service of Starfleet, and has served on many ships, and starbases. The character’s judgement and opinions are highly-regarded by subordinates, peers, and even superiors.",
            [ToViewModel(TalentsHelper.getTalent("Veteran"))],
            "The character receives a Value, which must reflect the character’s years of experience and the beliefs they’ve formed over their long career."
        ),
    ];

    private _civilianCareers: CareerModel[] = [
        new CareerModel(
            Career.Young,
            "civilian",
            "Young",
            "The character is defined by their potential more than their skill. Their raw talent and their expectations of what the universe is like have not yet been tempered by reality.",
            [ToViewModel(TalentsHelper.getTalent("Untapped Potential"))],
            "The character receives a Value, which must reflect the character’s inexperience and naïveté in some way."
        ),
        new CareerModel(
            Career.Experienced,
            "civilian",
            "Experienced",
            "The character has several years of experience in service, and is enjoying a promising career.",
            [],
            "The character receives a Value, and this can be chosen freely."
        ),
        new CareerModel(
            Career.Veteran,
            "civilian",
            "Veteran",
            "The character has decades of experience in the service, and has served on many ships, worlds, and/or starbases. The character’s judgement and opinions are highly-regarded by subordinates, peers, and even superiors.",
            [ToViewModel(TalentsHelper.getTalent("Veteran"))],
            "The character receives a Value, which must reflect the character’s years of experience and the beliefs they’ve formed over their long career."
        ),
    ];

    private _klingonCareers: CareerModel[] = [
        new CareerModel(
            Career.Young,
            "klingon",
            "Young Warrior",
            "The character is defined by their potential more than their skill. Their raw talent and their expectations of what the universe is like have not yet been tempered by reality.",
            [ToViewModel(TalentsHelper.getTalent("Untapped Potential"))],
            "The character receives a Value, which must reflect the character’s inexperience and naïveté in some way."
        ),
        new CareerModel(
            Career.Experienced,
            "klingon",
            "Experienced Warrior",
            "The character has several years of experience in service of the Empire and is enjoying a promising career. This is the default assumption for characters created using these rules.",
            [],
            "The character receives a Value, and this can be chosen freely."
        ),
        new CareerModel(
            Career.Veteran,
            "klingon",
            "Veteran Warrior",
            "The character has decades of experience in the service of the Empire, and has served on many ships and space stations. The character’s judgement and opinions are highly regarded by subordinates, peers, and even superiors.",
            [ToViewModel(TalentsHelper.getTalent("Veteran"))],
            "The character receives a Value, which must reflect the character’s years of experience and the beliefs they’ve formed over their long career."
        ),
    ];

    private getBaseList(type: CharacterType) {
        if (type === CharacterType.KlingonWarrior) {
            return this._klingonCareers;
        } else if (type === CharacterType.Starfleet) {
            return this._careers;
        } else {
            return this._civilianCareers; // also allied military
        }
    }

    private getList() {
        let list = this.getBaseList(character.type);
        return list.filter(c => c.id !== Career.Young || !character.hasTalent(ADVANCED_TEAM_DYNAMICS));
    }

    getCareers() {
        let careers: CareerModel[] = [];
        let list = this.getList();
        for (let career of list) {
            careers.push(career);
        }

        return careers;
    }

    getCareer(career: Career) {
        var list = this.getBaseList(character.type);
        return list[career];
    }

    getCareerByTypeName(typeName: string, type: CharacterType) {
        const list = this.getBaseList(type);
        const filtered = list.filter(c => Career[c.id] === typeName);
        return filtered.length === 0 ? undefined : filtered[0];
    }

    generateCareer(): Career {
        let list = this.getList();
        var roll = Math.floor(Math.random() * list.length);
        return list[roll].id;
    }

    applyCareer(career: Career) {
    }
}
