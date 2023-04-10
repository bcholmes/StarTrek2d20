import {TalentViewModel, TalentsHelper, ToViewModel, ADVANCED_TEAM_DYNAMICS} from './talents';
import {Character, character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Career } from './careerEnum';
import i18next from 'i18next';
import { makeKey } from '../common/translationKey';


export class CareerModel {
    readonly id: Career;
    private key: string;
    private name: string;
    readonly talent: TalentViewModel[];

    constructor(id: Career, key: string, name: string, talent: TalentViewModel[]) {
        this.id = id;
        this.key = key;
        this.name = name;
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
            [ToViewModel(TalentsHelper.getTalent("Untapped Potential"))]
        ),
        new CareerModel(
            Career.Experienced,
            "core",
            "Experienced Officer",
            []
        ),
        new CareerModel(
            Career.Veteran,
            "core",
            "Veteran Officer",
            [ToViewModel(TalentsHelper.getTalent("Veteran"))]
        ),
    ];

    private _civilianCareers: CareerModel[] = [
        new CareerModel(
            Career.Young,
            "civilian",
            "Young",
            [ToViewModel(TalentsHelper.getTalent("Untapped Potential"))]
        ),
        new CareerModel(
            Career.Experienced,
            "civilian",
            "Experienced",
            []
        ),
        new CareerModel(
            Career.Veteran,
            "civilian",
            "Veteran",
            [ToViewModel(TalentsHelper.getTalent("Veteran"))]
        ),
    ];

    private _klingonCareers: CareerModel[] = [
        new CareerModel(
            Career.Young,
            "klingon",
            "Young Warrior",
            [ToViewModel(TalentsHelper.getTalent("Untapped Potential"))]
        ),
        new CareerModel(
            Career.Experienced,
            "klingon",
            "Experienced Warrior",
            []
        ),
        new CareerModel(
            Career.Veteran,
            "klingon",
            "Veteran Warrior",
            [ToViewModel(TalentsHelper.getTalent("Veteran"))]
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

    getCareer(career: Career, c: Character = character) {
        var list = this.getBaseList(c.type);
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
