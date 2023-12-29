import {TalentsHelper, ADVANCED_TEAM_DYNAMICS, TalentModel} from './talents';
import {Character, character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Career } from './careerEnum';
import i18next from 'i18next';
import { makeKey } from '../common/translationKey';
import { Stereotype } from '../common/construct';


export class CareerModel {
    readonly id: Career;
    private key: string;
    private name: string;
    readonly talent?: TalentModel;

    constructor(id: Career, key: string, name: string, talent?: TalentModel) {
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
            TalentsHelper.getTalent("Untapped Potential")
        ),
        new CareerModel(
            Career.Experienced,
            "core",
            "Experienced Officer"
        ),
        new CareerModel(
            Career.Veteran,
            "core",
            "Veteran Officer",
            TalentsHelper.getTalent("Veteran")
        ),
    ];

    private _civilianCareers: CareerModel[] = [
        new CareerModel(
            Career.Young,
            "civilian",
            "Young",
            TalentsHelper.getTalent("Untapped Potential")
        ),
        new CareerModel(
            Career.Experienced,
            "civilian",
            "Experienced"
        ),
        new CareerModel(
            Career.Veteran,
            "civilian",
            "Veteran",
            TalentsHelper.getTalent("Veteran")
        ),
    ];

    private _klingonCareers: CareerModel[] = [
        new CareerModel(
            Career.Young,
            "klingon",
            "Young Warrior",
            TalentsHelper.getTalent("Untapped Potential")
        ),
        new CareerModel(
            Career.Experienced,
            "klingon",
            "Experienced Warrior"
        ),
        new CareerModel(
            Career.Veteran,
            "klingon",
            "Veteran Warrior",
            TalentsHelper.getTalent("Veteran")
        ),
    ];

    private _soloCareerLengths: CareerModel[] = [
        new CareerModel(
            Career.Young,
            "solo",
            "Novice",
            TalentsHelper.getTalent("Untapped Potential")
        ),
        new CareerModel(
            Career.Experienced,
            "solo",
            "Experienced"
        ),
        new CareerModel(
            Career.Veteran,
            "solo",
            "Veteran",
            TalentsHelper.getTalent("Veteran")
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

    private getList(type: CharacterType) {
        let list = this.getBaseList(type);
        return list.filter(c => c.id !== Career.Young || !character.hasTalent(ADVANCED_TEAM_DYNAMICS));
    }

    getCareers(character: Character) {
        if (character.stereotype === Stereotype.SoloCharacter) {
            return this.getSoloCareerLengths();
        } else {
            let careers: CareerModel[] = [];
            let list = this.getList(character.type);
            for (let career of list) {
                careers.push(career);
            }

            return careers;
        }
    }

    getSoloCareerLength(careerLength: Career) {
        let result = this._soloCareerLengths.filter(c => c.id === careerLength);
        return result ? result[0] : undefined;
    }

    getSoloCareerLengths() {
        return this._soloCareerLengths;
    }

    getCareer(career: Career, c: Character = character) {
        if (character.stereotype === Stereotype.SoloCharacter) {
            return this.getSoloCareerLength(career);
        } else {
            const list = this.getBaseList(c.type);
            return list[career];
        }
    }

    getCareerByTypeName(typeName: string, type: CharacterType) {
        const list = this.getBaseList(type);
        const filtered = list.filter(c => Career[c.id] === typeName);
        return filtered.length === 0 ? undefined : filtered[0];
    }
}
